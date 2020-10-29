const os = require('os')
const util = require('util')
const fs = require('fs')

import * as global_value from './global_value'
// import * as shellExec from './shell_exec'

// 获取系统时间
const getSystemTime = () => {
  // 对Date的扩展，将 Date 转化为指定格式的String
  // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
  // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
  // 例子：
  // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
  // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
  Date.prototype.Format = function(fmt) {
    var o = {
      'M+': this.getMonth() + 1, //月份
      'd+': this.getDate(), //日
      'H+': this.getHours(), //小时
      'm+': this.getMinutes(), //分
      's+': this.getSeconds(), //秒
      'q+': Math.floor((this.getMonth() + 3) / 3), //季度
      S: this.getMilliseconds(), //毫秒
    }
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (this.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    for (var k in o)
      if (new RegExp('(' + k + ')').test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)
        )
    return fmt
  }

  return new Date().Format('yyyy-MM-dd HH:mm:ss')
}

// 操作系统类型
const getSystemType = () => {
  // darwin', 'freebsd', 'linux', 'sunos' , 'win32'
  return os.platform()
}

// 操作系统名称
const getSystemName = () => {
  // 基于linux的返回linux,基于苹果的返回Darwin,基于windows的返回Windows_NT
  // linux : linux
  // apple mac : Darwin
  // window : Windows_NT
  return os.type()
}

// CPU类型
const getCpuModel = () => {
  return os.cpus()[0].model
}

// 终端类型
const getTerminalType = () => {
  return global_value.GET_TERMINAL_TYPE()
}

// 获取网络信息
/*{ address: '192.168.8.111',
    netmask: '255.255.255.0',
    family: 'IPv4',
    mac: '6c:0b:84:91:4e:2d',
    internal: false,
    cidr: '192.168.8.111/24' }*/
const getNetWorkInfo = () => {
  let systemType = os.platform()
  let networkDict = os.networkInterfaces()
  if ('win32' == systemType) {
    for (let key in networkDict) {
      if (key.indexOf('以太网') < 0) continue

      let net = networkDict[key][0]
      if ('IPv4' == net.family) {
        return net
      } else {
        return networkDict[key][1]
      }
    }
    return false
  } else if ('linux' == systemType) {
    for (let key in networkDict) {
      if (key.indexOf('eno1') < 0) continue

      let net = networkDict[key][0]
      if ('IPv4' == net.family) {
        return net
      } else {
        return networkDict[key][1]
      }
    }
    return false
  } else if ('darwin' == systemType) {
    // 苹果系统
  }
}

// ip地址
const getIPAddr = () => {
  let net = getNetWorkInfo()
  if (net) {
    return net.address
  } else {
    return '127.0.0.1'
  }
}
// mac地址
const getMacAddr = () => {
  let net = getNetWorkInfo()
  if (net) {
    return net.mac
  } else {
    return '00.00.00.00.00.00'
  }
}

// 获取客户端版本号
const getVersion = () => {
  if (fs.existsSync(global_value.GLOBEL_VERSION_PATH)) {
    let version = fs.readFileSync(global_value.GLOBEL_VERSION_PATH)
    return version.toString()
  } else {
    return '1.0.0'
  }
}

// 向中心注册客户端的信息
const registerData = () => {
  let data = {
    terminal_version: getVersion(),
    ip: getIPAddr(),
    mac: getMacAddr(),
    terminal_type: getTerminalType(),
    system_type: getSystemType(),
    cpu_type: getCpuModel(),
    terminal_time: getSystemTime(),
  }
  return data
}

export {
  getVersion,
  getCpuModel,
  getSystemTime,
  getSystemName,
  getMacAddr,
  getTerminalType,
  registerData,
}

// console.log(getIPAddr())
// console.log(getMacAddr())
// console.log(getCurTime())
