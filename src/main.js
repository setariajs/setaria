// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from '@/App';
import context from '@/component/plugin/context';
import { router, navigate } from '@/component/plugin/navigate/index';
import store from '@/component/plugin/store';
import UI from '@/component/ui';
import Util from '@/model/Util';

// 加载公用UI控件
// Vue.use(UI);
// 生产环境的场合
if (Util.isProdunctionEnv()) {
  // 不显示Vue日志和警告
  Vue.config.silent = true;
  // 不显示Vue产品信息
  Vue.config.productionTip = false;
}

Vue.use(UI);
Vue.use(context);
Vue.use(navigate);

/* eslint-disable no-new */
new Vue({
  el: '#main',
  router,
  store,
  template: '<App/>',
  components: { App },
});
