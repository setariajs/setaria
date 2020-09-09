const chalk = require('chalk')

const warning = function (message) {
  console.log(chalk.bold.yellow(message))
}
exports.warning = warning

const info = function (message) {
  console.log(chalk.bold.gray(message))
}
exports.info = info

const label = function (message) {
  console.log(chalk.bold.cyan(message))
}
exports.label = label

const success = function (message) {
  console.log(chalk.bold.green(message))
}
exports.success = success

const error = function (message) {
  console.log(chalk.bold.red(message))
}
exports.error = error
