<template>
  <div class="main">
    <div class="center-from">
      <el-form :inline="true" :model="formCenter" class="demo-form-inline">
        <span class="form-name">名称 :</span>
        <el-input
          :disabled="inputDisableName"
          class="form-name-input"
          v-model="formCenter.name"
          placeholder="请输入"
        ></el-input>
        <br />
        <span>IP/域名 :</span>
        <el-input
          :disabled="inputDisableIp"
          class="form-ip-input"
          v-model="formCenter.ip"
          placeholder="请输入"
        ></el-input>
        <span>端口 :</span>
        <el-input
          :disabled="inputDisablePort"
          class="form-port-input"
          v-model="formCenter.port"
          placeholder="请输入"
        ></el-input>
        <el-button :disabled="btnDisableAdd" type="primary" @click="addCenterIP"
          >添加</el-button
        >
      </el-form>
    </div>
    <div class="center-table">
      <el-table width="350" height="176" :data="tableData">
        <el-table-column prop="index" label="序号" width="35"></el-table-column>
        <el-table-column prop="name" label="名称" width="110"></el-table-column>
        <el-table-column
          prop="ip"
          label="IP/域名"
          width="120"
        ></el-table-column>
        <el-table-column prop="port" label="端口" width="40"></el-table-column>
        <el-table-column label="操作" width="45">
          <template slot-scope="scope">
            <!-- @click.native.prevent="deleteRow(scope.$index, tableData)" -->
            <span
              @click="deleteRow(scope.$index, tableData)"
              style="color:#1890ff;"
            >
              移除
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
const centeripc = require('electron').ipcRenderer // 定义信号与槽函数接收者

export default {
  name: 'login-page',
  data() {
    return {
      formCenter: {
        name: '',
        ip: '',
        port: '443',
      },
      tableData: [],
      // 是否禁用输入框和添加按钮
      inputDisableName: false,
      inputDisableIp: false,
      inputDisablePort: false,
      btnDisableAdd: false,
    }
  },
  methods: {
    // 添加按钮
    addCenterIP() {
      console.log('addCenterIP')
      // 是否禁用输入框和添加按钮
      this.disableControl(true)

      // 检验输入数据
      if (!this.checkInput()) {
        this.disableControl(false)
        return false
      }
      // 发送信号, 将数据验证是否存在中心, 如果成功将数据保存并在表格添加一条数据
      centeripc.send('centerip-add-ip', this.formCenter)
    },
    // 删除一条数据
    deleteRow(index, rows) {
      console.log('deleteRow', index, rows[index])
      // 发送删除信号
      centeripc.send('centerip-del-row', rows[index])
      // 删除表格一条记录
      rows.splice(index, 1)
    },
    // 是否禁用输入框和添加按钮
    disableControl(key = false) {
      this.inputDisableName = key
      this.inputDisableIp = key
      this.inputDisablePort = key
      this.btnDisableAdd = key
    },
    // 检验输入函数
    checkInput() {
      if (this.formCenter.name == '') {
        this.$message({
          type: 'error',
          message: '中心名称不能为空',
          showClose: true,
          center: true,
        })
        return false
      }
      if (this.formCenter.ip == '') {
        this.$message({
          type: 'error',
          message: 'IP/域名不能为空',
          showClose: true,
          center: true,
        })
        return false
      }
      if (this.formCenter.port == '') {
        this.$message({
          type: 'error',
          message: '端口号不能为空',
          showClose: true,
          center: true,
        })
        return false
      }

      // 检验 - IP地址
      // const reg_ip = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      // let retu_ip = reg_ip.test(this.formCenter.ip)
      // if (retu_ip) {
      //   // this.$message.success('正确IP地址')
      // } else {
      //   this.$message({
      //     type: 'error',
      //     message: '错误IP地址',
      //     showClose: true,
      //     center: true,
      //   })
      //   this.formCenter.ip = ''
      //   return false
      // }

      // 检验 - 端口号
      const reg_port = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
      let retu_port = reg_port.test(this.formCenter.port)
      if (retu_port) {
        // this.$message.success('正确端口号')
      } else {
        this.$message({
          type: 'error',
          message: '错误端口号',
          showClose: true,
          center: true,
        })
        this.formCenter.port = ''
        return false
      }
      return true
    },
  },
  mounted() {
    // 初始化数据 -- 发送信号
    centeripc.send('centerip-get-centerinfo', true)

    // 初始化数据 -- 回调函数
    centeripc.on('centerip-get-centerinfo-callbak', (event, retu) => {
      console.log('centerip-get-centerinfo-callbak', retu)

      let arr_data = []
      for (let index in retu.data) {
        retu.data[index]['index'] = parseInt(index) + 1
        arr_data.push(retu.data[index])
      }

      this.tableData = arr_data
    })

    // 添加中心 -- 回调函数
    centeripc.on('centerip-add-ip-callbak', (event, retu) => {
      console.log('centerip-add-ip-callbak', retu)
      // { data: { name: false, ip: false },
      //   status: false,
      //   error: '',}
      this.disableControl(false)

      if (retu['data']['ip'] == false) {
        // 中心ip存在
        this.$message({
          type: 'error',
          message: retu['error'],
          showClose: true,
          center: true,
        })
        return
      } else if (retu['data']['name'] == false) {
        // 中心名称存在
        this.$message({
          type: 'error',
          message: retu['error'],
          showClose: true,
          center: true,
        })
        return
      }

      if (retu['status'] == false) {
        // 请求失败
        this.$message({
          type: 'error',
          message: retu['error'],
          showClose: true,
          center: true,
        })
        return
      } else {
        centeripc.send('centerip-get-centerinfo', true)
        this.$message({
          type: 'success',
          message: '请求成功',
          duration: 2000,
          showClose: true,
          center: true,
        })
        this.formCenter.name = ''
        this.formCenter.ip = ''
      }
    })

    // 终端向中心注册信息
    centeripc.on('centerip-register-callbak', (event, retu) => {
      console.log('centerip-register-callbak', retu)
      if (false == retu) {
        this.$message({
          type: 'error',
          message: '终端向中心注册失败',
          showClose: true,
          center: true,
        })
      }
    })
  },
  destroyed() {
    centeripc.removeAllListeners('centerip-get-centerinfo-callbak')
    centeripc.removeAllListeners('centerip-add-ip-callbak')
    centeripc.removeAllListeners('centerip-register-callbak')
  },
}
</script>

