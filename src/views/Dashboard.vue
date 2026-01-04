<template>
  <div class="dashboard">
    <!-- 顶部Header -->
    <header class="top-header">
      <div class="header-left">
        <img src="/logo.png" alt="影集 Logo" class="logo-img" />
        <span class="logo-text">影集</span>
      </div>
      <div class="header-center">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input type="text" placeholder="搜索作者、作品名称" class="search-input" />
        </div>
      </div>
      <div class="header-right">
        <div class="user-avatar">
          <div class="avatar-placeholder">👤</div>
        </div>
        <button class="upload-btn">
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
        <div v-for="item in contentItems" :key="item.id" class="content-card">
          <div class="card-thumbnail">
            <img src="/back.jpeg" alt="作品封面" />
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
import { ref } from 'vue'

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

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #000;
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
}

.avatar-placeholder {
  font-size: 24px;
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
  cursor: pointer;
}

.content-card:hover {
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