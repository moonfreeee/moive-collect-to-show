<template>
  <div class="dashboard">
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
        <button v-if="isLoggedIn" class="upload-btn" @click="goToUpload">
          <span class="upload-icon">↑</span>
          上传作品
        </button>
      </div>
    </header>

    <!-- 导航栏 -->
    <nav class="main-nav">
      <router-link to="/dashboard" class="nav-item active">
        <span class="nav-icon">M</span>
        首页
      </router-link>
      <a href="#" class="nav-item">UI设计作品</a>
      <a href="#" class="nav-item">动画</a>
      <a href="#" class="nav-item">视频剪辑</a>
      <a href="#" class="nav-item">竞赛</a>
      <a href="#" class="nav-item">软件</a>
      <a href="#" class="nav-item">声音</a>
      <a href="#" class="nav-item">绘画</a>
      <button class="material-library-btn">素材库</button>
    </nav>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <h2 class="section-title">推荐</h2>
      <div class="content-grid">
        <div 
          v-for="item in contentItems" 
          :key="item.id" 
          class="content-card"
          :class="{ 'clickable': canPlayVideo(item.category) || canViewGraphic(item.category) }"
          @click="handleCardClick(item)"
        >
          <div class="card-thumbnail">
            <img :src="item.cover || '/back.jpeg'" alt="作品封面" />
          </div>
          <div class="card-info">
            <div class="card-title">
              <span class="content-icon">{{ item.icon }}</span>
              <span>{{ item.type }}: {{ item.title }}</span>
            </div>
            <div class="card-category">分类: {{ item.category }}</div>
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

const contentItems = ref([
  { id: 1, icon: '🎬', type: '动画', title: 'test001', category: '动画' },
  { id: 2, icon: '📷', type: '摄影', title: 'test001', category: '摄影' },
  { id: 3, icon: '🎨', type: 'UI设计', title: 'test001', category: 'UI设计' },
  { id: 4, icon: '🏆', type: '竞赛', title: 'test001', category: '竞赛' },
  { id: 5, icon: '💻', type: '软件', title: 'test001', category: '软件' },
  { id: 6, icon: '🖼️', type: '绘画', title: 'test001', category: '绘画' },
  { id: 7, icon: '✂️', type: '视频剪辑', title: 'test001', category: '剪辑' },
  { id: 8, icon: '🎵', type: '音乐', title: 'test001', category: '声音' }
])

onMounted(() => {
  // 检查是否已登录
  const loggedInUser = localStorage.getItem('currentUser')
  if (loggedInUser) {
    currentUser.value = JSON.parse(loggedInUser)
    isLoggedIn.value = true
  } else {
    isLoggedIn.value = false
  }
  
  // 初始化示例图文作品（影集官方）
  initOfficialGraphic()
  
  // 加载上传的作品
  loadWorks()
})

const initOfficialGraphic = () => {
  // 检查是否已存在官方作品
  const allWorks = JSON.parse(localStorage.getItem('works') || '[]')
  const hasOfficial = allWorks.some(w => w.id === 'official')
  
  if (!hasOfficial) {
    const officialWork = {
      id: 'official',
      type: 'graphic',
      title: 'HI! 看这里! 欢迎各位大学生来到影集!',
      content: '欢迎你们, 大学生。这里是属于你们的舞台。\n欢迎各位积极展示自己的作品哦, 期待你们的表现~',
      author: '影集官方',
      authorAvatar: '/头像.png',
      cover: '/back.jpeg',
      images: ['/nya.jpg'],
      tags: ['官方'],
      createdAt: new Date('2026-01-06T11:10:00').toISOString()
    }
    allWorks.push(officialWork)
    localStorage.setItem('works', JSON.stringify(allWorks))
  }
}

