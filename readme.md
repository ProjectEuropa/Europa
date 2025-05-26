# Project Europa

このリポジトリは、LaravelバックエンドとNext.jsフロントエンドで構成されるProject Europaのコードベースを含んでいます。

## 環境構築手順

### 技術スタック

#### バックエンド
*   **PHP:** 8.4
*   **Laravel Framework:** 11.x

#### フロントエンド
*   **Next.js:** 15.x (frontendディレクトリにあります)
*   **React:** 19.x

### PHPビルトインサーバーで開発する場合

1.  **プロジェクトルートに移動:**
    ```bash
    cd /workspace/Europa
    ```
2.  **PHP依存関係のインストール:**
    ```bash
    composer install
    ```
3.  **環境ファイルのコピー:**
    ```bash
    cp .env.example .env
    ```
4.  **アプリケーションキーの生成:**
    ```bash
    php artisan key:generate
    ```
5.  **データベースマイグレーションの実行 (必要であればシーダーも):**
    ```bash
    php artisan migrate --seed
    ```
6.  **フロントエンドの依存関係のインストール:**
    ```bash
    cd frontend
    npm install
    # または yarn install
    # または pnpm install
    # または bun install
    cd ..
    ```
7.  **Laravel開発サーバーの起動:**
    ```bash
    php artisan serve --host 0.0.0.0 --port 50756
    ```
8.  **Next.js開発サーバーの起動 (新しいターミナルで):**
    ```bash
    cd frontend
    npm run dev
    ```
    (通常、`http://localhost:3000` または `http://localhost:3002` で起動します)

### Dockerを使う場合

```console
$ cp .env.example .env
$ docker compose -f docker-compose.server.yml up -d --build
$ docker compose -f docker-compose.server.yml run php-fpm composer install
$ docker compose -f docker-compose.server.yml run php-fpm php artisan migrate
$ docker compose -f docker-compose.server.yml run php-fpm npm i
$ docker compose -f docker-compose.server.yml run php-fpm npm run dev
```

#### .envの記述例

```.env
PG_USER=postgres
DB_CONNECTION=pgsql
DB_HOST=pg
DB_PORT=5432
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=password
```

## /etc/hostsの設定例


```
127.0.0.1 local.europa.com #追加
```


