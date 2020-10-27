const fs = require('fs')
import * as global_value from './global_value'

let GLOBEL_CONFIG_PATH = global_value.GLOBEL_CONFIG_PATH
  ? global_value.GLOBEL_CONFIG_PATH
  : './configure.json'

// 初始化配置文件 -- 判断文件是否存在, 如果不存在就创建, 将基本填充基本数据
const init_configure = () => {
  if (!fs.existsSync(GLOBEL_CONFIG_PATH)) {
    var fd1 = fs.openSync(GLOBEL_CONFIG_PATH, 'w')
    fs.writeSync(
      fd1,
      JSON.stringify({
        centerinfo: [
          // {
          //   ip: '192.168.105.248',
          //   name: 'center',
          //   port: '3000',
          // },
        ],
        userinfo: {
          // autologin: true,
          // centerip: {
          //   ip: '192.168.105.248',
          //   name: 'center',
          //   port: '3000',
          // },
          // password: 'smartvm',
          // remberpasswd: true,
          // username: 'admin',
          // userid: '1',
          // fullname: 'Administrator',
          // group: 'EvmGroup-super_administrator',
        },
      })
    )
    fs.closeSync(fd1)
  }
}

// 读取配置文件信息
const get_value = (key) => {
  let json_value = JSON.parse(fs.readFileSync(GLOBEL_CONFIG_PATH))
  return json_value[key]
}

// 添加配置文件数据 -- 如果多数据, 将value保存为字典数据
const update_value = (key, value) => {
  let json_value = JSON.parse(fs.readFileSync(GLOBEL_CONFIG_PATH))
  json_value[key] = value
  let str_value = JSON.stringify(json_value)
  var fd2 = fs.openSync(GLOBEL_CONFIG_PATH, 'w')
  fs.writeSync(fd2, str_value)
  fs.closeSync(fd2)
}

// 导出函数
export { init_configure, get_value, update_value }
