---
description: フロントエンド・バックエンド両方のフルチェックを実行する
---

# フルチェック

// turbo-all
> [!NOTE]
> `// turbo-all` はAntiGravityワークフローのディレクティブで、全ステップを自動実行するためのフラグです。

## 手順

1. フロントエンドのチェック（Lint/Format）:
```bash
cd frontend && npm run check
```

2. フロントエンドのTypeScript型チェック:
```bash
cd frontend && npm run type-check
```

3. フロントエンドのユニットテスト:
```bash
cd frontend && npm run test:run
```

4. フロントエンドのビルド:
```bash
cd frontend && npm run build
```

5. バックエンドのチェック（Lint/Format）:
```bash
cd hono-worker && npm run check
```

6. バックエンドのTypeScript型チェック:
```bash
cd hono-worker && npx tsc --noEmit
```

7. バックエンドのユニットテスト:
```bash
cd hono-worker && npm run test:run
```

8. エラーがあれば報告・修正
