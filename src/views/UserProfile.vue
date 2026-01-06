<template>
  <div class="user-profile">
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
        <div v-if="isLoggedIn" class="user-avatar" @click="goToProfile">
          <img v-if="currentUser?.avatar" :src="currentUser.avatar" alt="用户头像" class="avatar-img" />
          <div v-else class="avatar-placeholder">👤</div>
        </div>
        <button v-else class="login-link-btn" @click="goToLogin">登录</button>
        <button class="site-btn" @click="goToHome">
          <span class="site-icon">🌐</span>
          M 返回本站
        </button>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <div class="profile-wrapper">
        <!-- 用户信息区域 -->
        <div class="user-info-section">
          <div class="user-avatar-large">
            <img v-if="profileUser?.avatar" :src="profileUser.avatar" alt="用户头像" class="avatar-img-large" />
            <div v-else class="avatar-placeholder-large">👤</div>
          </div>
          <div class="username">{{ profileUser?.username || '用户' }}</div>
        </div>

        <!-- 导航标签 -->
        <div class="tabs-section">
          <button class="tab-item" :class="{ active: activeTab === 'home' }" @click="activeTab = 'home'">
            主页
          </button>
          <button class="tab-item" :class="{ active: activeTab === 'submissions' }" @click="activeTab = 'submissions'">
            投稿
          </button>
          <button class="tab-item" :class="{ active: activeTab === 'video' }" @click="activeTab = 'video'">
            视频稿件
          </button>
          <button class="tab-item" :class="{ active: activeTab === 'graphic' }" @click="activeTab = 'graphic'">
            图文稿件
          </button>
          <button class="tab-item" :class="{ active: activeTab === 'software' }" @click="activeTab = 'software'">
            软件稿件
          </button>
          <button class="tab-item" :class="{ active: activeTab === 'audio' }" @click="activeTab = 'audio'">
            音频稿件
          </button>
        </div>

        <!-- 作品列表 -->
        <div class="works-section">
          <div class="works-grid">
            <div 
              v-for="work in filteredWorks" 
              :key="work.id" 
              class="work-card"
              @click="goToWork(work)"
            >
              <div class="work-thumbnail">
                <img :src="work.cover" alt="作品封面" />
              </div>
              <div class="work-info">
                <div class="work-title">{{ work.title }}</div>
              </div>
            </div>
            <div v-if="filteredWorks.length === 0" class="empty-state">
              <p>暂无作品</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isLoggedIn = ref(false)
const currentUser = ref(null)
const profileUser = ref(null)
const activeTab = ref('submissions')
const works = ref([])

const filteredWorks = computed(() => {
  if (activeTab.value === 'home') {
    return [] // 主页暂时为空
  } else if (activeTab.value === 'submissions') {
    return works.value // 显示所有投稿
  } else {
    return works.value.filter(work => work.type === activeTab.value)
  }
})

onMounted(() => {
  // 检查是否已登录
  const loggedInUser = localStorage.getItem('currentUser')
  if (loggedInUser) {
    currentUser.value = JSON.parse(loggedInUser)
    isLoggedIn.value = true
  } else {
    isLoggedIn.value = false
  }

  // 加载用户信息
  loadUserProfile()
  
  // 加载作品
  loadWorks()
})

const loadUserProfile = () => {
  const username = route.params.username
  if (username) {
    // 从localStorage中查找用户
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]')
    const user = allUsers.find(u => u.username === username)
    if (user) {
      profileUser.value = {
        username: user.username,
        avatar: user.avatar || '/aka.jpg'
      }
    } else {
      // 如果找不到，使用当前登录用户
      profileUser.value = {
        username: username,
        avatar: '/aka.jpg'
      }
    }
  } else if (currentUser.value) {
    profileUser.value = {
      username: currentUser.value.username,
      avatar: currentUser.value.avatar || '/aka.jpg'
    }
  }
}

const loadWorks = () => {
  const username = route.params.username || (currentUser.value?.username)
  if (username) {
    const allWorks = JSON.parse(localStorage.getItem('works') || '[]')
    // 只显示该用户的作品
    works.value = allWorks.filter(work => work.author === username)
  }
}

const goToWork = (work) => {
  // 根据作品类型跳转到不同页面
  if (work.type === 'video') {
    router.push(`/video/${work.id}`)
  } else if (work.type === 'graphic') {
    router.push(`/graphic/${work.id}`)
  }
}

const goToHome = () => {
  router.push('/dashboard')
}

const goToLogin = () => {
  router.push('/login')
}

const goToProfile = () => {
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

.user-profile {
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

.profile-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 用户信息区域 */
.user-info-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #f0f0f0;
}

.user-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #e0e0e0;
  flex-shrink: 0;
}

.avatar-img-large {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder-large {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.username {
  font-size: 28px;
  font-weight: bold;
  color: #000;
}

/* 导航标签 */
.tabs-section {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
}

.tab-item {
  padding: 10px 20px;
  background-color: transparent;
  border: none;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 2px solid transparent;
  margin-bottom: -12px;
}

.tab-item:hover {
  color: #09147D;
}

.tab-item.active {
  color: #09147D;
  border-bottom-color: #DCE2FC;
  font-weight: bold;
}

/* 作品区域 */
.works-section {
  margin-top: 30px;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 30px;
}

.work-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.work-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.work-thumbnail {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background-color: #f0f0f0;
}

.work-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.work-info {
  padding: 15px;
}

.work-title {
  font-size: 16px;
  font-weight: bold;
  color: #000;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 20px;
  }
  
  .profile-wrapper {
    padding: 20px;
  }
  
  .works-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
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
  
  .tabs-section {
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>

