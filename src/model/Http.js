/* @flow */
/**
 * 远程服务调用模块
 * @version 1.0
 * @author HanL
 */
import axios from 'axios'
import ApplicationError from './ApplicationError'

const REQUEST_TYPE: Object = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
  OPTIONS: 'options',
  PATCH: 'patch'
}

function getHttpStatusMessage (status: number): ApplicationError {
  let ret = new ApplicationError('MAM001E')
  if (status !== null && status !== undefined) {
    let id: ?string = null
    switch (status) {
      case 404:
        id = '404'
        break
      default:
        id = '001'
    }
    ret = new ApplicationError(`MAM${id}E`)
  }
  return ret
}

function execute (type: HttpMethod, url: string, data: any, config: AxiosConfig = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    let p: ?Promise<any> = null
    const axiosConfig: AxiosConfig = config
    if (type === REQUEST_TYPE.GET || type === REQUEST_TYPE.DELETE ||
      type === REQUEST_TYPE.OPTIONS) {
      axiosConfig.params = data
      p = axios[type](url, axiosConfig)
    } else {
      p = axios[type](url, data, axiosConfig)
    }
    p.then((res: AxiosResponse) => {
      resolve(res)
    }).catch((error: AxiosError) => {
      let rejectError: ApplicationError = new ApplicationError('MAM001E')
      if (error.response !== null && error.response !== undefined &&
        typeof error.response.status === 'number') {
        rejectError = getHttpStatusMessage(error.response.status)
      }
      if (error.message.indexOf('timeout of') === 0) {
        const timeout: ?string | ?number = error.config.timeout
        if (timeout === undefined || timeout === null) {
          rejectError = new ApplicationError('MAM007E')
        } else {
          rejectError = new ApplicationError('MAM003E', [timeout])
        }
      }
      reject(rejectError)
    })
  })
}

export default class Http {
  static get (url: string, data: any, config: AxiosConfig): Promise<any> {
    return execute(REQUEST_TYPE.GET, url, data, config)
  }

  static post (url: string, data: any, config: AxiosConfig): Promise<any> {
    return execute(REQUEST_TYPE.POST, url, data, config)
  }

  static put (url: string, data: any, config: AxiosConfig): Promise<any> {
    return execute(REQUEST_TYPE.PUT, url, data, config)
  }

  static delete (url: string, data: any, config: AxiosConfig): Promise<any> {
    return execute(REQUEST_TYPE.DELETE, url, data, config)
  }

  static options (url: string, data: any, config: AxiosConfig): Promise<any> {
    return execute(REQUEST_TYPE.OPTIONS, url, data, config)
  }

  static patch (url: string, data: any, config: AxiosConfig): Promise<any> {
    return execute(REQUEST_TYPE.PATCH, url, data, config)
  }
}
