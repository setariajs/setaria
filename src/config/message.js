// M[Message Catagory]XXX[Message Type]
// Message Catagory:
//   AM Application Message
// Message Type:
//   E Error
//   I Info
//   W Warning
const MESSAGE = {
  'SYSMSG-SERVICE-UNKNOWN-ERROR': '调用远程服务的过程中出现未知错误，请重试或联系管理员。',
  'SYSMSG-TIMEOUT': '服务未在预定时间（{0}秒）内返回结果，请联系管理员或稍后重试。',
  'SYSMSG-CLIENT-UNKNOWN-ERROR': '客户端出现错误，请重试或联系管理员。',
  'SYSMSG-SERVICE-NETWORK-ERROR': '远程服务器无法连接，请联系管理员或稍后重试。',
  'SYSMSG-NOT-SUPPORT-STORAGE': '当前浏览器设置不允许访问本地存储空间。',
  'SYSMSG-SERVICE-STATUS-400': '无效的请求。',
  'SYSMSG-SERVICE-STATUS-401': '当前请求需要用户验证。',
  'SYSMSG-SERVICE-STATUS-403': '远程服务拒绝执行。',
  'SYSMSG-SERVICE-STATUS-404': '请求所希望得到的资源未被在服务器上发现。'
}
export default MESSAGE
