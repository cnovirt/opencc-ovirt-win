<template>
  <div class="login-body">
    <div class="menu-bar">
      <img src="../images/login_menu_close.png" @click="closeClient" />
      <img src="../images/login_menu_zoom.png" @click="zoomClient" />
      <img src="../images/login_menu_set.png" @click="setClient" />
    </div>
    <div class="main">
      <div class="main-left">
        <!-- 用户头像 -->
        <!-- <img :src="login_user_img" /> -->
        <img src="../images/login_user.png" />
      </div>
      <div class="main-right">
        <!-- logo图标 -->
        <div class="login-logo">
          <img src="../images/login_logo.png" />
        </div>
        <!-- 表单 -->
        <el-form :model="form" ref="form">
          <!-- 表单 : username -->
          <el-input
            v-model="form.username"
            :class="[{ usernamered: usernamered }]"
          >
            <i class="el-icon-user el-input__icon" slot="prefix"></i>
          </el-input>

          <el-input
            v-model="form.password"
            type="password"
            :class="[{ passwdred: passwdred }]"
          >
            <i class="el-icon-lock el-input__icon" slot="prefix"></i>
            <i class="el-icon-view el-input__icon" slot="suffix"></i>
          </el-input>

          <el-select
            v-model="form.centerip"
            placeholder="请选择中心"
            :class="[{ centeripred: centeripred }]"
          >
            <i class="el-icon-house el-input__icon" slot="prefix"></i>
            <el-option
              v-for="item in selectOption"
              v-bind:label="item.name"
              v-bind:value="item.ip"
              v-bind:key="item.ip"
            ></el-option>
            <!-- <el-option label="81.73中心" value="192.168.81.72"></el-option> -->
          </el-select>

          <el-checkbox v-model="form.autologin" class="checkbox-left"
            >自动登录</el-checkbox
          >
          <el-checkbox v-model="form.remberpasswd" class="checkbox-right"
            >记住密码</el-checkbox
          >
          <br />
          <el-button type="primary" @click="loginCommit">登 录</el-button>
        </el-form>
      </div>
    </div>
    <div class="footer">
      <div class="ahref">
        <span @click="loginRegister">注册帐号</span>
        <span>|</span>
        <span @click="loginHelper">新手指引</span>
      </div>
      <div class="imgto">
        <img src="../images/login_face_user.png" @click="loginFaceUser" />
        <img src="../images/login_qrcode.png" @click="loginQRcode" />
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
      // 表单数据, 文件读取初始化数据
      form: {
        username: '',
        password: '',
        autologin: false,
        remberpasswd: true,
        centerip: '',
      },
      // 中心数据, 文件读取获取信息
      selectOption: [
        // { name: '81.72中心', ip: '192.168.81.72' },
      ],
      // 这是动态css样式key, 判断条件,动态添加红色下划线
      usernamered: false,
      passwdred: false,
      centeripred: false,
    }
  },
  methods: {
    // 登录
    loginCommit() {
      console.log('loginCommit')
      let username = this.form.username.trim()
      let password = this.form.password.trim()
      let centerip = this.form.centerip || ''
      let autologin = this.form.autologin
      let remberpasswd = this.form.remberpasswd
      console.log('loginCommit', this.form)
      // 校验输入数据, 未输入, 弹出提示信息, 动态修改css样式表
      if ('' === username) {
        this.$message({
          type: 'error',
          message: '请输入用户名',
          duration: 3000,
        })
        this.usernamered = true
        return
      } else {
        this.usernamered = false
      }
      if ('' === password) {
        this.$message({
          type: 'error',
          message: '请输入密码',
          duration: 3000,
        })
        this.passwdred = true
        return
      } else {
        this.passwdred = false
      }
      if ('' === centerip) {
        this.$message({
          type: 'error',
          message: '请选择中心',
          duration: 3000,
        })
        this.centeripred = true
        return
      } else {
        this.centeripred = false
      }
      // 登录消息发送
      // loginipc.send('login-commit', this.form)
      // this.$router.push({ path: '/main-page' })
    },
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
      loginipc.send('login-user', true)
    },
    // 登录 -- 二维码
    loginQRcode() {
      loginipc.send('login-qrcode', true)
    },
  },
  mounted() {},
}
</script>

<style scoped>
/* *{ border: 1px solid pink;} */
.login-body {
  /* background-color: skyblue; */
  background-image: url('../images/login_bg.jpg');
  /* border: 1px solid pink; */
}
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
div.main {
  height: 250px;
  width: 430px;
}
div.main-left {
  width: 160px;
  height: 250px;
  /* background-color: #eeeeee; */
  float: left;
}
div.main-left img {
  margin-top: 100px;
  margin-left: 30px;
}

/* 表单css */
div.main-right {
  width: 270px;
  height: 250px;
  float: right;
}
div.main-right >>> form.el-form {
  width: 240px;
}
div.main-right div img {
  margin-left: 80px;
}

/* 表单 -- 输入框 : 默认下划线, 和焦点下划线 */
div.main-right >>> div.el-input {
  border: 0;
  /* margin-top: 5px; */
  background-color: transparent;
  border-bottom: 1px solid #b4bccc;
}
div.main-right >>> div.el-input:focus-within {
  border-bottom: 1px solid rgb(43, 155, 255);
}
/* 表单 -- 输入框 : 禁用样式 */
div.main-right >>> div.el-input input {
  background-color: transparent;
  border: 0;
  box-shadow: 0 0 0 transparent;
  border-radius: 0;
}

/* 这个是动态绑定css样式 --- start */
div.main-right >>> form div.usernamered {
  border-bottom: 1px solid red;
}
div.main-right >>> form div.passwdred {
  border-bottom: 1px solid red;
}
div.main-right >>> form div.centeripred {
  border-bottom: 1px solid red;
}
/* 这个是动态绑定css样式 --- end */

/* 表单 -- 下拉选择框 : 禁用样式 */
div.main-right >>> div.el-select div.el-input {
  border: 0;
}
div.main-right >>> div.el-select div.el-input:focus-within {
  border: 0;
}
/* 表单 -- 下拉选择框 : 设置样式 */
div.main-right >>> div.el-select {
  border-bottom: 1px solid #b4bccc;
}
div.main-right >>> div.el-select:focus-within {
  border-bottom: 1px solid rgb(43, 155, 255);
}

/* 表单 -- 选择框 */
label.checkbox-left,
label.checkbox-right {
  margin-top: 15px;
}
label.checkbox-right {
  float: right;
}

/* 表单 -- 登录按钮 */
button.el-button {
  width: 100%;
  height: 35px;
  margin-top: 15px;
  line-height: 10px;
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
