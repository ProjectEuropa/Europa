'use client';

import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="max-w-[1200px] mx-auto my-10 px-[5%] text-[#b0c4d8]">
          <h1 className="text-4xl font-bold text-[#00c8ff] mb-6 text-center">
            私たちについて
          </h1>

          <div className="bg-[#0a1022] rounded-xl p-8 border border-[#07324a] leading-relaxed text-base">
            <h2 className="text-2xl text-[#00c8ff] mb-4">
              Project Europaとは
            </h2>
            <p className="mb-6">
              Project Europaは、カルネージハート
              EXAのコミュニティをサポートするために2016年に設立された非公式プロジェクトです。
              プレイヤーの皆様がゲーム体験を最大限に楽しめるよう、チームデータの共有やマッチデータの共有などのサービスを提供しています。
              最新のテクノロジーを活用し、直感的なインターフェースで誰でも簡単に利用できるプラットフォームを目指しています。
            </p>

            <div className="flex justify-between flex-wrap gap-5 my-10">
              <div className="flex-[1_1_300px] bg-[#071527] rounded-lg p-6 border border-[#07324a]">
                <h3 className="text-xl text-[#00c8ff] mb-3">
                  データ共有
                </h3>
                <p>
                  チームデータのアップロードと共有機能を提供し、プレイヤー間の戦略交換を促進します。
                  タグ付けや検索機能により、必要なデータを素早く見つけることができます。
                </p>
              </div>

              <div className="flex-[1_1_300px] bg-[#071527] rounded-lg p-6 border border-[#07324a]">
                <h3 className="text-xl text-[#00c8ff] mb-3">
                  マッチ分析
                </h3>
                <p>
                  対戦データを共有することで、プレイヤー同士で戦略を共有できます。
                </p>
              </div>

              <div className="flex-[1_1_300px] bg-[#071527] rounded-lg p-6 border border-[#07324a]">
                <h3 className="text-xl text-[#00c8ff] mb-3">
                  コミュニティ
                </h3>
                <p>
                  プレイヤー同士の交流の場を提供し、情報交換や技術向上を支援します。
                  イベント情報の共有や大会結果の報告など、コミュニティ活動を活性化します。
                </p>
              </div>
            </div>

            <h2 className="text-2xl text-[#00c8ff] mb-4 mt-8">
              ミッション
            </h2>
            <p className="mb-6">
              私たちのミッションは、カルネージハート
              EXAのプレイヤーコミュニティを活性化し、
              プレイヤー同士の交流を促進することです。データの共有と分析を通じて、
              より戦略的で楽しいゲームプレイを支援します。
            </p>

            <div className="bg-[#071527] rounded-lg p-5 border border-[#07324a] my-5 text-center text-lg italic">
              「テクノロジーの力でゲーム体験を豊かに、コミュニティの絆を深める」
            </div>

            <h2 className="text-2xl text-[#00c8ff] mb-4 mt-8">
              チーム
            </h2>
            <p className="mb-6">
              Project Europaは、カルネージハート
              EXAを愛する有志のプレイヤーによって運営されています。
              開発、デザイン、コミュニティマネジメントなど、様々な分野の専門家がボランティアとして参加しています。
              私たちは常に新しいメンバーを歓迎しており、プロジェクトに貢献したい方はお気軽にご連絡ください。
            </p>

            <h2 className="text-2xl text-[#00c8ff] mb-4 mt-8">
              歴史
            </h2>
            <p className="mb-6">
              2016年の設立以来、Project
              Europaは継続的にサービスを拡充し、コミュニティのニーズに応えてきました。
              最初はシンプルなデータ共有サイトとして始まりましたが、現在では検索機能、分析ツール、
              コミュニティフォーラムなど、多様な機能を提供しています。
            </p>

            <div className="flex justify-between my-8 flex-wrap gap-2.5">
              <div className="flex-[1_1_200px] text-center p-4">
                <div className="text-2xl font-bold text-[#00c8ff] mb-1">
                  2016
                </div>
                <p>
                  プロジェクト発足
                  <br />
                  基本的なデータ共有機能の実装
                </p>
              </div>

              <div className="flex-[1_1_200px] text-center p-4">
                <div className="text-2xl font-bold text-[#00c8ff] mb-1">
                  2018
                </div>
                <p>
                  検索機能の強化
                  <br />
                  ユーザーアカウント機能の追加
                </p>
              </div>

              <div className="flex-[1_1_200px] text-center p-4">
                <div className="text-2xl font-bold text-[#00c8ff] mb-1">
                  2020
                </div>
                <p>
                  プラットフォーム全面リニューアル第1弾
                  <br />
                  UIを大幅に改善
                </p>
              </div>

              <div className="flex-[1_1_200px] text-center p-4">
                <div className="text-2xl font-bold text-[#00c8ff] mb-1">
                  2025
                </div>
                <p>
                  プラットフォーム全面リニューアル第2弾
                  <br />
                  最新技術によるパフォーマンス向上
                </p>
              </div>
            </div>

            <h2 className="text-2xl text-[#00c8ff] mb-4 mt-8">
              今後の展望
            </h2>
            <p className="mb-6">
              私たちは今後も新機能の開発や既存機能の改善を続け、より使いやすく価値のあるプラットフォームを
              目指しています。コミュニティからのフィードバックを大切にし、プレイヤーの皆様と共に成長していきたいと考えています。
            </p>

            <div className="bg-[#071527] rounded-lg p-6 border border-[#07324a] mt-8">
              <h3 className="text-xl text-[#00c8ff] mb-4">
                今後の開発予定
              </h3>
              <ul className="list-disc pl-5">
                <li className="mb-2.5">
                  AIを活用した戦術分析機能
                </li>
                <li className="mb-2.5">
                  コミュニティイベント管理システム
                </li>
                <li>デスクトップアプリとモバイルアプリの開発</li>
              </ul>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/guide"
                className="inline-block px-6 py-3 bg-[#00c8ff] text-[#020824] rounded-md font-bold no-underline transition-all hover:opacity-80"
              >
                利用ガイドを見る
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
