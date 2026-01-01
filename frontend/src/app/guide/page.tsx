'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function GuidePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="max-w-[1200px] mx-auto my-10 px-[5%] text-[#b0c4d8]">
          <h1 className="text-4xl font-bold text-[#00c8ff] mb-6 text-center">
            利用ガイド
          </h1>

          <div className="bg-[#0a1022] rounded-xl p-8 border border-[#07324a] leading-relaxed text-base">
            <h2 className="text-2xl text-[#00c8ff] mb-4">
              はじめに
            </h2>
            <p className="mb-6">
              Project
              Europaへようこそ！このガイドでは、プラットフォームの主要機能と使い方について説明します。
              初めての方もベテランユーザーも、このガイドを参考にしてProject
              Europaを最大限に活用してください。
            </p>

            <h2 className="text-2xl text-[#00c8ff] mb-4 mt-8">
              アカウント登録
            </h2>
            <p className="mb-6">
              1. トップページの「登録」ボタンをクリックします。
              <br />
              2. ユーザー名、メールアドレス、パスワードを入力します。
              <br />
              3. 「アカウント作成」ボタンをクリックして登録を完了します。
              <br />
            </p>

            <h2 className="text-2xl text-[#00c8ff] mb-4 mt-8">
              チームデータのアップロード
            </h2>
            <p className="mb-6">
              1.
              「アップロード」メニューからチームデータアップロードページにアクセスします。
              <br />
              2. 必要な情報（オーナー名、コメント、タグなど）を入力します。
              <br />
              3. チームデータファイルを選択します。
              <br />
              4. 「チームデータアップロード」ボタンをクリックして完了です。
              <br />
              5. アップロードが成功すると、確認メッセージが表示されます。
            </p>

            <h2 className="text-2xl text-[#00c8ff] mb-4 mt-8">
              チームデータの検索
            </h2>
            <p className="mb-6">
              1. 「検索」メニューからチーム検索ページにアクセスします。
              <br />
              2.
              「キーワード」「タグ」「オーナー名」などの検索条件を入力します。
              <br />
              3. 「検索」ボタンをクリックして結果を表示します。
              <br />
              4.
              「ダウンロード」ボタンをクリックしてチームデータをダウンロードできます。
            </p>

            <h2 className="text-2xl text-[#00c8ff] mb-4 mt-8">
              マッチデータの分析
            </h2>
            <p className="mb-6">
              1. 「検索」メニューからマッチ検索ページにアクセスします。
              <br />
              2. 「対戦日」「プレイヤー名」などの検索条件を入力します。
              <br />
              3. 「検索」ボタンをクリックして結果を表示します。
              <br />
            </p>

            <h2 className="text-2xl text-[#00c8ff] mb-4 mt-8">
              コミュニティ参加
            </h2>
            <p className="mb-6">
              1.
              「イベント」ページで最新の大会やオンライン対戦会の情報をチェックしましょう。
              <br />
              2.
              「マイページ」から自分のアップロードしたデータや活動履歴を確認できます。
              <br />
            </p>

            <h2 className="text-2xl text-[#00c8ff] mb-4 mt-8">
              トラブルシューティング
            </h2>
            <p>
              •
              ログインできない場合は、「パスワードを忘れた方」リンクからパスワードをリセットしてください。
              <br />•
              アップロードに失敗する場合は、ファイル形式と容量を確認してください。
              <br />•
              検索結果が表示されない場合は、検索条件を変更してみてください。
              <br />•
              その他の問題がある場合は、「お問い合わせ」フォームからサポートチームにご連絡ください。
            </p>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
