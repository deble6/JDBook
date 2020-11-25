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
    url: '/pc/store/listStores',
    method: 'post'
  },
  getStore: {
    url: '/pc/store/getStore',
    method: 'post'
  },
  deleteStore: {
    url: '/pc/store/deleteStore',
    method: 'post'
  },
  add: {
    url: '/pc/store/addStore',
    method: 'post'
  },
  modify: {
    url: '/pc/store/updateStore',
    method: 'post'
  },
  listClassify: {
    url: '/pc/selectCombox/listArea',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request