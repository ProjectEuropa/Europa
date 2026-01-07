import { usePathname } from 'next/navigation';
import type React from 'react';
import SidebarItem from './SidebarItem';

const DesktopSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block lg:w-64 h-fit">
      <div className="bg-gray-950 rounded p-5 shadow-lg border border-blue-900/30 hover:border-blue-700/50 transition-all duration-300">
        <h2 className="text-lg font-semibold text-blue-400 mb-5">メニュー</h2>
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
            <h3 className="text-sm font-medium text-blue-300 mb-2 px-4">
              検索
            </h3>
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
            <h3 className="text-sm font-medium text-blue-300 mb-2 px-4">
              アップロード
            </h3>
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
            <h3 className="text-sm font-medium text-blue-300 mb-2 px-4">
              ダウンロード
            </h3>
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
            <h3 className="text-sm font-medium text-blue-300 mb-2 px-4">
              アカウント
            </h3>
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
            <h3 className="text-sm font-medium text-blue-300 mb-2 px-4">
              情報
            </h3>
            <SidebarItem
              icon="info"
              label="お知らせ"
              href="/info"
              active={pathname === '/info'}
            />
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
