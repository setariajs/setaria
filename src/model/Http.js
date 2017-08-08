/**
 * 远程服务调用模块
 * @version 1.0
 * @author HanL
 */
import axios from 'axios'
import ApplicationError from './ApplicationError'

const REQUEST_TYPE = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete'
}

function execute (type, url, data, config = {}) {
  let ret = null
  let p = null
  const axiosConfig = config
  if (type === REQUEST_TYPE.GET) {
    axiosConfig.params = data
    p = axios[REQUEST_TYPE.GET](url, axiosConfig)
  } else {
    p = axios[type](url, data, axiosConfig)
  }

  ret = new Promise((resolve, reject) => {
    p.then((res) => {
      resolve(res)
    }).catch((error) => {
      let rejectError = error
      if (error.message.indexOf('timeout of') === 0) {
        // TODO 取得配置的服务调用超时时间
        const timeout = 1000
        rejectError = new ApplicationError('MAM003E', [timeout])
      } else if (error.response) {
        // 服务器错误
        if (error.response.status >= 500) {
          rejectError = new ApplicationError('MAM001E')
        }
      }
      reject(rejectError)
    })
  })
  return ret
}

export default class Http {
  static get (url, data, config) {
    return execute(REQUEST_TYPE.GET, url, data, config)
  }

  static post (url, data, config) {
    return execute(REQUEST_TYPE.POST, url, data, config)
  }

  static put (url, data, config) {
    return execute(REQUEST_TYPE.PUT, url, data, config)
  }

  static delete (url, data, config) {
    return execute(REQUEST_TYPE.DELETE, url, data, config)
  }
}
