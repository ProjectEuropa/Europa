FROM postgres:14.2

ENV TZ=Asia/Tokyo

RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client-14 \
    rsyslog \
    vim \
    cron \
    tzdata \
    openssh-client \
    && rm -rf /var/lib/apt/lists/*

COPY /ssh_keys/id_rsa /root/.ssh/id_rsa.pub
RUN chmod 600 /root/.ssh/id_rsa

ADD crontab /etc/cron.d/database_backup
RUN chmod 0644 /etc/cron.d/database_backup

ADD database_backup.sh /database_backup.sh
RUN chmod +x /database_backup.sh

RUN touch /var/log/cron.log

ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_DATABASE
ARG RUN_CRON
RUN echo "DB_USERNAME=$DB_USERNAME" >> /etc/environment && \
    echo "DB_PASSWORD=$DB_PASSWORD" >> /etc/environment && \
    echo "DB_DATABASE=$DB_DATABASE" >> /etc/environment && \
    echo "RUN_CRON=$RUN_CRON" >> /etc/environment

CMD cron && tail -f /var/log/cron.log
