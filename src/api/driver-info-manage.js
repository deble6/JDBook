import req from '../fetch/index.js'

const config = {
  // portExport: {
  //   url: '/api/media/stimulate/exportExcel',
  //   method: 'post',
  //   fileConfig: {
  //     type: 'file',
  //     fileName: '销售激励报表'
  //   }
  // },
  getTableData: {
    url: '/pc/driver/listDrivers',
    method: 'post'
  },
  getdriver: {
    url: '/pc/driver/getDriver',
    method: 'post'
  },
  deletedriver: {
    url: '/pc/driver/deleteDriver',
    method: 'post'
  },
  add: {
    url: '/pc/driver/addDriver',
    method: 'post'
  },
  modify: {
    url: '/pc/driver/updateDriver',
    method: 'post'
  },
  listClassify: {
    url: '/pc/selectCombox/listArea',
    method: 'post'
  },
  uploadImage: {
    url: '/pc/imageUpload/uploadImage',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request