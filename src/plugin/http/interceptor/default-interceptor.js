import addLoading from './request/addLoading'
import errorHandler from './response/errorHandler'
import subLoading from './response/subLoading'

export default {
  homepage: {
    request: [
      [
        addLoading
      ]
    ],
    response: [
      [
        subLoading, errorHandler
      ]
    ]
  }
}
