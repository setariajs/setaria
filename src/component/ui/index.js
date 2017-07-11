import StrawUI from 'straw-ui';
import 'straw-ui/lib/style.css';
import Util from '@/model/Util';
import ErrorMessage from './package/ErrorMessage';
import LoadingIndicator from './package/LoadingIndicator';

const COMPONENTS = {
  ErrorMessage,
};

function install(Vue) {
  /* istanbul ignore if */
  if (install.installed) return;
  // 修改StrawUI控件的命名空间
  Object.keys(StrawUI).forEach((key) => {
    const component = StrawUI[key];
    let componentName = StrawUI[key].name;
    if (!Util.isEmpty(componentName) && componentName.indexOf('mt') === 0) {
      componentName = `one${componentName.substring(2)}`;
      // 查找组件是否已被定制化
      const customUI = Object.keys(COMPONENTS).find(item => item.name === componentName);
      // 当前组件没有被定制化的场合
      if (!customUI) {
        // 加载原生组件
        Vue.component(componentName, component);
      }
    }
  });
  // 加载自定义组件
  Object.keys(COMPONENTS).forEach((key) => {
    const component = COMPONENTS[key];
    // 加载组件
    Vue.component(component.name, component);
  });
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

const UI = Object.assign({}, StrawUI, {
  install,
  LoadingIndicator,
});
export default UI;
export { LoadingIndicator };
