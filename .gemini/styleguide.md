# プロジェクト Europa レビューガイドライン

## 言語
- Summary of Changesを日本語でコメントしてください
- レビューのコメントも日本語でコメントしてください

## 技術スタック
- **Frontend**: Next.js 16, React 19, TypeScript 5 (strict), TailwindCSS 4, shadcn/ui, Zustand 5, TanStack Query 5
- **Backend**: Hono 4, Cloudflare Workers, Neon PostgreSQL, Zod 4, R2
- **テスト**: Vitest (ユニット), Playwright (E2E)
- **Lint/Format**: Biome 2

## コーディング規約
- `any` の使用禁止（frontend: error, backend: warn）
- パスエイリアス: `@/*` → `./src/*`（frontend）
- API形式: `/api/v2/...`
- セマンティックロケーター優先（E2Eテスト: `getByRole` > `getByLabel` > `getByText` > `getByTestId`）

## レビュー重点項目
1. 型安全性（`any` がないか）
2. SQLインジェクション対策（パラメータ化クエリ）
3. Zodバリデーションの適切さ
4. Zustand persist設定の正確さ（tokenは永続化しない）
5. テストカバレッジ（変更に対応するテストがあるか）
6. Cookie設定（HttpOnly, Secure, SameSite）
7. CORS設定の妥当性
