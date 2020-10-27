import { ipcMain } from 'electron'

import * as global_value from './global_value'

import * as opencc_api from './opencc_api'

import * as setHosts from './sethosts'

const os = require('os')
const fs = require('fs')

export default () => {
  // 获取单个虚拟机详细信息
  ipcMain.on('vm-vminfo', (event, vmid) => {
    console.log('vm-vminfo', vmid)
    opencc_api
      .GET_VM_INFO(vmid)
      .then((res) => {
        let vminfo = {}
        vminfo['id'] = res.data.id
        vminfo['name'] = res.data.name
        vminfo['status'] = res.data.status
        vminfo['os'] = res.data.os.type
        vminfo['hostName'] = res.data.display.certificate.subject.split(
          'CN='
        )[1]
        vminfo['hostIp'] = res.data.display.address
        vminfo['port'] = res.data.display.secure_port
        vminfo['ca'] = res.data.display.certificate.content
        vminfo['description'] = res.data.description

        console.log('vm-vminfo', vmid, vminfo)

        global_value.mainWindow.webContents.send(
          'vm-vminfo-'.concat(vmid),
          vminfo
        )
      })
      .catch((res) => {})
  })

  // 虚拟机操作 : 开机, 关机, 断电
  ipcMain.on('vm-action', (event, args) => {
    // {'vmid':this.vmcard.id,'active':active}
    console.log('vm-action:args:', args)

    opencc_api
      .ACTION_VM(args.vmid, args.active)
      .then((res) => {
        console.log('vm-action:res:', res.status, res.data)
        global_value.mainWindow.webContents.send(
          'vm-action-'.concat(args.vmid),
          res.data
        )
      })
      .catch((res) => {
        console.log('vm-action:error')
        res.status = 'error'
        global_value.mainWindow.webContents.send(
          'vm-action-'.concat(args.vmid),
          res.data
        )
      })
  })

  // 进入虚拟机
  ipcMain.on('vm-enter', (event, args) => {
    console.log('vm-enter', args)

    var fd2 = fs.openSync('./vv.pem', 'w')
    fs.writeSync(fd2, args.ca)
    fs.closeSync(fd2)

    // 判断域名是否存在, 如果不存在, 添加域名
    if (!setHosts.findHostsOne({ ip: args.hostIp, name: args.hostName })) {
      setHosts.addHostsOne({ ip: args.hostIp, name: args.hostName })
    }

    // 返回数据
    let retuData = {
      status: false,
      error: '',
      data: '',
    }

    opencc_api
      .GET_VM_TICKET(args.id)
      .then((res) => {
        console.log('GET_VM_TICKET', res.status, res.data)
        /*{ status: 'complete',
          ticket: { expiry: '7200', value: '8cuMjVQhylVI' } }
      */
        if (200 == res.status) {
          let ticket = res.data.ticket.value

          let remote_viewer_path = ''
          let sysType = os.platform()
          if ('win32' == sysType) {
            remote_viewer_path = '.\\VirtViewer\\bin\\remote-viewer.exe'
          } else if ('linux' == sysType) {
            remote_viewer_path = '/usr/bin/window'
          }
          let entervm_str = remote_viewer_path.concat(
            ' "spice://',
            args.hostName,
            '/?tls-port=',
            args.port,
            '&password=',
            ticket,
            '" --spice-ca-file=./vv.pem'
            // ' -f'
          )

          console.log('vm-enter', entervm_str)

          const exec = require('child_process').exec
          const last = exec(entervm_str)

          last.stdout.on('data', (data) => {
            console.log('标准输出：' + data)
          })

          last.on('exit', (code) => {
            console.log('虚拟机已关闭，退出代码:' + code)
            if (code == 0) {
              retuData['status'] = true
              retuData['error'] = ''
              retuData['data'] = '虚拟机('.concat(
                args.id,
                ')',
                args.name,
                '正常关闭'
              )
            } else {
              retuData['status'] = false
              retuData['error'] = '虚拟机('.concat(
                args.id,
                ')',
                args.name,
                '异常退出，退出码:',
                code
              )
              retuData['data'] = ''
            }
            global_value.mainWindow.webContents.send(
              'vm-enter-'.concat(args.id),
              retuData
            )
          })
          global_value.mainWindow.webContents.send(
            'vm-enter-'.concat(args.id),
            '成功运行'
          )
        } else {
          retuData['error'] = '获取ticket失败'
          global_value.mainWindow.webContents.send(
            'vm-enter-'.concat(args.id),
            retuData
          )
        }
      })
      .catch((res) => {
        retuData['error'] = '获取ticket异常'
        global_value.mainWindow.webContents.send(
          'vm-enter-'.concat(args.id),
          retuData
        )
      })
  })
}
