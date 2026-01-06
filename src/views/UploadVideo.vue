<template>
  <div class="upload-video-page">
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
          <h1 class="section-title">视频投稿</h1>

          <!-- 上传视频 -->
          <div class="upload-section">
            <div class="upload-area" @click="triggerVideoUpload" @dragover.prevent @drop.prevent="handleVideoDrop">
              <input 
                ref="videoInput" 
                type="file" 
                accept="video/*" 
                @change="handleVideoSelect" 
                style="display: none"
              />
              <div class="upload-icon-large">☁️</div>
              <p class="upload-text">点击上传或拖拽视频至此区域</p>
              <button class="upload-video-btn" @click.stop="triggerVideoUpload">上传视频</button>
            </div>
            <p v-if="videoFile" class="file-name">{{ videoFile.name }}</p>
          </div>

          <!-- 视频封面 -->
          <div class="cover-section">
            <label class="section-label">视频封面:</label>
            <div class="cover-upload-area" @click="triggerCoverUpload">
              <input 
                ref="coverInput" 
                type="file" 
                accept="image/*" 
                @change="handleCoverSelect" 
                style="display: none"
              />
              <img v-if="coverPreview" :src="coverPreview" alt="封面预览" class="cover-preview" />
              <div v-else class="cover-placeholder">
                <img src="/back.jpeg" alt="默认封面" class="default-cover" />
                <p class="cover-text">点击上传视频封面</p>
              </div>
            </div>
          </div>

          <!-- 视频标题 -->
          <div class="form-group">
            <label class="section-label">视频标题设置:</label>
            <input 
              v-model="videoTitle" 
              type="text" 
              placeholder="请输入视频标题" 
              class="form-input"
            />
          </div>

          <!-- 视频简介 -->
          <div class="form-group">
            <label class="section-label">视频简介:</label>
            <textarea 
              v-model="videoDescription" 
              placeholder="请输入视频简介" 
              class="form-textarea"
              rows="4"
            ></textarea>
          </div>

          <!-- 作品分类 -->
          <div class="category-section">
            <label class="section-label">作品分类:</label>
            <div class="category-grid">
              <button 
                v-for="category in videoCategories" 
                :key="category"
                class="category-btn"
                :class="{ active: selectedCategory === category }"
                @click="selectedCategory = category"
              >
                {{ category }}
              </button>
            </div>
          </div>

          <!-- 内容标签 -->
          <div class="tags-section">
            <label class="section-label">
              <span>内容标签</span>
              <span class="tag-icon">◆</span>
            </label>
            <div class="tags-container">
              <div v-for="tag in tags" :key="tag" class="tag-item">
                <span class="tag-icon-small">{{ getTagIcon(tag) }}</span>
                <span>{{ tag }}</span>
              </div>
              <button class="add-tag-btn" @click="showAddTag = true">
                <span class="tag-icon-small">+</span>
                添加新标签
              </button>
            </div>
            <div v-if="showAddTag" class="add-tag-input">
              <input 
                v-model="newTag" 
                type="text" 
                placeholder="输入标签名称" 
                @keyup.enter="addTag"
                class="tag-input"
              />
              <button @click="addTag" class="confirm-tag-btn">确认</button>
              <button @click="cancelAddTag" class="cancel-tag-btn">取消</button>
            </div>
          </div>

          <!-- 下一步按钮 -->
          <button class="next-btn" @click="submitVideo" :disabled="!videoFile || !videoTitle || !selectedCategory">
            下一步
          </button>
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
const videoInput = ref(null)
const coverInput = ref(null)
const videoFile = ref(null)
const coverPreview = ref(null)
const videoTitle = ref('')
const videoDescription = ref('')
const selectedCategory = ref('')
const videoCategories = ['动画', '摄影', '视频剪辑', '游戏', '竞赛项目', '音乐', '声效', '其它']
const tags = ref([])
const showAddTag = ref(false)
const newTag = ref('')

onMounted(() => {
  // 检查是否已登录
  const loggedInUser = localStorage.getItem('currentUser')
  if (loggedInUser) {
    currentUser.value = JSON.parse(loggedInUser)
    isLoggedIn.value = true
  } else {
    isLoggedIn.value = false
    router.push('/login')
  }
})

const triggerVideoUpload = () => {
  videoInput.value?.click()
}

const handleVideoSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.type.startsWith('video/')) {
      videoFile.value = file
    } else {
      alert('请上传视频文件')
    }
  }
}

const handleVideoDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file && file.type.startsWith('video/')) {
    videoFile.value = file
  } else {
    alert('请上传视频文件')
  }
}

const triggerCoverUpload = () => {
  coverInput.value?.click()
}

const handleCoverSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      coverPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const getTagIcon = (tag) => {
  const iconMap = {
    '剪辑': '✂️',
    '动画': '▶️',
    'UI设计': '🎨',
    '绘画': '🖼️',
    '音乐': '🎵'
  }
  return iconMap[tag] || '🏷️'
}

const addTag = () => {
  if (newTag.value.trim() && !tags.value.includes(newTag.value.trim())) {
    tags.value.push(newTag.value.trim())
    newTag.value = ''
    showAddTag.value = false
  }
}

const cancelAddTag = () => {
  newTag.value = ''
  showAddTag.value = false
}

