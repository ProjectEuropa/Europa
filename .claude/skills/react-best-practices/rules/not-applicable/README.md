# Non-applicable Rules for Project Europa

このディレクトリには、Project Europa のアーキテクチャでは利用できない、または適用外のルールが格納されています。

## なぜ非適用なのか？

Project Europa フロントエンドは **Next.js 静的エクスポート (`output: 'export'`)** を使用しています。このため、以下の機能が利用できません：

- **React Server Components (RSC) / Server Actions**: Node.js ランタイム（サーバー）が必要なため、静的エクスポートでは使用できません。(`server-*.md`)
- **Streaming SSR / Suspense Boundaries**: サーバー側でのストリーミング機能が必要なため、静的エクスポートには適用されません。(`async-suspense-boundaries.md`)

将来的にサーバーサイド機能（Edge Runtime 等）を導入する場合は、これらのルールを `rules/` 直下に戻して再評価してください。
