<template>
  <div class="container">
    <div class="comm-box">
      <el-button class="add-btn" @click="openDialog" type="primary" icon="el-icon-plus"></el-button>
      <span>{{goodsId}}</span>
    </div>

    <i-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      @dialog-before-close="dialogBeforeClose"
      @dialog-cancel="dialogCancel"
      @dialog-confirm="dialogConfirm"
      @dialog-open ="dialogOpen"
      :appendToBody="true">

      <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
        <el-form-item label="商品名称" prop="goodsName">
          <el-input v-model="formData.goodsName"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" prop="goodsId">
          <el-input v-model="formData.goodsId"></el-input>
        </el-form-item>
      </i-search>

      <i-table
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
    </i-dialog>
  </div>
</template>

<script>
import iSearch from '@/components/i-search.vue'
import iTable from '@/components/i-table.vue'
import IDialog from '@/components/i-dialog.vue'
import req from '@/api/hot-comm-manage.js'

export default {
  name: 'comm-select',
  components: {
    iSearch,
    iTable,
    IDialog
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      goodsId: '',
      dialogVisible: false,
      dialogTitle: '轮播商品选择',
      formData: {
        goodsName: '',
        goodsId: ''
      },
      tableData: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      goodsStateOptions: [
        {label: '售罄', value: '0'},
        {label: '在售', value: '1'},
        {label: '已下架', value: '2'},
        {label: '未发布', value: '3'}
      ],
      tableLoading: false,
      tableSelectRows: [],
      columnList: [
        {label: '商品编号', prop: 'goodsId'},
        {label: '商品名称', prop: 'goodsName'},
        {label: '商品状态', prop: 'goodsStateId', distName: 'goodsStateOptions'},
        {label: '一级分类', prop: 'oneClassifyName'},
        {label: '二级分类', prop: 'twoClassifyName'}
      ]
    }
  },
  watch: {
    value: {
      handler (value) {
        this.goodsId = value
      },
      deep: true
    }
  },
  methods: {
    openDialog () {
      this.dialogVisible = true
    },
    dialogBeforeClose () {
      this.formData.goodsName = ''
      this.formData.goodsId = ''
      this.dialogVisible = false
    },
    dialogOpen () {
      this.fetch()
    },
    dialogCancel () {
      this.formData.goodsName = ''
      this.formData.goodsId = ''
      this.dialogVisible = false
    },
    dialogConfirm () {
      if (this.tableSelectRows.length === 0) {
        this.$message.info('请至少选择一条数据')

        return
      }

      if (this.tableSelectRows.length > 1) {
        this.$message.info('只能选择一条数据')

        return
      }

      this.$emit('input', this.tableSelectRows[0].goodsId)
      this.formData.goodsName = ''
      this.formData.goodsId = ''
      this.dialogVisible = false
    },
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageNum = 1
      this.search()
    },
    search () {
      this.tableLoading = true

      req('getCommSelectData', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        console.log(data)
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
    // 表格表头的循环list变量名一定要是columnList
    columnFormatter (row, column, cellValue, index) {
      let distName = this.columnList.filter(item => {
        return item.prop === column.property
      })[0].distName

      if (distName) {
        return this[distName].filter(item => {
          return item.value === row[column.property]
        })[0].label
      } else {
        return row[column.property]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .comm-box {
    display: flex;
    justify-content: space-between;

    .add-btn {
      padding: 0 10px;
    }

    span:nth-child(2) {
      flex: 1;
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      padding: 0 5px;
      box-sizing: border-box;
      cursor: pointer;

      &:hover {
        color: #409EFF;
      }
    }

    .delete-btn {
      padding: 0 10px;
    }
  }
}
</style>