const loadWorks = () => {
  const allWorks = JSON.parse(localStorage.getItem('works') || '[]')
  // 如果有上传的作品，添加到内容列表中
  if (allWorks.length > 0) {
    const workItems = allWorks.map(work => {
      // 根据作品类型和标签确定分类
      let category = work.tags?.[0] || '未分类'
      // 如果是视频类型，确保分类正确
      if (work.type === 'video') {
        // 如果标签中包含剪辑、动画、摄影等，使用该标签作为分类
        if (work.tags && work.tags.some(tag => ['剪辑', '动画', '摄影'].includes(tag))) {
          category = work.tags.find(tag => ['剪辑', '动画', '摄影'].includes(tag))
        } else {
          category = '剪辑' // 默认分类为剪辑
        }
      }
      // 如果是图文类型，根据标签确定分类
      else if (work.type === 'graphic') {
        if (work.tags && work.tags.some(tag => ['UI设计', '绘画'].includes(tag))) {
          category = work.tags.find(tag => ['UI设计', '绘画'].includes(tag))
        } else if (work.id === 'official') {
          category = 'UI设计' // 官方作品默认显示在UI设计分类
        }
      }
      
      return {
        id: work.id,
        icon: work.type === 'video' ? '🎬' : work.type === 'software' ? '💻' : work.type === 'graphic' ? '🎨' : '🎵',
        type: work.type === 'video' ? '视频' : work.type === 'software' ? '软件' : work.type === 'graphic' ? '图文' : '音频',
        title: work.title,
        category: category,
        cover: work.cover,
        workType: work.type // 保存原始类型用于判断
      }
    })
    // 合并到现有内容中
    contentItems.value = [...contentItems.value, ...workItems]
  }
}

const canPlayVideo = (category) => {
  // 只有动画、摄影、视频剪辑分类可以播放视频
  return category === '动画' || category === '摄影' || category === '剪辑'
}

const canViewGraphic = (category) => {
  // 绘画和UI设计分类可以查看图文
  return category === '绘画' || category === 'UI设计'
}

const handleCardClick = (item) => {
  // 根据作品类型判断跳转
  if (item.workType === 'video') {
    // 视频类作品跳转到视频播放页面
    goToVideo(item.id)
  } else if (item.workType === 'graphic') {
    // 图文类作品跳转到图文展示页面
    goToGraphic(item.id)
  } else {
    // 其他类型根据分类判断（兼容测试数据）
    if (canPlayVideo(item.category)) {
      goToVideo(item.id)
    } else if (canViewGraphic(item.category)) {
      // 如果是UI设计或绘画分类的测试作品，跳转到官方图文
      if (item.id === 3 || item.id === 6) {
        goToGraphic('official')
      } else {
        goToGraphic(item.id)
      }
    }
  }
}

const goToLogin = () => {
  router.push('/login')
}

const goToUpload = () => {
  router.push('/upload')
}

const goToVideo = (id) => {
  router.push(`/video/${id}`)
}

const goToGraphic = (id) => {
  router.push(`/graphic/${id}`)
}

const goToProfile = () => {
  router.push(`/profile/${currentUser.value.username}`)
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard {
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

.upload-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #09147D;
  color: #fff;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.upload-btn:hover {
  background-color: #575CF2;
}

.upload-icon {
  font-size: 18px;
}

/* 导航栏 */
.main-nav {
  display: flex;
  align-items: center;
  padding: 15px 60px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  gap: 30px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  text-decoration: none;
  color: #666;
  font-size: 16px;
  border-radius: 20px;
  transition: all 0.3s;
}

.nav-item:hover {
  background-color: #f5f5f5;
  color: #09147D;
}

.nav-item.active {
  background-color: #DCE2FC;
  color: #09147D;
  font-weight: bold;
}

.nav-icon {
  font-weight: bold;
  font-size: 18px;
}

.material-library-btn {
  margin-left: auto;
  padding: 8px 20px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.material-library-btn:hover {
  background-color: #e0e0e0;
  color: #09147D;
}

/* 主要内容区域 */
.main-content {
  padding: 40px 60px;
}

.section-title {
  font-size: 28px;
  font-weight: bold;
  color: #000;
  margin-bottom: 30px;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.content-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.content-card.clickable {
  cursor: pointer;
}

.content-card.clickable:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-thumbnail {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: #f0f0f0;
}

.card-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-info {
  padding: 15px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #000;
  margin-bottom: 8px;
}

.content-icon {
  font-size: 18px;
}

.card-category {
  font-size: 14px;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: repeat(2, 1fr);
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
  
  .main-nav {
    padding: 10px 20px;
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .main-content {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>