import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'  // 你的着陆页
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'  // 新增
import Dashboard from '../views/Dashboard.vue'  // 新增空白主页
import VideoDetail from '../views/VideoDetail.vue'  // 作品播放页面
import Upload from '../views/Upload.vue'  // 上传作品页面
import UploadVideo from '../views/UploadVideo.vue'  // 视频上传页面
import UploadSuccess from '../views/UploadSuccess.vue'  // 上传成功页面
import ManageWorks from '../views/ManageWorks.vue'  // 作品管理页面

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard },  // 登录成功后跳转
  { path: '/video/:id?', component: VideoDetail },  // 作品播放页面
  { path: '/upload', component: Upload },  // 上传作品页面
  { path: '/upload/video', component: UploadVideo },  // 视频上传页面
  { path: '/upload/success', component: UploadSuccess },  // 上传成功页面
  { path: '/manage', component: ManageWorks },  // 作品管理页面
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router