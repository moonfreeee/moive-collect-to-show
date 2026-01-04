import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'  // 你的着陆页
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'  // 新增
import Dashboard from '../views/Dashboard.vue'  // 新增空白主页

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/dashboard', component: Dashboard },  // 登录成功后跳转
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router