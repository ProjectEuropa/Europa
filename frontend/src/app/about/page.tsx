'use client';

import Link from 'next/link';
import StaticPageLayout from '@/components/layout/StaticPageLayout';
import {
  AccentBox,
  ActionButton,
  FeatureCard,
  InfoBox,
  List,
  ListItem,
  Paragraph,
  SectionTitle,
  TimelineItem,
} from '@/components/layout/StaticPageContent';

export default function AboutPage() {
  return (
    <StaticPageLayout
      titleEn="ABOUT"
      titleJa="私たちについて"
      description="Project Europaの理念とサービスについて"
    >
      <SectionTitle>Project Europaとは</SectionTitle>
      <Paragraph>
        Project Europaは、カルネージハート
        EXAのコミュニティをサポートするために2016年に設立された非公式プロジェクトです。
        プレイヤーの皆様がゲーム体験を最大限に楽しめるよう、チームデータの共有やマッチデータの共有などのサービスを提供しています。
        最新のテクノロジーを活用し、直感的なインターフェースで誰でも簡単に利用できるプラットフォームを目指しています。
      </Paragraph>

      {/* 特色機能 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
        <FeatureCard title="データ共有">
          チームデータのアップロードと共有機能を提供し、プレイヤー間の戦略交換を促進します。
          タグ付けや検索機能により、必要なデータを素早く見つけることができます。
        </FeatureCard>

        <FeatureCard title="マッチ分析">
          対戦データを共有することで、プレイヤー同士で戦略を共有できます。
        </FeatureCard>

        <FeatureCard title="コミュニティ">
          プレイヤー同士の交流の場を提供し、情報交換や技術向上を支援します。
          イベント情報の共有や大会結果の報告など、コミュニティ活動を活性化します。
        </FeatureCard>
      </div>

      <SectionTitle>ミッション</SectionTitle>
      <Paragraph>
        私たちのミッションは、カルネージハート
        EXAのプレイヤーコミュニティを活性化し、
        プレイヤー同士の交流を促進することです。データの共有と分析を通じて、
        より戦略的で楽しいゲームプレイを支援します。
      </Paragraph>

      <AccentBox>
        「テクノロジーの力でゲーム体験を豊かに、コミュニティの絆を深める」
      </AccentBox>

      <SectionTitle>チーム</SectionTitle>
      <Paragraph>
        Project Europaは、カルネージハート
        EXAを愛する有志のプレイヤーによって運営されています。
        開発、デザイン、コミュニティマネジメントなど、様々な分野の専門家がボランティアとして参加しています。
        私たちは常に新しいメンバーを歓迎しており、プロジェクトに貢献したい方はお気軽にご連絡ください。
      </Paragraph>

      <SectionTitle>歴史</SectionTitle>
      <Paragraph>
        2016年の設立以来、Project
        Europaは継続的にサービスを拡充し、コミュニティのニーズに応えてきました。
        最初はシンプルなデータ共有サイトとして始まりましたが、現在では検索機能、分析ツール、
        コミュニティフォーラムなど、多様な機能を提供しています。
      </Paragraph>

      {/* タイムライン */}
      <div className="flex flex-col my-8 bg-slate-900/30 rounded-xl p-4 md:p-6 border border-cyan-500/10">
        <TimelineItem year="2016">
          プロジェクト発足 — 基本的なデータ共有機能の実装
        </TimelineItem>

        <TimelineItem year="2018">
          検索機能の強化 — ユーザーアカウント機能の追加
        </TimelineItem>

        <TimelineItem year="2020">
          プラットフォーム全面リニューアル第1弾 — UIを大幅に改善
        </TimelineItem>

        <TimelineItem year="2025">
          プラットフォーム全面リニューアル第2弾 — 最新技術によるパフォーマンス向上
        </TimelineItem>

        <TimelineItem year="2026">
          統一デザインシステムの導入 — Cybernetic Voidテーマの完成
        </TimelineItem>
      </div>

      <SectionTitle>今後の展望</SectionTitle>
      <Paragraph>
        私たちは今後も新機能の開発や既存機能の改善を続け、より使いやすく価値のあるプラットフォームを
        目指しています。コミュニティからのフィードバックを大切にし、プレイヤーの皆様と共に成長していきたいと考えています。
      </Paragraph>

      <InfoBox title="今後の開発予定">
        <List>
          <ListItem>AIを活用した戦術分析機能</ListItem>
          <ListItem>コミュニティイベント管理システム</ListItem>
          <ListItem>デスクトップアプリとモバイルアプリの開発</ListItem>
        </List>
      </InfoBox>

      <div className="mt-10 text-center">
        <ActionButton href="/guide">利用ガイドを見る</ActionButton>
      </div>
    </StaticPageLayout>
  );
}
