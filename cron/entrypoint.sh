#!/bin/sh
set -eu

if [ "${RUN_CRON:-0}" = "1" ]; then
  # バックアップスクリプトに実行権限を付与
  chmod +x /etc/periodic/backup/database_backup.sh

  # 毎日深夜12時にバックアップを実行するcronジョブを追加
  echo "0 0 * * * root /etc/periodic/backup/database_backup.sh" > /etc/cron.d/database_backup

  # ジョブファイルに実行権限を付与
  chmod 0644 /etc/cron.d/database_backup

  # crondをフォアグラウンドで実行
  exec cron -f
else
  # 無限ループでコンテナを起動し続ける
  while true; do sleep 3600; done
fi
