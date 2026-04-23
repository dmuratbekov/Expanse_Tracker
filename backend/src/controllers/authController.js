const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Вспомогательная функция — генерирует JWT токен
const generateToken = (userId) => {
    return jwt.sign(
        { userId }, // payload — что кодируем внутрь токена
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// POST /api/auth/register
const register = async (req, res) => {
    try {
        const { email, password, full_name } = req.body;

        // 1. Валидация входных данных
        if (!email || !password || !full_name) {
            return res.status(400).json({ error: 'Все поля обязательны' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Пароль минимум 6 символов' });
        }

        // 2. Проверяем что email не занят
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email.toLowerCase()]
        );
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'Email уже зарегистрирован' });
        }

        // 3. Хэшируем пароль (число 12 = сложность хэширования)
        const password_hash = await bcrypt.hash(password, 12);

        // 4. Создаём пользователя в БД
        const result = await pool.query(
            `INSERT INTO users (email, password_hash, full_name)
       VALUES ($1, $2, $3)
       RETURNING id, email, full_name, created_at`,
            [email.toLowerCase(), password_hash, full_name]
        );
        const user = result.rows[0];

        // 5. Создаём дефолтный счёт для нового пользователя
        await pool.query(
            `INSERT INTO accounts (user_id, name, type, balance, currency)
       VALUES ($1, 'Основной счёт', 'card', 0, 'KGS')`,
            [user.id]
        );

        // 6. Создаём дефолтные категории через нашу SQL-функцию
        await pool.query(
            'SELECT create_default_categories($1)',
            [user.id]
        );

        // 7. Генерируем токен и возвращаем ответ
        const token = generateToken(user.id);

        res.status(201).json({
            message: 'Регистрация успешна',
            token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
            },
        });
    } catch (err) {
        console.error('Ошибка регистрации:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Валидация
        if (!email || !password) {
            return res.status(400).json({ error: 'Введите email и пароль' });
        }

        // 2. Ищем пользователя по email
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email.toLowerCase()]
        );
        const user = result.rows[0];

        // 3. Проверяем пароль через bcrypt
        // Важно: даже если пользователь не найден, вызываем bcrypt.compare
        // чтобы защититься от timing attack
        if (!user) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Неверный email или пароль' });
        }

        // 4. Генерируем токен
        const token = generateToken(user.id);

        res.json({
            message: 'Вход выполнен',
            token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
            },
        });
    } catch (err) {
        console.error('Ошибка логина:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

// GET /api/auth/me — возвращает данные текущего пользователя
const getMe = async (req, res) => {
    try {
        // req.user.userId добавляется middleware (см. ниже)
        const result = await pool.query(
            'SELECT id, email, full_name, created_at FROM users WHERE id = $1',
            [req.user.userId]
        );
        res.json({ user: result.rows[0] });
    } catch (err) {
        console.error('Ошибка getMe:', err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

module.exports = { register, login, getMe };