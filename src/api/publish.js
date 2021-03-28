import request from '../utils/request.js'
export const publish = (data, draft = false) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    params: {
      draft: draft
    },
    data
  })
}
