# Project Europa - プロジェクト概要

## プロジェクトの目的
Project EuropaはCarnage Heart EXA用のOKEファイルの共有・分析・コラボレーションを行うフルスタックWebアプリケーションです。

## 技術スタック

### バックエンド (Hono on Cloudflare Workers)
- **Runtime**: Cloudflare Workers
- **Framework**: Hono 4.x
- **認証**: Supabase Auth (JWT)
- **データベース**: Supabase PostgreSQL
- **ストレージ**: Cloudflare R2
- **テスト**: Vitest
- **コード品質**: Biome

### フロントエンド (Next.js)
- **Next.js**: 15.x (App Router, 静的エクスポート)
- **React**: 19.x
- **TypeScript**: 5.8.x (strict mode)
- **スタイリング**: TailwindCSS 4.x
- **コンポーネント**: shadcn/ui
- **状態管理**: Zustand + TanStack Query v5
- **フォーム**: React Hook Form + Zod validation
- **テスト**: Vitest (単体) + Playwright (E2E)
- **コード品質**: Biome (lint/format)

## アーキテクチャ
- **デプロイ**: 
  - フロントエンド: Cloudflare Pages (静的エクスポート)
  - バックエンド: Cloudflare Workers
- **認証フロー**: フロントエンド → Supabase Auth → JWT → API
- **ファイル処理**: R2 ストレージへのアップロード/ダウンロード
- **制約**: `output: 'export'` のため SSR 不可、Skeleton UI + プリフェッチで対応

## ディレクトリ構造
```
/frontend/            # Next.js フロントエンド
/hono-worker/         # Cloudflare Workers バックエンド
/.github/             # CI/CD ワークフロー
/compose.yaml         # ローカル開発用 Docker
```
