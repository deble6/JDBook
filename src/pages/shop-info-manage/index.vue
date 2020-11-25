<template>
  <div>
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="门店编号" prop="storeId">
        <el-input v-model="formData.storeId"></el-input>
      </el-form-item>
      <el-form-item label="门店名称" prop="storeName">
        <el-input v-model="formData.storeName"></el-input>
      </el-form-item>
      <el-form-item label="店长名称" prop="userName">
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="所在省份" prop="provinceId">
        <el-select v-model="formData.provinceId"
        @change="listClassify2"
        placeholder="请选择">
        <el-option
        v-for="item in provinceIdOptions"
        :key="item.areaId"
        :label="item.areaName"
        :value="item.areaId">
        </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在城市" prop="cityId">
        <el-select v-model="formData.cityId"
        @change="listClassify3"
        placeholder="请选择">
        <el-option
        v-for="item in cityIdOptions"
        :key="item.areaId"
        :label="item.areaName"
        :value="item.areaId">
        </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在区" prop="areaId">
        <el-select v-model="formData.areaId"
        placeholder="请选择">
        <el-option
        v-for="item in areaIdOptions"
        :key="item.areaId"
        :label="item.areaName"
        :value="item.areaId">
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
      :formatter="columnFormatter">
      </el-table-column>
    </i-table>

    <i-dialog v-model="dialogVisible"
    :title="dialogTitle"
    :showButton="true"
    ref="dialog"
    @dialog-before-close="dialogBeforeClose"
    @dialog-cancel="dialogCancel"
    @dialog-confirm="dialogConfirm">
    <el-form :model="dialogFromData" label-width="110px" :rules="rules" ref="ruleForm">
      <el-row>
     <el-col :span="12">
    <el-form-item label="门店名称" prop="storeName">
    <el-input v-model="dialogFromData.storeName"></el-input>
    </el-form-item>
    </el-col>
    <el-col :span="12">
    <el-form-item label="联系电话" prop="phone">
    <el-input v-model.number="dialogFromData.phone"></el-input>
    </el-form-item>
    </el-col>
    <el-col :span="12">
    <el-form-item label="店长编号" prop="userId">
    <el-input v-model="dialogFromData.userId"></el-input>
    </el-form-item>
    </el-col>
    <el-col :span="12">
    <el-form-item label="营业执照编码" prop="businessCode">
    <el-input v-model="dialogFromData.businessCode"></el-input>
    </el-form-item>
    </el-col>
    <el-col :span="12">
    <el-form-item label="所在省份" prop="provinceId">
     <el-select v-model="dialogFromData.provinceId"
        @change="listClassify5"
        placeholder="请选择">
        <el-option
        v-for="item in provinceIdOptions1"
        :key="item.areaId"
        :label="item.areaName"
        :value="item.areaId">
        </el-option>
      </el-select>
    </el-form-item>
    </el-col>
    <el-col :span="12">
    <el-form-item label="所在城市" prop="cityId">
     <el-select v-model="dialogFromData.cityId"
        @change="listClassify6"
        placeholder="请选择">
        <el-option
        v-for="item in cityIdOptions1"
        :key="item.areaId"
        :label="item.areaName"
        :value="item.areaId">
        </el-option>
      </el-select>
    </el-form-item>
    </el-col>
    <el-col :span="12">
    <el-form-item label="所在区" prop="areaId">
     <el-select v-model="dialogFromData.areaId"
        placeholder="请选择">
        <el-option
        v-for="item in areaIdOptions1"
        :key="item.areaId"
        :label="item.areaName"
        :value="item.areaId">
        </el-option>
      </el-select>
    </el-form-item>
    </el-col>
    <el-col :span="12">
    <el-form-item label="详细地址" prop="address">
    <el-input type="textarea" v-model="dialogFromData.address"></el-input>
    </el-form-item>
    </el-col>
    </el-row>
    </el-form>
    </i-dialog>

     <!-- <i-dialog v-model="dialogVisible1"
    :title="dialogTitle"
    :showButton="true"
    ref="dialog"
    @dialog-before-close="dialogBeforeClose"
    @dialog-cancel="dialogCancel">
    <el-form :model="dialogFromData1" label-width="100px" :rules="rules1" ref="ruleForm">
    <el-table
        border 
        :data="findtableData">
       <el-table-column
        v-for="(item, index) in findList"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        align="center">
       </el-table-column>
       </el-table> 
    </el-form>
    </i-dialog> -->
  </div>
