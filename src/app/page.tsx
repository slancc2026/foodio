'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Upload, Sparkles, Download, Check, ArrowRight, ImageIcon, ChevronRight, Loader2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'light', name: '轻食沙拉', emoji: '🥗', color: 'bg-green-50 text-green-700 border-green-200', accent: 'bg-green-500' },
  { id: 'hotpot', name: '火锅烧烤', emoji: '🍲', color: 'bg-red-50 text-red-700 border-red-200', accent: 'bg-red-500' },
  { id: 'chinese', name: '中餐炒菜', emoji: '🥘', color: 'bg-orange-50 text-orange-700 border-orange-200', accent: 'bg-orange-500' },
  { id: 'fry', name: '炸鸡小吃', emoji: '🍗', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', accent: 'bg-yellow-500' },
  { id: 'milk', name: '奶茶饮品', emoji: '🧋', color: 'bg-pink-50 text-pink-700 border-pink-200', accent: 'bg-pink-500' },
  { id: 'bread', name: '烘焙甜点', emoji: '🥐', color: 'bg-amber-50 text-amber-700 border-amber-200', accent: 'bg-amber-500' },
];

const PLATFORMS = [
  { id: 'xiaohongshu', name: '小红书', ratio: '3:4', desc: '种草风' },
  { id: 'meituan', name: '美团', ratio: '1:1', desc: '头图风' },
  { id: 'douyin', name: '抖音', ratio: '9:16', desc: '打卡风' },
  { id: 'moments', name: '朋友圈', ratio: '1:1', desc: '社交风' },
];

