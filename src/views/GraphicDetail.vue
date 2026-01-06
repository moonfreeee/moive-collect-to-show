<template>
  <div class="graphic-detail">
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
        <button v-if="isLoggedIn" class="upload-btn" @click="goToUpload">
          <span class="upload-icon">↑</span>
          上传作品
        </button>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- 左侧内容区域 -->
        <div class="content-section">
          <!-- 封面 -->
          <div class="cover-section">
            <img :src="graphicInfo.cover || '/back.jpeg'" alt="封面" class="cover-image" />
          </div>

          <!-- 标题和作者 -->
          <div class="header-section">
            <h1 class="graphic-title">{{ graphicInfo.title || 'HI! 看这里! 欢迎各位大学生来到影集!' }}</h1>
            <div class="author-info">
              <img :src="graphicInfo.authorAvatar || '/头像.png'" alt="作者头像" class="author-avatar" />
              <div class="author-details">
                <div class="author-name">{{ graphicInfo.authorName || '影集官方' }}</div>
                <div class="publish-time">{{ graphicInfo.publishTime || '2026年1月6日 11:10' }}</div>
              </div>
            </div>
          </div>

          <!-- 正文内容 -->
          <div class="content-text">
            <p v-for="(paragraph, index) in contentParagraphs" :key="index">{{ paragraph }}</p>
          </div>

          <!-- 图片展示 -->
          <div v-if="graphicInfo.images && graphicInfo.images.length > 0" class="images-section">
            <img 
              v-for="(img, index) in graphicInfo.images" 
              :key="index"
              :src="img" 
              alt="作品图片" 
              class="content-image"
            />
          </div>
        </div>

        <!-- 右侧评论区域 -->
        <div class="comments-section">
          <h2 class="comments-title">评论区</h2>
          
          <!-- 评论列表 -->
          <div class="comments-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <div class="comment-avatar">
                <img v-if="comment.avatar" :src="comment.avatar" alt="用户头像" />
                <div v-else class="avatar-placeholder-small">👤</div>
              </div>
              <div class="comment-content">
                <div class="comment-author">{{ comment.author }}</div>
                <div class="comment-text">
                  {{ comment.text.length > 40 ? comment.text.substring(0, 40) + '...' : comment.text }}
                </div>
                <a v-if="comment.text.length > 40" href="#" class="view-reply-link">点击查看回复 ></a>
              </div>
            </div>
          </div>

          <!-- 发表评论 -->
          <div class="comment-form">
            <h3 class="form-title">发表评论</h3>
            <textarea 
              v-model="newComment" 
              placeholder="写下你的评论吧~" 
              class="comment-input"
              rows="4"
            ></textarea>
            <button @click="submitComment" class="submit-btn">发送</button>
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
const newComment = ref('')
const comments = ref([])
const graphicInfo = ref({
  title: 'HI! 看这里! 欢迎各位大学生来到影集!',
  author: '影集官方',
  authorName: '影集官方',
  authorAvatar: '/头像.png',
  cover: '/back.jpeg',
  content: '欢迎你们, 大学生。这里是属于你们的舞台。\n欢迎各位积极展示自己的作品哦, 期待你们的表现~',
  images: ['/nya.jpg'],
  publishTime: '2026年1月6日 11:10'
})

const contentParagraphs = computed(() => {
  if (!graphicInfo.value.content) return []
  return graphicInfo.value.content.split('\n').filter(p => p.trim())
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

  // 加载作品信息
  loadGraphicInfo()
  
  // 加载评论数据
  loadComments()
})

