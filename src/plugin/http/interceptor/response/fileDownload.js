/**
 * 取得调用服务时指定的ResponseType
 */
function getResponseType (response) {
  const request = (response && response.request) || {}
  return request.responseType
}

/**
 * 判断是否执行文件下载逻辑
 */
function isExecuteFileDownload (response) {
  const responseType = getResponseType(response)
  return responseType === 'arraybuffer' ||
    responseType === 'blob'
}

export default function fileDownload (response) {
  const mime = response.headers['content-type']
  if (isExecuteFileDownload(response) && mime.indexOf('application/json') !== 0) {
    // 修复某些场合下response header key为大写字母时，无法取得文件信息的问题
    const disposition = response.headers['content-disposition'] || response.headers['CONTENT-DISPOSITION']
    let filename = 'unknown-file'
    if (disposition) {
      let dispositionFileRegexResult = disposition.match(/filename="(.*)"/)
      if (dispositionFileRegexResult === null) {
        dispositionFileRegexResult = disposition.match(/filename=(.*)/)
      }
      if (dispositionFileRegexResult) {
        filename = decodeURI(dispositionFileRegexResult[1])
      }
    }
    var blob = new window.Blob([response.data], { type: mime || 'application/octet-stream' })
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      // IE workaround for "HTML7007: One or more blob URLs were
      // revoked by closing the blob for which they were created.
      // These URLs will no longer resolve as the data backing
      // the URL has been freed."
      window.navigator.msSaveBlob(blob, filename)
    } else {
      var blobURL = window.URL.createObjectURL(blob)
      var tempLink = document.createElement('a')
      tempLink.style.display = 'none'
      tempLink.href = blobURL
      tempLink.setAttribute('download', filename)

      // Safari thinks _blank anchor are pop ups. We only want to set _blank
      // target if the browser does not support the HTML5 download attribute.
      // This allows you to download files in desktop safari if pop up blocking
      // is enabled.
      if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank')
      }

      document.body.appendChild(tempLink)
      tempLink.click()
      document.body.removeChild(tempLink)
      window.URL.revokeObjectURL(blobURL)
    }
  }
  return response
}
