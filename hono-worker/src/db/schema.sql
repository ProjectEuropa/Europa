-- users テーブル
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  remember_token VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- events テーブル
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  register_user_id INTEGER REFERENCES users(id),
  event_name VARCHAR(255) NOT NULL,
  event_details TEXT NOT NULL,
  event_reference_url VARCHAR(255),
  event_type VARCHAR(255) NOT NULL,  -- 大会:1 告知:2
  event_closing_day TIMESTAMP NOT NULL,
  event_displaying_day TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- files テーブル（メタデータのみ、バイナリはR2）
CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  upload_user_id INTEGER REFERENCES users(id),
  upload_owner_name VARCHAR(255) DEFAULT 'Anonymous',  -- アップロード者名（匿名対応）
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255),  -- R2オブジェクトキー
  file_size BIGINT,
  file_comment TEXT,
  data_type VARCHAR(10) DEFAULT '1',  -- チーム:1 or マッチ:2
  delete_password VARCHAR(255) NULL,  -- 匿名ユーザー用削除パスワード（ハッシュ化）
  downloadable_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- tags テーブル（正規化）
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  tag_name VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- file_tags 中間テーブル（多対多）
CREATE TABLE file_tags (
  file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (file_id, tag_id)
);

-- password_resets テーブル
CREATE TABLE password_resets (
  email VARCHAR(255) PRIMARY KEY,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- インデックス作成（パフォーマンス最適化）
CREATE INDEX idx_files_upload_user_id ON files(upload_user_id);
CREATE INDEX idx_files_downloadable_at ON files(downloadable_at);
CREATE INDEX idx_events_displaying_day ON events(event_displaying_day);
CREATE INDEX idx_password_resets_token ON password_resets(token);
CREATE INDEX idx_tags_tag_name ON tags(tag_name);
CREATE INDEX idx_file_tags_tag_id ON file_tags(tag_id);
