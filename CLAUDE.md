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
