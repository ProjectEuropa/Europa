'use client';

import React from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';

export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '40px auto',
            padding: '0 5%',
            color: '#b0c4d8',
          }}
        >
          <h1
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#00c8ff',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            プライバシーポリシー
          </h1>

          <div
            style={{
              background: '#0a1022',
              borderRadius: '12px',
              padding: '32px',
              border: '1px solid #07324a',
              lineHeight: '1.8',
              fontSize: '16px',
            }}
          >
            <p style={{ marginBottom: '24px' }}>
              Project
              Europa（以下、「当サイト」）は、ユーザーの個人情報保護を重要視しています。
              当サイトのプライバシーポリシーは、当サイトがどのように情報を収集、使用、保護するかについて説明します。
            </p>

            <h2
              style={{
                fontSize: '24px',
                color: '#00c8ff',
                marginBottom: '16px',
                marginTop: '32px',
              }}
            >
              1. 収集する情報
            </h2>
            <p style={{ marginBottom: '24px' }}>
              当サイトでは、以下の情報を収集することがあります：
            </p>
            <ul
              style={{
                marginLeft: '24px',
                marginBottom: '24px',
                listStyleType: 'disc',
              }}
            >
              <li>
                アカウント登録時に提供される情報（ユーザー名、メールアドレスなど）
              </li>
              <li>
                ゲームデータ（アップロードされたチームデータ、マッチデータなど）
              </li>
              <li>
                サイト利用状況に関する情報（アクセスログ、IPアドレス、ブラウザ情報など）
              </li>
              <li>お問い合わせフォームから送信される情報</li>
            </ul>

            <h2
              style={{
                fontSize: '24px',
                color: '#00c8ff',
                marginBottom: '16px',
                marginTop: '32px',
              }}
            >
              2. 情報の利用目的
            </h2>
            <p style={{ marginBottom: '24px' }}>
              収集した情報は、以下の目的で利用します：
            </p>
            <ul
              style={{
                marginLeft: '24px',
                marginBottom: '24px',
                listStyleType: 'disc',
              }}
            >
              <li>サービスの提供と改善</li>
              <li>ユーザーアカウントの管理</li>
              <li>サイトのセキュリティ確保</li>
              <li>ユーザーサポートの提供</li>
              <li>サービスに関する通知の送信</li>
            </ul>

            <h2
              style={{
                fontSize: '24px',
                color: '#00c8ff',
                marginBottom: '16px',
                marginTop: '32px',
              }}
            >
              3. 情報の共有
            </h2>
            <p style={{ marginBottom: '24px' }}>
              当サイトは、以下の場合を除き、ユーザーの個人情報を第三者と共有することはありません：
            </p>
            <ul
              style={{
                marginLeft: '24px',
                marginBottom: '24px',
                listStyleType: 'disc',
              }}
            >
              <li>ユーザーの同意がある場合</li>
              <li>法的要請に応じる必要がある場合</li>
              <li>
                サービス提供に必要なパートナー企業との共有（この場合、適切なデータ保護措置を講じます）
              </li>
            </ul>

            <h2
              style={{
                fontSize: '24px',
                color: '#00c8ff',
                marginBottom: '16px',
                marginTop: '32px',
              }}
            >
              4. データセキュリティ
            </h2>
            <p style={{ marginBottom: '24px' }}>
              当サイトは、ユーザー情報を保護するために適切なセキュリティ対策を実施しています。
              ただし、インターネット上での完全なセキュリティを保証することはできません。
            </p>

            <h2
              style={{
                fontSize: '24px',
                color: '#00c8ff',
                marginBottom: '16px',
                marginTop: '32px',
              }}
            >
              5. Cookieの使用
            </h2>
            <p style={{ marginBottom: '24px' }}>
              当サイトでは、ユーザー体験の向上やサイト機能の提供のためにCookieを使用しています。
              ブラウザの設定でCookieを無効にすることも可能ですが、一部のサービスが正常に機能しなくなる可能性があります。
            </p>

            <h2
              style={{
                fontSize: '24px',
                color: '#00c8ff',
                marginBottom: '16px',
                marginTop: '32px',
              }}
            >
              6. ユーザーの権利
            </h2>
            <p style={{ marginBottom: '24px' }}>
              ユーザーには以下の権利があります：
            </p>
            <ul
              style={{
                marginLeft: '24px',
                marginBottom: '24px',
                listStyleType: 'disc',
              }}
            >
              <li>個人情報へのアクセス</li>
              <li>個人情報の訂正</li>
              <li>個人情報の削除</li>
              <li>データ処理の制限</li>
              <li>データポータビリティ</li>
            </ul>
            <p style={{ marginBottom: '24px' }}>
              これらの権利を行使するには、お問い合わせフォームからご連絡ください。
            </p>

            <h2
              style={{
                fontSize: '24px',
                color: '#00c8ff',
                marginBottom: '16px',
                marginTop: '32px',
              }}
            >
              7. プライバシーポリシーの変更
            </h2>
            <p style={{ marginBottom: '24px' }}>
              当サイトは、必要に応じてプライバシーポリシーを更新することがあります。
              重要な変更がある場合は、サイト上で通知します。
            </p>

            <h2
              style={{
                fontSize: '24px',
                color: '#00c8ff',
                marginBottom: '16px',
                marginTop: '32px',
              }}
            >
              8. お問い合わせ
            </h2>
            <p>
              プライバシーポリシーに関するご質問やご懸念がある場合は、お問い合わせフォームからご連絡ください。
            </p>

            <p
              style={{ marginTop: '32px', fontSize: '14px', color: '#8CB4FF' }}
            >
              最終更新日: 2025年5月12日
            </p>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
