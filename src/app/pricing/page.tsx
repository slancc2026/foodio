'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Check, Loader2 } from 'lucide-react';

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
    planKey: 'free' as const,
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
    planKey: 'basic' as const,
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
    planKey: 'pro' as const,
  },
];

const topUpOptions = [
  { credits: 10, price: 49, label: '10点' },
  { credits: 30, price: 129, label: '30点' },
  { credits: 50, price: 199, label: '50点' },
];

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrOutTradeNo, setQrOutTradeNo] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  async function handlePurchase(planKey: 'basic' | 'pro') {
    setLoading(planKey);

    try {
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();

      if (!sessionData?.user) {
        router.push('/auth/login?callbackUrl=/pricing');
        return;
      }

      const createRes = await fetch('/api/payments/alipay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await createRes.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      if (data.mock) {
        const mockRes = await fetch('/api/payments/alipay/mock-callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ outTradeNo: data.outTradeNo }),
        });
        const mockData = await mockRes.json();
        router.push(`/payments/success?credits=${mockData.credits}&plan=${data.plan?.name || ''}`);
        return;
      }

      if (data.qrCode) {
        setQrCode(data.qrCode);
        setQrOutTradeNo(data.outTradeNo);
        setModalOpen(true);
        pollPaymentStatus(data.outTradeNo);
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('支付请求失败，请重试');
    } finally {
      setLoading(null);
    }
  }

  async function handleTopUp(price: number, credits: number) {
    const key = `topup-${credits}`;
    setLoading(key);

    try {
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();

      if (!sessionData?.user) {
        router.push('/auth/login?callbackUrl=/pricing');
        return;
      }

      const createRes = await fetch('/api/payments/alipay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price, credits }),
      });

      const data = await createRes.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      if (data.mock) {
        const mockRes = await fetch('/api/payments/alipay/mock-callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ outTradeNo: data.outTradeNo }),
        });
        const mockData = await mockRes.json();
        router.push(`/payments/success?credits=${mockData.credits}`);
        return;
      }

      if (data.qrCode) {
        setQrCode(data.qrCode);
        setQrOutTradeNo(data.outTradeNo);
        setModalOpen(true);
        pollPaymentStatus(data.outTradeNo);
      }
    } catch (err) {
      console.error('Top-up error:', err);
      alert('充值请求失败，请重试');
    } finally {
      setLoading(null);
    }
  }

  function pollPaymentStatus(outTradeNo: string) {
    let attempts = 0;
    const maxAttempts = 60;
    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/payments/alipay/query?outTradeNo=${outTradeNo}`);
        const data = await res.json();

        if (data.status === 'paid') {
          clearInterval(interval);
          setModalOpen(false);
          router.push(`/payments/success?credits=${data.credits}&outTradeNo=${outTradeNo}`);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
        }
      } catch {
        // Keep polling on network errors
      }
    }, 5000);
  }

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
                {plan.planKey === 'free' ? (
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
                ) : (
                  <button
                    onClick={() => handlePurchase(plan.planKey)}
                    disabled={loading === plan.planKey}
                    className={`block w-full text-center py-3 rounded-full font-medium transition disabled:opacity-50 ${
                      plan.highlight
                        ? 'bg-white text-green-600 hover:bg-green-50'
                        : 'border border-green-300 text-green-700 hover:bg-green-50'
                    }`}
                  >
                    {loading === plan.planKey ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" />
                        处理中...
                      </span>
                    ) : (
                      plan.cta
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 充值 section */}
          <div className="mt-20 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-green-800 mb-2">点数充值</h2>
              <p className="text-gray-500 mb-6">一次性购买额外AI生成点数，灵活补充</p>
              <div className="grid grid-cols-3 gap-4">
                {topUpOptions.map((item) => (
                  <div key={item.credits} className="border border-green-200 rounded-xl p-4">
                    <p className="text-lg font-bold text-green-700">{item.label}</p>
                    <p className="text-sm text-gray-500 mb-3">¥{item.price}</p>
                    <button
                      onClick={() => handleTopUp(item.price, item.credits)}
                      disabled={loading === `topup-${item.credits}`}
                      className="w-full py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition disabled:opacity-50"
                    >
                      {loading === `topup-${item.credits}` ? (
                        <Loader2 size={14} className="animate-spin inline" />
                      ) : (
                        '购买'
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {modalOpen && qrCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-bold text-green-800 mb-2">扫码支付</h3>
            <p className="text-sm text-gray-500 mb-4">请使用支付宝扫码完成支付</p>
            <div className="bg-gray-100 rounded-xl p-4 mb-4 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrCode}
                alt="Alipay QR Code"
                className="w-48 h-48 object-contain"
              />
            </div>
            <button
              onClick={() => {
                setModalOpen(false);
                setQrCode(null);
              }}
              className="w-full py-2 border border-green-300 text-green-700 rounded-full font-medium hover:bg-green-50 transition"
            >
              取消支付
            </button>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
