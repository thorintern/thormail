CREATE TABLE IF NOT EXISTS message_cache (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS message_cache_key_idx ON message_cache (key);
CREATE INDEX IF NOT EXISTS message_cache_expires_idx ON message_cache (expires_at);
