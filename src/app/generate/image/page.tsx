'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Send, Download, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function ImageGeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImageUrl('');
    setError('');

    try {
      const response = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size: '1024*1024' }),
      });

      const data = await response.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        setError(data.error || '生成失败，请稍后再试');
      }
    } catch {
      setError('网络错误，请检查连接后重试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream">
      <Navigation />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto mt-8">
          <h1 className="text-2xl font-bold text-green-800 mb-2">图片生成</h1>
          <p className="text-gray-500 mb-8">输入描述，AI生成专业级菜品照片</p>

          {/* Input */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="描述你想生成的菜品图片，例如：一盘精致的日式寿司拼盘，三文鱼和牛油果卷，摆放在木质托盘上，自然光线，浅景深"
              className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none resize-none"
            />
            <div className="flex justify-end mt-3">
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

          {/* Loading */}
          {loading && (
            <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
              <div className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">AI正在为你创作美食大片...</p>
              <p className="text-xs text-gray-400 mt-1">通常需要 10-30 秒</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 rounded-2xl p-6 shadow-sm text-center">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {/* Result */}
          {imageUrl && !loading && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-green-800 flex items-center gap-2">
                  <Sparkles size={18} className="text-orange-500" />
                  生成结果
                </h2>
                <a
                  href={imageUrl}
                  download
                  className="text-sm text-gray-400 hover:text-green-500 transition flex items-center gap-1"
                >
                  <Download size={16} />
                  下载
                </a>
              </div>
              <div className="relative rounded-xl overflow-hidden bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="AI生成的菜品照片"
                  className="w-full h-auto object-contain"
                />
              </div>
              <p className="text-xs text-gray-400 mt-3">
                提示词：{prompt}
              </p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-green-50 rounded-2xl p-6 mt-6">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon size={18} className="text-green-500" />
              <h3 className="font-medium text-green-800">生成技巧</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• 描述菜品名称、食材、摆盘方式</li>
              <li>• 指定风格：写实、日系、ins风、暖色调</li>
              <li>• 指定视角：俯视、平拍、45度角</li>
              <li>• 示例：&ldquo;一盘精致的牛排摆拍，深色石板，迷迭香点缀，暖色灯光，俯拍&rdquo;</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
