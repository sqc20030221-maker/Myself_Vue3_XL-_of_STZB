# 项目更新日志

## 2025-08-18 14:24:00 - 配置 Code Inspector Plugin 插件

### 新增功能
- 安装并配置 code-inspector-plugin 插件
- 在 vite.config.ts 中添加插件配置
- 创建示例组件 HelloWorld.vue 用于测试插件功能
- 创建主页视图 HomeView.vue 并配置路由
- 创建插件使用说明文档 CODE_INSPECTOR_README.md

### 技术细节
- 插件配置：bundler: 'vite', needEnvInspector: false
- 支持 Vue 组件、HTML 元素、样式类名等的快速跳转
- 开发模式下按住 Alt 键点击元素可跳转到源代码位置
- 兼容主流代码编辑器：VSCode、WebStorm、Atom 等

### 使用方法
1. 启动开发服务器：npm run dev
2. 按住 Alt 键点击页面元素
3. 自动打开编辑器并定位到源代码位置

--- 