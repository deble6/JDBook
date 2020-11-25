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
    url: '/pc/goods/listGoods',
    method: 'post'
  },
  addGoods: {
    url: '/pc/goods/addGoods',
    method: 'post'
  },
  changeGoodsInfo: {
    url: '/pc/goods/updateGoods',
    method: 'post'
  },
  deletegoods: {
    url: '/pc/goods/deleteGoods',
    method: 'post'
  },
  getGoodsData: {
    url: '/pc/goods/getGoods',
    method: 'post'
  },
  uploadImage: {
    url: '/pc/imageUpload/uploadImage',
    method: 'post'
  },
  listClassify: {
    url: '/pc/goods/listGoodsClassify',
    method: 'post'
  },
  updateGoodsStatus: {
    url: '/pc/goods/updateGoodsShelfState',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
