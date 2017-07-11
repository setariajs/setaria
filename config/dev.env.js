var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PROXY_KEY: '"/WS/"',
  TARGET_WEBSERVICE_SERVER: '"http://localhost:3000/WS/"',
  MOCK_MODE: '"true"',
  PROXY_HTTP_TIMEOUT: '5000'
})
