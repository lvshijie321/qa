const { BASE_URL, SUCCESS_STATUS, SUCESS_NO } = require('../config/request')
const apis = require('../config/api')
const request = opt => data => new Promise((resolve, reject) => {
  wx.request({
    url: `${BASE_URL}/${opt.url}`,
    data,
    method: opt.method,
    header: { 'content-type': 'application/json' },
    success(res) {
      res.statusCode === SUCCESS_STATUS && res.data.errno === SUCESS_NO
        ? resolve(res.data.data)
        : reject(res.data)
    },
    fail() {
      reject()
    },
  })
})

wx.$request = {}
apis.forEach(item => wx.$request[item.name] = request(item))

 