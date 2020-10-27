import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import * as global_value from './modules/global_value'

import loginIpc from './modules/login'
import mainIpc from './modules/main'
import centerIpIpc from './modules/centerip'
import vmActionIpc from './modules/action_vm'
import setHostsIpc from './modules/sethosts'

import { init_configure } from './modules/configure'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

// 窗口url保存全局变量
global.winURL = winURL

function createWindow() {
  Menu.setApplicationMenu(null) // 隐藏菜单栏

  let mainWindow = new BrowserWindow({
    width: 432,
    // maxWidth: 430,
    // minWidth:430,
    height: 332,
    // maxHeight:330,
    // minHeight:330,
    maximizable:false,
    minimizable: false,
    fullscreen:false,
    resizable:false,
    frame: false, // 取消客户端边框
    useContentSize: false,
    webPreferences: {
      nodeIntegration: true, //这句很重要，意思是是否要集成node的环境，如果是false则前端会抛错
    },
  })
  mainWindow.loadURL(winURL)
  global_value.setMainWindow(mainWindow)
}

app.on('ready', createWindow)

// ----------------- 引用导入的函数 --------------------
// 初始化配置文件
init_configure() // 初始化
centerIpIpc() // 配置界面 -- 添加中心逻辑
setHostsIpc() // 配置界面 -- 设置hosts逻辑
loginIpc() // 登录逻辑
mainIpc() // 主界面逻辑
vmActionIpc() // 虚拟机逻辑

