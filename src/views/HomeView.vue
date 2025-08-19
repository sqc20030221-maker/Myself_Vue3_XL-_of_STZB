<template>
  <div class="home">
    <HelloWorld />
    <div class="info">
      <h2>Code Inspector Plugin 使用说明</h2>
      <p>1. 在开发模式下，按住 Alt 键点击页面上的元素</p>
      <p>2. 插件会自动打开您的代码编辑器并定位到对应的源代码位置</p>
      <p>3. 支持 Vue 组件、HTML 元素等的快速跳转</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import HelloWorld from '@/components/HelloWorld.vue'
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.info {
  margin-top: 40px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.info h2 {
  color: #333;
  margin-bottom: 16px;
}

.info p {
  margin: 8px 0;
  color: #666;
  line-height: 1.6;
}
</style> 