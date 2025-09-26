<template>
  <div class="page-container">
    <!-- 固定的视频区域 -->
    <div 
      class="video-section" 
      :class="{ 'collapsed': !isVideoExpanded, 'expanded': isVideoExpanded }"
      :style="videoSectionStyle"
      @dblclick="toggleVideo"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <!-- Logo区域 -->
      <div class="logo-section" :class="{ 'hidden': isVideoExpanded && !showLogo }" :style="logoOpacityStyle">
        <img src="/imgs/logo.png" alt="巡猎团Logo" class="main-logo">
      </div>
      
      <video 
        ref="backgroundVideo"
        class="background-video" 
        :style="videoOpacityStyle"
        muted 
        loop 
        playsinline
        preload="auto"
        @loadeddata="onVideoLoaded"
        @ended="onVideoEnded"
        @click="forcePlay"
      >
        <source src="/video/XLvideo.mp4" type="video/mp4">
        您的浏览器不支持视频播放。
      </video>
      
      <!-- 手动播放按钮 -->
      <div class="play-button" v-show="isVideoExpanded && showPlayButton" @click="forcePlay">
        <div class="play-icon">▶</div>
        <div class="play-text">点击播放视频</div>
      </div>
      
      <!-- 视频文字覆盖层 -->
      <div class="video-overlay" v-show="isVideoExpanded" :style="textOpacityStyle">
        <div class="hero-content" :class="{ 'fade-out': !showText }">
          <h1 class="hero-title">欢迎来到巡猎团</h1>
          <p class="hero-subtitle">剑之所指，即是牢马的方向</p>
        </div>
      </div>
      
      <!-- 交互提示 -->
      <div class="interaction-hint" v-show="!isVideoExpanded">
        <div class="hint-text"></div>

      </div>
    </div>
    
    <!-- 可滚动的内容区域 -->
    <div class="content-wrapper">
      <div class="content-section">
        <div class="content-container">
          <div class="scroll-content">
            <h2>内容区域</h2>
            <p>继续向下滚动...</p>
            <div style="height: 150vh; background: linear-gradient(45deg, #1a1a1a, #2d2d2d); padding: 50px; border-radius: 20px; margin-top: 50px;">
              <h3>更多内容</h3>
              <p>这里可以放置更多内容</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const backgroundVideo = ref<HTMLVideoElement>()
const showText = ref(true)
const isVideoExpanded = ref(false)
const showPlayButton = ref(false)
const showLogo = ref(false)
const scrollY = ref(0)
const isAnimating = ref(false)
let hideTextTimer: number | null = null

// 触摸相关变量
let touchStartY = 0
let touchStartTime = 0
let isDragging = false

// 滚动监听
const handleScroll = () => {
  scrollY.value = window.scrollY
  
  if (isVideoExpanded.value && !isAnimating.value) {
    const maxScroll = 400 // 滚动400px完成收缩
    const progress = Math.min(scrollY.value / maxScroll, 1)
    
    // 当滚动进度达到90%时显示logo
    showLogo.value = progress > 0.9
    
    // 当完全滚动完成时收缩视频
    if (progress >= 1) {
      collapseVideo()
    }
  }
}

