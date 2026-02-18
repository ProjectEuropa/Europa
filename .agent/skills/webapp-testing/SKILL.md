---
name: webapp-testing
description: |
  Test and verify local web applications using browser automation.
  Triggers: 「ブラウザでテスト」「UIの動作確認」「スクリーンショット」「実際に動かして確認」
  Use when: Verifying frontend functionality, debugging UI behavior, capturing screenshots.
  Uses AntiGravity's browser_subagent for browser interaction.
---

# Web Application Testing

ブラウザ自動化を使用してローカルWebアプリケーションをテスト・検証するスキル。

> **Note**: このスキルはAntiGravity専用です。Claude Codeでは `playwright` MCPを使用してください。

## Decision Tree

```text
タスク → 静的HTML?
    ├─ Yes → HTMLファイルを直接読んでセレクタを特定
    │         └→ browser_subagentでブラウザテスト
    │
    └─ No (動的Webapp) → サーバーが起動している?
        ├─ No → run_commandでサーバーを起動
        │        → browser_subagentでテスト
        │
        └─ Yes → Reconnaissance-then-action:
            1. ページに移動しロード完了を待つ
            2. スクリーンショット取得 or DOM確認
            3. セレクタを特定
            4. アクション実行
```

## Usage Pattern

### 1. サーバー起動（未起動の場合）

```bash
# フロントエンド開発サーバー
cd frontend && npm run dev

# バックエンド開発サーバー
cd hono-worker && npm run dev
```

> **Note**: ポート番号は各 `package.json` の `scripts.dev` を確認してください。

### 2. browser_subagentでテスト

`browser_subagent` ツールを呼び出す際のタスク記述例:

```text
1. http://localhost:<port> にアクセス
2. ページのロードを待つ
3. [対象要素]が表示されていることを確認
4. スクリーンショットを撮影
5. 結果を報告
```

### 3. Reconnaissance-Then-Action

**重要**: 動的アプリでは、DOM検査の前にページの完全なロードを待つこと。

1. **ページに移動** → ロード完了を待つ
2. **DOM/スクリーンショットを確認** → セレクタを特定
3. **アクション実行** → 特定したセレクタを使用

## Best Practices

- サーバー起動は `run_command` で行い、バックグラウンドで実行
- `browser_subagent` のタスク記述は具体的かつ明確にする
- テスト完了条件を明示する
- セマンティックなセレクタを優先（`text=`, `role=`, aria属性）
- スクリーンショットは検証結果の証拠として活用
