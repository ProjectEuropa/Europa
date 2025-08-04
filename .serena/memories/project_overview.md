# Project Europa - プロジェクト概要

## プロジェクトの目的
Project EuropaはCarnage Heart EXA用のOKEファイルの共有・分析・コラボレーションを行うフルスタックWebアプリケーションです。

## 技術スタック

### バックエンド (Laravel)
- **PHP**: 8.4
- **Laravel Framework**: 11.x  
- **認証**: Laravel Sanctum (SPAトークン認証)
- **管理パネル**: Filament 3.x
- **データベース**: PostgreSQL
- **テスト**: PHPUnit

### フロントエンド (Next.js)
- **Next.js**: 15.x (App Router)
- **React**: 19.x
- **TypeScript**: 5.8.x (strict mode)
- **スタイリング**: TailwindCSS 4.x
- **コンポーネント**: shadcn/ui
- **状態管理**: Zustand + React Query
- **フォーム**: React Hook Form + Zod validation
- **テスト**: Vitest (単体) + Playwright (E2E)
- **コード品質**: Biome (lint/format)

## アーキテクチャ
- **API構造**: 
  - レガシーAPI (`/api/`) - 後方互換性
  - V1 API (`/api/v1/`) - Sanctum認証付き
- **認証フロー**: フロントエンド → `/api/v1/login` → Sanctumトークン → localStorage保存
- **ファイル処理**: 専用アップロード/ダウンロードコントローラー
- **管理機能**: Filament管理パネル