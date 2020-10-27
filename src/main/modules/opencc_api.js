//二次封装 manageiq api
import { request_api } from './request_api'

const URLprotocol = 'https://'

//获取虚拟机详细信息
export const GET_VM_INFO = async (vmid) => {
  let dict_args = {
    method: 'get',
    url: URLprotocol.concat(getCenterIpPort(), '/ovirt-engine/api/vms/', vmid),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: getToken(),
    },
  }
  return await request_api(dict_args)
}

//获取虚拟机ticket
export const GET_VM_TICKET = async (vmid) => {
  var dict_args = {
    method: 'post',
    url: URLprotocol.concat(
      getCenterIpPort(),
      '/ovirt-engine/api/vms/',
      vmid,
      '/ticket'
    ),
    headers: {
      'Content-Type': 'application/xml',
      Accept: 'application/json',
      Authorization: getToken(),
    },
    data: '<action><ticket></ticket></action>',
  }
  return await request_api(dict_args)
}

//操作虚拟机开机关机等
export const ACTION_VM = async (vmid, action) => {
  let dict_args = {
    method: 'post',
    url: URLprotocol.concat(
      getCenterIpPort(),
      '/ovirt-engine/api/vms/',
      vmid,
      '/',
      action
    ),
    headers: {
      'Content-Type': 'application/xml',
      Accept: 'application/json',
      Authorization: getToken(),
    },
    // action：start（开机）、shutdown（关机）、stop（断电）、reboot（重启）、refresh (刷新)
    data: '<action/>',
  }
  return await request_api(dict_args)
}

//获取token
export const GET_TOKEN = async (args) => {
  console.log('GET_TOKEN args:', args)
  let dict_args = {
    method: 'post',
    url: URLprotocol.concat(getCenterIpPort(), '/ovirt-engine/sso/oauth/token'),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    data: args,
  }
  return await request_api(dict_args)
}

//获取所有虚拟机信息
export const GET_VMS_INFO = async () => {
  let dict_args = {
    method: 'get',
    url: URLprotocol.concat(getCenterIpPort(), '/ovirt-engine/api/vms'),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: getToken(),
    },
  }
  return await request_api(dict_args)
}

// 登出用户
export const LOG_OUT = async (args) => {
  let dict_args = {
    method: 'post',
    url: URLprotocol.concat(getCenterIpPort(), '/terminalapi/logout'),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: getToken(),
    },
    data: args,
  }
  return await request_api(dict_args)
}

// ----------------------- 添加中心界面 start ------------------------------
// 添加中心 : 检查是否是ovirt引擎
export const ADD_CENTER_IP = async (ip_port) => {
  let dict_args = {
    method: 'get',
    url: URLprotocol.concat(ip_port, '/ovirt-engine/services/health'),
  }
  return await request_api(dict_args)
}

// 登录成功向中心注册终端信息
export const REGISTER_DATA = async (ip_port, data) => {
  let dict_args = {
    method: 'post',
    url: URLprotocol.concat(ip_port, '/terminalapi/register'),
    headers: {},
    data: data,
  }
  return await request_api(dict_args)
}
// ----------------------- 添加中心界面 end ------------------------------

// 登录用户
export const SET_LOGIN = async (args) => {
  let dict_args = {
    method: 'post',
    url: URLprotocol.concat(getCenterIpPort(), '/terminalapi/login'),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: getToken(),
    },
    data: args,
  }
  return await request_api(dict_args)
}

// 获取接口访问需要的中心地址 ip+port
// 注意 : 这个只在成功添加中心后才能使用
const getCenterIpPort = () => {
  let g_common = require('./global_value')
  let ip = g_common.USERINFO.centerip.ip
  let port = g_common.USERINFO.centerip.port
  return ip.concat(':', port)
}

// 获取全局变量 token
// 注意 : 这个只在用户登录成功后才能使用
const getToken = () => {
  let g_common = require('./global_value')
  return g_common.TOKEN
}
