'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Globe } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/80 backdrop-blur-md border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🦊</span>
            <span className="font-bold text-xl text-green-800">FoodieMark</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/pricing" className="text-gray-600 hover:text-green-600 transition">
              定价
            </Link>
            <Link href="/examples" className="text-gray-600 hover:text-green-600 transition">
              示例库
            </Link>
            <Link href="/auth/login" className="text-gray-600 hover:text-green-600 transition">
              登录
            </Link>
            <Link
              href="/auth/register"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition"
            >
              免费开始
            </Link>
            {/* Language Switcher */}
            <button className="flex items-center gap-1 text-gray-400 hover:text-green-600 transition">
              <Globe size={18} />
              <span className="text-sm">中</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-green-100 pt-4">
            <div className="flex flex-col gap-4">
              <Link href="/pricing" className="text-gray-600 hover:text-green-600" onClick={() => setIsOpen(false)}>
                定价
              </Link>
              <Link href="/examples" className="text-gray-600 hover:text-green-600" onClick={() => setIsOpen(false)}>
                示例库
              </Link>
              <Link href="/auth/login" className="text-gray-600 hover:text-green-600" onClick={() => setIsOpen(false)}>
                登录
              </Link>
              <Link
                href="/auth/register"
                className="bg-green-500 text-white px-4 py-2 rounded-full text-center text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                免费开始
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
