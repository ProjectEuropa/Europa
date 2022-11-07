FROM php:7.4-fpm

ARG NEW_RELIC_AGENT_VERSION
ARG NEW_RELIC_LICENSE_KEY
ARG NEW_RELIC_APPNAME

RUN curl -L https://download.newrelic.com/php_agent/archive/${NEW_RELIC_AGENT_VERSION}/newrelic-php5-${NEW_RELIC_AGENT_VERSION}-linux.tar.gz | tar -C /tmp -zx \
    && export NR_INSTALL_USE_CP_NOT_LN=1 \
    && export NR_INSTALL_SILENT=1 \
    && /tmp/newrelic-php5-${NEW_RELIC_AGENT_VERSION}-linux/newrelic-install install \
    && rm -rf /tmp/newrelic-php5-* /tmp/nrinstall*

RUN sed -i -e "s/REPLACE_WITH_REAL_KEY/${NEW_RELIC_LICENSE_KEY}/" \
    -e "s/newrelic.appname[[:space:]]=[[:space:]].*/newrelic.appname=\"${NEW_RELIC_APPNAME}\"/" \
    -e '$anewrelic.daemon.address="newrelic-php-daemon:31339"' \
    $(php -r "echo(PHP_CONFIG_FILE_SCAN_DIR);")/newrelic.ini

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

RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
apt-get install -y nodejs