</template>

<script>
import iSearch from '@/components/i-search.vue'
import iTable from '@/components/i-table.vue'
import IDialog from '@/components/i-dialog.vue'
import req from '@/api/shop-info-manage.js'

export default {
  name: 'shop-info-manage',
  components: {
    iSearch,
    iTable,
    IDialog
  },
  data () {
    return {
      formData: {
        storeId: '',
        storeName: '',
        userName: '',
        provinceId: '',
        cityId: '',
        areaId: '',
      },
      dialogFromData: {
        storeName: '',
        phone: '',
        userId: '',
        businessCode: '',
        provinceId: '',
        cityId: '',
        areaId: '',
        address: ''
      },
      dialogVisible: false,
      // dialogVisible1: false,
      dialogTitle: '',
      dialogType: '',
      shopVersion: '',
      delete: [],
      update: {},
      tableSelectRows: [],
      storeId: '',
      // findtableData: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      provinceIdOptions: [],
      cityIdOptions: [],
      areaIdOptions: [],
      provinceIdOptions1: [],
      cityIdOptions1: [],
      areaIdOptions1: [],
      toolbar: [
        // {
        //   btnName: '详情',
        //   type: 'primary',
        //   func: () => {
        //     if (this.tableSelectRows.length === 0) {
        //       this.$message.error('请选择需要查看的一条订单')
        //       return
        //     }
        //     if (this.tableSelectRows.length > 1) {
        //       this.$message.error('一次只能查看一条订单')
        //       return
        //     }
        //     if (this.tableSelectRows.length === 1){
        //     this.dialogVisible1 = true
        //     this.dialogTitle = '门店信息详情'
        //     this.storeId=this.tableSelectRows[0].storeId
        //     this.getStore()
        //     }
        //   }
        // },
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogTitle = '新增门店信息',
            this.dialogType = 'add'
            this.dialogVisible = true
            this.listClassify4()
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.error('请勾选一个需要修改的门店信息！')
            } else if (this.tableSelectRows.length === 1) {
              this.dialogTitle = '修改门店信息'
              this.dialogType = 'modify'
              this.dialogVisible = true
              this.storeId = this.tableSelectRows[0].storeId
              this.shopVersion = this.tableSelectRows[0].version
              this.getStore()
              this.listClassify4()
            } else {
              this.$message.error('一次只能勾选一个需要修改的门店信息！')
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.delete.length !==0) {
              this.$confirm('此操作将永久删除该门店信息，是否继续？').then(() => {
                let ids = ''
                this.delete.forEach(element => {
                  ids+=element.storeId+','
                })
                req('deleteStore', {
                  storeId: ids,
                  nowRole: JSON.parse(sessionStorage.getItem('roleInfo')).role
                }).then(data => {
                  console.log(data)
                  this.fetch()
                  this.$message.success(data.msg)
                })
              })
            } else {
              this.$message.error('请选择要删除的门店信息！')
            }  
          }
        }
      ],
      columnList: [
        {label: '门店编号', prop: 'storeId'},
        {label: '门店名称', prop: 'storeName'},
        {label: '电话', prop: 'phone'},
        {label: '详细地址', prop: 'address'},
        {label: '店长姓名', prop: 'userName'},
        {label: '邀请码', prop: 'inviteCode'},
        {label: '门店账号', prop: 'userAcct'}
      ],
      // findList: [
      //   {label: '门店名称', prop: 'storeName'},
      //   {label: '联系电话', prop: 'phone'},
      //   {label: '店长编号', prop: 'userId'},
      //   {label: '营业执照编码', prop: 'businessCode'},
      //   {label: '省级名称', prop: 'provinceName'},
      //   {label: '市级名称', prop: 'cityName'},
      //   {label: '区级名称', prop: 'areaName'},
      //   {label: '详细地址', prop: 'address'},
      //   {label: '门店编号', prop: 'storeId'},
      //   {label: '版本号', prop: 'version'},
      // ],
      tableData: [],
      multipleSelection: [],
      rules: {
        storeName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { type: 'number', message: '联系电话必须为数字' }
        ],
        userId: [
          { required: true, message: '请输入店长编号', trigger: 'blur' }
        ],
        businessCode: [
            { required: true, message: '请输入营业执照编码', trigger: 'blur' },
        ],
        provinceId: [
          { required: true, message: '请选择所在省份', trigger: 'change' }
        ],
        cityId: [
          { required: true, message: '请选择所在城市', trigger: 'change' }
        ],
        areaId: [
          { required: true, message: '请选择所在区', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.search(),
    this.listClassify1()
  },
  methods: {
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
        pageNum: this.pageInfo.pageNum,
        role: JSON.parse(sessionStorage.getItem('roleInfo')).role
      }).then(data => {
        console.log(data)
        this.tableData = data.data.list
        this.pageInfo.pageNum = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
      })
    },
    // 修改用户信息时，获取用户信息显示到dialog
    getStore () {
      // 服务器请求的数据
      req('getStore', {
        storeId: this.storeId
      }).then(data => {
        // 传给服务器的数据
        this.dialogFromData = Object.assign({}, data.data)
      })
    },
    listClassify1 () {
      req('listClassify', {
        areaId: 0
      }).then(data => {
        this.provinceIdOptions = data.data.areaList
      })
    },
    listClassify2 (value) {
      req('listClassify', {
        areaId: value
      }).then(data => {
        this.$set(this.formData,'cityId','')
        this.cityIdOptions = data.data.areaList
      })
    },
    listClassify3 (value) {
      req('listClassify', {
        areaId: value
      }).then(data => {
        this.$set(this.formData,'areaId','')
        this.areaIdOptions = data.data.areaList
      })
    },
    listClassify4 () {
      req('listClassify', {
        areaId: 0
      }).then(data => {
        this.provinceIdOptions1 = data.data.areaList
      })
    },
    listClassify5 (value) {
      req('listClassify', {
        areaId: value
      }).then(data => {
        this.$set(this.dialogFromData,'cityId','')
        this.cityIdOptions1 = data.data.areaList
      })
    },
    listClassify6 (value) {
      req('listClassify', {
        areaId: value
      }).then(data => {
        this.$set(this.dialogFromData,'areaId','')
        this.areaIdOptions1 = data.data.areaList
      })
    },
    //查询订单详情接口
    // getStore () {
    //   req('getStore',{
    //     storeId: this.storeId
    //   }).then(data => {
    //     this.findtableData = data.data
    //   })
    // },
    reset () {
      this.fetch()
      console.log ('重置按钮被点击了')
      // this.$refs.iSearch.$refs.form.resetFields()
    },
    handleSizeChange (value) {
      this.pageInfo.pageNum = 1
      this.pageInfo.pageSize = value
      this.search()
    },
    handleCurrentChange (value) {
      console.log ('当前多少页', value)
      this.pageInfo.pageNum = value
      this.search()
    },
    handleSelectionChange (rows) {
      console.log ('rows', rows)
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
      this.dialogVisible = false
      this.$refs.ruleForm.resetFields()
    },
    dialogConfirm () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'add') {
            req('add', {
              ...this.dialogFromData,
              nowRole: JSON.parse(sessionStorage.getItem('roleInfo')).role
            }).then(data => {
              console.log(data)
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.fetch()
                this.$refs.ruleForm.resetFields()
                this.dialogVisible = false
              } else {
                this.$message.error(data.msg)
              }
            })
          } else if (this.dialogType === 'modify'){
            req('modify',{
              ...this.dialogFromData,
              storeId: this.storeId,
              version: this.shopVersion,
              nowRole: JSON.parse(sessionStorage.getItem('roleInfo')).role
            }).then(data => {
              if (data.code === 0) {
                this.$message.success(data.msg)         
                this.fetch()
                this.$refs.ruleForm.resetFields()
                this.dialogVisible = false
              } else {
                this.$message.error(data.msg)
              }
            })
          }else {
          return false
          } 
        }
      })
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
