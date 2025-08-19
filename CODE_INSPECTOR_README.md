# Code Inspector Plugin 配置说明

## 插件介绍

Code Inspector Plugin 是一个强大的开发工具，可以帮助您在开发过程中快速定位和跳转到组件、函数等定义位置。通过点击页面上的元素，插件会自动打开您的代码编辑器并定位到对应的源代码位置。

## 安装配置

### 1. 安装插件

```bash
npm install --save-dev code-inspector-plugin
```

### 2. 配置 Vite

在 `vite.config.ts` 中添加插件配置：

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { codeInspectorPlugin } from 'code-inspector-plugin'

export default defineConfig({
  plugins: [
    vue(),
    codeInspectorPlugin({
      bundler: 'vite',
      // 设置为 true 时，仅当 .env.local 文件存在且其包含 CODE_INSPECTOR=true 时插件生效
      needEnvInspector: false
    })
  ],
})
```

## 使用方法

### 1. 启动开发服务器

```bash
npm run dev
```

### 2. 使用插件功能

- **按住 Alt 键**，然后点击页面上的任何元素
- 插件会自动打开您的代码编辑器（VSCode、WebStorm等）
- 光标会自动定位到对应的源代码位置

### 3. 支持的功能

- ✅ Vue 组件跳转
- ✅ HTML 元素跳转
- ✅ 样式类名跳转
- ✅ 事件处理函数跳转
- ✅ 模板中的组件跳转

## 配置选项

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `bundler` | string | - | 构建工具类型，如 'vite'、'webpack' 等 |
| `needEnvInspector` | boolean | false | 是否需要环境变量控制插件启用 |

## 环境变量控制

如果您想要通过环境变量控制插件的启用，可以：

1. 创建 `.env.local` 文件
2. 添加 `CODE_INSPECTOR=true`
3. 将配置中的 `needEnvInspector` 设置为 `true`

## 注意事项

1. 插件仅在开发模式下生效
2. 需要确保您的代码编辑器支持文件跳转功能
3. 支持主流编辑器：VSCode、WebStorm、Atom 等

## 故障排除

如果插件不工作，请检查：

1. 是否正确安装了插件
2. 配置文件是否正确
3. 是否在开发模式下运行
4. 编辑器是否支持文件跳转

## 更多信息

- [官方文档](https://inspector.fe-dev.cn)
- [GitHub 仓库](https://github.com/zh-lx/code-inspector)
- [在线演示](https://inspector.fe-dev.cn/en) 