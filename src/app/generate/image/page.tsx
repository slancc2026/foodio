'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Send, Download, Sparkles, Image as ImageIcon, Upload, X, Coins, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const styleTemplates = [
  {
    id: 'realistic',
    name: '写实摄影',
    desc: '专业菜品摄影，真实诱人',
    icon: '📷',
    prompt: '写实风格，专业美食摄影，高清细节，自然光线',
  },
  {
    id: 'japanese',
    name: '日系清新',
    desc: '柔和光线，清新淡雅',
    icon: '🌸',
    prompt: '日系风格，柔和光线，清新淡雅，浅色背景，自然光',
  },
  {
    id: 'dark',
    name: '高级暗调',
    desc: '深色背景，氛围感强',
    icon: '🌙',
    prompt: '暗调风格，深色石板背景，暖色灯光，高级感，氛围光',
  },
  {
    id: 'ins',
    name: 'Ins风',
    desc: '简约现代，适合社交媒体',
    icon: '✨',
    prompt: 'ins风格，简约现代，明亮，干净背景，装饰精致',
  },
  {
    id: 'chinese',
    name: '中式传统',
    desc: '中式摆盘，传统韵味',
    icon: '🏮',
    prompt: '中式风格，传统摆盘，瓷碗，古朴，暖色调',
  },
  {
    id: 'topview',
    name: '俯拍摆盘',
    desc: '俯视角度，整体展示',
    icon: '🔝',
    prompt: '俯拍角度，从上往下拍摄，整齐摆盘，构图精致',
  },
];

export default function ImageGeneratePage() {
  const { data: session } = useSession();
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [credits, setCredits] = useState(0);
  const [creditsLoading, setCreditsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetch('/api/user/credits')
        .then((res) => res.json())
        .then((data) => {
          setCredits(data.credits ?? 0);
          setCreditsLoading(false);
        })
        .catch(() => setCreditsLoading(false));
    } else {
      setCreditsLoading(false);
    }
  }, [session]);

  const hasCredits = credits >= 1;

  const handleGenerate = async () => {
    if (!prompt.trim() || !hasCredits) return;
    setLoading(true);
    setImageUrl('');
    setError('');

    const selectedTemplate = styleTemplates.find(s => s.id === selectedStyle);
    const fullPrompt = `${prompt}，${selectedTemplate?.prompt || ''}${referenceImage ? '，参考图片风格' : ''}`;

    try {
      const response = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt, size: '1024*1024' }),
      });

      const data = await response.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        // Refresh credits after generation
        setCredits(data.credits ?? credits - 1);
      } else {
        setError(data.error || '生成失败，请稍后再试');
      }
    } catch {
      setError('网络错误，请检查连接后重试。');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReferenceImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReference = () => {
    setReferenceImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <main className="min-h-screen bg-cream">
      <Navigation />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto mt-8">
          <h1 className="text-2xl font-bold text-green-800 mb-2">图片生成</h1>
          <p className="text-gray-500 mb-8">选择风格，输入菜品名称，AI生成专业级菜品照片</p>

          {/* Credits Banner */}
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins size={18} className="text-yellow-500" />
              {creditsLoading ? (
                <span className="text-sm text-gray-400">加载中...</span>
              ) : (
                <span className="text-sm text-gray-600">
                  剩余 <strong className="text-green-700">{credits}</strong> 点
                  <span className="text-gray-400 mx-2">·</span>
                  每张图片消耗 <strong>1</strong> 点
                </span>
              )}
            </div>
            <Link
              href="/pricing"
              className="text-sm text-green-500 hover:text-green-600 font-medium"
            >
              充值
            </Link>
          </div>

          {/* Style Templates */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-600 mb-3">选择照片风格</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {styleTemplates.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-3 rounded-xl text-center transition border ${
                    selectedStyle === style.id
                      ? 'bg-green-50 border-green-300 ring-2 ring-green-200'
                      : 'bg-white border-gray-200 hover:border-green-200'
                  }`}
                >
                  <span className="text-2xl block mb-1">{style.icon}</span>
                  <span className={`text-xs font-medium block ${
                    selectedStyle === style.id ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {style.name}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5 block">{style.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <label className="text-sm font-medium text-gray-600 mb-2 block">
              描述你的菜品
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="输入菜品名称和简单描述，例如：香煎三文鱼配柠檬黄油酱、番茄肉酱意大利面..."
              className="w-full h-24 p-4 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none resize-none"
            />

            {/* Reference Image Upload */}
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-600 mb-2 block">
                参考图片（可选）
              </label>
              {referenceImage ? (
                <div className="relative inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={referenceImage}
                    alt="参考图"
                    className="w-24 h-24 object-cover rounded-xl border border-gray-200"
                  />
                  <button
                    onClick={removeReference}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    <X size={14} />
                  </button>
                  <p className="text-xs text-gray-400 mt-1">已上传参考图</p>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-green-300 hover:text-green-600 transition"
                >
                  <Upload size={16} />
                  上传菜品参考图
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim() || !hasCredits}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-8 py-2.5 rounded-full text-sm font-medium transition flex items-center gap-2"
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

          {/* No Credits Warning */}
          {!creditsLoading && !hasCredits && !loading && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
              <AlertTriangle size={20} className="text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-amber-800">点数不足</p>
                <p className="text-sm text-amber-700 mt-1">
                  你的点数已用完，升级套餐后即可继续生成图片。
                </p>
                <Link
                  href="/pricing"
                  className="inline-block mt-3 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-full text-sm font-medium transition"
                >
                  查看套餐
                </Link>
              </div>
            </div>
          )}

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
              <h3 className="font-medium text-green-800">小技巧</h3>
            </div>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• 先选一个照片风格，再输入菜品名</li>
              <li>• 描述越详细，效果越好（菜品、食材、摆盘）</li>
              <li>• 可以上传参考图让AI参考你的菜品外观</li>
              <li>• 不同风格适合不同平台：日系清新适合小红书，暗调适合高端餐厅宣传</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
