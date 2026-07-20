<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:bold;font-size:16px;">团课管理</span>
        <el-button type="primary" @click="openDialog()">添加团课</el-button>
      </div>
    </template>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="团课课程" name="list" />
      <el-tab-pane label="团课课表" name="schedule" />
    </el-tabs>
    <div style="display:flex;gap:10px;margin-bottom:12px;">
      <el-input v-model="keyword" placeholder="搜索课程名称" style="width:200px;" clearable @clear="loadData" @keyup.enter="loadData" />
      <el-button type="primary" @click="loadData">查询</el-button>
    </div>
    <div v-if="activeTab === 'list'">
      <el-table :data="list" border stripe v-loading="loading">
        <el-table-column label="课程图片" width="90">
          <template #default><el-icon size="32" color="#ddd"><Picture /></el-icon></template>
        </el-table-column>
        <el-table-column prop="name" label="课程名称" min-width="140" />
        <el-table-column prop="coach" label="教练" width="100" />
        <el-table-column prop="sort" label="排序" width="70" align="center" />
        <el-table-column label="时长" width="90" align="center">
          <template #default="{ row }">{{ row.duration }}分钟</template>
        </el-table-column>
        <el-table-column prop="maxPeople" label="可预约人数" width="100" align="center" />
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="openDialog(row)">编辑</el-button>
            <el-button size="small" type="warning" link @click="openSchedule(row)">排课</el-button>
            <el-button size="small" type="danger" link @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <span style="font-size:14px;font-weight:500;color:#333;">当前团课排课列表</span>
        <el-button type="primary" size="small" @click="openScheduleDialog">添加排课</el-button>
      </div>
      <el-table :data="computedScheduleList" border stripe size="small">
        <el-table-column prop="courseName" label="课程名称" min-width="160" />
        <el-table-column prop="coach" label="教练" width="100" />
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="time" label="时间" width="100" />
        <el-table-column prop="available" label="可预约人数" width="120" align="center" />
        <el-table-column label="操作" width="120" align="center">
          <template #default="{ row }">
            <el-button type="danger" size="small" link @click="removeSchedule(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination style="margin-top:12px;justify-content:flex-end;" background layout="total, prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="pageNum" @current-change="loadData" />
    <el-dialog v-model="dialogVisible" :title="editId ? '编辑团课' : '添加团课'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="课程名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="教练"><el-input v-model="form.coach" /></el-form-item>
        <el-form-item label="时长(分)"><el-input-number v-model="form.duration" :min="1" /></el-form-item>
        <el-form-item label="最大人数"><el-input-number v-model="form.maxPeople" :min="1" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort" :min="0" /></el-form-item>
        <el-form-item label="标签"><el-input v-model="form.tags" placeholder="多个标签逗号分隔" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="scheduleDialogVisible" :title="`${selectedCourse.name} 课表管理`" width="620px">
      <div style="margin-bottom:16px;display:flex;gap:16px;flex-wrap:wrap;align-items:center;">
        <el-form :model="scheduleForm" label-width="80px" inline>
          <el-form-item label="课程"><el-select v-model="scheduleForm.courseId" placeholder="选择课程" style="width:180px;">
            <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id" />
          </el-select></el-form-item>
          <el-form-item label="日期"><el-date-picker v-model="scheduleForm.date" type="date" placeholder="选择日期" /></el-form-item>
          <el-form-item label="时间"><el-time-picker v-model="scheduleForm.time" placeholder="选择时间" /></el-form-item>
          <el-form-item label="可预约人数"><el-input-number v-model="scheduleForm.available" :min="1" :max="200" /></el-form-item>
          <el-form-item><el-button type="primary" @click="addSchedule">添加排课</el-button></el-form-item>
        </el-form>
      </div>
      <el-table :data="computedScheduleList" border stripe size="small">
        <el-table-column prop="courseName" label="课程名称" min-width="160" />
        <el-table-column prop="coach" label="教练" width="100" />
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="time" label="时间" width="100" />
        <el-table-column prop="available" label="可预约人数" width="120" align="center" />
        <el-table-column label="操作" width="120" align="center">
          <template #default="{ row }">
            <el-button type="danger" size="small" link @click="removeSchedule(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="scheduleDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getGroupCourses, addGroupCourse, updateGroupCourse, deleteGroupCourse } from '../../api'

