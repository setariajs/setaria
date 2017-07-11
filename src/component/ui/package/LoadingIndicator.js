import { Indicator } from 'straw-ui';
import Util from '@/model/Util';

/**
 * 加载提示框组件
 * show和hide函数必须实现。（model/UmeHttp.js依赖此组件）
 */
export default class {
  /**
   * 显示加载提示框
   */
  static show() {
    Indicator.open(Util.getConfigValue('LOADING_TEXT'));
  }

  /**
   * 关闭加载提示框
   */
  static hide() {
    Indicator.close();
  }
}
