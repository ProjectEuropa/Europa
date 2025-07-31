# 推奨開発コマンド

## バックエンド (Laravel)
```bash
# 依存関係インストール
composer install

# 環境設定
cp .env.example .env
php artisan key:generate

# データベース
php artisan migrate --seed

# 開発サーバー起動
php artisan serve --host 0.0.0.0 --port 50756

# テスト実行
./vendor/bin/phpunit
```

## フロントエンド (Next.js)
```bash
cd frontend

# 依存関係インストール
npm install

# 開発サーバー (ポート3002)
npm run dev

# ビルド
npm run build
npm run start

# テスト
npm run test              # 単体テスト (Vitest)
npm run test:coverage     # カバレッジ
npm run test:e2e          # E2Eテスト (Playwright)

# コード品質
npm run lint              # Biome linting
npm run format:fix        # 自動フォーマット
npm run check:fix         # lint + format 自動修正
```

## Docker開発
```bash
# コンテナ起動
docker compose -f docker-compose.server.yml up -d --build

# Composer インストール
docker compose -f docker-compose.server.yml run php-fpm composer install

# マイグレーション
docker compose -f docker-compose.server.yml run php-fpm php artisan migrate
```