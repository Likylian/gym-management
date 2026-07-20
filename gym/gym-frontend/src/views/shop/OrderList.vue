<template>
  <el-card>
    <template #header><span style="font-weight:bold;font-size:16px;">商城订单</span></template>
    <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;">
      <el-input v-model="keyword" placeholder="订单号/会员" style="width:160px;" clearable />
      <el-select v-model="orderStatus" placeholder="订单状态" style="width:120px;" clearable>
        <el-option label="待付款" value="待付款" /><el-option label="已付款" value="已付款" /><el-option label="已取消" value="已取消" />
      </el-select>
      <el-select v-model="orderType" placeholder="订单类型" style="width:120px;" clearable>
        <el-option label="虚拟订单" value="虚拟订单" /><el-option label="实物订单" value="实物订单" /><el-option label="积分订单" value="积分订单" />
      </el-select>
      <el-button type="primary" @click="loadData">查询</el-button>
      <el-button @click="handleExport">导出</el-button>
    </div>
    <el-table :data="list" border stripe v-loading="loading" @selection-change="sel=>selected=sel">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="orderNo" label="订单编号" width="150" />
      <el-table-column prop="memberName" label="会员" width="90" />
      <el-table-column label="订单状态" width="100" align="center">
        <template #default="{row}"><el-tag :type="row.orderStatus==='已付款'?'success':row.orderStatus==='待付款'?'warning':'info'" size="small">{{row.orderStatus}}</el-tag></template>
      </el-table-column>
      <el-table-column label="订单类型" width="100"><template #default="{row}"><el-tag size="small" effect="plain">{{row.orderType}}</el-tag></template></el-table-column>
      <el-table-column label="订单总金额" width="120" align="right"><template #default="{row}"><span style="color:#e6a23c;font-weight:500;">¥{{row.totalAmount}}</span></template></el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{row}">
          <el-button size="small" type="primary" link>处理订单</el-button>
          <el-button size="small" type="danger" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display:flex;justify-content:space-between;margin-top:12px;">
      <el-button size="small" :disabled="!selected.length">批量操作</el-button>
      <el-pagination background layout="total, prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="pageNum" @current-change="loadData" />
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrders, deleteOrder } from '../../api'

const list=ref([]), loading=ref(false), keyword=ref(''), orderStatus=ref(''), orderType=ref('')
const pageNum=ref(1), pageSize=ref(10), total=ref(0), selected=ref([])

const loadData=async()=>{loading.value=true;try{const r=await getOrders({pageNum:pageNum.value,pageSize:pageSize.value,keyword:keyword.value,orderStatus:orderStatus.value,orderType:orderType.value});list.value=r.data.records;total.value=Number(r.data.total)}finally{loading.value=false}}
const handleDelete=async(id)=>{await ElMessageBox.confirm('确定删除?','提示',{type:'warning'});await deleteOrder(id);ElMessage.success('删除成功');loadData()}
const handleExport=()=>ElMessage.info('导出功能开发中')
onMounted(loadData)
</script>
