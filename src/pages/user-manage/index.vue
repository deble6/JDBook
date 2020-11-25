
<template>
  <div>
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="用户账号" prop="userAcct">
        <el-input v-model="formData.userAcct"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select clearable v-model="formData.role">
          <el-option v-for="(item, index) in roleOptions" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
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
            <el-form-item label="用户账号" prop="userAcct">
              <el-input v-model="dialogFormData.userAcct" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="用户姓名" prop="userName">
              <el-input v-model="dialogFormData.userName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="用户性别" prop="sex">
              <el-select v-model="dialogFormData.sex">
                <el-option v-for="(item, index) in sexOptions" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model.number="dialogFormData.phone" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="用户邮箱" prop="mail">
              <el-input v-model="dialogFormData.mail" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="身份证" prop="idCard">
              <el-input v-model="dialogFormData.idCard" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="用户密码" prop="userPassword">
              <el-input type="password" v-model="dialogFormData.userPassword" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="用户角色" prop="role">
              <el-select v-model="dialogFormData.role">
                <el-option
                  v-for="(item, index) in roleOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户头像" prop="imagePath">
              <!-- <el-input type="file" v-model="dialogFormData.imagePath"></el-input> -->
              <i-file v-model="dialogFormData.imagePath"></i-file>
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
import req from '@/api/user-manage.js'
import IFile from '@/components/i-file.vue'

export default {
  name: 'user-manage',
  components: {
    ISearch,
    ITable,
    IDialog,
    IFile
  },
  data () {
    return {
      dialogType: 'add',
      tableLoading: false,
      formData: {
        userName: '',
        userAcct: '',
        role: ''
      },
      dialogFormData: {
        userAcct: '',
        userName: '',
        sex: '',
        phone: '',
        mail: '',
        idCard: '',
        userPassword: '',
        role: '',
        imagePath: ''
      },
      dialogVisible: false,
      dialogTitle: '',
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
            this.dialogTitle = '新增用户'
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
            this.dialogTitle = '修改用户'
            req('getUserDetailData', {userId: this.tableSelectRows[0].userId}).then(data => {
              this.dialogFormData = Object.assign({}, data.data, {
                imagePath: data.data.userImage
              })
              console.log(this.dialogFormData)
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
                console.log(item)
                return item.userId
              }).toString()
              let roles = this.tableSelectRows.map(item => {
                return item.role
              }).toString()
              req('deleteUser', {userId: ids, nowRole: JSON.parse(sessionStorage.getItem('roleInfo')).role, role: roles}).then(data => {
                this.$message.success(data.msg)
                this.fetch()
              })
            })
          }
        }
      ],
      roleOptions: [
        // {label: '全部', value: ''},
        {label: '管理员', value: '1'},
        {label: '店长', value: '2'}
      ],
      sexOptions: [
        {label: '男', value: '0'},
        {label: '女', value: '1'}
      ],
      columnList: [
        {label: '用户编号', prop: 'userId'},
        {label: '账号', prop: 'userAcct'},
        {label: '姓名', prop: 'userName'},
        {label: '角色', prop: 'role', distName: 'roleOptions'},
        {label: '性别', prop: 'sex', distName: 'sexOptions'},
        {label: '手机', prop: 'phone'},
        {label: '邮箱', prop: 'mail'},
        {label: '身份证', prop: 'idCard'}
      ],
      tableData: [],
      tableSelectRows: [],
      formRules: {
        userAcct: [
          { required: true, message: '请输入用户账号', trigger: 'change' }
        ],
        userName: [
          { required: true, message: '请输入用户名称', trigger: 'change' }
        ],
        sex: [
          { required: true, message: '请输入性别', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          { type: 'number', message: '电话号码必须为数字' }
        ],
        mail: [
          { required: true, message: '请输入用户邮箱', trigger: 'change' }
        ],
        idCard: [
          { required: true, message: '请输入身份证', trigger: 'change' },
          { validator: this.validateIdCard, trigger: 'change' }
        ],
        userPassword: [
          { required: true, message: '请输入用户密码', trigger: 'change' }
        ],
        role: [
          { required: true, message: '请输入角色', trigger: 'change' }
        ],
        imagePath:[
          { required: true, message: '请选择用户头像', trigger: 'change' }
        ]
      }
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
      this.tableLoading = true
      req('getTableData', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        nowRole: JSON.parse(sessionStorage.getItem('roleInfo')).role
      }).then(data => {
        this.tableLoading = false
        this.tableData = data.data.list
        this.pageInfo.pageNum = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
        console.log ('data',data)
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
      this.$refs.form.resetFields()
    },
    dialogCancel () {
      this.$refs.form.resetFields()
      this.dialogVisible = false
    },
    dialogConfirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogType === 'add') {
            req('addUser', {...this.dialogFormData, nowRole: JSON.parse(sessionStorage.getItem('roleInfo')).role}).then(data => {
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
            req('updateUser', {...this.dialogFormData, nowRole: JSON.parse(sessionStorage.getItem('roleInfo')).role}).then(data => {
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
