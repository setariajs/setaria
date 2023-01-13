const config = {
  jsonSchema: {
    input: {
      swaggerUrls: {
        preprocess: {
          url: 'http://10.239.187.3:30201/preprocess/v3/api-docs',
          name: '预处理服务'
        },
        sys: {
          url: 'http://10.239.187.3:30101/sys/v3/api-docs',
          name: '公共服务'
        },
        summary: {
          url: 'http://10.239.187.3:30501/summary/v3/api-docs',
          name: '财务汇总'
        },
        fae: {
          url: 'http://10.239.187.3:30001/fea-fae/v3/api-docs',
          name: 'Web服务'
        },
        report: {
          url: 'http://10.239.187.3:30601/fea-fae-report/v3/api-docs',
          name: '报表'
        },
        settlement: {
          url: 'http://10.239.187.3:30701/settlement/v3/api-docs',
          name: '内部往来'
        },
        rule: {
          url: 'http://10.239.187.3:30301/rules/v3/api-docs',
          name: '规则管理'
        }
      }
    },
    output: './config',
    setting: {
      // 将api整理到一起，生成Yapi等工具所用，将同一实例内的api归类到一起，以用于yapi等工具不支持三级目录的情况
      isOutputApiManagementFile: true,
      isTitleNullCompletionByPropKey: false,
      excludeTagList: ['测试API', '测试']
    }
  }
}
module.exports = config
