<template>
  <div class="main">
    <!-- 显示标签 : 包裹隐藏标签, 通过css定位覆盖显示标签 -->
    <div
      class="main-show"
      @mouseenter="vmBoxShowFun"
      @mouseleave="vmBoxShowFun"
    >
      <div>
        <img v-bind:src="systemIcon" />
      </div>
      <div class="system-msg" :class="{ 'system-on': systemOn }">
        {{ systemMsg }}
      </div>
      <!-- 虚拟机操作状态图片, 绑定动态变量 -->
      <div class="system-status" v-loading="loading">
        <img :src="systemStatusImg" />
      </div>

      <!-- 隐藏标签 :hover 响应显示 start -->
      <div
        class="main-hover"
        :class="{ 'show-none': vmBoxShow }"
        @click="enterVm"
      >
        <el-tooltip
          content="断 电"
          placement="top-end"
          effect="light"
          :open-delay="1000"
          :enterable="false"
          :hide-after="3000"
        >
          <span class="vm-img-stop" @click.stop="activeVM('stop')"></span>
        </el-tooltip>
        <el-tooltip
          content="重 启"
          placement="top-end"
          effect="light"
          :open-delay="1000"
          :enterable="false"
          :hide-after="3000"
        >
          <span class="vm-img-reboot" @click.stop="activeVM('reboot')"></span>
        </el-tooltip>
        <el-tooltip
          content="开机/关机"
          placement="top-end"
          effect="light"
          :open-delay="1000"
          :enterable="false"
          :hide-after="3000"
        >
          <span class="vm-img-start" @click.stop="activeVM('start')"></span>
        </el-tooltip>
      </div>
      <!-- 隐藏标签 :hover 响应显示 end -->
    </div>
  </div>
</template>

