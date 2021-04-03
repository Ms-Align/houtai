// 用户登录
import request from '../utils/request.js'
export const login = function (data) {
  return request({ method: 'POST', url: '/mp/v1_0/authorizations', data: data })
}
export const getUserProfile = function () {
  const user = JSON.parse(window.localStorage.getItem('user'))
  if (user) {
    return request({
      method: 'GET',
      url: '/mp/v1_0/user/profile',
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    })
  }
}
// 提交头像跟新
export const upLoadUserPhoto = (data) => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/photo',
    data
  })
}
// 更新用户信息
export const updateUserInfo = (data) => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/profile',
    data
  })
}
