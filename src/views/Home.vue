<template>
  <div id="app">
   <header>
   <div class="logo">
    <!-- 用图片替换文字 M -->
    <img src="/logo.png" alt="影集 Logo" class="logo-img" />
  </div>
</header>

    <main>
      <h1 class="main-title">影集数字展示平台</h1>
      <p class="subtitle">大学生的专属共享平台</p>

    <div class="film-carousel">
  <div class="carousel-track">
    <div class="carousel-item"><img src="/aka.jpg" alt="作品示例" /></div>
    <div class="carousel-item"><img src="/aka.jpg" alt="作品示例" /></div>
    <div class="carousel-item"><img src="/aka.jpg" alt="作品示例" /></div>
    <div class="carousel-item"><img src="/aka.jpg" alt="作品示例" /></div>
    <div class="carousel-item"><img src="/aka.jpg" alt="作品示例" /></div>
    <div class="carousel-item"><img src="/aka.jpg" alt="作品示例" /></div>
    <div class="carousel-item"><img src="/aka.jpg" alt="作品示例" /></div>
    <div class="carousel-item"><img src="/aka.jpg" alt="作品示例" /></div>
    <div class="carousel-item"><img src="/aka.jpg" alt="作品示例" /></div>
    <div class="carousel-item"><img src="/aka.jpg" alt="作品示例" /></div>
  </div>
</div>

      <div class="buttons">
  <div class="buttons">
  <button class="btn btn-join" @click="goToLogin">即刻加入</button>
  <button class="btn btn-enter" @click="goToDashboard">进入主页</button>
</div>
</div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;  /* 新增：垂直居中所有子元素 */
  background: linear-gradient(to bottom, 
    rgb(180, 178, 214) 0%, 
    rgb(162, 153, 201) 33%, 
    rgb(153, 143, 194) 66%, 
    rgb(0, 0, 0) 100%);
  color: #fff;
  font-family: 'Noto Sans SC', sans-serif;
  padding: 80px 20px 40px;  /* 上内边距留给 Logo，避免被居中影响 */
}

header {
  position: absolute;
  top: 40px;
  left: 60px;
}

.logo {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.logo {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.logo-img {
  width: 150px;     /* 修改图片的大小尺寸 */
  height: auto;     /* 保持图片比例不失真 */
  /* margin-right: 15px; */  /* 注释掉备用，因为暂时已经没有文字了 */
}



.main-title {
  margin-top: 80px;
  font-size: 48px;
  text-align: center;
  background: linear-gradient(to right, rgb(13, 33, 122), rgb(224, 220, 220));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.subtitle {
  margin-top: 20px;
  font-size: 28px;
  color: #000;
  text-align: center;
}

.film-carousel {
  margin: 80px auto;
  width: 90%;
  max-width: 1200px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  padding: 40px 0;
  border-radius: 10px;
}

.carousel-track {
  display: flex;
  animation: scroll 30s linear infinite;
}

.carousel-item {
  min-width: 300px;
  margin: 0 15px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}

.carousel-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.buttons {
  margin-top: 60px;
  display: flex;
  gap: 40px;
}

.btn {
  padding: 15px 40px;
  font-size: 24px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: 'AlimamaKnifeBlade', sans-serif;
}

.btn-join {
  background: #000;
  color: #fff;
}

.btn-enter {
  background: #fff;
  color: #000;
}

.btn:hover {
  transform: scale(1.05);
}
</style>