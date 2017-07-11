// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');
var modifyResponse = require('node-http-proxy-json');
var mock = require('../mock/mock.js');
var devEnvObj = require('./dev.env');
var prodEnvObj = require('./prod.env');

function getEnvConfig (key) {
  var env = process.env.NODE_ENV === 'production' ? prodEnvObj : devEnvObj;
  return env[key].replace(/"/g, '');
}

var config = {
  build: {
    env: prodEnvObj,
    index: path.resolve(__dirname, '../../server/public/index.html'),
    assetsRoot: path.resolve(__dirname, '../../server/public'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: devEnvObj,
    port: 8083,
    autoOpenBrowser: false,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // cann't use es6 grammar, so define it in other ways
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}

// only use in dev
var proxyKey = getEnvConfig('PROXY_KEY');
var pathRegex = '^' + proxyKey;
config.dev.proxyTable[proxyKey] = {
  target: getEnvConfig('TARGET_WEBSERVICE_SERVER'),
  changeOrigin: true,
  proxyTimeout: parseInt(devEnvObj.PROXY_HTTP_TIMEOUT, 10),
  onProxyReq: function(proxyReq, req, res) {
    if(req.body) {
      var bodyData = JSON.stringify(req.body);
      // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
      proxyReq.setHeader('Content-Type','application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      // stream the content
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: function(proxyRes, req, res) {
    if (proxyRes.statusCode !== 200 && devEnvObj.MOCK_MODE === '"true"') {
      delete proxyRes.headers['content-length'];
      modifyResponse(res, proxyRes.headers['content-encoding'], function (body) {
        body = mock.call(req, res);
        console.log(body);
        return body;
      });
      proxyRes.statusCode = 200;
      proxyRes.statusMessage = 'OK';
    }
  },
  onError: function(err, req, res) {
    console.log(err.code);
    if (devEnvObj.MOCK_MODE === '"true"') {
      res.json(mock.call(req, res));
    }
  },
}
config.dev.proxyTable[proxyKey].pathRewrite = {};
config.dev.proxyTable[proxyKey].pathRewrite[pathRegex] = '';
module.exports = config;
