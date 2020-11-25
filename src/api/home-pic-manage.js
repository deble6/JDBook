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
  getCommSelectData: {
    url: '/pc/slideshowHome/listGoods',
    method: 'post'
  },
  deleteslideshow: {
    url: '/pc/slideshowHome/deleteSlideshowHome',
    method: 'post'
  },
  uploadImage: {
    url: '/pc/imageUpload/uploadImage',
    method: 'post'
  },
  addslideshow: {
    url: '/pc/slideshowHome/addSlideshowHome',
    method: 'post'
  },
  getTableData: {
    url: '/pc/slideshowHome/listSlideshowHome',
    method: 'post'
  },
  updateSliderState: {
    url: '/pc/slideshowHome/updateSlideshowHomeState',
    method: 'post'
  }
}

const request = function (funcName, requestParam) {
  return req(config[funcName].url, config[funcName].method, requestParam, {}, config[funcName].fileConfig)
}
export default request
