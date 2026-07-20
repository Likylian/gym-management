<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:bold;font-size:16px;">教练详情</span>
        <el-button type="primary" @click="goBack">返回</el-button>
      </div>
    </template>
    <div style="display:flex;gap:24px;align-items:flex-start;">
      <div style="width:180px;text-align:center;">
        <img :src="coach.avatar || 'https://via.placeholder.com/160?text=头像'" alt="头像" style="width:160px;height:160px;border-radius:12px;object-fit:cover;border:1px solid #ebeef5;" />
        <div style="margin-top:16px;font-size:20px;font-weight:700;">{{ coach.name }}</div>
        <div style="color:#909399;margin-top:8px;">{{ coach.role || '教练' }}</div>
      </div>
      <div style="flex:1;">
        <el-descriptions column="2" border>
          <el-descriptions-item label="姓名">{{ coach.name }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ coach.gender }}</el-descriptions-item>
          <el-descriptions-item label="电话">{{ coach.phone }}</el-descriptions-item>
          <el-descriptions-item label="所属场馆">{{ coach.venueNames }}</el-descriptions-item>
          <el-descriptions-item label="角色">{{ coach.role || '教练' }}</el-descriptions-item>
          <el-descriptions-item label="从业时间">{{ coach.experience || '' }}</el-descriptions-item>
          <el-descriptions-item label="擅长">{{ coach.specialty || '' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ coach.createdAt || '' }}</el-descriptions-item>
          <el-descriptions-item label="排序">{{ coach.sort }}</el-descriptions-item>
          <el-descriptions-item label="状态"><el-tag :type="coach.status===1?'success':'info'">{{ coach.status===1?'启用':'禁用' }}</el-tag></el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <div style="margin-top:24px;">
      <el-card shadow="never">
        <div style="font-size:14px;font-weight:600;margin-bottom:10px;">教练简介</div>
        <div style="color:#606266;line-height:1.8;min-height:80px;">{{ coach.description || '暂无简介' }}</div>
      </el-card>
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getCoach } from '../../api'

const route = useRoute()
const router = useRouter()
const coach = ref({})

const loadCoach = async () => {
  try {
    const res = await getCoach(route.params.id)
    coach.value = res.data
  } catch (error) {
    ElMessage.error('加载教练详情失败')
  }
}

const goBack = () => router.back()

onMounted(loadCoach)
</script>
