FROM postgres:14.2

RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client-14 \
    cron \
    && rm -rf /var/lib/apt/lists/*

COPY entrypoint.sh /entrypoint.sh
