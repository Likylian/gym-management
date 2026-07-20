<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:bold;">广告管理</span>
        <el-button type="primary" size="small">添加广告</el-button>
      </div>
    </template>
    <el-table :data="ads" border stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column label="广告图片" width="120"><template #default><el-icon size="32" color="#ddd"><Picture /></el-icon></template></el-table-column>
      <el-table-column prop="title" label="广告标题" min-width="160" />
      <el-table-column prop="position" label="展示位置" width="120" />
      <el-table-column label="状态" width="80" align="center"><template #default="{row}"><el-tag :type="row.status?'success':'info'" size="small">{{row.status?'启用':'禁用'}}</el-tag></template></el-table-column>
      <el-table-column prop="sort" label="排序" width="70" align="center" />
      <el-table-column label="操作" width="140">
        <template #default="{row}"><el-button size="small" type="primary" link @click="openDialog(row)">编辑</el-button><el-button size="small" type="danger" link @click="handleDelete(row.id)">删除</el-button></template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="editId ? '编辑广告' : '添加广告'" width="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="广告标题"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="展示位置"><el-input v-model="form.position" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort" :min="1" /></el-form-item>
        <el-form-item label="状态"><el-switch v-model="form.status" :active-value="true" :inactive-value="false" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const ads = ref([
  { id:1, title:'新年促销活动', position:'首页轮播', status:true, sort:1 },
  { id:2, title:'私教课程优惠', position:'首页推荐', status:true, sort:2 },
  { id:3, title:'会员日特别活动', position:'弹窗广告', status:false, sort:3 },
])
const dialogVisible = ref(false)
const editId = ref(null)
const form = reactive({ title:'', position:'', status:true, sort:1 })
const openDialog = (row = null) => {
  if (row) {
    editId.value = row.id
    Object.assign(form, row)
  } else {
    editId.value = null
    Object.assign(form, { title:'', position:'', status:true, sort:ads.value.length + 1 })
  }
  dialogVisible.value = true
}
const handleSave = () => {
  if (!form.title.trim()) {
    ElMessage.warning('请填写广告标题')
    return
  }
  if (!form.position.trim()) {
    ElMessage.warning('请填写展示位置')
    return
  }
  if (editId.value) {
    const index = ads.value.findIndex(item => item.id === editId.value)
    if (index !== -1) {
      ads.value[index] = { ...ads.value[index], ...form }
      ElMessage.success('广告已更新')
    }
  } else {
    const nextId = Math.max(0, ...ads.value.map(item => item.id)) + 1
    ads.value.push({ id: nextId, ...form })
    ElMessage.success('广告已添加')
  }
  dialogVisible.value = false
}
const handleDelete = async (id) => {
  await ElMessageBox.confirm('确定删除该广告吗？', '提示', { type:'warning' })
  ads.value = ads.value.filter(item => item.id !== id)
  ElMessage.success('广告已删除')
}
</script>
