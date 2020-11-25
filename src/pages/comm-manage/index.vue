<template>
  <div>
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="formData.goodsName"></el-input>
      </el-form-item>
      <el-form-item label="商品状态" prop="goodsStateId">
        <el-select v-model="formData.goodsStateId" placeholder="请选择">
        <el-option
          v-for="(item, index) in goodsStateIdOptions"
          :key="index"
          :label="item.label"
          :value="item.value">
        </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告词" prop="goodsAdvertise">
        <el-input v-model="formData.goodsAdvertise"></el-input>
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
    <el-form :model="dialogFromData" label-width="100px" :rules="rules" ref="ruleForm">
      <el-row>
     <el-col :span="12"> 
    <el-form-item label="商品名称" prop="goodsName">
    <el-input v-model="dialogFromData.goodsName"></el-input>
    </el-form-item>
    </el-col>
    <el-col :span="12"> 
    <el-form-item label="编号" prop="isbn">
    <el-input v-model="dialogFromData.isbn"></el-input>
    </el-form-item>
    </el-col>
    <el-col :span="12"> 
    <el-form-item label="一级分类" prop="oneClassifyId">
     <el-select v-model="dialogFromData.oneClassifyId" 
     @change="listClassify2"
     placeholder="请选择">
      <el-option
        v-for="item in oneClassifyIdOptions"
        :key="item.classifyId"
        :label="item.classifyName"
        :value="item.classifyId">
      </el-option>
    </el-select>
    </el-form-item>
    </el-col>
    <el-col :span="12"> 
    <el-form-item label="二级分类" prop="twoClassifyId">
     <el-select v-model="dialogFromData.twoClassifyId" placeholder="请选择">
      <el-option
        v-for="item in twoClassifyIdOptions"
        :key="item.classifyId"
        :label="item.classifyName"
        :value="item.classifyId">
      </el-option>
    </el-select>
    </el-form-item>
    </el-col>
    <el-col :span="12"> 
    <el-form-item label="商家名称" prop="supplierName">
    <el-input v-model="dialogFromData.supplierName"></el-input>
    </el-form-item>
    </el-col>
    <el-col :span="12"> 
    <el-form-item label="库存" prop="goodsInventory">
    <el-input v-model.number="dialogFromData.goodsInventory"></el-input>
    </el-form-item>
    </el-col>
    <el-col :span="12"> 
    <el-form-item label="成本价" prop="goodsOriginalCost">
    <el-input type="number" v-model.number="dialogFromData.goodsOriginalCost"></el-input>
    </el-form-item>
    </el-col>
    <el-col :span="12"> 
    <el-form-item label="在售价" prop="goodsPrice">
    <el-input type="number" v-model.number="dialogFromData.goodsPrice"></el-input>
    </el-form-item>
    </el-col>
    <el-col :span='12'>
      <el-form-item label="广告词" prop="goodsAdvertise">
        <el-input type="textarea" v-model="dialogFromData.goodsAdvertise" placeholder="请输入"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span='12'>
      <el-form-item label="商品介绍" prop="goodsDescribe">
        <el-input type="textarea" v-model="dialogFromData.goodsDescribe" placeholder="请输入"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="12">
      <el-form-item label="图片" prop="imagePath">
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
import req from '@/api/comm-manage.js'
import IFile from '@/components/i-file.vue'


