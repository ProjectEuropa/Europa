---
description: 新しいReactコンポーネントを作成する
---

# 新コンポーネント作成

// turbo-all

## 手順

1. コンポーネント名を確認し、`frontend/src/components/` の適切なディレクトリに配置先を決定
2. shadcn/ui + TailwindCSS 4 でコンポーネントを実装
   - TypeScript strict モードに適合する型定義を含める
   - アクセシビリティ（aria属性、キーボード操作）を考慮
   - インポートは `@/` パスエイリアスを使用
3. 必要に応じて Vitest ユニットテストを作成（`frontend/src/__tests__/` 配下）
4. Biome lint確認:
```bash
cd /Users/masato/Desktop/spa-auth/Europa/frontend && npm run check:fix
```
5. 型チェック確認:
```bash
cd /Users/masato/Desktop/spa-auth/Europa/frontend && npm run type-check
```

## 規約
- `frontend/CLAUDE.md` のコーディング規約に従う
- Biome: インデント2スペース、セミコロン付与、シングルクォート
- `any` 禁止
