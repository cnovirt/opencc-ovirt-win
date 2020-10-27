import { ipcMain } from 'electron'

const fs = require('fs')
const os = require('os')

// 添加中心主要功能
// 注意 : 这个功能的界面在模态框中, 所以主线程给渲染线程发信号, 需要对与的窗口对象
export default () => {
  // 获取数据 -- 初始化界面, 收到信号, 将配置文件中的数据读取并返回
  ipcMain.on('hosts-get-data', (event, args) => {
    console.log('hosts-get-data', args)

    //hostsData = {ip:'192.168.8.1', name:'engin1.com'},

    // 返回的数据格式
    let retuData = {
      data: getAllHosts(),
      status: true,
      error: '',
    }
    global.child.webContents.send('hosts-get-data-callbak', retuData)
  })

  // 添加一条数据
  ipcMain.on('hosts-add-data', (event, args) => {
    console.log('hosts-add-data', args)
    let retuData = {
      data: '',
      status: false,
      error: '',
    }
    if (addHostsOne(args)) {
      retuData.status = true
    }
    global.child.webContents.send('hosts-add-data-callbak', retuData)
  })

  ipcMain.on('hosts-del-data', (event, args) => {
    console.log('hosts-del-data', args)
    console.log('hosts-del-data', delRowHosts(args))
  })
}

// 删除一条数据
const delRowHosts = (args) => {
  let delValue = args.ip + args.name

  let sysType = os.platform()
  let hostsPath = ''
  if ('win32' == sysType) {
    hostsPath = 'C:\\Windows\\System32\\drivers\\etc\\hosts'
  } else if ('linux' == sysType) {
    hostsPath = '/etc/hosts'
  }

  try {
    let saveData = '' // 存储数据
    let hostsValue = fs.readFileSync(hostsPath).toString()
    let hostList = hostsValue.split('\n')
    for (let i = 0; i < hostList.length; i++) {
      let item = hostList[i]
      let temp = item.replace(' ', '')
      if (delValue == temp) {
        continue
      } else {
        saveData = saveData.concat(item, '\n')
      }
    }
    let fd2 = fs.openSync(hostsPath, 'w')
    fs.writeSync(fd2, saveData)
    fs.closeSync(fd2)
    return true
  } catch (e) {
    console.log('delRowHosts', e.toString())
    return false
  }
}

// 获取hosts数据
const getAllHosts = () => {
  let sysType = os.platform()
  let hostsPath = ''
  if ('win32' == sysType) {
    hostsPath = 'C:\\Windows\\System32\\drivers\\etc\\hosts'
  } else if ('linux' == sysType) {
    hostsPath = '/etc/hosts'
  }

  let hostData = [] // 存储数据
  let hostsValue = fs.readFileSync(hostsPath).toString()
  let hostList = hostsValue.split('\n')
  for (let i = 0; i < hostList.length; i++) {
    let item = hostList[i].trim()
    item = item.replace(/\s+/g, ' ')
    if (item.indexOf('::') >= 0) {
      continue
    } else if (item == '') {
      continue
    } else if (item.indexOf('#') >= 0) {
      continue
    } else {
      let item_v = {
        ip: item.split(' ')[0],
        name: item.split(' ')[1],
      }
      hostData.push(item_v)
    }
  }
  return hostData
}

// 添加一条数据
export const addHostsOne = (args) => {
  let lineValue = '\n'.concat(args.ip, ' ', args.name)

  let sysType = os.platform()
  let hostsPath = ''
  if ('win32' == sysType) {
    hostsPath = 'C:\\Windows\\System32\\drivers\\etc\\hosts'
  } else if ('linux' == sysType) {
    hostsPath = '/etc/hosts'
  }

  try {
    let allvalue = fs.readFileSync(hostsPath).toString()
    allvalue = allvalue.concat(lineValue)
    let fd2 = fs.openSync(hostsPath, 'w')
    fs.writeSync(fd2, allvalue)
    fs.closeSync(fd2)
    return true
  } catch (e) {
    console.log('addHostsOne', e.toString())
    return false
  }
}

// 验证域名是否存在
export const findHostsOne = (args) => {
  let lineValue = args.ip + args.name

  let sysType = os.platform()
  let hostsPath = ''
  if ('win32' == sysType) {
    hostsPath = 'C:\\Windows\\System32\\drivers\\etc\\hosts'
  } else if ('linux' == sysType) {
    hostsPath = '/etc/hosts'
  }

  try {
    let hostsValue = fs.readFileSync(hostsPath).toString()
    let hostList = hostsValue.split('\n')
    for (let i = 0; i < hostList.length; i++) {
      let item = hostList[i]
      let temp = item.replace(' ', '')
      if (lineValue == temp) {
        return true
      }
    }
    return false
  } catch (e) {
    console.log('findHostsOne', e.toString())
    return false
  }
}
