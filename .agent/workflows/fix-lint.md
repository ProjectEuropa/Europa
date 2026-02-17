---
description: プロジェクト全体のlintエラーを修正する
---

# Lint修正

// turbo-all

## 手順

1. フロントエンドのBiomeエラーを自動修正:
```bash
cd /Users/masato/Desktop/spa-auth/Europa/frontend && npm run check:fix
```

2. フロントエンドの型チェック:
```bash
cd /Users/masato/Desktop/spa-auth/Europa/frontend && npm run type-check
```

3. バックエンドのBiomeエラーを自動修正:
```bash
cd /Users/masato/Desktop/spa-auth/Europa/hono-worker && npm run check:fix
```

4. 残ったエラーがあれば手動で修正

5. ビルド確認:
```bash
cd /Users/masato/Desktop/spa-auth/Europa/frontend && npm run ci
```
