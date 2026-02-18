---
name: e2e-debug
description: |
  Analyze and fix failing E2E tests.
  Triggers: "テストが失敗", "CIが落ちている", "テストをデバッグ", "test failed", "flaky test"
  Use when: E2E tests are failing, tests are flaky/unstable, error messages need investigation.
  Outputs: Fixed Page Object and spec files, error analysis reports.
---

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

#### net::ERR_ABORTED（並列実行時）

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
```

**原因**: Next.js開発サーバー（Turbopack/HMR）が複数の同時接続で不安定

**解決策**:
```typescript
// playwright.config.ts でワーカー数を制限
workers: isCI ? 1 : 2,  // ローカルでは2に制限
```

**デバッグ手順**:
1. `--workers=1` で実行して問題が解消するか確認
2. 解消する場合はワーカー数の問題
3. 解消しない場合は別の原因を調査

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

---

## CI自動修復モード

GitHub Actionsから呼び出された場合の対応手順。

### 1. 失敗レポートの分析

`test-results/` からエラー情報を取得:

```bash
# レポートの構造を確認
ls -la test-results/

# JSONレポートの存在確認
if [ -f "test-results/test-results.json" ]; then
  # JSONレポートから失敗テストを抽出
  # playwright.config.ts: outputFile='test-results/test-results.json'
  cat test-results/test-results.json | jq '.suites[].specs[] | select(.ok | not) | {title: .title, file: .file}'

  # 詳細なエラーメッセージを取得
  cat test-results/test-results.json | jq '.suites[].specs[] | select(.ok | not) | .tests[].results[].error.message'
else
  echo "JSON report not found. Check test-results/ for screenshots and videos."
  # スクリーンショットやエラーログから情報を取得
  # Note: This only lists file paths. Manually inspect these files:
  # - Screenshots (.png): Show UI state at failure
  # - Videos (.webm): Show test execution leading to failure
  find test-results/ -name "*.png" -o -name "*.webm" 2>/dev/null
fi
```

**注意**: JSONレポートを使用してください。HTMLレポートの構造はPlaywrightのバージョンで変わる可能性があります。JSONレポートが存在しない場合は、スクリーンショットや動画から情報を取得してください。

確認項目:
- 失敗したテスト名
- エラーメッセージ
- スクリーンショット/動画（test-results/配下）

### 2. 失敗原因の分類

| エラータイプ | 対処法 |
|-------------|--------|
| ロケータが見つからない | 正しいセマンティックロケータを特定 |
| タイムアウト | waitFor追加、タイムアウト値調整 |
| API 422/500 | モックデータ更新 or API変更確認 |
| Strict Mode違反 | `.first()` 追加 or より具体的なロケータ |
| URL不一致 | リダイレクト条件の確認 |

### 3. ロケータ変換ルール

HTMLから正しいロケータを生成する際の優先順位:

| HTML要素 | 属性 | 生成ロケータ |
|----------|------|-------------|
| `<input>` | `aria-label="X"` | `getByLabel('X')` |
| `<input>` | `<label>X</label>` | `getByLabel('X')` |
| `<button>` | テキスト "X" | `getByRole('button', { name: 'X' })` |
| `<a>` | テキスト "X" | `getByRole('link', { name: 'X' })` |
| `<h1-h6>` | テキスト "X" | `getByRole('heading', { name: 'X' })` |
| 任意 | `data-testid="X"` | `getByTestId('X')` （最終手段） |

### 4. 修正適用後

```bash
# テストを実行して確認
npm run test:e2e -- [test-file].spec.ts

# 成功したらコミット
git add frontend/e2e/
git commit -m "fix(e2e): 自動修復 - [修正内容の要約]"
```

### 5. 自動修復の制限

以下の場合は人間の介入が必要:
- ビジネスロジックの変更が必要な場合
- 複数ファイルにまたがる大規模な変更
- セキュリティに関わるテストの変更
- モック vs 実API の切り替えが必要な場合
