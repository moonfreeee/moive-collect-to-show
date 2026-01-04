<template>
  <div class="manage-works-page">
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
          <router-link to="/upload" class="nav-item">投稿</router-link>
          <router-link to="/manage" class="nav-item active">管理作品</router-link>
          <a href="#" class="nav-item">评论管理</a>
        </nav>

        <!-- 右侧内容区 -->
        <div class="content-area">
          <h1 class="section-title">作品管理</h1>

          <!-- 分类标签 -->
          <div class="tabs">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              class="tab-item"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              {{ tab.name }}
            </button>
          </div>

          <!-- 作品列表 -->
          <div class="works-grid">
            <div 
              v-for="work in filteredWorks" 
              :key="work.id" 
              class="work-card"
              @click="goToVideo(work.id)"
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
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(false)
const currentUser = ref(null)
const activeTab = ref('video')
const works = ref([])

const tabs = [
  { id: 'video', name: '视频稿件' },
  { id: 'graphic', name: '图文稿件' },
  { id: 'software', name: '软件稿件' },
  { id: 'audio', name: '音频稿件' }
]

const filteredWorks = computed(() => {
  return works.value.filter(work => work.type === activeTab.value)
})

onMounted(() => {
  // 检查是否已登录
  const loggedInUser = localStorage.getItem('currentUser')
  if (loggedInUser) {
    currentUser.value = JSON.parse(loggedInUser)
    isLoggedIn.value = true
    
    // 加载当前用户的作品
    loadWorks()
  } else {
    isLoggedIn.value = false
    router.push('/login')
  }
})

const loadWorks = () => {
  const allWorks = JSON.parse(localStorage.getItem('works') || '[]')
  // 只显示当前用户的作品
  works.value = allWorks.filter(work => work.author === currentUser.value.username)
}

const goToVideo = (id) => {
  router.push(`/video/${id}`)
}

const goToHome = () => {
  router.push('/dashboard')
}

const goToLogin = () => {
  router.push('/login')
}

const handleAvatarClick = () => {
  console.log('点击了用户头像')
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.manage-works-page {
  min-height: 100vh;
  background-color: #DCE2FC;
  font-family: 'Noto Sans SC', sans-serif;
}

/* 顶部Header - 与Upload.vue相同 */
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

.section-title {
  font-size: 28px;
  font-weight: bold;
  color: #000;
  margin-bottom: 30px;
}

/* 分类标签 */
.tabs {
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

/* 作品网格 */
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
  
  .content-wrapper {
    flex-direction: column;
  }
  
  .sidebar-nav {
    width: 100%;
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
}
</style>
