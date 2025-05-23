import React from 'react';

// icons.tsx - Central icon export for Europa

// 外部リンク用のアイコンをエクスポート
export const ExternalLink = ({ className = "", size = 20, color = "#00c8ff" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path 
      d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M14 4H20V10" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M20 4L10 14" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const Icons = {
  // ロゴ
  Logo: ({ size = 30, color = "#00c8ff", secondaryColor = "#0060a0" }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="36" height="36" rx="4" fill="url(#grad)" />
      <path d="M10 10H30M10 20H25M10 30H30" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 5V35" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 3" />
      <circle cx="30" cy="20" r="3" fill="white" />
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor={color} />
          <stop offset="1" stopColor={secondaryColor} />
        </linearGradient>
      </defs>
    </svg>
  ),
  // チームデータ検索アイコン
  TeamSearch: ({ size = 40, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="8" r="3.5" stroke={color} strokeWidth="1.5"/>
      <circle cx="17" cy="10" r="2.5" stroke={color} strokeWidth="1.5"/>
      <circle cx="7" cy="16" r="2.5" stroke={color} strokeWidth="1.5"/>
      <circle cx="16" cy="16" r="2.5" stroke={color} strokeWidth="1.5"/>
      <path d="M10 11.5C7.5 11.5 3 12.5 3 16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M17 12.5C18.5 12.5 21 13.2 21 15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 18.5C5.8 18.5 4 19 4 20.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 18.5C17.2 18.5 19 19 19 20.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  // マッチデータ検索アイコン
  MatchSearch: ({ size = 40, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 4L18 8L14 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 20L6 16L10 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 8H13C10.7909 8 9 9.79086 9 12V16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 16H11C13.2091 16 15 14.2091 15 12V8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  // アップロードアイコン
  Upload: ({ size = 40, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 16V4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 9L12 4L17 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 16V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  // ダウンロードアイコン（チーム）
  TeamDownload: ({ size = 40, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="7" r="3" stroke={color} strokeWidth="1.5"/>
      <path d="M19 20C19 16.134 15.866 13 12 13C8.13401 13 5 16.134 5 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 13V20M12 20L15 17M12 20L9 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  // ダウンロードアイコン（マッチ）
  MatchDownload: ({ size = 40, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6H20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 10H20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 14H12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 18H12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 14V20M16 20L19 17M16 20L13 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  // 情報アイコン
  Information: ({ size = 40, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
      <path d="M12 8V16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="6.5" r="0.5" fill={color} stroke={color} strokeWidth="0.5"/>
    </svg>
  ),
  // レジスターアイコン
  Register: ({ size = 20, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5"/>
      <path d="M5 20C5 16.134 8.13401 13 12 13C15.866 13 19 16.134 19 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M19 6L21 8L19 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  // ログインアイコン
  Login: ({ size = 20, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 4L20 4L20 20L14 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 12L15 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 7L15 12L10 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  // ガイドラインアイコン
  Guidelines: ({ size = 20, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V5C20 3.89543 19.1046 3 18 3H16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 3C10.8954 3 10 3.89543 10 5V7C10 8.10457 10.8954 9 12 9C13.1046 9 14 8.10457 14 7V5C14 3.89543 13.1046 3 12 3Z" stroke={color} strokeWidth="1.5"/>
      <path d="M8 13H16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 17H16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  // 矢印アイコン
  Arrow: ({ size = 20, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 12H20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 6L20 12L14 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  // 検索アイコン
  Search: ({ size = 20, color = "#0a0818" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2"/>
      <path d="M16 16L20 20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  // パスワード表示アイコン
  EyeOpen: ({ size = 20, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5C7.45455 5 4 8.90909 4 12C4 15.0909 7.45455 19 12 19C16.5455 19 20 15.0909 20 12C20 8.90909 16.5455 5 12 5Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5"/>
    </svg>
  ),
  // パスワード非表示アイコン
  EyeClosed: ({ size = 20, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4L20 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 6.5C4.89336 7.2191 4 12 4 12C4 12 6 17 12 17C13.4869 17 14.7288 16.6429 15.75 16.1429" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13.5 13.5C12.7033 14.2967 11.2967 14.2967 10.5 13.5C9.7033 12.7033 9.7033 11.2967 10.5 10.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17.5 9.5C18.3967 10.3967 19 11.5 19 12C19 12 17 17 11 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};
