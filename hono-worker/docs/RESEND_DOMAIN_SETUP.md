# Resend ドメイン検証セットアップ手順

## 概要

Resendでメールを送信するには、送信元ドメインの検証が必要です。この手順書では、Resendでドメインを検証し、メール送信を有効化する方法を説明します。

## 前提条件

- Resendアカウント（https://resend.com/）
- ドメインの管理権限（DNS設定を変更できること）
- DNSプロバイダーへのアクセス（Cloudflare、Route53など）

## 1. Resendダッシュボードでドメインを追加

### 1.1 ドメイン追加画面へ移動

1. [Resend Dashboard](https://resend.com/domains) にログイン
2. 左側メニューから **「Domains」** を選択
3. **「Add Domain」** ボタンをクリック

### 1.2 ドメイン情報の入力

```
Domain: project-europa.work
（使用するドメイン名を入力）
```

4. **「Add」** ボタンをクリック

### 1.3 DNSレコード情報の確認

追加後、Resendが以下のような情報を表示します：

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DNS Records Required
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 TXT Record (ドメイン検証用)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type:    TXT
Name:    _resend
Value:   resend-verification-xxxxxxxxxxxxxxxx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 MX Record (メール送信用)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type:     MX
Name:     @ (または project-europa.work)
Priority: 10
Value:    feedback-smtp.us-east-1.amazonses.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**重要**: この情報をコピーしてメモ帳などに保存しておいてください。

## 2. DNSレコードの設定

### 2.1 Cloudflareでの設定方法

#### ステップ1: Cloudflareダッシュボードへアクセス

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
2. ドメイン一覧から **project-europa.work** を選択
3. 左側メニューから **「DNS」** → **「Records」** を選択

#### ステップ2: TXTレコードの追加（ドメイン検証用）

4. **「Add record」** ボタンをクリック
5. 以下の情報を入力：

```
Type:          TXT
Name:          _resend
Content:       resend-verification-xxxxxxxxxxxxxxxx
                ↑ Resendが表示した値をコピー＆ペースト
TTL:           Auto
Proxy status:  DNS only (灰色の雲アイコン)
```

6. **「Save」** をクリック

#### ステップ3: MXレコードの追加（メール送信用）

7. 再度 **「Add record」** ボタンをクリック
8. 以下の情報を入力：

```
Type:          MX
Name:          @ (ルートドメインの場合)
Mail server:   feedback-smtp.us-east-1.amazonses.com
Priority:      10
TTL:           Auto
Proxy status:  DNS only (灰色の雲アイコン)
```

9. **「Save」** をクリック

### 2.2 その他のDNSプロバイダーの場合

#### Route 53（AWS）

1. AWS Console → Route 53 → Hosted Zones
2. ドメインを選択
3. **「Create record」** で同様の設定

#### Google Domains / GoDaddy

1. DNS管理画面へアクセス
2. TXTレコードとMXレコードを追加
3. 設定内容は上記と同じ

### 2.3 設定内容の確認

DNS設定が正しく入力されているか、以下の項目を確認：

- [ ] TXTレコードの `Name` が `_resend` になっている
- [ ] TXTレコードの `Value` がResendが提供した値と一致
- [ ] MXレコードの `Priority` が `10` になっている
- [ ] MXレコードの `Value` が正確に入力されている
- [ ] Proxy status が **「DNS only」**（灰色の雲）になっている

## 3. DNS反映の確認

### 3.1 反映を待つ

DNS設定の反映には時間がかかります：

- **最短**: 5分
- **平均**: 30分〜2時間
- **最長**: 24時間

### 3.2 コマンドラインでDNS反映を確認

#### Macの場合：

```bash
# TXTレコードの確認
dig TXT _resend.project-europa.work

# MXレコードの確認
dig MX project-europa.work
```

#### Windowsの場合：

```cmd
# TXTレコードの確認
nslookup -type=TXT _resend.project-europa.work

# MXレコードの確認
nslookup -type=MX project-europa.work
```

#### 期待される出力例：

```
;; ANSWER SECTION:
_resend.project-europa.work. 300 IN TXT "resend-verification-xxxxxxxxxxxxxxxx"
```

### 3.3 オンラインツールで確認

以下のツールでも確認可能：

- https://mxtoolbox.com/SuperTool.aspx
- https://dnschecker.org/

## 4. Resendでドメイン検証を完了

### 4.1 自動検証

DNS設定が反映されると、Resendが自動的にドメインを検証します。

### 4.2 手動検証

自動検証が完了しない場合：

1. [Resend Domains](https://resend.com/domains) に戻る
2. 追加したドメインを選択
3. **「Verify」** ボタンをクリック

### 4.3 検証ステータスの確認

ドメインのステータスが以下のように変わります：

```
Pending → Verifying → Verified ✓
```

**Verified** になれば検証完了です！

## 5. 環境変数の設定

### 5.1 検証済みドメインで使用可能なメールアドレス

検証完了後、以下のような送信元アドレスが使用可能：

```
noreply@project-europa.work
info@project-europa.work
support@project-europa.work
hello@project-europa.work
```

### 5.2 Cloudflare Workersに環境変数を設定

#### ステージング環境

```bash
cd hono-worker

# API Keyの設定
npx wrangler secret put RESEND_API_KEY --env staging
# プロンプトが表示されたら、ResendのAPI Keyを入力

# 送信元メールアドレスの設定
npx wrangler secret put RESEND_FROM_EMAIL --env staging
# プロンプトが表示されたら、noreply@project-europa.work を入力
```

#### 本番環境

```bash
# API Keyの設定
npx wrangler secret put RESEND_API_KEY --env production

# 送信元メールアドレスの設定
npx wrangler secret put RESEND_FROM_EMAIL --env production
```

### 5.3 環境変数の確認

```bash
# 設定済みのシークレット一覧を確認
npx wrangler secret list --env staging
```

## 6. テスト送信

### 6.1 パスワードリセットメールでテスト

#### ステージング環境でテスト

```bash
# ログ監視を開始
npx wrangler tail --env staging
```

別のターミナルで：

```bash
# パスワードリセットをリクエスト
curl -X POST https://your-worker-staging.your-subdomain.workers.dev/api/v2/auth/password/reset \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'
```

### 6.2 ログで確認

以下のようなログが表示されれば成功：

```
[Email] Attempting to send email via Resend
[Email] To: your-email@example.com
[Email] From: noreply@project-europa.work
[Email] Subject: パスワードリセットのご案内
[Email] API Key length: 48
[Email] Resend API response: {
  "data": {
    "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
}
[Email] Email sent successfully, ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Password reset email sent successfully to: your-email@example.com
```

### 6.3 Resendダッシュボードで確認

1. [Resend Emails](https://resend.com/emails) にアクセス
2. 送信履歴が表示される
3. ステータスが **「Delivered」** になっていることを確認

## 7. トラブルシューティング

### 問題1: ドメイン検証が完了しない

**原因:**
- DNS設定が反映されていない
- DNSレコードの値が間違っている

**解決策:**

```bash
# DNS設定を再確認
dig TXT _resend.project-europa.work
dig MX project-europa.work

# 24時間経過しても反映されない場合は、DNS設定を見直す
```

### 問題2: メールが送信されない

**エラー例:**
```
Error: The "from" address is not verified
```

**解決策:**
1. Resend Dashboardでドメインが **「Verified」** になっているか確認
2. `RESEND_FROM_EMAIL` が検証済みドメインのアドレスか確認
3. 環境変数を再設定

```bash
npx wrangler secret put RESEND_FROM_EMAIL --env staging
# noreply@project-europa.work と入力
```

### 問題3: スパムフォルダに入る

**原因:**
- 新規ドメインからの初回送信
- SPF/DKIMの未設定（Resendが自動で設定）

**解決策:**
1. 受信者にスパムフォルダを確認してもらう
2. 「迷惑メールではない」とマーク
3. 時間経過とともに信頼性が向上

### 問題4: レート制限エラー

**エラー例:**
```
Error: Rate limit exceeded
```

**解決策:**
- Resend無料プランは **1日100通** まで
- プランをアップグレード: https://resend.com/pricing
- または翌日まで待つ

## 8. 本番環境へのデプロイ前チェックリスト

- [ ] Resendでドメインが **「Verified」** ステータス
- [ ] DNS設定（TXT、MX）が正しく反映されている
- [ ] `RESEND_API_KEY` が設定されている
- [ ] `RESEND_FROM_EMAIL` が検証済みドメインのアドレス
- [ ] ステージング環境でテスト送信成功
- [ ] Resendダッシュボードで送信履歴を確認
- [ ] 実際にメールを受信できることを確認
- [ ] スパムフォルダに入らないことを確認

## 9. 参考リンク

- [Resend公式ドキュメント](https://resend.com/docs)
- [Resend Domain Verification](https://resend.com/docs/dashboard/domains/introduction)
- [Resend Node.js SDK](https://resend.com/docs/send-with-nodejs)
- [Cloudflare DNS設定](https://developers.cloudflare.com/dns/)
- [Cloudflare Workers Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)

## 10. サポート

問題が解決しない場合：

- [Resend Discord](https://resend.com/discord)
- [Resend Support](https://resend.com/support)
- [Resend Status Page](https://status.resend.com/)
