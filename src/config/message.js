// M[Message Catagory]XXX[Message Type]
// Message Catagory:
//   AM Application Message
// Message Type:
//   E Error
//   I Info
//   W Warning
const MESSAGE = {
  MAM001E: '服务调用出现网络错误，无法调用指定服务，请检查网络。',
  MAM002E: '由于您长时间未操作，登录状态已过期，请重新登录。',
  MAM003E: '服务未在预定时间（{0}秒）内返回结果，请联系管理员或稍后重试。',
  MAM004E: '客户端出现错误，请重试或联系管理员。',
  MAM005E: '认证过期或无权访问此服务，请点击注销按钮重新登录。',
  MAM006E: '无法找到指定的画面。',
  MAM007E: '服务调用出现未知错误，请重试或联系管理员。',
  MAM008E: '无法找到指定的{0}定义文件。'
}
export default MESSAGE
