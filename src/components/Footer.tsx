import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🦊</span>
              <span className="font-bold text-lg">FoodieMark AI</span>
            </div>
            <p className="text-green-200 text-sm">
              让AI成为你的餐饮宣传总监
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-4">产品</h3>
            <div className="flex flex-col gap-2 text-sm text-green-200">
              <Link href="/pricing" className="hover:text-white transition">定价</Link>
              <Link href="/examples" className="hover:text-white transition">示例库</Link>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-4">支持</h3>
            <div className="flex flex-col gap-2 text-sm text-green-200">
              <span>联系邮箱：support@foodiemark.ai</span>
            </div>
          </div>
        </div>
        <div className="border-t border-green-700 mt-8 pt-8 text-center text-sm text-green-300">
          © 2025 FoodieMark AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
