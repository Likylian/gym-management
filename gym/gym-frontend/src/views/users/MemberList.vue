<template>
  <el-card>
    <template #header><span style="font-weight:bold;font-size:16px;">会员列表</span></template>
    <div style="display:flex;gap:10px;margin-bottom:12px;">
      <el-input v-model="keyword" placeholder="昵称/电话/账号" style="width:200px;" clearable />
      <el-select v-model="levelFilter" placeholder="会员等级" style="width:140px;" clearable>
        <el-option label="一般会员" value="一般会员" /><el-option label="VIP会员" value="VIP会员" /><el-option label="钻石会员" value="钻石会员" />
      </el-select>
      <el-button type="primary" @click="loadData">查询</el-button>
      <el-button @click="handleExport">导出</el-button>
    </div>
    <el-table :data="list" border stripe v-loading="loading" @selection-change="handleSelect">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="account" label="用户ID/账号" width="130" />
      <el-table-column prop="nickname" label="用户昵称" width="100" />
      <el-table-column label="注册时间" width="160"><template #default="{row}">{{row.registerTime}}</template></el-table-column>
      <el-table-column prop="realName" label="姓名" width="80" />
      <el-table-column prop="phone" label="电话" width="120" />
      <el-table-column prop="memberCard" label="会员卡" min-width="130" />
      <el-table-column prop="memberLevel" label="会员等级" width="100" />
      <el-table-column prop="coach" label="教练" width="80" />
      <el-table-column label="状态" width="80" align="center">
        <template #default="{row}"><el-switch :model-value="row.status===1" @change="v=>toggleStatus(row,v)" /></template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{row}">
          <el-button size="small" type="primary" link @click="openDetail(row)">查看</el-button>
          <el-button size="small" type="warning" link @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;">
      <div>
        <el-button size="small" :disabled="!selected.length" @click="openBatchDialog">批量操作</el-button>
      </div>
      <el-pagination background layout="total, prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="pageNum" @current-change="loadData" />
    </div>

    <el-dialog v-model="batchDialogVisible" title="批量操作" width="420px">
      <el-form :model="batchForm" label-width="110px">
        <el-form-item label="已选会员数"><span>{{ selected.length }} 条</span></el-form-item>
        <el-form-item label="操作类型">
          <el-radio-group v-model="batchForm.action">
            <el-radio label="enable">批量启用</el-radio>
            <el-radio label="disable">批量禁用</el-radio>
            <el-radio label="delete">批量删除</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="batchDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmBatchAction">执行</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailDialogVisible" title="会员详情" width="440px">
      <el-descriptions column="1" border>
        <el-descriptions-item label="账号">{{ selectedMember.account }}</el-descriptions-item>
        <el-descriptions-item label="昵称">{{ selectedMember.nickname }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ selectedMember.realName }}</el-descriptions-item>
        <el-descriptions-item label="电话">{{ selectedMember.phone }}</el-descriptions-item>
        <el-descriptions-item label="会员卡">{{ selectedMember.memberCard }}</el-descriptions-item>
        <el-descriptions-item label="会员等级">{{ selectedMember.memberLevel }}</el-descriptions-item>
        <el-descriptions-item label="教练">{{ selectedMember.coach }}</el-descriptions-item>
        <el-descriptions-item label="状态"><el-tag :type="selectedMember.status===1?'success':'info'">{{ selectedMember.status===1?'启用':'禁用' }}</el-tag></el-descriptions-item>
      </el-descriptions>
      <template #footer><el-button @click="detailDialogVisible=false">关闭</el-button></template>
    </el-dialog>

    <el-dialog v-model="dialogVisible" title="编辑会员" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="昵称"><el-input v-model="form.nickname" /></el-form-item>
        <el-form-item label="姓名"><el-input v-model="form.realName" /></el-form-item>
        <el-form-item label="电话"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="会员卡"><el-input v-model="form.memberCard" /></el-form-item>
        <el-form-item label="会员等级"><el-select v-model="form.memberLevel"><el-option label="一般会员" value="一般会员" /><el-option label="VIP会员" value="VIP会员" /><el-option label="钻石会员" value="钻石会员" /></el-select></el-form-item>
        <el-form-item label="教练"><el-input v-model="form.coach" /></el-form-item>
        <el-form-item label="状态"><el-switch v-model="form.status" :active-value="1" :inactive-value="0" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary" @click="handleSave">保存</el-button></template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMembers, updateMember, deleteMember } from '../../api'

