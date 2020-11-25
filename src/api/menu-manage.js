import req from '../fetch/index.js'

const config = {
  getTreeData: {
    url: '/pc/menu/listMenu',
    method: 'post'
  },
  // 查询导航栏菜单
  getNavbarMenu: {
    url: '/pc/menu/listMenuHome',
    method: 'post'
  },
  getDetail: {
    url: '/pc/menu/getMenu',
    method: 'post'
  },
  addMenu: {
    url: '/pc/menu/addMenu',
    method: 'post'
  },
  getMenu: {
    url: '/pc/menu/getMenu',
    method: 'post'
  },
  updateMenu: {
    url: '/pc/menu/updateMenu',
    method: 'post'
  },
  deleteMenu: {
    url: '/pc/menu/deleteMenu',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
