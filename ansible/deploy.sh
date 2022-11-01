docker compose -f docker-compose.server.yml up -d --build

docker compose -f docker-compose.server.yml run php-fpm composer install --no-dev

docker compose -f docker-compose.server.yml run php-fpm php artisan key:generate

docker compose -f docker-compose.server.yml run php-fpm php artisan migrate --force

docker compose -f docker-compose.server.yml run php-fpm php artisan cache:clear
docker compose -f docker-compose.server.yml run php-fpm php artisan config:clear
docker compose -f docker-compose.server.yml run php-fpm php artisan config:cache
docker compose -f docker-compose.server.yml run php-fpm php artisan view:cache

docker compose -f docker-compose.server.yml run php-fpm npm i
docker compose -f docker-compose.server.yml run php-fpm npm run prod

chmod 777 -R public
chmod 777 storage/logs
