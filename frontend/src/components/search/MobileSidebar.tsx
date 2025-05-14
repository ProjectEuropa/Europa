import React, { useEffect } from 'react';
import SidebarItem from './SidebarItem';
import { usePathname } from 'next/navigation';

interface MobileSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();

  // Handle body scroll lock when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div 
      className={`lg:hidden fixed inset-0 z-20 transition-opacity duration-300 ease-in-out ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop with fade effect */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? 'opacity-80' : 'opacity-0'
        }`} 
        onClick={() => setIsOpen(false)}
      ></div>
      
      {/* Sidebar with slide effect */}
      <div 
        className={`absolute left-0 top-0 h-full w-64 bg-gray-950 shadow-lg overflow-y-auto transform transition-transform duration-300 ease-in-out border-r border-blue-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-blue-400">メニュー</h2>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <nav className="space-y-1">
            {/* ホーム */}
            <SidebarItem 
              icon="home" 
              label="ホーム" 
              href="/" 
              active={pathname === '/'} 
            />
            
            {/* 検索 */}
            <div className="py-2">
              <h3 className="text-sm font-medium text-blue-300 mb-2 px-4">検索</h3>
              <SidebarItem 
                icon="search" 
                label="チームデータ検索" 
                href="/search/team" 
                active={pathname === '/search/team'} 
              />
              <SidebarItem 
                icon="match" 
                label="マッチデータ検索" 
                href="/search/match" 
                active={pathname === '/search/match'} 
              />
            </div>
            
            {/* アップロード */}
            <div className="py-2">
              <h3 className="text-sm font-medium text-blue-300 mb-2 px-4">アップロード</h3>
              <SidebarItem 
                icon="upload" 
                label="チームアップロード" 
                href="/upload" 
                active={pathname === '/upload'} 
              />
              <SidebarItem 
                icon="upload" 
                label="マッチアップロード" 
                href="/upload/match" 
                active={pathname === '/upload/match'} 
              />
            </div>
            
            {/* ダウンロード */}
            <div className="py-2">
              <h3 className="text-sm font-medium text-blue-300 mb-2 px-4">ダウンロード</h3>
              <SidebarItem 
                icon="download" 
                label="チームデータ取得" 
                href="/download/team" 
                active={pathname === '/download/team'} 
              />
              <SidebarItem 
                icon="download" 
                label="マッチデータ取得" 
                href="/download/match" 
                active={pathname === '/download/match'} 
              />
              <SidebarItem 
                icon="download" 
                label="サマリーダウンロード" 
                href="/sumdownload/team" 
                active={pathname === '/sumdownload/team'} 
              />
            </div>
            
            {/* アカウント */}
            <div className="py-2">
              <h3 className="text-sm font-medium text-blue-300 mb-2 px-4">アカウント</h3>
              <SidebarItem 
                icon="login" 
                label="ログイン" 
                href="/login" 
                active={pathname === '/login'} 
              />
              <SidebarItem 
                icon="register" 
                label="新規登録" 
                href="/register" 
                active={pathname === '/register'} 
              />
              <SidebarItem 
                icon="password" 
                label="パスワード再設定" 
                href="/forgot-password" 
                active={pathname === '/forgot-password'} 
              />
            </div>
            
            {/* 情報 */}
            <div className="py-2">
              <h3 className="text-sm font-medium text-blue-300 mb-2 px-4">情報</h3>
              <SidebarItem 
                icon="info" 
                label="Information" 
                href="/info" 
                active={pathname === '/info'} 
              />
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
