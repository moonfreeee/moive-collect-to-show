<template>
  <div class="video-detail">
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
        <button v-if="isLoggedIn" class="upload-btn">
          <span class="upload-icon">↑</span>
          上传作品
        </button>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- 左侧视频区域 -->
        <div class="video-section">
          <h1 class="video-title">{{ videoInfo.title || '视频标题处test1' }}</h1>
          <p class="video-author">作者名称: {{ videoInfo.author || 'test user' }}</p>
          <div class="video-player">
            <video 
              v-if="videoUrl" 
              :src="videoUrl" 
              controls 
              class="video-element"
              @error="handleVideoError"
            >
              您的浏览器不支持视频播放
            </video>
            <div v-else class="player-placeholder">
              <div class="player-logo">M</div>
            </div>
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isLoggedIn = ref(false)
const currentUser = ref(null)
const newComment = ref('')
const comments = ref([])
const videoInfo = ref({ title: '视频标题处test1', author: 'test user' })
const videoUrl = ref('')

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
  loadVideoInfo()
  
  // 加载评论数据
  loadComments()
})

const loadVideoInfo = async () => {
  const videoId = route.params.id
  if (videoId) {
    const allWorks = JSON.parse(localStorage.getItem('works') || '[]')
    const work = allWorks.find(w => w.id === parseInt(videoId))
    if (work) {
      videoInfo.value = {
        title: work.title,
        author: work.author,
        description: work.description
      }
      // 加载视频URL
      if (work.videoStored) {
        // 如果视频存储在IndexedDB中
        try {
          const { getVideoFromDB } = await import('@/utils/storage')
          const url = await getVideoFromDB(work.id)
          if (url) {
            videoUrl.value = url
          } else {
            videoUrl.value = '/演示视频自我介绍.mp4'
          }
        } catch (error) {
          console.error('加载视频失败:', error)
          videoUrl.value = '/演示视频自我介绍.mp4'
        }
      } else if (work.videoData) {
        // 兼容旧的base64格式
        videoUrl.value = work.videoData
      } else {
        // 否则使用演示视频
        videoUrl.value = '/演示视频自我介绍.mp4'
      }
    } else {
      // 如果没有找到作品，使用演示视频
      videoUrl.value = '/演示视频自我介绍.mp4'
    }
  } else {
    // 没有ID时使用演示视频
    videoUrl.value = '/演示视频自我介绍.mp4'
  }
}

const handleVideoError = () => {
  console.error('视频加载失败')
  alert('视频加载失败，请检查视频文件')
}

const loadComments = () => {
  // 从localStorage加载评论，如果没有则使用空数组
  const videoId = route.params.id || 'default'
  const storedComments = localStorage.getItem(`comments_${videoId}`)
  if (storedComments) {
    comments.value = JSON.parse(storedComments)
  } else {
    // 初始化一些测试评论
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
  const videoId = route.params.id || 'default'
  localStorage.setItem(`comments_${videoId}`, JSON.stringify(comments.value))
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

.video-detail {
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

/* 左侧视频区域 */
.video-section {
  background-color: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.video-title {
  font-size: 28px;
  font-weight: bold;
  color: #000;
  margin-bottom: 15px;
}

.video-author {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.video-player {
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.video-element {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #000;
}

.player-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
}

.player-logo {
  width: 80px;
  height: 80px;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: bold;
  color: #09147D;
  position: relative;
}

.player-logo::after {
  content: '▶';
  position: absolute;
  font-size: 24px;
  color: #09147D;
  left: 55%;
  top: 50%;
  transform: translate(-50%, -50%);
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
