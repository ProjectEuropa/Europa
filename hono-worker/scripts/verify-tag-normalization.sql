-- ===================================
-- タグ正規化検証クエリ
-- ===================================
-- Neon SQL Editorで実行してください

-- 1. タグの総数を確認
SELECT COUNT(*) as total_tags FROM tags;

-- 2. 最も使用されているタグ Top 20
SELECT 
  t.tag_name,
  COUNT(ft.file_id) as file_count
FROM tags t
LEFT JOIN file_tags ft ON t.id = ft.tag_id
GROUP BY t.id, t.tag_name
ORDER BY file_count DESC
LIMIT 20;

-- 3. ファイルごとのタグ数の分布
SELECT 
  tag_count,
  COUNT(*) as file_count
FROM (
  SELECT 
    f.id,
    COUNT(ft.tag_id) as tag_count
  FROM files f
  LEFT JOIN file_tags ft ON f.id = ft.file_id
  GROUP BY f.id
) AS tag_distribution
GROUP BY tag_count
ORDER BY tag_count;

-- 4. タグが付いていないファイルの数
SELECT COUNT(*) as files_without_tags
FROM files f
LEFT JOIN file_tags ft ON f.id = ft.file_id
WHERE ft.tag_id IS NULL;

-- 5. サンプル: ファイルとそのタグの関連を確認（最初の10件）
SELECT 
  f.id,
  f.file_name,
  STRING_AGG(t.tag_name, ', ' ORDER BY t.tag_name) as tags
FROM files f
LEFT JOIN file_tags ft ON f.id = ft.file_id
LEFT JOIN tags t ON ft.tag_id = t.id
GROUP BY f.id, f.file_name
ORDER BY f.id
LIMIT 10;

-- 6. 移行統計サマリー
SELECT 
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM events) as total_events,
  (SELECT COUNT(*) FROM files) as total_files,
  (SELECT COUNT(*) FROM tags) as total_tags,
  (SELECT COUNT(*) FROM file_tags) as total_file_tag_relations;
