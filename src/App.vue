<template>
  <router-view />
</template>

<script setup>
// 无需任何逻辑
</script>

<style>
/* 可以保留全局样式，比如背景渐变 */
body {
  margin: 0;
  background: linear-gradient(to bottom, 
    rgb(180, 178, 214) 0%, 
    rgb(162, 153, 201) 33%, 
    rgb(153, 143, 194) 66%, 
    rgb(0, 0, 0) 100%);
}
</style>