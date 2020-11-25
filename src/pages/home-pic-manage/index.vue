<template>
  <div>
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
    <el-form-item label="状态" prop="slideshowStateId">
      <el-select clearable v-model="formData.slideshowStateId" placeholder="请选择">
      <el-option
        v-for="(item, index) in slideshowStateIdOptions"
        :key="index"
        :label="item.label"
        :value="item.value">
      </el-option>
      </el-select>
    </el-form-item>
    </i-search>

    <i-table :toolbar="toolbar"
     :tableData="tableData"
     :pageInfo="pageInfo"
     :selectionShow="true"
     @handleSizeChange="handleSizeChange" 
     @handleCurrentChange="handleCurrentChange"
     @selection-change="handleSelectionChange">
      <el-table-column 
      v-for="(item, index) in columnList"
      :key="index"
      :label="item.label"
      :prop="item.prop"
      :width="item.width"
      align="center"
      :show-overflow-tooltip="true"
      :formatter="columnFormatter">
      <template slot-scope="scope">
        <el-button v-if="item.prop === 'watch'" type="text" @click="watchImg(scope.row)">预览</el-button>
        <span v-else>{{ filterDist(scope.row[item.prop], item)}}</span>
      </template>
      </el-table-column>
    </i-table>

    <i-dialog v-model="dialogVisible"
    :title="dialogTitle"
    @dialog-before-close="dialogBeforeClose"
    @dialog-cancel="dialogCancel"
    @dialog-confirm="dialogConfirm">
    <el-form :model="dialogFromData" label-width="100px" :rules="rules" ref="ruleForm">
    <el-row>
      <el-col :span="12">
        <el-form-item label="图片" prop="imagePath">
          <i-file v-model="dialogFromData.imagePath"></i-file>
        </el-form-item>
      </el-col>
      <el-col :span="12"> 
      <el-form-item label="排序" prop="slideshowNum">
      <el-input v-model.number="dialogFromData.slideshowNum"></el-input>
      </el-form-item>
      </el-col>
      <el-col :span="12"> 
      <el-form-item label="有效期起" prop="startTime">
        <el-date-picker
        v-model="dialogFromData.startTime"
        :picker-options="startTimePickerOptions"
        placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      </el-col>
      <el-col :span="12"> 
      <el-form-item label="有效期止" prop="endTime">
        <el-date-picker
        v-model="dialogFromData.endTime"
        :picker-options="endTimePickerOptions"
        placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      </el-col>
      <el-col :span="12"> 
      <el-form-item label="商品" prop="goodsId">
      <comm-select v-model="dialogFromData.goodsId"></comm-select>
      </el-form-item>
      </el-col>
    </el-row>
    </el-form>
    </i-dialog>
  </div>
</template>

<script>
import iSearch from '@/components/i-search.vue'
import iTable from '@/components/i-table.vue'
import IDialog from '@/components/i-dialog.vue'
import CommSelect from './comm-select.vue'
import req from '@/api/home-pic-manage.js'
import IFile from '@/components/i-file.vue'
import moment from 'moment'

