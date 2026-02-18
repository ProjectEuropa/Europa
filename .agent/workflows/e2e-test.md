---
description: Playwright E2Eテストを実行する
---

# E2Eテスト実行

// turbo-all
<!-- 上記はAntiGravityワークフローの自動実行ディレクティブです -->

## 手順

1. フロントエンド開発サーバーが起動していない場合、起動:
```bash
cd frontend && npm run dev
```

2. E2Eテストを実行:
```bash
cd frontend && npm run test:e2e
```

3. 特定のテストファイルのみ実行する場合:
```bash
cd frontend && npx playwright test [test-file].spec.ts
```

4. テスト失敗時のデバッグ:
```bash
cd frontend && npx playwright test --headed [test-file].spec.ts
```

## 注意
- 開発サーバーが起動している必要がある（ポートは `frontend/package.json` の `scripts.dev` を参照）
- テスト間の状態リークに注意（localStorage/sessionStorageのクリア）
- CI環境ではworkers: 1で実行される
- バックエンド（hono-worker）のテストはユニットテストのみ（`cd hono-worker && npm run test:run`）。E2Eテストは対象外
