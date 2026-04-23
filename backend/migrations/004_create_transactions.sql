CREATE TABLE IF NOT EXISTS transactions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id       UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  category_id      UUID REFERENCES categories(id) ON DELETE SET NULL,
  amount           DECIMAL(12, 2) NOT NULL,
  type             VARCHAR(10) NOT NULL,
  description      TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT chk_transaction_type CHECK (type IN ('income', 'expense')),
  CONSTRAINT chk_amount CHECK (amount > 0)
);

CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);