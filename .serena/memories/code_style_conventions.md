# コードスタイルと規約

## PHP (Laravel) スタイル
- **PSR-4** オートローディング (`App\` → `app/`)
- **DocBlock**: メソッドとプロパティにPHPDoc記載
- **型宣言**: 引数と戻り値の型を明示
- **命名規約**: 
  - クラス: PascalCase
  - メソッド: camelCase
  - プロパティ: snake_case (配列)

## TypeScript/React スタイル (Biome)
- **インデント**: 2スペース
- **行幅**: 80文字
- **クォート**: シングルクォート (JS), ダブルクォート (JSX)
- **セミコロン**: 必須
- **トレイリングカンマ**: ES5準拠
- **型安全性**: strict mode, noExplicitAny警告
- **インポート**: 自動整理有効

## ディレクトリ構造
### バックエンド
- `app/`: Laravel ビジネスロジック
- `app/Http/Controllers/Api/V1/`: V1 API
- `app/Filament/Resources/`: 管理パネル
- `routes/api.php`: ルート定義

### フロントエンド
- `src/app/`: Next.js App Router
- `src/components/`: 再利用可能コンポーネント
- `src/lib/api/`: API クライアント
- `src/types/`: TypeScript型定義
- `src/schemas/`: Zod バリデーション