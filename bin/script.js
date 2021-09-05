#!/usr/bin/env node
const minimist = require('minimist')
const path = require('path')
const log = require('./script/log-util')
const UpdateSubmodule = require('./script/update-submodule')
const GenerateMockFile = require('./script/generate-mock-file')
const GenerateJsonSchema = require('./script/generate-json-schema')
const Analyse = require('./script/analyse')

// 取得命令参数
const argv = minimist(process.argv.slice(2))
// script 参数必须存在
if (argv.script) {
  // [脚本]更新子模块
  if (argv.script === 'update-submodule') {
    const scriptInstance = new UpdateSubmodule(process.cwd(), {
      branch: argv.branch,
      commit: argv.commit,
      init: argv.init,
      reset: argv.reset,
      folder: argv.folder,
      gitUrl: argv.gitUrl
    })
    // 执行脚本
    scriptInstance.run()
  // [脚本]根据在线Swagger生成前端Mock文件
  } else if (argv.script === 'generate-mock-file') {
    const scriptInstance = new GenerateMockFile(process.cwd(), {
      moduleName: argv.module,
      output: argv.output,
      url: argv.url
    })
    // 执行脚本
    scriptInstance.run()
  // [脚本]根据配置调用Swagger API生成JsonSchema
  } else if (argv.script === 'generate-json-schema') {
    const configFilePath = path.join(process.cwd(), 'setaria.config.js')
    // get config
    const config = require(configFilePath)
    log.label('当前配置信息:')
    log.info(configFilePath)
    const scriptInstance = new GenerateJsonSchema(process.cwd(), {
      config
    })
    // 执行脚本
    scriptInstance.run()
  } else if (argv.script === 'analyse') {
    const scriptInstance = new Analyse(process.cwd(), {})
    // 执行脚本
    scriptInstance.run()
  } else {
    console.error('no usage script found')
  }
}
