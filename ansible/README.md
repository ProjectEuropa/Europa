# 初期設定

```
$ source ./secrets-env.sh

$ ansible-playbook -k -i inventory.yml setup-init-staging.yml --syntax-check #構文チェック
$ ansible-playbook -k -i inventory.yml setup-init-staging.yml --check #リハーサル
$ ansible-playbook -k -i inventory.yml setup-init-staging.yml #実行

```

# 2回目以降
```
$ source ./secrets-env.sh
$ ansible-playbook -i inventory.yml setup-init-staging.yml --syntax-check #構文チェック
$ ansible-playbook -i inventory.yml setup-init-staging.yml --check #リハーサル
$ ansible-playbook -i inventory.yml setup-init-staging.yml #実行
```

#　デプロイ

```
$ ansible-playbook -i inventory.yml deploy-staging.yml --syntax-check #構文チェック
$ ansible-playbook -i inventory.yml deploy-staging.yml --check #リハーサル
$ ansible-playbook -i inventory.yml deploy-staging.yml #実行
```


