このプロジェクトの概要です。

## 言語

### バックエンド
- PHP8.4

### フロントエンド
- HTML
- CSS
- JavaScript

2. フレームワーク

バックエンド
- Laravel 10.x

フロントエンド
-	Vue 2
- Vuetify 2
- Node.js 20

## 環境構築方法

- Docker for Macをインストールしていること

### /etc/hostsの設定例
```
127.0.0.1 local.europa.com #追加
```

ターミナルで以下を実行する
```console
cp .env.example .env
docker compose -f docker-compose.server.yml up -d --build

docker compose -f docker-compose.server.yml exec php-fpm composer install

docker compose -f docker-compose.server.yml exec php-fpm php artisan key:generate

docker compose -f docker-compose.server.yml exec php-fpm php artisan migrate

docker compose -f docker-compose.server.yml exec php-fpm php artisan cache:clear
docker compose -f docker-compose.server.yml exec php-fpm php artisan config:clear

docker compose -f docker-compose.server.yml exec php-fpm npm i
docker compose -f docker-compose.server.yml exec php-fpm npm run prod

chmod 777 -R public
chmod 777 -R storage
```

https://local.europa.com/
にアクセスする


### 主な機能と用途

	1.	ユーザ認証・管理
ログイン、ログアウト、ユーザの新規登録などを行う仕組み。
	2.	簡易的なCRUD処理
	•	ユーザ情報、ファイルアップロードなど、作成・読み取り・更新・削除するためのAPIと画面を備えています
	3.	その他の付加機能
	•	プロフィール編集、ファイルアップロードなど

### 改善すべき点

AI サポートを活用してプロジェクトをアップデートし、フロントエンドを Vue2 + Vuetify2 から Vue3 + Vuetify3 に移行する際に、あわせて検討したほうが良い点をまとめます。

(1) フロントエンドの改善
	1.	Vue 3 への移行に伴うComposition APIへの対応
	•	従来のオプションAPI (data, methods, computed など) をどの程度利用しているかを確認し、Vue 3 の Composition API へ移行するかどうかを検討します。
	•	チーム全体で書き方を統一するため、 ESLint + Prettier + Vue 3 用の設定を見直すとよいでしょう。
	2.	Vuetify 3 への移行
	•	Vuetify 2 系から 3 系にかけてはコンポーネント名やプロパティ、CSS クラスなどが変更されています。
	•	コンポーネントの置き換えやスタイルの調整にかなりの工数が必要です。
	•	SSR (Server Side Rendering) やユニバーサルアプリケーションで使っている場合には、公式ドキュメントを確認しながら段階的に移行する必要があります。
	3.	依存パッケージの整理
	•	不要になったパッケージが残っている場合やバージョンが古いまま放置されている場合があるため、Vue 3 への移行時にまとめてアップデート・整理することをおすすめします。

### まずやること

1. Vue 3 への移行
2. Vuetify 3 への移行
3. トップページがコンパイルエラーなく表示されること
4. トップページでコンソールエラーや警告が出ないこと


