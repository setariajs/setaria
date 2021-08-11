const path = require('path')
const buble = require('rollup-plugin-buble')
const replace = require('rollup-plugin-replace')
const flow = require('rollup-plugin-flow-no-whitespace')
const version = process.env.VERSION || require('../package.json').version
const banner =
`/**
 * Setaria v${version}
 * (c) ${new Date().getFullYear()} Ray Han
 * @license MIT
 */`

const resolve = _path => path.resolve(__dirname, '../', _path)

const configs = {
  umdDev: {
    entry: resolve('src/index.esm.js'),
    dest: resolve('dist/setaria.js'),
    format: 'umd',
    env: 'development'
  },
  umdProd: {
    entry: resolve('src/index.esm.js'),
    dest: resolve('dist/setaria.min.js'),
    format: 'umd',
    env: 'production'
  },
  commonjs: {
    entry: resolve('src/index.esm.js'),
    dest: resolve('dist/setaria.common.js'),
    format: 'cjs'
  },
  esm: {
    entry: resolve('src/index.esm.js'),
    dest: resolve('dist/setaria.esm.js'),
    format: 'es'
  }
}

function genConfig (opts) {
  const config = {
    entry: opts.entry,
    dest: opts.dest,
    format: opts.format,
    banner,
    moduleName: 'Setaria',
    plugins: [
      flow(),
      // rollCommonjs(),
      replace({
        __VERSION__: version
      }),
      buble()
      // rollResolve()
    ]
  }

  if (opts.env) {
    config.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }
  return config
}

function mapValues (obj, fn) {
  const res = {}
  Object.keys(obj).forEach(key => {
    res[key] = fn(obj[key], key)
  })
  return res
}

module.exports = mapValues(configs, genConfig)
