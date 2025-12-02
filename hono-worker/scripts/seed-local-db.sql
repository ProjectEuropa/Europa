-- テスト用ユーザー
INSERT INTO users (name, email, password, created_at, updated_at) VALUES
('Migration Test User', 'migration@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- テスト用イベント
INSERT INTO events (
    event_name,
    event_details,
    event_type,
    event_closing_day,
    event_displaying_day,
    created_at,
    updated_at
) VALUES (
    'Migration Test Event',
    'Details...',
    '1',
    NOW() + INTERVAL '7 days',
    NOW(),
    NOW(),
    NOW()
);

-- テスト用ファイル
INSERT INTO files (
    upload_user_id,
    upload_owner_name,
    file_name,
    file_data,
    file_comment,
    upload_type,
    data_type,
    delete_password,
    search_tag1,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM users WHERE email = 'migration@example.com'),
    'Migration User',
    'test-migration.txt',
    decode('48656c6c6f20576f726c6421', 'hex'), -- "Hello World!"
    'Migration Test File',
    '1',
    '1',
    'password',
    'test',
    NOW(),
    NOW()
);
