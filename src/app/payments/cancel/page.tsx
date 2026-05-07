import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        <XCircle size={64} className="text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-green-800 mb-2">支付未完成</h1>
        <p className="text-gray-500 mb-6">
          支付已取消或未成功，请重试。如有疑问请联系客服。
        </p>
        <div className="space-y-3">
          <Link
            href="/pricing"
            className="block w-full py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-600 transition"
          >
            重新选择套餐
          </Link>
          <Link
            href="/dashboard"
            className="block w-full py-3 border border-green-300 text-green-700 rounded-full font-medium hover:bg-green-50 transition"
          >
            返回控制台
          </Link>
        </div>
      </div>
    </main>
  );
}
