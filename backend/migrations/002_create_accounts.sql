CREATE TABLE IF NOT EXISTS accounts (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name       VARCHAR(255) NOT NULL,
  type       VARCHAR(50) NOT NULL DEFAULT 'cash',
  balance    DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  currency   VARCHAR(10) NOT NULL DEFAULT 'KGS',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT chk_account_type CHECK (type IN ('cash', 'card', 'savings')),
  CONSTRAINT chk_balance CHECK (balance >= -999999999.99)
);

CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);