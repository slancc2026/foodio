import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Check } from 'lucide-react';

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

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navigation />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 mt-8">
            <h1 className="text-4xl font-bold text-green-900 mb-4">简单透明的定价</h1>
            <p className="text-gray-500">按需选择，随时升级或降级</p>
          </div>

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
      </div>
      <Footer />
    </main>
  );
}
