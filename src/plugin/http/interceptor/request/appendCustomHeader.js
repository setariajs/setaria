import { getStore } from '../../../store/index'
import sdkConfig from '../../../../core/config'
import { LOG_TYPE, STORE_KEY } from '../../../../shared/constants'
import { isNotEmpty } from '../../../../util/lang'

function getLogControlType (componentLabel, pageName, prevPageName = '', prevPageComponentLabel = '', querys, eventName, tracingList = []) {
  let currentPageName = ''
  if (isNotEmpty(pageName)) {
    const pageNameList = pageName.split(',')
    currentPageName = pageNameList[pageNameList.length - 1]
  }
  // 4.查询
  if (componentLabel === '查询') {
    return LOG_TYPE.SEARCH
  }
  // 7.转单
  if (componentLabel === '转发') {
    return LOG_TYPE.TRANSFER
  }
  // 审批查看页且在此页面上点击了审批或提交按钮
  if ((currentPageName.indexOf('审批') !== -1 || currentPageName.indexOf('查看') !== -1) &&
    (componentLabel === '审批' || componentLabel === '提交')) {
    // 没有前页面的场合
    if (prevPageName === '' ||
    // 前页面为工作台，且点击的按钮为审批按钮的场合
      (prevPageName && prevPageName.indexOf('工作台') !== -1 && prevPageComponentLabel === '审批')) {
      // 2.审批
      return LOG_TYPE.APPROVAL
    }
    // TODO 填单判断逻辑
    const isBpmSubmitStep = false
    if (isBpmSubmitStep) {
      // 1.填单
      return LOG_TYPE.CREATE
    }
    // TODO 修改判断逻辑
    const isBpmReSubmitStep = false
    if (isBpmReSubmitStep) {
      // 5.修改
      return LOG_TYPE.UPDATE
    }
    if (prevPageName.indexOf('创建') !== -1) {
      // 1.填单
      return LOG_TYPE.CREATE
    }
    if (prevPageName.indexOf('修改') !== -1) {
      // 5.修改
      return LOG_TYPE.UPDATE
    }
  } else if ((currentPageName.indexOf('审批') !== -1 || currentPageName.indexOf('查看') !== -1) &&
    (eventName === 'init' ||
    prevPageComponentLabel === '查看')) {
    return LOG_TYPE.VIEW
  }
  return ''
}

export default function appendCustomHeader (config) {
  if (config && (config.headers === undefined || config.headers === null)) {
    config.headers = {}
  }
  const headers = config.headers
  const storeInstance = getStore()
  if (storeInstance) {
    // 开发环境
    // 业务公共辅助信息
    const oddNumber = storeInstance.getters[STORE_KEY.GET_CURRENT_ODD_NUMBER]
    if (isNotEmpty(oddNumber)) {
      headers['oddNumber'] = window.encodeURIComponent(oddNumber)
    }
    // 埋点
    const tracingBean = storeInstance.getters[STORE_KEY.GET_LASTEST_TRACK]
    if (tracingBean) {
      const {
        componentLabel,
        pageName,
        querys,
        eventName
      } = tracingBean
      if (sdkConfig.log === true) {
        const { pageName: prevPageName, componentLabel: prevPageComponentLabel } = storeInstance.getters[STORE_KEY.GET_PREV_PAGE_TRACK](pageName) || {}
        const tracingList = storeInstance.getters[STORE_KEY.GET_TRACK_LIST]
        const logControlType = getLogControlType(componentLabel, pageName, prevPageName, prevPageComponentLabel, querys, eventName, tracingList)
        console.log('日志操作类型', logControlType)
        // 日志操作类型
        if (isNotEmpty(logControlType)) {
          headers['logOperationType'] = logControlType
        }
      }
      let eventPage = storeInstance.getters[STORE_KEY.GET_CURRENT_PAGE_MODULE] || []
      eventPage = eventPage.map(item => item.label).concat(pageName).join(',')
      // 埋点事件触发时所在页面名称
      // 格式：一级模块,二级模块,三级页面  例：采购管理,框架合同,框架合同工作台
      if (isNotEmpty(pageName)) {
        headers['eventPage'] = window.encodeURIComponent(eventPage)
      }
      // 组件显示名称
      if (isNotEmpty(componentLabel)) {
        headers['eventComponent'] = window.encodeURIComponent(componentLabel)
      }
      // 组件触发的事件
      if (isNotEmpty(eventName)) {
        headers['eventType'] = eventName
      }
    }
  }
  return config
}
