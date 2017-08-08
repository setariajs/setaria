import _ from 'lodash'
import moment from 'moment'
import 'moment/locale/zh-cn'

export default class Util {
  /**
   * 判断当前执行环境是否为生产环境
   * @return {Boolean} 生产环境的场合，返回true
   */
  static isProdunctionEnv () {
    return process.env.NODE_ENV === 'production'
  }

  /**
   * 使用指定格式取得当前时间
   * @param  {String} format 指定格式（moment格式）
   * @return {String} 当前时间
   */
  static getNow (format = 'LL') {
    return moment().format(format)
  }

  /**
   * 对日期使用指定格式进行格式化
   * @param  {Date|String} date   日期
   * @param  {String}      format 格式化字符串
   * @return {String}      格式化后的日期
   */
  static formatDate (date, format = 'YYYY-MM-DD') {
    let ret = ''
    if (moment(date).isValid() && date !== undefined) {
      ret = moment(date).format(format)
    }
    return ret
  }

  /**
   * 字符串类型日期转换成日期对象
   * @param  {String} val
   * @return {Date}
   */
  static toDate (val) {
    let ret = val
    if (!Util.isEmpty(val)) {
      ret = moment(val).toDate()
    }
    return ret
  }

  /**
   * 对时间进行加法计算
   * @param  {String|Date} date 指定时间
   * @param  {Number}      val  值
   * @param  {String}      type 类型
   * @return {Date}        计算后的时间
   */
  static addDateTime (date, val, type) {
    return moment(date).add(val, type)
  }

  /**
   * 对时间进行减法计算
   * @param  {String|Date} date 指定时间
   * @param  {Number}      val  值
   * @param  {String}      type 类型
   * @return {Date}        计算后的时间
   */
  static subtractDateTime (date, val, type) {
    return moment(date).subtract(val, type)
  }

  /**
   * 检查输入值是否为空
   * 注意：无法判断基本类型（整数，布尔）
   * @param  {*}       value 检查的值
   * @return {Boolean} 值为空的场合返回true
   */
  static isEmpty (value) {
    return _.isEmpty(value)
  }

  /**
   * 判断两个输入值值是否相等
   * 主要用于对数组或对象进行判断
   * @param  {*}       value 输入值
   * @param  {*}       other 输入值
   * @return {Boolean} 两个值相等的场合返回true
   */
  static isEqual (value, other) {
    return _.isEqual(value, other)
  }

  /**
   * 检查输入值是否为数字
   * @param  {*}       value 输入值
   * @return {Boolean} 输入值为数字的场合，返回true
   */
  static isNumber (value) {
    return _.isNumber(value)
  }

  /**
   * 检查输入值是否为字符串
   * @param  {*}       value 输入值
   * @return {Boolean} 输入值为字符串类型的场合，返回true
   */
  static isString (value) {
    return _.isString(value)
  }

  /**
   * 检查输入值是否为日期
   * @param  {*}       value 输入值
   * @return {Boolean} 输入值为日期的场合，返回true
   */
  static isDate (value) {
    return _.isDate(value)
  }

  /**
   * 检查输入值是否为数组
   * @param  {*}       value 检查的值
   * @return {Boolean} 是数组的场合，返回true
   */
  static isArray (value) {
    return _.isArray(value)
  }

  /**
   * 检查输入值是否为对象
   * @param  {*}       value 输入值
   * @return {Boolean} 输入值为对象的场合，返回true
   */
  static isObject (value) {
    return _.isObject(value)
  }

  /**
   * 检查输入值是否为函数
   * @param  {*}       value 输入值
   * @return {Boolean} 输入值为函数的场合，返回true
   */
  static isFunction (value) {
    return _.isFunction(value)
  }

  /**
   * 取得对象中指定的值
   * @param  {Object} object
   * @param  {String} path
   * @param  {*}      defaultValue
   * @return {*}      指定的值
   */
  static get (object, path, defaultValue = null) {
    return _.get(object, path, defaultValue)
  }

  /**
   * 对指定对象进行深拷贝
   * @param  {*} objects 欲拷贝的值
   * @return {*} 拷贝后的值
   */
  static cloneDeep (objects) {
    return _.cloneDeep(objects)
  }

  /**
   * 取得url中指定参数的值
   * @param  {String} paramKey
   * @return {String|Array}
   */
  static getUrlParameter (paramKey) {
    const urlParam = window.location.search.substring(1)
    const urlVariables = urlParam.split('&')
    let ret = urlVariables.find(key => key.split('=')[0] === paramKey)
    if (ret) {
      ret = ret.split('=')[1]
    }
    return ret
  }
}
