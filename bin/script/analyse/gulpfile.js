const gulp = require('gulp')
const path = require('path')
const sonarqubeScanner = require('sonarqube-scanner')
const argv = require('yargs').argv
const CreateEslintReport = require('./create-eslint-report')

const projectKey = argv.projectKey ? argv.projectKey : path.basename(process.cwd())
// Eslint Report 文件路径
const filePath = new CreateEslintReport().getEslintReportFilePath()
gulp.task('default', function (callback) {
  sonarqubeScanner({
    serverUrl: 'http://sonarServerIp',
    token: '5a255e2ca562ee94716f47f6231735f4aa4b179b',
    options: {
      // 代码仓库地址
      // 'sonar.links.scm': '',
      'sonar.sources': 'src/page,src/model/module,src/model/service',
      'sonar.projectKey': projectKey,
      'sonar.eslint.reportPaths': filePath
    }
  }, callback)
})
