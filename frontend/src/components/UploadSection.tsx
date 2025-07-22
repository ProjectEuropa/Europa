import type React from 'react';
import { useState } from 'react';

const UploadSection: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // ファイルのドロップ処理をここに実装
    const files = e.dataTransfer.files;
  };

  return (
    <section
      id="upload"
      style={{
        padding: '80px 0',
        position: 'relative',
        overflow: 'hidden',
        background: '#0a0818',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '40px',
        }}
      >
        {/* 左側：テキストとボタン */}
        <div
          style={{
            flex: '1 1 400px',
            minWidth: '300px',
            maxWidth: '500px',
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
            OKEをアップロード
          </h2>
          <div
            style={{
              color: '#00c8ff',
              fontSize: '16px',
              marginBottom: '24px',
            }}
          >
            Upload Your OKE
          </div>
          <p
            style={{
              color: '#b0c4d8',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              marginBottom: '32px',
            }}
          >
            あなたのカルネージハートEXAアルゴリズムをコミュニティと共有しましょう。シンプルなアップロードシステムにより、簡単に投稿してフィードバックを得ることができます。
          </p>
          <div
            style={{
              display: 'flex',
              gap: '16px',
            }}
          >
            <a
              href="/upload"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: '#00c8ff',
                borderRadius: '4px',
                color: '#0a0818',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
            >
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
                <path d="M21 14V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6"></path>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <path d="M16 17l-4-4-4 4"></path>
                <line x1="12" y1="13" x2="12" y2="21"></line>
              </svg>
              アップロードする
            </a>
            <a
              href="/guide"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'transparent',
                border: '1px solid #00c8ff',
                borderRadius: '4px',
                color: '#00c8ff',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
            >
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              ガイドラインを見る
            </a>
          </div>
        </div>

        {/* 右側：ドラッグ＆ドロップエリア */}
        <div
          style={{
            flex: '1 1 400px',
            minWidth: '300px',
          }}
        >
          <div
            style={{
              background: '#0d1124',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div
              style={{
                color: '#fff',
                fontSize: '18px',
                fontWeight: 600,
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              OKEアップロード
            </div>
            <div
              style={{
                border: `2px dashed ${isDragging ? '#00c8ff' : 'rgba(0, 200, 255, 0.4)'}`,
                borderRadius: '8px',
                padding: '40px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: isDragging
                  ? 'rgba(0, 200, 255, 0.05)'
                  : 'transparent',
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00c8ff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginBottom: '16px' }}
              >
                <path d="M21 14V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6"></path>
                <line x1="3" y1="10" x2="21" y2="10"></line>
                <path d="M16 17l-4-4-4 4"></path>
                <line x1="12" y1="13" x2="12" y2="21"></line>
              </svg>
              <div
                style={{
                  color: '#00c8ff',
                  fontSize: '16px',
                  fontWeight: 600,
                  marginBottom: '8px',
                }}
              >
                CHEファイルをドラッグ＆ドロップ
              </div>
              <div style={{ color: '#b0c4d8', fontSize: '14px' }}>
                またはクリックしてファイルを選択
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '16px',
                fontSize: '14px',
              }}
            >
              <div style={{ color: '#b0c4d8' }}>対応形式: .CHE</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
