/**
 * 新闻相关的请求模块
 */
import request from '@/utils/request'

/**
* 获取文章列表
*/
export const getArticleList = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    // Body 参数使用data 设置
    // Query 参数使用 params 设置
    // Headers 参数使用 headers设置
    params
  })
}

/**
* 获取频道列表
*/
export const getChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}

/**
* 删除文章
*/
export const deleteArticle = articleId => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/articles/${articleId}`
  })
}
