/* @flow */
import _ from 'lodash'
import moment from 'moment'
import 'moment/locale/zh-cn'

export default class Util {
  /**
   * 判断当前执行环境是否为生产环境
   * @return {Boolean} 生产环境的场合，返回true
   */
  static isProdunctionEnv (): boolean {
    return process.env.NODE_ENV === 'production'
  }

  static isFirefox (): boolean {
    const agent = window.navigator.userAgent.toLowerCase()
    return (typeof window !== 'undefined' && agent) &&
      /firefox\/\d+/.test(agent)
  }

  /**
   * 使用指定格式取得当前时间
   * @param  {String} format 指定格式（moment格式）
   * @return {String} 当前时间
   */
  static getNow (format: string = 'LL'): string {
    return moment().format(format)
  }

  /**
   * 对日期使用指定格式进行格式化
   */
  static formatDate (date: ?Date | string, format: string = 'YYYY-MM-DD'): string {
    let ret: string = ''
    if (moment(date).isValid() && date !== undefined) {
      ret = moment(date).format(format)
    }
    return ret
  }

  /**
   * 字符串类型日期转换成日期对象
   */
  static toDate (val: string): ?Date | ?string {
    let ret: string = val
    if (!Util.isEmpty(val)) {
      ret = moment(val).toDate()
    }
    return ret
  }

  /**
   * 对时间进行加法计算
   * 例：addDateTime(new Date(), 7, 'days')
   */
  static addDateTime (date: string | Date, val: number, type: string): ?Date {
    return moment(date).add(val, type)
  }

  /**
   * 对时间进行减法计算
   * 例：subtractDateTime(new Date(), 7, 'days')
   */
  static subtractDateTime (date: string | Date, val: number, type: string): ?Date {
    return moment(date).subtract(val, type)
  }

  /**
   * 检查输入值是否为空
   * 注意：无法判断基本类型（整数，布尔）
   */
  static isEmpty (value: any): boolean {
    return _.isEmpty(value)
  }

  /**
   * 判断两个输入值值是否相等
   * 主要用于对数组或对象进行判断
   */
  static isEqual (value: any, other: any): boolean {
    return _.isEqual(value, other)
  }

  /**
   * 检查输入值是否为数字
   */
  static isNumber (value: any): boolean {
    return _.isNumber(value)
  }

  /**
   * 检查输入值是否为字符串
   */
  static isString (value: any): boolean {
    return _.isString(value)
  }

  /**
   * 检查输入值是否为日期
   */
  static isDate (value: any): boolean {
    return _.isDate(value)
  }

  /**
   * 检查输入值是否为数组
   */
  static isArray (value: any): boolean {
    return _.isArray(value)
  }

  /**
   * 检查输入值是否为对象
   */
  static isObject (value: any): boolean {
    return _.isObject(value)
  }

  /**
   * 检查输入值是否为函数
   */
  static isFunction (value: any): boolean {
    return _.isFunction(value)
  }

  /**
   * 取得对象中指定的值
   */
  static get (object: Object, path: string, defaultValue: ?any = null): any {
    return _.get(object, path, defaultValue)
  }

  /**
   * 对指定对象进行深拷贝
   */
  static cloneDeep (objects: any): any {
    return _.cloneDeep(objects)
  }

  /**
   * 取得url中指定参数的值
   */
  static getUrlParameter (paramKey: string): ?string {
    const urlParam: string = window.location.search.substring(1)
    const urlVariables: Array<string> = urlParam.split('&')
    let ret: ?string = urlVariables.find(key => key.split('=')[0] === paramKey)
    if (ret === null || ret === undefined) {
      ret = ''
    } else {
      ret = ret.split('=')[1]
    }
    return ret
  }

  /**
   * 将所有可枚举属性的值从一个或多个源对象复制到目标对象
   *
   * @static
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @returns {Object}
   * @memberof Util
   */
  static assign (object: Object): Object {
    return _.assign.apply(null, arguments)
  }
}
