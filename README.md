# ✦ 灵感碎片 · Inspiration Fragments

> 一个交互式灵感收集站 —— 捕捉那些一闪而过的念头，让它们成为可视、可听、可分享的实体。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)
![Built by](https://img.shields.io/badge/Built%20by-LongCat%202.5-8b5cf6.svg)

---

## 🤖 项目溯源

> **本项目完全由 LongCat 2.5 自主构建，无任何人工干预。**
>
> 从网站的概念构思、功能设计、代码编写、样式打磨，到最终的构建部署，全部由 LongCat 2.5 独立完成。项目的核心灵感——「灵感碎片」这一交互概念，同样源自 LongCat 的创意。
>
> | 指标 | 数据 |
> |------|------|
> | 总用时 | 约 25 分钟 |
> | Token 消耗 | 约 20 万 |
> | 人工干预 | 0 |
> | 构建模型 | LongCat 2.5 |

---

---

## ✨ 功能特性

| 功能 | 描述 |
|------|------|
| 🌌 **漂浮碎片画布** | 灵感碎片在屏幕上漂浮、旋转，鼠标可以拨开它们 |
| 🎯 **点击捕捉** | 点击吸引你的碎片，收入你的灵感墙 |
| 🎨 **灵感墙** | 所有捕捉到的碎片以卡片形式展示，持久化存储在本地 |
| 🎵 **氛围音景** | 根据灵感碎片的颜色，用 Web Audio API 实时生成环境音乐 |
| 🍾 **灵感漂流瓶** | 把灵感墙编码成链接，分享给任何人；也可以导入别人的瓶子 |

---

## 🚀 快速开始

### 环境要求

- Node.js ≥ 18
- npm ≥ 9

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

---

## 🏗️ 技术栈

- **[Vite](https://vitejs.dev/)** — 构建工具与开发服务器
- **[React 18](https://react.dev/)** — UI 框架
- **[TypeScript](https://www.typescriptlang.org/)** — 类型安全
- **Canvas 2D API** — 碎片漂浮与交互渲染
- **Web Audio API** — 程序化生成氛围音乐
- **CSS Custom Properties** — 设计系统与主题
- **GitHub Actions** — CI/CD 自动部署

---

## 📁 项目结构

```
RandomWebsite/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages 自动部署
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # 导航栏
│   │   ├── Hero.tsx             # 首屏
│   │   ├── FragmentCanvas.tsx   # 碎片捕捉画布
│   │   ├── Collection.tsx       # 灵感墙
│   │   ├── DriftBottle.tsx      # 漂流瓶
│   │   └── Footer.tsx           # 页脚
│   ├── lib/
│   │   ├── audio.ts             # 氛围音景引擎
│   │   └── storage.ts           # 本地存储 & 编码
│   ├── data/
│   │   └── fragments.ts         # 灵感内容池
│   ├── App.tsx                  # 主应用
│   ├── main.tsx                 # 入口
│   ├── index.css                # 全局样式
│   └── types.ts                 # 类型定义
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🎨 设计说明

- **配色**：深色背景（`#050508`）+ 荧光渐变色板（靛蓝、品红、紫罗兰、青色、翠绿）
- **字体**：Noto Serif SC（中文衬线）+ Space Grotesk（英文/数字）
- **动效**：碎片漂浮物理模拟、鼠标排斥、卡片悬停光晕、平滑滚动
- **无障碍**：尊重 `prefers-reduced-motion`，支持键盘导航

---

## 📄 许可证

[MIT](LICENSE) © 2026 Inspiration Fragments
