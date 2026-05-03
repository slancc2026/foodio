'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FileText, Image, Sparkles, History, CreditCard } from 'lucide-react';

export default function DashboardPage() {
  const [credits] = useState({ used: 0, total: 2 }); // Mock data

  return (
    <main className="min-h-screen bg-cream">
      <Navigation />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome */}
          <div className="mb-8 mt-8">
            <h1 className="text-2xl font-bold text-green-800">欢迎回来 👋</h1>
            <p className="text-gray-500">今天想生成什么内容？</p>
          </div>

          {/* Credits */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-green-800">剩余额度</h2>
              <Link href="/pricing" className="text-sm text-green-500 hover:text-green-600">
                升级套餐
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="bg-gray-100 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${(credits.used / credits.total) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {credits.used} / {credits.total} 次使用
                </p>
              </div>
              <CreditCard size={32} className="text-green-400" />
            </div>
          </div>

          {/* Quick Actions */}
          <h2 className="text-xl font-semibold text-green-800 mb-4">快捷操作</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            <Link
              href="/generate/text"
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition group"
            >
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-green-100 transition">
                <FileText size={24} className="text-green-500" />
              </div>
              <h3 className="font-semibold text-green-800 mb-1">文案生成</h3>
              <p className="text-sm text-gray-500">生成开业宣传、促销活动、小红书文案</p>
            </Link>
            <Link
              href="/generate/image"
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition group"
            >
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-3 group-hover:bg-orange-100 transition">
                <Image size={24} className="text-orange-500" />
              </div>
              <h3 className="font-semibold text-green-800 mb-1">图片生成</h3>
              <p className="text-sm text-gray-500">AI生成专业级菜品照片</p>
            </Link>
          </div>

          {/* Recent */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <History size={18} className="text-gray-400" />
              <h2 className="font-semibold text-green-800">最近生成</h2>
            </div>
            <div className="text-center py-8 text-gray-400">
              <Sparkles size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">还没有生成记录</p>
              <p className="text-xs mt-1">点击上方快捷操作开始创作</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
