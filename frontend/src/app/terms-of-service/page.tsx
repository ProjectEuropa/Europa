"use client";

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function TermsOfServicePage() {
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
            利用規約
          </h1>
          
          <div style={{ 
            background: "#0a1022", 
            borderRadius: "12px", 
            padding: "32px", 
            border: "1px solid #07324a",
            lineHeight: "1.8",
            fontSize: "16px"
          }}>
            <p style={{ marginBottom: "24px" }}>
              この利用規約（以下、「本規約」）は、Project Europa（以下、「当サイト」）が提供するサービスの利用条件を定めるものです。
              ユーザーの皆様には、本規約に同意いただいた上で、当サイトのサービスをご利用いただきます。
            </p>

            <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px", marginTop: "32px" }}>1. 適用範囲</h2>
            <p style={{ marginBottom: "24px" }}>
              本規約は、当サイトの全てのサービスおよびコンテンツ（以下、「本サービス」）の提供と利用に関する条件を規定します。
              ユーザーが本サービスを利用する場合、本規約に同意したものとみなします。
            </p>

            <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px", marginTop: "32px" }}>2. サービスの内容</h2>
            <p style={{ marginBottom: "24px" }}>
              当サイトは、カルネージハート EXAに関連するデータ共有、検索、分析などのサービスを提供します。
              サービスの内容は予告なく変更される場合があります。
            </p>

            <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px", marginTop: "32px" }}>3. アカウント</h2>
            <p style={{ marginBottom: "24px" }}>
              一部のサービスを利用するには、アカウント登録が必要です。ユーザーは以下の責任を負います：
            </p>
            <ul style={{ marginLeft: "24px", marginBottom: "24px", listStyleType: "disc" }}>
              <li>正確かつ最新の情報を提供すること</li>
              <li>アカウント情報（パスワードを含む）の機密性を保持すること</li>
              <li>アカウントを通じて行われる全ての活動に責任を持つこと</li>
            </ul>

            <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px", marginTop: "32px" }}>4. ユーザーの義務</h2>
            <p style={{ marginBottom: "24px" }}>
              ユーザーは、本サービスの利用にあたり、以下の行為を行わないことに同意します：
            </p>
            <ul style={{ marginLeft: "24px", marginBottom: "24px", listStyleType: "disc" }}>
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>当サイトのサーバーやネットワークの機能を破壊したり、妨害したりする行為</li>
              <li>当サイトのサービスの運営を妨害するおそれのある行為</li>
              <li>他のユーザーに迷惑をかけたり、不利益を与えたりする行為</li>
              <li>他のユーザーのアカウントを不正に使用する行為</li>
              <li>当サイトに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
              <li>その他、当サイトが不適切と判断する行為</li>
            </ul>

            <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px", marginTop: "32px" }}>5. 知的財産権</h2>
            <p style={{ marginBottom: "24px" }}>
              当サイトに掲載されているコンテンツ（テキスト、画像、ロゴ、デザインなど）の知的財産権は、当サイトまたは正当な権利者に帰属します。
              ユーザーは、個人的な利用を超えて、これらのコンテンツを複製、転載、改変、販売などの行為を行うことはできません。
            </p>

            <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px", marginTop: "32px" }}>6. 免責事項</h2>
            <p style={{ marginBottom: "24px" }}>
              当サイトは、以下の事項について一切の責任を負いません：
            </p>
            <ul style={{ marginLeft: "24px", marginBottom: "24px", listStyleType: "disc" }}>
              <li>サービスの中断、遅延、中止、データの消失</li>
              <li>ユーザーが本サービスを通じて提供された情報の正確性、有用性、適法性</li>
              <li>ユーザー間または第三者との間におけるトラブル</li>
              <li>その他、本サービスに関連してユーザーが被った損害</li>
            </ul>

            <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px", marginTop: "32px" }}>7. サービスの変更・終了</h2>
            <p style={{ marginBottom: "24px" }}>
              当サイトは、ユーザーに通知することなく、本サービスの内容を変更したり、提供を終了したりすることができます。
              これによってユーザーに生じた損害について、当サイトは一切の責任を負いません。
            </p>

            <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px", marginTop: "32px" }}>8. 規約の変更</h2>
            <p style={{ marginBottom: "24px" }}>
              当サイトは、必要に応じて本規約を変更することができます。
              変更後の規約は、当サイト上に表示した時点で効力を生じるものとします。
            </p>

            <h2 style={{ fontSize: "24px", color: "#00c8ff", marginBottom: "16px", marginTop: "32px" }}>9. 準拠法と管轄裁判所</h2>
            <p style={{ marginBottom: "24px" }}>
              本規約の解釈および適用は、日本国の法律に準拠するものとします。
              本サービスに関連して生じる紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
            
            <p style={{ marginTop: "32px", fontSize: "14px", color: "#8CB4FF" }}>
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
