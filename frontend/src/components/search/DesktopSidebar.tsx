import React from 'react';
import SidebarItem from './SidebarItem';

const DesktopSidebar: React.FC = () => {
  return (
    <aside className="hidden lg:block lg:w-64 h-fit">
      <div className="bg-gray-950 rounded p-5 shadow-lg border border-blue-900/30 hover:border-blue-700/50 transition-all duration-300">
        <h2 className="text-lg font-semibold text-blue-400 mb-5">メニュー</h2>
        <nav className="space-y-1">
          <SidebarItem icon="search" label="チームデータ検索" href="/search/team" active />
          <SidebarItem icon="match" label="マッチデータ検索" href="/search/match" />
          <SidebarItem icon="upload" label="シンプルアップロード" href="/upload" />
          <SidebarItem icon="download" label="チームデータ取得" href="/download/team" />
          <SidebarItem icon="download" label="マッチデータ取得" href="/download/match" />
          <SidebarItem icon="info" label="Information" href="/information" />
        </nav>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
