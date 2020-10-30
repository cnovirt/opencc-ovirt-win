<template>
  <div class="main main-bg">
    <div class="header">
      <div class="menu">
        <img src="../images/main_menu_close.png" @click="closeMain" />
        <img src="../images/main_menu_zoom.png" @click="zoomMain" />
        <!-- <img src="../images/main_menu_notice.png" @click="noticeMain" /> -->
      </div>
      <div class="userinfo">
        <div class="userinfo-left">
          <img src="../images/login_user.png" />
        </div>
        <div class="userinfo-right">
          <div class="user-msg">
            <span class="user-name">{{ userName }}</span>
            <span class="user-work">{{ userGroup }}</span>
          </div>
          <div class="user-sign">{{ userSign }}</div>
        </div>
      </div>
      <div class="searchbar">
        <el-input v-model="vmsearch" placeholder="搜索" @input="vmsearchFun">
          <i class="el-icon-search el-input__icon" slot="prefix"></i>
        </el-input>
      </div>
    </div>
    <div class="content">
      <!-- 这里放置虚拟机卡片组件 -- start -->
      <vm-card
        v-for="itemvm in vmsinfo"
        :vmcard="itemvm"
        :key="itemvm.id"
      ></vm-card>
      <!-- 这里放置虚拟机卡片组件 -- end -->
    </div>
    <div class="footer">
      <img src="../images/main_menu.png" @click="setClient" />
      <!-- 设置窗口 -->
      <div class="seting-box" :class="{ 'seting-box-show': setBoxShow }">
        <ul>
          <li @click="setBoxHelp">帮助</li>
          <!-- <li @click="setBoxUpdate">升级</li> -->
          <!-- <li @click="setBoxSeting">设置</li> -->
          <li @click="setBoxAbout">关于openCC</li>
          <!-- <li @click="setBoxChangeUser">切换帐号</li> -->
          <li @click="setBoxOutUser" class="seting-out">
            <img src="../images/seting_out.png" />退出
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
const mainipc = require('electron').ipcRenderer // 定义信号与槽函数接收者

// 导入组件 : 虚拟机卡片组件
import VmCard from '@/components/VmCard'

export default {
  name: 'main-page',
  components: {
    VmCard,
  },
  data() {
    return {
      getVmsInterval: '', // 定时器 -- 定时获取虚拟机信息
      vmsearch: '', // 虚拟机搜索框
      // 登录传递过来的用户数据
      userId: this.$route.params.userid,
      userName: this.$route.params.fullname,
      userGroup: this.$route.params.group,
      userSign: '愉快的工作从这里开始',
      vmsinfo: [],
      saveInfo: [],
      setBoxShow: true,
    }
  },
  methods: {
    // 搜索框 -- 输入触发事件
    vmsearchFun() {
      let temp = []
      for (let i in this.saveInfo) {
        let vm = this.saveInfo[i]
        if (0 <= vm.name.indexOf(this.vmsearch)) {
          temp.push(vm)
        }
      }
      this.vmsinfo = temp
    },
    // 公告信息
    noticeMain() {
      this.$message({
        type: 'success',
        message: '功能暂未开发',
        center: true,
        showClose: true,
        duration: 2000,
      })
    },
    // 退出客户端
    closeMain() {
      this.$confirm('确定关闭客户端?', '关闭提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '成功关闭!',
            center: true,
          })
          // 关闭客户端信号
          mainipc.send('close-client', true)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消关闭',
            center: true,
            duration: 1000,
          })
        })
    },
    // 最小化
    zoomMain() {
      mainipc.send('zoom-client', true)
    },

    // 设置界面
    setClient() {
      mainipc.send('set-client', true)
      this.setBoxShow = !this.setBoxShow
    },
    // 设置列表框
    // 设置列表框 -- 帮助
    setBoxHelp() {
      console.log('setBoxHelp')
      this.setBoxShow = !this.setBoxShow
      mainipc.send('login-helper', true)
    },
    // 设置列表框 -- 升级
    setBoxUpdate() {
      console.log('setBoxUpdate')
      mainipc.send('set-box-update', true)
      this.setBoxShow = !this.setBoxShow

      this.$message({
        type: 'success',
        message: '功能暂未开发',
        center: true,
        showClose: true,
        duration: 2000,
      })
    },
    // 设置列表框 -- 设置
    setBoxSeting() {
      console.log('setBoxSeting')
      mainipc.send('set-box-seting', true)
      this.setBoxShow = !this.setBoxShow

      this.$message({
        type: 'success',
        message: '功能暂未开发',
        center: true,
        showClose: true,
        duration: 2000,
      })
    },
    // 设置列表框 -- 关于
    setBoxAbout() {
      console.log('setBoxAbout')
      mainipc.send('set-box-about', true)
      this.setBoxShow = !this.setBoxShow
    },
    // 设置列表框 -- 切换帐号
    setBoxChangeUser() {
      console.log('setBoxChangeUser')
      mainipc.send('set-box-change-user', true)
      this.setBoxShow = !this.setBoxShow

      this.$message({
        type: 'success',
        message: '功能暂未开发',
        center: true,
        showClose: true,
        duration: 2000,
      })
    },
    // 设置列表框 -- 退出
    setBoxOutUser() {
      console.log('setBoxOutUser')
      this.setBoxShow = !this.setBoxShow

      this.$confirm('确定退出登录?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '成功退出!',
            duration: 2000,
            center: true,
          })
          mainipc.send('set-box-out-user', true)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消退出',
            center: true,
            duration: 1000,
          })
        })
    },
  },
  mounted() {
    // 定时获取虚拟机信息
    this.getVmsInterval = setInterval(() => {
      mainipc.send('main-get-vms', true)
    }, 6000)

    // 获取虚拟机信息
    mainipc.send('main-get-vms', true)
    mainipc.on('main-get-vms-callbak', (event, res) => {
      console.log(res)
      this.saveInfo = res // 保存一份数据, 给搜索框使用
      if ('' == this.vmsearch) {
        this.vmsinfo = this.saveInfo
      } else {
        // 查找搜索结果, 放入数据列表中
        let temp = []
        for (let index in res) {
          let vm = res[index]
          if (0 <= vm.name.indexOf(this.vmsearch)) {
            temp.push(vm)
          }
        }
        this.vmsinfo = temp
      }
    })
  },
  destroyed() {
    mainipc.removeAllListeners('main-get-vms-callbak')
    // 关闭定时器 -- 定时获取虚拟机信息
    clearInterval(this.getVmsInterval)
  },
}
</script>

