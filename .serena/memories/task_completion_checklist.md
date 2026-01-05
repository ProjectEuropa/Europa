# タスク完了時のチェックリスト

## コード変更後の必須チェック

### フロントエンド (frontend/)
1. **Lint**: `npm run lint`
2. **フォーマット**: `npm run format:fix`
3. **型チェック**: `npx tsc --noEmit`
4. **単体テスト**: `npm run test`
5. **ビルド確認**: `npm run build`
6. **E2Eテスト**: `npm run test:e2e` (必要に応じて)

### バックエンド (hono-worker/)
1. **Lint**: `npm run lint`
2. **フォーマット**: `npm run format:fix`
3. **型チェック**: `npx tsc --noEmit`
4. **テスト**: `npm run test`

## コミット前の確認項目
- [ ] 機能が期待通り動作する
- [ ] 型エラーがない
- [ ] テストが通る
- [ ] 不要なコンソール出力やデバッグコードがない
- [ ] セキュリティベストプラクティスに従っている
- [ ] 既存のコードスタイルに合致している

## 注意事項
- **コミット**: ユーザーが明示的に依頼した場合のみ実行
- **環境変数**: 秘匿情報はコミットしない (.env は .gitignore に含まれる)
- **依存関係**: 新しいライブラリ追加時は既存の使用状況を確認
- **静的エクスポート**: `output: 'export'` のため SSR 機能は使用不可

## CI/CD
- **frontend-ci.yml**: PR/push 時に自動実行
- **backend-ci.yml**: PR/push 時に自動実行
- Lint/Type-check は non-blocking (警告のみ)
- テストは blocking (失敗で CI 失敗)
