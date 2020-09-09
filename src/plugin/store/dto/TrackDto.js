/**
 * 埋点数据实体
 */
class TrackDto {
  constructor (componentName, componentLabel, eventName, pageName, prevPageName, querys) {
    // 页面名称（中文）
    this.pageName = pageName
    // 组件名称（英文）
    this.componentName = componentName
    // 组件名称（中文）
    this.componentLabel = componentLabel
    // 事件名称（英文）
    this.eventName = eventName
    // 前页面名称（中文）
    this.prevPageName = prevPageName
    // 当前页面url中的queryparameter对象
    this.querys = querys
  }
}
export default TrackDto
