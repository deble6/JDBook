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
    url: '/pc/order/listOrders',
    method: 'post'
  },
  getorderData: {
    url: '/pc/order/getListOrder',
    method: 'post'
  },
  updateOrderStatus: {
    url: '/pc/order/updateOrderState',
    method: 'post'
  },
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request