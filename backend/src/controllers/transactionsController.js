const pool = require('../config/db');

// GET /api/transactions
const getTransactions = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            type,
            category_id,
            account_id,
            from,
            to,
            limit = 20,
            offset = 0,
        } = req.query;

        const conditions = ['a.user_id = $1'];
        const params = [userId];
        let paramIndex = 2;

        if (type) {
            conditions.push(`t.type = $${paramIndex++}`);
            params.push(type);
        }
        if (category_id) {
            conditions.push(`t.category_id = $${paramIndex++}`);
            params.push(category_id);
        }
        if (account_id) {
            conditions.push(`t.account_id = $${paramIndex++}`);
            params.push(account_id);
        }
        if (from) {
            conditions.push(`t.transaction_date >= $${paramIndex++}`);
            params.push(from);
        }
        if (to) {
            conditions.push(`t.transaction_date <= $${paramIndex++}`);
            params.push(to);
        }

        const whereClause = conditions.join(' AND ');

        const query = `
      SELECT
        t.id,
        t.amount,
        t.type,
        t.description,
        t.transaction_date,
        t.created_at,
        a.id   AS account_id,
        a.name AS account_name,
        c.id   AS category_id,
        c.name AS category_name,
        c.color AS category_color,
        c.icon  AS category_icon
      FROM transactions t
      JOIN accounts a ON t.account_id = a.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE ${whereClause}
      ORDER BY t.transaction_date DESC, t.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
        params.push(parseInt(limit), parseInt(offset));

        const countQuery = `
      SELECT COUNT(*) 
      FROM transactions t
      JOIN accounts a ON t.account_id = a.id
      WHERE ${whereClause}
    `;
        const countParams = params.slice(0, -2);

        const [result, countResult] = await Promise.all([
            pool.query(query, params),
            pool.query(countQuery, countParams),
        ]);

        res.json({
            transactions: result.rows,
            total: parseInt(countResult.rows[0].count),
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
    } catch (err) {
        console.error('Ошибка getTransactions:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// POST /api/transactions
const createTransaction = async (req, res) => {
    const client = await pool.connect();

    try {
        const { account_id, category_id, amount, type, description, transaction_date } = req.body;

        if (!account_id || !amount || !type) {
            return res.status(400).json({ error: 'Счёт, сумма и тип обязательны' });
        }
        if (amount <= 0) {
            return res.status(400).json({ error: 'Сумма должна быть больше нуля' });
        }

        const accountCheck = await client.query(
            'SELECT id, balance FROM accounts WHERE id = $1 AND user_id = $2',
            [account_id, req.user.userId]
        );
        if (accountCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Счёт не найден' });
        }

        await client.query('BEGIN');

        const result = await client.query(
            `INSERT INTO transactions
        (account_id, category_id, amount, type, description, transaction_date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [
                account_id,
                category_id || null,
                amount,
                type,
                description || null,
                transaction_date || new Date().toISOString().split('T')[0],
            ]
        );
        const transaction = result.rows[0];

        const balanceChange = type === 'income' ? amount : -amount;
        await client.query(
            'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
            [balanceChange, account_id]
        );

        await client.query('COMMIT');

        res.status(201).json({ transaction });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Ошибка createTransaction:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    } finally {
        client.release();
    }
};

// PUT /api/transactions/:id
const updateTransaction = async (req, res) => {
    const client = await pool.connect();

    try {
        const { id } = req.params;
        const { category_id, amount, type, description, transaction_date } = req.body;

        const oldResult = await client.query(
            `SELECT t.*, a.user_id FROM transactions t
       JOIN accounts a ON t.account_id = a.id
       WHERE t.id = $1 AND a.user_id = $2`,
            [id, req.user.userId]
        );

        if (oldResult.rows.length === 0) {
            return res.status(404).json({ error: 'Транзакция не найдена' });
        }

        const old = oldResult.rows[0];

        await client.query('BEGIN');

        const oldBalanceChange = old.type === 'income' ? -old.amount : +old.amount;
        await client.query(
            'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
            [oldBalanceChange, old.account_id]
        );

        const newAmount = amount || old.amount;
        const newType = type || old.type;
        const newBalanceChange = newType === 'income' ? newAmount : -newAmount;
        await client.query(
            'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
            [newBalanceChange, old.account_id]
        );

        const result = await client.query(
            `UPDATE transactions
       SET category_id      = COALESCE($1, category_id),
           amount           = COALESCE($2, amount),
           type             = COALESCE($3, type),
           description      = COALESCE($4, description),
           transaction_date = COALESCE($5, transaction_date)
       WHERE id = $6
       RETURNING *`,
            [category_id, amount, type, description, transaction_date, id]
        );

        await client.query('COMMIT');

        res.json({ transaction: result.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Ошибка updateTransaction:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    } finally {
        client.release();
    }
};

// DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
    const client = await pool.connect();

    try {
        const { id } = req.params;

        const result = await client.query(
            `SELECT t.*, a.user_id FROM transactions t
       JOIN accounts a ON t.account_id = a.id
       WHERE t.id = $1 AND a.user_id = $2`,
            [id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Транзакция не найдена' });
        }

        const transaction = result.rows[0];

        await client.query('BEGIN');

        const balanceChange = transaction.type === 'income'
            ? -transaction.amount
            : +transaction.amount;

        await client.query(
            'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
            [balanceChange, transaction.account_id]
        );

        await client.query(
            'DELETE FROM transactions WHERE id = $1',
            [id]
        );

        await client.query('COMMIT');

        res.json({ message: 'Транзакция удалена' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Ошибка deleteTransaction:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    } finally {
        client.release();
    }
};

module.exports = {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
};