"use client";

import React, { useState, useEffect } from 'react';
import { createAppStylesBaseline } from '@arwes/core';
import { ArwesThemeProvider, Text, FrameCorners, FrameLines, Button, Card, Animator, GridLines, Dots, MovingLines } from '@arwes/react';
import { AnimatorGeneralProvider } from '@arwes/animation';
import { BleepsProvider } from '@arwes/sounds';
import { createGlobalStyle } from '@emotion/react';

// Global styles to match Arwes design system
const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap');
  
  body {
    margin: 0;
    padding: 0;
    background: #030712;
    color: #d4d4d8;
    font-family: 'Rajdhani', 'Noto Sans JP', sans-serif;
    line-height: 1.6;
    overflow-x: hidden;
  }
  
  * {
    box-sizing: border-box;
  }
  
  ::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`;

// SVG Icons converted to Arwes-compatible components
const Icons = {
  // Logo Icon with Arwes styling
  Logo: ({ size = 30 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="36" height="36" rx="4" fill="url(#grad)" />
      <path d="M10 10H30M10 20H25M10 30H30" stroke="var(--arwes-color-primary-main)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 5V35" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 3" />
      <circle cx="30" cy="20" r="3" fill="var(--arwes-color-primary-main)" />
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--arwes-color-primary-main)" />
          <stop offset="1" stopColor="var(--arwes-color-secondary-main)" />
        </linearGradient>
      </defs>
    </svg>
  ),
  
  // Other icons are similar implementations
  TeamSearch: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="8" r="3.5" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5"/>
      <circle cx="17" cy="10" r="2.5" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5"/>
      <circle cx="7" cy="16" r="2.5" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5"/>
      <circle cx="16" cy="16" r="2.5" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5"/>
      <path d="M10 11.5C7.5 11.5 3 12.5 3 16" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M17 12.5C18.5 12.5 21 13.2 21 15" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 18.5C5.8 18.5 4 19 4 20.5" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 18.5C17.2 18.5 19 19 19 20.5" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  
  // The other icons would be defined similarly...
  MatchSearch: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 4L18 8L14 12" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 20L6 16L10 12" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 8H13C10.7909 8 9 9.79086 9 12V16" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 16H11C13.2091 16 15 14.2091 15 12V8" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  
  Upload: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 16V4" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 9L12 4L17 9" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 16V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V16" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  
  TeamDownload: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="7" r="3" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5"/>
      <path d="M19 20C19 16.134 15.866 13 12 13C8.13401 13 5 16.134 5 20" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 13V20M12 20L15 17M12 20L9 17" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  
  MatchDownload: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6H20" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 10H20" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 14H12" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 18H12" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 14V20M16 20L19 17M16 20L13 17" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  
  Information: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5"/>
      <path d="M12 8V16" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="6.5" r="0.5" fill="var(--arwes-color-primary-main)" stroke="var(--arwes-color-primary-main)" strokeWidth="0.5"/>
    </svg>
  ),
  
  // More icons...
  Register: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5"/>
      <path d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M19 6L21 8L19 10" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  
  Login: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 4L20 4L20 20L14 20" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 12L15 12" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 7L15 12L10 17" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  
  Guidelines: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V5C20 3.89543 19.1046 3 18 3H16" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 3C10.8954 3 10 3.89543 10 5V7C10 8.10457 10.8954 9 12 9C13.1046 9 14 8.10457 14 7V5C14 3.89543 13.1046 3 12 3Z" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5"/>
      <path d="M8 13H16" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 17H16" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  
  Arrow: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 12H20" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 6L20 12L14 18" stroke="var(--arwes-color-primary-main)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  
  Search: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" stroke="var(--arwes-color-primary-main)" strokeWidth="2"/>
      <path d="M16 16L20 20" stroke="var(--arwes-color-primary-main)" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
};

// Arwes animations general settings
const animatorGeneral = {
  duration: {
    enter: 200,
    exit: 200,
    stagger: 50
  }
};

// Bleeps sound settings
const audioSettings = {
  common: {
    volume: 0.5
  },
  bleeps: {
    click: {
      sources: [{ src: '/sounds/click.mp3', type: 'audio/mpeg' }]
    },
    hover: {
      sources: [{ src: '/sounds/hover.mp3', type: 'audio/mpeg' }]
    },
    type: {
      sources: [{ src: '/sounds/type.mp3', type: 'audio/mpeg' }]
    }
  }
};

// Main component with Arwes styling
const EuropaArwes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activator, setActivator] = useState(true);

  // Simulate Arwes animation effect when component loads
  useEffect(() => {
    const timeout = setTimeout(() => {
      setActivator(false);
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <ArwesThemeProvider>
      <BleepsProvider audioSettings={audioSettings}>
        <AnimatorGeneralProvider animator={animatorGeneral}>
          <GlobalStyles />
          <StylesBaseline />
          
          <div className="europa-lp">
            {/* Background effects */}
            <GridLines
              lineColor="var(--arwes-color-primary-main)"
              lineOpacity={0.05}
              distance={100}
            />
            <Dots
              color="var(--arwes-color-primary-main)" 
              size={1}
              distance={100}
              opacity={0.05}
            />
            <MovingLines
              lineColor="var(--arwes-color-primary-main)"
              lineWidth={1}
              speed={0.05}
              opacity={0.1}
            />
            
            {/* Header */}
            <Animator animator={{ activate: activator, manager: 'stagger' }}>
              <FrameLines 
                className="header-frame"
                palette="primary"
                hover
                style={{
                  padding: '20px 5%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 10
                }}
              >
                <Animator>
                  <div style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: 'var(--arwes-color-primary-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <Icons.Logo size={36} />
                    <div>
                      <Text as="div" animator={{ activate: true }}>EUROPA</Text>
                      <Text as="div" style={{
                        fontSize: '12px',
                        opacity: 0.7,
                        fontWeight: 'normal',
                        letterSpacing: '1px'
                      }} animator={{ activate: true }}>
                        カルネージハート EXA
                      </Text>
                    </div>
                  </div>
                </Animator>
                
                <Animator>
                  <nav style={{
                    display: 'flex',
                    gap: '20px',
                  }}>
                    <Button 
                      palette="secondary"
                      FrameComponent={FrameLines}
                      animator={{ activate: true }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icons.Login size={18} />
                        <Text>ログイン</Text>
                      </div>
                    </Button>
                    
                    <Button 
                      palette="secondary"
                      FrameComponent={FrameLines}
                      animator={{ activate: true }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icons.Register size={18} />
                        <Text>新規登録</Text>
                      </div>
                    </Button>
                  </nav>
                </Animator>
              </FrameLines>
            </Animator>
            
            {/* Hero Section */}
            <section style={{
              position: 'relative',
              padding: '80px 5% 100px',
              overflow: 'hidden'
            }}>
              {/* Background elements - Arwes has built-in background effects */}
              <div style={{
                position: 'absolute',
                right: '-5%',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '50%',
                height: '120%',
                background: 'radial-gradient(circle, rgba(0, 200, 255, 0.1) 0%, rgba(10, 8, 24, 0) 70%)',
                zIndex: 1
              }}></div>
              
              <Animator animator={{ activate: true, manager: 'stagger' }}>
                <div style={{
                  position: 'absolute',
                  right: '5%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2
                }}>
                  {/* Arwes-styled interface frame */}
                  <FrameCorners 
                    animator={{ activate: true }}
                    palette="primary"
                    hover
                    cornerLength={20}
                    style={{
                      width: '400px',
                      height: '400px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {/* Cyberpunk interface visualization */}
                    <div style={{
                      width: '380px',
                      height: '380px',
                      position: 'relative'
                    }}>
                      <GridLines
                        lineColor="var(--arwes-color-primary-main)"
                        lineOpacity={0.5}
                        distance={40}
                      />
                      <Dots
                        color="var(--arwes-color-primary-main)" 
                        size={2}
                        distance={30}
                      />
                      
                      {/* Circular elements */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '200px',
                        height: '200px',
                        border: '2px solid var(--arwes-color-primary-main)',
                        borderRadius: '50%'
                      }}></div>
                      
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100px',
                        height: '100px',
                        border: '1px solid var(--arwes-color-primary-main)',
                        borderRadius: '50%'
                      }}></div>
                      
                      {/* Cross lines */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        width: '100%',
                        height: '1px',
                        background: 'var(--arwes-color-primary-main)'
                      }}></div>
                      
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        width: '1px',
                        height: '100%',
                        background: 'var(--arwes-color-primary-main)'
                      }}></div>
                    </div>
                  </FrameCorners>
                </div>
                
                <div style={{
                  maxWidth: '600px',
                  position: 'relative',
                  zIndex: 5
                }}>
                  <Animator>
                    <Text as="div" style={{
                      color: 'var(--arwes-color-primary-main)',
                      fontSize: '18px',
                      marginBottom: '10px',
                      letterSpacing: '1px'
                    }}>
                      CARNAGE HEART EXA | カルネージハート EXA
                    </Text>
                  </Animator>
                  
                  <Animator>
                    <Text as="h1" style={{
                      fontSize: '48px',
                      fontWeight: '700',
                      margin: '0 0 20px 0',
                      lineHeight: 1.2,
                      textShadow: '0 0 20px rgba(0, 0, 0, 0.5)'
                    }}>
                      非公式 OKE<br />
                      アップロード＆共有プラットフォーム
                    </Text>
                  </Animator>
                  
                  <Animator>
                    <Text as="p" style={{
                      fontSize: '18px',
                      color: '#aaa',
                      maxWidth: '500px',
                      margin: '0 auto 50px',
                      textAlign: 'center'
                    }}>
                      あなたの戦闘アルゴリズムをアップロードし、戦術的革新を共有し、世界中のOKE開発者とつながりましょう。
                    </Text>
                  </Animator>
                  
                  <div style={{
                    display: 'flex',
                    gap: '20px',
                    marginBottom: '50px'
                  }}>
                    <Animator>
                      <Button 
                        FrameComponent={FrameCorners}
                        palette="primary"
                        animator={{ activate: true }}
                        style={{ padding: '15px 30px' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Icons.Register size={18} />
                          <Text>始めましょう</Text>
                        </div>
                      </Button>
                    </Animator>
                    
                    <Animator>
                      <Button 
                        FrameComponent={FrameLines}
                        palette="secondary"
                        animator={{ activate: true }}
                        style={{ padding: '15px 30px' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Icons.Information size={18} />
                          <Text>詳細を見る</Text>
                        </div>
                      </Button>
                    </Animator>
                  </div>
                  
                  <Animator animator={{ manager: 'stagger' }}>
                    <div style={{
                      display: 'flex',
                      gap: '30px',
                    }}>
                      {[
                        { number: '2,500+', label: '登録済みOKE' },
                        { number: '180+', label: 'アクティブチーム' },
                        { number: '15k+', label: 'シミュレートバトル' }
                      ].map((stat, i) => (
                        <Animator key={i}>
                          <div>
                            <Text as="div" style={{
                              fontSize: '24px',
                              fontWeight: 'bold',
                              color: 'var(--arwes-color-primary-main)',
                              marginBottom: '5px'
                            }}>
                              {stat.number}
                            </Text>
                            <Text as="div" style={{
                              fontSize: '14px',
                              color: '#aaa'
                            }}>
                              {stat.label}
                            </Text>
                          </div>
                        </Animator>
                      ))}
                    </div>
                  </Animator>
                </div>
              </Animator>
            </section>
            
            {/* Main Features Section */}
            <section style={{
              padding: '50px 5%',
              background: 'rgba(0, 0, 0, 0.3)',
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{
                maxWidth: '1200px',
                margin: '0 auto'
              }}>
                <Animator animator={{ activate: true }}>
                  <Text as="h2" style={{
                    fontSize: '32px',
                    marginBottom: '15px',
                    textAlign: 'center',
                    fontWeight: '600'
                  }}>
                    主な機能
                  </Text>
                </Animator>
                
                <Animator animator={{ activate: true }}>
                  <Text as="p" style={{
                    fontSize: '16px',
                    color: '#aaa',
                    maxWidth: '600px',
                    margin: '0 auto 50px',
                    textAlign: 'center'
                  }}>
                    EUROPAの機能を活用して、OKE管理をより効率的に行いましょう
                  </Text>
                </Animator>
                
                <Animator animator={{ activate: true, manager: 'stagger' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '30px'
                  }}>
                    {/* Feature cards using Arwes Card component */}
                    {[
                      {
                        icon: <Icons.TeamSearch />,
                        title: 'チームデータ検索',
                        engTitle: 'Search Team Data',
                        desc: 'ランキングやパフォーマンス指標など、様々な条件でチームを検索、探索できます。'
                      },
                      {
                        icon: <Icons.MatchSearch />,
                        title: 'マッチデータ検索',
                        engTitle: 'Search Match Data',
                        desc: '戦略や戦術を向上させるために、試合結果やパフォーマンスデータを分析します。'
                      },
                      {
                        icon: <Icons.Upload />,
                        title: 'シンプルアップロード',
                        engTitle: 'Simple Upload',
                        desc: '合理化されたアップロードシステムでOKEファイルを簡単にアップロードできます。'
                      },
                      {
                        icon: <Icons.TeamDownload />,
                        title: 'チームデータ取得',
                        engTitle: 'Download Team Data',
                        desc: 'オフライン分析や戦略開発のために包括的なチームデータをダウンロードします。'
                      },
                      {
                        icon: <Icons.MatchDownload />,
                        title: 'マッチデータ取得',
                        engTitle: 'Download Match Data',
                        desc: '過去の戦闘から学ぶための詳細な試合統計とリプレイデータを取得します。'
                      },
                      {
                        icon: <Icons.Information />,
                        title: '情報',
                        engTitle: 'Information',
                        desc: 'カルネージハートEXAの詳細なガイド、チュートリアル、コミュニティリソースにアクセス。'
                      }
                    ].map((feature, i) => (
                      <Animator key={i}>
                        <FrameCorners
                          palette="primary"
                          hover
                          animator={{ activate: true }}
                          style={{
                            background: 'rgba(0, 0, 0, 0.3)',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <div style={{
                            padding: '30px',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                          }}>
                            <div style={{
                              marginBottom: '20px',
                              textAlign: 'center',
                              display: 'flex',
                              justifyContent: 'center'
                            }}>
                              {feature.icon}
                            </div>
                            <Text as="h3" style={{
                              fontSize: '22px',
                              marginBottom: '5px',
                              fontWeight: '600',
                              textAlign: 'center'
                            }}>
                              {feature.title}
                            </Text>
                            <Text as="div" style={{
                              fontSize: '14px',
                              color: 'var(--arwes-color-primary-main)',
                              opacity: 0.7,
                              marginBottom: '15px',
                              textAlign: 'center'
                            }}>
                              {feature.engTitle}
                            </Text>
                            <Text as="p" style={{
                              fontSize: '16px',
                              color: '#aaa',
                              textAlign: 'center',
                              flex: 1
                            }}>
                              {feature.desc}
                            </Text>
                            <Button
                              FrameComponent={FrameLines}
                              palette="secondary"
                              animator={{ activate: true }}
                              style={{
                                marginTop: '20px',
                                padding: '8px 0'
                              }}
                            >
                              <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '8px'
                              }}>
                                <Text>アクセスする</Text>
                                <Icons.Arrow size={14} />
                              </div>
                            </Button>
                          </div>
                        </FrameCorners>
                      </Animator>
                    ))}
                  </div>
                </Animator>
              </div>
            </section>
            
            {/* Search Section */}
            <section style={{
              padding: '80px 5%',
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{
                maxWidth: '1000px',
                margin: '0 auto',
                textAlign: 'center'
              }}>
                <Animator animator={{ activate: true }}>
                  <Text as="h2" style={{
                    fontSize: '32px',
                    marginBottom: '15px',
                    fontWeight: '600'
                  }}>
                    チームとマッチを検索
                  </Text>
                </Animator>
                
                <Animator animator={{ activate: true }}>
                  <Text as="div" style={{
                    fontSize: '16px',
                    color: 'var(--arwes-color-primary-main)',
                    opacity: 0.7,
                    marginBottom: '30px'
                  }}>
                    Download Team & Match Data
                  </Text>
                </Animator>
                
                <Animator animator={{ activate: true }}>
                  <Text as="p" style={{
                    fontSize: '18px',
                    color: '#aaa',
                    maxWidth: '700px',
                    margin: '0 auto 40px'
                  }}>
                    強力な検索ツールを使用して、条件に一致するチーム、マッチデータ、OKEを見つけましょう。
                  </Text>
                </Animator>
                
                <Animator animator={{ activate: true }}>
                  <FrameCorners
                    palette="primary"
                    hover
                    animator={{ activate: true }}
                    style={{
                      maxWidth: '700px',
                      margin: '0 auto 40px',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      width: '100%'
                    }}>
                      <input
                        type="text"
                        placeholder="チーム、マッチ、OKEを検索..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          flex: 1,
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: 'none',
                          color: '#fff',
                          padding: '15px 20px',
                          fontSize: '16px',
                          outline: 'none',
                          fontFamily: '"Rajdhani", "Noto Sans JP", sans-serif',
                        }}
                      />
                      <Button
                        FrameComponent={FrameLines}
                        palette="primary"
                        animator={{ activate: true }}
                        style={{
                          borderRadius: 0,
                          padding: '0 30px'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <Text>検索</Text>
                          <Icons.Search size={16} />
                        </div>
                      </Button>
                    </div>
                  </FrameCorners>
                </Animator>
                
                {/* Search options */}
                <Animator animator={{ activate: true, manager: 'stagger' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    marginBottom: '40px',
                    flexWrap: 'wrap'
                  }}>
                    {[
                      { icon: <Icons.TeamSearch size={20} />, text: 'チームデータ検索' },
                      { icon: <Icons.MatchSearch size={20} />, text: 'マッチデータ検索' }
                    ].map((option, i) => (
                      <Animator key={i}>
                        <Button
                          FrameComponent={FrameCorners}
                          palette="secondary"
                          animator={{ activate: true }}
                          style={{
                            padding: '12px 20px'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}>
                            {option.icon}
                            <Text>{option.text}</Text>
                          </div>
                        </Button>
                      </Animator>
                    ))}
                  </div>
                </Animator>
                
                <Animator animator={{ activate: true, manager: 'stagger' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '15px',
                    flexWrap: 'wrap'
                  }}>
                    {[
                      { jp: '攻撃', en: 'Attack' }, 
                      { jp: '防御', en: 'Defense' }, 
                      { jp: 'バランス', en: 'Balanced' }, 
                      { jp: 'サポート', en: 'Support' }, 
                      { jp: '砲撃', en: 'Artillery' }, 
                      { jp: '偵察', en: 'Scout' }
                    ].map((tag, i) => (
                      <Animator key={i}>
                        <Button
                          FrameComponent={FrameLines}
                          palette="primary"
                          animator={{ activate: true }}
                          style={{
                            padding: '8px 15px',
                            borderRadius: '20px'
                          }}
                        >
                          <Text style={{ fontSize: '14px' }}>
                            {tag.jp} / {tag.en}
                          </Text>
                        </Button>
                      </Animator>
                    ))}
                  </div>
                </Animator>
              </div>
            </section>
            
            {/* Upload Section */}
            <section style={{
              padding: '80px 5%',
              background: 'rgba(0, 0, 0, 0.3)',
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{
                maxWidth: '1000px',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '50px'
              }}>
                <Animator animator={{ activate: true }}>
                  <div style={{
                    flex: '1 1 400px'
                  }}>
                    <Text as="h2" style={{
                      fontSize: '32px',
                      marginBottom: '15px',
                      fontWeight: '600'
                    }}>
                      OKEをアップロード
                    </Text>
                    
                    <Text as="div" style={{
                      fontSize: '16px',
                      color: 'var(--arwes-color-primary-main)',
                      opacity: 0.7,
                      marginBottom: '30px'
                    }}>
                      Upload Your OKE
                    </Text>
                    
                    <Text as="p" style={{
                      fontSize: '18px',
                      color: '#aaa',
                      marginBottom: '30px'
                    }}>
                      あなたのカルネージハートEXAアルゴリズムをコミュニティと共有しましょう。シンプルなアップロードシステムにより、簡単に投稿してフィードバックを得ることができます。
                    </Text>
                    
                    <div style={{
                      display: 'flex',
                      gap: '20px',
                      flexWrap: 'wrap'
                    }}>
                      <Button
                        FrameComponent={FrameCorners}
                        palette="primary"
                        animator={{ activate: true }}
                        style={{
                          padding: '15px 25px'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}>
                          <Icons.Upload size={20} />
                          <Text>アップロードする</Text>
                        </div>
                      </Button>
                      
                      <Button
                        FrameComponent={FrameLines}
                        palette="secondary"
                        animator={{ activate: true }}
                        style={{
                          padding: '15px 25px'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}>
                          <Icons.Guidelines size={20} />
                          <Text>ガイドラインを見る</Text>
                        </div>
                      </Button>
                    </div>
                  </div>
                </Animator>
                
                <Animator animator={{ activate: true }}>
                  <div style={{
                    flex: '1 1 400px',
                    position: 'relative'
                  }}>
                    {/* Upload interface frame */}
                    <FrameCorners
                      palette="primary"
                      hover
                      animator={{ activate: true }}
                      style={{
                        width: '100%',
                        aspectRatio: '4/3',
                        background: 'rgba(0, 0, 0, 0.3)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        height: '60%',
                        border: '2px dashed var(--arwes-color-primary-main)',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                        textAlign: 'center'
                      }}>
                        <Icons.Upload size={60} />
                        <Text as="div" style={{
                          fontSize: '18px',
                          fontWeight: '600',
                          marginBottom: '10px',
                          color: 'var(--arwes-color-primary-main)',
                          marginTop: '20px'
                        }}>
                          OKEファイルをドラッグ＆ドロップ
                        </Text>
                        <Text as="div" style={{
                          fontSize: '14px',
                          color: '#aaa'
                        }}>
                          またはクリックしてファイルを選択
                        </Text>
                      </div>
                      
                      {/* Interface details */}
                      <Text as="div" style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        fontSize: '18px',
                        fontWeight: '600'
                      }}>
                        OKEアップロード
                      </Text>
                      
                      <Text as="div" style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '20px',
                        fontSize: '14px',
                        color: '#aaa'
                      }}>
                        対応形式: .CHX, .OKE
                      </Text>
                      
                      <Text as="div" style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '20px',
                        fontSize: '14px',
                        color: 'var(--arwes-color-primary-main)'
                      }}>
                        最大サイズ: 10MB
                      </Text>
                    </FrameCorners>
                  </div>
                </Animator>
              </div>
            </section>
            
            {/* Download Section */}
            <section style={{
              padding: '80px 5%',
              position: 'relative',
              zIndex: 2
            }}>
              <div style={{
                maxWidth: '1000px',
                margin: '0 auto',
                textAlign: 'center'
              }}>
                <Animator animator={{ activate: true }}>
                  <Text as="h2" style={{
                    fontSize: '32px',
                    marginBottom: '15px',
                    fontWeight: '600'
                  }}>
                    チーム＆マッチデータのダウンロード
                  </Text>
                </Animator>
                
                <Animator animator={{ activate: true }}>
                  <Text as="div" style={{
                    fontSize: '16px',
                    color: 'var(--arwes-color-primary-main)',
                    opacity: 0.7,
                    marginBottom: '30px'
                  }}>
                    Download Team & Match Data
                  </Text>
                </Animator>
                
                <Animator animator={{ activate: true }}>
                  <Text as="p" style={{
                    fontSize: '18px',
                    color: '#aaa',
                    maxWidth: '700px',
                    margin: '0 auto 40px'
                  }}>
                    分析と戦略開発のための包括的なデータにアクセスしましょう。詳細なチームおよび試合統計からの洞察を得てゲームプレイを向上させます。
                  </Text>
                </Animator>
                
                <Animator animator={{ activate: true, manager: 'stagger' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '30px',
                    flexWrap: 'wrap',
                    marginBottom: '50px'
                  }}>
                    {[
                      {
                        icon: <Icons.TeamDownload size={60} />,
                        title: 'チームデータ',
                        desc: '詳細なチーム統計とパフォーマンス指標をダウンロード'
                      },
                      {
                        icon: <Icons.MatchDownload size={60} />,
                        title: 'マッチデータ',
                        desc: '戦略向上のためのバトルレポートとマッチ分析へアクセス'
                      }
                    ].map((item, i) => (
                      <Animator key={i}>
                        <FrameCorners
                          palette="primary"
                          hover
                          animator={{ activate: true }}
                          style={{
                            width: '280px',
                            padding: '30px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                          }}
                        >
                          {item.icon}
                          <Text as="h3" style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            margin: '15px 0 10px'
                          }}>
                            {item.title}
                          </Text>
                          <Text as="p" style={{
                            fontSize: '14px',
                            color: '#aaa',
                            margin: 0
                          }}>
                            {item.desc}
                          </Text>
                        </FrameCorners>
                      </Animator>
                    ))}
                  </div>
                </Animator>
                
                <Animator animator={{ activate: true }}>
                  <Text as="div" style={{
                    fontSize: '16px',
                    color: '#aaa'
                  }}>
                    詳細情報が必要ですか？
                    <Button
                      palette="secondary"
                      animator={{ activate: true }}
                      style={{
                        display: 'inline-block',
                        padding: '0 5px',
                        margin: '0 5px'
                      }}
                    >
                      <Text>総合ガイド</Text>
                    </Button>
                    と
                    <Button
                      palette="secondary"
                      animator={{ activate: true }}
                      style={{
                        display: 'inline-block',
                        padding: '0 5px',
                        margin: '0 5px'
                      }}
                    >
                      <Text>チュートリアル</Text>
                    </Button>
                    をご確認ください。
                  </Text>
                </Animator>
              </div>
            </section>
            
            {/* CTA Section */}
            <section style={{
              padding: '100px 5%',
              background: 'linear-gradient(180deg, rgba(0, 10, 30, 0) 0%, rgba(0, 40, 80, 0.2) 100%)',
              position: 'relative',
              zIndex: 2
            }}>
              <Animator animator={{ activate: true }}>
                <div style={{
                  maxWidth: '800px',
                  margin: '0 auto',
                  textAlign: 'center'
                }}>
                  <Text as="h2" style={{
                    fontSize: '38px',
                    fontWeight: '700',
                    marginBottom: '20px'
                  }}>
                    ネットワークに参加しませんか？
                  </Text>
                  
                  <Text as="p" style={{
                    fontSize: '18px',
                    color: '#aaa',
                    marginBottom: '40px',
                    maxWidth: '600px',
                    margin: '0 auto 40px'
                  }}>
                    今日アカウントを作成して、グローバルなカルネージハートEXAコミュニティであなたのOKEの共有を始めましょう。
                  </Text>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    flexWrap: 'wrap'
                  }}>
                    <Button 
                      FrameComponent={FrameCorners}
                      palette="primary"
                      animator={{ activate: true }}
                      style={{ padding: '15px 30px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icons.Register size={18} />
                        <Text>今すぐ登録</Text>
                      </div>
                    </Button>
                    
                    <Button 
                      FrameComponent={FrameLines}
                      palette="secondary"
                      animator={{ activate: true }}
                      style={{ padding: '15px 30px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Icons.Login size={18} />
                        <Text>ログイン</Text>
                      </div>
                    </Button>
                  </div>
                </div>
              </Animator>
            </section>
            
            {/* Footer */}
            <Animator animator={{ activate: true }}>
              <FrameLines
                palette="primary"
                animator={{ activate: true }}
                style={{
                  padding: '40px 5%',
                  background: 'rgba(0, 0, 0, 0.3)',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                <div style={{
                  maxWidth: '1200px',
                  margin: '0 auto',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '40px'
                }}>
                  <div>
                    <div style={{
                      fontSize: '22px',
                      fontWeight: 'bold',
                      marginBottom: '5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <Icons.Logo size={28} />
                      <Text>EUROPA</Text>
                    </div>
                    <Text as="div" style={{
                      fontSize: '14px',
                      color: 'var(--arwes-color-primary-main)',
                      opacity: 0.7,
                      marginBottom: '20px'
                    }}>
                      カルネージハート EXA
                    </Text>
                    <Text as="p" style={{
                      fontSize: '14px',
                      color: '#aaa',
                      maxWidth: '300px',
                      marginBottom: '20px'
                    }}>
                      OKE共有とチームコラボレーションのための非公式カルネージハートEXAプラットフォーム。
                    </Text>
                    <Text as="div" style={{
                      fontSize: '14px',
                      color: '#888'
                    }}>
                      &copy; 2025 PROJECT EUROPA
                    </Text>
                  </div>
                  
                  {[
                    {
                      title: '機能',
                      items: [
                        { jp: 'チームデータ検索', en: 'Search Team Data' },
                        { jp: 'マッチデータ検索', en: 'Search Match Data' },
                        { jp: 'シンプルアップロード', en: 'Simple Upload' },
                        { jp: 'チームデータ取得', en: 'Team Download' },
                        { jp: 'マッチデータ取得', en: 'Match Download' },
                        { jp: '情報', en: 'Information' }
                      ]
                    },
                    {
                      title: 'アカウント',
                      items: [
                        { jp: 'ログイン', en: 'Login' },
                        { jp: '新規登録', en: 'Register' },
                        { jp: 'プロフィール', en: 'My Profile' },
                        { jp: 'マイチーム', en: 'My Teams' },
                        { jp: 'マイOKE', en: 'My OKE' },
                        { jp: '設定', en: 'Settings' }
                      ]
                    },
                    {
                      title: 'お問い合わせ・法的情報',
                      items: [
                        { jp: '私たちについて', en: 'About Us' },
                        { jp: 'お問い合わせ', en: 'Contact' },
                        { jp: 'プライバシーポリシー', en: 'Privacy Policy' },
                        { jp: '利用規約', en: 'Terms of Service' },
                        { jp: 'よくある質問', en: 'FAQ' }
                      ]
                    }
                  ].map((section, i) => (
                    <div key={i}>
                      <Text as="h3" style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '15px',
                        color: 'var(--arwes-color-primary-main)'
                      }}>
                        {section.title}
                      </Text>
                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0
                      }}>
                        {section.items.map((item, j) => (
                          <li key={j} style={{
                            marginBottom: '10px'
                          }}>
                            <Button
                              palette="secondary"
                              animator={{ activate: true }}
                              style={{
                                padding: 0,
                                background: 'transparent',
                                textAlign: 'left'
                              }}
                            >
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '14px'
                              }}>
                                <Icons.Arrow size={10} />
                                <Text>{item.jp}</Text>
                              </div>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </FrameLines>
            </Animator>
          </div>
        </AnimatorGeneralProvider>
      </BleepsProvider>
    </ArwesThemeProvider>
  );
};

export default EuropaArwes;