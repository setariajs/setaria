// M[Message Catagory]XXX[Message Type]
// Message Catagory:
//   AM Application Message
// Message Type:
//   E Error
//   I Info
//   W Warning
const MESSAGE = {
  MAM001E: '调用远程服务的过程中出现未知错误，请重试或联系管理员。',
  MAM002E: '由于您长时间未操作，登录状态已过期，请重新登录。',
  MAM003E: '服务未在预定时间（{0}秒）内返回结果，请联系管理员或稍后重试。',
  MAM004E: '客户端出现错误，请重试或联系管理员。',
  MAM005E: '认证过期或无权访问此服务，请点击注销按钮重新登录。',
  MAM006E: '无法找到指定的画面。',
  MAM007E: '请求的服务访问超时，请联系管理员或稍后重试。',
  MAM008E: '无法找到指定的{0}定义文件。',
  MAM009E: '当前浏览器设置不允许访问本地存储空间。',
  MAM404E: '请求的服务不存在。'
}
export default MESSAGE