<style scoped>
div.main {
  /* background-color: white; */
  width: 290px;
  height: 512px;

  /* background-repeat: no-repeat; */
}
div.main-bg {
  background-image: url('../images/main_bg.jpg');
}
/* 主界面 -- 头部 */
div.header {
  width: 290px;
  height: 140px;
  /* background-color: rgb(80, 180, 255); */
  background-color: transparent;
}
/* 主界面 -- 头部 : 功能按钮 */
div.menu {
  width: 290px;
  height: 30px;

  -webkit-app-region: drag;
}
div.menu img {
  float: right;
  margin-right: 10px;
  margin-top: 8px;

  -webkit-app-region: no-drag;
}

/* 主界面 -- 头部 : 用户信息 */
div.header div.userinfo {
  /* border: 1px solid green; */
  width: 290px;
  height: 80px;
  color: white;
}
div.header div.userinfo div.userinfo-left {
  float: left;
  width: 80px;
  height: 80px;
}
div.header div.userinfo div.userinfo-left img {
  margin-top: 10px;
  margin-left: 10px;
}
div.header div.userinfo div.userinfo-right {
  float: right;
  padding: 10px;
  width: 190px;
  height: 80px;
}
div.header div.userinfo div.userinfo-right div.user-msg span.user-name {
  font-size: 20px;
}
div.header div.userinfo div.userinfo-right div.user-msg span.user-work {
  font-size: 12px;
  font-weight: bold;
  margin-left: 10px;
}
div.header div.userinfo div.userinfo-right div.user-sign {
  font-size: 12px;
  font-weight: initial;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 5px;
}

/* 主界面 -- 头部 : 搜索 */
div.header div.searchbar {
  /* border: 1px solid red; */
  height: 30px;
  position: fixed;
}
div.header div.searchbar >>> input {
  height: 30px;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: white;
}
div.header div.searchbar >>> input::-webkit-input-placeholder {
  color: white;
}
div.header div.searchbar >>> div span i.el-icon-search {
  color: white;
  line-height: 30px;
}
/* 主界面 -- 内容 */
div.content {
  width: 290px;
  height: 322px;
  overflow: hidden;
  overflow-y: auto;

  background-color: transparent;
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

/* 主界面 -- 底部 */
div.footer {
  width: 290px;
  height: 50px;
  background-color: #1890ff;
}
div.footer img {
  margin-top: 10px;
  margin-left: 20px;
}

/* 主界面 -- 底部 : 设置窗口 */
div.footer div.seting-box-show {
  /* 这个 class 是动态样式, 通过 setBoxShow 控制显示 */
  display: none;
}
div.footer div.seting-box {
  position: absolute;
  left: 0;
  bottom: 0;
  margin-bottom: 50px;
  background-color: rgba(231, 246, 254, 0.9);
  box-shadow: 3px -3px 3px rgb(233, 233, 233);

  width: 90px;
  font-size: 12px;
  font-weight: initial;
  color: gray;
  padding-left: 30px;
}
div.footer div.seting-box ul {
  padding-left: 0;
}
div.footer div.seting-box ul li {
  margin-top: 10px;
  list-style-type: none;
}
div.footer div.seting-box ul li:hover {
  color: black;
  cursor: pointer;
}
div.footer div.seting-box ul li.seting-out {
  margin-top: 0;
  margin-bottom: 10px;
}
div.footer div.seting-box ul li.seting-out img {
  margin-left: -25px !important;
  margin-right: 8px;
  margin-bottom: -3px;
}
</style>
