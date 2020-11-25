<template>
  <div>
    <i-search ref="iSearch" :model="formData" @search="fetch" @reset="reset">
      <el-form-item label="下单人" prop="userName">
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="订单编码" prop="orderId">
        <el-input v-model="formData.orderId"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone"></el-input>
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStateId">
        <el-select v-model="formData.orderStateId" placeholder="请选择">
         <el-option
          v-for="(item, index) in orderStateIdOptions"
          :key="index"
          :label="item.label"
          :value="item.value">
        </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="起始时间" prop="payTimeStart">
        <el-date-picker
          v-model="formData.payTimeStart"
          type="date"
          :picker-options="startTimePickerOptions"
          placeholder="选择付款时间">
         </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="payTimeEnd">
        <el-date-picker
          v-model="formData.payTimeEnd"
          type="date"
          :picker-options="endTimePickerOptions"
          placeholder="选择付款时间">
         </el-date-picker>
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
    @dialog-before-close="dialogBeforeClose"
    @dialog-cancel="dialogCancel">
    <el-form :model="dialogFromData" label-width="100px" :rules="rules" ref="ruleForm">
    <el-table
        border 
        :data="findtableData">
       <el-table-column
        v-for="(item, index) in findList"
        :key="index"
        :label="item.label"
        :prop="item.prop"
        align="center"
        :show-overflow-tooltip="true">
       </el-table-column>
       </el-table> 
    </el-form>
    </i-dialog>
  </div>
</template>

<script>
import iSearch from '@/components/i-search.vue'
import iTable from '@/components/i-table.vue'
import IDialog from '@/components/i-dialog.vue'
import req from '@/api/order-manage.js'

