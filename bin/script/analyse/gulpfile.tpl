const gulp = require('gulp')
const path = require('path')
const sonarqubeScanner = require('sonarqube-scanner')

gulp.task('default', function (callback) {
  sonarqubeScanner({
    serverUrl: '<%= serverUrl >',
    token: '<%= serverToken >',
    options: {
      // 代码仓库地址
      // 'sonar.links.scm': '',
      'sonar.sources': '<%= sources >',
      'sonar.projectKey': '<%= projectKey >',
      'sonar.eslint.reportPaths': '<%= reportFilePath >'
    }
  }, callback)
})
