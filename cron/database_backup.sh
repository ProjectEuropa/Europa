#!/bin/sh
. /etc/environment

if [ "${RUN_CRON:-0}" = "1" ]; then
  echo "backup!" >> /var/log/cron.log 2>&1

  BACKUP_DIR="/backups"
  FILE_NAME="db_backup_$(date +%Y%m%d%H%M%S).sql"

  export PGPASSWORD="${DB_PASSWORD}"
  pg_dump -h pg -U ${DB_USERNAME} -d ${DB_DATABASE} -f ${BACKUP_DIR}/${FILE_NAME} -F p -w

  scp -i /root/.ssh/id_rsa -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ${BACKUP_DIR}/${FILE_NAME} ssh.from.production@${SSH_HOST}:/home/project.europa/Europa/backups
fi
