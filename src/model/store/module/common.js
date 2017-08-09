// initial state
const state = {
  direction: '',
  loading: false,
  routeHistory: {
    currentIndex: null,
    history: []
  }
}

// getters
const getters = {
  routeHistory: state => state.routeHistory,
  routeCurrentIndex: state => state.routeHistory.currentIndex
}

// actions
const actions = {
}

// mutations
const mutations = {
  direction (stateObj, val) {
    const s = stateObj
    s.direction = val
  },
  loading (stateObj, val) {
    const s = stateObj
    s.loading = val
  },
  updateDirection (stateObj, { current, next }) {
    let direction = stateObj.direction
    console.log('updateDirection', direction)
    const routeHistory = stateObj.routeHistory
    if (direction !== 'forward' && direction !== 'back') {
      if (routeHistory.history.length > 0) {
        // 当前游标处于最末尾
        if (routeHistory.currentIndex === routeHistory.history.length - 1) {
          // const path = routeHistory.history[routeHistory.currentIndex]
          // if (path === next) {
          direction = 'back'
          // } else {
            // direction = 'forward'
          // }
        } else {
          let path = null
          // 判断目标画面是否为前画面
          if (routeHistory.currentIndex !== 0) {
            path = routeHistory.history[routeHistory.currentIndex]
            if (path === next) {
              direction = 'back'
            }
          }
          // 判断目标画面是否为次画面
          if (direction === '') {
            path = routeHistory.history[routeHistory.currentIndex + 1]
            if (path === next) {
              direction = 'forward'
            }
          }
        }
      } else {
        direction = 'forward'
      }
      if (direction !== 'forward' && direction !== 'back') {
        direction = 'forward'
      }
      // 保存跳转方向
      stateObj.direction = direction
    }
    console.log(stateObj.direction)
  },
  updateHistory (stateObj, { current, next }) {
    const direction = stateObj.direction
    const routeHistory = stateObj.routeHistory
    // 更新浏览历史
    if (direction === 'back') {
      if (routeHistory.currentIndex === 0) {
        routeHistory.currentIndex = null
      } else {
        routeHistory.history[routeHistory.currentIndex] = current
        routeHistory.currentIndex -= 1
      }
    } else if (direction === 'forward') {
      // if (!isExistForwardPage) {
      //   if (routeHistory.currentIndex < history.length - 1) {
      //     let index = history.length - 1
      //     for (index; index > routeHistory.currentIndex; index -= 1) {
      //       history.splice(index, 1)
      //     }
      //   }
      //   history.push(currentPageFullPath)
      // } else {
      // }
      if (routeHistory.currentIndex === null) {
        routeHistory.currentIndex = 0
      } else {
        // 如果未处于队列末尾,则删除当前游标后的数据
        if (routeHistory.currentIndex < routeHistory.history.length - 1) {
          const history = routeHistory.history.splice(0, routeHistory.currentIndex + 1)
          routeHistory.history = history
        }
        routeHistory.currentIndex += 1
      }
      routeHistory.history.push(next)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
