# Project Europa

このリポジトリは、Cloudflare Workers + HonoバックエンドとNext.jsフロントエンドで構成されるProject Europaのコードベースを含んでいます。

> **注記**: このプロジェクトは以前Laravel（PHP 8.4、Laravel 11.x）を使用していましたが、現在はCloudflare Workers + Honoアーキテクチャに移行しています。

## 現在の構成

### hono-worker (バックエンド)
Cloudflare Workers上で動作するHonoベースのバックエンドAPI

### frontend (フロントエンド)
Next.js 16.xベースのフロントエンドアプリケーション

## 技術スタック

### バックエンド (hono-worker)
*   **言語:** TypeScript
*   **ランタイム:** Cloudflare Workers
*   **フレームワーク:** Hono v4.11.4
*   **データベース:** Neon (PostgreSQL)
*   **ストレージ:** Cloudflare R2
*   **バリデーション:** Zod v4.1.13
*   **認証:** bcryptjs
*   **Discord連携:** Discord Interactions API (HTTP方式)

### フロントエンド (frontend)
*   **言語:** TypeScript
*   **Next.js:** 16.1.3
*   **React:** 19.2.0
*   **スタイリング:** TailwindCSS 4.1.7
*   **UIコンポーネント:** shadcn/ui, Radix UI
*   **状態管理:** Zustand
*   **データフェッチング:** TanStack Query v5.90.19
*   **フォーム:** React Hook Form
*   **バリデーション:** Zod v4.3.5
*   **アニメーション:** Framer Motion

## 前提条件

