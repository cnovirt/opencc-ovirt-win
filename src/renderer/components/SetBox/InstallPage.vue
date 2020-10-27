<template>
  <div class="login-body">
    <div class="menu-bar">
      <img src="../../images/login_menu_icon.png" class="bar-left" />
      <img src="../../images/login_menu_close.png" @click="closeClient" />
      <img src="../../images/login_menu_zoom.png" @click="zoomClient" />
      <img src="../../images/login_menu_set.png" @click="setClient" />
    </div>
    <div class="main">
      <img v-bind:src="faceImg" />
      <br />
      <el-button type="primary" @click="backLoginPage">返 回</el-button>
    </div>
    <div class="footer">
      <div class="ahref">
        <span @click="loginRegister">注册帐号</span>
        <span>|</span>
        <span @click="loginHelper">新手指引</span>
      </div>
      <div class="imgto">
        <img src="../../images/login_face_user.png" @click="loginFaceUser" />
      </div>
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
    // 关闭客户端
    closeClient() {
      this.$confirm('确定关闭客户端?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '成功退出!',
          })
          // 退出客户端信号
          loginipc.send('close-client', true)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消退出',
          })
        })
    },
    // 最小化
    zoomClient() {
      loginipc.send('zoom-client', true)
    },
    // 设置界面
    setClient() {
      loginipc.send('set-client', true)
    },
    // 注册帐号
    loginRegister() {
      loginipc.send('login-register', true)
    },
    // 新手指引
    loginHelper() {
      loginipc.send('login-helper', true)
    },
    // 登录 -- 刷脸
    loginFaceUser() {
      loginipc.send('login-face-user', true)
      this.$router.push({ path: '/login-face-user-page' })

    },
    // 返回登录界面
    backLoginPage() {
      console.log('backLoginPage')
      this.$router.push({ path: '/login-page' })
    },
  },
  mounted() {},
}
</script>

<style scoped>
/* *{ border: 1px solid pink;} */
.login-body {
  /* background-color: skyblue; */
  background-image: url('../../images/login_other_bg.jpg');
  /* border: 1px solid pink; */
}
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
div.menu-bar img.bar-left {
  float: left;
  width: 30px;
  height: 30px;
  margin-left: 15px;
}

/* 主体内容 */
div.main {
  height: 250px;
  width: 430px;
}
div.main img {
  margin-top: 30px;
  margin-left: 150px;
}
div.main button.el-button {
  width: 230px;
  height: 30px;
  font-size: 15px;
  font-weight: bold;
  line-height: 5px;
  background-color: rgb(48, 161, 253);
  margin-top: 40px;
  margin-left: 100px;
}

/* 底部布局 */
div.footer {
  height: 40px;
  color: white;
}
.ahref span {
  font-size: 12px;
  float: left;
  color: white;
  line-height: 1.2;
  margin-left: 5px;
  margin-top: 20px;
  cursor: pointer;
}
.imgto {
  float: right;
}
.imgto img {
  margin-right: 10px;
  margin-top: 8px;
  cursor: pointer;
}
</style>