const loadGraphicInfo = async () => {
  const graphicId = route.params.id
  if (graphicId) {
    const allWorks = JSON.parse(localStorage.getItem('works') || '[]')
    // 支持字符串ID（如'official'）和数字ID
    const work = allWorks.find(w => {
      if (graphicId === 'official') {
        return w.id === 'official' || w.id === 'official'
      }
      return w.id === parseInt(graphicId) || w.id === graphicId
    })
    
    if (work && work.type === 'graphic') {
      let images = []
      let cover = '/back.jpeg'
      
      // 如果封面存储在IndexedDB中
      if (work.coverStored) {
        try {
          const { getCoverFromDB } = await import('@/utils/storage')
          const coverUrl = await getCoverFromDB(work.id)
          if (coverUrl) {
            cover = coverUrl
          }
        } catch (error) {
          console.error('加载封面失败:', error)
        }
      } else if (work.cover) {
        cover = work.cover
      }
      
      // 如果图片存储在IndexedDB中
      if (work.imagesStored && work.imageCount > 0) {
        try {
          const { getImagesFromDB } = await import('@/utils/storage')
          images = await getImagesFromDB(work.id) || []
        } catch (error) {
          console.error('加载图片失败:', error)
          images = []
        }
      } 
      // 兼容旧的 base64 格式
      else if (work.images && work.images.length > 0) {
        images = work.images
      }
      
      graphicInfo.value = {
        title: work.title,
        author: work.author,
        authorName: work.author,
        authorAvatar: work.authorAvatar || '/aka.jpg',
        cover: cover,
        content: work.content || '',
        images: images,
        publishTime: work.createdAt ? new Date(work.createdAt).toLocaleString('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : '2026年1月6日 11:10'
      }
    } else if (graphicId === 'official') {
      // 如果没有找到，使用默认的官方作品信息
      graphicInfo.value = {
        title: 'HI! 看这里! 欢迎各位大学生来到影集!',
        author: '影集官方',
        authorName: '影集官方',
        authorAvatar: '/头像.png',
        cover: '/back.jpeg',
        content: '欢迎你们, 大学生。这里是属于你们的舞台。\n欢迎各位积极展示自己的作品哦, 期待你们的表现~',
        images: ['/nya.jpg'],
        publishTime: '2026年1月6日 11:10'
      }
    }
  } else if (!graphicId) {
    // 没有ID时显示官方作品
    graphicInfo.value = {
      title: 'HI! 看这里! 欢迎各位大学生来到影集!',
      author: '影集官方',
      authorName: '影集官方',
      authorAvatar: '/头像.png',
      cover: '/back.jpeg',
      content: '欢迎你们, 大学生。这里是属于你们的舞台。\n欢迎各位积极展示自己的作品哦, 期待你们的表现~',
      images: ['/nya.jpg'],
      publishTime: '2026年1月6日 11:10'
    }
  }
}

const loadComments = () => {
  const graphicId = route.params.id || 'official'
  const storedComments = localStorage.getItem(`comments_graphic_${graphicId}`)
  if (storedComments) {
    comments.value = JSON.parse(storedComments)
  } else if (graphicId === 'official') {
    // 示例评论
    comments.value = [
      {
        id: 1,
        author: 'testuser 1',
        text: '测试用评论, redio check, load and clear',
        avatar: '/aka.jpg'
      }
    ]
    saveComments()
  }
}

const saveComments = () => {
  const graphicId = route.params.id || 'official'
  localStorage.setItem(`comments_graphic_${graphicId}`, JSON.stringify(comments.value))
}

const submitComment = () => {
  if (!newComment.value.trim()) {
    alert('请输入评论内容')
    return
  }

  if (!isLoggedIn.value) {
    alert('请先登录')
    router.push('/login')
    return
  }

  const comment = {
    id: Date.now(),
    author: currentUser.value?.username || '匿名用户',
    text: newComment.value.trim(),
    avatar: currentUser.value?.avatar || '/aka.jpg'
  }

  comments.value.push(comment)
  saveComments()
  newComment.value = ''
}

const goToLogin = () => {
  router.push('/login')
}

const goToUpload = () => {
  router.push('/upload')
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

.graphic-detail {
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

/* 主要内容区域 */
.main-content {
  padding: 40px 60px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 左侧内容区域 */
.content-section {
  background-color: #fff;
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.cover-section {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background-color: #f0f0f0;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-section {
  padding: 30px;
  border-bottom: 1px solid #f0f0f0;
}

.graphic-title {
  font-size: 32px;
  font-weight: bold;
  color: #000;
  margin-bottom: 20px;
  line-height: 1.4;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.author-details {
  flex: 1;
}

.author-name {
  font-size: 18px;
  font-weight: bold;
  color: #000;
  margin-bottom: 5px;
}

.publish-time {
  font-size: 14px;
  color: #666;
}

.content-text {
  padding: 30px;
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

.content-text p {
  margin-bottom: 15px;
}

.images-section {
  padding: 0 30px 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.content-image {
  width: 100%;
  border-radius: 8px;
  object-fit: contain;
}

/* 右侧评论区域 */
.comments-section {
  background-color: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}

.comments-title {
  font-size: 24px;
  font-weight: bold;
  color: #000;
  margin-bottom: 20px;
}

.comments-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 30px;
}

.comment-item {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.comment-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #e0e0e0;
}

.comment-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder-small {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.comment-content {
  flex: 1;
}

.comment-author {
  font-size: 16px;
  font-weight: bold;
  color: #000;
  margin-bottom: 8px;
}

.comment-text {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 8px;
}

.view-reply-link {
  font-size: 14px;
  color: #09147D;
  text-decoration: none;
}

.view-reply-link:hover {
  text-decoration: underline;
}

/* 评论表单 */
.comment-form {
  border-top: 1px solid #f0f0f0;
  padding-top: 20px;
}

.form-title {
  font-size: 18px;
  font-weight: bold;
  color: #000;
  margin-bottom: 15px;
}

.comment-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Noto Sans SC', sans-serif;
  resize: vertical;
  margin-bottom: 15px;
  outline: none;
}

.comment-input:focus {
  border-color: #09147D;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #09147D;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #575CF2;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }
  
  .comments-section {
    max-height: none;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 20px;
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

