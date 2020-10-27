<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'ws',
}
</script>

<style>
html,
body {
  margin: 0;
}
/* CSS */
#app {
  /* 禁用鼠标框选 */
  user-select: none;
  border: 1px solid #d7d7d7;
}

/* 全局样式设置: message 消息提示 */
div.el-message {
  user-select: none;
  min-width: 250px;
  width: 250px;
}
/* 全局样式设置: message 消息提示 */
div.el-message-box {
  user-select: none;
  width: 250px;
}
</style>
