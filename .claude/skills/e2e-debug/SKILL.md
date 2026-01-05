# E2E Test Debugger

E2Eテストの失敗を分析し、修正するスキルです。

## When to use

- E2Eテストが失敗しているとき
- ユーザーが「E2Eテストが失敗している」「テストをデバッグして」と依頼したとき
- テストがフレーキー（不安定）なとき
- エラーメッセージの原因を特定する必要があるとき

## Instructions

### 1. エラーを分析

テストを実行し、エラーメッセージを確認:

```bash
npm run test:e2e -- [test-file].spec.ts
```

### 2. 一般的なエラーパターンと解決策

#### Strict Mode Violation

```
Error: strict mode violation: getByText(/テキスト/) resolved to 2 elements
```

**原因**: ロケータが複数の要素にマッチ

**解決策**:
```typescript
// 方法1: .first() を使用
page.getByText(/テキスト/).first()

// 方法2: より具体的なロケータ
page.getByRole('main').getByText(/テキスト/)

// 方法3: exact マッチ
page.getByRole('button', { name: 'ログイン', exact: true })
```

#### Element Not Found / Timeout

```
Error: Timeout 30000ms exceeded waiting for getByRole('button')
```

**原因**: 要素が見つからない、または表示されない

**デバッグ手順**:
1. UIを確認（`npx playwright test --headed`）
2. ロケータを確認（Playwright Inspector使用）
3. 待機条件を確認

**解決策**:
```typescript
// タイムアウトを延長
await expect(element).toBeVisible({ timeout: 10000 });

// 正しいロケータを使用（実際のUIを確認）
page.getByRole('button', { name: /実際のボタン名/ })
```

#### Navigation Timeout

```
Error: page.goto: Timeout 30000ms exceeded
```

**解決策**:
```typescript
// playwright.config.ts でタイムアウト調整
navigationTimeout: 60000,

// または個別に
await page.goto('/path', { timeout: 60000 });
```

#### Hydration Issues (Zustand)

```
Error: Expected URL to be "/dashboard" but got "/login"
```

**原因**: SPAのハイドレーションタイミング

**解決策**:
```typescript
// ストレージ設定後にリロード
await page.evaluate(() => {
  localStorage.setItem('auth-storage', JSON.stringify({...}));
});
await page.reload();

// または、APIモックを使用してログイン
await mockLoginSuccess(page, user);
await loginPage.login(email, password);
```

#### API Mock Not Working

```
Error: Route handler not called
```

**解決策**:
```typescript
// ルートを先に設定してからナビゲート
await page.route('**/api/v2/endpoint', handler);
await page.goto('/page');

// URLパターンを確認
await page.route('**/api/v2/**', handler);  // より広いパターン
```

### 3. デバッグツール

#### Playwright Inspector

```bash
npx playwright test --debug [test-file].spec.ts
```

#### Headed Mode

```bash
npx playwright test --headed [test-file].spec.ts
```

#### Trace Viewer

```bash
npx playwright test --trace on [test-file].spec.ts
npx playwright show-trace test-results/[test-name]/trace.zip
```

#### スクリーンショット

```typescript
// テスト内でスクリーンショット
await page.screenshot({ path: 'debug.png' });

// 失敗時に自動保存（playwright.config.ts）
use: {
  screenshot: 'only-on-failure',
}
```

### 4. 修正を適用

Page Objectまたはテストファイルを修正し、再度テストを実行:

```bash
npm run test:e2e -- [test-file].spec.ts
```

## Checklist

- [ ] エラーメッセージを正確に読む
- [ ] ロケータが実際のUIと一致するか確認
- [ ] APIモックのタイミングを確認
- [ ] 非同期処理の待機を確認
- [ ] Strict Mode違反がないか確認

## Output

1. エラーの原因分析
2. 修正されたコード
3. テスト成功の確認
