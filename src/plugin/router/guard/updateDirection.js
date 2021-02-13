import { getStore } from '../../store/index'
import { STORE_KEY } from '../../../shared/constants'

export default function (to, from, next) {
  const store = getStore()
  // const { params, query } = to
  const currentPageFullPath = from.fullPath
  // let direction = ''
  const nextPageFullPath = to.fullPath
  // 浏览器前进／后退按钮点击 或 点击了页面链接 的场合
  store.commit(STORE_KEY.UPDATE_DIRECTION, {
    current: currentPageFullPath,
    next: nextPageFullPath
  })
  next()
}
