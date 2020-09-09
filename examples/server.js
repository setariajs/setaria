const express = require('express')
const path = require('path')
const webpack = require('webpack')
const { createProxyMiddleware } = require('http-proxy-middleware')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')
const history = require('connect-history-api-fallback')

const app = express()
const compiler = webpack(WebpackConfig)

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))

app.use(webpackHotMiddleware(compiler))

app.use(history({
  index: '/index.html',
  rewrites: [
    {
      from: /\/router\//,
      to: '/router/index.html'
    }
  ],
  logger: console.log.bind(console)
}))
app.use(express.static(__dirname))

// proxy
app.use('^/heweather', createProxyMiddleware({
  target: 'https://free-api.heweather.com/',
  changeOrigin: true,
  pathRewrite: {
    '^/heweather/': '/'
  }
}))

// mock data for test start
app.get('/api/biz/user', function (req, res) {
  res.json({
    code: '00000',
    data: {
      'userId': 'setaria',
      'sex': 'gender',
      'name': 'Ray'
    }
  })
})
app.post('/api/biz/business-error', function (req, res) {
  res.status(500).json({
    code: 'PLN00069',
    message: '参数不完整！'
  })
})
app.post('/api/biz/download-business-error', function (req, res) {
  res.status(500).json({
    code: 'FIL00069',
    message: '希望下载的文件不存在！'
  })
})
app.post('/api/biz/excel-download', function (req, res) {
  res.download(path.join(__dirname, '/test.xlsx'))
})
app.post('/api/biz/pdf-download', function (req, res) {
  res.download(path.join(__dirname, '/test.pdf'))
})
app.post('/api/biz/txt-download', function (req, res) {
  res.download(path.join(__dirname, '/test.txt'))
})
// end

const port = process.env.PORT || 6060
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
