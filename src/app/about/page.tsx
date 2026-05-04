import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Users, Image, MapPin, Heart, Sparkles, ArrowRight, Mail, Quote } from 'lucide-react';

const stats = [
  { icon: Users, value: '12,000+', label: '注册商户' },
  { icon: Image, value: '86,000+', label: 'AI生成图片' },
  { icon: MapPin, value: '230+', label: '覆盖城市' },
  { icon: Heart, value: '98%', label: '客户好评率' },
];

const team = [
  {
    emoji: '👨‍💻',
    name: '张明远',
    role: '创始人 & CEO',
    desc: '十年餐饮行业老兵，曾任连锁品牌数字营销总监。相信AI能让每个小餐馆都拥有专业的营销能力。',
  },
  {
    emoji: '👩‍🔬',
    name: '李思涵',
    role: 'CTO',
    desc: '前阿里云AI算法工程师，专注多模态AI应用。热爱美食，相信技术能改变餐饮行业的营销方式。',
  },
  {
    emoji: '🎨',
    name: '王艺璇',
    role: '设计总监',
    desc: '资深品牌设计师，服务过50+餐饮品牌。坚信好的视觉表达能直接提升顾客的食欲和购买欲。',
  },
];

export default function About() {
  return (
    <main className="min-h-screen bg-cream">
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles size={16} />
            关于 FoodieMark
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-green-900 leading-tight mb-6">
            让每一家餐馆都
            <br />
            <span className="text-orange-500">拥有AI营销能力</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
            我们是AI驱动的餐饮营销平台，致力于用最前沿的AI技术，
            帮助餐饮商家轻松生成专业级菜品照片、营销文案和短视频。
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

      {/* Stats */}
      <section className="py-16 px-4 bg-green-500">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center text-white">
              <stat.icon size={32} className="mx-auto mb-3 text-green-200" />
              <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-green-100">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-green-900 mb-8 text-center">品牌故事</h2>
          <div className="relative">
            <Quote size={48} className="text-green-100 absolute -top-4 -left-4" />
            <div className="pl-8">
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                FoodieMark 诞生于一个很简单的观察：中国有超过600万家餐饮商户，
                其中绝大多数是小微商家。他们做菜很好吃，但完全没有精力做线上营销。
                请摄影师太贵，写文案太费时间，拍视频更是不知从何下手。
              </p>
              <p className="text-gray-600 leading-relaxed mb-6 text-lg">
                2025年，AI技术终于成熟到了可以真正解决这个问题的程度。
                我们团队聚集了AI工程师、餐饮专家和品牌设计师，
                花了半年时间打磨出 FoodieMark —— 一个让餐饮老板动动手指就能完成营销的工具。
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                我们的目标不是取代餐饮人的创意，而是用AI帮他们节省80%的营销时间，
                让他们把精力放回最擅长的事情上——做好每一道菜。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-green-900 mb-4 text-center">核心团队</h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            一群热爱美食和技术的年轻人
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 hover:shadow-lg transition text-center">
                <div className="text-5xl mb-4">{member.emoji}</div>
                <h3 className="text-xl font-bold text-green-800 mb-1">{member.name}</h3>
                <p className="text-orange-500 text-sm font-medium mb-4">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4 bg-green-50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail size={28} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-green-900 mb-4">联系我们</h2>
          <p className="text-gray-600 mb-4">
            有任何问题、建议或合作意向，欢迎随时联系我们
          </p>
          <a
            href="mailto:contact@foodiemark.ai"
            className="text-green-600 hover:text-green-700 text-lg font-medium transition inline-flex items-center gap-2"
          >
            contact@foodiemark.ai
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
