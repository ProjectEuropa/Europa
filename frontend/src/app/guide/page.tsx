import StaticPageLayout from '@/components/layout/StaticPageLayout';
import { QuickStart } from '@/components/guide/QuickStart';
import { TableOfContents } from '@/components/guide/TableOfContents';
import { StepSection } from '@/components/guide/StepSection';
import { ActionButton, InfoBox, SectionTitle, List, ListItem } from '@/components/layout/StaticPageContent';
import Link from 'next/link';

export default function GuidePage() {
  return (
    <StaticPageLayout
      titleEn="USER GUIDE"
      titleJa="利用ガイド"
      description="Project Europaを使いこなすためのクイックガイド"
    >
      {/* 1. Quick Start Section */}
      <QuickStart />

      {/* 2. Table of Contents */}
      <TableOfContents />

      {/* 3. Detailed Sections */}

      {/* Search & Find */}
      <StepSection
        id="search"
        title="チームを探す"
        subtitle="SEARCH TYPES"
        description="強力な検索機能を使って、参考にしたいチームやライバルを見つけましょう。「チーム検索」と「マッチ検索」の2種類が用意されています。"
        imagePath="/guide/search-team.png"
      >
        <div className="space-y-4">
          <div className="bg-slate-900/50 border border-cyan-500/20 rounded-lg p-4">
            <h4 className="text-cyan-400 font-bold mb-2">検索のヒント</h4>
            <ul className="list-disc list-inside text-slate-400 text-sm space-y-1">
              <li>オーナー名で検索して、特定ユーザーのチームを探せます</li>
              <li>タグ検索（例：冥界、上級演習所）で環境に合ったチームを絞り込めます</li>
              <li>ソート機能で「最新順」などに並び替え可能です</li>
            </ul>
          </div>
          <ActionButton href="/search/team">チーム検索へ</ActionButton>
        </div>
      </StepSection>

      {/* Download */}
      <StepSection
        id="download"
        title="データをダウンロード"
        subtitle="HOW TO DOWNLOAD"
        description="検索結果から気になるチームを見つけたら、データをダウンロードします。一括ダウンロード機能を使えば、複数のチームをまとめて取得可能です。"
        imagePath="/guide/download-team.png"
        reverse
      >
        <div className="space-y-4">
          <p className="text-slate-300 leading-relaxed">
            「一括ダウンロードリスト」に追加したチームは、`.OKE` ファイルとしてまとめてZIP形式でダウンロードされます。
            ダウンロードしたファイルは、PSPの `Savedata` フォルダ内のカルネージハート エクサのフォルダに転送してください。
          </p>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-300">
            <strong>Note:</strong> ダウンロードにはログインは不要ですが、一部の機能（イベント登録など）はログインが必要です。
          </div>
        </div>
      </StepSection>

      {/* Upload */}
      <StepSection
        id="upload"
        title="アップロード手順"
        subtitle="SHARE YOUR TEAM"
        description="あなたの自慢のチームを世界中に公開しましょう。アップロードは非常にシンプルで、詳細な設定も可能です。"
        imagePath="/guide/upload.png"
      >
        <div className="space-y-4">
          <List>
            <ListItem>オーナー名とパスワードを設定（削除時に必要）</ListItem>
            <ListItem>チームの特徴を表すタグを追加</ListItem>
            <ListItem>コメントでアピール</ListItem>
          </List>

          <div className="mt-6">
            <ActionButton href="/upload">アップロードする</ActionButton>
          </div>
        </div>
      </StepSection>

      {/* Account & Other */}
      <section id="account" className="scroll-mt-32 mb-20">
        <SectionTitle>アカウントとコミュニティ</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">アカウント登録のメリット</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-500">✓</span>
                アップロードしたチームの管理が容易に
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500">✓</span>
                マイページでの活動履歴の確認
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500">✓</span>
                イベント登録
              </li>
            </ul>
            <div className="mt-6">
              <Link href="/register" className="text-cyan-400 hover:text-cyan-300 underline font-bold">
                アカウント作成はこちら &rarr;
              </Link>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">困ったときは</h3>
            <p className="text-slate-300 mb-4">
              バグの報告や機能要望、アカウントに関するトラブルは、お問い合わせフォームまたは公式Discordコミュニティまでご連絡ください。
            </p>
            <InfoBox title="現在開発中の機能">
              <ul className="text-sm text-slate-400 list-none space-y-1">
                <li>・AIレコメンド機能</li>
                <li>・スマホアプリ</li>
              </ul>
            </InfoBox>
          </div>
        </div>
      </section>

    </StaticPageLayout>
  );
}
