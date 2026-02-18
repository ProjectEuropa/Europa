# AntiGravity MCP設定ガイド

AntiGravityで利用するMCPサーバーの設定手順。

## VS Code MCP設定方法

`.vscode/mcp.json` をプロジェクトルートに作成（ワークスペース共有）、
または VS Codeコマンドパレットから `MCP: Open User Configuration` を実行（ユーザー全体設定）。

## 推奨MCPサーバー

### 1. Serena（コードインテリジェンス）

Language Serverを利用した高度なシンボル検索・分析ツール。

```json
{
  "servers": {
    "serena": {
      "command": "uvx",
      "args": [
        "--from", "git+https://github.com/oraios/serena",
        "serena-mcp-server",
        "--project-root", "${workspaceFolder}"
      ]
    }
  }
}
```

> **Note**: Serenaはnpmパッケージではなくgitリポジトリから直接インストールされます。特定バージョンに固定する場合は `git+https://github.com/oraios/serena@<commit-hash>` の形式を使用してください。

### 2. Context7（ライブラリドキュメント検索）

npmパッケージやライブラリのドキュメントを最新版で検索。

```json
{
  "servers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@2.1.1"]
    }
  }
}
```

### 3. Memory（永続メモリ）⭐NEW

ナレッジグラフベースの永続メモリ。エンティティ・リレーション・観察を保存し、セッション間で情報を保持。

```json
{
  "servers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory@2026.1.26"]
    }
  }
}
```

**提供ツール:**
- `create_entities` - エンティティ（ノード）の作成
- `create_relations` - エンティティ間のリレーション作成
- `add_observations` - エンティティへの観察（事実）の追加
- `search_nodes` - ナレッジグラフの検索
- `read_graph` - グラフ全体の読み取り

**活用例:**
- プロジェクトの設計決定を記録
- チームメンバーの担当範囲を管理
- 頻出のトラブルシューティングパターンを蓄積

## AntiGravityで不要なMCP

以下はAntiGravityが内蔵ツールで代替可能:

| Claude Code MCP | AntiGravity代替 |
|-----------------|----------------|
| `fetch` | `read_url_content` ツール |
| `playwright` | `browser_subagent` ツール |
| `sequential-thinking` | 内蔵の思考機能 |