const FEATURES = [
  {
    icon: Upload,
    title: '上传菜品照片',
    desc: '手机拍一张菜品的照片，上传即可',
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
  {
    icon: Sparkles,
    title: 'AI自动生成全套',
    desc: '8秒出图，多尺寸适配各平台',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
  {
    icon: Download,
    title: '直接发布',
    desc: '免注册预览效果，满意再下载',
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
];

const TEMPLATE_EXAMPLES = [
  { name: '轻食·美团头图', cat: 'light', color: 'bg-green-50' },
  { name: '轻食·小红书种草', cat: 'light', color: 'bg-green-50' },
  { name: '火锅·抖音封面', cat: 'hotpot', color: 'bg-red-50' },
  { name: '火锅·朋友圈', cat: 'hotpot', color: 'bg-red-50' },
];

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultImages, setResultImages] = useState<{platform: string; size: string; desc: string; url: string | null; base64: string | null; error?: string}[]>([]);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setGenerated(false);
    setResultImages([]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setGenerated(false);
    setResultImages([]);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!image || !category || generating) return;
    setGenerating(true);
    setProgress(0);
    setGenerateError(null);

    // 进度模拟
    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 15, 90));
    }, 2000);

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('category', category);

      const resp = await fetch('/api/generate/foodie', {
        method: 'POST',
        body: formData,
      });

      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.error || '生成失败');
      }

      const data = await resp.json();
      if (data.success && data.images) {
        setResultImages(data.images);
      } else {
        throw new Error(data.error || '生成返回格式异常');
      }
    } catch (err: any) {
      setGenerateError(err.message || '生成失败，请重试');
      setResultImages([]);
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setGenerating(false);
      setGenerated(true);
    }
  }, [image, category, generating]);

  const resetAll = useCallback(() => {
    setImage(null);
    setImagePreview(null);
    setCategory('');
    setGenerated(false);
    setResultImages([]);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const selectedCategory = CATEGORIES.find(c => c.id === category);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-green-50/30 to-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Sparkles size={16} />
            餐饮商家 · 多平台获客引擎
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-green-900 leading-tight mb-4">
            上传菜品照片
            <br />
            <span className="text-orange-500">一站式生成营销物料</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            美团头图 · 小红书种草 · 抖音封面 · 朋友圈分享<br />
            一次上传，全平台适配
          </p>
        </div>
      </section>

      {/* Main Generator Section */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl shadow-green-100/40 border border-green-100/50 overflow-hidden">
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 px-6 pt-6 pb-2 text-sm text-gray-400">
              <span className={`flex items-center gap-1 ${imagePreview ? 'text-green-600 font-medium' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${imagePreview ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>1</span>
                上传照片
              </span>
              <ChevronRight size={14} className={imagePreview ? 'text-green-400' : ''} />
              <span className={`flex items-center gap-1 ${category ? 'text-green-600 font-medium' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${category ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>2</span>
                选择品类
              </span>
              <ChevronRight size={14} className={imagePreview && category ? 'text-green-400' : ''} />
              <span className={`flex items-center gap-1 ${generated ? 'text-green-600 font-medium' : ''}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${generated ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>3</span>
                获取物料
              </span>
            </div>

            <div className="p-6 md:p-8">
              {!imagePreview ? (
                /* Step 1: Upload */
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-green-200 rounded-2xl p-12 md:p-20 text-center cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all group"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <Upload size={28} className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">上传菜品照片</h3>
                  <p className="text-sm text-gray-500 mb-1">手机拍的菜品照片就行</p>
                  <p className="text-xs text-gray-400">支持 JPG / PNG / WebP</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                /* Uploaded preview + Category selection */
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Preview */}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                        <ImageIcon size={14} />
                        你的菜品照片
                      </div>
                      <div className="relative aspect-[4/3] bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="菜品预览"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <button
                        onClick={resetAll}
                        className="text-xs text-gray-400 hover:text-red-500 mt-2 transition"
                      >
                        重新上传
                      </button>
                    </div>

                    {/* Category + Generate */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-3">选择品类</div>
                        <div className="grid grid-cols-2 gap-2">
                          {CATEGORIES.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => setCategory(cat.id)}
                              className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                                category === cat.id
                                  ? `${cat.color} ring-2 ring-offset-1 ${cat.accent.replace('bg-', 'ring-')}/30`
                                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <span className="mr-1.5">{cat.emoji}</span>
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handleGenerate}
                        disabled={!category || generating}
                        className={`w-full py-3.5 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
                          !category || generating
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200'
                        }`}
                      >
                        {generating ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            生成中 {progress}%
                          </>
                        ) : (
                          <>
                            <Sparkles size={18} />
                            一键生成全套物料
                          </>
                        )}
                      </button>

                      {generating && (
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Generated Results */}
              {generated && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-green-800 flex items-center gap-2">
                        <Check size={18} className="text-green-600" />
                        {generateError ? '生成失败' : '生成完成！'}
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {selectedCategory?.emoji} {selectedCategory?.name} · 全平台适配
                      </p>
                    </div>
                    {!generateError && resultImages.length > 0 && (
                      <button
                        onClick={() => alert('注册后可下载无水印高清版')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center gap-1.5"
                      >
                        <Download size={14} />
                        下载全套
                      </button>
                    )}
                  </div>

                  {generateError ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                      <p className="text-red-600 font-medium mb-2">😅 {generateError}</p>
                      <p className="text-sm text-red-400">请稍后重试，或联系客服</p>
                      <button
                        onClick={resetAll}
                        className="mt-4 text-sm text-green-600 hover:text-green-700 underline"
                      >
                        重新上传
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {PLATFORMS.map((platform, i) => {
                        const img = resultImages[i];
                        return (
                          <div key={platform.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <div className="text-xs font-medium text-gray-400 mb-2 text-center">{platform.name} · {platform.ratio}</div>
                            <div className={`${platform.ratio === '9:16' ? 'aspect-[9/16]' : 'aspect-square'} rounded-lg overflow-hidden border border-gray-100 bg-gray-100 relative`}>
                              {img?.base64 ? (
                                <img
                                  src={img.base64}
                                  alt={`${platform.name}生成图`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="text-center p-2">
                                    <div className="text-2xl mb-1">{selectedCategory?.emoji || '🍽️'}</div>
                                    <div className="text-[10px] text-gray-400">{platform.desc}</div>
                                  </div>
                                </div>
                              )}
                              {/* Watermark overlay */}
                              <div className="absolute bottom-1 right-1 bg-black/40 text-white text-[8px] px-1.5 py-0.5 rounded">
                                FoodieMark
                              </div>
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1.5 text-center">
                              {img?.error || '预览带水印 · 注册后可下载'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-400">
                      免费预览带水印 · 下载无水印高清版请
                      <button className="text-green-600 font-medium hover:underline ml-1">注册</button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-green-900 mb-3">
            三步搞定餐饮营销
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-md mx-auto">
            不用摄影师、不用设计师、不用写文案
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature, index) => (
              <div key={index} className="text-center">
                <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon size={26} className={feature.color} />
                </div>
                <h3 className="font-semibold text-green-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-green-900 mb-3">
            品类专属模板
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-md mx-auto">
            每个品类都有适配的色调、字体和排版
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TEMPLATE_EXAMPLES.map((tpl, i) => (
              <div key={i} className={`${tpl.color} rounded-2xl p-6 text-center border border-gray-100 hover:shadow-md transition`}>
                <div className="text-3xl mb-2">
                  {tpl.cat === 'light' ? '🥗' : '🍲'}
                </div>
                <div className="text-sm font-medium text-green-800">{tpl.name}</div>
                <div className="text-xs text-gray-400 mt-1">一键生成</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 px-4 bg-green-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            对比即惊喜
          </h2>
          <p className="text-green-100 mb-8 max-w-lg mx-auto">
            以前：请摄影师¥500+写文案2小时剪视频半天 <br />
            现在：上传照片8秒搞定
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="bg-white/10 rounded-2xl p-6 text-white border border-white/20">
              <div className="text-sm opacity-60 mb-2">以前</div>
              <div className="text-xl font-bold line-through opacity-50">¥500+ 2天</div>
            </div>
            <div className="bg-white/20 rounded-2xl p-6 text-white border border-white/30">
              <div className="text-sm opacity-80 mb-2">现在</div>
              <div className="text-xl font-bold">上传 → ¥9.9</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-900 mb-2">先试后付</h2>
          <p className="text-gray-500 mb-8">预览带水印免费，满意再付费</p>
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="bg-green-50 rounded-2xl p-6 w-56 border border-green-100">
              <div className="text-sm font-medium text-green-600 mb-1">预览体验</div>
              <div className="text-2xl font-bold text-green-800 mb-3">免费</div>
              <ul className="text-xs text-gray-500 space-y-1.5 text-left">
                <li className="flex items-center gap-1"><Check size={12} className="text-green-500 shrink-0" /> 上传预览生成效果</li>
                <li className="flex items-center gap-1"><Check size={12} className="text-green-500 shrink-0" /> 带水印下载</li>
              </ul>
            </div>
            <div className="bg-green-600 rounded-2xl p-6 w-56 text-white shadow-xl scale-105">
              <div className="text-sm font-medium text-green-200 mb-1">单次生成</div>
              <div className="text-2xl font-bold mb-3">¥9.9</div>
              <ul className="text-xs text-green-100 space-y-1.5 text-left">
                <li className="flex items-center gap-1"><Check size={12} className="text-white shrink-0" /> 全套物料高清无水印</li>
                <li className="flex items-center gap-1"><Check size={12} className="text-white shrink-0" /> 多平台适配</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-2xl p-6 w-56 border border-green-100">
              <div className="text-sm font-medium text-green-600 mb-1">月卡</div>
              <div className="text-2xl font-bold text-green-800 mb-3">¥49</div>
              <ul className="text-xs text-gray-500 space-y-1.5 text-left">
                <li className="flex items-center gap-1"><Check size={12} className="text-green-500 shrink-0" /> 30次生成</li>
                <li className="flex items-center gap-1"><Check size={12} className="text-green-500 shrink-0" /> 全部品类模板</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-900 mb-4">
            拍一张照片，出整月物料
          </h2>
          <p className="text-gray-500 mb-8">
            上传菜品照片，生成全平台营销素材
          </p>
          <button
            onClick={() => document.querySelector('[class*="border-dashed"]')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full text-lg font-medium transition inline-flex items-center gap-2 shadow-lg shadow-green-200"
          >
            开始使用
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
