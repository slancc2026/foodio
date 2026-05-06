# FoodieMark AI - Phase 1 开发任务

## 项目概况
餐饮商家 AI 内容运营系统，基于 Next.js 14 + Prisma + Tailwind CSS + DashScope API。

## 代码已在 C:\Users\Administrator\Projects\foodie-mark

## Phase 1 任务清单（按顺序执行）

### Task 1: 点数消费系统（已有 User.credits 字段）
- 修改 /api/generate/image 路由，生成图片后扣除点数
- 点数不足时返回 402
- 新增 GET /api/user/credits 接口返回当前用户点数

### Task 2: 注册/登录页面完善
- /auth/login 和 /auth/register 页面完善（已有页面框架）
- 使用 Prisma + next-auth 验证
- 新用户注册默认送 100 点数

### Task 3: 以图生图功能
- 修改 /api/generate/image 支持「参考图」作为 image input
- 上传参考图到通义万相的 image2image 接口
- 前端已有上传逻辑，需要对接后端

### Task 4: 套餐购买页面
- /pricing 页面展示三种套餐（免费/基础/Pro）
- 购买后更新用户套餐和点数

### Task 5: 管理后台（降级版本）
- /admin 路由：用户列表、点数手动充值、调用统计

### Task 6: 内容日历
- /dashboard/calendar 页面
- 日历视图 + 添加内容排期
- 与生图功能联动

### Task 7: 多模型路由
- 在 dashscope.ts 中添加模型路由逻辑
- 免费用户走 wanx-v1，Pro 用户走 Flux（预留接口）

## 重要注意事项
- 不要修改现有功能的核心文件结构
- 所有新功能在现有文件基础上增量开发
- 每次完成一个 task 后运行一次 
pm run build 确保无报错
- 使用 Prisma + 数据库，不加多余依赖
- 所有 UI 保持现有 Tailwind 风格（cream 背景、绿色主题）
