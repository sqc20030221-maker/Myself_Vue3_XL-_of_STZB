<template>
  <div class="nav-example">
    <div class="lol-navbar-container">
      <NavBar
        :menu-items="menuItems"
        mode="horizontal"
        :show-logo="true"
        title="巡猎团"
        :game-style="true"
        background-color="transparent"
        text-color="#cdbe91"
        active-text-color="#c89b3c"
        @select="handleMenuSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavBar from './NavBar.vue'

// 菜单项类型定义
interface MenuItem {
  index: string
  title: string
  icon?: any
  route?: string
  children?: MenuItem[]
}

// 工具函数：创建菜单项
function createMenuItem(
  index: string,
  title: string,
  options: {
    icon?: any
    route?: string
  } = {}
): MenuItem {
  return {
    index,
    title,
    icon: options.icon,
    route: options.route
  }
}

// 响应式数据
const selectedMenu = ref('1')

// 菜单项数据 - 模拟英雄联盟导航栏
const menuItems: MenuItem[] = [
  createMenuItem('1', '游戏资料', { route: '/game-info' }),
  createMenuItem('2', '商城/合作', { route: '/store' }),
  createMenuItem('3', '社区互动', { route: '/community' }),
  createMenuItem('4', '赛事官网', { route: '/esports' }),
  createMenuItem('5', '自助系统', { route: '/system' })
]

// 事件处理
const handleMenuSelect = (index: string, indexPath: string[], item: MenuItem) => {
  selectedMenu.value = `${item.title} (${index})`
  console.log('选中菜单:', { index, indexPath, item })
}
</script>

<style scoped>
.nav-example {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;

}

.lol-navbar-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
}

/* 覆盖Element Plus默认样式，确保游戏风格生效 */


:deep(.nav-bar.game-style .el-menu-item) {
  color: #cdbe91 !important;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 13px;
}

:deep(.nav-bar.game-style .el-menu-item:hover) {
  color: #c89b3c !important;
  transform: translateY(-1px);
  transition: all 0.3s ease;
}

:deep(.nav-bar.game-style .el-menu-item.is-active) {
  color: #c89b3c !important;
  border-bottom: 2px solid #c89b3c;
}

:deep(.nav-bar.game-style .nav-logo .logo-title) {
  color: #c89b3c !important;
  font-size: 22px !important;
  font-weight: bold !important;
  text-shadow: 0 0 15px rgba(200, 155, 60, 0.5) !important;
  letter-spacing: 2px !important;
}
</style>