# データベース・API 構造

## Supabase PostgreSQL

### 主要テーブル
- **users**: ユーザー情報 (Supabase Auth 連携)
- **files**: アップロードされたファイルメタデータ
- **tags**: ファイルに付与されるタグ
- **file_tags**: ファイルとタグの関連 (多対多)

## Hono Worker API ルート

### 認証 (/api/auth)
- POST `/login` - ログイン
- POST `/register` - ユーザー登録
- POST `/logout` - ログアウト
- GET `/me` - 現在のユーザー情報

### ファイル (/api/files)
- GET `/` - ファイル一覧・検索
- GET `/:id` - ファイル詳細
- POST `/` - ファイルアップロード
- DELETE `/:id` - ファイル削除
- GET `/:id/download` - ファイルダウンロード

### 一括ダウンロード (/api/sum-download)
- POST `/` - 複数ファイルのZIPダウンロード

### お知らせ (/api/info)
- GET `/` - お知らせ一覧

## ストレージ
- **Cloudflare R2**: ファイル本体の保存
- **バケット名**: europa-files (環境ごとに異なる)

## 認証フロー
1. フロントエンドで Supabase Auth SDK を使用
2. JWT トークンを取得
3. API リクエスト時に Authorization ヘッダーに付与
4. Hono ミドルウェアで JWT を検証
