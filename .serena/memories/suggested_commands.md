# 推奨開発コマンド

## フロントエンド (Next.js)
```bash
cd frontend

# 依存関係インストール
npm install

# 開発サーバー (ポート3002、Turbopack使用)
npm run dev

# ビルド (静的エクスポート)
npm run build

# テスト
npm run test              # 単体テスト (Vitest) watch mode
npm run test:run          # 単体テスト 1回実行
npm run test:ui           # Vitest UI
npm run test:coverage     # カバレッジ
npm run test:e2e          # E2Eテスト (Playwright)
npm run test:e2e:ui       # Playwright UI
npm run test:e2e:report   # Playwrightレポート表示

# コード品質
npm run lint              # Biome linting
npm run lint:fix          # lint 自動修正
npm run format:fix        # 自動フォーマット
npm run check:fix         # lint + format 自動修正
npm run type-check        # TypeScript型チェック

# その他
npm run analyze           # バンドル分析
npm run clean             # キャッシュクリア
npm run ci                # test:run + build
```

## バックエンド (Hono Worker)
```bash
cd hono-worker

# 依存関係インストール
npm install

# ローカル開発サーバー
npm run dev

# E2E用開発サーバー (ポート8787)
npm run e2e:dev

# テスト
npm run test              # 単体テスト (Vitest) watch mode
npm run test:run          # 単体テスト 1回実行
npm run test:ui           # Vitest UI
npm run test:coverage     # カバレッジ

# コード品質
npm run lint              # Biome linting
npm run lint:fix          # lint 自動修正
npm run format            # フォーマットチェック
npm run format:fix        # 自動フォーマット
npm run check:fix         # lint + format 自動修正

# デプロイ
npm run deploy:staging    # ステージング環境へデプロイ
npm run deploy:production # 本番環境へデプロイ

# Neonブランチ管理
npm run neon:create       # ブランチ作成
npm run neon:delete       # ブランチ削除
npm run neon:seed         # シードデータ投入

# 型チェック
npx tsc --noEmit
```

## CI/CD
```bash
# GitHub Actions で自動実行
# - frontend-ci.yml: フロントエンドの lint, test, build
# - backend-ci.yml: バックエンドの lint, test, type-check
```

## Git操作
```bash
# コミット前チェック (lint-staged + husky で自動実行)
# - TypeScript/JavaScript: biome check --write + vitest related --run
# - JSON/Markdown/CSS: biome format --write
```
