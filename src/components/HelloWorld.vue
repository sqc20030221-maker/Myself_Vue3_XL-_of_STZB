<template>
  <div class="hello-world">
    <h1>{{ msg }}</h1>
    <p>这是一个测试组件，用于验证 code-inspector-plugin 插件功能</p>
    <button @click="handleClick">点击我</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const msg = ref('Hello Code Inspector!')

const handleClick = () => {
  console.log('按钮被点击了！')
  msg.value = '插件工作正常！'
}
</script>

<style scoped>
.hello-world {
  text-align: center;
  padding: 20px;
}

h1 {
  color: #42b883;
  margin-bottom: 20px;
}

button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #3aa876;
}
</style> 