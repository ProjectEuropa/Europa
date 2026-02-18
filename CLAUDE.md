# Project Europa

Cloudflare Workers + Hono バックエンドと Next.js 16 フロントエンドで構成されるWebアプリケーション。

## サブプロジェクト

- `frontend/` - Next.js 16 + React 19 + TailwindCSS 4 + shadcn/ui（詳細: `frontend/CLAUDE.md`）
- `hono-worker/` - Hono v4 + Cloudflare Workers + Neon PostgreSQL（詳細: `hono-worker/CLAUDE.md`）

## デプロイ手順 (Staging)

このセクションでは、Staging環境へのデプロイ手順を説明します。

### 前提条件

- Cloudflareアカウントが設定済みであること。
- Neon PostgreSQLデータベースが設定済みであること。

### デプロイ前チェックフェーズ

1. フロントエンドのlint/format確認:
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

4. フロントエンドのビルド確認:
```bash
cd frontend && npm run build
```

5. バックエンドのlint/format確認:
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

### デプロイフェーズ

8. バックエンドをStaging環境にデプロイ:
```bash
cd hono-worker && npm run deploy:staging
```

9. デプロイ結果を確認（ログやエラーがないか）

### 自動デプロイ (AntiGravity)

AntiGravityエージェントを使用する場合、以下のコマンドで全ステップを自動実行できます。

```bash
// turbo-all
```
> [!NOTE]
> `// turbo-all` はAntiGravityワークフローのディレクティブで、定義された全ステップ（この場合はデプロイ前チェックとデプロイ）を自動的に実行するためのフラグです。

## Agent Configuration & Directory Policy

プロジェクトでは複数のエージェントを使い分けるため、以下のディレクトリ規約を遵守してください。

- **`.agent/`**: **AntiGravity専用**ディレクトリ。スキル (`.agent/skills/`) やワークフロー (`.agent/workflows/`) を格納します。
- **`.claude/`**: **Claude Code専用**ディレクトリ。固有のスキル (`.claude/skills/`) や設定を格納します。

各エージェントは自身のディレクトリ設定を優先的に参照します。

> **Symlink 互換性**: `.agent/skills/` のシンボリックリンクは macOS、Linux、Git Bash on Windows で動作確認済みです。GitHub Actions では checkout action がデフォルトで symlink を解決します。

## Available Skills

以下のスキルが利用可能です。関連するタスクでは積極的に活用してください。

### 開発スキル（プロジェクト固有）

| スキル | 用途 | SKILL.md Description (EN) |
|--------|------|---------------------------|
| `e2e-write` | Playwright E2Eテスト作成（Page Object Model + セマンティックロケータ） | Create new E2E tests using Playwright with Page Object Model pattern and semantic locators |
| `e2e-debug` | E2Eテスト失敗の分析・修正・CI自動修復 | Analyze and fix failing E2E tests. Includes CI auto-repair mode for GitHub Actions failures |
| `e2e-refactor` | E2Eテストのリファクタリング（非推奨ロケータ→セマンティック変換） | Refactor existing E2E tests to use Page Object Model pattern and semantic locators |
| `nextjs-app-router-patterns` | Next.js App Router実装パターン | Master Next.js 16+ App Router with Server Components, streaming, parallel routes, and advanced data fetching |
| `react-patterns` | Reactベストプラクティス | Modern React patterns and principles. Hooks, composition, performance, TypeScript best practices |
| `tailwind-patterns` | Tailwind CSSスタイリング | Tailwind CSS v4 principles. CSS-first configuration, container queries, modern patterns, design token architecture |
| `wcag-audit-patterns` | アクセシビリティ監査 | Conduct WCAG 2.2 accessibility audits with automated testing, manual verification, and remediation guidance |

### 公式スキル（Anthropic提供）

| スキル | 用途 |
|--------|------|
| `frontend-design` | 高品質なフロントエンドUI/UX設計。「AIスロップ」を回避する美学的指針 |
| `mcp-builder` | MCPサーバーの設計・実装ガイド |
| `skill-creator` | 新しいカスタムスキルの作成方法 |
| `doc-coauthoring` | ドキュメント共同作成ワークフロー |
| `web-artifacts-builder` | React + shadcn/ui アーティファクト構築 |
| `theme-factory` | プロフェッショナルなテーマ適用（10プリセット） |
| `canvas-design` | デザイン哲学に基づくCanvas作成 |

> **Note**: `webapp-testing` スキルは **AntiGravity専用** です。Claude Codeでブラウザ自動化が必要な場合は、`playwright` MCPを直接使用してください。

## Task Routing Rules

タスク内容に基づいて、Claude Codeは以下のルールで適切なスキル/ツール/エージェントを自動選択する。

### スキル自動選択ルール

| タスクパターン | 使用スキル | トリガー例 |
|--------------|-----------|-----------|
| E2Eテスト作成 | `e2e-write` | 「E2Eテストを書いて」「テストを作成して」「新機能のテストが必要」 |
| テスト失敗修正 | `e2e-debug` | 「テストが失敗」「CIが落ちている」「テストをデバッグ」 |
| テストリファクタリング | `e2e-refactor` | 「テストを改善して」「ロケータを修正」「Page Objectに変換」 |
| UI/コンポーネント作成 | `frontend-design` | 「UIを作成」「コンポーネントを作って」「美しいページを」 |
| ドキュメント作成 | `doc-coauthoring` | 「ドキュメントを書いて」「仕様書を作成」「READMEを更新」 |
| MCP開発 | `mcp-builder` | 「MCPサーバーを作成」「外部API連携」「ツール統合」 |
| スキル作成 | `skill-creator` | 「スキルを作成」「カスタムスキル」「ワークフロー定義」 |
| Next.js App Router 実装 | `nextjs-app-router-patterns` | 「App Routerで実装」「Server Componentを使って」 |
| React パターン適用      | `react-patterns`              | 「Reactのベストプラクティスで」「カスタムフックを作成」 |
| Tailwind CSS スタイリング | `tailwind-patterns`         | 「Tailwindでスタイリング」「レスポンシブデザイン」 |
| アクセシビリティ監査     | `wcag-audit-patterns`        | 「アクセシビリティを確認」「WCAG準拠」 |
| アーティファクト構築 | `web-artifacts-builder` | 「アーティファクトを作成」「React + shadcn/ui」 |
| テーマ適用 | `theme-factory` | 「テーマを適用」「スタイルを変更」 |
| Canvas作成 | `canvas-design` | 「ポスターを作成」「デザインを作って」 |

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
| 単純な修正（1-2ファイル、影響範囲が明確） | 直接実行 | 委譲不要 |

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
