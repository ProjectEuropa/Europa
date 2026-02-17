---
description: 失敗しているテストを修正する
---

# テスト修正

// turbo-all

## 手順

1. ユニットテスト実行:
```bash
cd frontend && npm run test:run
```

2. 失敗しているテストを特定

3. テストコードまたは実装コードを修正
   - テストの意図を変えずに修正する
   - 実装側のバグならテストではなく実装を修正
   - `test.skip()` は最後の手段（理由コメント必須）

4. 全テストが通るまで繰り返す

5. ビルド確認:
```bash
cd frontend && npm run build
```
