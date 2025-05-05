"use client";

import { motion } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";

const EuropaFinalCorrect = () => {
  return (
    <>
      <Header />
      <div className="max-w-screen-lg mx-auto px-8 py-16 bg-[#010220]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          {/* ヒーローセクション */}
          <section className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-white">
              <span className="text-[#03C6F9]">EUROPA</span> プラットフォーム
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              カルネージハートEXAのチームデータ共有と分析のための次世代プラットフォーム
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <a
                href="#features"
                className="px-6 py-3 bg-[#03C6F9] text-black font-medium rounded hover:bg-[#03C6F9]/90 transition"
              >
                機能を見る
              </a>
              <a
                href="/register"
                className="px-6 py-3 border border-[#03C6F9] text-[#03C6F9] font-medium rounded hover:bg-[#03C6F9]/10 transition"
              >
                アカウント作成
              </a>
            </div>
          </section>

          {/* 特徴セクション */}
          <section id="features" className="pt-10">
            <h2 className="text-3xl font-bold text-white mb-10 text-center">
              <span className="text-[#03C6F9]">主な</span>機能
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#0f0f1a] p-6 rounded-lg border border-[#03C6F9]/20 hover:border-[#03C6F9]/50 transition"
                >
                  <div className="text-[#03C6F9] mb-4 text-2xl">{feature.icon}</div>
                  <h3 className="text-xl font-medium text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* 統計セクション */}
          <section className="py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6"
                >
                  <div className="text-4xl font-bold text-[#03C6F9] mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </section>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

// ダミーデータ
const features = [
  {
    icon: "🔍",
    title: "チームデータ検索",
    description: "登録されたチームデータを高度な検索機能で素早く見つけることができます。"
  },
  {
    icon: "📊",
    title: "マッチデータ分析",
    description: "対戦データを分析し、戦略的なインサイトを得ることができます。"
  },
  {
    icon: "⚡",
    title: "シンプルアップロード",
    description: "チームデータを簡単にアップロードして共有できます。"
  },
  {
    icon: "🔄",
    title: "チームデータ取得",
    description: "他のプレイヤーのチームデータを取得して参考にできます。"
  },
  {
    icon: "📈",
    title: "マッチデータ取得",
    description: "過去の対戦データを取得して分析できます。"
  },
  {
    icon: "ℹ️",
    title: "情報共有",
    description: "コミュニティと最新の戦略や情報を共有できます。"
  }
];

const stats = [
  {
    value: "10,000+",
    label: "登録チームデータ"
  },
  {
    value: "5,000+",
    label: "アクティブユーザー"
  },
  {
    value: "50,000+",
    label: "分析済み対戦"
  }
];

export default EuropaFinalCorrect;
