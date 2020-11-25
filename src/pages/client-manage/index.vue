<template>
  <div>
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="客户名称" prop="userName">
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="客户账号" prop="userAcct">
        <el-input v-model="formData.userAcct"></el-input>
      </el-form-item>
    </i-search>

    <i-table 
     :tableData="tableData"
     :pageInfo="pageInfo"
     :selectionShow="false"
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
      </el-table-column>
    </i-table>

  </div>
</template>

<script>
import iSearch from '@/components/i-search.vue'
import iTable from '@/components/i-table.vue'
import req from '@/api/client-manage.js'

export default {
  name: 'client-manage',
  components: {
    iSearch,
    iTable
  },
  data () {
    return {
      formData: {
        userName: '',
        userAcct: ''
      },
      dialogVisible: false,
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      columnList: [
        {label: '客户名称', prop: 'userName'},
        {label: '客户编号', prop: 'userId'},
        {label: '客户账号', prop: 'userAcct'},
        {label: '姓名', prop: 'userName'},
        {label: '性别', prop: 'sex', distName: 'sexOptions'},
        {label: '手机', prop: 'phone'},
        {label: '客户邮箱', prop: 'mail'},
        {label: '身份证', prop: 'idCard'}
      ],
      tableData: [],
      multipleSelection: [],
      sexOptions: [
        {label: '男', value: '0'},
        {label: '女', value: '1'}
      ]
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageNum = 1
      this.search()
    },
    search () {
      req('getTableData', {
        ...Object.assign({}, this.formData, {role: JSON.parse(sessionStorage.getItem('roleInfo')).role}),
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
      this.pageInfo.pageIndex = value
      this.search()
    },
    handleSelectionChange (rows) {
      console.log('rows', rows)
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
