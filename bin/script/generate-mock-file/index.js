const fs = require('fs')
const { join } = require('path')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const exec = require('../exec-util')
const log = require('../log-util')

module.exports = class GenerateMockFile {
  constructor (context, { moduleName, output, url } = {}) {
    this.context = context
    this.moduleName = moduleName
    this.output = output
    this.url = process.env.VUE_APP_SERVICE_API_DOC_URL
    // 设置了url的场合，则使用设置的url
    if (url && url !== '') {
      this.url = url
    }
  }

  traverse (paths) {
    const modulePathList = []
    for (const path in paths) {
      // if (this.blacklist.includes(path)) {
      //   continue
      // }

      for (const method in paths[path]) {
        const pathInfo = paths[path][method]

        if (!pathInfo['responses']['200']) {
          continue
        }
        const modulePath = path.replace(`/api/api-${this.moduleName}/api/${this.moduleName}`, '')
        this.generate(pathInfo, method, modulePath)
        // 服务设计暂未使用restful风格，即同一服务只会有一个请求方式（譬如: GET）
        modulePathList.push(modulePath)
      }
    }
    // 创建引用文件
    this.generateIndexFile(modulePathList)
  }

  isPaginationResult (mockContentObj) {
    if (typeof mockContentObj === 'object') {
      return mockContentObj.hasNextPage && mockContentObj.list && mockContentObj.total
    }
    return false
  }

  generate (pathInfo, method, modulePath) {
    const outputPath = join(this.getModulePath(), modulePath)
    const {
      // 服务名称
      summary,
      responses: { 200: responseOK }
    } = pathInfo
    let mockContent = responseOK.example
    mockContent = mockContent ? JSON.parse(mockContent).data : ''
    // 无内容的场合，直接返回
    if (mockContent === '') {
      return
    }
    const template = this.generateMockTemplate(summary, mockContent, method, modulePath)
    mkdirp.sync(outputPath)
    const fullFilePath = join(outputPath, 'index.js')
    // 生成文件, 已存在的跳过，避免覆盖本地以及编辑的文件
    fs.writeFileSync(fullFilePath, template, { flag: 'wx' })
    log.info(`增加Mock文件：${outputPath}.js`)
  }

  generateIndexFile (modulePathList) {
    const outputPath = this.getModulePath()
    const template = this.generateIndexTemplate(modulePathList)
    const fullFilePath = join(outputPath, 'index.js')
    // 生成一览文件
    fs.writeFileSync(fullFilePath, template, { flag: 'wx' })
    log.info(`增加一览文件：${fullFilePath}`)
  }

  generateIndexTemplate (modulePathList = []) {
    let ret = ''
    // 删除 \ 和 -
    const getModuleName = modulePathString => {
      return modulePathString.replace(/\//g, '').replace(/-/g, '')
    }
    modulePathList.forEach(modulePath => {
      ret += `
import ${getModuleName(modulePath)} from '.${modulePath}';`
    })
    ret += `
`
    ret += `
`
    ret += 'export default {'
    modulePathList.forEach(modulePath => {
      ret += `
  ...${getModuleName(modulePath)},`
    })
    ret += `
`
    ret += `};`
    return ret
  }

  generateMockTemplate (summary, content, method, path) {
    const apiPath = path.substring(path.indexOf('/v') + 1)
    // 翻页对象的处理
    const isPaginationObject = this.isPaginationResult(content)
    if (isPaginationObject) {
      const list = content.list
      delete content.list
      content['list|10'] = list
      content.total = '@integer(60, 100)'
    }
    const outputContent = JSON.stringify(content)
    return `
/**
 * ${summary} ${apiPath}
 */
import mockjs from 'mockjs';

const data = mockjs.mock(
  ${outputContent}
);
export default {
  '${method.toUpperCase()} ${apiPath}': {
    code: '00000',
    data,
    message: '',
  }
};`
  }

  clear () {
    const mockFilePath = this.getModulePath()
    // 目录存在的场合
    if (fs.existsSync(mockFilePath)) {
      // 删除Mock目录
      rimraf.sync(mockFilePath)
    }
  }

  getPrettierCommand () {
    let ret = ''
    // MacOS Command
    ret = join(this.context, 'node_modules', '.bin', 'prettier')
    if (fs.existsSync(ret)) {
      return ret
    } else {
      ret = join(this.context, 'node_modules', '.bin', 'prettier.cmd')
      if (fs.existsSync(ret)) {
        return ret
      }
    }
    return ret
  }

  format () {
    log.label('开始格式化生成的文件：')
    const formatter = this.getPrettierCommand()
    if (formatter !== '') {
      exec.cmd(`${formatter} ${this.getModulePath()}/**/index.js --write`)
      log.success('文件格式化完成!')
    } else {
      log.error('没有找到Prettier命令，请使用 yarn add prettier --dev 后再次执行当前Mock生成脚本')
    }
  }

  getModulePath () {
    let moduleOutputPath = join(this.context)
    // 使用output参数值将mock文件输出至项目文件夹内的指定目录
    if (this.output) {
      moduleOutputPath = join(moduleOutputPath, this.output)
    // 默认输出至mock目录
    } else {
      moduleOutputPath = join(moduleOutputPath, 'mock')
    }
    return join(moduleOutputPath, this.moduleName)
  }

  run () {
    const swaggerParserMock = require('swagger-parser-mock')
    const specs = swaggerParserMock(this.url)
    this.clear()
    specs.then(({ paths }) => {
      this.traverse(paths)
      this.format()
    })
  }
}
