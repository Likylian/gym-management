<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:bold;">评价管理</span>
      </div>
    </template>
    <div style="display:flex;gap:12px;margin-bottom:14px;flex-wrap:wrap;align-items:center;">
      <el-input v-model="keyword" placeholder="课程/会员/内容" style="width:240px;" clearable />
      <el-select v-model="ratingFilter" placeholder="评分" style="width:120px;" clearable>
        <el-option label="5星" value="5" /><el-option label="4星" value="4" /><el-option label="3星" value="3" /><el-option label="2星" value="2" /><el-option label="1星" value="1" />
      </el-select>
      <el-select v-model="statusFilter" placeholder="处理状态" style="width:140px;" clearable>
        <el-option label="待处理" value="pending" /><el-option label="已回复" value="replied" />
      </el-select>
      <el-button type="primary" @click="loadData">查询</el-button>
      <el-button type="warning" @click="resetFilters">重置</el-button>
    </div>

    <el-table :data="filteredReviews" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="course" label="课程名称" min-width="180" />
      <el-table-column prop="member" label="会员" width="140" />
      <el-table-column label="评分" width="100" align="center">
        <template #default="{row}">
          <el-rate :model-value="row.rating" disabled show-text allow-half="false" />
        </template>
      </el-table-column>
      <el-table-column prop="content" label="评价内容" min-width="220" />
      <el-table-column prop="createTime" label="评价时间" width="180" />
      <el-table-column label="状态" width="100" align="center">
        <template #default="{row}"><el-tag :type="row.status==='replied'?'success':'warning'" size="small">{{ row.status==='replied' ? '已回复' : '待处理' }}</el-tag></template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{row}">
          <el-button size="small" type="primary" link @click="openDetail(row)">查看</el-button>
          <el-button size="small" type="success" link @click="openReply(row)">回复</el-button>
          <el-button size="small" type="danger" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="detailDialogVisible" title="评价详情" width="520px">
      <el-descriptions column="1" border>
        <el-descriptions-item label="课程">{{ selectedReview.course }}</el-descriptions-item>
        <el-descriptions-item label="会员">{{ selectedReview.member }}</el-descriptions-item>
        <el-descriptions-item label="评分">
          <el-rate :model-value="selectedReview.rating" disabled show-text allow-half="false" />
        </el-descriptions-item>
        <el-descriptions-item label="内容">{{ selectedReview.content }}</el-descriptions-item>
        <el-descriptions-item label="评价时间">{{ selectedReview.createTime }}</el-descriptions-item>
        <el-descriptions-item label="状态"><el-tag :type="selectedReview.status==='replied'?'success':'warning'">{{ selectedReview.status==='replied' ? '已回复' : '待处理' }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="回复内容" v-if="selectedReview.reply">{{ selectedReview.reply }}</el-descriptions-item>
      </el-descriptions>
      <template #footer><el-button @click="detailDialogVisible=false">关闭</el-button></template>
    </el-dialog>

    <el-dialog v-model="replyDialogVisible" title="回复评价" width="520px">
      <el-form :model="replyForm" label-width="100px">
        <el-form-item label="课程"><span>{{ selectedReview.course }}</span></el-form-item>
        <el-form-item label="会员"><span>{{ selectedReview.member }}</span></el-form-item>
        <el-form-item label="回复内容"><el-input type="textarea" v-model="replyForm.reply" rows="4" placeholder="请输入回复内容" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="replyDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="handleReply">发送回复</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const keyword = ref('')
const ratingFilter = ref(null)
const statusFilter = ref(null)
const detailDialogVisible = ref(false)
const replyDialogVisible = ref(false)
const selectedReview = reactive({ id:null, course:'', member:'', rating:0, content:'', createTime:'', status:'pending', reply:'' })
const replyForm = reactive({ reply:'' })

const reviews = ref([
  { id:1, course:'私人教练训练课', member:'李华', rating:5, content:'教练很专业，课程安排合理。', createTime:'2025-12-10 18:20:00', status:'replied', reply:'感谢您的好评，期待下次继续为您服务！' },
  { id:2, course:'瑜伽入门体验', member:'王敏', rating:4, content:'环境安静，教练耐心。希望音乐可以再轻柔些。', createTime:'2025-12-09 11:05:00', status:'pending', reply:'' },
  { id:3, course:'动感单车', member:'张强', rating:3, content:'课程节奏快，汗流很多，但有点累。', createTime:'2025-12-08 20:30:00', status:'pending', reply:'' },
])

const filteredReviews = computed(() => {
  return reviews.value.filter(item => {
    const matchKeyword = keyword.value ? [item.course, item.member, item.content].some(field => field.includes(keyword.value)) : true
    const matchRating = ratingFilter.value ? item.rating === Number(ratingFilter.value) : true
    const matchStatus = statusFilter.value ? item.status === statusFilter.value : true
    return matchKeyword && matchRating && matchStatus
  })
})

const loadData = async () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 200)
}

const resetFilters = () => {
  keyword.value = ''
  ratingFilter.value = null
  statusFilter.value = null
}

const openDetail = (row) => {
  Object.assign(selectedReview, row)
  detailDialogVisible.value = true
}

const openReply = (row) => {
  Object.assign(selectedReview, row)
  replyForm.reply = row.reply || ''
  replyDialogVisible.value = true
}

const handleReply = async () => {
  if (!replyForm.reply.trim()) {
    ElMessage.warning('请输入回复内容')
    return
  }
  const index = reviews.value.findIndex(item => item.id === selectedReview.id)
  if (index !== -1) {
    reviews.value[index].reply = replyForm.reply
    reviews.value[index].status = 'replied'
    Object.assign(selectedReview, reviews.value[index])
    ElMessage.success('回复已发送')
    replyDialogVisible.value = false
  }
}

const handleDelete = async (id) => {
  await ElMessageBox.confirm('确定删除该评价吗？', '提示', { type:'warning' })
  reviews.value = reviews.value.filter(item => item.id !== id)
  ElMessage.success('评价已删除')
}
</script>
