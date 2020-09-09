const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const exec = require('../exec-util')

const FILE_NAME = 'report.json'

module.exports = class EslintReport {
  constructor (context) {
    this.context = context || process.cwd()
    this.eslintReportFolderPath = path.join(this.context, '.eslint-report')
    this.eslintReportFileFullPath = path.join(this.eslintReportFolderPath, FILE_NAME)
  }

  getEslintReportFilePath () {
    return this.eslintReportFileFullPath
  }

  create () {
    if (!fs.existsSync(this.eslintReportFolderPath)) {
      fs.mkdirSync(this.eslintReportFolderPath)
    }
    try {
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

  clear () {
    rimraf.sync(this.eslintReportFolderPath)
  }
}
