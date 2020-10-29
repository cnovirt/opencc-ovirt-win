<template>
  <div class="login-body">
    <div class="menu-bar">
      <img src="../images/login_menu_close.png" @click="closeClient" />
      <img src="../images/login_menu_zoom.png" @click="zoomClient" />
      <img src="../images/login_menu_set.png" @click="openConfig" />
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
            :class="[{ usernamecss: usernamecss }]"
          >
            <i class="el-icon-user el-input__icon" slot="prefix"></i>
          </el-input>

          <el-input
            v-model="form.password"
            show-password
            :class="[{ passwordcss: passwordcss }]"
          >
            <i class="el-icon-lock el-input__icon" slot="prefix"></i>
          </el-input>

          <el-select
            v-model="form.centerip"
            placeholder="请选择中心"
            @click.native="clickSelect"
            :class="[{ centeripcss: centeripcss }]"
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

          <el-checkbox
            v-model="form.autologin"
            class="checkbox-left"
            @change="checkBoxChange('autologin')"
            >自动登录</el-checkbox
          >
          <el-checkbox
            v-model="form.remberpasswd"
            class="checkbox-right"
            @change="checkBoxChange('remberpasswd')"
            >记住密码</el-checkbox
          >
          <br />
          <el-button
            type="primary"
            :disabled="loginDisable"
            @click="loginCommit"
            >{{ loginMsg }}</el-button
          >
        </el-form>
      </div>
    </div>
    <div class="footer">
      <div class="ahref">
        <!-- 界面暂时屏蔽, 开发完成开放
          <span @click="loginRegister">注册帐号</span>
          <span>|</span>
        -->
        <span @click="loginHelper">新手指引</span>
      </div>
      <!-- 界面暂时屏蔽, 开发完成开放
      <div class="imgto">
        <img src="../images/login_face_user.png" @click="loginFaceUser" />
        <img src="../images/login_qrcode.png" @click="loginQRcode" />
      </div>
       -->
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
        remberpasswd: false,
        centerip: '',
      },
      // 中心数据, 文件读取获取信息
      selectOption: [
        // { name: '无中心', ip: '', port:'' },
      ],
      // 这是动态css样式key, 判断条件,动态添加红色下划线
      usernamecss: false,
      passwordcss: false,
      centeripcss: false,
      // 登录按钮 -- 样式和提示文字
      loginDisable: false,
      loginMsg: '登 录',
    }
  },
  methods: {
    // 登录按钮样式
    loginBtnFun(key = false) {
      if (key) {
        this.loginDisable = true
        this.loginMsg = '登录中'
      } else {
        this.loginDisable = false
        this.loginMsg = '登 录'
      }
    },
    // 自动登录和记住密码交互逻辑
    checkBoxChange(key) {
      console.log('checkBoxChange', key)
      if ('autologin' == key) {
        if (this.form.autologin) {
          this.form.remberpasswd = true
        }
      } else {
        if (!this.form.remberpasswd) {
          this.form.autologin = false
        }
      }
    },
    // 登录
    loginCommit() {
      console.log('loginCommit', this.form)
      let username = this.form.username.trim()
      let password = this.form.password.trim()
      let autologin = this.form.autologin
      let remberpasswd = this.form.remberpasswd
      let centerip = this.form.centerip

      // 校验输入数据, 未输入, 弹出提示信息, 动态修改css样式表
      if ('' === username) {
        this.$message({
          type: 'error',
          message: '请输入用户名',
          duration: 3000,
        })
        this.usernamecss = true
        return
      } else {
        this.usernamecss = false
      }
      if ('' === password) {
        this.$message({
          type: 'error',
          message: '请输入密码',
          duration: 3000,
        })
        this.passwordcss = true
        return
      } else {
        this.passwordcss = false
      }
      if ('' === centerip) {
        this.$message({
          type: 'error',
          message: '请选择中心',
          duration: 3000,
        })
        this.centeripcss = true
        return
      } else {
        this.centeripcss = false
      }

      let index = 0
      for (index in this.selectOption) {
        if (this.selectOption[index]['ip'] == centerip) {
          break
        }
      }

      this.form.centerip = this.selectOption[index]
      // 登录按钮 -- 禁用
      this.loginBtnFun(true)
      // 登录消息发送
      loginipc.send('login-commit', this.form)
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
    // 配置界面
    openConfig() {
      loginipc.send('open-config', true)
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
    // 登录 -- 二维码
    loginQRcode() {
      loginipc.send('login-qrcode', true)
      this.$router.push({ path: '/login-qrcode-page' })
    },
    // 登录 -- 选择中心点击
    clickSelect() {
      console.log('clickSelect')
      loginipc.send('login-get-centerip', true)
    },
  },
  mounted() {
    console.log('login-mounted')

    // 初始化数据 -- 获取用户保存信息, 校验
    loginipc.send('login-init-data', true)
    loginipc.on('login-init-data-callbak', (event, retu) => {
      console.log('login-init-data-callbak', retu)
      this.form.username = retu.username
      this.form.autologin = retu.autologin
      this.form.remberpasswd = retu.remberpasswd

      // 是否填入密码
      if (retu.remberpasswd) {
        this.form.password = retu.password
      } else {
        this.form.password = ''
      }

      // 判断是否是自动登录, 是否是登出的客户端
      if (retu.autologin && retu.userout) {
        // 登录消息发送
        loginipc.send('login-commit', retu)
      }
    })

    // 初次运行 - 请求中心列表数据
    loginipc.send('login-get-centerip', true)
    loginipc.on('login-get-centerip-callbak', (event, retu) => {
      console.log('login-get-centerip-callbak', retu)
      this.selectOption = retu
    })

    // 登录提交返回信息
    loginipc.on('login-commit-callbak', (event, retu) => {
      console.log('login-commit-callbak', retu)
      // 登录按钮 -- 启用
      this.loginBtnFun(false)

      if (false == retu.status) {
        this.$message({
          type: 'error',
          message: retu.error,
          duration: 3000,
        })
      } else {
        // 跳转路由
        // this.$router.push({ path: '/main-page', query: retu.data })
        this.$router.push({ name: 'main-page', params: retu.data })
      }
    })
  },
  destroyed() {
    loginipc.removeAllListeners('login-get-centerip-callbak')
  },
}
</script>

<style scoped>
/* *{ border: 1px solid pink;} */
.login-body {
  width: 430px;
  height: 330px;
  background-image: url('../images/login_bg.jpg');
  /* border: 1px solid pink; */
}
div.menu-bar {
  width: 430px;
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
div.main-right >>> form div.usernamecss {
  border-bottom: 1px solid red;
}
div.main-right >>> form div.passwordcss {
  border-bottom: 1px solid red;
}
div.main-right >>> form div.centeripcss {
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
  width: 240px;
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