export default {
  name: 'home-pic-manage',
  components: {
    iSearch,
    iTable,
    IDialog,
    IFile,
    CommSelect
  },
  data () {
    return {
      formData: {
        slideshowStateId: ''
      },
      dialogFromData: {
        slideshowNum: '',
        imagePath: '',
        startTime: '',
        endTime: '',
        goodsId: ''
      },
      dialogVisible: false,
      dialogTableVisible: false,
      dialogTitle: '',
      dialogTitle1:'轮播商品选择',
      dialogType: '',
      delete: [],
      update: {},
      tableSelectRows: [],
      // imageToken: {access_token: JSON.parse(sessionStorage.getItem('userInfo')).access_token},
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      startTimePickerOptions: {
        disabledDate: (value ) => {
          if (this.dialogFromData.endTime !== ''){
           return this.dialogFromData.endTime < value 
          }
        }
      },
      endTimePickerOptions: {
        disabledDate: (value ) => {
          return this.dialogFromData.startTime > value
        }
      },
      slideshowStateIdOptions:[
        {label: '已禁用', value: '0'},
        {label: '启用', value: '1'}
      ],
      toolbar:[
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogTitle = '新增轮播图',
            this.dialogType = 'add'
            this.dialogVisible = true
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.delete.length !==0) {
              this.$confirm('此操作将永久删除该轮播图，是否继续？').then(() => {
                let ids = ''
                this.delete.forEach(element => {
                  ids+=element.slideshowId+','
                })
                req('deleteslideshow', {
                  slideshowId: ids
                }).then(data => {
                  // console.log(data)
                  this.fetch()
                  this.$message.success(data.msg)
                })
              })
            } else {
              this.$message.error('请选择要删除的轮播图！')
            }  
          }
        },
        {
          btnName: '启用',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要修改的数据')
              return
            }
            this.$confirm('是否需要将选中的数据进行启用?').then(() => {
              let slideshowIds = this.tableSelectRows.map(item => {
                return item.slideshowId
              }).toString()
              let versions = this.tableSelectRows.map(item => {
                return item.version
              }).toString()
              req('updateSliderState', {
                slideshowId: slideshowIds,
                slideshowStateId: '1',
                version: versions
              }).then(data => {
                this.$message.success(data.msg)
                this.fetch()
              })
            })
          }
        },
        {
          btnName: '禁用',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要修改的数据')
              return
            }
            this.$confirm('是否需要将选中的数据进行禁用?').then(() => {
              let slideshowIds = this.tableSelectRows.map(item => {
                return item.slideshowId
              }).toString()
              let versions = this.tableSelectRows.map(item => {
                return item.version
              }).toString()
              req('updateSliderState', {
                slideshowId: slideshowIds,
                slideshowStateId: '0',
                version: versions
              }).then(data => {
                this.$message.success(data.msg)
                this.fetch()
              })
            })
          }
        },
      ],
      columnList: [
        {label: '排序', prop: 'slideshowNum', width:'60px'},
        {label: '图片路径', prop: 'slideshowPath', width:'400px'},
        {label: '状态', prop: 'slideshowStateId', width:'100px', distName: 'slideshowStateIdOptions'},
        {label: '有效期起', prop: 'startTime', width:'120px'},
        {label: '有效期止', prop: 'endTime', width:'120px'},
        {label: '首页轮播图编号', prop: 'slideshowId', width:'173px'},
        {label: '预览', prop: 'watch',width:'100px'},
      ],
      tableData: [],
      multipleSelection: [],
        rules: {
          imagePath: [
          { required: true, message: '请上传商品图片', trigger: 'change' }
          ],
          slideshowNum: [
          { required: true, message: '请输入轮播图排序', trigger: 'change' },
          { type: 'number', message: '轮播图排序必须为数字' }
          ],
          startTime: [
            { required: true, message: '请选择有效期起', trigger: 'change' }
          ],
          endTime: [
            { required: true, message: '请选择有效期止', trigger: 'change' }
          ],
          // goodsId: [
          // { required: true, message: '请选择商品', trigger: 'change' }
          // ],
        }
    }
  },
  mounted () {
    this.search()
  },
  filters: {
    filterDist (value, distName) {
      if (distName) {
        return this[distName].filter(item => {
          return item.value === value
        })[0].label
      }
    }
  },
  // watch: {
  //   'dialogFromData.goodsId': {
  //     handler (value) {
  //       this.$refs.form.validateField('goodsId')
  //     },
  //     deep: true
  //   }
  // },
  methods: {
    // 获取上传成功返回的地址
    // handleAvatarSuccess (res) {
    //   console.log('res',res)
    //   this.dialogFromData.imagePath = res.data.url 
    // },
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageNum = 1
      this.search()
    },
    search () {
      req('getTableData', {
        access_token: JSON.parse(sessionStorage.getItem('userInfo')).access_token,
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        console.log(data)
        this.tableData = data.data.list
        this.pageInfo.pageNum = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
      })
    },
    // 上传图片
    // uploadImage () {
    //   // 服务器请求的数据
    //   req('uploadImage', {
    //     imageFile: this.imageFile
    //   }).then(data => {
    //   })
    // },
    reset () {
      this.fetch()
      console.log('重置按钮被点击了')
      // this.$refs.iSearch.$refs.form.resetFields()
    },
    handleSizeChange (value) {
      this.pageInfo.pageNum = 1
      this.pageInfo.pageSize = value
      this.search()
    },
    handleCurrentChange (value) {
      console.log('当前多少页', value)
      this.pageInfo.pageNum = value
      this.search()
    },
    handleSelectionChange(rows) {
      this.tableSelectRows = rows
      if (rows.length!==0) {
        this.update = JSON.parse(JSON.stringify(rows[0]))
        this.delete = JSON.parse(JSON.stringify(rows))
      }
    },
    dialogBeforeClose () {
      this.$refs.ruleForm.resetFields()
      this.dialogVisible = false
    },
    dialogCancel () {
      this.$refs.ruleForm.resetFields()
      this.dialogVisible = false
    },
    dialogConfirm () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          req('addslideshow', Object.assign({},
            this.dialogFromData,
            {
              startTime: moment(this.dialogFromData.startTime).format('YYYY-MM-DD'),
              endTime: moment(this.dialogFromData.endTime).format('YYYY-MM-DD')
            })).then(data => {
              // console.log(data)
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.fetch()
                this.$refs.ruleForm.resetFields()
                this.dialogVisible = false
              } else {
                this.$message.error(data.msg)
              }
            })
        } else {
          return false
        }
      })
    },
    // 查看图片
    watchImg (data) {
      window.open(data.slideshowPath)
    },
    // 转换字典
    filterDist (value, item) {
      if (item.distName) {
        return this[item.distName].filter(distItem => {
          return distItem.value === value
        })[0].label
      } else {
        return value
      }
    },
    // 表格表头的循环list变量名一定要是一致的(columnList)
    columnFormatter (row, column, cellValue, index) {
      let distName = this.columnList.filter(item => {
        return item.prop === column.property
      })[0].distName

      if (distName) {
        let currentDist = []

        currentDist = this[distName].filter(item => {
          return item.value === row[column.property]
        })

        if (currentDist[0]) {
          return currentDist[0].label
        } else {
          return row[column.property]
        }
      } else {
        return row[column.property]
      }
    }
  }
}
</script>
