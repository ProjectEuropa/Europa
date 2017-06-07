#!/bin/bash

# Artisan commands
/app/.heroku/php/bin/php /app/artisan clear-compiled
/app/.heroku/php/bin/php /app/artisan optimize


vendor/bin/heroku-php-apache2 -i .custom_php.ini 
vendor/bin/heroku-php-apache2 public/