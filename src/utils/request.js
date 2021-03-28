// 该模块封装了请求工具
import axios from 'axios'
import bigInt from 'json-bigint'
// 创建一个请求实例，配置请求的基本信息
const request = axios.create({
  // 请求的地址会以此为相对地址
  baseURL: 'http://api-toutiao-web.itheima.net',
  // 配置对原始数据的转换方式
  transformResponse: [function (data) {
    // axios默认使用JSON转换
    try {
      return bigInt.parse(data)
    } catch {
      return data
    }
  }]
})

// 拦截请求，添加用户身份
request.interceptors.request.use(
  function (config) {
    // config是拦截到的请求，包含所有配置信息，在此对请求进行修改
    const user = JSON.parse(window.localStorage.getItem('user'))
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  // 请求失败经过这里
  function (error) {
    return Promise.reject(error)
  }
)
// 导出模块
export default request
