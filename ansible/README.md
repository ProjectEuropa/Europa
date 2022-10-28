# 初期設定

```
$ export STG_HOST="${STG_IP}"
$ export STG_USER="${STG_SSH_USER}"
$ export STG_PRIVATE_KEY_PATH="${STG_SSH_PRIVATE_KEY_PATH}"

$ ansible-playbook -k -i inventory.yml setup-init-staging.yml --syntax-check #構文チェック
$ ansible-playbook -k -i inventory.yml setup-init-staging.yml --check #リハーサル
$ ansible-playbook -k -i inventory.yml setup-init-staging.yml #実行

```

# 2回目以降
```
$ export STG_USER="${STG_SSH_ADD_USER}"
$ ansible-playbook -i inventory.yml setup-init-staging.yml --syntax-check #構文チェック
$ ansible-playbook -i inventory.yml setup-init-staging.yml --check #リハーサル
$ ansible-playbook -i inventory.yml setup-init-staging.yml #実行
```



