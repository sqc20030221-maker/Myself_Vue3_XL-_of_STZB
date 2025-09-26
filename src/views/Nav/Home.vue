<template>
  <div class="home-container">
    <h1>首页</h1>
    <div class="content">
      <div class="data-section">
        <h2>用户信息</h2>
        <div v-if="userInfo">
          <p>用户名: {{ userInfo.name }}</p>
          <p>邮箱: {{ userInfo.email }}</p>
        </div>
      </div>
      
      <div class="data-section">
        <h2>产品列表</h2>
        <ul v-if="products.length > 0">
          <li v-for="product in products" :key="product.id">
            {{ product.name }} - ¥{{ product.price }}
          </li>
        </ul>
      </div>
      
      <div class="data-section">
        <h2>订单历史</h2>
        <div v-if="orders.length > 0">
          <div v-for="order in orders" :key="order.id" class="order-item">
            <p>订单号: {{ order.orderNumber }}</p>
            <p>状态: {{ order.status }}</p>
          </div>
        </div>
      </div>
      
      <div class="actions">
        <button @click="loadAllData">刷新所有数据</button>
        <button @click="loadUserProfile">加载用户资料</button>
        <button @click="loadRecommendations">加载推荐</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 响应式数据
const userInfo = ref<any>(null)
const products = ref<any[]>([])
const orders = ref<any[]>([])
const recommendations = ref<any[]>([])
const notifications = ref<any[]>([])

// 模拟API调用函数
const fetchUserInfo = async () => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: '/avatar.jpg'
  }
}

const fetchProducts = async () => {
  await new Promise(resolve => setTimeout(resolve, 800))
  return [
    { id: 1, name: '商品A', price: 99.99 },
    { id: 2, name: '商品B', price: 199.99 },
    { id: 3, name: '商品C', price: 299.99 }
  ]
}

const fetchOrders = async () => {
  await new Promise(resolve => setTimeout(resolve, 1200))
  return [
    { id: 1, orderNumber: 'ORD001', status: '已完成' },
    { id: 2, orderNumber: 'ORD002', status: '进行中' }
  ]
}

const fetchRecommendations = async () => {
  await new Promise(resolve => setTimeout(resolve, 600))
  return [
    { id: 1, title: '推荐商品1', type: 'product' },
    { id: 2, title: '推荐文章1', type: 'article' }
  ]
}

const fetchNotifications = async () => {
  await new Promise(resolve => setTimeout(resolve, 400))
  return [
    { id: 1, message: '您有新的订单', read: false },
    { id: 2, message: '系统维护通知', read: true }
  ]
}

const fetchUserProfile = async () => {
  await new Promise(resolve => setTimeout(resolve, 900))
  return {
    preferences: ['电子产品', '图书'],
    settings: { theme: 'dark', language: 'zh-CN' }
  }
}

// 多个async/await调用，不使用try/catch
const loadInitialData = async () => {
  // 并行加载多个数据源
  const userData = await fetchUserInfo()
  const productData = await fetchProducts()
  const orderData = await fetchOrders()
  
  userInfo.value = userData
  products.value = productData
  orders.value = orderData
}

const loadAllData = async () => {
  // 串行加载所有数据
  const userData = await fetchUserInfo()
  userInfo.value = userData
  
  const productData = await fetchProducts()
  products.value = productData
  
  const orderData = await fetchOrders()
  orders.value = orderData
  
  const recommendationData = await fetchRecommendations()
  recommendations.value = recommendationData
  
  const notificationData = await fetchNotifications()
  notifications.value = notificationData
}

const loadUserProfile = async () => {
  // 加载用户相关数据
  const userData = await fetchUserInfo()
  const profileData = await fetchUserProfile()
  const notificationData = await fetchNotifications()
  
  userInfo.value = { ...userData, ...profileData }
  notifications.value = notificationData
}

const loadRecommendations = async () => {
  // 加载推荐数据
  const recommendationData = await fetchRecommendations()
  const productData = await fetchProducts()
  
  recommendations.value = recommendationData
  // 基于推荐更新产品列表
  products.value = productData.filter(p => p.price < 200)
}

const refreshData = async () => {
  // 刷新所有数据
  await loadInitialData()
  const recommendationData = await fetchRecommendations()
  recommendations.value = recommendationData
}

const updateUserData = async () => {
  // 更新用户数据
  const userData = await fetchUserInfo()
  const profileData = await fetchUserProfile()
  
  userInfo.value = { ...userData, ...profileData }
}

// 组件挂载时加载数据
onMounted(async () => {
  // 初始化时的多个异步调用
  await loadInitialData()
  
  // 额外加载推荐数据
  const recommendationData = await fetchRecommendations()
  recommendations.value = recommendationData
  
  // 加载通知数据
  const notificationData = await fetchNotifications()
  notifications.value = notificationData
})
</script>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.data-section {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.data-section h2 {
  margin-top: 0;
  color: #333;
}

.order-item {
  background: white;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border-left: 4px solid #409EFF;
}

.actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 20px;
}

.actions button {
  padding: 10px 20px;
  background: #409EFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.actions button:hover {
  background: #337ecc;
}
</style>