// 计算样式
const videoSectionStyle = computed(() => {
  if (!isVideoExpanded.value) {
    return {
      height: '80px',
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      zIndex: '1000',
      transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
  
  const maxScroll = 400
  const progress = Math.min(scrollY.value / maxScroll, 1)
  const minHeight = 80
  const maxHeight = window.innerHeight
  const currentHeight = maxHeight - (maxHeight - minHeight) * progress
  
  return {
    height: `${Math.max(currentHeight, minHeight)}px`,
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    zIndex: '1000',
    transition: isAnimating.value ? 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)' : (progress >= 1 ? 'height 0.5s ease' : 'none')
  }
})

const videoOpacityStyle = computed(() => {
  if (!isVideoExpanded.value) {
    return { 
      opacity: '0.3',
      transition: 'opacity 0.8s ease'
    }
  }
  
  const maxScroll = 400
  const progress = Math.min(scrollY.value / maxScroll, 1)
  const opacity = 1 - progress * 0.7
  
  return {
    opacity: Math.max(opacity, 0.3).toString(),
    transition: isAnimating.value ? 'opacity 0.8s ease' : 'opacity 0.2s ease'
  }
})

const textOpacityStyle = computed(() => {
  if (!isVideoExpanded.value) {
    return { 
      opacity: '0',
      transition: 'opacity 0.8s ease'
    }
  }
  
  const maxScroll = 400
  const progress = Math.min(scrollY.value / maxScroll, 1)
  const opacity = 1 - progress * 2
  
  return {
    opacity: Math.max(opacity, 0).toString(),
    transition: isAnimating.value ? 'opacity 0.8s ease' : 'opacity 0.2s ease'
  }
})

const logoOpacityStyle = computed(() => {
  if (!isVideoExpanded.value) {
    return { 
      opacity: '1',
      transition: 'opacity 0.8s ease'
    }
  }
  
  const maxScroll = 400
  const progress = Math.min(scrollY.value / maxScroll, 1)
  
  if (progress > 0.9) {
    const logoOpacity = (progress - 0.9) * 10
    return { 
      opacity: Math.min(logoOpacity, 1).toString(),
      transition: 'opacity 0.3s ease'
    }
  }
  
  return { 
    opacity: '0',
    transition: isAnimating.value ? 'opacity 0.8s ease' : 'opacity 0.3s ease'
  }
})

// 双击切换视频
const toggleVideo = () => {
  if (isVideoExpanded.value) {
    collapseVideo()
  } else {
    expandVideo()
  }
}

// 触摸处理
const handleTouchStart = (e: TouchEvent) => {
  if (isVideoExpanded.value) return
  
  touchStartY = e.touches[0].clientY
  touchStartTime = Date.now()
  isDragging = false
}

const handleTouchMove = (e: TouchEvent) => {
  if (isVideoExpanded.value) return
  
  const currentY = e.touches[0].clientY
  const deltaY = currentY - touchStartY
  const deltaTime = Date.now() - touchStartTime
  
  if (deltaY > 50 && deltaTime > 100) {
    isDragging = true
    expandVideo()
  }
}

const handleTouchEnd = () => {
  isDragging = false
}

// 强制播放视频
const forcePlay = async () => {
  if (!backgroundVideo.value) return
  
  try {
    showPlayButton.value = false
    await backgroundVideo.value.play()
    startHideTextTimer()
  } catch (error) {
    console.log('视频播放失败:', error)
    showPlayButton.value = true
  }
}

// 展开视频 - 添加动画效果
const expandVideo = async () => {
  isAnimating.value = true
  isVideoExpanded.value = true
  showPlayButton.value = false
  showLogo.value = false
  
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  await nextTick()
  
  if (backgroundVideo.value) {
    backgroundVideo.value.currentTime = 0
    
    // 等待动画完成后播放视频
    setTimeout(async () => {
      isAnimating.value = false
      try {
        if (backgroundVideo.value) {
          await backgroundVideo.value.play()
          startHideTextTimer()
        }
      } catch (error) {
        showPlayButton.value = true
      }
    }, 800) // 与CSS动画时间匹配
  }
}

// 收缩视频 - 添加动画效果
const collapseVideo = async () => {
  isAnimating.value = true
  showText.value = true
  showPlayButton.value = false
  showLogo.value = false
  
  if (hideTextTimer) {
    clearTimeout(hideTextTimer)
  }
  
  if (backgroundVideo.value) {
    backgroundVideo.value.pause()
    backgroundVideo.value.currentTime = 0
  }
  
  // 等待动画完成后更新状态
  setTimeout(() => {
    isVideoExpanded.value = false
    isAnimating.value = false
  }, 800) // 与CSS动画时间匹配
}

// 其他函数保持不变
const onVideoLoaded = () => {
  if (isVideoExpanded.value) {
    showText.value = true
    startHideTextTimer()
  }
}

const onVideoEnded = () => {
  if (isVideoExpanded.value) {
    showText.value = true
    startHideTextTimer()
  }
}

const startHideTextTimer = () => {
  if (hideTextTimer) {
    clearTimeout(hideTextTimer)
  }
  
  hideTextTimer = setTimeout(() => {
    showText.value = false
  }, 8000)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isVideoExpanded.value) {
    collapseVideo()
  }
}

