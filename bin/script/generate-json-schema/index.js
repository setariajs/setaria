const axios = require('axios')
const fs = require('fs')
const _ = require('lodash')
const { join } = require('path')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const exec = require('../exec-util')
const log = require('../log-util')

// 排除数组
const EXCLUDE_KEY_CHAR = ['«', '»']

const request = axios.create({
})

/**
 * 将key转换为驼峰命名法
 * @param {string} originKey
 * @returns
 */
function createApiKey (originKey) {
  const str = _.camelCase(originKey)
  return `${str[0].toUpperCase()}${str.substr(1)}`
}

/**
 * 生成JsonSchema
 * @param {*} definitions
 * @returns
 */
function createJsonSchemaBySwagger (definitions) {
  const result = {}
  Object.keys(definitions).forEach((key) => {
    const isExcludeKeyExist = EXCLUDE_KEY_CHAR.some((ek) => key.indexOf(ek) !== -1)
    if (!isExcludeKeyExist) {
      if (definitions[key].properties) {
        Object.keys(definitions[key].properties).forEach((propertyKey) => {
          let property = definitions[key].properties[propertyKey]
          property = {
            ...property,
            title: property.description,
            description: ''
          }
          definitions[key].properties[propertyKey] = property
        })
      }
      result[key] = definitions[key]
    }
  })
  return result
}

async function getJsonSchemaBySwagger (swaggerConfig) {
  const result = {}
  const promiseArray = []
  const apiArray = Object.keys(swaggerConfig)
  apiArray.forEach((key) => {
    const apiUrl = swaggerConfig[key]
    promiseArray.push(request(apiUrl))
  })
  const apiResultArray = await Promise.all(promiseArray)
  if (apiResultArray) {
    apiResultArray.forEach((apiResult, index) => {
      const { data } = apiResult
      // 客户端使用的key
      const apiKey = createApiKey(apiArray[index])
      let schemas = null
      if (data.swagger === '2.0') {
        schemas = data.definitions
      } else if (data.openapi) {
        schemas = data.components.schemas
      }
      // 获得JsonSchema结构
      const jsonSchema = createJsonSchemaBySwagger(schemas)
      result[apiKey] = jsonSchema
    })
  }
  return result
}

function getInput (config) {
  if (config && config.jsonSchema && config.jsonSchema.input) {
    const result = {}
    const { input } = config.jsonSchema
    const { swaggerUrls } = input
    // 处理Swagger格式数据(Open API)
    if (swaggerUrls) {
      return getJsonSchemaBySwagger(swaggerUrls)
    }
    return result
  }
  log.error('没有找到数据源。请确认格式是否正确{ jsonSchema: { input: { swaggerUrls: [Object] } } }')
}

module.exports = class GenerateJsonSchema {
  constructor (context, { config } = {}) {
    this.context = context
    this.config = config
    this.outputJsonSchemaPaths = {}
  }

  getOutputPath () {
    return _.get(this.config, ['jsonSchema', 'output'])
  }

  clear () {
    const outputPath = this.getOutputPath()
    // 目录存在的场合
    if (fs.existsSync(outputPath)) {
      // 移除目录
      rimraf.sync(outputPath)
    }
  }

  traverse (definitions) {
    log.label('生成JsonSchema文件：')
    this.clear()
    const outputPath = join(this.getOutputPath())
    mkdirp.sync(outputPath)
    Object.keys(definitions).some((key) => {
      if (key.indexOf('«') !== -1 || key.indexOf('»') !== -1) {
        return false
      }
      const description = definitions[key]
      const fileName = `${_.kebabCase(key)}.json`
      const fullFilePath = join(outputPath, fileName)
      this.generate(fullFilePath, key, description, definitions[key].properties)
      this.outputJsonSchemaPaths[key] = fileName
    })
  }

  generate (fullFilePath, key, content) {
    if (!fs.existsSync(fullFilePath)) {
      // 生成文件, 已存在的跳过，避免覆盖本地以及编辑的文件
      fs.writeFileSync(fullFilePath, JSON.stringify(content), { flag: 'wx' })
      log.info(`JSONSchema文件 ${key} [${join(this.context, fullFilePath)}] 已生成。`)
    }
  }

  createJsonSchemaIndexContent (outputJsonSchemaPaths) {
    log.label('生成索引文件：')
    let result = `/**
 * JSON Schema Index File
 * generated by Setaria
 */
`
    const keys = Object.keys(outputJsonSchemaPaths)
    keys.forEach((key) => {
      const filePath = outputJsonSchemaPaths[key]
      result = `
${result}import ${key} from './${filePath.replace(/\\/g, '/')}';
`
    })
    result = `
${result}
export default {
`
    keys.forEach((key, index) => {
      result = `
${result}    ${key},
`
      // if (index === keys.length - 1) {
      // }
    })
    result = `${result}}
`
    return result
  }

  generateJsonSchemaIndexFile (content) {
    const filePath = join(this.getOutputPath(), 'index.js')
    fs.writeFileSync(filePath, content, { flag: 'wx' })
    log.info(`JSONSchema索引文件已生成：${join(this.context, filePath)}`)
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
    log.label('格式化生成的文件：')
    const formatter = this.getPrettierCommand()
    if (formatter !== '') {
      exec.cmd(`${formatter} ${this.getOutputPath()}/** --write`)
      log.success('文件格式化完成!')
    } else {
      log.error('没有找到Prettier命令，请使用 yarn add prettier --dev 后再次执行当前Mock生成脚本')
    }
  }

  async run () {
    const result = await getInput(this.config)
    if (result) {
      this.traverse(result)
      const indexFileContent = this.createJsonSchemaIndexContent(this.outputJsonSchemaPaths)
      this.generateJsonSchemaIndexFile(indexFileContent)
      this.format()
    }
    // console.log(result)
    // const swaggerParserMock = require('swagger-parser-mock')
    // const specs = swaggerParserMock(this.url)
    // this.clear()
    // specs.then((res) => {
    //   this.traverse(res.definitions)
    //   this.format()
    // })
  }
}
