## 環境構築手順

### PHPビルトインサーバーで一旦

- PHP 8.1
- Node.js 18.x

```console
$ composer install
$ cp .env.example .env
$ php artisan key:generate
$ npm install
$ npm run dev
```

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
DB_CONNECTION=pgsql
DB_HOST=pg-pe-12
DB_PORT=5432
DB_DATABASE=testdb
DB_USERNAME=root
DB_PASSWORD=password
```