const list=ref([]), loading=ref(false), keyword=ref(''), levelFilter=ref('')
const pageNum=ref(1), pageSize=ref(10), total=ref(0), selected=ref([])
const batchDialogVisible=ref(false)
const batchForm=reactive({ action:'' })
const detailDialogVisible=ref(false)
const dialogVisible=ref(false)
const editId=ref(null)
const selectedMember=reactive({ account:'', nickname:'', realName:'', phone:'', memberCard:'', memberLevel:'', coach:'', status:1 })
const form=reactive({ nickname:'', realName:'', phone:'', memberCard:'', memberLevel:'一般会员', coach:'', status:1 })

const loadData=async()=>{loading.value=true;try{const r=await getMembers({pageNum:pageNum.value,pageSize:pageSize.value,keyword:keyword.value,memberLevel:levelFilter.value});list.value=r.data.records;total.value=Number(r.data.total)}finally{loading.value=false}}
const handleSelect=(v)=>selected.value=v
const toggleStatus=(row,v)=>{row.status=v?1:0;ElMessage.success('状态已更新')}
const openBatchDialog=()=>{
  if (!selected.value.length) {
    ElMessage.warning('请先选择至少一条会员')
    return
  }
  batchForm.action = ''
  batchDialogVisible.value = true
}
const confirmBatchAction=async()=>{
  if (!batchForm.action) {
    ElMessage.warning('请选择批量操作类型')
    return
  }
  const members = selected.value
  if (!members.length) {
    ElMessage.warning('请先选择至少一条会员')
    return
  }
  const actionText = batchForm.action === 'enable' ? '批量启用' : batchForm.action === 'disable' ? '批量禁用' : '批量删除'
  await ElMessageBox.confirm(`确定对 ${members.length} 个会员执行「${actionText}」吗？`, '批量操作', { type: 'warning' })
  if (batchForm.action === 'delete') {
    await Promise.all(members.map(member => deleteMember(member.id)))
  } else {
    const status = batchForm.action === 'enable' ? 1 : 0
    await Promise.all(members.map(member => updateMember(member.id, { status })))
  }
  ElMessage.success(`${actionText}完成`)
  batchDialogVisible.value = false
  loadData()
}
const openDetail=(row)=>{Object.assign(selectedMember,row);detailDialogVisible.value=true}
const openDialog=(row)=>{if(row){editId.value=row.id;Object.assign(form,row)}else{editId.value=null;Object.assign(form,{nickname:'',realName:'',phone:'',memberCard:'',memberLevel:'一般会员',coach:'',status:1})}dialogVisible.value=true}
const handleSave=async()=>{if(!editId.value){ElMessage.warning('请选择一条会员进行编辑');return}await updateMember(editId.value, form);ElMessage.success('保存成功');dialogVisible.value=false;loadData()}
const handleDelete=async(id)=>{await ElMessageBox.confirm('确定删除?','提示',{type:'warning'});await deleteMember(id);ElMessage.success('删除成功');loadData()}
const handleExport=()=>{
  if (!list.value.length) {
    ElMessage.warning('当前没有可导出的会员数据')
    return
  }
  const header = ['账号','昵称','注册时间','姓名','电话','会员卡','会员等级','教练','状态']
  const rows = list.value.map(item => [
    item.account,
    item.nickname,
    item.registerTime,
    item.realName,
    item.phone,
    item.memberCard,
    item.memberLevel,
    item.coach,
    item.status === 1 ? '启用' : '禁用'
  ])
  const csv = [header, ...rows]
    .map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `会员导出_${new Date().toISOString().slice(0,10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}
onMounted(loadData)
</script>
