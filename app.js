//app.js
App({
  onLaunch() {
    // 初始化接口请求工具
    require('./utils/request')
    // 垫片 Promise.property.finally
    require('./utils/pollify')
  },
})