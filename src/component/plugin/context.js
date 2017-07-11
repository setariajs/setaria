/* eslint no-underscore-dangle: ["error", { "allow": ["_uid"] }]*/
import Util from '@/model/Util';

const CURRENT_KEY = '__current_';
const contextData = {};

function getContextData(scope) {
  let ret = null;
  if (!contextData[scope]) {
    contextData[scope] = {};
  }
  ret = contextData[scope];
  return ret;
}

function getContextDataByScope(scope, uid, key) {
  const ret = {};
  const scopeData = getContextData(scope);
  Object.assign(ret, scopeData[CURRENT_KEY], scopeData[uid]);
  return ret[key];
}

function setContextDataByScope(scope, uid, key, value) {
  const scopeData = getContextData(scope);
  if (!scopeData[uid]) {
    scopeData[uid] = {};
  }
  scopeData[uid][key] = value;
}

function clearContextDataByScope(scope) {
  if (contextData[scope]) {
    delete contextData[scope];
  }
}

function refreshContextDataByScope(scope, uid) {
  const scopeData = getContextData(scope);
  if (Util.isNumber(uid)) {
    scopeData[CURRENT_KEY] = {};
    if (scopeData[uid]) {
      Object.assign(scopeData[CURRENT_KEY], scopeData[uid]);
    }
    delete scopeData[uid];
  }
}

function plugin(Vue) {
  if (plugin.installed) {
    return;
  }

  Vue.mixin({
    // beforeRouteEnter(to, from, next) {
    //   next((vm) => {
    //     const viewModel = vm;
    //     console.log('enter', viewModel);
    //     // viewModel.$request = prevRequestData;
    //   });
    // },
    // beforeRouteUpdate(to, from, next) {
    //   console.log('to', to);
    //   console.log('from', from);
    //   console.log('update', this);
    //   // this.$request = prevRequestData;
    //   next();
    // },
    beforeRouteLeave(to, from, next) {
      refreshContextDataByScope('request', this._uid);
      next();
    },
  });

  Object.defineProperties(Vue.prototype, {
    $request: {
      get() {
        const context = this;
        const SCOPE = 'request';
        return {
          getAttr(key) {
            return getContextDataByScope(SCOPE, context._uid, key);
          },
          setAttr(key, value) {
            setContextDataByScope(SCOPE, context._uid, key, value);
          },
        };
      },
    },
    $session: {
      get() {
        const context = this;
        const SCOPE = 'session';
        return {
          getAttr(key) {
            return getContextDataByScope(SCOPE, context._uid, key);
          },
          setAttr(key, value) {
            setContextDataByScope(SCOPE, context._uid, key, value);
          },
          clear() {
            clearContextDataByScope(SCOPE);
          },
        };
      },
    },
  });
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin);
}

export default plugin;
