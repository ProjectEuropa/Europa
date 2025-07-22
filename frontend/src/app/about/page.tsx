'use client';

import Link from 'next/link';
import React from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function AboutPage() {
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
            私たちについて
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
            <h2
              style={{
                fontSize: '24px',
                color: '#00c8ff',
                marginBottom: '16px',
              }}
            >
              Project Europaとは
            </h2>
            <p style={{ marginBottom: '24px' }}>
              Project Europaは、カルネージハート
              EXAのコミュニティをサポートするために2016年に設立された非公式プロジェクトです。
              プレイヤーの皆様がゲーム体験を最大限に楽しめるよう、チームデータの共有やマッチデータの共有などのサービスを提供しています。
              最新のテクノロジーを活用し、直感的なインターフェースで誰でも簡単に利用できるプラットフォームを目指しています。
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '20px',
                margin: '40px 0',
              }}
            >
              <div
                style={{
                  flex: '1 1 300px',
                  background: '#071527',
                  borderRadius: '8px',
                  padding: '24px',
                  border: '1px solid #07324a',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    color: '#00c8ff',
                    marginBottom: '12px',
                  }}
                >
                  データ共有
                </h3>
                <p>
                  チームデータのアップロードと共有機能を提供し、プレイヤー間の戦略交換を促進します。
                  タグ付けや検索機能により、必要なデータを素早く見つけることができます。
                </p>
              </div>

              <div
                style={{
                  flex: '1 1 300px',
                  background: '#071527',
                  borderRadius: '8px',
                  padding: '24px',
                  border: '1px solid #07324a',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    color: '#00c8ff',
                    marginBottom: '12px',
                  }}
                >
                  マッチ分析
                </h3>
                <p>
                  対戦データを共有することで、プレイヤー同士で戦略を共有できます。
                </p>
              </div>

              <div
                style={{
                  flex: '1 1 300px',
                  background: '#071527',
                  borderRadius: '8px',
                  padding: '24px',
                  border: '1px solid #07324a',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    color: '#00c8ff',
                    marginBottom: '12px',
                  }}
                >
                  コミュニティ
                </h3>
                <p>
                  プレイヤー同士の交流の場を提供し、情報交換や技術向上を支援します。
                  イベント情報の共有や大会結果の報告など、コミュニティ活動を活性化します。
                </p>
              </div>
            </div>

            <h2
              style={{
                fontSize: '24px',
                color: '#00c8ff',
                marginBottom: '16px',
                marginTop: '32px',
              }}
            >
              ミッション
            </h2>
            <p style={{ marginBottom: '24px' }}>
              私たちのミッションは、カルネージハート
              EXAのプレイヤーコミュニティを活性化し、
              プレイヤー同士の交流を促進することです。データの共有と分析を通じて、
              より戦略的で楽しいゲームプレイを支援します。
            </p>

            <div
              style={{
                background: '#071527',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #07324a',
                margin: '20px 0',
                textAlign: 'center',
                fontSize: '18px',
                fontStyle: 'italic',
              }}
            >
              「テクノロジーの力でゲーム体験を豊かに、コミュニティの絆を深める」
            </div>

            <h2
              style={{
                fontSize: '24px',
                color: '#00c8ff',
                marginBottom: '16px',
                marginTop: '32px',
              }}
            >
              チーム
            </h2>
            <p style={{ marginBottom: '24px' }}>
              Project Europaは、カルネージハート
              EXAを愛する有志のプレイヤーによって運営されています。
              開発、デザイン、コミュニティマネジメントなど、様々な分野の専門家がボランティアとして参加しています。
              私たちは常に新しいメンバーを歓迎しており、プロジェクトに貢献したい方はお気軽にご連絡ください。
            </p>

            <h2
              style={{
                fontSize: '24px',
                color: '#00c8ff',
                marginBottom: '16px',
                marginTop: '32px',
              }}
            >
              歴史
            </h2>
            <p style={{ marginBottom: '24px' }}>
              2016年の設立以来、Project
              Europaは継続的にサービスを拡充し、コミュニティのニーズに応えてきました。
              最初はシンプルなデータ共有サイトとして始まりましたが、現在では検索機能、分析ツール、
              コミュニティフォーラムなど、多様な機能を提供しています。
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                margin: '30px 0',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div
                style={{
                  flex: '1 1 200px',
                  textAlign: 'center',
                  padding: '15px',
                }}
              >
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#00c8ff',
                    marginBottom: '5px',
                  }}
                >
                  2016
                </div>
                <p>
                  プロジェクト発足
                  <br />
                  基本的なデータ共有機能の実装
                </p>
              </div>

              <div
                style={{
                  flex: '1 1 200px',
                  textAlign: 'center',
                  padding: '15px',
                }}
              >
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#00c8ff',
                    marginBottom: '5px',
                  }}
                >
                  2018
                </div>
                <p>
                  検索機能の強化
                  <br />
                  ユーザーアカウント機能の追加
                </p>
              </div>

              <div
                style={{
                  flex: '1 1 200px',
                  textAlign: 'center',
                  padding: '15px',
                }}
              >
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#00c8ff',
                    marginBottom: '5px',
                  }}
                >
                  2020
                </div>
                <p>
                  プラットフォーム全面リニューアル第1弾
                  <br />
                  UIを大幅に改善
                </p>
              </div>

              <div
                style={{
                  flex: '1 1 200px',
                  textAlign: 'center',
                  padding: '15px',
                }}
              >
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#00c8ff',
                    marginBottom: '5px',
                  }}
                >
                  2025
                </div>
                <p>
                  プラットフォーム全面リニューアル第2弾
                  <br />
                  最新技術によるパフォーマンス向上
                </p>
              </div>
            </div>

            <h2
              style={{
                fontSize: '24px',
                color: '#00c8ff',
                marginBottom: '16px',
                marginTop: '32px',
              }}
            >
              今後の展望
            </h2>
            <p style={{ marginBottom: '24px' }}>
              私たちは今後も新機能の開発や既存機能の改善を続け、より使いやすく価値のあるプラットフォームを
              目指しています。コミュニティからのフィードバックを大切にし、プレイヤーの皆様と共に成長していきたいと考えています。
            </p>

            <div
              style={{
                background: '#071527',
                borderRadius: '8px',
                padding: '24px',
                border: '1px solid #07324a',
                marginTop: '30px',
              }}
            >
              <h3
                style={{
                  fontSize: '20px',
                  color: '#00c8ff',
                  marginBottom: '16px',
                }}
              >
                今後の開発予定
              </h3>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                <li style={{ marginBottom: '10px' }}>
                  AIを活用した戦術分析機能
                </li>
                <li style={{ marginBottom: '10px' }}>
                  コミュニティイベント管理システム
                </li>
                <li>デスクトップアプリとモバイルアプリの開発</li>
              </ul>
            </div>

            <div
              style={{
                marginTop: '40px',
                textAlign: 'center',
              }}
            >
              <Link
                href="/guide"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  background: '#00c8ff',
                  color: '#020824',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
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
