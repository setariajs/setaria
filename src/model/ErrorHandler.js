import ApplicationError from '@/model/ApplicationError';
import Util from '@/model/Util';

export default class ErrorHandler {
  static handleError(error, source) {
    let ret = null;
    const isErrorFromVue = source instanceof Object;
    // 来源：restful调用，应用框架
    if (error instanceof Error) {
      ret = error;
    // 来源：组件渲染
    } else if (isErrorFromVue) {
      ret = new ApplicationError('MAM004E');
    // // 来源：未知
    // } else if (error instanceof Object
    //   && Object.prototype.hasOwnProperty.call(error, 'message')) {
    //   ret = new ApplicationError(null, null, error.message);
    // 来源：事件函数中的运行期错误
    } else if (error instanceof String) {
      ret = new ApplicationError(null, null, error);
    }
    if (ret === null || ret === undefined
      || (!Util.isEmpty(ret) && Util.isEmpty(ret.message))) {
      ret = new ApplicationError('MAM004E');
    }

    // 对Vue.config.errorHandler接口进行实现的场合，Vue不会在控制台显示错误。
    if (isErrorFromVue) {
      /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
      console.error(error);
    }
    return ret;
  }
}
