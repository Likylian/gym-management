<template>
  <div>
    <!-- 统计卡片 -->
    <el-row :gutter="16" style="margin-bottom:20px;">
      <el-col :span="4" v-for="card in statCards" :key="card.label">
        <el-card shadow="hover" :body-style="{ padding:'16px' }">
          <div style="font-size:12px;color:#999;margin-bottom:6px;">{{ card.label }}</div>
          <div style="font-size:24px;font-weight:bold;color:#303133;">{{ card.value }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 今日课程 + 最新办卡 -->
    <el-row :gutter="16" style="margin-bottom:20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:bold;">今日团课</span>
              <el-tag type="success" size="small">{{ stats.totalGroupCourses || 0 }} 节</el-tag>
            </div>
          </template>
          <div v-for="item in (stats.todaySchedule || []).slice(0,6)" :key="item.time" style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5;">
            <span style="color:#409eff;font-weight:500;">{{ item.time }}</span>
            <span>{{ item.course }}</span>
            <span style="color:#999;">{{ item.coach }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:bold;">最新办卡</span>
              <el-tag type="warning" size="small">{{ stats.totalMemberCards || 0 }} 张</el-tag>
            </div>
          </template>
          <div v-for="item in (stats.latestCards || [])" :key="item.cardName" style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f5f5f5;">
            <span style="color:#e6a23c;font-weight:500;">{{ item.cardName }}</span>
            <span>{{ item.memberName }}</span>
            <span style="color:#999;font-size:12px;">{{ item.createTime }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 销售图表 -->
    <el-row :gutter="16">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:bold;">商城销售统计</span>
              <el-radio-group v-model="salesPeriod" size="small">
                <el-radio-button label="本周" />
                <el-radio-button label="本月" />
              </el-radio-group>
            </div>
          </template>
          <div ref="shopChartRef" style="height:260px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:bold;">课程销售统计</span>
              <el-radio-group v-model="coursePeriod" size="small">
                <el-radio-button label="本周" />
                <el-radio-button label="本月" />
              </el-radio-group>
            </div>
          </template>
          <div ref="courseChartRef" style="height:260px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import * as echarts from 'echarts'
import { getDashboardStats, getDashboardSales } from '../api'

const stats = ref({})
const salesData = ref({})
const salesPeriod = ref('本周')
const coursePeriod = ref('本周')
const shopChartRef = ref()
const courseChartRef = ref()

const statCards = computed(() => [
  { label: '今日应收（课程）', value: stats.value.todayRevenue || 0 },
  { label: '昨日应收', value: stats.value.yesterdayRevenue || 0 },
  { label: '今日新增会员', value: stats.value.todayNewMembers || 0 },
  { label: '昨日新增会员', value: stats.value.yesterdayNewMembers || 0 },
  { label: '累积会员', value: stats.value.totalMembers || 0 },
  { label: '今日上课', value: stats.value.todayCourses || 0 },
])

const initShopChart = () => {
  const chart = echarts.init(shopChartRef.value)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: '8%', right: '4%', top: '15%', bottom: '15%' },
    xAxis: { type: 'category', data: salesData.value.dates || [] },
    yAxis: { type: 'value' },
    series: [{
      name: '商城销售额',
      type: 'line',
      data: salesData.value.shopSales || [],
      smooth: true,
      itemStyle: { color: '#409eff' },
      areaStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(64,158,255,0.4)'},{offset:1,color:'rgba(64,158,255,0.02)'}]) }
    }]
  })
  window.addEventListener('resize', () => chart.resize())
}

const initCourseChart = () => {
  const chart = echarts.init(courseChartRef.value)
  chart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: '8%', right: '4%', top: '15%', bottom: '15%' },
    xAxis: { type: 'category', data: salesData.value.dates || [] },
    yAxis: { type: 'value' },
    series: [{
      name: '课程销售额',
      type: 'line',
      data: salesData.value.courseSales || [],
      smooth: true,
      itemStyle: { color: '#e6a23c' },
      areaStyle: { color: new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:'rgba(230,162,60,0.4)'},{offset:1,color:'rgba(230,162,60,0.02)'}]) }
    }]
  })
  window.addEventListener('resize', () => chart.resize())
}

onMounted(async () => {
  try {
    const [statsRes, salesRes] = await Promise.all([getDashboardStats(), getDashboardSales()])
    stats.value = statsRes.data || {}
    salesData.value = salesRes.data || {}
    setTimeout(() => { initShopChart(); initCourseChart() }, 100)
  } catch (e) {}
})
</script>
