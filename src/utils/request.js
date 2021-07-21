/**
 * 基于axios请求模块
 */
import axios from 'axios'

// 创建一个axios实例，说白了就是复制一个axios
// 我们通过这个实例去请求，把需要的配置配置给这个实例来使用
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net' // 请求的基础路径
})

// 请求拦截器

// 相应拦截器

// 导出请求方法
export default request

// 谁要使用谁就加载requeat 模块
