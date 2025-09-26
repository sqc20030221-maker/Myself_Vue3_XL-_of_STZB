<template>
  <el-menu
    :default-active="activeIndex"
    :mode="mode"
    :background-color="backgroundColor"
    :text-color="textColor"
    :active-text-color="activeTextColor"
    :collapse="isCollapse"
    :unique-opened="uniqueOpened"
    :router="router"
    @select="handleSelect"
    class="nav-bar"
    :class="{ 'game-style': gameStyle }"
  >
    <!-- Logo区域 -->
    <div v-if="showLogo" class="nav-logo" :class="{ 'collapsed': isCollapse }">
      <img v-if="logo" :src="logo" :alt="title" class="logo-img" />
      <span v-if="!isCollapse && title" class="logo-title">{{ title }}</span>
    </div>

    <!-- 菜单项 -->
    <template v-for="item in menuItems" :key="item.index">
      <!-- 有子菜单的项 -->
      <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.index">
        <template #title>
          <el-icon v-if="item.icon">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
        <el-menu-item
          v-for="child in item.children"
          :key="child.index"
          :index="child.index"
          :route="child.route"
        >
          <el-icon v-if="child.icon">
            <component :is="child.icon" />
          </el-icon>
          <span>{{ child.title }}</span>
        </el-menu-item>
      </el-sub-menu>

      <!-- 普通菜单项 -->
      <el-menu-item v-else :index="item.index" :route="item.route">
        <el-icon v-if="item.icon">
          <component :is="item.icon" />
        </el-icon>
        <span>{{ item.title }}</span>
      </el-menu-item>
    </template>

    <!-- 折叠按钮 -->
    <div v-if="showCollapseBtn && mode === 'vertical'" class="collapse-btn" @click="toggleCollapse">
      <el-icon>
        <Fold v-if="!isCollapse" />
        <Expand v-else />
      </el-icon>
    </div>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Fold, Expand } from '@element-plus/icons-vue'

// 定义菜单项类型
interface MenuItem {
  index: string
  title: string
  icon?: any
  route?: string
  children?: MenuItem[]
}

// 定义组件属性
interface Props {
  // 菜单项数据
  menuItems: MenuItem[]
  // 当前激活菜单的 index
  activeIndex?: string
  // 模式：horizontal / vertical
  mode?: 'horizontal' | 'vertical'
  // 背景颜色
  backgroundColor?: string
  // 文字颜色
  textColor?: string
  // 激活文字颜色
  activeTextColor?: string
  // 是否折叠（仅在 vertical 模式下有效）
  collapse?: boolean
  // 是否只保持一个子菜单的展开
  uniqueOpened?: boolean
  // 是否启用路由模式
  router?: boolean
  // 是否显示Logo
  showLogo?: boolean
  // Logo图片地址
  logo?: string
  // 标题
  title?: string
  // 是否显示折叠按钮
  showCollapseBtn?: boolean
  // 是否启用游戏风格
  gameStyle?: boolean
}

// 设置默认值
const props = withDefaults(defineProps<Props>(), {
  activeIndex: '1',
  mode: 'horizontal',
  backgroundColor: '#ffffff',
  textColor: '#303133',
  activeTextColor: '#409EFF',
  collapse: false,
  uniqueOpened: false,
  router: true,
  showLogo: false,
  showCollapseBtn: false,
  gameStyle: false
})

// 定义事件
interface Emits {
  (e: 'select', index: string, indexPath: string[], item: MenuItem): void
  (e: 'collapse-change', isCollapse: boolean): void
}

const emit = defineEmits<Emits>()

// 响应式数据
const isCollapse = ref(props.collapse)

// 监听collapse属性变化
watch(() => props.collapse, (newVal) => {
  isCollapse.value = newVal
})

// 处理菜单选择
const handleSelect = (index: string, indexPath: string[]) => {
  const findMenuItem = (items: MenuItem[], targetIndex: string): MenuItem | null => {
    for (const item of items) {
      if (item.index === targetIndex) {
        return item
      }
      if (item.children) {
        const found = findMenuItem(item.children, targetIndex)
        if (found) return found
      }
    }
    return null
  }
  
  const selectedItem = findMenuItem(props.menuItems, index)
  if (selectedItem) {
    emit('select', index, indexPath, selectedItem)
  }
}

// 切换折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
  emit('collapse-change', isCollapse.value)
}
</script>

<style scoped>
.nav-bar {
  border-right: none;
}

/* 图标大小控制 */
.nav-bar .el-icon {
  width: 18px;
  height: 18px;
  font-size: 18px;
}

.nav-bar .el-menu-item .el-icon,
.nav-bar .el-sub-menu__title .el-icon {
  margin-right: 8px;
  width: 16px;
  height: 16px;
  font-size: 16px;
}

/* 折叠状态下的图标 */
.nav-bar.el-menu--collapse .el-menu-item .el-icon,
.nav-bar.el-menu--collapse .el-sub-menu__title .el-icon {
  margin-right: 0;
  width: 20px;
  height: 20px;
  font-size: 20px;
}

.nav-logo {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e4e7ed;
  transition: all 0.3s;
}

.nav-logo.collapsed {
  justify-content: center;
  padding: 16px 8px;
}

.logo-img {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  transition: all 0.3s;
}

.nav-logo.collapsed .logo-img {
  margin-right: 0;
}

.logo-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
}

.collapse-btn {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.collapse-btn:hover {
  background-color: #f5f7fa;
}

/* 水平模式样式 */
.nav-bar.el-menu--horizontal {
  border-bottom: 1px solid #e4e7ed;
}

.nav-bar.el-menu--horizontal .nav-logo {
  border-bottom: none;
  border-right: 1px solid #e4e7ed;
}

/* 游戏风格导航栏样式 */
.nav-bar.game-style {
  background: linear-gradient(90deg, #010a13 0%, #0f2027 50%, #203a43 100%);
  border-bottom: 1px solid rgba(200, 155, 60, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  height: 60px;
}

.nav-bar.game-style .nav-logo {
  background: transparent;
  border-right: none;
  padding: 0 30px;
  height: 100%;
  display: flex;
  align-items: center;
}

.nav-bar.game-style .logo-title {
  color: #c89b3c;
  font-weight: bold;
  font-size: 20px;
  text-shadow: 0 0 10px rgba(200, 155, 60, 0.3);
  letter-spacing: 1px;
}

.nav-bar.game-style .el-menu-item {
  border-bottom: none;
  transition: all 0.3s ease;
  font-weight: 500;
  letter-spacing: 0.5px;
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
  margin: 0 5px;
  border-radius: 0;
}

.nav-bar.game-style .el-menu-item:hover {
  background-color: rgba(200, 155, 60, 0.1);
  color: #c89b3c;
}

.nav-bar.game-style .el-menu-item.is-active {
  background-color: rgba(200, 155, 60, 0.15);
  color: #c89b3c !important;
}

/* 水平模式下的游戏风格特殊处理 */
.nav-bar.game-style.el-menu--horizontal {
  border-bottom: 1px solid rgba(200, 155, 60, 0.3);
}

.nav-bar.game-style.el-menu--horizontal .nav-logo {
  border-right: none;
}

/* 垂直模式样式 */
.nav-bar.el-menu--vertical {
  height: 100vh;
  position: relative;
}

/* 折叠状态样式 */
.nav-bar.el-menu--collapse {
  width: 64px;
}
</style>