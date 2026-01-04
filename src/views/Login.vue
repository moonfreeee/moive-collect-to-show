<template>
  <div class="login-container">
    <div class="login-card">
      <!-- Logo (contains login text) -->
      <div class="logo">
        <img src="/login-logo.png" alt="影集 Logo" class="login-logo-img" />
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin">
        <div class="input-group" :class="{ error: loginError }">
          <input type="text" v-model="username" placeholder="用户名/邮箱" required />
        </div>
        <div class="input-group" :class="{ error: loginError }">
          <input type="password" v-model="password" placeholder="密码" required />
        </div>

        <!-- Forgot password -->
        <div class="forgot-password">
          <a href="#">忘记密码？</a>
        </div>

        <!-- Login button -->
        <button type="submit" class="login-btn">登录</button>

        <!-- Error message -->
        <p v-if="loginError" class="error-msg">用户名或密码错误</p>
      </form>

      <!-- Register link -->
      <div class="register-link">
        <p>还没有账号？<router-link to="/register">立即注册</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const loginError = ref(false)
const router = useRouter()

const handleLogin = () => {
  loginError.value = false

  // Read users from localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]')

  // Check if username and password match
  const user = users.find(u => u.username === username.value && u.password === password.value)

  if (user) {
    alert('登录成功！')
    router.push('/dashboard')  // Jump to blank dashboard page
  } else {
    loginError.value = true
  }
}
</script>

<style scoped>
/* Styles remain the same as before */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #BAC6F5;
  padding: 20px;
}

.login-card {
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

.login-logo-img {
  width: 300px;
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
  transition: border 0.3s;
}

.input-group.error input {
  border-color: red;
}

.forgot-password {
  text-align: right;
  margin-bottom: 30px;
}

.forgot-password a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 15px;
  background: #09147D;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.3s;
}

.login-btn:hover {
  background: #575CF2;
}

.error-msg {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

.register-link {
  margin-top: 30px;
  font-size: 14px;
  color: #666;
}

.register-link a {
  color: #09147D;
  text-decoration: none;
  font-weight: bold;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>