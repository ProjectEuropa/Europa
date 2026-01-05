-- E2E Test Seed Data
-- This file is used to seed the database for E2E tests

-- Clean up existing test data (if any)
DELETE FROM file_tags WHERE file_id IN (SELECT id FROM files WHERE upload_owner_name LIKE 'E2E%');
DELETE FROM files WHERE upload_owner_name LIKE 'E2E%';
DELETE FROM events WHERE event_name LIKE 'E2E%';
DELETE FROM users WHERE email LIKE 'e2e%@test.com';

-- E2E Test User (password: "password123")
-- bcrypt hash generated with cost 10
INSERT INTO users (name, email, password, created_at, updated_at) VALUES
('E2E Test User', 'e2e@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.mOf7vYoHAjjS7FzOFy', NOW(), NOW()),
('E2E Admin User', 'e2e-admin@test.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.mOf7vYoHAjjS7FzOFy', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- E2E Test Events
INSERT INTO events (
    register_user_id,
    event_name,
    event_details,
    event_reference_url,
    event_type,
    event_closing_day,
    event_displaying_day,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM users WHERE email = 'e2e@test.com'),
    'E2E Test Tournament',
    'This is a test tournament for E2E testing',
    'https://example.com/tournament',
    '1',
    NOW() + INTERVAL '30 days',
    NOW(),
    NOW(),
    NOW()
), (
    (SELECT id FROM users WHERE email = 'e2e-admin@test.com'),
    'E2E Test Event',
    'This is a general test event for E2E testing',
    'https://example.com/event',
    '2',
    NOW() + INTERVAL '14 days',
    NOW(),
    NOW(),
    NOW()
);

-- E2E Test Tags
INSERT INTO tags (tag_name, created_at) VALUES
('e2e-test', NOW()),
('automation', NOW()),
('playwright', NOW())
ON CONFLICT (tag_name) DO NOTHING;

-- E2E Test Files (Team type)
INSERT INTO files (
    upload_user_id,
    upload_owner_name,
    file_name,
    file_path,
    file_size,
    file_comment,
    data_type,
    delete_password,
    downloadable_at,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM users WHERE email = 'e2e@test.com'),
    'E2E Test User',
    'e2e-team-file-1.oke',
    'e2e/team/e2e-team-file-1.oke',
    1024,
    'E2E test team file 1',
    '1',
    NULL,
    NOW(),
    NOW(),
    NOW()
), (
    (SELECT id FROM users WHERE email = 'e2e@test.com'),
    'E2E Test User',
    'e2e-team-file-2.oke',
    'e2e/team/e2e-team-file-2.oke',
    2048,
    'E2E test team file 2',
    '1',
    NULL,
    NOW(),
    NOW(),
    NOW()
), (
    NULL,
    'E2E Anonymous',
    'e2e-anonymous-file.oke',
    'e2e/team/e2e-anonymous-file.oke',
    512,
    'E2E anonymous upload test',
    '1',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.mOf7vYoHAjjS7FzOFy',
    NOW(),
    NOW(),
    NOW()
);

-- E2E Test Files (Match type)
INSERT INTO files (
    upload_user_id,
    upload_owner_name,
    file_name,
    file_path,
    file_size,
    file_comment,
    data_type,
    delete_password,
    downloadable_at,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM users WHERE email = 'e2e-admin@test.com'),
    'E2E Admin User',
    'e2e-match-file-1.rec',
    'e2e/match/e2e-match-file-1.rec',
    4096,
    'E2E test match file 1',
    '2',
    NULL,
    NOW(),
    NOW(),
    NOW()
);

-- Link files with tags
INSERT INTO file_tags (file_id, tag_id, created_at)
SELECT f.id, t.id, NOW()
FROM files f, tags t
WHERE f.file_name LIKE 'e2e-%' AND t.tag_name = 'e2e-test'
ON CONFLICT DO NOTHING;

INSERT INTO file_tags (file_id, tag_id, created_at)
SELECT f.id, t.id, NOW()
FROM files f, tags t
WHERE f.file_name LIKE 'e2e-%' AND t.tag_name = 'automation'
ON CONFLICT DO NOTHING;