const activeTab = ref('list')
const list = ref([])
const loading = ref(false)
const keyword = ref('')
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const scheduleDialogVisible = ref(false)
const editId = ref(null)
const form = reactive({ name:'', coach:'', duration:45, maxPeople:50, sort:0, tags:'' })
const selectedCourse = reactive({ id:null, name:'', coach:'', duration:0, maxPeople:1 })
const scheduleForm = reactive({ courseId:null, date:'', time:'', available:1 })
const schedules = ref([])

const courseSchedules = computed(() => schedules.value.filter(item => item.courseId === selectedCourse.id))

const loadData = async () => {
  loading.value = true
  try {
    const res = await getGroupCourses({ pageNum: pageNum.value, pageSize: pageSize.value, name: keyword.value })
    list.value = res.data.records
    total.value = Number(res.data.total)
  } finally { loading.value = false }
}

const openDialog = (row) => {
  if (row) { editId.value = row.id; Object.assign(form, row) }
  else { editId.value = null; Object.assign(form, { name:'', coach:'', duration:45, maxPeople:50, sort:0, tags:'' }) }
  dialogVisible.value = true
}

const openScheduleDialog = () => {
  selectedCourse.id = null
  selectedCourse.name = ''
  selectedCourse.coach = ''
  selectedCourse.duration = 0
  selectedCourse.maxPeople = 1
  scheduleForm.courseId = null
  scheduleForm.date = ''
  scheduleForm.time = ''
  scheduleForm.available = 1
  scheduleDialogVisible.value = true
}

const openSchedule = (row) => {
  selectedCourse.id = row.id
  selectedCourse.name = row.name
  selectedCourse.coach = row.coach
  selectedCourse.duration = row.duration
  selectedCourse.maxPeople = row.maxPeople || 1
  scheduleForm.courseId = row.id
  scheduleForm.date = ''
  scheduleForm.time = ''
  scheduleForm.available = selectedCourse.maxPeople
  scheduleDialogVisible.value = true
}

const computedScheduleList = computed(() => {
  return schedules.value.map(item => {
    const course = list.value.find(course => course.id === item.courseId) || {}
    return {
      ...item,
      courseName: course.name || '未知课程',
      coach: course.coach || '未知教练'
    }
  })
})

const addSchedule = () => {
  if (!scheduleForm.courseId || !scheduleForm.date || !scheduleForm.time) {
    ElMessage.warning('请选择课程、日期和时间')
    return
  }
  const nextId = Math.max(0, ...schedules.value.map(item => item.id)) + 1
  schedules.value.push({ id: nextId, courseId: scheduleForm.courseId, date: scheduleForm.date, time: scheduleForm.time, available: scheduleForm.available })
  ElMessage.success('排课已添加')
  scheduleForm.date = ''
  scheduleForm.time = ''
}

const removeSchedule = async (id) => {
  await ElMessageBox.confirm('确定删除该排课吗？', '提示', { type:'warning' })
  schedules.value = schedules.value.filter(item => item.id !== id)
  ElMessage.success('排课已删除')
}

const handleSave = async () => {
  if (editId.value) await updateGroupCourse(editId.value, form)
  else await addGroupCourse(form)
  ElMessage.success('保存成功'); dialogVisible.value = false; loadData()
}

const handleDelete = async (id) => {
  await ElMessageBox.confirm('确定删除该课程?', '提示', { type:'warning' })
  await deleteGroupCourse(id); ElMessage.success('删除成功'); loadData()
}

onMounted(loadData)
</script>