<style scoped>
/* 主体内容 */
div.main {
  width: 350px;
  height: 240px;
  /* background-color: rgb(230, 240, 255); */
}

/* 主体内容 -- 表单*/
div.main div.center-from {
  width: 350px;
  height: 65px;
}
div.main div.center-from form {
  float: left;
  font-size: 12px;
  font-weight: lighter;
  margin: 0;
  padding: 0;
}
div.main div.center-from form div {
  margin-left: 5px;
}
/* 主体内容 -- 输入框整体设计*/
div.main div.center-from form div.el-input >>> input {
  height: 25px;
  padding: 0 8px;
  border-radius: 3px;
}
div.main div.center-from form div.el-input >>> input::placeholder {
  font-size: 11px;
  font-weight: lighter;
}

/* 主体内容 -- 表单 : 名称*/
div.main div.center-from form span.form-name {
  display: inline-block;
  width: 44px;
  text-align: right;
}
/* 主体内容 -- 表单 : 名称输入框*/
div.main div.center-from form div.form-name-input {
  width: 230px;
}
/* 主体内容 -- 表单 : IP输入框*/
div.main div.center-from form div.form-ip-input {
  width: 130px;
}
/* 主体内容 -- 表单 : 端口输入框*/
div.main div.center-from form div.form-port-input {
  width: 60px;
  margin-right: 3px;
}
/* 主体内容 -- 表单 : 添加按钮*/
div.main div.center-from form button {
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

/* 主体内容 -- 表格*/
div.main div.center-table {
  width: 350px;
  height: 175px;
  text-align: center;
}
div.main div.center-table table {
  width: 350px;
  height: 175px;
  font-size: 12px;
  font-weight: lighter;
  color: rgba(0, 0, 0, 0.5);
}

/* 表格总体设置 */
div.main div.center-table >>> div.el-table {
  margin: 0;
  padding: 0;
  font-size: 12px;
  font-weight: lighter;
  /* border: 1px solid pink; */
  font-family: 'Microsoft YaHei UI', 'Courier New', Courier, monospace;
}
/* 表格头 */
div.main div.center-table >>> div.el-table div.el-table__header-wrapper table {
  font-family: 'Microsoft YaHei', 'Microsoft YaHei UI', 'Source Sans Pro',
    sans-serif;
  font-weight: lighter;
}
/* 表格头 -- 左右padding:0 */
div.main
  div.center-table
  >>> div.el-table
  div.el-table__header-wrapper
  table
  thead
  th
  div {
  padding: 8px 0;
  color: rgba(0, 0, 0, 0.6);
  /* font-weight:700; */
}
/* 表格头 -- 上下padding: 0*/
div.main
  div.center-table
  >>> div.el-table
  div.el-table__header-wrapper
  table
  thead
  th {
  padding: 0;
  /* border: 1px solid red; */
}

/* 表格体 */
div.main
  div.center-table
  >>> div.el-table
  div.el-table__body-wrapper
  table
  tbody
  tr
  td
  div {
  padding: 0;
}

/* 表格体 -- 滚动条样式 */
div.main
  div.center-table
  >>> div
  div.el-table__body-wrapper::-webkit-scrollbar {
  background-color: #f5f5f5;
  width: 10px;
}
div.main
  div.center-table
  >>> div
  div.el-table__body-wrapper::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: #f5f5f5;
}
div.main
  div.center-table
  >>> div
  div.el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(150, 150, 150, 0.5);
}

/* 表格体 -- 第一列属性 */
div.main
  div.center-table
  >>> div.el-table
  div.el-table__body-wrapper
  table
  tbody
  tr
  td:first-child
  div {
  color: red;
  padding-left: 10px;
}
/* 表格体 -- 最后一列属性 */
div.main
  div.center-table
  >>> div.el-table
  div.el-table__body-wrapper
  table
  tbody
  tr
  td:last-child
  div {
  cursor: pointer;
}
/* 表格体 -- 行高 */
div.main
  div.center-table
  >>> div.el-table
  div.el-table__body-wrapper
  table
  tbody
  tr
  td {
  padding: 2px 0;
}
</style>
