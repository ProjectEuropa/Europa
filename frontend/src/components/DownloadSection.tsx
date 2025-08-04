import type React from 'react';

const DownloadSection: React.FC = () => {
  return (
    <section
      id="download"
      style={{
        padding: '80px 0',
        position: 'relative',
        overflow: 'hidden',
        background: '#0a0818',
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '0 20px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            color: '#fff',
            fontWeight: 800,
            fontSize: '2.5rem',
            marginBottom: '16px',
          }}
        >
          チーム＆マッチデータのダウンロード
        </h2>
        <div
          style={{
            color: '#00c8ff',
            fontSize: '16px',
            marginBottom: '24px',
          }}
        >
          Download Team & Match Data
        </div>
        <p
          style={{
            color: '#b0c4d8',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            marginBottom: '48px',
            maxWidth: '800px',
            margin: '0 auto 48px',
          }}
        >
          分析と戦略開発のための包括的なデータにアクセスしましょう。詳細なチームおよび試合統計からの洞察を得てゲームプレイを向上させます。
        </p>

        {/* ダウンロードカード */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            flexWrap: 'wrap',
            marginBottom: '40px',
          }}
        >
          {/* チームデータカード */}
          <div
            style={{
              flex: '1 1 300px',
              maxWidth: '400px',
              background: '#0d1124',
              borderRadius: '8px',
              padding: '32px 24px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              border: '1px solid #00c8ff20',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#00c8ff10',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00c8ff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3
              style={{
                color: '#fff',
                fontSize: '20px',
                fontWeight: 700,
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              チームデータ
            </h3>
            <p
              style={{
                color: '#b0c4d8',
                fontSize: '15px',
                lineHeight: 1.5,
                marginBottom: '24px',
                minHeight: '70px',
                textAlign: 'center',
              }}
            >
              詳細なチーム統計とパフォーマンス指標をダウンロード
            </p>
            <a
              href="/sumdownload/team"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#00c8ff',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                margin: '0 auto',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              ダウンロード
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </a>
          </div>

          {/* マッチデータカード */}
          <div
            style={{
              flex: '1 1 300px',
              maxWidth: '400px',
              background: '#0d1124',
              borderRadius: '8px',
              padding: '32px 24px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              border: '1px solid #00c8ff20',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#00c8ff10',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00c8ff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="17" y1="10" x2="3" y2="10"></line>
                <line x1="21" y1="6" x2="3" y2="6"></line>
                <line x1="21" y1="14" x2="3" y2="14"></line>
                <line x1="17" y1="18" x2="3" y2="18"></line>
              </svg>
            </div>
            <h3
              style={{
                color: '#fff',
                fontSize: '20px',
                fontWeight: 700,
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              マッチデータ
            </h3>
            <p
              style={{
                color: '#b0c4d8',
                fontSize: '15px',
                lineHeight: '1.5',
                marginBottom: '24px',
                minHeight: '70px',
                textAlign: 'center',
              }}
            >
              戦略向上のためのバトルレポートとマッチ分析へアクセス
            </p>
            <a
              href="/sumdownload/match"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#00c8ff',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                margin: '0 auto',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              ダウンロード
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
        <p
          style={{
            color: '#b0c4d8',
            fontSize: '15px',
          }}
        >
          詳細情報が必要ですか？
          <a href="/guide" style={{ color: '#00c8ff', textDecoration: 'none' }}>
            統合ガイドとチュートリアル
          </a>
          をご確認ください。
        </p>
      </div>
    </section>
  );
};

export default DownloadSection;
