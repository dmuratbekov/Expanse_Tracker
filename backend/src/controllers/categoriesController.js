const pool = require('../config/db');

// GET /api/categories
const getCategories = async (req, res) => {
    try {
        const { type } = req.query;

        let query = `
      SELECT id, name, type, color, icon
      FROM categories
      WHERE user_id = $1
    `;
        const params = [req.user.userId];

        if (type) {
            query += ` AND type = $2`;
            params.push(type);
        }

        query += ` ORDER BY type, name ASC`;

        const result = await pool.query(query, params);
        res.json({ categories: result.rows });
    } catch (err) {
        console.error('Ошибка getCategories:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// POST /api/categories
const createCategory = async (req, res) => {
    try {
        const { name, type, color, icon } = req.body;

        if (!name || !type) {
            return res.status(400).json({ error: 'Название и тип обязательны' });
        }

        const result = await pool.query(
            `INSERT INTO categories (user_id, name, type, color, icon)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [req.user.userId, name, type, color || '#6366f1', icon || 'tag']
        );

        res.status(201).json({ category: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Категория с таким именем уже существует' });
        }
        console.error('Ошибка createCategory:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// PUT /api/categories/:id
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, color, icon } = req.body;

        const result = await pool.query(
            `UPDATE categories
       SET name  = COALESCE($1, name),
           color = COALESCE($2, color),
           icon  = COALESCE($3, icon)
       WHERE id = $4 AND user_id = $5
       RETURNING *`,
            [name, color, icon, id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Категория не найдена' });
        }

        res.json({ category: result.rows[0] });
    } catch (err) {
        console.error('Ошибка updateCategory:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM categories
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
            [id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Категория не найдена' });
        }

        res.json({ message: 'Категория удалена' });
    } catch (err) {
        console.error('Ошибка deleteCategory:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };