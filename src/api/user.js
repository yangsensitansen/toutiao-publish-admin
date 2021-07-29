/**
 * 用户相关的请求模块
 */
import request from '@/utils/request'

/**
* 用户登录
*/
export const login = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/authorizations',
    data
  })
}

/**
* 获取用户个人信息
*/
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile'
    // 后端要求把需要授权的用户身份放到请求头中
    // axios 可以通过headers选项设置请求头
    // headers: {
    //   // 属性名和值都得看接口的要求
    //   // 属性名： 接口要求
    //   // Bearer空格token数据
    //   Authorization: `Bearer ${user.token}`
    // }
  })
}
