# MCP設定ガイド

Project Europaで利用するMCPサーバーの設定手順。

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
        "--from", "git+https://github.com/oraios/serena@v0.17.1",
        "serena-mcp-server",
        "--project-root", "${workspaceFolder}"
      ]
    }
  }
}
```

> **Note**: バージョンを固定するには `git+https://github.com/oraios/serena@<tag-or-commit-hash>` の形式を使用してください。上記の例では `v0.17.1` タグを指定しています。利用可能なタグは [Serena Releases](https://github.com/oraios/serena/releases) で確認できます。

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

### 3. Memory（永続メモリ）

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

## MCPサーバーのメンテナンスと更新

プロジェクトの再現性を確保するため、MCPサーバーのバージョンは明示的に固定されています。最新バージョンへの更新を確認・実施する場合は以下のリソースを参照してください。

| サーバー | バージョン確認先 | 最新版確認コマンド |
|----------|-----------------|-------------------|
| **Serena** | [GitHub Releases](https://github.com/oraios/serena/releases) | (git参照のためGitHubを確認) |
| **Context7** | [npm page](https://www.npmjs.com/package/@upstash/context7-mcp) | `npm view @upstash/context7-mcp version` |
| **Memory** | [npm page](https://www.npmjs.com/package/@modelcontextprotocol/server-memory) | `npm view @modelcontextprotocol/server-memory version` |

> [!TIP]
> ライブラリの大規模なアップデートがあった場合は、動作確認を行った上でこのドキュメントのバージョン記述を更新してください。
>
> **最終確認日**: 2026-02-18

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

## エージェント別のMCP対応状況

各エージェントで利用できるMCP・内蔵ツールの対応表:

| 機能 | Claude Code | AntiGravity |
|------|------------|-------------|
| URL取得 | `fetch` MCP | `read_url_content` 内蔵ツール |
| ブラウザ自動化 | `playwright` MCP | `browser_subagent` 内蔵ツール |
| 段階的思考 | `sequential-thinking` MCP | 内蔵の思考機能 |
| コードインテリジェンス | `serena` MCP | `serena` MCP |
| ドキュメント検索 | `Context7` MCP | `Context7` MCP |
| 永続メモリ | `memory` MCP | `memory` MCP |
