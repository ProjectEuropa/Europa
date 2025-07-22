import type React from 'react';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
}

const FeaturesSection: React.FC = () => {
  const features: FeatureItem[] = [
    {
      icon: (
        <svg
          width={36}
          height={36}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00c8ff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="10" cy="8" r="3.5" />
          <circle cx="17" cy="10" r="2.5" />
          <circle cx="7" cy="16" r="2.5" />
          <circle cx="16" cy="16" r="2.5" />
          <path d="M10 11.5C7.5 11.5 3 12.5 3 16" strokeLinecap="round" />
          <path d="M17 12.5C18.5 12.5 21 13.2 21 15" strokeLinecap="round" />
          <path d="M7 18.5C5.8 18.5 4 19 4 20.5" strokeLinecap="round" />
          <path d="M16 18.5C17.2 18.5 19 19 19 20.5" strokeLinecap="round" />
        </svg>
      ),
      title: 'チームデータ検索',
      description:
        'ランキングやパフォーマンス指標など、様々な条件でチームを検索、探索できます。',
      href: '/search/team',
    },
    {
      icon: (
        <svg
          width={36}
          height={36}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00c8ff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 4L18 8L14 12" />
          <path d="M10 20L6 16L10 12" />
          <path d="M18 8H13C10.7909 8 9 9.79086 9 12V16" />
          <path d="M6 16H11C13.2091 16 15 14.2091 15 12V8" />
        </svg>
      ),
      title: 'マッチデータ検索',
      description:
        '戦略や戦術を向上させるために、試合結果やパフォーマンスデータを分析します。',
      href: '/search/match',
    },
    {
      icon: (
        <svg
          width={36}
          height={36}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00c8ff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 16V4" />
          <path d="M7 9L12 4L17 9" />
          <path d="M20 16V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V16" />
        </svg>
      ),
      title: 'アップロード',
      description:
        '合理化されたアップロードシステムでOKEファイルを簡単にアップロードできます。',
      href: '/upload',
    },
    {
      icon: (
        <svg
          width={36}
          height={36}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00c8ff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="7" r="3" />
          <path d="M19 20C19 16.134 15.866 13 12 13C8.13401 13 5 16.134 5 20" />
          <path d="M12 13V20M12 20L15 17M12 20L9 17" />
        </svg>
      ),
      title: 'チームデータ取得',
      description:
        'オフライン分析や戦略開発のために包括的なチームデータをダウンロードします。',
      href: '/sumdownload/team',
    },
    {
      icon: (
        <svg
          width={36}
          height={36}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00c8ff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6H20" />
          <path d="M4 10H20" />
          <path d="M4 14H12" />
          <path d="M4 18H12" />
          <path d="M16 14V20M16 20L19 17M16 20L13 17" />
        </svg>
      ),
      title: 'マッチデータ取得',
      description: '過去の戦闘から学ぶための詳細な試合統計を取得します。',
      href: '/sumdownload/match',
    },
    {
      icon: (
        <svg
          width={36}
          height={36}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00c8ff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8V16" />
          <circle
            cx="12"
            cy="6.5"
            r="0.5"
            fill="#00c8ff"
            stroke="#00c8ff"
            strokeWidth="0.5"
          />
        </svg>
      ),
      title: '情報',
      description:
        'カルネージハートEXAの大会イベントなどの情報にアクセスできます。',
      href: '/info',
    },
  ];

  return (
    <section
      id="features"
      style={{
        padding: '80px 0 60px 0',
        background: 'transparent',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            color: '#00c8ff',
            fontWeight: 800,
            fontSize: '0.9rem',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          主な機能
        </h2>
        <h3
          style={{
            color: '#fff',
            fontWeight: 800,
            fontSize: '2.2rem',
            marginBottom: '16px',
          }}
        >
          OKE開発を加速させる機能
        </h3>
        <p
          style={{
            color: '#b0c4d8',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            marginBottom: '60px',
            maxWidth: '700px',
            margin: '0 auto 40px',
          }}
        >
          カルネージハートEXAのOKE開発をサポートする包括的なツールセット。
          戦略の作成から共有、分析まで、すべてのニーズに対応します。
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            justifyContent: 'center',
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                background: '#0a0e1a',
                border: '1.5px solid #00c8ff33',
                borderRadius: '16px',
                padding: '32px 24px 28px 24px',
                boxShadow: '0 0 24px 0 #00c8ff22',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'box-shadow 0.2s, border 0.2s',
                minHeight: '260px',
                cursor: 'pointer',
              }}
            >
              <div style={{ marginBottom: '12px' }}>{feature.icon}</div>
              <div
                style={{
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1.18rem',
                  marginBottom: '4px',
                }}
              >
                {feature.title}
              </div>
              <div
                style={{
                  color: '#00c8ff',
                  fontSize: '0.98rem',
                  fontWeight: 600,
                  marginBottom: '12px',
                }}
              >
                {feature.title
                  .replace('データ', ' Data')
                  .replace('シンプル', 'Simple ')
                  .replace('情報', 'Information')}
              </div>
              <div
                style={{
                  color: '#b0c4d8',
                  fontSize: '0.98rem',
                  marginBottom: '18px',
                  textAlign: 'center',
                }}
              >
                {feature.description}
              </div>
              <a
                href={feature.href}
                style={{
                  color: '#00c8ff',
                  fontWeight: 600,
                  fontSize: '0.98rem',
                  textDecoration: 'none',
                }}
              >
                アクセスする →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
