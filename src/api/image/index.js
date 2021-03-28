import request from '../../utils/request.js'

// 上传图片素材
export const upLoadImage = (data) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    data
  })
}
// 收藏素材
export const onCollect = (imageId, collect) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/user/images/${imageId}`,
    data: {
      collect
    }
  })
}
// 删除图片
export const onDelete = (imageId) => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/user/images/${imageId}`
  })
}
