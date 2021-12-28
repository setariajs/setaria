/* @flow */
import VueI18n from 'vue-i18n'
import config from '../../core/config'
// import { findIndex, isNotEmpty, keys, isArray } from '../../util/lang'

let i18n = {}

const loadedLanguages = []


function setI18nLanguage (lang) {
  i18n.locale = lang
  // axios.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}



export function loadLanguageAsync(lang) {
  // 如果语言相同
  if (i18n.locale === lang) {
    return Promise.resolve(setI18nLanguage(lang))
  }

  // 如果语言已经加载
  if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang))
  }

  // if(config){

  // }

  // 如果尚未加载语言
  // return require(`${config.i18n.basePath}${lang}.js`).then(
  //   messages => {
  //     i18n.setLocaleMessage(lang, messages.default)
  //     loadedLanguages.push(lang)
  //     return setI18nLanguage(lang)
  //   }
  // )
//   return ()=> import(`@/assets/language/${lang}`).then(msgs => { //去引入这个值
//     i18n.setLocaleMessage(lang, msgs.default[lang]); 
//     //设置i18n的语言message切换成这个
//     loadedLanguages.push(lang); //本地已经加载的语言 加入 loadedLanguages
//     return setI18nLanguage(lang);
//      //返回并且设置
// });
  
  return import( `${config.i18n.basePath}${lang}.js`).then(
    messages => {
      i18n.setLocaleMessage(lang, messages.default)
      loadedLanguages.push(lang)
      return setI18nLanguage(lang)
    }
  )
}



export function install (Vue, options) {
  console.debug('VueI18n install')
  // 安装 VueI18n
  Vue.use(VueI18n)
  const i18nConfig = config.i18n

  i18n = new VueI18n(i18nConfig)
  i18n.loadLanguageAsync = loadLanguageAsync
  if(i18nConfig.locale){
    loadedLanguages.push(i18nConfig.locale)
  }
  //   {
  //   basePath:''
  //   locale: 'en', // 设置语言环境
  //   fallbackLocale: 'en',
  //   messages // 设置语言环境信息
  // })
}

export function getI18n () {
  return i18n
}
