import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { FileText, Image } from 'lucide-react';

const examples = [
  {
    type: 'text',
    category: '开业宣传',
    title: '川菜馆开业文案',
    prompt: '为我位于大学城的川菜馆写一条开业宣传文案，主打学生群体，价格实惠',
    result: '🔥【大学城川菜新地标】盛大开业！\n\n🌶️ 正宗川味，人均只要¥25+\n🎉 开业期间全场8折，送酸梅汤！\n📍 大学城美食街A区\n\n叫上室友，今晚就来搓一顿！',
  },
  {
    type: 'text',
    category: '小红书种草',
    title: '轻食店种草文案',
    prompt: '写一条适合小红书的轻食店种草文案，突出健康减脂',
    result: '🥗 吃了两周轻食的我，居然瘦了5斤！\n\n终于在公司附近找到这家神仙轻食店\n每一份都颜值超高，拍照发朋友圈被问爆\n推荐：鸡胸肉沙拉+牛油果奶昔 🥑\n\n#轻食打卡 #减脂餐 #健康生活',
  },
  {
    type: 'image',
    category: '菜品摄影',
    title: '红烧牛肉面',
    prompt: '一碗热气腾腾的红烧牛肉面，深色汤底，大块牛肉，撒上葱花和香菜，暖色调灯光',
    result: '/placeholder-food.jpg',
  },
  {
    type: 'text',
    category: '促销活动',
    title: '火锅店促销',
    prompt: '为火锅店写一条冬季促销文案，推出双人套餐优惠',
    result: '❄️ 天冷了，该吃火锅了！\n\n原价¥298的精选双人套餐\n现在只要¥168！含毛肚、肥牛、虾滑\n限时优惠，手慢无！\n\n📍 建设路老字号火锅',
  },
];

export default function ExamplesPage() {
  return (
    <main className="min-h-screen bg-cream">
      <Navigation />
      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 mt-8">
            <h1 className="text-4xl font-bold text-green-900 mb-4">示例库</h1>
            <p className="text-gray-500">看看其他商家如何使用 Foodio 生成内容</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {examples.map((example, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-2 mb-3">
                  {example.type === 'text' ? (
                    <FileText size={18} className="text-green-500" />
                  ) : (
                    <Image size={18} className="text-orange-500" />
                  )}
                  <span className="text-xs font-medium text-gray-400 uppercase">
                    {example.category}
                  </span>
                </div>
                <h3 className="font-semibold text-green-800 mb-2">{example.title}</h3>
                <div className="bg-cream rounded-xl p-4 mb-3">
                  <p className="text-xs text-gray-400 mb-1">输入</p>
                  <p className="text-sm text-gray-600">{example.prompt}</p>
                </div>
                {example.type === 'text' ? (
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-xs text-green-500 mb-1">输出</p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{example.result}</p>
                  </div>
                ) : (
                  <div className="bg-orange-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-orange-500">AI生成的菜品图片（预览）</p>
                    <div className="mt-2 w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      图片预览区域
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
