import React from 'react';

// SVGアイコンコンポーネント
const Icons = {
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
  
  // Favicon (アプリアイコン)
  Favicon: ({ size = 32, color = "#00c8ff", secondaryColor = "#0060a0" }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="6" fill="url(#faviconGrad)" />
      <path d="M8 8H24M8 16H20M8 24H24" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 4V28" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="1 2" />
      <circle cx="24" cy="16" r="2.5" fill="white" />
      <defs>
        <linearGradient id="faviconGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
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
  MatchSearch: ({ size = 40, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 4L18 8L14 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 20L6 16L10 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 8H13C10.7909 8 9 9.79086 9 12V16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 16H11C13.2091 16 15 14.2091 15 12V8" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Upload: ({ size = 40, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 16V4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M7 9L12 4L17 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 16V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  TeamDownload: ({ size = 40, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="7" r="3" stroke={color} strokeWidth="1.5"/>
      <path d="M19 20C19 16.134 15.866 13 12 13C8.13401 13 5 16.134 5 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 13V20M12 20L15 17M12 20L9 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  MatchDownload: ({ size = 40, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 6H20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 10H20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 14H12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 18H12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 14V20M16 20L19 17M16 20L13 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Information: ({ size = 40, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
      <path d="M12 8V16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="6.5" r="0.5" fill={color} stroke={color} strokeWidth="0.5"/>
    </svg>
  ),
  Register: ({ size = 20, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5"/>
      <path d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M19 6L21 8L19 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Login: ({ size = 20, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 4L20 4L20 20L14 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 12L15 12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 7L15 12L10 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Guidelines: ({ size = 20, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 3H6C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V5C20 3.89543 19.1046 3 18 3H16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 3C10.8954 3 10 3.89543 10 5V7C10 8.10457 10.8954 9 12 9C13.1046 9 14 8.10457 14 7V5C14 3.89543 13.1046 3 12 3Z" stroke={color} strokeWidth="1.5"/>
      <path d="M8 13H16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 17H16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  Arrow: ({ size = 20, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 12H20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 6L20 12L14 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Search: ({ size = 20, color = "#0a0818" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="2"/>
      <path d="M16 16L20 20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  // ログアウトアイコン
  Logout: ({ size = 20, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 17L21 12L16 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 12H9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 19V5C5 3.89543 5.89543 3 7 3H12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  
  // SNSシェアアイコン
  Twitter: ({ size = 24, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 4.01C21.0424 4.67546 19.9821 5.19211 18.86 5.54C18.2577 4.84751 17.4573 4.35418 16.567 4.12063C15.6767 3.88708 14.7395 3.92301 13.8821 4.22426C13.0247 4.5255 12.2884 5.08235 11.773 5.82C11.2575 6.55765 10.9877 7.44296 11 8.34V9.34C9.24257 9.38225 7.50127 8.98258 5.93101 8.18137C4.36074 7.38016 3.01032 6.20006 2 4.75C2 4.75 -2 13 8 17C5.94053 18.398 3.48716 19.0989 1 19C11 24 23 17 23 8.34C22.9991 8.06 22.9723 7.78 22.92 7.51C23.9406 6.35104 24.4892 4.88618 22 4.01Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  
  Facebook: ({ size = 24, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  
  LinkedIn: ({ size = 24, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 9H2V21H6V9Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  
  Instagram: ({ size = 24, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5932 15.1514 13.8416 15.5297C13.0901 15.9079 12.2385 16.0396 11.4078 15.9059C10.5771 15.7723 9.80977 15.3801 9.21485 14.7852C8.61993 14.1902 8.22774 13.4229 8.09408 12.5922C7.96042 11.7615 8.09208 10.9099 8.47034 10.1584C8.8486 9.40685 9.4542 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87658 12.63 8C13.4789 8.12588 14.2649 8.52146 14.8717 9.12831C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17.5 6.5H17.51" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  
  Share: ({ size = 24, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="5" r="3" stroke={color} strokeWidth="1.5"/>
      <circle cx="6" cy="12" r="3" stroke={color} strokeWidth="1.5"/>
      <circle cx="18" cy="19" r="3" stroke={color} strokeWidth="1.5"/>
      <path d="M9 10.5L15 6.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 13.5L15 17.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  
  // ハンバーガーメニューアイコン
  Menu: ({ size = 24, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 12H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 18H21" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  
  // メニューを閉じるアイコン
  Close: ({ size = 24, color = "#00c8ff" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 6L18 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

export default Icons;
