import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      // 登录界面 -- 刷脸
      path: '/login-face-user-page',
      name: 'login-face-page',
      component: require('@/components/LoginFacePage').default,
    },
    {
      // 登录界面 -- 二维码
      path: '/login-qrcode-page',
      name: 'login-qrcode-page',
      component: require('@/components/LoginQRcodePage').default,
    },
    {
      // 注册界面
      path: '/register-page',
      name: 'register-page',
      component: require('@/components/RegisterPage').default,
    },
    {
      // 登录成功 -- 主界面
      path: '/main-page',
      name: 'main-page',
      component: require('@/components/MainPage').default,
    },
    {
      // 配置界面(登录配置)
      path: '/config-page',
      name: 'config-page',
      component: require('@/components/ConfigPage').default,
      children: [
        { // 云中心(添加中心)
          path: 'centerip',
          component: require('@/components/ConfigSubPage/CenterIpPage').default,
        },
        { // 域名映射
          path: 'sethosts',
          component: require('@/components/ConfigSubPage/SetHostsPage').default,
        },
      ],
    },

    // 设置列表(模态框)
    {
      // 设置列表(模态框) -- 关于
      path: '/set-about-page',
      name: 'set-about-page',
      component: require('@/components/SetBox/AboutPage').default,
    },
    {
      // 设置列表(模态框) -- 升级
      path: '/set-update-page',
      name: 'set-update-page',
      component: require('@/components/SetBox/UpdatePage').default,
    },
    {
      // 设置列表(模态框) -- 安装
      path: '/set-install-page',
      name: 'set-install-page',
      component: require('@/components/SetBox/InstallPage').default,
    },
    {
      // 登录界面
      path: '/',
      name: 'login-page',
      component: require('@/components/LoginPage').default,
    },
    {
      // 错误url跳转登录界面
      path: '*',
      redirect: '/',
    },
  ],
})