export default {
  name: 'order-manage',
  components: {
    iSearch,
    iTable,
    IDialog
  },
  data () {
    return {
      formData: {
        userName: '',
        phone: '',
        orderId: '',
        orderStateId: '',
        payTimeStart: '',
        payTimeEnd: ''
      },
      dialogFromData: {
      },
      dialogVisible: false,
      dialogTitle: '',
      // dialogType: '',
      userList: '',
      userId: '',
      ids:'',
      version: '',
      tableSelectRows:[],
      fileList: [],
      orderId: '',
      orderStateId: '',
      pageInfo: {
        pageIndex: 1,
        pageSize: 5,
        total: 0
      },
      orderStateIdOptions:[
        {label: '已下单', value: '0'},
        {label: '已取消', value: '1'},
        {label: '已到货', value: '2'},
        {label: '已取货', value: '3'},
        {label: '已完成未评价', value: '4'},
        {label: '已完成已评价', value: '5'}
      ],
      startTimePickerOptions: {
        disabledDate: (value ) => {
          if (this.formData.payTimeEnd !== ''){
           return this.formData.payTimeEnd < value 
          }
        }
      },
      endTimePickerOptions: {
        disabledDate: (value ) => {
          return this.formData.payTimeStart > value
        }
      },
      toolbar:[
        {
          btnName: '详情',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.error('请选择需要查看的一条订单')
              return
            }
            if (this.tableSelectRows.length > 1) {
              this.$message.error('一次只能查看一条订单')
              return
            }
            if (this.tableSelectRows.length === 1){
            this.dialogVisible = true
            this.dialogTitle = '订单详情'
            // this.dialogType = 'modify'
            this.orderId=this.tableSelectRows[0].orderId
            console.log(this.orderId)
            this.getorderData()
            }
          }
        },
        {
          btnName: '订单取消',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.error('请选择一条订单')
              return
            } else if(this.tableSelectRows.length === 1){
            this.$confirm('此操作将取消订单,是否继续?').then(() => {
              this.orderId=this.tableSelectRows[0].orderId
              this.orderStateId=this.tableSelectRows[0].orderStateId
              this.version=this.tableSelectRows[0].version
              this.orderStateId='1'
              this.stauts()
            })
            } else {
              for(let i=0;i<this.tableSelectRows.length;i++){
                this.orderId=this.tableSelectRows[i].orderId+','+this.orderId
                this.orderStateId=this.tableSelectRows[i].orderStateId+','+this.orderStateId
                this.version=this.tableSelectRows[i].version+','+this.version
                this.orderStateId='1'
              }
              this.$confirm('此操作上启用商品,是否继续?').then(() => {
              this.stauts() 
            })
            }
          }
        },
        {
          btnName: '订单到货',
          type: 'primary',
          func: () => {
            if (this.tableSelectRows.length === 0) {
              this.$message.error('请选择一条订单')
              return
            } else if(this.tableSelectRows.length === 1){
            this.$confirm('此操作将使订单到货,是否继续?').then(() => {
              this.orderId=this.tableSelectRows[0].orderId
              this.orderStateId=this.tableSelectRows[0].orderStateId
              this.version=this.tableSelectRows[0].version
              this.orderStateId='2'
              this.stauts()
            })
            } else {
              for(let i=0;i<this.tableSelectRows.length;i++){
                 this.orderId=this.tableSelectRows[i].orderId+','+this.orderId
                this.orderStateId=this.tableSelectRows[i].orderStateId+','+this.orderStateId
                this.version=this.tableSelectRows[i].version+','+this.version
                this.orderStateId='2'
              }
              this.$confirm('此操作禁用商品,是否继续?').then(() => {
              this.stauts() 
            })
            }
          }
        },
        {
          btnName:'取消到货',
          type:'primary',
          func: ()=>{
           if (this.tableSelectRows.length === 0) {
              this.$message.error('请选择一条订单')
              return
            } else if(this.tableSelectRows.length === 1){
            this.$confirm('此操作将取消到货,是否继续?').then(() => {
              this.orderId=this.tableSelectRows[0].orderId
              this.orderStateId=this.tableSelectRows[0].orderStateId
              this.version=this.tableSelectRows[0].version
              this.orderStateId='0'
              this.stauts()
            })
            } else {
              for(let i=0;i<this.tableSelectRows.length;i++){
                 this.orderId=this.tableSelectRows[i].orderId+','+this.orderId
                this.orderStateId=this.tableSelectRows[i].orderStateId+','+this.orderStateId
                this.version=this.tableSelectRows[i].version+','+this.version
                this.orderStateId='0'
              }
              this.$confirm('此操作禁用商品,是否继续?').then(() => {
              this.stauts() 
            })
            }
        }
        },
         {
          btnName:'订单已取货',
          type:'primary',
          func: ()=>{
           if (this.tableSelectRows.length === 0) {
              this.$message.error('请选择一条订单')
              return
            } else if(this.tableSelectRows.length === 1){
            this.$confirm('此操作将使订单已取货,是否继续?').then(() => {
              this.orderId=this.tableSelectRows[0].orderId
              this.orderStateId=this.tableSelectRows[0].orderStateId
              this.version=this.tableSelectRows[0].version
              this.orderStateId='3'
              this.stauts()
            })
            } else {
              for(let i=0;i<this.tableSelectRows.length;i++){
                 this.orderId=this.tableSelectRows[i].orderId+','+this.orderId
                this.orderStateId=this.tableSelectRows[i].orderStateId+','+this.orderStateId
                this.version=this.tableSelectRows[i].version+','+this.version
                this.orderStateId='3'
              }
              this.$confirm('此操作禁用商品,是否继续?').then(() => {
              this.stauts() 
            })
            }
        }
        },
        {
          btnName:'取消已取货',
          type:'primary',
          func: ()=>{
           if (this.tableSelectRows.length === 0) {
              this.$message.error('请选择一条订单')
              return
            } else if(this.tableSelectRows.length === 1){
            this.$confirm('此操作将取消已取货,是否继续?').then(() => {
              this.orderId=this.tableSelectRows[0].orderId
              this.orderStateId=this.tableSelectRows[0].orderStateId
              this.version=this.tableSelectRows[0].version
              this.orderStateId='2'
              this.stauts()
            })
            } else {
              for(let i=0;i<this.tableSelectRows.length;i++){
                this.orderId=this.tableSelectRows[i].orderId+','+this.orderId
                this.orderStateId=this.tableSelectRows[i].orderStateId+','+this.orderStateId
                this.version=this.tableSelectRows[i].version+','+this.version
                this.orderStateId='2'
              }
              this.$confirm('此操作禁用商品,是否继续?').then(() => {
              this.stauts() 
            })
            }
        }
        }
      ],
      columnList: [
        {label: '订单编码', prop: 'orderId'},
        {label: '订单总价', prop: 'orderAllCost'},
        {label: '订单状态', prop: 'orderStateId', distName: 'orderStateIdOptions'},
        {label: '门店编码', prop: 'storeId'},
        {label: '下单人姓名', prop: 'userName'},
        {label: '下单人手机号', prop: 'phone'},
        {label: '确认付款时间', prop: 'payTime'}
      ],
      findList: [
        {label: '用户编号', prop: 'userId', width:'150px'},
        {label: '订单编号', prop: 'orderId', width:'150px'},
        {label: '商品编号', prop: 'goodsId', width:'150px'},
        {label: '商品名称', prop: 'goodsName', width:'150px'},
        {label: '商品数量', prop: 'goodsCount', width:'60px'},
        // {label: '总金额', prop: 'theGoodsAllPrice', width:'60px'},
        {label: '售价', prop: 'goodsPrice', width:'60px'},
        {label: '定价', prop: 'goodsShelfCost', width:'60px'}
      ],
      tableData: [],
      findtableData: [
      ],
      rules: {
      },
      multipleSelection: [],
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    fetch () {
      // this.pageInfo.pageSize = 5
      this.pageInfo.pageNum = 1
      this.search()
    },
    search () {
      req('getTableData', {
        ...this.formData,
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageIndex,
        role: JSON.parse(sessionStorage.getItem('roleInfo')).role
      }).then(data => {
        this.tableData = data.data.list
        this.pageInfo.pageIndex = data.data.pageNum
        this.pageInfo.pageSize = data.data.pageSize
        this.pageInfo.total = data.data.total
        // console.log(data.data)
      })
    },
    //查询订单详情接口
    getorderData () {
      req('getorderData',{
        orderId: this.orderId
      }).then(data => {
        this.findtableData = data.data.orderDeepenList
        // console.log(this.orderId)
        // console.log(this.findtableData)
        // console.log(data.data);
        // console.log('555',data)
      })
    },
      //修改订单状态接口
    stauts() {
      req('updateOrderStatus', {
       orderId: this.orderId,
       orderStateId: this.orderStateId,
       version: this.version,
       nowRole: JSON.parse(sessionStorage.getItem('roleInfo')).role
      }).then(data=>{
        //  console.log('orderId',this.orderId)
        //  console.log('orderStateId',this.orderStateId)
         if(data.code === 0) {
          this.$message.success(data.msg)
          this.fetch()
         }
      })
    },
    reset () {
      this.fetch()
      console.log('重置按钮被点击了')
      // this.$refs.iSearch.$refs.form.resetFields()
    },
    handleSizeChange (value) {
      console.log('每页多少条', value)
      this.pageInfo.pageSize = value
      this.search()
    },
    handleCurrentChange (value) {
      console.log('当前多少页', value)
      this.pageInfo.pageIndex = value
      this.search()
    },
    handleSelectionChange(rows) {
      console.log('rows', rows)
      this.tableSelectRows = rows
    },
    dialogBeforeClose () {
      this.$refs.ruleForm.resetFields()
      this.dialogVisible = false
    },
    dialogCancel () {
      this.dialogVisible = false
      this.$refs.ruleForm.resetFields()
    },
    // 表格表头的循环list变量名一定要是一致的(columnList)
    columnFormatter (row, column, cellValue, index) {
      let distName = this.columnList.filter(item => {
        return item.prop === column.property
      })[0].distName

      if (distName) {
        // console.log(row)
        return this[distName].filter(item => {
          return item.value === row[column.property]
        })[0].label
      } else {
        return row[column.property]
      }
    },
    // dialogConfirm () {
    //   this.$refs.ruleForm.validate((valid) => {
    //     if (valid) {
    //       this.fetch()
    //       this.$refs.form.resetFields()
    //       this.dialogVisible = false
    //     }
    //     else {
    //       return false
    //     }
    //   })
    // }
  }
}
</script>
