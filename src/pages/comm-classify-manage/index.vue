<template>
  <div class="container">
    <div class="controller-box">
      <div class="btn-list1">
        <el-button type="primary" @click="addClassify">新增</el-button>
        <el-button type="primary" @click="editMenu">修改</el-button>
        <el-button type="primary" @click="deleteMenu">删除</el-button>
        <el-button type="primary" @click="getTreeData">刷新</el-button>
      </div>

      <div class="tree-box">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          @node-click="nodeClick">
        </el-tree>
      </div>
    </div>

    <div class="form-box">
      <div class="form-title">分类详情</div>
      <div class="form-content">
        <el-form ref="detailForm" :model="menuFormData" :inline="true" label-width="100px">
          <el-form-item label="分类名称" prop="classifyName">
            <el-input v-model="menuFormData.classifyName" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="classifyComment">
            <el-input v-model="menuFormData.classifyComment" :readonly="true"></el-input>
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
            <el-form-item label="分类名称" prop="classifyName">
              <el-input v-model="dialogFormData.classifyName" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item label="备注" prop="classifyComment">
              <el-input v-model="dialogFormData.classifyComment" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </i-dialog>
  </div>
</template>

<script>
import req from '@/api/comm-classify-manage.js'
import IDialog from '@/components/i-dialog.vue'

export default {
  name: 'comm-classify-manage',
  components: {
    IDialog
  },
  data () {
    return {
      treeData: [],
      defaultProps: {
        children: 'twoClassifyList',
        label: 'classifyName'
      },
      menuFormData: {},
      currentClassify: {},
      dialogVisible: false,
      dialogTitle: '新增分类',
      dialogFormData: {
        classifyName: '',
        classifyComment: ''
      },
      formRules: {
        classifyName: [
          { required: true, message: '请输入分类名称', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.getTreeData()
  },
  methods: {
    nodeClick (data, node) {
      this.currentClassify = data
      console.log(data)
      this.getDetailMenu(data.classifyId)
    },
    getTreeData () {
      req('getTreeData', {}).then(data => {
        console.log('data', data)
        this.treeData = data.data.oneClassifyList

        this.$refs.detailForm.resetFields()
        this.currentClassify = {}
      })
    },
    getDetailMenu (id) {
      req('getDetail', {classifyId: id}).then(data => {
        this.menuFormData = data.data
      })
    },
    addClassify () {
      this.dialogVisible = true
      this.dialogType = 'add'
      this.dialogTitle = '新增分类'
    },
    editMenu () {
      if (!Object.keys(this.currentClassify).length) {
        this.$message.info('请选择需要修改的数据')

        return
      }

      this.dialogVisible = true
      this.dialogType = 'edit'
      this.dialogTitle = '修改分类'

      req('getDetail', {classifyId: this.currentClassify.classifyId}).then(data => {
        this.dialogFormData = Object.assign({}, data.data)
      })
    },
    deleteMenu () {
      if (!Object.keys(this.currentClassify).length) {
        this.$message.info('请选择需要删除的数据')

        return
      }

      this.$confirm('此操作将永久删除该文件,是否继续?').then(() => {
        req('deleteClassify', {classifyId: this.currentClassify.classifyId, classifyParent: this.currentClassify.classifyParent}).then(data => {
          if (data.code === 0) {
            this.$message.success(data.msg)

            this.$refs.detailForm.resetFields()
            this.getTreeData()
          } else {
            this.$message.error(data.msg)
          }
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
            let classifyId = '0'

            if (this.currentClassify.classifyId) {
              classifyId = this.currentClassify.classifyId
            }

            req('addClassify', Object.assign({}, this.dialogFormData, {
              classifyParent: classifyId
            })).then(data => {
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
            req('updateClassify', {...this.dialogFormData}).then(data => {
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
          { data.classifyName }
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

    .btn-list1 {
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