<script>
const vmactionipc = require('electron').ipcRenderer // 定义信号与槽函数接收者
const osIcon = require('@/utils/getSystemIcon')
export default {
  props: ['vmcard'],
  computed: {
    // 使用计算属性来更新组件数据, 必须使用 function 函数
    // up / down / powering_up / powering_down / wait_for_launch / reboot_in_progress
    systemIcon: function() {
      // 虚拟机开关机状态图片
      if (
        'down' == this.vmcard.status ||
        'wait_for_launch' == this.vmcard.status
      ) {
        return osIcon.get_system_icon(this.vmcard.os, false)
      } else {
        return osIcon.get_system_icon(this.vmcard.os, true)
      }
    },
    systemMsg: function() {
      // 虚拟机名字
      return this.vmcard.name
    },
    systemOn: function() {
      // 虚拟机开关机更改虚拟机显示名称样式
      if (
        'down' == this.vmcard.status ||
        'wait_for_launch' == this.vmcard.status
      ) {
        return true
      } else {
        return false
      }
    },
    systemStatusImg: function() {
      if (
        'down' == this.vmcard.status ||
        'wait_for_launch' == this.vmcard.status
      ) {
        return require('@/images/vm_status_shutdown.png')
      } else {
        return require('@/images/vm_status_bootup.png')
      }
    },
  },
  data() {
    return {
      // 操作虚拟机状态等待
      loading: false,
      vmBoxShow: true,
      loadTimer: null,
      saveVmStatus: '',
      vminfo: this.vmcard,
    }
  },
  methods: {
    // 是否显示操作虚拟机窗口
    vmBoxShowFun() {
      this.vmBoxShow = !this.vmBoxShow
    },
    // 开启虚拟机等待特效 -- 开启定时器, 定时判断虚拟机状态变化
    loadingFun(isStatus) {
      this.loading = true
      this.saveVmStatus = isStatus || this.vmcard.status
      console.log('loadingFun', isStatus, this.saveVmStatus)

      if (!this.loadTimer) {
        this.loadTimer = setInterval(() => {
          if (isStatus) {
            // 判断虚拟机 up -> down
            if (this.saveVmStatus == this.vmcard.status) {
              this.loading = false
              clearInterval(this.loadTimer)
              this.loadTimer = null
              this.saveVmStatus = this.vmcard.status
            }
          } else {
            // 判断虚拟机 down -> up
            if (this.saveVmStatus != this.vmcard.status) {
              if ('wait_for_launch' != this.vmcard.status) {
                this.loading = false
                clearInterval(this.loadTimer)
                this.loadTimer = null
                this.saveVmStatus = this.vmcard.status
              }
            }
          }
        }, 1000)
      }
    },

    // 定时更新虚拟机 -- 操作开关机, 如果状态改变, 更改样式, 关闭定时器
    activeVM(active) {
      // action : start(开机) shutdown(关机) stop(断电) reboot(重启) refresh (刷新)
      console.log('activeVM', this.vmcard.id, active)

      vmactionipc.send('vm-get-vm-info', this.vmcard.id)
      // up / down / powering_up / powering_down / wait_for_launch
      if ('start' == active) {
        // 判断虚拟机状态, 是否需要操作虚拟机
        if ('powering_down' == this.vmcard.status) {
          this.$message({
            type: 'success',
            message: '虚拟机关机中',
            duration: 2000,
          })
          return false
        } else if ('powering_up' == this.vmcard.status) {
          this.$message({
            type: 'success',
            message: '虚拟机开机中',
            duration: 2000,
          })
          return false
        }

        // 如果虚拟机关机, 开机操作
        if ('down' == this.vmcard.status) {
          console.log('activeVM:active:start', this.vmcard.id)

          this.loadingFun() // 开启等待特效

          vmactionipc.send('vm-action', {
            vmid: this.vmcard.id,
            active: 'start',
          })
        } else if ('up' == this.vmcard.status) {
          // 如果虚拟机开机, 关机操作
          console.log('activeVM:active:shutdown', this.vmcard.id)
          this.loadingFun('down') // 开启等待特效

          vmactionipc.send('vm-action', {
            vmid: this.vmcard.id,
            active: 'shutdown',
          })
        }
      } else if ('reboot' == active) {
        // 虚拟机重启操作
        // 判断虚拟机状态, 是否需要操作虚拟机
        if ('down' == this.vmcard.status) {
          this.$message({
            type: 'success',
            message: '虚拟机已关机',
            duration: 2000,
          })
          return false
        } else if ('powering_down' == this.vmcard.status) {
          this.$message({
            type: 'success',
            message: '虚拟机关机中',
            duration: 2000,
          })
          return false
        } else if ('powering_up' == this.vmcard.status) {
          this.$message({
            type: 'success',
            message: '虚拟机开机中',
            duration: 2000,
          })
          return false
        }
        this.loadingFun() // 开启等待特效

        vmactionipc.send('vm-action', {
          vmid: this.vmcard.id,
          active: active,
        })
      } else if ('stop' == active) {
        // 虚拟机关机操作
        // 判断虚拟机状态, 是否需要操作虚拟机
        if ('down' == this.vmcard.status) {
          this.$message({
            type: 'success',
            message: '虚拟机已关机',
            duration: 2000,
          })
          return false
        } else if ('powering_down' == this.vmcard.status) {
          this.$message({
            type: 'success',
            message: '虚拟机关机中',
            duration: 2000,
          })
          return false
        }

        this.loadingFun() // 开启等待特效
        // 处理虚拟机操作
        vmactionipc.send('vm-action', {
          vmid: this.vmcard.id,
          active: active,
        })
      }
    },
    // 进入虚拟机
    enterVm() {
      // 进入虚拟机前, 先获取虚拟机详细信息, 再连接虚拟机
      console.log('enterVm:vm-vminfo:', this.vmcard.id)
      this.vminfo = {}
      vmactionipc.send('vm-vminfo', this.vmcard.id)
      // 进入虚拟机
      let enterVmTimer = setInterval(() => {
        if ({} == this.vminfo) {
          vmactionipc.send('vm-vminfo', this.vmcard.id)
        } else {
          vmactionipc.send('vm-enter', this.vminfo)
          clearInterval(enterVmTimer)
        }
      }, 1000)

      /* 虚拟机状态 this.vmcard.status
      up
      down
      powering_up
      powering_down
      unknow */
    },
  },
  mounted() {
    // 虚拟机卡片 -- 返回获取虚拟机详细信息
    vmactionipc.on('vm-vminfo-'.concat(this.vmcard.id), (event, res) => {
      console.log('vm-vminfo-'.concat(this.vmcard.id), res)
      this.vminfo = res // 保存单个虚拟机详细信息
      // { id: '14',
      //   name: 'HostedEngine',
      //   status: up / down / powering_up / powering_down / wait_for_launch
      //   description: '',
      //   os: 'rhel_7x64',
      //   hostIp: '192.168.16.231',
      //   hostName: 'mycloud231.node',
      //   port: 5900,
      //   ca: '-----BEGIN CERTIFICATE-----'}
    })

    // 进入虚拟机返回详细信息
    vmactionipc.on('vm-enter-'.concat(this.vmcard.id), (event, res) => {
      console.log('vm-enter-'.concat(this.vmcard.id), res)
      if (false == res.status) {
        this.$message({
          type: 'error',
          message: res.error,
          duration: 3000,
        })
      }
    })

    // 虚拟机卡片 -- 返回虚拟机操作信息
    vmactionipc.on('vm-action-'.concat(this.vmcard.id), (event, res) => {
      console.log('vm-action-'.concat(this.vmcard.id), res)
      if ('complete' == res.status) {
        // 执行成功: 关闭刷新样式, 关闭定时器, 清除对象
        // this.loading = false
        // clearInterval(this.loadTimer)
        // this.loadTimer = null
        this.$message({
          type: 'success',
          message: '虚拟机操作成功',
          duration: 2000,
        })
      } else {
        // 关闭刷新样式, 关闭定时器, 清除对象
        this.loading = false
        clearInterval(this.loadTimer)
        this.loadTimer = null

        this.$message({
          type: 'error',
          message: '请求失败',
          duration: 3000,
        })
      }
    })
  },
  destroyed() {
    vmactionipc.removeAllListeners('vm-vminfo-'.concat(this.vmcard.id))
    vmactionipc.removeAllListeners('vm-action-'.concat(this.vmcard.id))
    vmactionipc.removeAllListeners('vm-enter-'.concat(this.vmcard.id))
  },
}
</script>

