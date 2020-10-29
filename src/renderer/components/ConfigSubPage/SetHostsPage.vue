<template>
  <div class="main">
    <div class="center-from">
      <el-form :inline="true" :model="formHostsData" class="demo-form-inline">
        <span>域名 : </span>
        <el-input
          :disabled="inputDisableDomain"
          class="form-domain-input"
          v-model="formHostsData.name"
          placeholder="请输入"
        ></el-input>

        <span>IP : </span>
        <el-input
          :disabled="inputDisableIp"
          class="form-ip-input"
          v-model="formHostsData.ip"
          placeholder="请输入"
        ></el-input>

        <el-button :disabled="btnDisableAdd" type="primary" @click="addHostsFun"
          >添加</el-button
        >
      </el-form>
    </div>
    <div class="center-table">
      <el-table width="350" height="190" :data="tableData">
        <el-table-column prop="index" label="序号" width="40"></el-table-column>
        <el-table-column prop="name" label="域名" width="140"></el-table-column>
        <el-table-column prop="ip" label="IP" width="120"></el-table-column>
        <el-table-column label="操作" width="50">
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
const hostsipc = require('electron').ipcRenderer // 定义信号与槽函数接收者

export default {
  name: 'login-page',
  data() {
    return {
      formHostsData: {
        name: '',
        ip: '',
      },
      tableData: [
        // {index:1, ip:'192.168.8.1', name:'engin1.com'},
      ],
      // 是否禁用IP,域名输入框和添加按钮
      inputDisableIp: false,
      inputDisableDomain: false,
      btnDisableAdd: false,
    }
  },
  methods: {
    // 添加按钮
    addHostsFun() {
      console.log('addHostsFun')
      // 是否禁用输入框和添加按钮
      this.disableControl(true)

      // 检验输入数据
      if (!this.checkInput()) {
        this.disableControl(false)
        return false
      }
      // 发送信号, 将数据验证是否存在中心, 如果成功将数据保存并在表格添加一条数据
      hostsipc.send('hosts-add-data', this.formHostsData)
    },
    // 删除一条数据
    deleteRow(index, rows) {
      console.log('deleteRow', index, rows[index])
      // 发送删除信号
      hostsipc.send('hosts-del-data', rows[index])
      // 删除表格一条记录
      rows.splice(index, 1)
    },
    // 是否禁用IP,域名输入框和添加按钮
    disableControl(key = false) {
      this.inputDisableIp = key
      this.inputDisableDomain = key
      this.btnDisableAdd = key
    },
    // 检验输入函数
    checkInput() {
      if (this.formHostsData.name == '') {
        this.$message({
          type: 'error',
          message: '域名不能为空',
          showClose: true,
          center: true,
        })
        return false
      }
      if (this.formHostsData.ip == '') {
        this.$message({
          type: 'error',
          message: 'IP不能为空',
          showClose: true,
          center: true,
        })
        return false
      }

      // 检验 - IP地址
      const reg_ip = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      let retu_ip = reg_ip.test(this.formHostsData.ip)
      if (retu_ip) {
        // this.$message.success('正确IP地址')
      } else {
        this.$message({
          type: 'error',
          message: '错误IP地址',
          showClose: true,
          center: true,
        })
        this.formHostsData.ip = ''
        return false
      }
      // 通过检验
      return true
    },
  },
  mounted() {
    // 初始化数据 -- 发送信号
    hostsipc.send('hosts-get-data', true)
    // 初始化数据 -- 回调函数
    hostsipc.on('hosts-get-data-callbak', (event, retu) => {
      console.log('hosts-get-data-callbak', retu.data.length, retu)
      let arr_data = []
      for (let index in retu.data) {
        retu.data[index]['index'] = parseInt(index) + 1
        arr_data.push(retu.data[index])
      }
      this.tableData = arr_data
    })

    // 添加hosts -- 回调函数
    hostsipc.on('hosts-add-data-callbak', (event, retu) => {
      console.log('hosts-add-data-callbak', retu)
      this.disableControl(false)

      if (false == retu.status) {
        this.$message({
          type: 'error',
          message: '添加hosts失败',
          showClose: true,
          center: true,
        })
        return false
      }
      hostsipc.send('hosts-get-data', true)
      // 清除输入框
      this.formHostsData.ip = ''
      this.formHostsData.name = ''
      this.$message({
        type: 'success',
        message: '添加成功',
        duration: 2000,
        showClose: true,
        center: true,
      })
    })
  },
  destroyed() {
    hostsipc.removeAllListeners('hosts-get-data-callbak')
    hostsipc.removeAllListeners('hosts-add-data-callbak')
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
  height: 50px;
}
div.main div.center-from form {
  height: 30px;
  font-size: 12px;
  font-weight: lighter;
  margin: 0;
  padding: 0;
}
div.main div.center-from form div {
  margin: 0 2px;
}
/* 主体内容 -- 输入框整体设计*/
div.main div.center-from form div.el-input >>> input {
  height: 25px;
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 3px;
}
div.main div.center-from form div.el-input >>> input::placeholder {
  font-size: 11px;
  font-weight: lighter;
}

/* 主体内容 -- 表单 : IP输入框*/
div.main div.center-from form div.form-ip-input {
  width: 115px;
}
/* 主体内容 -- 表单 : 域名输入框*/
div.main div.center-from form div.form-domain-input {
  width: 110px;
}
/* 主体内容 -- 表单 : 添加按钮*/
div.main div.center-from form button {
  width: 45px;
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
div.main div.center-table div table {
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
  font-family: 'Microsoft YaHei UI', 'Courier New', Courier, monospace;
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
