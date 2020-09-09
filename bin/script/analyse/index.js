const path = require('path')
const exec = require('../exec-util')
const log = require('../log-util')
const CreateEslintReport = require('./create-eslint-report')

module.exports = class Analyse {
  /**
   * 业务代码分析脚本
   */
  constructor (context) {
    this.context = context
    this.createEslintReport = new CreateEslintReport(context)
  }

  run () {
    // 生成Eslint检查结果
    this.createEslintReport.create()
    const gulpFilePath = path.join(__dirname, 'gulpfile.js')
    log.info(`Working directory: ${process.cwd()}`)
    console.log(exec.cmd(`gulp -f ${gulpFilePath} --cwd ${this.context}`))
    // 清除Eslint检查结果临时文件
    this.createEslintReport.clear()
  }
}
