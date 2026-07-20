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
          <el-button size="small" type="primary" link>查看</el-button>
          <el-button size="small" type="warning" link>编辑</el-button>
          <el-button size="small" type="danger" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;">
      <div>
        <el-button size="small" :disabled="!selected.length" @click="handleBatch">批量操作</el-button>
      </div>
      <el-pagination background layout="total, prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="pageNum" @current-change="loadData" />
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMembers, deleteMember } from '../../api'

const list=ref([]), loading=ref(false), keyword=ref(''), levelFilter=ref('')
const pageNum=ref(1), pageSize=ref(10), total=ref(0), selected=ref([])

const loadData=async()=>{loading.value=true;try{const r=await getMembers({pageNum:pageNum.value,pageSize:pageSize.value,keyword:keyword.value,memberLevel:levelFilter.value});list.value=r.data.records;total.value=Number(r.data.total)}finally{loading.value=false}}
const handleSelect=(v)=>selected.value=v
const toggleStatus=(row,v)=>{row.status=v?1:0;ElMessage.success('状态已更新')}
const handleDelete=async(id)=>{await ElMessageBox.confirm('确定删除?','提示',{type:'warning'});await deleteMember(id);ElMessage.success('删除成功');loadData()}
const handleBatch=()=>ElMessage.info('批量操作功能开发中')
const handleExport=()=>ElMessage.info('导出功能开发中')
onMounted(loadData)
</script>
