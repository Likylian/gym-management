<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:bold;font-size:16px;">私教管理</span>
        <el-button type="primary" @click="openDialog()">添加私教</el-button>
      </div>
    </template>
    <div style="display:flex;gap:10px;margin-bottom:12px;">
      <el-input v-model="keyword" placeholder="课程名称" style="width:160px;" clearable />
      <el-input v-model="coachFilter" placeholder="教练筛选" style="width:140px;" clearable />
      <el-button type="primary" @click="loadData">查询</el-button>
    </div>
    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column label="课程图片" width="90">
        <template #default><el-icon size="32" color="#ddd"><Picture /></el-icon></template>
      </el-table-column>
      <el-table-column prop="name" label="课程名称" min-width="140" />
      <el-table-column prop="coach" label="教练" width="100" />
      <el-table-column prop="sort" label="排序" width="70" align="center" />
      <el-table-column label="时长" width="90" align="center"><template #default="{ row }">{{ row.duration }}分钟</template></el-table-column>
      <el-table-column prop="maxPeople" label="可预约人数" width="100" align="center" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="primary" link @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="warning" link>排期</el-button>
          <el-button size="small" type="danger" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top:12px;justify-content:flex-end;" background layout="total, prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="pageNum" @current-change="loadData" />
    <el-dialog v-model="dialogVisible" :title="editId ? '编辑私教' : '添加私教'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="课程名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="教练"><el-input v-model="form.coach" /></el-form-item>
        <el-form-item label="时长(分)"><el-input-number v-model="form.duration" :min="1" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort" :min="0" /></el-form-item>
        <el-form-item label="标签"><el-input v-model="form.tags" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getPrivateCourses, addPrivateCourse, updatePrivateCourse, deletePrivateCourse } from '../../api'

const list = ref([])
const loading = ref(false)
const keyword = ref('')
const coachFilter = ref('')
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const editId = ref(null)
const form = reactive({ name:'', coach:'', duration:50, sort:0, tags:'' })

const loadData = async () => {
  loading.value = true
  try {
    const res = await getPrivateCourses({ pageNum: pageNum.value, pageSize: pageSize.value, name: keyword.value, coach: coachFilter.value })
    list.value = res.data.records; total.value = Number(res.data.total)
  } finally { loading.value = false }
}

const openDialog = (row) => {
  if (row) { editId.value = row.id; Object.assign(form, row) }
  else { editId.value = null; Object.assign(form, { name:'', coach:'', duration:50, sort:0, tags:'' }) }
  dialogVisible.value = true
}

const handleSave = async () => {
  if (editId.value) await updatePrivateCourse(editId.value, form)
  else await addPrivateCourse(form)
  ElMessage.success('保存成功'); dialogVisible.value = false; loadData()
}

const handleDelete = async (id) => {
  await ElMessageBox.confirm('确定删除?', '提示', { type:'warning' })
  await deletePrivateCourse(id); ElMessage.success('删除成功'); loadData()
}

onMounted(loadData)
</script>
