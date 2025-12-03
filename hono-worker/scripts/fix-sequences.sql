-- ファイルテーブルのシーケンスをリセット
-- 現在の最大IDより大きい値にシーケンスを設定
SELECT setval('files_id_seq', (SELECT COALESCE(MAX(id), 1) FROM files), true);

-- タグテーブルのシーケンスもリセット（念のため）
SELECT setval('tags_id_seq', (SELECT COALESCE(MAX(id), 1) FROM tags), true);

-- ユーザーテーブルのシーケンスもリセット（念のため）
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users), true);

-- イベントテーブルのシーケンスもリセット（念のため）
SELECT setval('events_id_seq', (SELECT COALESCE(MAX(id), 1) FROM events), true);

-- 確認クエリ
SELECT 'files_id_seq' as sequence_name, last_value FROM files_id_seq
UNION ALL
SELECT 'tags_id_seq', last_value FROM tags_id_seq
UNION ALL
SELECT 'users_id_seq', last_value FROM users_id_seq
UNION ALL
SELECT 'events_id_seq', last_value FROM events_id_seq;
