// TODO: 引入Router的方式不太恰当，但在navigate插件中需要注册路由全局钩子，不知该如何取得router对象
// 限制1: 不支持同一路由不同参数间画面的跳转 /user/1 -> /user/2
// 限制2: 不支持<router-link>的方式跳转，且此链接内如果定义path，则params不生效（vue-router的限制）
// 限制3: 新增<navi-link>用于定义静态路由链接。
// import Util from '@/model/Util';
import Vue from 'vue';
import Router from 'vue-router';
import routerConfig from '@/config/router';
import Auth from '@/model/Auth';
import store from '@/model/store';
import NaviLink from './NaviLink';

Vue.component(NaviLink.name, NaviLink);
Vue.use(Router);

const router = new Router(routerConfig);

/**
 * 判断用户登录状态
 * @param  {RouteConfig}   to    目标路由对象
 * @param  {RouteConfig}   from  当前导航正要离开的路由对象
 * @param  {Function}      next  管道钩子
 */
function isLogin(to, from, next) {
  // 当目标画面需要鉴权的场合
  if (to.meta.auth !== false) {
    // 当前用户没有登录的场合
    if (!Auth.isLogin()) {
      // 登录成功后重新跳转至目标画面
      const path = to.path;
      next({
        name: 'Login',
        query: { path },
      });
    } else {
      next();
    }
  } else {
    next();
  }
}

const routeHistroy = {
  currentIndex: null,
  history: [],
};

function getDirection(to, from, next) {
  const params = to.params;
  const currentPageFullPath = from.fullPath;
  let direction = store().state.common.direction;
  let isExistForwardPage = false;
  const nextPageFullPath = to.fullPath;
  const history = routeHistroy.history;
  if (params && params.$$direction === 'forward') {
    direction = 'forward';
    // 保存跳转方向
    store().commit('direction', direction);
  }
  // 浏览器前进／后退按钮点击 或 点击了页面链接 的场合
  if (direction !== 'forward' && direction !== 'back') {
    if (history.length === 0) {
      routeHistroy.currentIndex = 0;
      history.push(currentPageFullPath);
      next();
      return;
    }
    if (history.length > 0) {
      // 当前游标处于最末尾
      if (routeHistroy.currentIndex === history.length - 1) {
        const path = history[routeHistroy.currentIndex];
        // 跳转画面的路径为前画面的场合
        if (path === nextPageFullPath) {
          direction = 'back';
        } else {
          direction = 'forward';
        }
      // 当前画面拥有次画面
      } else {
        let path = null;
        // 判断目标画面是否为前画面
        if (routeHistroy.currentIndex !== 0) {
          path = history[routeHistroy.currentIndex];
          if (path === nextPageFullPath) {
            direction = 'back';
          }
        }
        // 判断目标画面是否为次画面
        if (direction === '') {
          path = history[routeHistroy.currentIndex + 1];
          if (path === nextPageFullPath) {
            direction = 'forward';
            isExistForwardPage = true;
          }
        }
      }
      // 保存跳转方向
      store().commit('direction', direction);
    }
  }

  if (direction === '') {
    direction = 'forward';
    // 保存跳转方向
    store().commit('direction', direction);
  }

  // 更新浏览历史
  if (direction === 'back') {
    if (routeHistroy.currentIndex === 0) {
      routeHistroy.currentIndex = null;
    } else {
      history[routeHistroy.currentIndex] = currentPageFullPath;
      routeHistroy.currentIndex -= 1;
    }
  } else if (direction === 'forward') {
    if (!isExistForwardPage) {
      if (routeHistroy.currentIndex < history.length - 1) {
        let index = history.length - 1;
        for (index; index > routeHistroy.currentIndex; index -= 1) {
          history.splice(index, 1);
        }
      }
      history.push(currentPageFullPath);
    } else {
      history[routeHistroy.currentIndex + 1] = currentPageFullPath;
    }
    routeHistroy.currentIndex += 1;
  }
  next();
}

// 注册全局鉴权路由钩子
router.beforeEach(isLogin);
router.beforeEach(getDirection);

function plugin() {
  if (plugin.installed) {
    return;
  }

  function to(name, params = {}, query = {}) {
    const context = this;
    // 删除
    if (routeHistroy.currentIndex !== routeHistroy.history.length - 1) {
      let index = routeHistroy.history.length - 1;
      for (index; index > routeHistroy.currentIndex; index -= 1) {
        routeHistroy.history.splice(index - 1, 1);
      }
    }
    routeHistroy.history.push(context.$router.currentRoute.fullPath);
    routeHistroy.currentIndex = routeHistroy.history.length - 1;
    context.$store.commit('direction', 'forward');
    context.$router.push({
      name,
      params,
      query,
    });
  }

  function forward() {
    const context = this;
    context.$store.commit('direction', 'forward');
    context.$router.forward();
  }

  function back() {
    const context = this;
    context.$store.commit('direction', 'back');
    context.$router.back();
  }

  // function replace(location) {
  //   const context = this;
  // }
  Vue.mixin({
    destroyed() {
      this.$store.commit('direction', '');
    },
  });

  Object.defineProperties(Vue.prototype, {
    $navi: {
      get() {
        const context = this;
        return {
          to: to.bind(context),
          forward: forward.bind(context),
          back: back.bind(context),
          // replace: replace.bind(context),
        };
      },
    },
  });
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

export { router, plugin as navigate };
