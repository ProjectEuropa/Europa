"use client";

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function FAQPage() {
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
            よくある質問
          </h1>

          <div style={{
            background: "#0a1022",
            borderRadius: "12px",
            padding: "32px",
            border: "1px solid #07324a",
            lineHeight: "1.8",
            fontSize: "16px"
          }}>
            {/* FAQ項目 */}
            <div style={{ marginBottom: "40px" }}>
              <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px" }}>Q: Project Europaとは何ですか？</h2>
              <div style={{
                padding: "20px",
                background: "#0a1a33",
                borderRadius: "8px",
                border: "1px solid #07324a"
              }}>
                <p>
                  A: Project Europaは、カルネージハート EXAのプレイヤーコミュニティをサポートするための非公式プラットフォームです。
                  チームデータの共有、検索、分析などの機能を提供し、プレイヤー同士の交流を促進しています。
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "40px" }}>
              <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px" }}>Q: アカウント登録は必要ですか？</h2>
              <div style={{
                padding: "20px",
                background: "#0a1a33",
                borderRadius: "8px",
                border: "1px solid #07324a"
              }}>
                <p>
                  A: 一部の機能（イベント告知機能やのマイページなど）を利用するにはアカウント登録が必要です。
                  ただし、検索機能やダウンロード機能など、基本的な機能はアカウント登録なしでも利用できます。
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "40px" }}>
              <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px" }}>Q: チームデータをアップロードするにはどうすればいいですか？</h2>
              <div style={{
                padding: "20px",
                background: "#0a1a33",
                borderRadius: "8px",
                border: "1px solid #07324a"
              }}>
                <p>
                  A: 「アップロード」ページからチームデータをアップロードできます。
                  対応しているファイル形式は、カルネージハート EXAの標準フォーマット（.CHE）です。
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "40px" }}>
              <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px" }}>Q: アップロードしたデータは誰でも見ることができますか？</h2>
              <div style={{
                padding: "20px",
                background: "#0a1a33",
                borderRadius: "8px",
                border: "1px solid #07324a"
              }}>
                <p>
                  A: はい、アップロードされたチームデータは基本的に公開され、他のユーザーが検索・閲覧できるようになります。
                  ただし、一部の詳細情報はアップロードしたユーザーのみが閲覧できる場合があります。
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "40px" }}>
              <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px" }}>Q: データの検索方法を教えてください</h2>
              <div style={{
                padding: "20px",
                background: "#0a1a33",
                borderRadius: "8px",
                border: "1px solid #07324a"
              }}>
                <p>
                  A: 「検索」ページから、チーム名、プレイヤー名の特性などで検索できます。
                  詳細検索オプションを使用すると、より細かい条件で絞り込むことも可能です。
                  検索結果は一覧表示され、各項目をクリックすると詳細情報を確認できます。
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "40px" }}>
              <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px" }}>Q: パスワードを忘れてしまいました</h2>
              <div style={{
                padding: "20px",
                background: "#0a1a33",
                borderRadius: "8px",
                border: "1px solid #07324a"
              }}>
                <p>
                  A: ログインページの「パスワードをお忘れですか？」リンクから、パスワードリセット手続きを行えます。
                  登録したメールアドレスにリセット用のリンクが送信されますので、そちらから新しいパスワードを設定してください。
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "40px" }}>
              <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px" }}>Q: アカウントを削除するにはどうすればいいですか？</h2>
              <div style={{
                padding: "20px",
                background: "#0a1a33",
                borderRadius: "8px",
                border: "1px solid #07324a"
              }}>
                <p>
                  A: マイページの「アカウント設定」から、アカウント削除の手続きを行えます。
                  アカウントを削除すると、アップロードしたデータも削除されますのでご注意ください。
                  削除前にデータのバックアップをお勧めします。
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "40px" }}>
              <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px" }}>Q: サイトの利用は無料ですか？</h2>
              <div style={{
                padding: "20px",
                background: "#0a1a33",
                borderRadius: "8px",
                border: "1px solid #07324a"
              }}>
                <p>
                  A: はい、Project Europaの全ての機能は無料でご利用いただけます。
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "40px" }}>
              <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px" }}>Q: 不具合や機能リクエストはどこに報告すればいいですか？</h2>
              <div style={{
                padding: "20px",
                background: "#0a1a33",
                borderRadius: "8px",
                border: "1px solid #07324a"
              }}>
                <p>
                  A: お問い合わせフォームから、不具合の報告や機能リクエストを送信できます。
                  できるだけ詳細な情報（発生状況、ブラウザの種類など）を添えていただけると、
                  対応がスムーズになります。
                </p>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px" }}>Q: 開発に参加することはできますか？</h2>
              <div style={{
                padding: "20px",
                background: "#0a1a33",
                borderRadius: "8px",
                border: "1px solid #07324a"
              }}>
                <p>
                  A: はい、Project Europaは常に開発協力者を募集しています。
                  プログラミング、デザイン、翻訳、ドキュメント作成など、様々な形で貢献いただけます。
                  興味がある方は、お問い合わせフォームからご連絡ください。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
