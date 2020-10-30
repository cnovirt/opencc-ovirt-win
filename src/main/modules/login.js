import { app, ipcMain, BrowserWindow } from 'electron'

import * as global_value from './global_value'

import * as myconfig from './configure'

import * as opencc_api from './opencc_api'

const exec = require('child_process').exec

const fs = require('fs')

export default () => {
  // 初始化数据 -- 获取保存的用户数据
  ipcMain.on('login-init-data', (event, args) => {
    let loginData = myconfig.get_value('userinfo') // 获取用户保存数据
    // 添加一个变量，　判断是否是已登出的客户端
    loginData['userout'] = global_value.USEROUT
    console.log('login-init-data', args, loginData)
    global_value.mainWindow.webContents.send(
      'login-init-data-callbak',
      loginData
    )
  })

  // 请求中心列表数据
  ipcMain.on('login-get-centerip', (event, args) => {
    console.log('login-get-centerip', args)
    let retu = myconfig.get_value('centerinfo') // 获取保存中心数据
    global_value.mainWindow.webContents.send('login-get-centerip-callbak', retu)
  })

  // 关闭 - 客户端
  ipcMain.on('close-client', (event, args) => {
    console.log('close-client', args)
    app.quit()
  })

  // 最小化 - 客户端
  ipcMain.on('zoom-client', (event, args) => {
    console.log('zoom-client', args)
    global_value.mainWindow.minimize()
  })

  // 打开配置界面
  ipcMain.on('open-config', (event, args) => {
    console.log('open-config', args)

    let child = new BrowserWindow({
      parent: global_value.mainWindow,
      modal: true,
      frame: false,
      width: 432,
      height: 332,
      show: true,
    })
    child.loadURL(global.winURL + '#/config-page/centerip')
    child.on('closed', () => {
      child = null
      global.child = null
    })
    // 全局保存child
    global.child = child
  })

  ipcMain.on('config-router', (event, args) => {
    global.child.loadURL(global.winURL + args)
  })

  // 配置界面 -- 模态框退出
  ipcMain.on('config-exit-win', (event, args) => {
    console.log('config-exit-win', args)
    if (global.child) {
      global.child.close()
      global.clild = null
    }
  })

  // 注册帐号
  ipcMain.on('login-register', (event, args) => {
    console.log('login-register', args)
  })

  // 新手指引
  ipcMain.on('login-helper', (event, args) => {
    console.log('login-register', args)
    // 这个地址是打包安装成功后,添加到安装目录中的文件地址
    let url = './opencc-ovirt帮助文档.pdf'
    switch (process.platform) {
      case 'darwin':
        exec('open ' + url)
        break
      case 'win32':
        if (fs.existsSync(url)) {
          exec('start ' + url)
        } else {
          // 这个地址是代码运行可以读取到的文件地址
          url = './src/renderer/images/help_pdf/opencc-ovirt帮助文档.pdf'
          exec('start ' + url)
        }

        break
      default:
        exec('xdg-open', url)
    }
  })

  // 登录 -- 刷脸
  ipcMain.on('login-face-user', (event, args) => {
    console.log('login-face-user', args)
  })

  // 登录 -- 二维码
  ipcMain.on('login-qrcode', (event, args) => {
    console.log('login-qrcode', args)
  })

  // 登录 -- 登录按钮点击
  ipcMain.on('login-commit', (event, args) => {
    console.log('login-commit args:', args)
    /* args = {
        username,
        password,
        centerip : { name, ip, port }
        autologin,
        remberpasswd } */

    // 将用户基本信息保存 -- 接口请求需要用到
    global_value.setUserInfo(args)

    // 登录点击返回数据
    let retuData = {
      status: false,
      data: '',
      error: '',
    }

    // 获取token
    let tokenData = {
      username: args.username + '@internal',
      password: args.password,
      grant_type: 'password',
      scope: 'ovirt-app-api',
    }
    opencc_api
      .GET_TOKEN(tokenData)
      .then((res) => {
        console.log('GET_TOKEN', res.status, res.data)
        if (200 == res.status) {
          // 保存token数据到全局变量
          let token = 'Bearer ' + res.data.access_token
          global_value.setToken(token)

          // 登录注册成功 -- 保存用户信息
          let userinfo = global_value.USERINFO
          myconfig.update_value('userinfo', userinfo)

          // 登录成功, 将客户端状态改变
          global_value.setUserOut(false)

          // 请求成功 -- 发送信号给登录界面
          retuData.status = true
          retuData.data = {
            userid: userinfo.username,
            fullname: userinfo.username,
            group: '',
          }
          global_value.mainWindow.webContents.send(
            'login-commit-callbak',
            retuData
          )
          // 设置窗口大小
          global_value.mainWindow.setContentSize(292, 514)
        } else {
          retuData.error = '用户名或密码不对'
          global_value.mainWindow.webContents.send(
            'login-commit-callbak',
            retuData
          )
        }
      })
      .catch((res) => {
        console.log('get-token-err', res.response.status)
        retuData.error = 'token请求失败'
        global_value.mainWindow.webContents.send(
          'login-commit-callbak',
          retuData
        )
      })
  })
}
