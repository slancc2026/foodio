'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Send, Copy, Check, Sparkles } from 'lucide-react';

export default function TextGeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [category, setCategory] = useState('opening');

  const categoryLabels: Record<string, string> = {
    opening: '开业宣传',
    promotion: '促销活动',
    xiaohongshu: '小红书种草',
    seasonal: '节日营销',
  };

  const templates: Record<string, string> = {
    opening: '为我位于[位置]的[店名]写一条开业宣传文案，主打[卖点]',
    promotion: '为[店名]写一条[活动类型]促销文案，优惠内容：[详情]',
    xiaohongshu: '以顾客视角写一条适合小红书的种草文案，店铺：[店名]，推荐菜品：[菜品]',
    seasonal: '为[店名]写一条[节日名称]营销文案',
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/generate/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, locale: 'zh' }),
      });

      const data = await response.json();
      if (data.result) {
        setResult(data.result);
      } else {
        setResult('生成失败，请稍后再试。\n' + (data.error || ''));
      }
    } catch {
      setResult('网络错误，请检查连接后重试。');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUseTemplate = () => {
    setPrompt(templates[category]);
  };

  return (
    <main className="min-h-screen bg-cream">
      <Navigation />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto mt-8">
          <h1 className="text-2xl font-bold text-green-800 mb-2">文案生成</h1>
          <p className="text-gray-500 mb-8">输入需求，AI自动为你生成营销文案</p>

          {/* Category Selector */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                  category === key
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="输入你的需求，例如：为我的川菜馆写一条开业宣传文案..."
              className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <button
                onClick={handleUseTemplate}
                className="text-sm text-green-500 hover:text-green-600"
              >
                使用模板
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-2.5 rounded-full text-sm font-medium transition flex items-center gap-2"
              >
                {loading ? (
                  <>生成中...</>
                ) : (
                  <>
                    <Send size={16} />
                    开始生成
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result */}
          {(result || loading) && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-green-800 flex items-center gap-2">
                  <Sparkles size={18} className="text-orange-500" />
                  生成结果
                </h2>
                {result && (
                  <button
                    onClick={handleCopy}
                    className="text-sm text-gray-400 hover:text-green-500 transition flex items-center gap-1"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? '已复制' : '复制'}
                  </button>
                )}
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-green-200 border-t-green-500 rounded-full animate-spin" />
                </div>
              ) : (
                <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed font-sans">
                  {result}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
