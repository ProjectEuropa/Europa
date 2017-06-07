#!/bin/bash

# Artisan commands
/app/.heroku/php/bin/php /app/artisan clear-compiled
/app/.heroku/php/bin/php /app/artisan optimize

#custom_php_setting
vendor/bin/heroku-php-apache2 -i custom_php.ini .


# Boot up!
vendor/bin/heroku-php-apache2 public/