# コードスタイルと規約

## TypeScript/React スタイル (Biome 2.5.2)

### Biome設定
- **インデント**: 2スペース
- **行幅**: 80文字
- **クォート**: シングル（JSXはダブル）
- **セミコロン**: 必須
- **トレイリングカンマ**: all
- **any禁止**: noExplicitAny: error
- **const強制**: useConst: error
- **exhaustive deps**: 警告
- **インポート**: 自動整理有効

### TypeScript設定
- **target**: ES2020
- **strict**: true
- **noExplicitAny**: true
- **パスエイリアス**: `@/*` → `./src/*`

### Pre-commit Hook (lint-staged + husky)
```text
TypeScript/JavaScript: biome check --write + vitest related --run
JSON/Markdown/CSS: biome format --write
```

## フロントエンド ディレクトリ構造
```
frontend/src/
├── app/                 # Next.js App Router ページ
│   ├── search/          # 検索ページ (team, match)
│   ├── upload/          # アップロードページ
│   ├── info/            # お知らせページ
│   └── sumdownload/     # 一括ダウンロードページ
├── components/          # 再利用可能コンポーネント
│   ├── ui/              # shadcn/ui コンポーネント
│   ├── search/          # 検索関連
│   ├── upload/          # アップロード関連
│   └── layout/          # レイアウト関連
├── lib/                 # ユーティリティ
│   ├── api/             # API クライアント
│   └── utils/           # 汎用ユーティリティ
├── hooks/               # カスタムフック
├── stores/              # Zustand状態管理
├── types/               # TypeScript型定義
├── schemas/             # Zod バリデーション
└── __tests__/           # ユニットテスト
```

## バックエンド ディレクトリ構造
```
hono-worker/src/
├── index.ts             # エントリーポイント
├── routes/              # API ルート定義
│   ├── auth.ts          # 認証エンドポイント
│   ├── events.ts        # イベント管理
│   ├── files.ts         # ファイル管理
│   └── discord.ts       # Discord連携
├── middleware/          # ミドルウェア
│   ├── auth.ts          # JWT認証
│   ├── cors.ts          # CORS設定
│   └── error.ts         # エラーハンドリング
├── services/            # ビジネスロジック
├── types/               # 型定義
│   └── bindings.ts      # Cloudflare bindings
└── utils/               # ユーティリティ
```

## 命名規約
- **コンポーネント**: PascalCase (`SearchResults.tsx`)
- **クライアントコンポーネント**: `Client${Name}.tsx`
- **フック**: camelCase, use プレフィックス (`useSearch.ts`)
- **ストア**: camelCase (`xxxStore.ts`)
- **スキーマ**: camelCase (`xxx.ts` in schemas/)
- **ユーティリティ**: camelCase (`formatDate.ts`)
- **型/インターフェース**: PascalCase (`FileData`, `SearchParams`)
- **定数**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **ページ**: `page.tsx`

## API設計パターン

**エンドポイント形式**: `/api/v2/...`

**認証方式**: HttpOnly Cookie + credentials: 'include'

**レスポンス形式**:
- 成功: `{ data: {...}, message?: string }`
- エラー: `{ message: string, errors?: { [field]: string[] } }`

**エラーハンドリング**:
- 401: 認証エラー → 日本語メッセージ自動変換
- 422: バリデーション → フィールド別エラー表示
- 500+: サーバーエラー → 汎用メッセージ
