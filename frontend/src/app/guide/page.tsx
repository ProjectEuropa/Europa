"use client";

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function GuidePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div style={{
          maxWidth: "1200px",
          margin: "40px auto",
          padding: "0 5%",
          color: "#b0c4d8",
        }}>
          <h1 style={{
            fontSize: "36px",
            fontWeight: "bold",
            color: "#00c8ff",
            marginBottom: "24px",
            textAlign: "center"
          }}>
            利用ガイド
          </h1>

          <div style={{
            background: "#0a1022",
            borderRadius: "12px",
            padding: "32px",
            border: "1px solid #07324a",
            lineHeight: "1.8",
            fontSize: "16px"
          }}>
            <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px" }}>はじめに</h2>
            <p style={{ marginBottom: "24px" }}>
              Project Europaへようこそ！このガイドでは、プラットフォームの主要機能と使い方について説明します。
              初めての方もベテランユーザーも、このガイドを参考にしてProject Europaを最大限に活用してください。
            </p>

            <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px", marginTop: "32px" }}>アカウント登録</h2>
            <p style={{ marginBottom: "24px" }}>
              1. トップページの「登録」ボタンをクリックします。<br />
              2. ユーザー名、メールアドレス、パスワードを入力します。<br />
              3. 「アカウント作成」ボタンをクリックして登録を完了します。<br />
            </p>

            <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px", marginTop: "32px" }}>チームデータのアップロード</h2>
            <p style={{ marginBottom: "24px" }}>
              1. 「アップロード」メニューからチームデータアップロードページにアクセスします。<br />
              2. 必要な情報（オーナー名、コメント、タグなど）を入力します。<br />
              3. チームデータファイルを選択します。<br />
              4. 「チームデータアップロード」ボタンをクリックして完了です。<br />
              5. アップロードが成功すると、確認メッセージが表示されます。
            </p>

            <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px", marginTop: "32px" }}>チームデータの検索</h2>
            <p style={{ marginBottom: "24px" }}>
              1. 「検索」メニューからチーム検索ページにアクセスします。<br />
              2. 「キーワード」「タグ」「オーナー名」などの検索条件を入力します。<br />
              3. 「検索」ボタンをクリックして結果を表示します。<br />
              4. 「ダウンロード」ボタンをクリックしてチームデータをダウンロードできます。
            </p>

            <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px", marginTop: "32px" }}>マッチデータの分析</h2>
            <p style={{ marginBottom: "24px" }}>
              1. 「検索」メニューからマッチ検索ページにアクセスします。<br />
              2. 「対戦日」「プレイヤー名」などの検索条件を入力します。<br />
              3. 「検索」ボタンをクリックして結果を表示します。<br />
            </p>

            <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px", marginTop: "32px" }}>コミュニティ参加</h2>
            <p style={{ marginBottom: "24px" }}>
              1. 「イベント」ページで最新の大会やオンライン対戦会の情報をチェックしましょう。<br />
              2. 「マイページ」から自分のアップロードしたデータや活動履歴を確認できます。<br />
            </p>

            <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px", marginTop: "32px" }}>トラブルシューティング</h2>
            <p>
              • ログインできない場合は、「パスワードを忘れた方」リンクからパスワードをリセットしてください。<br />
              • アップロードに失敗する場合は、ファイル形式と容量を確認してください。<br />
              • 検索結果が表示されない場合は、検索条件を変更してみてください。<br />
              • その他の問題がある場合は、「お問い合わせ」フォームからサポートチームにご連絡ください。
            </p>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
