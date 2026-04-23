const pool = require('../config/db');

// GET /api/accounts
const getAccounts = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, type, balance, currency, created_at
       FROM accounts
       WHERE user_id = $1
       ORDER BY created_at ASC`,
            [req.user.userId]
        );
        res.json({ accounts: result.rows });
    } catch (err) {
        console.error('Ошибка getAccounts:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// POST /api/accounts
const createAccount = async (req, res) => {
    try {
        const { name, type, balance, currency } = req.body;

        if (!name || !type) {
            return res.status(400).json({ error: 'Название и тип обязательны' });
        }

        const result = await pool.query(
            `INSERT INTO accounts (user_id, name, type, balance, currency)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [req.user.userId, name, type, balance || 0, currency || 'KGS']
        );

        res.status(201).json({ account: result.rows[0] });
    } catch (err) {
        if (err.code === '23514') {
            return res.status(400).json({ error: 'Недопустимый тип счёта' });
        }
        console.error('Ошибка createAccount:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// PUT /api/accounts/:id
const updateAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, currency } = req.body;

        const result = await pool.query(
            `UPDATE accounts
       SET name = COALESCE($1, name),
           type = COALESCE($2, type),
           currency = COALESCE($3, currency)
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
            [name, type, currency, id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Счёт не найден' });
        }

        res.json({ account: result.rows[0] });
    } catch (err) {
        console.error('Ошибка updateAccount:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// DELETE /api/accounts/:id
const deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM accounts
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
            [id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Счёт не найден' });
        }

        res.json({ message: 'Счёт удалён' });
    } catch (err) {
        console.error('Ошибка deleteAccount:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

module.exports = { getAccounts, createAccount, updateAccount, deleteAccount };