export default {
  name: 'comm-manage',
  components: {
    iSearch,
    iTable,
    IDialog,
    IFile
  },
  data () {
    return {
      formData: {
        goodsName: '',
        goodsStateId: '',
        goodsAdvertise: '',
        goodsPress: '',
        goodsAuthor: ''
      },
      dialogFromData: {
        goodsName: '',
        isbn: '',
        oneClassifyId: '',
        twoClassifyId: '',
        goodsAuthor: '',
        goodsPress: '',
        supplierName: '',
        goodsInventory: '',
        goodsOriginalCost: '',
        goodsPrice: '',
        goodsId: '',
        version: '',
        imagePath: '',
        goodsAdvertise: '',
        goodsDescribe: ''
      },
      dialogVisible: false,
      dialogTitle: '',
      dialogType: '',
      commCode: '',
      getSelectCommCode: [],
      commVersion: '',
      delete: [],
      update: {},
      // imageToken: {access_token: JSON.parse(sessionStorage.getItem('userInfo')).access_token},
      oneClassifyIdOptions: [],
      twoClassifyIdOptions: [],
      goodsStateIdOptions:[
        {label: '售罄', value: '0'},
        {label: '在售', value: '1'},
        {label: '已下架', value: '2'},
        {label: '未发布', value: '3'}
      ],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      },
      toolbar:[
        {
          btnName: '新增',
          type: 'primary',
          func: () => {
            this.dialogTitle = '新增商品',
            this.dialogType = 'addGoods'
            this.dialogVisible = true
            this.listClassify1()
          }
        },
        {
          btnName: '修改',
          type: 'primary',
          func: () => {
            if (this.getSelectCommCode.length === 0) {
              this.$message.error('请勾选一个需要修改的商品！')
            } else if (this.getSelectCommCode.length === 1) {
              this.dialogTitle = '修改商品信息'
              this.dialogType = 'changeGoodsInfo'
              this.dialogVisible = true
              this.commCode = this.getSelectCommCode[0].goodsId
              this.commVersion = this.getSelectCommCode[0].version
              this.getGoodsData()
              this.listClassify1()
              // console.log(this.commVersion)
              // console.log(this.commCode)
            } else {
              this.$message.error('一次只能勾选一个需要修改的商品！')
            }
          }
        },
        {
          btnName: '删除',
          type: 'primary',
          func: () => {
            if (this.delete.length !==0) {
              this.$confirm('此操作将永久删除该商品，是否继续？').then(() => {
                let ids = ''
                this.delete.forEach(element => {
                  ids+=element.goodsId+','
                })
                req('deletegoods', {
                  goodsId: ids
                }).then(data => {
                  console.log(data)
                  this.fetch()
                  this.$message.success(data.msg)
                })
              })
            } else {
              this.$message.error('请选择要删除的商品！')
            }    
          }
        },
        {
          btnName: '上架',
          type: 'primary',
          func: () => {
            if (this.getSelectCommCode.length === 0) {
              this.$message.info('请选择需要修改的数据')
              return
            }
            this.$confirm('是否需要将选中的数据进行上架?').then(() => {
              let goodsIds = this.getSelectCommCode.map(item => {
                return item.goodsId
              }).toString()
              let versions = this.getSelectCommCode.map(item => {
                return item.version
              }).toString()
              let goodsInventorys = this.getSelectCommCode.map(item => {
                return item.goodsInventory
              }).toString()
              req('updateGoodsStatus', {
                goodsId: goodsIds,
                goodsStateId: '1',
                version: versions,
                goodsInventories: goodsInventorys
              }).then(data => {
                this.$message.success(data.msg)
                this.fetch()
              })
            })
          }
        },
        {
          btnName: '下架',
          type: 'primary',
          func: () => {
            if (this.getSelectCommCode.length === 0) {
              this.$message.info('请选择需要修改的数据')
              return
            }
            this.$confirm('是否需要将选中的数据进行下架?').then(() => {
              let goodsIds = this.getSelectCommCode.map(item => {
                return item.goodsId
              }).toString()
              let versions = this.getSelectCommCode.map(item => {
                return item.version
              }).toString()
              let goodsInventorys = this.getSelectCommCode.map(item => {
                return item.goodsInventory
              }).toString()
              req('updateGoodsStatus', {
                goodsId: goodsIds,
                goodsStateId: '2',
                version: versions,
                goodsInventory: goodsInventorys
              }).then(data => {
                this.$message.success(data.msg)
                this.fetch()
              })
            })
          }
        }
      ],
      columnList: [
        {label: '商品名称', prop: 'goodsName', width:'120px'},
        {label: '定价', prop: 'goodsOriginalCost', width:'60px'},
        {label: '售价', prop: 'goodsPrice', width:'60px'},
        {label: '销售量', prop: 'goodsSales', width:'60px'},
        {label: '一级分类', prop: 'oneClassifyName', width: '120px'},
        {label: '二级分类', prop: 'twoClassifyName', width: '120px'},
        // {label: '商品图片', prop: 'goodsImagePath', width:'300px'},
        {label: '商品状态', prop: 'goodsStateId', distName: 'goodsStateIdOptions', width: '120px'},
        {label: '上架时间', prop: 'goodsShelfTime', width:'120px'},
        {label: '浏览量', prop: 'goodsViewsNum', width:'60px'},
        {label: '商品编码', prop: 'goodsId', width:'120px'},
        {label: '商家名称', prop: 'supplierName', width: '120px'},
        {label: '库存', prop: 'goodsInventory', width:'60px'}
      ],
      tableData: [],
      multipleSelection: [],
        rules: {
          goodsName: [
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ],
          isbn: [
            { required: true, message: '请输入书号', trigger: 'blur' }
          ],
          oneClassifyId: [
            { required: true, message: '请选择一级分类', trigger: 'change' }
          ],
          twoClassifyId: [
            { required: true, message: '请选择二级分类', trigger: 'change' }
          ],
          goodsAuthor: [
            { required: true, message: '请输入作者', trigger: 'blur' }
          ],
          goodsPress: [
            { required: true, message: '请输入出版社', trigger: 'blur' }
          ],
          supplierName: [
            { required: true, message: '请选择商家名称', trigger: 'blur' }
          ],
          goodsDescribe: [
          { required: true, message: '请输入商品介绍', trigger: 'change' }
        ],
        supplierName: [
          { required: true, message: '请输入商家名称', trigger: 'change' }
        ],
          goodsInventory: [
            { required: true, message: '请输入库存', trigger: 'blur' },
            { type: 'number', message: '商品库存必须为数字' }
          ],
          goodsOriginalCost: [
            { required: true, message: '请输入成本价', trigger: 'blur' },
            { type: 'number', message: '成本价必须为数字' }
          ],
          goodsPrice: [
            { required: true, message: '请输入在售价', trigger: 'blur' },
            { type: 'number', message: '在售价必须为数字' }
          ],
          goodsId: [
            { required: true, message: '请输入商品编号', trigger: 'blur' }
          ],
          version: [
            { required: true, message: '请输入版本号', trigger: 'blur' }
          ],
          imagePath: [
          { required: true, message: '请上传商品图片', trigger: 'change' }
          ]
        }
    }
  },
  mounted () {
    this.search()
  },
  methods: {
    // 获取上传成功返回的地址
    // handleAvatarSuccess (res) {
    //   this.dialogFromData.imagePath = res.data.url 
    // },
    fetch () {
      this.pageInfo.pageSize = 5
      this.pageInfo.pageNum = 1
      this.search()
    },
    search () {
      req('getTableData', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }).then(data => {
        this.tableData = data.data.list
        this.pageInfo.pageNum = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
        // console.log(data.data)
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
    // 修改用户信息时，获取用户信息显示到dialog
    getGoodsData () {
      // 服务器请求的数据
      req('getGoodsData', {
        goodsId: this.commCode
      }).then(data => {
        // 传给服务器的数据
        this.dialogFromData = Object.assign({}, data.data, {
          imagePath: data.data.goodsImagePath
        })
      })
    },
    listClassify1 () {
      req('listClassify', {
        classifyId: 0
      }).then(data => {
        this.oneClassifyIdOptions = data.data.goodsClassifyList
      })
    },
    listClassify2 (value) {
      req('listClassify', {
        classifyId: value
      }).then(data => {
        this.$set(this.dialogFromData,'twoClassifyId','')
        this.twoClassifyIdOptions = data.data.goodsClassifyList
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
      // console.log('rows', rows)
      this.getSelectCommCode = rows
      console.log('rows', rows)
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
          if (this.dialogType === 'addGoods') {
            req('addGoods', {
              ...this.dialogFromData
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
          } else if (this.dialogType === 'changeGoodsInfo'){
            req('changeGoodsInfo',{
              ...this.dialogFromData,
              goodsId: this.commCode,
              version: this.commVersion
              
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
