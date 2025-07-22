'use client';

import React, { useState } from 'react';
import DownloadSection from '../components/DownloadSection';
import FeaturesSection from '../components/FeaturesSection';
import Footer from '../components/Footer';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import JoinNetworkSection from '../components/JoinNetworkSection';
import SearchSection from '../components/SearchSection';
import UploadSection from '../components/UploadSection';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full">
        {/* Header */}
        <Header />

        {/* Hero Section */}
        <HeroSection />

        {/* 主な機能セクション */}
        <FeaturesSection />

        {/* 検索セクション */}
        <SearchSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* アップロードセクション */}
        <UploadSection />

        {/* ダウンロードセクション */}
        <DownloadSection />

        {/* ネットワーク参加セクション */}
        <JoinNetworkSection />

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
