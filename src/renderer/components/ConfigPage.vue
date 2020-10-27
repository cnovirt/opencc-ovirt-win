<template>
  <div class="config-body" v-loading="loading">
    <div class="main">
      <div class="main-left">
        <ul>
          <li></li>
          <li :class="{ active: isCenterIp }" @click="gotoSubPage('centerip')">
            云中心
          </li>
          <li :class="{ active: isSetHosts }" @click="gotoSubPage('sethosts')">
            域名映射
          </li>
        </ul>
      </div>
      <div class="main-right">
        <div class="menu-bar">
          <img src="../images/login_menu_close.png" @click="clickExitWin" />
          <img src="../images/login_menu_zoom.png" @click="zoomClient" />
        </div>
        <div class="sub-win">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="line"></div>
      <el-button type="primary" @click="clickExitWin">返回</el-button>
    </div>
  </div>
</template>

<script>
const configipc = require('electron').ipcRenderer // 定义信号与槽函数接收者

export default {
  name: 'login-page',
  data() {
    return {
      isCenterIp: true,
      isSetHosts: false,
      // 界面加载控制
      loading: false,
    }
  },
  methods: {
    // 关闭当前窗口
    clickExitWin() {
      console.log('clickExitWin-about')
      configipc.send('set-exit-win', { name: 'configPage' })
    },
    // 最小化
    zoomClient() {
      configipc.send('zoom-client', true)
    },
    // 子界面 : 云中心, 域名映射
    gotoSubPage(event) {
      console.log('gotoSubPage', event)

      if (event == 'sethosts') {
        this.isCenterIp = false
        this.isSetHosts = true
        this.$router.push({ path: '/config-page/sethosts' })
      } else {
        this.isCenterIp = true
        this.isSetHosts = false
        this.$router.push({ path: '/config-page/centerip' })
      }
    },
  },
}
</script>

<style scoped>
.config-body{
  width: 430px;
  height: 330px;
}
/* 主体内容 */
div.main {
  height: 280px;
  width: 430px;
}
/* 主体内容 -- 左边导航 */
div.main div.main-left {
  float: left;
  width: 65px;
  height: 280px;
  background-color: rgb(230, 240, 255);
}
div.main div.main-left ul {
  padding-left: 0;
}
div.main div.main-left ul li {
  height: 40px;
  font-size: 13px;
  font-weight: lighter;
  line-height: 40px;
  text-align: center;
  list-style: none;
}
div.main div.main-left ul li:hover {
  cursor: pointer;
}
div.main div.main-left ul li.active {
  background-color: white;
  color: skyblue;
  border-left: 2px solid blue;
}

/* 主体内容 -- 右边 */
div.main div.main-right {
  float: right;
  width: 350px;
  height: 280px;
}
/* 主体内容 -- 右边, 子窗口 */
div.main div.main-right div.sub-win {
  width: 350px;
  height: 240px;
  padding: 0;
}
/* 主体内容 -- 右边, 功能条 */
div.menu-bar {
  width: 350px;
  height: 40px;

  -webkit-app-region: drag;
}
div.menu-bar img {
  float: right;
  width: 16px;
  height: 17px;
  margin-top: 10px;
  margin-right: 13px;
  cursor: pointer;

  -webkit-app-region: no-drag;
}

/* 底部布局 */
div.footer {
  height: 50px;
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
