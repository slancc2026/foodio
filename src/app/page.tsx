import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FileText, Image, Video, Languages, Sparkles, Check } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'AI文案',
    desc: '输入菜品名，秒出开业宣传、促销活动、小红书种草文案',
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
  {
    icon: Image,
    title: 'AI美食摄影',
    desc: '用AI生成专业级菜品照片，省去摄影师费用',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
  {
    icon: Video,
    title: 'AI短视频',
    desc: '图片+文字一键转视频，适配抖音和小红书',
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
  {
    icon: Languages,
    title: '多语言支持',
    desc: '中英双语界面，AI内容支持多国语言生成',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
];

const plans = [
  {
    name: '免费体验',
    price: '0',
    period: '',
    description: '适合初次体验',
    features: ['2张AI生成图片', '基础文案模板', '社区示例浏览'],
    cta: '免费试用',
    href: '/auth/register',
    highlight: false,
  },
  {
    name: '基础版',
    price: '99',
    period: '/月',
    description: '适合起步阶段',
    features: ['20张AI图片', '10个AI视频', '不限文案生成', '小红书优化模板', '标准客户支持'],
    cta: '立即订阅',
    href: '/auth/register',
    highlight: true,
  },
  {
    name: '专业版',
    price: '299',
    period: '/月',
    description: '适合持续运营',
    features: ['100张AI图片', '40个AI视频', '不限文案生成', '全部模板和风格', '优先客户支持', '品牌定制色彩'],
    cta: '立即订阅',
    href: '/auth/register',
    highlight: false,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles size={16} />
            AI驱动的餐饮营销工具
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-green-900 leading-tight mb-6">
            让AI成为你的
            <br />
            <span className="text-orange-500">餐饮宣传总监</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            一键生成菜品照片、营销文案、短视频，轻松搞定小红书和抖音
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-medium transition shadow-lg shadow-green-200"
            >
              免费开始使用
            </Link>
            <Link
              href="/pricing"
              className="border border-green-300 text-green-700 hover:bg-green-50 px-8 py-3 rounded-full text-lg font-medium transition"
            >
              查看定价
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-green-900 mb-4">为什么选择 FoodieMark</h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            专为餐饮商家打造的AI营销工具，省时省力更专业
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-cream rounded-2xl p-6 hover:shadow-lg transition">
                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon size={24} className={feature.color} />
                </div>
                <h3 className="font-semibold text-green-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-green-900 mb-4">简单透明的定价</h2>
          <p className="text-gray-500 text-center mb-12">按需选择，随时升级</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl p-8 ${
                  plan.highlight
                    ? 'bg-green-500 text-white ring-4 ring-green-200 scale-105'
                    : 'bg-white'
                }`}
              >
                <h3 className={`text-xl font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-green-800'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.highlight ? 'text-green-100' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">¥{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? 'text-green-100' : 'text-gray-400'}`}>
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check size={16} className={plan.highlight ? 'text-white' : 'text-green-500'} />
                      <span className={plan.highlight ? 'text-green-50' : 'text-gray-600'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center py-3 rounded-full font-medium transition ${
                    plan.highlight
                      ? 'bg-white text-green-600 hover:bg-green-50'
                      : 'border border-green-300 text-green-700 hover:bg-green-50'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-green-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-900 mb-4">准备好了吗？</h2>
          <p className="text-gray-600 mb-8">今天就开始用AI提升你的餐饮营销效率</p>
          <Link
            href="/auth/register"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-medium transition inline-block"
          >
            免费开始使用
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
