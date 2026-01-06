<template>
  <div class="upload-page">
    <!-- 顶部Header -->
    <header class="top-header">
      <div class="header-left">
        <img src="/logo.png" alt="影集 Logo" class="logo-img" />
      </div>
      <div class="header-center">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="搜索作者、作品名称" class="search-input" />
        </div>
      </div>
      <div class="header-right">
        <div v-if="isLoggedIn" class="user-avatar" @click="handleAvatarClick">
          <img v-if="currentUser?.avatar" :src="currentUser.avatar" alt="用户头像" class="avatar-img" />
          <div v-else class="avatar-placeholder">👤</div>
        </div>
        <button v-else class="login-link-btn" @click="goToLogin">登录</button>
        <button class="site-btn" @click="goToHome">
          <span class="site-icon">🌐</span>
          M 本站
        </button>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- 左侧导航栏 -->
        <nav class="sidebar-nav">
          <router-link to="/upload" class="nav-item active">投稿</router-link>
          <router-link to="/manage" class="nav-item">管理作品</router-link>
          <a href="#" class="nav-item">评论管理</a>
        </nav>

        <!-- 右侧内容区 -->
        <div class="content-area">
          <!-- 选择作品类型 -->
          <div v-if="step === 'select'" class="select-type-section">
            <h1 class="section-title">上传作品</h1>
            <p class="section-subtitle">请选择上传作品种类:</p>
            <div class="type-grid">
              <div 
                v-for="type in workTypes" 
                :key="type.id"
                class="type-card"
                :class="{ active: selectedType === type.id }"
                @click="selectType(type.id)"
              >
                <div class="type-icon">{{ type.icon }}</div>
                <div class="type-name">{{ type.name }}</div>
                <div class="type-desc">{{ type.desc }}</div>
              </div>
            </div>
            <button 
              class="next-btn" 
              @click="goToNextStep"
              :disabled="!selectedType || (selectedType !== 'video' && selectedType !== 'graphic')"
            >
              下一步
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(false)
const currentUser = ref(null)
const selectedType = ref(null)
const step = ref('select')

const workTypes = [
  { id: 'video', name: '视频类作品', desc: '如视频剪辑、动画制作', icon: '🎬' },
  { id: 'graphic', name: '图文类作品', desc: '如UI设计、绘画', icon: '🎨' }
]

onMounted(() => {
  // 检查是否已登录
  const loggedInUser = localStorage.getItem('currentUser')
  if (loggedInUser) {
    currentUser.value = JSON.parse(loggedInUser)
    isLoggedIn.value = true
  } else {
    isLoggedIn.value = false
    // 未登录跳转到登录页
    router.push('/login')
  }
})

const selectType = (typeId) => {
  selectedType.value = typeId
}

const goToNextStep = () => {
  if (selectedType.value === 'video') {
    router.push('/upload/video')
  } else if (selectedType.value === 'graphic') {
    router.push('/upload/graphic')
  } else {
    alert('该类型作品上传功能暂未开放')
  }
}

const goToHome = () => {
  router.push('/dashboard')
}

const goToLogin = () => {
  router.push('/login')
}

const handleAvatarClick = () => {
  if (currentUser.value) {
    router.push(`/profile/${currentUser.value.username}`)
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.upload-page {
  min-height: 100vh;
  background-color: #DCE2FC;
  font-family: 'Noto Sans SC', sans-serif;
}

/* 顶部Header */
.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 60px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-img {
  width: 150px;
  height: auto;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 600px;
  margin: 0 40px;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 25px;
  padding: 10px 20px;
  width: 100%;
  max-width: 500px;
}

.search-icon {
  margin-right: 10px;
  font-size: 18px;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  color: #666;
}

.search-input::placeholder {
  color: #999;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 24px;
}

.login-link-btn {
  padding: 10px 20px;
  background-color: transparent;
  color: #09147D;
  border: 1px solid #09147D;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.login-link-btn:hover {
  background-color: #09147D;
  color: #fff;
}

.site-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: transparent;
  color: #09147D;
  border: 1px solid #09147D;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.site-btn:hover {
  background-color: #09147D;
  color: #fff;
}

.site-icon {
  font-size: 18px;
}

/* 主要内容区域 */
.main-content {
  padding: 40px 60px;
}

.content-wrapper {
  display: flex;
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 左侧导航栏 */
.sidebar-nav {
  width: 200px;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.nav-item {
  display: block;
  padding: 15px 30px;
  color: #000;
  text-decoration: none;
  font-size: 16px;
  transition: all 0.3s;
}

.nav-item:hover {
  background-color: #f5f5f5;
}

.nav-item.active {
  background-color: #DCE2FC;
  color: #09147D;
  font-weight: bold;
}

/* 右侧内容区 */
.content-area {
  flex: 1;
  background-color: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.select-type-section {
  max-width: 800px;
  margin: 0 auto;
}

.section-title {
  font-size: 32px;
  font-weight: bold;
  color: #000;
  margin-bottom: 15px;
}

.section-subtitle {
  font-size: 18px;
  color: #666;
  margin-bottom: 40px;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin-bottom: 40px;
}

.type-card {
  padding: 30px;
  border-radius: 12px;
  background-color: #7C93F2;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.type-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.type-card.active {
  background-color: #A77CF2;
}

.type-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.type-name {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
}

.type-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.next-btn {
  display: block;
  margin-left: auto;
  padding: 12px 40px;
  background-color: #DCE2FC;
  color: #09147D;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.next-btn:hover:not(:disabled) {
  background-color: #09147D;
  color: #fff;
}

.next-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .type-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 20px;
  }
  
  .content-wrapper {
    flex-direction: column;
  }
  
  .sidebar-nav {
    width: 100%;
  }
  
  .top-header {
    padding: 15px 20px;
    flex-wrap: wrap;
  }
  
  .header-center {
    order: 3;
    width: 100%;
    margin: 10px 0 0 0;
  }
}
</style>

