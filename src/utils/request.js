/**
 * 基于axios请求模块
 */
import axios from 'axios'
import JSONbig from 'json-bigint'

// 创建一个axios实例，说白了就是复制一个axios
// 我们通过这个实例去请求，把需要的配置配置给这个实例来使用
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net', // 请求的基础路径
  // 定义后端返回的原始数据的处理
  // 参数data 就是后端返回的原始数据（未经处理的JSON 格式）
  transformResponse: [function (data) {
    try {
      return JSONbig.parse(data)
    } catch (err) {
      return data
    }
  }]
})

// 请求拦截器 所有请求都经过这里
request.interceptors.request.use(function (config) {
  // config 是当前请求相关的配置信息对象 是可以修改的
  const user = JSON.parse(window.localStorage.getItem('user'))
  // 如果登录用户信息，则同意定制token
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
// 相应拦截器

// 导出请求方法
export default request

// 谁要使用谁就加载requeat 模块
