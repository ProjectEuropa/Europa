-- users テーブル
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- events テーブル
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  event_title VARCHAR(255) NOT NULL,
  event_closing_day TIMESTAMP,
  event_displaying_day TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- files テーブル（メタデータのみ、バイナリはR2）
CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  upload_user_id INTEGER REFERENCES users(id),
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255),  -- R2オブジェクトキー
  file_size BIGINT,
  file_comment TEXT,
  search_tag1 VARCHAR(255),
  search_tag2 VARCHAR(255),
  search_tag3 VARCHAR(255),
  search_tag4 VARCHAR(255),
  downloadable_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- password_resets テーブル
CREATE TABLE password_resets (
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- インデックス作成（パフォーマンス最適化）
CREATE INDEX idx_files_upload_user_id ON files(upload_user_id);
CREATE INDEX idx_files_downloadable_at ON files(downloadable_at);
CREATE INDEX idx_events_displaying_day ON events(event_displaying_day);
CREATE INDEX idx_password_resets_email ON password_resets(email);
CREATE INDEX idx_password_resets_token ON password_resets(token);
