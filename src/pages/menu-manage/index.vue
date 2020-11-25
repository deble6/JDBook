<template>
  <div class="container">
    <div class="controller-box">
      <div class="btn-list">
        <el-button type="primary" @click="addMenu">新增</el-button>
        <el-button type="primary" @click="editMenu">修改</el-button>
        <el-button type="primary" @click="deleteMenu">删除</el-button>
        <el-button type="primary" @click="getTreeData">刷新</el-button>
      </div>

      <div class="tree-box">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          @node-click="nodeClick"
          :render-content="renderContent">
        </el-tree>
      </div>
    </div>

    <div class="form-box">
      <div class="form-title">菜单详情</div>
      <div class="form-content">
        <el-form ref="detailForm" :model="menuFormData" :inline="true" label-width="100px">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="menuFormData.menuName" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="菜单路由" prop="menuPath">
            <el-input v-model="menuFormData.menuPath" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="menuComment">
            <el-input v-model="menuFormData.menuComment" :readonly="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <i-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      @dialog-before-close="dialogBeforeClose"
      @dialog-cancel="dialogCancel"
      @dialog-confirm="dialogConfirm">
      <el-form :model="dialogFormData" ref="form" :rules="formRules" label-width="100px">
        <el-row>
          <el-col :span='12'>
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="dialogFormData.menuName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="菜单路由" prop="menuPath">
              <el-input v-model="dialogFormData.menuPath" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="备注" prop="menuComment">
              <el-input v-model="dialogFormData.menuComment" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
import req from '@/api/menu-manage.js'
import IDialog from '@/components/i-dialog.vue'

export default {
  name: 'menu-manage',
  components: {
    IDialog
  },
  data () {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'menuName'
      },
      menuFormData: {},
      currentMenu: {},
      dialogVisible: false,
      dialogTitle: '新增菜单',
      dialogFormData: {
        menuName: '',
        menuPath: '',
        menuComment: ''
      },
      formRules: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'change' }
        ],
        menuPath: [
          { required: true, message: '请输入菜单路由', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.getTreeData()
  },
  methods: {
    nodeClick (data, node) {
      this.currentMenu = data
      this.getDetailMenu(data.menuId)
    },
    getTreeData () {
      req('getTreeData', {}).then(data => {
        this.treeData = data.data.menuList
        this.$refs.detailForm.resetFields()
        this.currentClassify = {}
      })
    },
    getDetailMenu (id) {
      req('getDetail', {menuId: id}).then(data => {
        this.menuFormData = data.data
      })
    },
    addMenu () {
      this.dialogVisible = true
      this.dialogType = 'add'
      this.dialogTitle = '新增菜单'
    },
    editMenu () {
      if (!Object.keys(this.currentMenu).length) {
        this.$message.info('请选择需要修改的数据')

        return
      }

      this.dialogVisible = true
      this.dialogType = 'edit'
      this.dialogTitle = '修改菜单'

      req('getMenu', {menuId: this.currentMenu.menuId}).then(data => {
        this.dialogFormData = Object.assign({}, data.data)
      })
    },
    deleteMenu () {
      if (!Object.keys(this.currentMenu).length) {
        this.$message.info('请选择需要删除的数据')

        return
      }

      this.$confirm('此操作将永久删除该文件,是否继续?').then(() => {
        req('deleteMenu', {menuId: this.currentMenu.menuId}).then(data => {
          this.$message.success(data.msg)

          this.$refs.detailForm.resetFields()
          this.getTreeData()
        })
      })
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
            req('addMenu', {...this.dialogFormData}).then(data => {
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.getTreeData()
                this.$refs.form.resetFields()
                this.dialogVisible = false
              } else {
                this.$message.error(data.msg)
              }
            })
          } else {
            req('updateMenu', {...this.dialogFormData}).then(data => {
              if (data.code === 0) {
                this.$message.success(data.msg)
                this.getTreeData()
                this.$refs.form.resetFields()
                this.$refs.detailForm.resetFields()
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
    renderContent (h, { node, data, store }) {
      return (
        <div>
          { data.menuName }
        </div>
      )
    }
  }
}
</script>

<style lang="scss" scoped>

.container {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding: 10px;
  box-sizing: border-box;

  .controller-box {
    width: 400px;
    height: 400px;
    border: 1px solid #ddd;

    .btn-list {
      width: 100%;
      height: 50px;
      border-bottom: 1px solid #ddd;
      line-height: 50px;
      padding-left: 10px;
      box-sizing: border-box;
    }
  }

  .form-box {
    flex: 1;
    height: 400px;
    border: 1px solid #ddd;

    .form-title {
      width: 100%;
      height: 50px;
      border-bottom: 1px solid #ddd;
      line-height: 50px;
      padding-left: 10px;
      box-sizing: border-box;
    }
  }
}
</style>
