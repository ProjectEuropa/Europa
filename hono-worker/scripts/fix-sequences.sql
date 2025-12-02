-- ===================================
-- シーケンスリセットスクリプト
-- ===================================
-- データ移行後にIDの自動採番が重複しないようにシーケンスを更新します

-- usersテーブルのシーケンスを最大IDに合わせる
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- eventsテーブルのシーケンスを最大IDに合わせる
SELECT setval('events_id_seq', (SELECT MAX(id) FROM events));

-- filesテーブルのシーケンスを最大IDに合わせる
SELECT setval('files_id_seq', (SELECT MAX(id) FROM files));

-- tagsテーブルのシーケンスを最大IDに合わせる
SELECT setval('tags_id_seq', (SELECT MAX(id) FROM tags));

-- 確認
SELECT 'users' as table_name, last_value FROM users_id_seq
UNION ALL
SELECT 'events', last_value FROM events_id_seq
UNION ALL
SELECT 'files', last_value FROM files_id_seq
UNION ALL
SELECT 'tags', last_value FROM tags_id_seq;
