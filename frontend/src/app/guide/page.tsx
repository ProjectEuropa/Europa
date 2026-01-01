'use client';

import StaticPageLayout from '@/components/layout/StaticPageLayout';
import { Paragraph, SectionTitle } from '@/components/layout/StaticPageContent';

export default function GuidePage() {
  return (
    <StaticPageLayout
      titleEn="USER GUIDE"
      titleJa="利用ガイド"
      description="Project Europaの使い方をご紹介します"
    >
      <SectionTitle>はじめに</SectionTitle>
      <Paragraph>
        Project
        Europaへようこそ！このガイドでは、プラットフォームの主要機能と使い方について説明します。
        初めての方もベテランユーザーも、このガイドを参考にしてProject
        Europaを最大限に活用してください。
      </Paragraph>

      <SectionTitle>アカウント登録</SectionTitle>
      <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-4 md:p-5 text-slate-300 space-y-2">
        <div className="flex items-start gap-3">
          <span className="text-cyan-500 font-mono font-bold">1.</span>
          <span>トップページの「登録」ボタンをクリックします。</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-cyan-500 font-mono font-bold">2.</span>
          <span>ユーザー名、メールアドレス、パスワードを入力します。</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-cyan-500 font-mono font-bold">3.</span>
          <span>「アカウント作成」ボタンをクリックして登録を完了します。</span>
        </div>
      </div>

      <SectionTitle>チームデータのアップロード</SectionTitle>
      <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-4 md:p-5 text-slate-300 space-y-2">
        <div className="flex items-start gap-3">
          <span className="text-cyan-500 font-mono font-bold">1.</span>
          <span>「アップロード」メニューからチームデータアップロードページにアクセスします。</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-cyan-500 font-mono font-bold">2.</span>
          <span>必要な情報（オーナー名、コメント、タグなど）を入力します。</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-cyan-500 font-mono font-bold">3.</span>
          <span>チームデータファイルを選択します。</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-cyan-500 font-mono font-bold">4.</span>
          <span>「チームデータアップロード」ボタンをクリックして完了です。</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-cyan-500 font-mono font-bold">5.</span>
          <span>アップロードが成功すると、確認メッセージが表示されます。</span>
        </div>
      </div>

      <SectionTitle>チームデータの検索</SectionTitle>
      <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-4 md:p-5 text-slate-300 space-y-2">
        <div className="flex items-start gap-3">
          <span className="text-cyan-500 font-mono font-bold">1.</span>
          <span>「検索」メニューからチーム検索ページにアクセスします。</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-cyan-500 font-mono font-bold">2.</span>
          <span>「キーワード」「タグ」「オーナー名」などの検索条件を入力します。</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-cyan-500 font-mono font-bold">3.</span>
          <span>「検索」ボタンをクリックして結果を表示します。</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-cyan-500 font-mono font-bold">4.</span>
          <span>「ダウンロード」ボタンをクリックしてチームデータをダウンロードできます。</span>
        </div>
      </div>

      <SectionTitle>マッチデータの分析</SectionTitle>
      <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-4 md:p-5 text-slate-300 space-y-2">
        <div className="flex items-start gap-3">
          <span className="text-cyan-500 font-mono font-bold">1.</span>
          <span>「検索」メニューからマッチ検索ページにアクセスします。</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-cyan-500 font-mono font-bold">2.</span>
          <span>「対戦日」「プレイヤー名」などの検索条件を入力します。</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-cyan-500 font-mono font-bold">3.</span>
          <span>「検索」ボタンをクリックして結果を表示します。</span>
        </div>
      </div>

      <SectionTitle>コミュニティ参加</SectionTitle>
      <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-4 md:p-5 text-slate-300 space-y-2">
        <div className="flex items-start gap-3">
          <span className="text-cyan-500 font-mono font-bold">1.</span>
          <span>「イベント」ページで最新の大会やオンライン対戦会の情報をチェックしましょう。</span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-cyan-500 font-mono font-bold">2.</span>
          <span>「マイページ」から自分のアップロードしたデータや活動履歴を確認できます。</span>
        </div>
      </div>

      <SectionTitle>トラブルシューティング</SectionTitle>
      <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-4 md:p-5 text-slate-300 space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-amber-400">•</span>
          <span>
            ログインできない場合は、「パスワードを忘れた方」リンクからパスワードをリセットしてください。
          </span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-amber-400">•</span>
          <span>
            アップロードに失敗する場合は、ファイル形式と容量を確認してください。
          </span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-amber-400">•</span>
          <span>
            検索結果が表示されない場合は、検索条件を変更してみてください。
          </span>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-amber-400">•</span>
          <span>
            その他の問題がある場合は、「お問い合わせ」フォームからサポートチームにご連絡ください。
          </span>
        </div>
      </div>
    </StaticPageLayout>
  );
}
