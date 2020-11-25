import req from '../fetch/index.js'

const config = {
  getTreeData: {
    url: '/pc/goodsClassify/listAllGoodsClassify',
    method: 'post'
  },
  getDetail: {
    url: '/pc/goodsClassify/getGoodsClassify',
    method: 'post'
  },
  addClassify: {
    url: '/pc/goodsClassify/addGoodsClassify',
    method: 'post'
  },
  getMenu: {
    url: '/pc/menu/getMenu',
    method: 'post'
  },
  updateClassify: {
    url: '/pc/goodsClassify/updateGoodsClassify',
    method: 'post'
  },
  deleteClassify: {
    url: '/pc/goodsClassify/deleteGoodsClassify',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
