# プロジェクト構造

## ルートレベル構成

これはLaravelバックエンドとNext.jsフロントエンドアプリケーションの両方を含むモノレポです。

```
├── app/                    # Laravelアプリケーションコード
├── frontend/               # Next.jsアプリケーション
├── config/                 # Laravel設定ファイル
├── database/               # マイグレーション、シーダー、ファクトリー
├── resources/              # ビュー、アセット、言語ファイル
├── routes/                 # Laravelルート定義
├── tests/                  # PHPUnitテスト
├── public/                 # Laravel公開アセット
├── storage/                # Laravelストレージ（ログ、キャッシュ、アップロード）
├── ansible/                # デプロイ自動化
├── _docker-configs/        # Docker設定ファイル
└── cron/                   # スケジュールタスク設定
```

## Laravelバックエンド構造

### アプリケーション層 (`app/`)
- **BusinessService/**: ドメイン固有のビジネスロジックサービス
- **Http/Controllers/**: リクエスト処理とレスポンスロジック
  - `Api/`: APIエンドポイント
  - `Auth/`: 認証コントローラー
- **Http/Middleware/**: カスタムミドルウェア（認証、CORS等）
- **Http/Requests/**: フォームリクエストバリデーション
- **Http/Resources/**: APIリソース変換
- **Filament/Resources/**: 管理パネルリソース定義
- **Notifications/**: メール・通知クラス
- **Providers/**: 依存性注入用サービスプロバイダー
- **Validation/**: カスタムバリデーションルール

### 主要モデル
- `User.php`: ユーザー認証・管理
- `File.php`: ファイルアップロード・メタデータ管理
- `Event.php`: イベントスケジューリング・管理

### データベース層 (`database/`)
- **migrations/**: データベーススキーマ定義
- **seeds/**: 開発・テスト用データベースシーディング
- **factories/**: テスト用モデルファクトリー

## Next.jsフロントエンド構造 (`frontend/`)

### App Router構造 (`src/app/`)
```
src/app/
├── (auth)/                 # 認証ルート
│   ├── login/
│   ├── register/
│   └── forgot-password/
├── upload/                 # ファイルアップロードインターフェース
├── search/                 # 検索機能
├── mypage/                 # ユーザーダッシュボード
├── event/                  # イベント管理
└── layout.tsx              # ルートレイアウト
```

### コンポーネント (`src/components/`)
- **UIコンポーネント**: 再利用可能なインターフェース要素
- **機能コンポーネント**: ビジネスロジックコンポーネント
- **レイアウトコンポーネント**: ヘッダー、フッター、ナビゲーション

### ユーティリティ (`src/`)
- **hooks/**: カスタムReactフック（useAuth等）
- **lib/**: ユーティリティ関数・設定
- **utils/**: APIクライアント・ヘルパー関数

## 設定ファイル

### 環境設定
- `.env.example`: 環境変数テンプレート
- `.env`: ローカル開発設定（gitに含まれない）
- `ansible/.env.production`: 本番環境設定
- `ansible/.env.staging`: ステージング環境設定

### ビルド設定
- `composer.json`: PHP依存関係・スクリプト
- `package.json`: Node.js依存関係（Laravel Mix用ルートレベル）
- `frontend/package.json`: Next.js依存関係
- `webpack.mix.js`: Laravel Mixビルド設定
- `frontend/next.config.ts`: Next.js設定

## インフラ・デプロイ

### Docker設定
- `compose.yaml`: 本番Docker Compose
- `compose.local.yaml`: ローカル開発オーバーライド
- `_docker-configs/`: サービス固有Docker設定

### デプロイ (`ansible/`)
- **playbooks/**: デプロイ自動化スクリプト
- **roles/**: 再利用可能Ansibleロール
- **inventory.yml**: サーバーインベントリ
- **group_vars/**: 環境固有変数

## ファイルストレージ・アセット

### 公開アセット (`public/`)
- Webサーバーから直接提供される静的ファイル
- コンパイル済みCSS/JSアセット
- ユーザーアップロードファイル（本番ではクラウドストレージを検討）

### ストレージ (`storage/`)
- **app/**: アプリケーションファイルストレージ
- **logs/**: アプリケーションログ
- **framework/**: Laravelフレームワークキャッシュ・セッション

## テスト構造 (`tests/`)
- **Feature/**: HTTPエンドポイント統合テスト
- **Unit/**: 個別クラス・メソッドユニットテスト
- PHPUnitによるLaravelテスト規約に従う

## 命名規則

### Laravel
- コントローラー: PascalCaseで「Controller」サフィックス
- モデル: PascalCase、単数形
- マイグレーション: snake_caseで説明的な名前
- ルート: URLはkebab-case

### Next.js
- コンポーネント: PascalCase
- ファイル: ページはkebab-case、コンポーネントはPascalCase
- フック: camelCaseで「use」プレフィックス
- APIルート: kebab-case

## 主要アーキテクチャパターン

- **関心の分離**: フロントエンドとバックエンドの明確な分離
- **サービス層**: サービスクラスにカプセル化されたビジネスロジック
- **リソースパターン**: リソースクラスによるAPIレスポンス整形
- **ミドルウェアパイプライン**: ミドルウェアスタックによるリクエスト処理
- **コンポーネント合成**: 合成パターンで構築されたReactコンポーネント
