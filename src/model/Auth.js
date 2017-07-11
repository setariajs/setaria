/**
 * 鉴权模块
 * @version 1.0
 * @author HanL
 */
import Storage, { STORAGE_TYPE } from '@/model/Storage';
import UmeHttp from '@/model/UmeHttp';
import Util from '@/model/Util';

const TOKEN_KEY = '__TOKEN_';
const USER_KEY = '____USER_INFO_';
const STORAGE_SCOPE = STORAGE_TYPE.SESSION;

/* eslint no-param-reassign: ["error", { "props": false }] */
export default class Auth {
  /**
   * 登录处理
   * @param  {String}  loginId  用户ID
   * @param  {String}  password 用户密码
   * @return {Promise} Promise
   */
  static login(loginId, password) {
    return new Promise((resolve, reject) => {
      // 调用鉴权服务
      UmeHttp.invoke('EMS00001', [loginId, password]).then((res) => {
        // 储存Token
        Storage.setItem(STORAGE_SCOPE, TOKEN_KEY, res.token);
        // 储存用户信息
        Storage.setItem(STORAGE_SCOPE, USER_KEY, res);
        resolve(res);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /**
   * 登出处理
   * @return {Promise} Promise
   */
  static logout() {
    return new Promise((resolve, reject) => {
      const userId = this.getUserInfo().user.userId;
      // 调用登出服务
      UmeHttp.invoke('EMS00002', [userId]).then((res) => {
        Storage.removeItem(STORAGE_SCOPE, TOKEN_KEY);
        Storage.removeItem(STORAGE_SCOPE, USER_KEY);
        resolve(res);
      }).catch((err) => {
        Storage.removeItem(STORAGE_SCOPE, TOKEN_KEY);
        Storage.removeItem(STORAGE_SCOPE, USER_KEY);
        reject(err);
      });
    });
  }

  /**
   * 取得登录状态
   * @return {Boolean} 已经登录的场合，返回true，否则返回false
   */
  static isLogin() {
    return !Util.isEmpty(Storage.getItem(STORAGE_SCOPE, TOKEN_KEY));
  }

  /**
   * 取得当前用户信息
   * @return {Object} 当前用户信息
   */
  static getUserInfo() {
    return Storage.getItem(STORAGE_SCOPE, USER_KEY);
  }

  /**
   * 取得当前Token值
   * @return {String} 当前Token值
   */
  static getToken() {
    return Storage.getItem(STORAGE_SCOPE, TOKEN_KEY);
  }

  // fetchUserInfo() {

  // },
}
