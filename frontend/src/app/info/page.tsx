'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Calendar from '../../components/Calendar';

const InformationPage: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'rgb(var(--background-rgb))'
    }}>
      <Header />
      
      <main style={{
        flex: '1',
        padding: '40px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h1 style={{
              color: '#00c8ff',
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>
              Information
            </h1>
            <div style={{
              marginLeft: '16px',
              color: '#b0c4d8',
              fontSize: '1rem'
            }}>
              - Carnage Heart EXA Uploader -
            </div>
          </div>
          
          {/* メインコンテンツ */}
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px'
          }}>
            {/* カレンダー */}
            <div style={{
              background: '#0A1022',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #1E3A5F'
            }}>
              <h2 style={{
                color: '#00c8ff',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '24px',
                textAlign: 'center'
              }}>
                カレンダー
              </h2>
              <div style={{
                width: '100%'
              }}>
                <Calendar initialDate={new Date(2025, 4, 6)} />
              </div>
            </div>
            
            {/* 予定リスト */}
            <div style={{
              background: '#0A1022',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #1E3A5F'
            }}>
              <h2 style={{
                color: '#00c8ff',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '16px'
              }}>
                今後の予定
              </h2>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{
                  display: 'flex',
                  padding: '12px',
                  background: 'rgba(0, 200, 255, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid #1E3A5F'
                }}>
                  <div style={{
                    width: '80px',
                    color: '#00c8ff',
                    fontWeight: 'bold'
                  }}>
                    5/6
                  </div>
                  <div style={{
                    flex: '1',
                    color: '#fff'
                  }}>
                    中小CPUハンデ戦 エントリー締切
                  </div>
                  <div style={{
                    width: '100px',
                    color: '#b0c4d8',
                    textAlign: 'right'
                  }}>
                    23:59まで
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  padding: '12px',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px',
                  border: '1px solid #1E3A5F'
                }}>
                  <div style={{
                    width: '80px',
                    color: '#00c8ff',
                    fontWeight: 'bold'
                  }}>
                    5/10
                  </div>
                  <div style={{
                    flex: '1',
                    color: '#fff'
                  }}>
                    中小CPUハンデ戦 トーナメント開始
                  </div>
                  <div style={{
                    width: '100px',
                    color: '#b0c4d8',
                    textAlign: 'right'
                  }}>
                    10:00〜
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  padding: '12px',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px',
                  border: '1px solid #1E3A5F'
                }}>
                  <div style={{
                    width: '80px',
                    color: '#00c8ff',
                    fontWeight: 'bold'
                  }}>
                    5/15
                  </div>
                  <div style={{
                    flex: '1',
                    color: '#fff'
                  }}>
                    システムメンテナンス
                  </div>
                  <div style={{
                    width: '100px',
                    color: '#b0c4d8',
                    textAlign: 'right'
                  }}>
                    2:00〜5:00
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  padding: '12px',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px',
                  border: '1px solid #1E3A5F'
                }}>
                  <div style={{
                    width: '80px',
                    color: '#00c8ff',
                    fontWeight: 'bold'
                  }}>
                    5/20
                  </div>
                  <div style={{
                    flex: '1',
                    color: '#fff'
                  }}>
                    大会結果発表
                  </div>
                  <div style={{
                    width: '100px',
                    color: '#b0c4d8',
                    textAlign: 'right'
                  }}>
                    12:00〜
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InformationPage;