<style scoped>
div.main {
  position: relative;
  background-color: transparent;

  width: 290px;
  height: 60px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
/* 显示标签 */
div.main-show {
  z-index: 0;
}
div.main-show div {
  height: 60px;
  color: rgba(0, 0, 0, 0.8);
  float: left;
}
/* 显示标签 -- 图片 */
div.main-show div img {
  margin-top: 8px;
  margin-left: 20px;
}
/* 显示标签 -- loading透明 */
div.main-show div.system-status >>> div.el-loading-mask {
  background-color: transparent;
}

/* 显示标签 -- 虚拟机名称 */
div.main-show div.system-msg {
  width: 140px;
  margin-left: 10px;
  line-height: 3;
  font-size: 20px;

  /* 文字超出隐藏, 并简写处理 */
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 显示标签 -- 虚拟机操作状态 */
div.main-show div.system-status {
  float: right;
  width: 60px;
  height: 60px;
  margin-right: 10px;
}
/* 显示标签 -- 虚拟机操作状态图片 */
div.main-show div.system-status img {
  margin: 0;
  padding: 0;
}

/* 动态样式 -- 虚拟机关机, 字体颜色变淡 */
div.main-show div.system-on {
  color: rgba(0, 0, 0, 0.5);
}

/* 隐藏标签 */
div.main-show div.main-hover {
  position: absolute;
  top: 0;
  left: 0;

  width: 290px;
  height: 60px;
  /* el-tooltip : z-index: 2150 */
  z-index: 1000 !important;

  background-image: url('../images/vmcard_hover.png');
  padding-right: 20px;
}

/* 浮动显示盒子, 虚拟机操作图片hover图片效果 */
div.main-show div.main-hover span {
  float: right;
  width: 32px;
  height: 32px;
  margin-right: 12px;
  margin-top: 15px;
}
div.main-show div.main-hover span:nth-child(1) {
  margin-right: 25px !important;
}
div.main-show div.main-hover span.vm-img-stop {
  margin-right: 5px;
  background-image: url('../images/vm_poweroff.png');
}
div.main-show div.main-hover span.vm-img-stop:hover {
  background-image: url('../images/vm_poweroff_action.png');
  cursor: pointer;
}
div.main-show div.main-hover span.vm-img-reboot {
  background-image: url('../images/vm_reboot.png');
}
div.main-show div.main-hover span.vm-img-reboot:hover {
  background-image: url('../images/vm_reboot_action.png');
  cursor: pointer;
}

div.main-show div.main-hover span.vm-img-start {
  background-image: url('../images/vm_bootup.png');
}
div.main-show div.main-hover span.vm-img-start:hover {
  background-image: url('../images/vm_bootup_action.png');
  cursor: pointer;
}
/* 动态样式, 监听hover事件 */
div.main-show div.show-none {
  display: none;
}
</style>
