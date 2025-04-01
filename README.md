# 视频网站字幕提取浏览器插件

一个强大的 Chrome 浏览器扩展，结合AI的强大翻译功能和视频处理能力，为非母语者提供强大的翻译功能，为语言学习者提供多功能语言学习笔记等功能。使用 TypeScript、React、Plasmo、Tailwind CSS 和 Shadcn UI 组件构建。

## 🌟 主要功能

- 💬 AI 智能翻译
- 🎨 基于 Shadcn 组件的现代化 UI 设计
- 🌓 深色/浅色主题切换
- 💾 视频字幕提取下载
- ⚡ 弹出窗口快速访问
- 🔒 笔记+翻译导出
- 📋 视频内容内容分析与总结
- 🔍 智能搜索建议

## 🛠️ 技术栈

- **框架:** React + TypeScript
- **扩展框架:** [Plasmo](https://juejin.cn/post/7257520279312498748)
- **样式:** [Tailwind CSS](https://www.tailwindcss.cn/docs/installation)
- **UI 组件:** [Shadcn UI](https://www.shadcn-ui.cn/docs/installation)
- **图标:** Lucide React

## 📁 项目结构

├── src/
│ ├── background/ # 后台脚本
│ ├── components/ # React 组件
│ │ ├── ListenSubtitle/ # 听写+笔记页面
│ ├── hooks/ # 自定义 React Hooks
│ ├── lib/ # 工具函数库
│ ├── contents/ # content script内容脚本
│ │ ├── ListenSubtitle/ # 针对bilibili视频的听写+笔记页面脚本
│ ├── popup/ # 弹出窗口
│ ├── options/ # 选项页面
│ ├── sidepanel/ # 侧边栏
│ ├── global.css # 全局样式
├── assets/ # 静态资源
└── package.json # 项目配置文件
└── tailwind.config.ts # tailwind配置文件
└── tsconfig.json # tsconfig配置文件

## 🚀 快速开始

1. 克隆项目到本地
2. 安装依赖: `yarn`
3. 构建项目: `yarn dev` 生成开发包，将build/chrome-mv3-dev 文件夹安装到chrome浏览器的扩展程序内后
4. 构建项目: `yarn buildbuild` 生成生产包，将build/chrome-mv3-prod 文件夹安装到chrome浏览器的扩展程序内
![安装位置](./assets/md/image.png)

### 1. 字幕同步卡片
- 实时同步字幕和视频进度
- 实时翻译视频人物对话或语音
- AI智能总结视频内容
- 字幕多格式下载导出
- 字幕上传


### 2. 精听弹窗(针对语言学习者)
- 控制视频片段播放速度、循环播放
- 支持听写语音内容
- 实时校验听写内容
- 支持笔记
- 支持导出字幕+笔记

### 3. 支持多网站
- bilibili
- youtube
- 奈飞
- 其他网站

## 📝 使用说明

1. 在 Chrome 网上应用店安装插件
2. 点击浏览器工具栏中的插件图标展示字幕同步卡片
3. 点击鼠标右键弹出后点击“去精听”打开精听弹窗
4. 打开选项页设置主题、字体等

## 🔒 隐私说明

- 所有对话数据仅存储在本地
- 不收集用户个人信息
- API 调用采用加密传输
- 用户可随时清除所有数据

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 📄 许可证

MIT License - 详见 LICENSE 文件
