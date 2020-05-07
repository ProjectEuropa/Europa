# 見た目確認用

[こちらから](https://stg-europa.herokuapp.com/)

## 環境構築手順

### PHPビルトインサーバーで一旦

- PHP 7.3
- Node.js 12

```console
$ composer install
$ cp .env.example .env
$ php artisan key:generate
$ npm install
$ npm run dev
```

### Dockerを使う場合

```console
$ cd _docker-configs
$ docker-compose up -d
$ docker-compose exec php-fpm sh #php-fpmコンテナ内に入る
/var/www/html # composer install
/var/www/html # cp .env.example .env
/var/www/html # php artisan key:generate
/var/www/html # npm install
/var/www/html # npm run dev
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



