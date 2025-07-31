# データベースモデル構造

## 主要モデル

### User (app/User.php)
- **認証**: Laravel Sanctum HasApiTokens
- **管理パネルアクセス**: `canAccessPanel()` - email設定ベース
- **属性**: name, email, password, api_token
- **リレーション**: Filament管理機能

### File (app/File.php)
- **ファイル管理**: アップロード・ダウンロード機能
- **時限アクセス**: `downloadable_at` タイムスタンプで制御
- **検索機能**: 複数フィールドでのキーワード検索

### Event (app/Event.php)
- **イベント管理**: イベント情報の管理

## API コントローラー構造
- **V1 API**: `app/Http/Controllers/Api/V1/`
  - FileController: ファイル操作
  - UserController: ユーザー管理
  - EventController: イベント管理
  - SearchController: 検索機能
  - Auth/: 認証関連 (Login, Register, Reset等)

- **レガシーAPI**: `app/Http/Controllers/Api/`
  - 後方互換性維持

## 認証・認可
- **Sanctum**: SPA用トークン認証
- **Filament**: 管理パネル (`config('app.panel_email')` で制御)
- **Basic Auth**: ステージング環境保護