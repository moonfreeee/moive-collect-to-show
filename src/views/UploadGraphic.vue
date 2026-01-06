<template>
  <div class="upload-graphic-page">
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
          <h1 class="section-title">图文投稿</h1>

          <!-- 封面上传 -->
          <div class="cover-section">
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
                <p class="cover-text">点击上传封面</p>
              </div>
            </div>
          </div>

          <!-- 标题输入 -->
          <div class="form-group">
            <input 
              v-model="graphicTitle" 
              type="text" 
              placeholder="在此输入标题:" 
              class="title-input"
            />
          </div>

          <!-- 正文输入 -->
          <div class="form-group">
            <textarea 
              v-model="graphicContent" 
              placeholder="在此输入正文:" 
              class="content-textarea"
              rows="10"
            ></textarea>
          </div>

          <!-- 图片上传区域 -->
          <div class="image-upload-section">
            <button class="image-upload-btn" @click="triggerImageUpload">
              <span class="image-icon">🏔️</span>
              <span>图片上传</span>
            </button>
            <input 
              ref="imageInput" 
              type="file" 
              accept="image/*" 
              multiple
              @change="handleImageSelect" 
              style="display: none"
            />
            <div v-if="uploadedImages.length > 0" class="uploaded-images">
              <div v-for="(img, index) in uploadedImages" :key="index" class="image-item">
                <img :src="img" alt="上传的图片" />
                <button class="remove-image-btn" @click="removeImage(index)">×</button>
              </div>
            </div>
          </div>

          <!-- 作品分类 -->
          <div class="category-section">
            <label class="section-label">作品分类:</label>
            <div class="category-grid">
              <button 
                v-for="category in graphicCategories" 
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
          <button class="next-btn" @click="submitGraphic" :disabled="!graphicTitle || !graphicTitle.trim() || !selectedCategory">
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
const coverInput = ref(null)
const imageInput = ref(null)
const coverPreview = ref(null)
const graphicTitle = ref('')
const graphicContent = ref('')
const uploadedImages = ref([])
const selectedCategory = ref('')
const graphicCategories = ['UI设计', '绘画', '其它']
const tags = ref([])
const showAddTag = ref(false)
const newTag = ref('')

onMounted(() => {
  const loggedInUser = localStorage.getItem('currentUser')
  if (loggedInUser) {
    currentUser.value = JSON.parse(loggedInUser)
    isLoggedIn.value = true
  } else {
    isLoggedIn.value = false
    router.push('/login')
  }
})

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

const triggerImageUpload = () => {
  imageInput.value?.click()
}

const handleImageSelect = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        uploadedImages.value.push(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  })
}

const removeImage = (index) => {
  uploadedImages.value.splice(index, 1)
}

const getTagIcon = (tag) => {
  const iconMap = {
    'UI设计': '🎨',
    '绘画': '🖼️',
    '设计': '✨'
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

const submitGraphic = async () => {
  if (!graphicTitle.value || !graphicTitle.value.trim()) {
    alert('请填写标题')
    return
  }

  // 确保选择了分类
  if (!selectedCategory.value) {
    alert('请选择作品分类')
    return
  }

  const user = currentUser.value
  if (!user) {
    alert('请先登录')
    router.push('/login')
    return
  }

  const workId = Date.now()

  // 使用IndexedDB存储图片
  let imagesStored = false
  if (uploadedImages.value.length > 0) {
    try {
      // 检查浏览器是否支持IndexedDB
      if (!window.indexedDB) {
        throw new Error('浏览器不支持IndexedDB')
      }
      
      const { saveImagesToDB } = await import('@/utils/storage')
      await saveImagesToDB(workId, uploadedImages.value)
      imagesStored = true
    } catch (error) {
      console.error('保存图片到IndexedDB失败:', error)
      // 如果IndexedDB失败，询问用户是否继续（不存储图片）
      const continueWithoutImages = confirm('图片存储失败，是否继续上传作品信息（图片将不会保存）？\n错误信息：' + error.message)
      if (!continueWithoutImages) {
        return
      }
    }
  }

  // 创建标签数组，将分类放在第一位
  const finalTags = [selectedCategory.value, ...tags.value]

  const work = {
    id: workId,
    type: 'graphic',
    title: graphicTitle.value.trim(),
    content: graphicContent.value.trim(),
    author: user.username,
    authorAvatar: user.avatar || '/aka.jpg',
    cover: coverPreview.value || '/back.jpeg',
    imageCount: uploadedImages.value.length, // 保存图片数量
    imagesStored: imagesStored, // 标记图片是否已存储到IndexedDB
    tags: finalTags,
    createdAt: new Date().toISOString()
  }

  try {
    const works = JSON.parse(localStorage.getItem('works') || '[]')
    works.push(work)
    localStorage.setItem('works', JSON.stringify(works))
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

.upload-graphic-page {
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

/* 封面上传区域 */
.cover-section {
  margin-bottom: 30px;
}

.cover-upload-area {
  width: 100%;
  max-width: 800px;
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

.title-input,
.content-textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  font-family: 'Noto Sans SC', sans-serif;
  outline: none;
  transition: border-color 0.3s;
}

.title-input:focus,
.content-textarea:focus {
  border-color: #09147D;
}

.content-textarea {
  resize: vertical;
  min-height: 200px;
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

/* 图片上传区域 */
.image-upload-section {
  margin-bottom: 30px;
}

.image-upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.image-upload-btn:hover {
  border-color: #09147D;
  color: #09147D;
}

.image-icon {
  font-size: 20px;
}

.uploaded-images {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 20px;
}

.image-item {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: rgba(255, 0, 0, 0.8);
  color: #fff;
  border: none;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-image-btn:hover {
  background-color: rgba(255, 0, 0, 1);
}

/* 标签区域 */
.tags-section {
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

