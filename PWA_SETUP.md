# PWA 设置指南

本项目已经集成了 Progressive Web App (PWA) 功能，按照 Next.js 官方文档的最佳实践实现。

## 环境变量设置

为了启用推送通知功能，您需要创建一个 `.env.local` 文件并添加以下环境变量：

```bash
# 在项目根目录创建 .env.local 文件
# VAPID Keys for Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BGs1ZR08tgd3Qi4KkaQ0LQYLJdAKZ4yuPYJP2_5tVH5TSz_s_-m3wWKsVIyAjE0UVdFUNQAt-fMeELYEoTuiJLs
VAPID_PRIVATE_KEY=rtdpzCn3ggN6uwsQi-o-6sx3SvdoHjRuTO21850UTmY
```

## 生成新的 VAPID 密钥

如果您需要生成新的 VAPID 密钥，可以运行：

```bash
npx web-push generate-vapid-keys
```

## PWA 功能

### 1. Web App Manifest
- 文件位置：`public/manifest.json`
- 使用 `Sign-Logo.png` 作为应用图标
- 支持独立模式显示

### 2. Service Worker
- 文件位置：`public/sw.js`
- 支持推送通知
- 基本的缓存功能
- 离线支持

### 3. 安装提示
- 自动检测 PWA 安装能力
- iOS 设备显示手动安装指引
- 支持 `beforeinstallprompt` 事件

### 4. 推送通知
- 使用 Web Push API
- VAPID 协议支持
- 服务端推送功能

## 本地测试

为了在本地测试 PWA 功能，请使用 HTTPS：

```bash
npm run dev -- --experimental-https
# 或
pnpm dev --experimental-https
```

然后访问：
- 主应用: `https://localhost:3000`
- PWA 测试页面: `https://localhost:3000/pwa-test`

### 测试步骤

1. 首先创建 `.env.local` 文件并添加上述环境变量
2. 启动开发服务器: `pnpm dev --experimental-https`
3. 在浏览器中访问 `https://localhost:3000`
4. 点击右上角的"PWA"按钮进入测试页面
5. 测试各项PWA功能：
   - 检查PWA安装状态
   - 订阅推送通知
   - 发送测试通知
   - 尝试安装应用到主屏幕

## 生产部署

确保您的生产环境：
1. 使用 HTTPS
2. 设置了正确的环境变量
3. Service Worker 可以正常访问

## 文件结构

```
src/
├── app/
│   ├── actions.ts              # Server Actions for push notifications
│   ├── layout.tsx              # 包含 PWA 元数据
│   └── page.tsx                # 包含 PWA 组件
├── components/ui/pwa/
│   ├── install-prompt.tsx      # 安装提示组件
│   ├── push-notification-manager.tsx  # 推送通知管理
│   ├── pwa-wrapper.tsx         # PWA 包装组件
│   └── index.ts                # 导出文件
public/
├── manifest.json               # Web App Manifest
├── sw.js                       # Service Worker
└── Sign-Logo.png              # 应用图标
```

## 安全考虑

- Service Worker 使用严格的 Content Security Policy
- 推送通知使用 VAPID 协议验证
- 所有通信都需要 HTTPS

## 浏览器支持

- Chrome/Edge: 完全支持
- Firefox: 完全支持
- Safari: 基本支持（无 beforeinstallprompt）
- iOS Safari: 手动安装支持 