# Project Europa

Cloudflare Workers + Hono バックエンドと Next.js 16 フロントエンドで構成されるWebアプリケーション。

## サブプロジェクト

- `frontend/` - Next.js 16 + React 19 + TailwindCSS 4 + shadcn/ui（詳細: `frontend/CLAUDE.md`）
- `hono-worker/` - Hono v4 + Cloudflare Workers + Neon PostgreSQL（詳細: `hono-worker/CLAUDE.md`）

## Available Skills

以下のスキルが `.claude/skills/` に利用可能です。関連するタスクでは積極的に活用してください。

### 開発スキル（プロジェクト固有）

| スキル | 用途 |
|--------|------|
| `e2e-write` | Playwright E2Eテスト作成（Page Object Model + セマンティックロケータ） |
| `e2e-debug` | E2Eテスト失敗の分析・修正・CI自動修復 |
| `e2e-refactor` | E2Eテストのリファクタリング（非推奨ロケータ→セマンティック変換） |

### 公式スキル（Anthropic提供）

| スキル | 用途 |
|--------|------|
| `frontend-design` | 高品質なフロントエンドUI/UX設計。「AIスロップ」を回避する美学的指針 |
| `webapp-testing` | Playwright + PythonでのWebアプリテスト自動化 |
| `mcp-builder` | MCPサーバーの設計・実装ガイド |
| `skill-creator` | 新しいカスタムスキルの作成方法 |
| `doc-coauthoring` | ドキュメント共同作成ワークフロー |
| `web-artifacts-builder` | React + shadcn/ui アーティファクト構築 |
| `theme-factory` | プロフェッショナルなテーマ適用（10プリセット） |
| `canvas-design` | デザイン哲学に基づくCanvas作成 |

## Task Routing Rules

タスク内容に基づいて、Claude Codeは以下のルールで適切なスキル/ツール/エージェントを自動選択する。

### スキル自動選択ルール

| タスクパターン | 使用スキル | トリガー例 |
|--------------|-----------|-----------|
| E2Eテスト作成 | `e2e-write` | 「E2Eテストを書いて」「テストを作成して」「新機能のテストが必要」 |
| テスト失敗修正 | `e2e-debug` | 「テストが失敗している」「CIが落ちている」「テストをデバッグして」 |
| テストリファクタリング | `e2e-refactor` | 「テストを改善して」「ロケータを修正」「Page Objectに変換」 |
| UI/コンポーネント作成 | `frontend-design` | 「UIを作成」「コンポーネントを作って」「美しいページを」 |
| ドキュメント作成 | `doc-coauthoring` | 「ドキュメントを書いて」「仕様書を作成」「READMEを更新」 |
| MCP開発 | `mcp-builder` | 「MCPサーバーを作成」「外部API連携」「ツール統合」 |
| スキル作成 | `skill-creator` | 「スキルを作成」「カスタムスキル」「ワークフロー定義」 |
| アーティファクト作成 | `web-artifacts-builder` | 「デモを作って」「プロトタイプ」「インタラクティブなサンプル」 |
| テーマ適用 | `theme-factory` | 「テーマを適用」「スタイルを変更」「色を変えて」 |
| ビジュアルデザイン | `canvas-design` | 「ポスターを作成」「ビジュアルアート」「デザインを作って」 |
| Webアプリテスト | `webapp-testing` | 「ブラウザでテスト」「UIの動作確認」「スクリーンショット」 |

### MCP Tool Selection Rules

| 用途 | MCP | トリガー例 |
|------|-----|-----------|
| ブラウザ自動化・スクリーンショット | `playwright` | 「ブラウザで確認」「スクリーンショット」「DOM操作」 |
| AWS構成図生成 | `aws-diagram` | 「AWSの構成図」「インフラ図」「アーキテクチャ図」 |
| ライブラリドキュメント検索 | `Context7` | 「ライブラリのドキュメント」「APIリファレンス」「使い方を調べて」 |
| コードシンボル検索 | `serena` | 「シンボルを検索」「関数の定義を探して」「参照を見つけて」 |
| 段階的思考 | `sequential-thinking` | 「段階的に考えて」「複雑な問題を分解」「ステップバイステップ」 |
| URL取得 | `fetch` | 「Webページを取得」「URLの内容を読んで」 |

### Agent Delegation Rules

| 条件 | 委譲先 | 理由 |
|------|--------|------|
| コードベース全体の理解が必要 | Explore Agent | 広範囲の探索が必要 |
| 複雑なタスクで計画が必要 | Plan Agent | 実装前の設計が必要 |
| 単純な1ファイル修正 | 直接実行 | 委譲不要 |

### API Design Rules

バックエンド（hono-worker）のAPI設計では以下の規約を遵守すること：

- **エンドポイント形式**: `/api/v2/...`
- **認証方式**: HttpOnly Cookie + `credentials: 'include'`
- **バリデーション**: Zodスキーマによる入力検証必須
- **レスポンス形式**:
  - 成功: `{ data: {...}, message?: string }`
  - エラー: `{ error: { message: string, code?: string } }`
- **エラーハンドリング**: 401（認証）→ 日本語メッセージ変換、422（バリデーション）→ フィールド別表示、500+（サーバー）→ 汎用メッセージ

### Skill Chaining Patterns

複数のスキルを組み合わせて使用するパターン:

**新機能開発フロー**
1. `frontend-design` → UI/UXの設計
2. コンポーネント実装
3. `e2e-write` → E2Eテスト作成
4. `e2e-debug` → テストの修正（必要な場合）

**ドキュメント整備フロー**
1. `doc-coauthoring` → ドキュメント作成
2. `theme-factory` → スタイル適用（必要な場合）
