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
    <el-table :data="list" border stripe v-loading="loading" @selection-change="handleSelect">
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
          <el-button size="small" type="primary" link @click="handleProcess(row)">处理订单</el-button>
          <el-button size="small" type="danger" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display:flex;justify-content:space-between;margin-top:12px;">
      <el-button size="small" :disabled="!selected.length" @click="openBatchDialog">批量操作</el-button>
      <el-pagination background layout="total, prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="pageNum" @current-change="loadData" />
    </div>

    <el-dialog v-model="batchDialogVisible" title="批量操作订单" width="420px">
      <el-form :model="batchForm" label-width="100px">
        <el-form-item label="已选订单">
          <span>{{ selected.length }} 条</span>
        </el-form-item>
        <el-form-item label="操作类型">
          <el-radio-group v-model="batchForm.action">
            <el-radio label="markPaid">标记为已付款</el-radio>
            <el-radio label="cancel">取消订单</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="batchDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBatchAction">执行</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrders, updateOrder, deleteOrder } from '../../api'

const list=ref([]), loading=ref(false), keyword=ref(''), orderStatus=ref(''), orderType=ref('')
const pageNum=ref(1), pageSize=ref(10), total=ref(0), selected=ref([])
const batchDialogVisible=ref(false)
const batchForm=ref({ action: '' })

const loadData=async()=>{loading.value=true;try{const r=await getOrders({pageNum:pageNum.value,pageSize:pageSize.value,keyword:keyword.value,orderStatus:orderStatus.value,orderType:orderType.value});list.value=r.data.records;total.value=Number(r.data.total)}finally{loading.value=false}}
const handleSelect=(v)=>selected.value=v
const openBatchDialog=()=>{
  if (!selected.value.length) {
    ElMessage.warning('请先选择至少一条订单')
    return
  }
  batchForm.value.action = ''
  batchDialogVisible.value = true
}
const confirmBatchAction=async()=>{
  if (!batchForm.value.action) {
    ElMessage.warning('请选择批量操作类型')
    return
  }
  const targetStatus = batchForm.value.action === 'markPaid' ? '已付款' : '已取消'
  const applying = selected.value.filter(row => {
    if (batchForm.value.action === 'markPaid') return row.orderStatus === '待付款'
    return row.orderStatus !== '已取消'
  })
  if (!applying.length) {
    ElMessage.info('当前选中订单中没有可执行该操作的项')
    return
  }
  const actionText = batchForm.value.action === 'markPaid' ? '批量标记为已付款' : '批量取消订单'
  await ElMessageBox.confirm(`确定对 ${applying.length} 个订单执行“${actionText}”吗？`, '批量操作', { type: 'warning' })
  await Promise.all(applying.map(row => updateOrder(row.id, { orderStatus: targetStatus })))
  ElMessage.success('批量操作完成')
  batchDialogVisible.value = false
  loadData()
}
const handleExport=()=>{
  if (!list.value.length) {
    ElMessage.warning('当前没有可导出的订单')
    return
  }
  const header = ['订单编号','会员','订单状态','订单类型','总金额']
  const rows = list.value.map(item => [item.orderNo, item.memberName, item.orderStatus, item.orderType, item.totalAmount])
  const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `订单导出_${new Date().toISOString().slice(0,10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('订单已导出')
}
const handleProcess=async(row)=>{
  if (row.orderStatus === '已取消') {
    ElMessage.info('该订单已取消，无需处理')
    return
  }
  const nextStatus = row.orderStatus === '待付款' ? '已付款' : '已取消'
  const actionText = row.orderStatus === '待付款' ? '标记为已付款' : '取消订单'
  await ElMessageBox.confirm(`确定要将订单 ${row.orderNo} ${actionText} 吗？`, '处理订单', { type: 'warning' })
  await updateOrder(row.id, { orderStatus: nextStatus })
  ElMessage.success(`订单已${nextStatus}`)
  loadData()
}
const handleDelete=async(id)=>{await ElMessageBox.confirm('确定删除?','提示',{type:'warning'});await deleteOrder(id);ElMessage.success('删除成功');loadData()}
onMounted(loadData)
</script>
