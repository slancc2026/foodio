import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FileText, Image, Video, Sparkles, Users, Star, TrendingUp, ArrowRight, Check, ArrowLeftRight } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'AI文案',
    desc: '输入菜名，秒出小红书爆款文案',
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
  {
    icon: Image,
    title: 'AI美食摄影',
    desc: '不用摄影师，AI拍出高级菜品图',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
  {
    icon: Video,
    title: 'AI短视频',
    desc: '图文一键转视频，适配抖音小红书',
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
  {
    icon: Sparkles,
    title: '全自动营销',
    desc: '从想法到发布，3步全部搞定',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
];

const testimonials = [
  {
    emoji: '👩‍🍳',
    name: '成都·川味小馆 老板娘',
    quote: '以前请摄影师拍菜要两千，现在手机上说句话就出图了，太香了。',
    result: '月订单 +40%',
  },
  {
    emoji: '👨‍🍳',
    name: '深圳·轻食沙拉 老板',
    quote: '小红书一周没更新，用AI十分钟做了三条，直接来了两桌新客。',
    result: '粉丝涨了 2000+',
  },
  {
    emoji: '🧑‍🍳',
    name: '杭州·面馆小胖',
    quote: '文化程度不高，不会写文案。现在对着手机说菜名就能发朋友圈了。',
    result: '日营业额 +800',
  },
];

const stats = [
  { icon: Users, value: '12,000+', label: '注册商户' },
  { icon: Image, value: '86,000+', label: 'AI生成图片' },
  { icon: TrendingUp, value: '230+', label: '覆盖城市' },
];

const plans = [
  {
    name: '免费体验',
    price: '0',
    period: '',
    description: '适合初次体验',
    features: ['2张AI图片', '基础文案模板', '示例浏览'],
    cta: '免费试用',
    href: '/auth/register',
    highlight: false,
  },
  {
    name: '基础版',
    price: '99',
    period: '/月',
    description: '适合起步阶段',
    features: ['20张AI图片', '10个AI视频', '不限文案', '小红书模板', '标准支持'],
    cta: '立即订阅',
    href: '/auth/register',
    highlight: true,
  },
  {
    name: '专业版',
    price: '299',
    period: '/月',
    description: '适合持续运营',
    features: ['100张AI图片', '40个AI视频', '不限文案', '全部风格', '优先支持', '品牌定制色'],
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
      <section className="pt-32 pb-28 px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Sparkles size={16} />
            AI驱动的餐饮营销工具
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-green-900 leading-tight mb-4">
            把精力还给灶台，
            <br />
            <span className="text-orange-500">把流量交给AI</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            不用摄影师、不用写手、不用剪辑师。<br />
            对着手机说句话，AI帮你搞定菜品拍照、文案和短视频。
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link
              href="/auth/register"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-medium transition shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              免费开始使用
            </Link>
            <Link
              href="/examples"
              className="border border-green-300 text-green-700 hover:bg-green-50 px-8 py-3 rounded-full text-lg font-medium transition hover:-translate-y-0.5 active:translate-y-0"
            >
              看看效果 →
            </Link>
          </div>

          {/* Demo对比区 */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg shadow-green-100/50 p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* 以前 */}
                <div className="text-center md:text-left">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">以前</div>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-2 h-2 bg-gray-300 rounded-full" />
                      <span className="text-sm">请摄影师：¥2000+</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-2 h-2 bg-gray-300 rounded-full" />
                      <span className="text-sm">写文案：2小时</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-2 h-2 bg-gray-300 rounded-full" />
                      <span className="text-sm">剪视频：半天</span>
                    </div>
                  </div>
                </div>

                {/* 箭头（桌面端显示） */}
                <div className="hidden md:flex justify-center">
                  <div className="bg-green-100 rounded-full p-3">
                    <ArrowRight size={24} className="text-green-600" />
                  </div>
                </div>

                {/* 现在 */}
                <div className="text-center md:text-left">
                  <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-3">现在 · Foodio</div>
                  <div className="bg-green-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-green-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm font-medium">AI出图：¥0</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm font-medium">AI文案：3分钟</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm font-medium">AI视频：5分钟</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-green-600">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center text-white">
              <stat.icon size={28} className="mx-auto mb-2 text-green-200" />
              <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-green-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-900 mb-3">
            不止是AI工具
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-md mx-auto text-lg">
            是你的线上营销部
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-cream rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-default"
              >
                <div className={`w-11 h-11 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon size={22} className={feature.color} />
                </div>
                <h3 className="font-semibold text-green-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-900 mb-3">
            餐饮老板都在用
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-md mx-auto text-lg">
            听听他们怎么说
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-green-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{item.emoji}</span>
                  <div>
                    <div className="font-medium text-green-800 text-sm">{item.name}</div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className="fill-orange-400 text-orange-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="text-orange-500 font-semibold text-sm flex items-center gap-1">
                  <TrendingUp size={14} />
                  {item.result}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-900 mb-3">
            简单透明的定价
          </h2>
          <p className="text-gray-500 text-center mb-14">按需选择，随时升级</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl p-7 ${
                  plan.highlight
                    ? 'bg-green-500 text-white ring-4 ring-green-200 scale-105 shadow-xl'
                    : 'bg-cream'
                }`}
              >
                <h3 className={`text-xl font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-green-800'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.highlight ? 'text-green-100' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
                <div className="mb-5">
                  <span className="text-4xl font-bold">¥{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? 'text-green-100' : 'text-gray-400'}`}>
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check size={15} className={plan.highlight ? 'text-white shrink-0 mt-0.5' : 'text-green-500 shrink-0 mt-0.5'} />
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
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">
            今天就开始
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            让AI帮你搞定餐饮营销，把时间省下来做好每一道菜
          </p>
          <Link
            href="/auth/register"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-medium transition inline-flex items-center gap-2 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-200"
          >
            免费开始使用
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
