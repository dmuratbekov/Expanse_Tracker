const pool = require('../config/db');

// GET /api/analytics/summary?from=...to=...
const getSummary = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { from, to } = req.query;

        const startDate = from || new Date(
            new Date().getFullYear(),
            new Date().getMonth(), 1
        ).toISOString().split('T')[0];

        const endDate = to || new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1, 0
        ).toISOString().split('T')[0];

        const result = await pool.query(
            `SELECT
        COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'income'),  0) AS total_income,
        COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'expense'), 0) AS total_expense,
        COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'income'),  0) -
        COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'expense'), 0) AS net_balance,
        COUNT(*) AS transaction_count
       FROM transactions t
       JOIN accounts a ON t.account_id = a.id
       WHERE a.user_id = $1
         AND t.transaction_date BETWEEN $2 AND $3`,
            [userId, startDate, endDate]
        );

        const balanceResult = await pool.query(
            `SELECT COALESCE(SUM(balance), 0) AS total_balance
       FROM accounts WHERE user_id = $1`,
            [userId]
        );

        res.json({
            period: { from: startDate, to: endDate },
            ...result.rows[0],
            total_balance: balanceResult.rows[0].total_balance,
        });
    } catch (err) {
        console.error('Ошибка getSummary:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// GET /api/analytics/by-category?from=...&to=...&type=expense
const getByCategory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { from, to, type = 'expense' } = req.query;

        const startDate = from || new Date(
            new Date().getFullYear(),
            new Date().getMonth(), 1
        ).toISOString().split('T')[0];

        const endDate = to || new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1, 0
        ).toISOString().split('T')[0];

        const result = await pool.query(
            `SELECT
        c.id,
        c.name,
        c.color,
        c.icon,
        SUM(t.amount) AS total,
        -- Процент: сумма категории / общая сумма * 100
        ROUND(
          SUM(t.amount) * 100.0 /
          NULLIF(SUM(SUM(t.amount)) OVER (), 0),
        2) AS percentage
       FROM transactions t
       JOIN accounts a ON t.account_id = a.id
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE a.user_id = $1
         AND t.type = $2
         AND t.transaction_date BETWEEN $3 AND $4
       GROUP BY c.id, c.name, c.color, c.icon
       ORDER BY total DESC`,
            [userId, type, startDate, endDate]
        );

        res.json({ data: result.rows });
    } catch (err) {
        console.error('Ошибка getByCategory:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// GET /api/analytics/by-month?year=...
const getByMonth = async (req, res) => {
    try {
        const userId = req.user.userId;
        const year = req.query.year || new Date().getFullYear();

        const result = await pool.query(
            `SELECT
        TO_CHAR(DATE_TRUNC('month', t.transaction_date), 'YYYY-MM') AS month,
        COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'income'),  0) AS income,
        COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'expense'), 0) AS expense
       FROM transactions t
       JOIN accounts a ON t.account_id = a.id
       WHERE a.user_id = $1
         AND EXTRACT(YEAR FROM t.transaction_date) = $2
       GROUP BY DATE_TRUNC('month', t.transaction_date)
       ORDER BY month ASC`,
            [userId, year]
        );

        const monthsMap = {};
        result.rows.forEach(row => { monthsMap[row.month] = row; });

        const allMonths = Array.from({ length: 12 }, (_, i) => {
            const month = `${year}-${String(i + 1).padStart(2, '0')}`;
            return monthsMap[month] || { month, income: '0', expense: '0' };
        });

        res.json({ year, data: allMonths });
    } catch (err) {
        console.error('Ошибка getByMonth:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

module.exports = { getSummary, getByCategory, getByMonth };