- **Node.js:** v24.13.0 以上（[Volta](https://volta.sh/) 推奨）
- **npm:** Node.js に同梱
- **Wrangler CLI:** Cloudflare Workers のデプロイに必要（npm install で自動インストール）

## 環境構築手順

### hono-worker のセットアップ

1.  **hono-workerディレクトリに移動:**
    ```bash
    cd hono-worker
    ```

2.  **依存関係のインストール:**
    ```bash
    npm install
    ```

3.  **環境変数の設定:**
    ```bash
    cp .dev.vars.example .dev.vars
    ```
    `.dev.vars`ファイルを編集して、必要な環境変数を設定してください。

4.  **開発サーバーの起動:**
    ```bash
    npm run dev
    ```

### frontend のセットアップ

1.  **frontendディレクトリに移動:**
    ```bash
    cd frontend
    ```

2.  **依存関係のインストール:**
    ```bash
    npm install
    ```

3.  **環境変数の設定:**
    ```bash
    cp .env.local.example .env.local
    ```
    `.env.local`ファイルを編集して、必要な環境変数を設定してください。（例: `NEXT_PUBLIC_API_BASE_URL`）

4.  **開発サーバーの起動:**
    ```bash
    npm run dev
    ```
    デフォルトで `http://localhost:3002` で起動します。

## 開発用コマンド

### hono-worker

```bash
# 開発サーバー起動
npm run dev

# テスト実行
npm run test
npm run test:ui          # UIモードでテスト
npm run test:coverage    # カバレッジ付きテスト

# コード品質チェック
npm run lint             # Lint実行
npm run lint:fix         # Lint自動修正
npm run format           # フォーマットチェック
npm run format:fix       # フォーマット自動修正
npm run check            # Lint + フォーマットチェック
npm run check:fix        # Lint + フォーマット自動修正

# デプロイ
npm run deploy:staging   # ステージング環境へデプロイ
npm run deploy:production # 本番環境へデプロイ
```

### frontend

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build
npm start                # 本番ビルド起動

# テスト実行
npm run test
npm run test:ui          # UIモードでテスト
npm run test:coverage    # カバレッジ付きテスト
npm run test:e2e         # E2Eテスト (Playwright)
npm run test:e2e:ui      # E2EテストUIモード

# コード品質チェック
npm run lint             # Lint実行
npm run lint:fix         # Lint自動修正
npm run format           # フォーマットチェック
npm run format:fix       # フォーマット自動修正
npm run check            # Lint + フォーマットチェック
npm run check:fix        # Lint + フォーマット自動修正
npm run type-check       # TypeScriptの型チェック

# その他
npm run analyze          # バンドルサイズ分析
npm run clean            # キャッシュクリア
```

## プロジェクト構成

```
.
├── hono-worker/         # Cloudflare Workers + Hono バックエンド
│   ├── src/
│   ├── scripts/
│   ├── wrangler.toml
│   └── package.json
├── frontend/            # Next.js フロントエンド
│   ├── src/
│   ├── public/
│   ├── e2e/
│   └── package.json
└── readme.md
```

## Discord Bot連携

EuropaはDiscord Botと連携して、Discordから直接大会情報を登録できます。

### 機能

- `/大会登録` スラッシュコマンドでModalフォームを表示
- Discordチャンネルへの告知投稿（Embed形式）
- Europaのeventsテーブルへの自動登録

### 使い方

1. Discordで `/大会登録` コマンドを実行
2. 表示されるフォームに大会情報を入力
3. 送信すると、コマンドを実行したチャンネルに告知が投稿され、Europaにも登録される

### Discord Bot環境変数

```bash
# Discord Developer Portalから取得
DISCORD_APPLICATION_ID=xxxx
DISCORD_PUBLIC_KEY=xxxx
DISCORD_BOT_TOKEN=xxxx
DISCORD_GUILD_ID=xxxx
DISCORD_CHANNEL_ID=xxxx  # フォールバック用（通常はコマンド実行チャンネルに投稿）
```

## アーキテクチャ

### システム全体構成

```mermaid
graph TB
    subgraph "クライアント"
        Browser[Webブラウザ]
        Discord[Discord<br/>スラッシュコマンド]
    end

    subgraph "Cloudflare CDN"
        Frontend[Next.js Frontend<br/>React 19 + TailwindCSS 4]
    end

    subgraph "Cloudflare Workers"
        API[Hono API Server<br/>v4.11.4]
    end

    subgraph "外部サービス"
        DiscordAPI[Discord API<br/>メッセージ投稿]
    end

    subgraph "データ層"
        DB[(Neon PostgreSQL)]
        R2[Cloudflare R2<br/>オブジェクトストレージ]
    end

    Browser --> Frontend
    Frontend --> API
    Discord -->|Interactions| API
    API --> DB
    API --> R2
    API -->|REST API| DiscordAPI

    style Frontend fill:#61dafb,stroke:#333,stroke-width:2px
    style API fill:#ff6b35,stroke:#333,stroke-width:2px
    style DB fill:#336791,stroke:#333,stroke-width:2px
    style R2 fill:#f38020,stroke:#333,stroke-width:2px
    style Discord fill:#5865F2,stroke:#333,stroke-width:2px
    style DiscordAPI fill:#5865F2,stroke:#333,stroke-width:2px
```

### データフロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant F as Frontend<br/>(Next.js)
    participant A as API<br/>(Hono/Workers)
    participant D as Database<br/>(Neon)
    participant S as Storage<br/>(R2)

    U->>F: ページアクセス
    F->>A: API リクエスト
    A->>D: データ取得
    D-->>A: レスポンス
    A-->>F: JSON レスポンス
    F-->>U: ページ表示

    Note over U,F: ファイルアップロード
    U->>F: ファイル選択
    F->>A: FormData送信
    A->>S: ファイル保存
    S-->>A: URL返却
    A->>D: メタデータ保存
    A-->>F: 成功レスポンス
    F-->>U: 完了通知
```

### Discord Bot連携フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant DC as Discord
    participant A as API<br/>(Hono/Workers)
    participant DA as Discord API
    participant D as Database<br/>(Neon)

    U->>DC: /大会登録 コマンド実行
    DC->>A: Interaction (署名付き)
    A->>A: Ed25519署名検証
    A-->>DC: Modalフォーム表示

    U->>DC: フォーム入力・送信
    DC->>A: Modal Submit
    A->>A: バリデーション
    A->>DA: メッセージ投稿
    DA-->>A: メッセージID
    A->>D: イベント登録
    D-->>A: 成功
    A-->>DC: 完了通知（Ephemeral）
    DC-->>U: 登録完了メッセージ

    Note over A,D: DB登録失敗時
    A->>DA: メッセージ削除（ロールバック）
```

### 技術スタック詳細

```mermaid
graph LR
    subgraph "Frontend技術"
        NextJS[Next.js 16.1.3]
        React[React 19.2.0]
        TailwindCSS[TailwindCSS 4.1.7]
        TanStack[TanStack Query v5.90.19]
        Zustand[Zustand]
        RHF[React Hook Form]
    end

    subgraph "Backend技術"
        Hono[Hono v4.11.4]
        Workers[Cloudflare Workers]
        Zod[Zod v4.1.13]
        Bcrypt[bcryptjs]
    end

    subgraph "インフラ"
        Neon[Neon PostgreSQL]
        R2[Cloudflare R2]
        CF[Cloudflare CDN]
    end

    NextJS --> React
    NextJS --> TailwindCSS
    React --> TanStack
    React --> Zustand
    React --> RHF

    Hono --> Workers
    Hono --> Zod
    Hono --> Bcrypt

    Workers --> Neon
    Workers --> R2
    NextJS --> CF

    style NextJS fill:#000,color:#fff,stroke:#333,stroke-width:2px
    style Hono fill:#ff6b35,stroke:#333,stroke-width:2px
    style Neon fill:#336791,stroke:#333,stroke-width:2px
```
