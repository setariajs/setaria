const path = require('path')
const fs = require('fs')
const exec = require('../exec-util')
const log = require('../log-util')
const CreateEslintReport = require('./create-eslint-report')
const rimraf = require('rimraf')

const FILE_NAME = 'report.json'

module.exports = class Analyse {
  /**
   * 业务代码分析脚本
   */
  constructor (context) {
    this.context = context
    this.outputPath = path.join(this.context, '.eslint-report')
    this.createEslintReport = new CreateEslintReport(context, this.outputPath, FILE_NAME)
  }

  getConfigFilePath () {
    return path.join(this.context, '.sonar-scanner.config.json')
  }

  checkConfig () {
    const configFile = this.getConfigFilePath()
    const isConfigFileExist = fs.existsSync(configFile)
    // config file not exist
    if (!isConfigFileExist) {
      throw new Error('Config file [.sonar-scanner.config.json] doesn\'t exist')
    }
  }

  getSonarConfig () {
    const configFile = this.getConfigFilePath()
    const config = fs.readFileSync(configFile, 'utf-8')
    const ret = JSON.parse(config)
    ret.reportFilePath = path.join(this.outputPath, FILE_NAME)
    return ret
  }

  getExecGulpfilePath () {
    return path.join(this.outputPath, 'gulpfile.js')
  }

  generateGulpfile () {
    const templatePath = path.join(__dirname, 'gulpfile.tpl')
    let content = fs.readFileSync(templatePath, 'utf8')
    const config = this.getSonarConfig()

    Object.keys(config).forEach(key => {
      content = content.replace(new RegExp(`<%=\\s*${key}\\s*>`, 'g'), config[key])
    })
    const outputPath = this.getExecGulpfilePath()
    fs.writeFileSync(outputPath, content)
    console.log('gulpfile.js')
    console.log('----------------------------------')
    console.log(content)
    console.log('----------------------------------')
  }

  run () {
    // 检查配置文件
    this.checkConfig()
    // 创建report输出目录
    if (!fs.existsSync(this.outputPath)) {
      fs.mkdirSync(this.outputPath)
    }
    try {
      this.generateGulpfile()
      // 生成Eslint检查结果
      this.createEslintReport.create()
      const gulpFilePath = this.getExecGulpfilePath()
      log.info(`Working directory: ${process.cwd()}`)
      console.log(exec.cmd(`gulp -f ${gulpFilePath} --cwd ${this.context}`))
    } finally {
      // 清除Eslint检查结果临时文件
      rimraf.sync(this.outputPath)
      rimraf.sync(path.join(this.context, '.scannerwork'))
    }
  }
}
