<template>
  <div class="register-container">
    <div class="register-card">
      <!-- Logo（包含注册字样） -->
      <div class="logo">
        <img src="/sign in.png" alt="影集注册 Logo" class="register-logo-img" />
      </div>

      <!-- 表单 -->
      <form @submit.prevent="handleRegister">
        <div class="input-group" :class="{ error: usernameError }">
          <input type="text" v-model="username" placeholder="用户名/邮箱" required />
        </div>
        <div class="input-group" :class="{ error: passwordError }">
          <input type="password" v-model="password" placeholder="密码" required />
        </div>
        <div class="input-group" :class="{ error: confirmError }">
          <input type="password" v-model="confirmPassword" placeholder="确认密码" required />
        </div>

        <!-- 错误提示 -->
        <p v-if="registerError" class="error-msg">{{ registerError }}</p>

        <!-- 注册按钮 -->
        <button type="submit" class="register-btn">注册</button>
      </form>

      <!-- 登录链接 -->
      <div class="login-link">
        <p>已有账号？<router-link to="/login">立即登录</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const usernameError = ref(false)
const passwordError = ref(false)
const confirmError = ref(false)
const registerError = ref('')
const router = useRouter()

// 初始化测试账号（只在第一次运行时添加）
onMounted(() => {
  let users = JSON.parse(localStorage.getItem('users') || '[]')
  // 检查是否已有测试账号
  const hasTestUser = users.some(u => u.username === 'test')
  if (!hasTestUser) {
    users.push({ 
      username: 'test', 
      password: '123456',
      avatar: '/aka.jpg'  // 测试账号默认头像
    })
    localStorage.setItem('users', JSON.stringify(users))
  } else {
    // 如果测试账号已存在但没有头像，添加默认头像
    const testUser = users.find(u => u.username === 'test')
    if (testUser && !testUser.avatar) {
      testUser.avatar = '/aka.jpg'
      localStorage.setItem('users', JSON.stringify(users))
    }
  }
})

const handleRegister = () => {
  usernameError.value = false
  passwordError.value = false
  confirmError.value = false
  registerError.value = ''

  if (!username.value) {
    usernameError.value = true
    registerError.value = '请输入用户名'
    return
  }
  if (password.value.length < 6) {
    passwordError.value = true
    registerError.value = '密码至少6位'
    return
  }
  if (password.value !== confirmPassword.value) {
    confirmError.value = true
    registerError.value = '两次密码不一致'
    return
  }

  // 检查用户名是否已存在
  let users = JSON.parse(localStorage.getItem('users') || '[]')
  if (users.some(u => u.username === username.value)) {
    usernameError.value = true
    registerError.value = '用户名已存在'
    return
  }

  // 保存新账号，设置默认头像
  users.push({ 
    username: username.value, 
    password: password.value,
    avatar: '/aka.jpg'  // 新用户默认头像
  })
  localStorage.setItem('users', JSON.stringify(users))
  alert('注册成功！请登录')
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #BAC6F5;
  padding: 20px;
}

.register-card {
  background: white;
  padding: 30px 50px 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.logo {
  margin-bottom: 40px;
}

.register-logo-img {
  width: 300px;  /* 根据 sign in.png 调整 */
  height: auto;
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
}

.input-group input {
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 50px;
  font-size: 16px;
}

.input-group.error input {
  border-color: red;
}

.register-btn {
  width: 100%;
  padding: 15px;
  background: #09147D;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 18px;
  cursor: pointer;
}

.register-btn:hover {
  background: #575CF2;
}

.error-msg {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

.login-link {
  margin-top: 30px;
  font-size: 14px;
  color: #666;
}

.login-link a {
  color: #09147D;
  text-decoration: none;
  font-weight: bold;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>