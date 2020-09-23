export default {
  publicPath: `/${process.env.VUE_APP_SITE_ID}${process.env.VUE_APP_CLIENT_BASE_URL}`,
  lintOnSave: true,
  productionSourceMap: false,
  pages: {
    index: process.env.VUE_APP_ENTRY_PAGE_FILE || 'src/main.js'
  },
  configureWebpack: {
    devtool: (process.env.NODE_ENV === 'production') ? false : 'eval-source-map',
    entry: {
      framework: ['setaria'],
      vendors: ['vue', 'vuex', 'vue-router', 'moment', 'numeral', 'ramda']
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          framework: {
            chunks: 'async',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            name: 'framework'
          },
          vendors: {
            chunks: 'async',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            name: 'vendors'
          }
        }
      }
    }
  }
}
