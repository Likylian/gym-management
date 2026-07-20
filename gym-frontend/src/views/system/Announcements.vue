<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:bold;">公告管理</span>
        <el-button type="primary" size="small" @click="openDialog()">发布公告</el-button>
      </div>
    </template>
    <el-table :data="list" border stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="title" label="公告标题" min-width="200" />
      <el-table-column prop="type" label="类型" width="100" />
      <el-table-column label="状态" width="80" align="center"><template #default="{row}"><el-tag :type="row.status?'success':'info'" size="small">{{row.status?'已发布':'草稿'}}</el-tag></template></el-table-column>
      <el-table-column prop="createTime" label="发布时间" width="160" />
      <el-table-column label="操作" width="140">
        <template #default="{row}"><el-button size="small" type="primary" link @click="openDialog(row)">编辑</el-button><el-button size="small" type="danger" link @click="handleDelete(row.id)">删除</el-button></template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="editId ? '编辑公告' : '发布公告'" width="520px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="标题"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="类型"><el-select v-model="form.type"><el-option label="系统通知" value="系统通知" /><el-option label="课程通知" value="课程通知" /><el-option label="活动公告" value="活动公告" /></el-select></el-form-item>
        <el-form-item label="状态"><el-switch v-model="form.status" :active-value="true" :inactive-value="false" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const list = ref([
  { id:1, title:'系统维护通知 - 2024年1月25日凌晨2:00-6:00', type:'系统通知', status:true, createTime:'2024-01-20 10:00:00' },
  { id:2, title:'春节期间课程调整通知', type:'课程通知', status:true, createTime:'2024-01-18 15:30:00' },
  { id:3, title:'新功能上线公告 - 积分商城', type:'活动公告', status:false, createTime:'2024-01-15 09:00:00' },
])
const dialogVisible = ref(false)
const editId = ref(null)
const form = reactive({ title:'', type:'系统通知', status:true })

const openDialog = (row = null) => {
  if (row) {
    editId.value = row.id
    Object.assign(form, row)
  } else {
    editId.value = null
    Object.assign(form, { title:'', type:'系统通知', status:true })
  }
  dialogVisible.value = true
}

const handleSave = () => {
  if (!form.title.trim()) {
    ElMessage.warning('请填写公告标题')
    return
  }
  if (editId.value) {
    const index = list.value.findIndex(item => item.id === editId.value)
    if (index !== -1) {
      list.value[index] = { ...list.value[index], ...form }
      ElMessage.success('公告已更新')
    }
  } else {
    const nextId = Math.max(0, ...list.value.map(item => item.id)) + 1
    list.value.push({ id: nextId, ...form, createTime: new Date().toISOString().slice(0,19).replace('T',' ') })
    ElMessage.success('公告已发布')
  }
  dialogVisible.value = false
}

const handleDelete = async (id) => {
  await ElMessageBox.confirm('确定删除该公告吗？', '提示', { type:'warning' })
  list.value = list.value.filter(item => item.id !== id)
  ElMessage.success('公告已删除')
}
</script>
