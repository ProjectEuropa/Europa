#!/bin/sh
set -eu

BACKUP_DIR="/backups"
FILE_NAME="db_backup_$(date +%Y%m%d%H%M%S).sql"

export PGPASSWORD="${DB_PASSWORD}"
pg_dump -h pg -U ${DB_USERNAME} -d ${DB_DATABASE} -f ${BACKUP_DIR}/${FILE_NAME} -F p -w
