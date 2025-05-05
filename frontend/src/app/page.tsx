"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import SearchSection from '../components/SearchSection';
import UploadSection from '../components/UploadSection';
import DownloadSection from '../components/DownloadSection';
import JoinNetworkSection from '../components/JoinNetworkSection';

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
        <SearchSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

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
