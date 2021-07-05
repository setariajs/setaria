const fs = require('fs')
const path = require('path')
const exec = require('../exec-util')

module.exports = class EslintReport {
  constructor (context, outputFolder, outputFile) {
    this.context = context || process.cwd()
    this.outputFolder = outputFolder
    this.eslintReportFileFullPath = path.join(outputFolder, outputFile)
  }

  create () {
    try {
      // 开始生成eslint报告
      exec.cmd(`yarn lint --no-fix --format json > ${this.eslintReportFileFullPath}`)
    } catch (err) {
      // do nothing
      // 在eslint检查后，存在有问题的代码时，会中断命令行进程
    }

    let fileAsString = fs.readFileSync(this.eslintReportFileFullPath, 'utf-8')
    // ! FIXME eslint内置的文件输出功能存在问题，原因未知，暂时手动每次删除额外命令行输出内容
    // 删除额外命令行输出内容
    fileAsString = fileAsString.replace('yarn run v1.12.3', '')
    fileAsString = fileAsString.replace('$ vue-cli-service lint --no-fix --format json', '')
    fileAsString = fileAsString.replace('info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.', '')

    fs.writeFileSync(this.eslintReportFileFullPath, fileAsString, 'utf-8')
  }
}
