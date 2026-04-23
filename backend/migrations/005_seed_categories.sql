CREATE OR REPLACE FUNCTION create_default_categories(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO categories (user_id, name, type, color, icon) VALUES
    -- Расходы
    (p_user_id, 'Продукты',      'expense', '#ef4444', 'shopping-cart'),
    (p_user_id, 'Транспорт',     'expense', '#f97316', 'car'),
    (p_user_id, 'Рестораны',     'expense', '#eab308', 'utensils'),
    (p_user_id, 'Развлечения',   'expense', '#a855f7', 'gamepad'),
    (p_user_id, 'Здоровье',      'expense', '#ec4899', 'heart'),
    (p_user_id, 'Коммунальные',  'expense', '#14b8a6', 'home'),
    (p_user_id, 'Одежда',        'expense', '#8b5cf6', 'shirt'),
    (p_user_id, 'Образование',   'expense', '#06b6d4', 'book'),
    -- Доходы
    (p_user_id, 'Зарплата',      'income',  '#22c55e', 'briefcase'),
    (p_user_id, 'Фриланс',       'income',  '#10b981', 'laptop'),
    (p_user_id, 'Подарки',       'income',  '#84cc16', 'gift'),
    (p_user_id, 'Инвестиции',    'income',  '#3b82f6', 'trending-up');
END;
$$ LANGUAGE plpgsql;