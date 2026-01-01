'use client';

import Footer from '../../components/Footer';
import Header from '../../components/Header';

export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="max-w-[1200px] mx-auto my-10 px-[5%] text-[#b0c4d8]">
          <h1 className="text-4xl font-bold text-[#00c8ff] mb-6 text-center">
            プライバシーポリシー
          </h1>

          <div className="bg-[#0a1022] rounded-xl p-8 border border-[#07324a] leading-relaxed text-base">
            <p className="mb-6">
              Project
              Europa（以下、「当サイト」）は、ユーザーの個人情報保護を重要視しています。
              当サイトのプライバシーポリシーは、当サイトがどのように情報を収集、使用、保護するかについて説明します。
            </p>

            <h2 className="text-2xl text-[#00c8ff] mb-4 mt-8">
              1. 収集する情報
            </h2>
            <p className="mb-6">
              当サイトでは、以下の情報を収集することがあります：
            </p>
            <ul className="ml-6 mb-6 list-disc">
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

            <h2 className="text-2xl text-[#00c8ff] mb-4 mt-8">
              2. 情報の利用目的
            </h2>
            <p className="mb-6">
              収集した情報は、以下の目的で利用します：
            </p>
            <ul className="ml-6 mb-6 list-disc">
              <li>サービスの提供と改善</li>
              <li>ユーザーアカウントの管理</li>
              <li>サイトのセキュリティ確保</li>
              <li>ユーザーサポートの提供</li>
              <li>サービスに関する通知の送信</li>
            </ul>

            <h2 className="text-2xl text-[#00c8ff] mb-4 mt-8">
              3. 情報の共有
            </h2>
            <p className="mb-6">
              当サイトは、以下の場合を除き、ユーザーの個人情報を第三者と共有することはありません：
            </p>
            <ul className="ml-6 mb-6 list-disc">
              <li>ユーザーの同意がある場合</li>
              <li>法的要請に応じる必要がある場合</li>
              <li>
                サービス提供に必要なパートナー企業との共有（この場合、適切なデータ保護措置を講じます）
              </li>
            </ul>

            <h2 className="text-2xl text-[#00c8ff] mb-4 mt-8">
              4. データセキュリティ
            </h2>
            <p className="mb-6">
              当サイトは、ユーザー情報を保護するために適切なセキュリティ対策を実施しています。
              ただし、インターネット上での完全なセキュリティを保証することはできません。
            </p>

            <h2 className="text-2xl text-[#00c8ff] mb-4 mt-8">
              5. Cookieの使用
            </h2>
            <p className="mb-6">
              当サイトでは、ユーザー体験の向上やサイト機能の提供のためにCookieを使用しています。
              ブラウザの設定でCookieを無効にすることも可能ですが、一部のサービスが正常に機能しなくなる可能性があります。
            </p>

            <h2 className="text-2xl text-[#00c8ff] mb-4 mt-8">
              6. ユーザーの権利
            </h2>
            <p className="mb-6">
              ユーザーには以下の権利があります：
            </p>
            <ul className="ml-6 mb-6 list-disc">
              <li>個人情報へのアクセス</li>
              <li>個人情報の訂正</li>
              <li>個人情報の削除</li>
              <li>データ処理の制限</li>
              <li>データポータビリティ</li>
            </ul>
            <p className="mb-6">
              これらの権利を行使するには、お問い合わせフォームからご連絡ください。
            </p>

            <h2 className="text-2xl text-[#00c8ff] mb-4 mt-8">
              7. プライバシーポリシーの変更
            </h2>
            <p className="mb-6">
              当サイトは、必要に応じてプライバシーポリシーを更新することがあります。
              重要な変更がある場合は、サイト上で通知します。
            </p>

            <h2 className="text-2xl text-[#00c8ff] mb-4 mt-8">
              8. お問い合わせ
            </h2>
            <p>
              プライバシーポリシーに関するご質問やご懸念がある場合は、お問い合わせフォームからご連絡ください。
            </p>

            <p className="mt-8 text-sm text-[#8CB4FF]">
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