const submitVideo = async () => {
  if (!videoFile.value) {
    alert('请上传视频文件')
    return
  }
  
  if (!videoTitle.value || !videoTitle.value.trim()) {
    alert('请填写视频标题')
    return
  }

  // 获取当前用户
  const user = currentUser.value
  if (!user) {
    alert('请先登录')
    router.push('/login')
    return
  }

  // 检查文件大小（限制为100MB，超过则提示）
  const maxSize = 100 * 1024 * 1024 // 100MB
  if (videoFile.value.size > maxSize) {
    if (!confirm(`视频文件较大（${(videoFile.value.size / 1024 / 1024).toFixed(2)}MB），可能会影响加载速度。是否继续上传？`)) {
      return
    }
  }

  const workId = Date.now()

  // 使用IndexedDB存储视频文件
  let videoStored = false
  try {
    // 检查浏览器是否支持IndexedDB
    if (!window.indexedDB) {
      throw new Error('浏览器不支持IndexedDB')
    }
    
    const { saveVideoToDB } = await import('@/utils/storage')
    await saveVideoToDB(workId, videoFile.value)
    videoStored = true
  } catch (error) {
    console.error('保存视频到IndexedDB失败:', error)
    // 如果IndexedDB失败，询问用户是否继续（不存储视频文件）
    const continueWithoutVideo = confirm('视频文件存储失败，是否继续上传作品信息（视频文件将不会保存）？\n错误信息：' + error.message)
    if (!continueWithoutVideo) {
      return
    }
  }

  // 确保选择了分类
  if (!selectedCategory.value) {
    alert('请选择作品分类')
    return
  }

  // 创建标签数组，将分类放在第一位
  const finalTags = [selectedCategory.value, ...tags.value]

  // 创建作品对象
  const work = {
    id: workId,
    type: 'video',
    title: videoTitle.value.trim(),
    description: videoDescription.value.trim() || '',
    author: user.username,
    authorAvatar: user.avatar || '/aka.jpg',
    cover: coverPreview.value || '/back.jpeg',
    tags: finalTags,
    videoFile: videoFile.value.name,
    videoSize: videoFile.value.size,
    videoStored: videoStored, // 标记视频是否已存储到IndexedDB
    createdAt: new Date().toISOString()
  }

  // 保存作品到localStorage
  try {
    const works = JSON.parse(localStorage.getItem('works') || '[]')
    works.push(work)
    localStorage.setItem('works', JSON.stringify(works))
    
    // 跳转到上传成功页面
    router.push('/upload/success')
  } catch (error) {
    console.error('保存作品信息失败:', error)
    alert('保存作品信息失败：' + error.message)
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

.upload-video-page {
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

/* 上传视频区域 */
.upload-section {
  margin-bottom: 30px;
}

.upload-area {
  width: 100%;
  min-height: 300px;
  border: 2px dashed #ddd;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #f9f9f9;
}

.upload-area:hover {
  border-color: #09147D;
  background-color: #f0f0f0;
}

.upload-icon-large {
  font-size: 64px;
  margin-bottom: 20px;
}

.upload-text {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.upload-video-btn {
  padding: 12px 30px;
  background-color: #DCE2FC;
  color: #09147D;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-video-btn:hover {
  background-color: #09147D;
  color: #fff;
}

.file-name {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

/* 封面上传区域 */
.cover-section {
  margin-bottom: 30px;
}

.section-label {
  display: block;
  font-size: 16px;
  font-weight: bold;
  color: #000;
  margin-bottom: 15px;
}

.tag-icon {
  margin-left: 5px;
  color: #09147D;
}

.cover-upload-area {
  width: 100%;
  max-width: 500px;
  aspect-ratio: 16 / 9;
  border: 2px dashed #ddd;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  background-color: #f9f9f9;
}

.cover-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  position: relative;
}

.default-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5;
}

.cover-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  color: #666;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px 20px;
  border-radius: 8px;
}

/* 表单组 */
.form-group {
  margin-bottom: 30px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Noto Sans SC', sans-serif;
  outline: none;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #09147D;
}

.form-textarea {
  resize: vertical;
}

/* 作品分类区域 */
.category-section {
  margin-bottom: 30px;
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 15px;
}

.category-btn {
  padding: 12px 24px;
  background-color: #7C93F2;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-btn:hover {
  background-color: #6B82E0;
  transform: translateY(-2px);
}

.category-btn.active {
  background-color: #A77CF2;
  font-weight: bold;
}

/* 标签区域 */
.tags-section {
  margin-bottom: 30px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
}

.tag-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #f5f5f5;
  border-radius: 20px;
  font-size: 14px;
}

.tag-icon-small {
  font-size: 16px;
}

.add-tag-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: transparent;
  border: 1px dashed #ddd;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.add-tag-btn:hover {
  border-color: #09147D;
  color: #09147D;
}

.add-tag-input {
  display: flex;
  gap: 10px;
  align-items: center;
}

.tag-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.tag-input:focus {
  border-color: #09147D;
}

.confirm-tag-btn,
.cancel-tag-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.confirm-tag-btn {
  background-color: #09147D;
  color: #fff;
}

.confirm-tag-btn:hover {
  background-color: #575CF2;
}

.cancel-tag-btn {
  background-color: #f5f5f5;
  color: #666;
}

.cancel-tag-btn:hover {
  background-color: #e0e0e0;
}

/* 下一步按钮 */
.next-btn {
  display: block;
  margin: 40px auto 0;
  padding: 12px 40px;
  background-color: #fff;
  color: #000;
  border: 1px solid #000;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.next-btn:hover:not(:disabled) {
  background-color: #000;
  color: #fff;
}

.next-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
