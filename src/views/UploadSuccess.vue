<template>
  <div class="upload-success-page">
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
          <div class="success-content">
            <div class="success-icon">✓</div>
            <h1 class="success-title">上传成功</h1>
            <button class="back-home-btn" @click="goToHome">返回首页</button>
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

onMounted(() => {
  const loggedInUser = localStorage.getItem('currentUser')
  if (loggedInUser) {
    currentUser.value = JSON.parse(loggedInUser)
    isLoggedIn.value = true
  } else {
    isLoggedIn.value = false
  }
})

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

.upload-success-page {
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
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-content {
  text-align: center;
}

.success-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #4CAF50;
  color: #fff;
  font-size: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
}

.success-title {
  font-size: 36px;
  font-weight: bold;
  color: #000;
  margin-bottom: 40px;
}

.back-home-btn {
  padding: 15px 40px;
  background-color: #DCE2FC;
  color: #09147D;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.back-home-btn:hover {
  background-color: #09147D;
  color: #fff;
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
