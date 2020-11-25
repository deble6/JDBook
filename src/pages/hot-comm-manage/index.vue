<template>
  <div>
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="formData.goodsName"></el-input>
      </el-form-item>
      <el-form-item label="商品编号" prop="goodsId">
        <el-input v-model="formData.goodsId"></el-input>
      </el-form-item>
    </i-search>

    <i-table
      :toolbar="toolbar"
      :tableData="tableData"
      :pageInfo="pageInfo"
      :selectionShow="true"
      v-loading="tableLoading"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @selection-change="handleSelectionChange">
      <el-table-column
        v-for="(item, index) in columnList"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        align="center"
        :width="item.width"
        :show-overflow-tooltip="true"
        :formatter="columnFormatter">
      </el-table-column>
    </i-table>

    <i-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      @dialog-before-close="dialogBeforeClose"
      @dialog-cancel="dialogCancel"
      @dialog-confirm="dialogConfirm">
      <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="100px">
        <el-row>
          <el-col :span='12'>
            <el-form-item label="商品" prop="goodsId">
              <comm-select v-model="dialogFormData.goodsId"></comm-select>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="热门位排序" prop="hotGoodsNum">
              <el-input v-model.number="dialogFormData.hotGoodsNum" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>

    <!-- 热门商品展示设置 -->
    <i-dialog
      v-model="hotDialogVisible"
      title="数量展示设置"
      @dialog-before-close="hotDialogBeforeClose"
      @dialog-cancel="hotDialogCancel"
      @dialog-confirm="hotDialogConfirm">
      <el-form :model="hotDialogFormData" ref="hotForm" :rules="hotFormRules" label-width="120px">
        <el-row>
          <el-col :span='12'>
            <el-form-item label="数量展示设置" prop="hotGoodsShowNum">
              <el-input v-model="hotDialogFormData.hotGoodsShowNum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
import ISearch from '@/components/i-search.vue'
import ITable from '@/components/i-table.vue'
import IDialog from '@/components/i-dialog.vue'
import req from '@/api/hot-comm-manage.js'
import CommSelect from './comm-select.vue'

export default {
  name: 'hot-comm-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    CommSelect
  },
  data () {
    return {
      dialogType: 'add',
      tableLoading: false,
      formData: {
        goodsName: '',
        goodsId: ''
      },
      dialogFormData: {
        goodsId: '',
        hotGoodsNum: ''
      },
      hotDialogFormData: {},
      dialogVisible: false,
      hotDialogVisible: false,
      dialogTitle: '新增热门位商品',
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      toolbar: [
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogVisible = true
            this.dialogType = 'add'
            this.dialogTitle = '新增热门位商品'
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要修改的数据')

              return
            }

            if (this.tableSelectRows.length > 1) {
              this.$message.info('当前不支持批量修改数据')

              return
            }

            this.dialogVisible = true
            this.dialogType = 'edit'
            this.dialogTitle = '修改热门位商品'
            req('getHotDetailData', {hotGoodsId: this.tableSelectRows[0].hotGoodsId}).then(data => {
              this.dialogFormData = Object.assign({}, data.data)

              this.$nextTick(() => {
                this.$refs.form.validateField('goodsId')
              })
            })
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.info('请选择需要删除的数据')

              return
            }

            this.$confirm('此操作将永久删除该文件,是否继续?').then(() => {
              let ids = this.tableSelectRows.map(item => {
                return item.hotGoodsId
              }).toString()

              req('deleteHot', {hotGoodsId: ids}).then(data => {
                this.$message.success(data.msg)

                this.fetch()
              })
            })
          }
        },
        {
          btnName: '数量展示',
          type: 'primary',
          func: () => {
            this.hotDialogVisible = true
            req('getHotNum', {}).then(data => {
              this.hotDialogFormData = data.data
            })
            // this.$confirm('是否需要将选中的数据进行上架?').then(() => {
            //   let goodsIds = this.tableSelectRows.map(item => {
            //     return item.goodsId
            //   }).toString()

            //   let versions = this.tableSelectRows.map(item => {
            //     return item.version
            //   }).toString()

            //   req('updateGoodsStatus', {
            //     goodsId: goodsIds,
            //     goodsStateId: '1',
            //     version: versions
            //   }).then(data => {
            //     this.$message.success(data.msg)

            //     this.fetch()
            //   })
            // })
          }
        }
      ],
      columnList: [
        {label: '热门商品排序', prop: 'hotGoodsNum'},
        {label: '商品编号', prop: 'goodsId'},
        {label: '商品名称', prop: 'goodsName'},
        {label: '商品价格', prop: 'goodsPrice'},
        {label: '商品描述', prop: 'goodsDescribe'},
        {label: '热门商品编号', prop: 'hotGoodsId'}
      ],
      tableData: [],
      tableSelectRows: [],
      formRules: {
        goodsId: [
          { required: true, message: '请选择商品', trigger: 'change' }
        ],
        hotGoodsNum: [
          { required: true, message: '请输入排序', trigger: 'change' },
          { type: 'number', message: '排序必须为数字' }
        ]
      },
      hotFormRules: {
        hotGoodsShowNum: [
          { required: true, message: '请输入数量', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.search()
  },
  watch: {
    'dialogFormData.goodsId': {
      handler (value) {
        this.$refs.form.validateField('goodsId')
      },
      deep: true
    }
  },
  methods: {
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageNum = 1
      this.search()
    },
    search () {
      this.tableLoading = true

      req('getTableData', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        this.tableLoading = false
        this.tableData = data.data.list
        this.pageInfo.pageNum = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
      }).catch(() => {
        this.tableLoading = false
      })
    },
    reset () {
      this.fetch()
    },
    handleSizeChange (value) {
      this.pageInfo.pageNum = 1
      this.pageInfo.pageSize = value
      this.search()
    },
    handleCurrentChange (value) {
      this.pageInfo.pageNum = value
      this.search()
    },
    handleSelectionChange (rows) {
      this.tableSelectRows = rows
    },
    dialogBeforeClose () {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    hotDialogBeforeClose () {
      this.$nextTick(() => {
        this.$refs.hotForm.resetFields()
      })
    },
    dialogCancel () {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    hotDialogCancel () {
      this.$refs.hotForm.resetFields()
      this.hotDialogVisible = false
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'add') {
            req('addHotComm', {...this.dialogFormData}).then(data => {
              if (data.code === 0) {
                this.$message.success(data.msg)

                this.fetch()
                this.$refs.form.resetFields()
                this.dialogVisible = false
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            req('updateHot', {...this.dialogFormData}).then(data => {
              if (data.code === 0) {
                this.$message.success(data.msg)

                this.fetch()
                this.$refs.form.resetFields()
                this.dialogVisible = false
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    hotDialogConfirm () {
      this.$refs.hotForm.validate((valid) => {
        if (valid) {
          req('changeHotNum', {...this.hotDialogFormData}).then(data => {
            if (data.code === 0) {
              this.$message.success(data.msg)

              this.fetch()
              this.$refs.hotForm.resetFields()
              this.hotDialogVisible = false
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    // 表格表头的循环list变量名一定要是columnList
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
