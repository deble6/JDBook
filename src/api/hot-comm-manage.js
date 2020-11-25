import req from '../fetch/index.js'

const config = {
  getTableData: {
    url: '/pc/hotGoods/listHotGoods',
    method: 'post'
  },
  addHotComm: {
    url: '/pc/hotGoods/addHotGoods',
    method: 'post'
  },
  getHotDetailData: {
    url: '/pc/hotGoods/getHotGoods',
    method: 'post'
  },
  updateHot: {
    url: '/pc/hotGoods/updateHotGoods',
    method: 'post'
  },
  deleteHot: {
    url: '/pc/hotGoods/deleteHotGoods',
    method: 'post'
  },
  getCommSelectData: {
    url: '/pc/slideshowHome/listGoods',
    method: 'post'
  },
  changeHotNum: {
    url: '/pc/hotGoods/updateHotGoodsShowNum',
    method: 'post'
  },
  getHotNum: {
    url: '/pc/hotGoods/getHotGoodsShowNum',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
