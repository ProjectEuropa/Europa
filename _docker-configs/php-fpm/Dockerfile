FROM php:7.4-fpm

RUN cd /usr/bin && curl -s http://getcomposer.org/installer | php -- --install-dir=/usr/bin && ln -s /usr/bin/composer.phar /usr/bin/composer
RUN apt update \
&& apt install -y \
git \
zip \
unzip \
vim \
libfreetype6-dev libjpeg62-turbo-dev libpng-dev zlib1g-dev libzip-dev

RUN apt update \
    && apt install -y libpq-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql mysqli zip

WORKDIR /var/www/html

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
apt-get install -y nodejs
