FROM node:20 as node

FROM php:8.1-fpm

COPY --from=node /usr/local/bin/ /usr/local/bin/
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules

ARG NEW_RELIC_AGENT_VERSION
ARG NEW_RELIC_LICENSE_KEY
ARG NEW_RELIC_APPNAME

RUN apt update \
    && apt install -y \
    git \
    zip \
    unzip \
    vim \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    zlib1g-dev \
    libzip-dev

RUN curl -L https://download.newrelic.com/php_agent/release/newrelic-php5-11.3.0.16-linux.tar.gz -o /tmp/newrelic-php5-11.3.0.16-linux.tar.gz \
    && tar -xzf /tmp/newrelic-php5-11.3.0.16-linux.tar.gz -C /tmp

WORKDIR /tmp/newrelic-php5-11.3.0.16-linux
RUN ./newrelic-install install

RUN sed -i -e "s/REPLACE_WITH_REAL_KEY/${NEW_RELIC_LICENSE_KEY}/" \
    -e "s/newrelic.appname[[:space:]]=[[:space:]].*/newrelic.appname=\"${NEW_RELIC_APPNAME}\"/" \
    -e '$anewrelic.daemon.address="newrelic-php-daemon:31339"' \
    $(php -r "echo(PHP_CONFIG_FILE_SCAN_DIR);")/newrelic.ini

RUN rm -rf /tmp/newrelic-php5-linux /tmp/newrelic-php5-linux.tar.gz

RUN cd /usr/bin && curl -s http://getcomposer.org/installer | php -- --install-dir=/usr/bin && ln -s /usr/bin/composer.phar /usr/bin/composer

RUN apt update \
    && apt install -y libpq-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql mysqli zip

WORKDIR /var/www/html

RUN npm install -g npm@10.8.3
