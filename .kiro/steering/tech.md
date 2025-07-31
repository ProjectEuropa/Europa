# 技術スタック

## バックエンド (Laravel)

- **PHP**: 8.4
- **Laravel Framework**: 11.x
- **データベース**: PostgreSQL（メイン）、MySQL対応
- **管理パネル**: Filament 3.3
- **認証**: Laravel Sanctum + Laravel Socialite
- **ファイル処理**: Madzipper（zip操作用）
- **テスト**: PHPUnit 11.x

### 主要Laravelパッケージ
- `filament/filament` - 管理パネル
- `laravel/sanctum` - API認証
- `laravel/socialite` - ソーシャルログイン
- `madnest/madzipper` - ZIPファイル操作
- `olssonm/l5-very-basic-auth` - Basic認証ミドルウェア
- `laravel/breeze` - 認証スカフォールディング
- `doctrine/dbal` - データベース抽象化レイヤー

## フロントエンド (Next.js)

- **Next.js**: 15.x（Turbopack使用）
- **React**: 19.x
- **TypeScript**: 5.8+
- **スタイリング**: Tailwind CSS 4.x
- **UIコンポーネント**: Radix UI + shadcn/ui
- **アニメーション**: Framer Motion
- **音声**: Howler.js + use-sound

### フロントエンドアーキテクチャ
- App Router（Next.js 13+構造）
- TypeScript（strict mode）
- shadcn/uiを使用したコンポーネントベースアーキテクチャ
- 認証・API呼び出し用カスタムフック

## レガシーフロントエンド (Vue.js)

プロジェクトにはLaravel Mixで構築されたVue.js 2.6フロントエンドも含まれています：
- **Vue.js**: 2.6.14
- **Vuetify**: 2.6.12（UIコンポーネント用）
- **Vue Router**: 3.x（ルーティング用）
- **TypeScript**: 4.8+対応
- **ビルドツール**: Laravel Mix with Webpack

## 開発ツール

- **ビルドツール**: Laravel Mix（Vue.js）、Next.js（React）
- **パッケージマネージャー**: Composer（PHP）、npm/yarn/pnpm/bun（Node.js）
- **Nodeバージョン**: 22.15.1（Voltaで管理）

## インフラストラクチャ

- **コンテナ化**: Docker Compose
- **Webサーバー**: Nginx 1.24.0
- **データベース**: PostgreSQL 17（Alpine）
- **HTTPS**: HTTPS Portal（Let's Encrypt）
- **監視**: New Relic Infrastructure + PHP Agent、Mackerel
- **デプロイ**: Ansibleベース自動化
- **バックアップ**: cronサービスによる自動データベースバックアップ

## よく使うコマンド

### バックエンド開発
```bash
# 依存関係のインストール
composer install

# 環境設定
cp .env.example .env
php artisan key:generate

# データベース操作
php artisan migrate
php artisan migrate --seed

# 開発サーバー起動
php artisan serve --host 0.0.0.0 --port 50756

# テスト実行
php artisan test
```

### フロントエンド開発 (Next.js)
```bash
# 依存関係のインストール
cd frontend && npm install

# 開発サーバー起動（ポート3002で実行）
npm run dev

# 本番用ビルド
npm run build
npm start
```

### レガシーフロントエンド開発 (Vue.js)
```bash
# 依存関係のインストール（ルートから）
npm install

# 開発ビルド
npm run dev

# 変更監視
npm run watch

# 本番ビルド
npm run prod
```

### Docker開発
```bash
# サービス起動（本番）
docker compose up -d --build

# サービス起動（ローカル開発）
docker compose -f compose.local.yaml up -d --build

# コンテナ内でLaravelコマンド実行
docker compose run php-fpm composer install
docker compose run php-fpm php artisan migrate
```

## 設定メモ

- **タイムゾーン**: Asia/Tokyo
- **ロケール**: 日本語（ja）がメイン、英語（en）がフォールバック
- **フロントエンドURL**: デフォルト http://localhost:3002（Next.js）
- **データベース**: PostgreSQL推奨、環境変数で設定
- **ドメイン**: ローカル開発では local.europa.com を使用
