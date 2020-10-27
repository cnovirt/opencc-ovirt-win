<template>
  <div class="login-body">
    <div class="menu-bar">
      <img src="../../images/login_menu_icon.png" class="bar-left" />
      <span class="bar-name">关于</span>
      <img src="../../images/login_menu_close.png" @click="clickExitWin" />
      <img src="../../images/login_menu_zoom.png" @click="zoomClient" />
    </div>
    <div class="main">
      <img src="../../images/set_box_win_bg.jpg" alt="" />
      <div class="content">
        <p>OpenCC V1.1.0 (2020930)</p>
        <p>由oVirt中文社区发布和维护，遵循MIT协议</p>
        <p>http://www.cnovirt.com</p>
        <p>MIT协议内容如下:(https://www.mit-license.org)</p>
        <p>The MIT License(MIT)</p>
        <p>Copyright &copy; 2020 &lt;copyright holders&gt;</p>
        <p>xxx</p>
      </div>
    </div>
    <div class="footer">
      <div class="line"></div>
      <el-button type="primary" @click="clickExitWin">确定</el-button>
    </div>
  </div>
</template>

<script>
const loginipc = require('electron').ipcRenderer // 定义信号与槽函数接收者

export default {
  name: 'login-page',
  data() {
    return {
      faceImg: require('@/images/login_qrcode_white.png'),
    }
  },
  methods: {
    // 关闭当前窗口
    clickExitWin() {
      console.log('clickExitWin-about')
      loginipc.send('set-exit-win', {'name':'about'})
    },
    // 最小化
    zoomClient() {
      loginipc.send('zoom-client', true)
    },
  },
}
</script>

<style scoped>
/* 功能条 */
div.menu-bar {
  width: 430px;
  height: 40px;
}
div.menu-bar img {
  float: right;
  width: 16px;
  height: 17px;
  margin-top: 10px;
  margin-right: 13px;
  cursor: pointer;
}
div.menu-bar span.bar-name {
  float: left;
  line-height: 20px;
  font-weight: lighter;
  margin-top: 10px;
  color: rgba(0, 0, 0, 0.6);
}
div.menu-bar img.bar-left {
  float: left;
  width: 20px;
  height: 20px;
  margin-left: 15px;
}

/* 主体内容 */
div.main {
  height: 240px;
  width: 430px;
}
div.main div.content {
  margin-top: 10px;
  margin-left: 10px;
  font-size: 13px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.6);
}

/* 底部布局 */
div.footer {
  height: 40px;
  color: white;
}
div.footer div.line {
  height: 0;
  width: 430px;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
}
div.footer button.el-button {
  float: right;
  width: 50px;
  height: 25px;
  padding: 0;
  font-size: 13px;
  line-height: 13px;
  margin-top: 13px;
  margin-right: 10px;
  border-radius: 2px;
  background-color: #1890ff;
}
</style>
