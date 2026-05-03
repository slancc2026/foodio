# FoodieMark AI - 餐饮商家自媒体宣传工具

## 项目概述
专为餐饮商家打造的自媒体宣传工具。商家输入需求，AI自动生成文案、图片、视频等内容。

## 技术栈
- **前端/后端框架**: Next.js 14 (App Router) + TypeScript
- **UI**: Tailwind CSS + shadcn/ui + lucide-react 图标
- **数据库**: PostgreSQL (接 Vercel Postgres 或 Neon)
- **ORM**: Prisma
- **认证**: NextAuth.js (邮箱登录 + Google OAuth)
- **支付**: Stripe + 支付宝
- **国际化**: next-intl
- **AI API**: DashScope (阿里通义千问 + 通义万相)

## 功能模块

### 1. 用户系统
- 注册/登录（邮箱+验证码，Google OAuth）
- 个人中心：查看用量、套餐、历史生成记录
- 套餐管理：查看当前套餐、升级/降级

### 2. 套餐定价
- **免费**: 2张图片（引流）
- **基础 ¥99/月**: 20张图片 + 10个视频
- **专业 ¥299/月**: 100张图片 + 40个视频

### 3. 内容生成核心功能
- **文案生成**: 开业宣传、促销活动、小红书种草文案
- **图片生成**: 菜品图 DALL·E 3 风格（用通义万相）
- **视频生成**: 预留模块（Phase 2实现）
- **语音输入**: Web Speech API 语音转文字（Phase 2）

### 4. 示例库
- 内置模板示例，引导用户快速上手
- 分门别类：开业、促销、节日、小红书

### 5. 国际化
- 中英双语，通过 next-intl 实现
- UI 文本全部走 i18n
- AI生成内容根据语言设置输出对应语言

## 页面结构

### 公开页面
- `/` - Landing page（简约小清新，绿色+暖白主色调，美食风格）
- `/pricing` - 定价页
- `/auth/login` - 登录
- `/auth/register` - 注册

### 受保护页面（需登录）
- `/dashboard` - 控制台主页（用量概览、快捷生成）
- `/generate/text` - 文案生成
- `/generate/image` - 图片生成
- `/gallery` - 历史作品集
- `/examples` - 示例库
- `/settings` - 设置
- `/billing` - 账单/套餐管理

## API 路由
- `/api/auth/*` - NextAuth 认证
- `/api/generate/text` - 调用通义千问生成文案
- `/api/generate/image` - 调用通义万相生成图片
- `/api/user/credits` - 获取/更新用户额度
- `/api/user/history` - 获取生成历史
- `/api/payment/stripe` - Stripe 支付
- `/api/payment/alipay` - 支付宝支付

## 设计风格
- **简约小清新风**
- **主色调**: 暖白 (#FAFAF5) 背景，绿色 (#4CAF50 / #2E7D32) 为主色
- 辅助色: 暖橙色 (#FF8C42) 用于Call-to-Action
- 字体: 现代无衬线（Inter 或系统字体）
- 圆角卡片，柔和阴影
- 美食摄影风格配图

## 数据库 Schema (Prisma)

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  image         String?
  credits       Int      @default(2)  // 剩余生成次数
  plan           String   @default("free")  // free | basic | pro
  stripeCustomerId String?
  stripeSubscriptionId String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  generations   Generation[]
}

model Generation {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  type      String   // "text" | "image" | "video"
  prompt    String
  result    String   // JSON string with results
  creditsUsed Int    @default(1)
  createdAt DateTime @default(now())
}

model Example {
  id      String @id @default(cuid())
  type    String // "text" | "image" | "video"
  title   String
  prompt  String
  result  String
  locale  String @default("zh") // "zh" | "en"
}
```

## DashScope API 对接

### 通义千问（文案生成）
```
POST https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation
Authorization: Bearer sk-16bccd0f247b409bba6367a08732bd99
Body: {
  "model": "qwen-turbo",
  "input": {
    "messages": [
      {"role": "system", "content": "你是一个餐饮营销专家..."},
      {"role": "user", "content": "..."}
    ]
  },
  "parameters": {
    "result_format": "text"
  }
}
```

### 通义万相（图片生成）
```
POST https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis
Authorization: Bearer sk-16bccd0f247b409bba6367a08732bd99
Body: {
  "model": "wanx-image",  // 可能需要确认具体模型名
  "input": {
    "prompt": "..."
  },
  "parameters": {
    "size": "1024*1024",
    "n": 1
  }
}
```

## 环境变量 (.env.local)
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
DASHSCOPE_API_KEY=sk-16bccd0f247b409bba6367a08732bd99
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
ALIPAY_APP_ID=...
ALIPAY_PRIVATE_KEY=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## 当前阶段目标
**Phase 1 MVP (3天)：**
1. ✅ 初始化 Next.js 项目 + 所有依赖
2. ✅ 搭建国际化框架（中英双语）
3. ✅ Landing Page + Pricing 页面
4. ✅ 注册/登录（先邮箱+验证码，Google可选）
5. ✅ DashScope 文案+图片生成 API 对接
6. ✅ 生成页面 UI（文案输入→展示结果，图片输入→展示结果）
7. ✅ 用量计数+额度管理
8. ✅ 示例库页面
9. ✅ 个人中心/设置页面
10. ✅ 支付模块（先 Stripe 模拟，支付宝占位）
11. ✅ 部署到 Vercel
