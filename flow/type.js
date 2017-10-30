declare type AxiosConfig = {
  url?: string,
  method?: 'get' | 'post' | 'put' | 'delete' | 'options' | 'patch',
  baseURL?: string,
  transformRequest?: Array<Function>,
  transformResponse?: Array<Function>,
  headers?: Object,
  params?: Object,
  paramsSerializer?: Function,
  data?: any,
  timeout?: number,
  withCredentials?: boolean,
  adapter?: Function,
  auth?: Object,
  responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream',
  xsrfCookieName?: string,
  xsrfHeaderName?: string,
  onUploadProgress?: Function,
  onDownloadProgress?: Function,
  maxContentLength?: number,
  validateStatus?: Function,
  maxRedirects?: number,
  httpAgent?: Object,
  httpsAgent?: Object,
  proxy?: Object,
  cancelToken?: Object
}
declare type AxiosResponse = {
  data: Object,
  status: number,
  statusText: string,
  headers: Object,
  config: AxiosConfig,
  request: Object
}
declare type AxiosError = {
  response: AxiosResponse,
  request: Object,
  message: string,
  config: AxiosConfig
}
declare type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'options' | 'patch'
declare type VueStore = {
  state: Object,
  getters: Object
}
