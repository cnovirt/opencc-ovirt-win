import { ipcMain } from 'electron'

import * as opencc_api from './opencc_api'

import * as myconfig from './configure'

// 添加中心主要功能
// 注意 : 这个功能的界面在模态框中, 所以主线程给渲染线程发信号, 需要对与的窗口对象
export default () => {
  // 获取数据 -- 初始化界面, 收到信号, 将配置文件中的数据读取并返回
  ipcMain.on('centerip-get-centerinfo', (event, args) => {
    console.log('centerip-get-centerinfo', args)

    let centerinfo = []
    let infoData = myconfig.get_value('centerinfo')
    if (infoData == undefined) {
      centerinfo = []
    } else {
      centerinfo = infoData
    }

    let retuData = {
      // 返回的数据格式
      data: centerinfo,
      status: true,
      error: '',
    }
    global.child.webContents.send('centerip-get-centerinfo-callbak', retuData)
  })

  // 添加中心 -- 获取表单数据, 验证中心是否存在, 如果存在返回成功
  ipcMain.on('centerip-add-ip', (event, centervalue) => {
    console.log('centerip-add-ip', centervalue)
    let retuData = {
      data: { name: false, ip: false },
      status: false,
      error: '',
    }

    // 配置文件数据 -- 中心列表数据
    let centerinfo = myconfig.get_value('centerinfo')
    console.log('centerinfo', centerinfo)
    // 检验 - 中心是否存在
    for (let index in centerinfo) {
      if (centerinfo[index]['ip'] == centervalue.ip) {
        // 中心存在不能添加
        retuData['data']['ip'] = false
        retuData['error'] = 'IP/域名已存在'
        global.child.webContents.send('centerip-add-ip-callbak', retuData)
        return
      }
    }
    // 中心不存在能添加
    retuData['data']['ip'] = true

    // 检验 - 中心名称是否存在
    for (let index in centerinfo) {
      if (centerinfo[index]['name'] == centervalue.name) {
        // 中心名称存在不能添加
        retuData['data']['name'] = false
        retuData['error'] = '名称已存在'
        global.child.webContents.send('centerip-add-ip-callbak', retuData)
        return
      }
    }
    // 中心名称不存在能添加
    retuData['data']['name'] = true

    // 验证是否是 ovirt 中心
    let ip_port = centervalue.ip + ':' + centervalue.port
    opencc_api
      .ADD_CENTER_IP(ip_port)
      .then((res) => {
        console.log('ADD_CENTER_IP', res.status, res.data)

        if (200 == res.status) {
          retuData['status'] = true

          // 将客户端的信息注册到管理台中 : wangsong
          // registerFun(ip_port)

          // 请求成功, 写入配置文件
          centerinfo.push(centervalue)
          myconfig.update_value('centerinfo', centerinfo)

          global.child.webContents.send('centerip-add-ip-callbak', retuData)
        } else {
          retuData['status'] = false
          retuData['error'] = '请求结果异常'
          global.child.webContents.send('centerip-add-ip-callbak', retuData)
        }
      })
      .catch((res) => {
        console.log('ADD_CENTER_IP:catch:', res)
        retuData['status'] = false
        retuData['error'] = '网络请求异常'
        global.child.webContents.send('centerip-add-ip-callbak', retuData)
      })
  })

  // 删除一条中心数据
  ipcMain.on('centerip-del-row', (event, args) => {
    let centerinfo = myconfig.get_value('centerinfo')
    let index = -1
    for (let i = 0; i < centerinfo.length; i++) {
      if (centerinfo[i].ip == args.ip) {
        index = i
        break
      }
    }
    console.log('centerip-del-row', index, args, centerinfo[index])

    if (index < 0) {
      return
    }
    centerinfo.splice(index, 1)
    myconfig.update_value('centerinfo', centerinfo)
  })
}
