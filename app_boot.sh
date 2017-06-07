#!/bin/bash

# Artisan commands
/app/.heroku/php/bin/php /app/artisan clear-compiled
/app/.heroku/php/bin/php /app/artisan optimize


web: vendor/bin/heroku-php-nginx -i custom_php.ini -C nginx_app.conf public/