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
        <p>OpenCC V{{ version }}</p>
        <p>
          由oVirt中文社区发布和维护，遵循MIT协议
          <br />
          http://www.cnovirt.com
          <br />
          MIT协议内容如下:(https://www.mit-license.org)
        </p>
        <p>
          The MIT License(MIT)
          <br />
          Copyright (c) 2020 oVirt中文社区
        </p>
        <p>
          Permission is hereby granted, free of charge, to any person obtaining
          a copy of this software and associated documentation files (the
          "Software"), to deal in the Software without restriction, including
          without limitation the rights to use, copy, modify, merge, publish,
          distribute, sublicense, and/or sell copies of the Software, and to
          permit persons to whom the Software is furnished to do so, subject to
          the following conditions:
        </p>
        <p>
          The above copyright notice and this permission notice shall be
          included in all copies or substantial portions of the Software.
        </p>
        <p>
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
          EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
          IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
          CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
          TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
          SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        </p>
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
import { getVersion } from '@/../main/modules/system_info'

export default {
  name: 'login-page',
  data() {
    return {
      faceImg: require('@/images/login_qrcode_white.png'),
      version: '0.0.0',
    }
  },
  methods: {
    // 关闭当前窗口
    clickExitWin() {
      console.log('clickExitWin-about')
      loginipc.send('set-exit-win', { name: 'about' })
    },
    // 最小化
    zoomClient() {
      loginipc.send('zoom-client', true)
    },
  },
  mounted() {
    // 读取文件本版号
    this.version = getVersion()
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
  width: 430px;
  height: 240px;
}
div.main div.content {
  width: 410px;
  height: 170px;

  margin: 10px;
  font-size: 13px;
  line-height: 12px;
  color: rgba(0, 0, 0, 0.6);

  overflow: hidden;
  overflow-y: auto;
  background-color: transparent;
}
div.main div.content p {
  width: 390px;
  font-family: 'Microsoft YaHei UI', 'Courier New', Courier, monospace;
}

/* 主界面 -- 内容 : 滚动条 */
div.content::-webkit-scrollbar {
  background-color: #f5f5f5;
  width: 10px;
}
div.content::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: #f5f5f5;
}
div.content::-webkit-scrollbar-thumb {
  /* height: 20px; */
  border-radius: 10px;
  background-color: rgba(150, 150, 150, 0.5);
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
