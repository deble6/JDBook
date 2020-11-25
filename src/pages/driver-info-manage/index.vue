<template>
  <div>
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="司机编号" prop="driverId">
        <el-input v-model="formData.driverId"></el-input>
      </el-form-item>
      <el-form-item label="司机姓名" prop="userName">
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
    <el-form-item label="司机姓名" prop="userName">
    <el-input v-model="dialogFromData.userName"></el-input>
    </el-form-item>
    </el-col>
    <el-col :span="12"> 
    <el-form-item label="联系电话" prop="phone">
    <el-input v-model.number="dialogFromData.phone"></el-input>
    </el-form-item>
    </el-col>
    <el-col :span="12"> 
    <el-form-item label="司机账号" prop="userAcct">
    <el-input v-model="dialogFromData.userAcct"></el-input>
    </el-form-item>
    </el-col>
    <el-col :span="12"> 
    <el-form-item label="密码" prop="userPassword">
    <el-input type="password" v-model="dialogFromData.userPassword"></el-input>
    </el-form-item>
    </el-col>
    <el-col :span="12"> 
    <el-form-item label="身份证号" prop="idCard">
    <el-input v-model="dialogFromData.idCard"></el-input>
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
      <el-form-item label="司机头像图片" prop="imagePath">
        <i-file v-model="dialogFromData.imagePath"></i-file>
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
import req from '@/api/driver-info-manage.js'
import IFile from '@/components/i-file.vue'

export default {
  name: 'driver-info-manage',
  components: {
    iSearch,
    iTable,
    IDialog,
    IFile
  },
  data () {
    return {
      formData: {
        driverId: '',
        userName: '',
        provinceId: '',
        cityId: '',
        areaId: ''
      },
      dialogFromData: {
        userName: '',
        phone: '',
        imagePath: '',
        userAcct: '',
        userPassword: '',
        idCard: '',
        provinceId: '',
        cityId: '',
        areaId: ''
      },
      dialogVisible: false,
      dialogTitle: '',
      dialogType: '',
      version: '',
      delete: [],
      update: {},
      tableSelectRows: [],
      driverId: '',
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
      // imageToken: {access_token: JSON.parse(sessionStorage.getItem('userInfo')).access_token},
      toolbar:[
        // {
        //   btnName: '详情',
        //   type: 'primary',
        //   func: () => {
        //     console.log(this.pageInfo)
        //   }
        // },
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogTitle = '新增司机信息',
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
              this.$message.error('请勾选一个需要修改的司机信息！')
            } else if (this.tableSelectRows.length === 1) {
              this.dialogTitle = '修改司机信息'
              this.dialogType = 'modify'
              this.dialogVisible = true
              this.driverId = this.tableSelectRows[0].driverId
              this.version = this.tableSelectRows[0].version
              this.getdriver()
              this.listClassify4()
            } else {
              this.$message.error('一次只能勾选一个需要修改的司机信息！')
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.delete.length !==0) {
              this.$confirm('此操作将永久删除该司机信息，是否继续？').then(() => {
                let ids = ''
                this.delete.forEach(element => {
                  ids+=element.driverId+','
                })
                req('deletedriver', {
                  driverId: ids,
                  nowRole: JSON.parse(sessionStorage.getItem('roleInfo')).role
                }).then(data => {
                  console.log(data)
                  this.fetch()
                  this.$message.success(data.msg)
                })
              })
            } else {
              this.$message.error('请选择要删除的司机信息！')
            }   
          }
        }
      ],
      columnList: [
        {label: '司机编号', prop: 'driverId'},
        {label: '姓名', prop: 'userName'},
        {label: '手机', prop: 'phone'},
        {label: '身份证', prop: 'idCard'},
        {label: '账号', prop: 'userAcct'}
      ],
      tableData: [],
      multipleSelection: [],
        rules: {
          userName: [
            { required: true, message: '请输入司机姓名', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            { type: 'number', message: '联系电话必须为数字' }
          ],
          userAcct: [
            { required: true, message: '请输入司机账号', trigger: 'blur' }
          ],
          userPassword: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
          idCard: [
          { required: true, message: '请输入身份证号', trigger: 'change' },
          { validator: this.validateIdCard, trigger: 'change' }
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
        }
    }
  },
  mounted () {
    this.search(),
    this.listClassify1()
  },
  methods: {
    // 获取上传成功返回的地址
    // handleAvatarSuccess (res) {
    //   this.dialogFromData.imagePath = res.data.url 
    // },
    // 上传图片
    // uploadImage () {
    //   // 服务器请求的数据
    //   req('uploadImage', {
    //     imageFile: this.imageFile
    //   }).then(data => {
    //   })
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
    getdriver () {
      // 服务器请求的数据
      req('getdriver', {
        driverId: this.driverId
      }).then(data => {
        // 传给服务器的数据
        this.dialogFromData = Object.assign({}, data.data, {
          imagePath: data.data.userImage
        })
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
      console.log('rows', rows)
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
              driverId: this.driverId,
              version: this.version,
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
    },
    validateIdCard (rule, value, callback) {
      let reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
      console.log(reg.test(value))
      if (!reg.test(value)) {
        callback(new Error('请输入正确的身份证号'))
      } else {
        callback()
      }
    }
  }
}
</script>
