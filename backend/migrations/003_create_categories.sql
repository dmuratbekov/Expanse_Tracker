CREATE TABLE IF NOT EXISTS categories (
  id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name    VARCHAR(255) NOT NULL,
  type    VARCHAR(10) NOT NULL,
  color   VARCHAR(7) NOT NULL DEFAULT '#6366f1',
  icon    VARCHAR(50) NOT NULL DEFAULT 'tag',

  CONSTRAINT chk_category_type CHECK (type IN ('income', 'expense')),
  CONSTRAINT uq_category_name UNIQUE (user_id, name, type)
);

CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);