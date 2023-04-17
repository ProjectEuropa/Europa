#!/bin/sh
. /etc/environment

if [ "${ENVIRONMENT:-0}" = "staging" ]; then
  echo "restore!" >> /var/log/cron.log 2>&1

  export PGPASSWORD="${DB_PASSWORD}"
  psql -h pg -U ${DB_USERNAME} -d postgres -c "DROP DATABASE IF EXISTS ${DB_DATABASE};"
  psql -h pg -U ${DB_USERNAME} -d postgres -c "CREATE DATABASE ${DB_DATABASE} WITH OWNER ${DB_USERNAME};"

  BACKUP_DIR="/backups"
  LATEST_BACKUP=$(ls -t ${BACKUP_DIR} | head -n 1)

  psql -h pg -U ${DB_USERNAME} -d ${DB_DATABASE} -f ${BACKUP_DIR}/${LATEST_BACKUP}
fi
