<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:bold;">商品分类</span>
        <el-button type="primary" size="small" @click="openDialog()">添加分类</el-button>
      </div>
    </template>
    <el-table :data="categories" border stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="count" label="商品数量" width="120" align="center" />
      <el-table-column prop="sort" label="排序" width="100" align="center" />
      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-button size="small" type="primary" link @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="editId ? '编辑分类' : '添加分类'" width="440px">
      <el-form :model="form" label-width="90px">
        <el-form-item label="分类名称" required>
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input-number v-model="form.count" :min="0" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="form.sort" :min="1" />
        </el-form-item>
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

const categories = ref([
  { id: 1, name: '健身周边', count: 6, sort: 1 },
  { id: 2, name: '食品', count: 2, sort: 2 },
])
const dialogVisible = ref(false)
const editId = ref(null)
const form = reactive({ name: '', count: 0, sort: 1 })

const openDialog = (row = null) => {
  if (row) {
    editId.value = row.id
    Object.assign(form, row)
  } else {
    editId.value = null
    Object.assign(form, { name: '', count: 0, sort: categories.value.length + 1 })
  }
  dialogVisible.value = true
}

const handleSave = () => {
  if (!form.name.trim()) {
    ElMessage.warning('请填写分类名称')
    return
  }
  if (editId.value) {
    const index = categories.value.findIndex(item => item.id === editId.value)
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...form }
      ElMessage.success('分类已更新')
    }
  } else {
    const nextId = Math.max(0, ...categories.value.map(item => item.id)) + 1
    categories.value.push({ id: nextId, ...form })
    ElMessage.success('分类已添加')
  }
  dialogVisible.value = false
}

const handleDelete = async (id) => {
  await ElMessageBox.confirm('确定删除该分类吗？', '提示', { type: 'warning' })
  categories.value = categories.value.filter(item => item.id !== id)
  ElMessage.success('分类已删除')
}
</script>
