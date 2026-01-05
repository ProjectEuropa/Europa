# 推奨開発コマンド

## フロントエンド (Next.js)
```bash
cd frontend

# 依存関係インストール
npm install

# 開発サーバー (ポート3002)
npm run dev

# ビルド (静的エクスポート)
npm run build

# テスト
npm run test              # 単体テスト (Vitest)
npm run test:coverage     # カバレッジ
npm run test:e2e          # E2Eテスト (Playwright)

# コード品質
npm run lint              # Biome linting
npm run format:fix        # 自動フォーマット
npm run check:fix         # lint + format 自動修正
```

## バックエンド (Hono Worker)
```bash
cd hono-worker

# 依存関係インストール
npm install

# ローカル開発サーバー
npm run dev

# テスト
npm run test              # 単体テスト (Vitest)
npm run test:coverage     # カバレッジ

# コード品質
npm run lint              # Biome linting
npm run format            # フォーマットチェック
npm run format:fix        # 自動フォーマット

# デプロイ
npm run deploy            # Cloudflare Workers へデプロイ

# 型チェック
npx tsc --noEmit
```

## CI/CD
```bash
# GitHub Actions で自動実行
# - frontend-ci.yml: フロントエンドの lint, test, build
# - backend-ci.yml: バックエンドの lint, test, type-check
```

## Docker ローカル開発 (オプション)
```bash
docker compose -f compose.local.yaml up -d
```
