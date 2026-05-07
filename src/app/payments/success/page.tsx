'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const credits = searchParams.get('credits') || '0';
  const plan = searchParams.get('plan') || '';

  return (
    <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
      <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-green-800 mb-2">支付成功！</h1>
      <p className="text-gray-500 mb-6">
        {plan ? `已激活${plan}套餐` : '点数已到账'}
      </p>
      <div className="bg-green-50 rounded-xl p-4 mb-6">
        <p className="text-sm text-green-700">获得点数</p>
        <p className="text-3xl font-bold text-green-600">{credits}</p>
      </div>
      <Link
        href="/dashboard"
        className="block w-full py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition"
      >
        前往控制台
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-gray-500">加载中...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
