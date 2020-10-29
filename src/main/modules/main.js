import { ipcMain, BrowserWindow } from 'electron'
import * as global_value from './global_value'
import * as opencc_api from './opencc_api'
import * as systemInfo from './system_info'

export default () => {
  // 客户端 -- 登出用户
  ipcMain.on('set-box-out-user', (event, args) => {
    console.log('set-box-out-user', args)

    // 设置全局变量, 客户端是登出状态: 这里不需要改
    // global_value.setUserOut(true)

    opencc_api
      .LOG_OUT({
        mac: systemInfo.getMacAddr(),
      })
      .then((res) => {
        console.log('set-box-out-user:LOG_OUT:', res.data)
      })
      .catch((res) => {
        console.log('set-box-out-user:LOG_OUT:catch:', res)
      })
    global_value.mainWindow.setContentSize(432, 332)
    global_value.mainWindow.loadURL(global.winURL + '#/login-page')
  })

  // 获取虚拟机列表
  ipcMain.on('main-get-vms', (event, args) => {
    opencc_api
      .GET_VMS_INFO()
      .then((res) => {
        console.log(
          'main-get-vms '.concat(
            'status:',
            res.status,
            ', dataLen:',
            res.data.vm.length
          )
        )
            
        let vmsinfo = []
        let json_value = res.data
        let vmList = json_value['vm']
        for (let i = 0; i < vmList.length; i++) {
            let tmp_vminfo = {}
            tmp_vminfo['id'] = vmList[i]['id']
            tmp_vminfo['name'] = vmList[i]['name']
            tmp_vminfo['status'] = vmList[i]['status']
            tmp_vminfo['description'] = vmList[i]['description']
            tmp_vminfo['os'] = vmList[i]['os']['type']
            vmsinfo.push(tmp_vminfo)
        }

        global_value.mainWindow.webContents.send(
          'main-get-vms-callbak',
          vmsinfo
        )
      })
      .catch((res) => {
        console.log('main-get-vms-err', res)
      })
  })

  // 设置列表框
  // 设置列表框 -- 帮助
  ipcMain.on('set-box-help', (event, args) => {
    console.log('set-box-help', args)
    let child = new BrowserWindow({
      parent: global_value.mainWindow,
      modal: true,
      width: 430,
      height: 330,
      show: true,
    })
    child.loadURL(global.winURL + '#/login-face-user-page')

    child.on('closed', () => {
      child = null
      global.child = null
    })
    // 全局保存child
    global.child = child
  })

  // 设置列表框 -- 升级
  ipcMain.on('set-box-update', (event, args) => {
    console.log('set-box-update', args)
  })
  // 设置列表框 -- 设置
  ipcMain.on('set-box-seting', (event, args) => {
    console.log('set-box-seting', args)
  })
  // 设置列表框 -- 关于
  ipcMain.on('set-box-about', (event, args) => {
    console.log('set-box-about', args)

    let child = new BrowserWindow({
      parent: global_value.mainWindow,
      modal: true,
      frame: false,
      width: 432,
      height: 332,
      show: true,
      resizable:false, // 禁用修改窗口大小
    })
    child.loadURL(global.winURL + '#/set-about-page')
    child.on('closed', () => {
      child = null
      global.child = null
    })
    // 全局保存child
    global.child = child
  })
  // 设置列表框 -- 切换帐号
  ipcMain.on('set-box-change-user', (event, args) => {
    console.log('set-box-change-user', args)
  })
  // 设置列表框 -- 退出
  ipcMain.on('set-box-out-user', (event, args) => {
    console.log('set-box-out-user', args)
  })

  // 设置列表框 -- 窗口退出(模态框)
  ipcMain.on('set-exit-win', (event, args) => {
    console.log('set-exit-win', args)
    if (global.child) {
      global.child.close()
      global.clild = null
    }
  })
}
