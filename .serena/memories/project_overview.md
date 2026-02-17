# Project Europa - プロジェクト概要

## プロジェクトの目的
Project EuropaはCarnage Heart EXA用のOKEファイルの共有・分析・コラボレーションを行うフルスタックWebアプリケーションです。

## 技術スタック

### フロントエンド (Next.js)
- **Next.js**: 16.x (App Router, 静的エクスポート, Turbopack)
- **React**: 19.x
- **TypeScript**: 5.x (strict mode)
- **スタイリング**: TailwindCSS 4.x
- **コンポーネント**: shadcn/ui (Radix UI基盤)
- **状態管理**: Zustand 5.x + TanStack Query 5.x
- **フォーム**: React Hook Form 7.x + Zod 4.x
- **テスト**: Vitest 4.0.18 (単体) + Playwright 1.50.1 (E2E)
- **コード品質**: Biome 2.3.12 (lint/format)
- **Node.js**: 24.13.0 (Volta管理)

### バックエンド (Hono on Cloudflare Workers)
- **Runtime**: Cloudflare Workers
- **Framework**: Hono 4.x
- **認証**: Cookie-based JWT
- **データベース**: Neon PostgreSQL
- **ストレージ**: Cloudflare R2
- **テスト**: Vitest 4.0.15
- **コード品質**: Biome 2.3.8
- **Node.js**: 24.13.0 (Volta管理)

## アーキテクチャ
- **デプロイ**: 
  - フロントエンド: Cloudflare Pages (静的エクスポート)
  - バックエンド: Cloudflare Workers
- **認証フロー**: フロントエンド → Cookie-based JWT → API
- **ファイル処理**: R2 ストレージへのアップロード/ダウンロード
- **制約**: `output: 'export'` のため SSR 不可、Skeleton UI + プリフェッチで対応

## ディレクトリ構造
```
/frontend/            # Next.js フロントエンド
/hono-worker/         # Cloudflare Workers バックエンド
/.github/             # CI/CD ワークフロー
/.claude/             # Claude Code設定・スキル
/.serena/             # Serena MCP設定
```
