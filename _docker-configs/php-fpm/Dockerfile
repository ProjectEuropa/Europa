FROM node:20 as node

FROM php:8.4-fpm

COPY --from=node /usr/local/bin/ /usr/local/bin/
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules

ARG NEW_RELIC_AGENT_VERSION
ARG NEW_RELIC_LICENSE_KEY
ARG NEW_RELIC_APPNAME
ARG NEWRELIC_VERSION="11.9.0.23"

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
    libzip-dev \
    libicu-dev && \
    docker-php-ext-install intl

RUN curl -L https://download.newrelic.com/php_agent/release/newrelic-php5-${NEWRELIC_VERSION}-linux.tar.gz -o /tmp/newrelic-php-agent.tar.gz \
    && tar -xzf /tmp/newrelic-php-agent.tar.gz -C /tmp

RUN find /tmp/newrelic-php5-${NEWRELIC_VERSION}-linux -name "newrelic.ini" 2>/dev/null
# New Relic PHP Agent をインストール
WORKDIR /tmp/newrelic-php5-${NEWRELIC_VERSION}-linux
RUN ./newrelic-install install
RUN echo "extension=newrelic.so" > /usr/local/etc/php/conf.d/newrelic.ini \
    && echo "newrelic.license=\"${NEW_RELIC_LICENSE_KEY}\"" >> /usr/local/etc/php/conf.d/newrelic.ini \
    && echo "newrelic.appname=\"${NEW_RELIC_APPNAME}\""   >> /usr/local/etc/php/conf.d/newrelic.ini \
    && echo "newrelic.daemon.address=\"newrelic-php-daemon:31339\"" >> /usr/local/etc/php/conf.d/newrelic.ini
RUN rm -rf /tmp/newrelic-php5-linux /tmp/newrelic-php5-linux.tar.gz

RUN cd /usr/bin && curl -s http://getcomposer.org/installer | php -- --install-dir=/usr/bin && ln -s /usr/bin/composer.phar /usr/bin/composer

RUN apt update \
    && apt install -y libpq-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql mysqli zip

WORKDIR /var/www/html

RUN npm install -g npm@10.8.3
