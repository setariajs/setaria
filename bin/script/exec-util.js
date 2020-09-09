const chalk = require('chalk')
const childProcess = require('child_process')

/**
 * 设置显示在控制台上的命令样式
 */
function commandStyle (val) {
  return chalk.underline.gray(val)
}

/**
 * 执行命令并取得命令输出结果
 */
const getOutput = function (cmd) {
  const out = childProcess.execSync(cmd).toString()
  return out.trim().replace('\n', '').replace('\r\n', '')
}
exports.getOutput = getOutput

/**
 * 执行指定命令
 */
const cmd = function (cmd) {
  console.log(commandStyle(`exec command: ${cmd}`))
  return getOutput(cmd)
}
exports.cmd = cmd