onMounted(() => {
  isVideoExpanded.value = false
  if (backgroundVideo.value) {
    backgroundVideo.value.pause()
    backgroundVideo.value.currentTime = 0
  }
  
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (hideTextTimer) {
    clearTimeout(hideTextTimer)
  }
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  position: relative;
}

/* 视频区域 - 固定在顶部 */
.video-section {
  width: 100%;
  background: #000;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.video-section.collapsed {
  height: 80px;
}

.video-section.expanded {
  height: 100vh;
}

/* Logo区域 */
.logo-section {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1002;
  transition: opacity 0.8s ease, visibility 0.8s ease;
}

.logo-section.hidden {
  opacity: 0;
  visibility: hidden;
}

.main-logo {
  height: 60px;
  width: auto;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
  transition: transform 0.3s ease;
}

.main-logo:hover {
  transform: scale(1.05);
}

/* 背景视频 */
.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  z-index: 1001;
  object-fit: cover;
  transition: opacity 0.8s ease, transform 0.8s ease;
}

/* 视频覆盖层 */
.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1003;
  pointer-events: none;
  transition: opacity 0.8s ease;
}

.hero-content {
  text-align: center;
  max-width: 800px;
  padding: 0 20px;
  color: white;
  transition: opacity 1s ease-out, transform 0.8s ease;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  transform: translateY(0);
}

.hero-content.fade-out {
  opacity: 0;
  transform: translateY(-20px);
}

.hero-title {
  font-size: clamp(2rem, 8vw, 4rem);
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
  transition: transform 0.8s ease;
}

.hero-subtitle {
  font-size: clamp(1rem, 4vw, 1.5rem);
  font-weight: 300;
  line-height: 1.4;
  opacity: 0.9;
  transition: transform 0.8s ease 0.2s;
}

/* 播放按钮 */
.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1004;
  transition: all 0.3s ease, opacity 0.8s ease;
  backdrop-filter: blur(10px);
}

.play-button:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: translate(-50%, -50%) scale(1.1);
}

/* 交互提示 */
.interaction-hint {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: white;
  z-index: 1003;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 16px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.hint-text {
  font-size: 0.8rem;
  margin-bottom: 5px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.hint-icons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.double-click-icon {
  font-size: 1rem;
  animation: bounce 2s infinite;
  transition: transform 0.3s ease;
}

.or-text {
  font-size: 0.7rem;
  opacity: 0.8;
}

.pull-down-icon {
  font-size: 1.2rem;
  animation: pullDown 2s infinite;
  transition: transform 0.3s ease;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
}

@keyframes pullDown {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(8px);
  }
}

/* 内容区域 */
.content-wrapper {
  margin-top: 80px; /* 为固定的视频区域留出空间 */
}

.content-section {
  background-image: url('/imgs/背景.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  position: relative;
}

.content-container {
  min-height: 100vh;
  padding: 40px 20px;
  background: rgba(0, 0, 0, 0.3);
  color: white;
}

.scroll-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px 20px;
}

.scroll-content h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-align: center;
}

.scroll-content p {
  font-size: 1.2rem;
  text-align: center;
  opacity: 0.9;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .main-logo {
    height: 50px;
  }
  
  .play-button {
    padding: 15px;
  }
  
  .play-icon {
    font-size: 1.5rem;
  }
  
  .play-text {
    font-size: 0.8rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
}
</style>