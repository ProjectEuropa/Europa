# コードスタイルと規約

## TypeScript/React スタイル (Biome)
- **インデント**: 2スペース
- **行幅**: 80文字
- **クォート**: ダブルクォート
- **セミコロン**: 必須
- **トレイリングカンマ**: all
- **型安全性**: strict mode, noExplicitAny警告
- **インポート**: 自動整理有効

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
├── types/               # TypeScript型定義
└── schemas/             # Zod バリデーション
```

## バックエンド ディレクトリ構造
```
hono-worker/src/
├── index.ts             # エントリーポイント
├── routes/              # API ルート定義
│   ├── files.ts
│   ├── auth.ts
│   └── ...
├── middleware/          # ミドルウェア
│   ├── auth.ts
│   └── cors.ts
├── services/            # ビジネスロジック
├── types/               # 型定義
│   └── bindings.ts      # Cloudflare bindings
└── utils/               # ユーティリティ
```

## 命名規約
- **コンポーネント**: PascalCase (`SearchResults.tsx`)
- **フック**: camelCase, use プレフィックス (`useSearch.ts`)
- **ユーティリティ**: camelCase (`formatDate.ts`)
- **型/インターフェース**: PascalCase (`FileData`, `SearchParams`)
- **定数**: UPPER_SNAKE_CASE (`API_BASE_URL`)
