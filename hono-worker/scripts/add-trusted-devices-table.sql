-- ===================================
-- trusted_devices テーブル追加マイグレーション
-- 端末記憶（30日間2FAスキップ）用テーブル
-- ===================================

CREATE TABLE IF NOT EXISTS trusted_devices (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  last_used_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE trusted_devices ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMP DEFAULT NOW();

CREATE INDEX IF NOT EXISTS idx_trusted_devices_token_hash ON trusted_devices(device_token_hash);
CREATE INDEX IF NOT EXISTS idx_trusted_devices_user_id ON trusted_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_trusted_devices_expires_at ON trusted_devices(expires_at);
