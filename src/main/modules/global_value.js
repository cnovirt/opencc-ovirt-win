//添加全局通用变量

export var mainWindow = null

export const setMainWindow = (obj) => {
  mainWindow = obj
}

//登录成功之后保存的用户信息
export var USERINFO = {
  // centerip: { ip: '192.168.105.248', name: '华东数据中心', port: '3000' },
  // password: 'smartvm',
  // username: 'admin',
  // userid: '1',
  // fullname: 'Administrator',
  // group: 'EvmGroup-super_administrator',
}

export const setUserInfo = (value) => {
  USERINFO = value
}

export var TOKEN = '' //用户保存用户的token信息
export const setToken = (value) => {
  TOKEN = value
}

// 保存全局变量，　客户端是否是登出状态
export var USEROUT = true
export const setUserOut = (valeu) => {
  USEROUT = valeu
}

export const GLOBEL_CONFIG_PATH = './configure.json'
export const GLOBEL_VERSION_PATH = './version'

// 终端类型 -- 这里添加终端类型, 添加更多的系统终端
export const GET_TERMINAL_TYPE = () => {
  return 'Windows终端'
}
