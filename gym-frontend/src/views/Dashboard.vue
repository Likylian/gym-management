<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <div class="stat-grid">
      <div class="stat-card" v-for="card in statCards" :key="card.label" :style="{ '--accent': card.color }">
        <div class="stat-icon" :style="{ background: card.color + '18', color: card.color }">
          <el-icon :size="22"><component :is="card.icon" /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-label">{{ card.label }}</div>
          <div class="stat-value">{{ card.value }}</div>
        </div>
        <div class="stat-bar" :style="{ background: card.color }"></div>
      </div>
    </div>

    <!-- 今日课程 + 最新办卡 -->
    <el-row :gutter="20" class="info-row">
      <el-col :span="12">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <div class="card-header-left">
                <el-icon class="header-icon" color="#6366f1"><Reading /></el-icon>
                <span>今日团课</span>
              </div>
              <el-tag type="primary" effect="dark" round size="small">{{ stats.totalGroupCourses || 0 }} 节</el-tag>
            </div>
          </template>
          <div class="course-list" v-if="(stats.todaySchedule || []).length">
            <div class="course-item" v-for="(item, idx) in (stats.todaySchedule || []).slice(0, 6)" :key="idx">
              <div class="course-time">{{ item.time }}</div>
              <div class="course-name">{{ item.course }}</div>
              <div class="course-coach">{{ item.coach }}</div>
            </div>
          </div>
          <el-empty v-else description="暂无课程" :image-size="60" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <div class="card-header-left">
                <el-icon class="header-icon" color="#f59e0b"><CreditCard /></el-icon>
                <span>最新办卡</span>
              </div>
              <el-tag type="warning" effect="dark" round size="small">{{ stats.totalMemberCards || 0 }} 张</el-tag>
            </div>
          </template>
          <div class="course-list" v-if="(stats.latestCards || []).length">
            <div class="course-item" v-for="(item, idx) in (stats.latestCards || [])" :key="idx">
              <div class="course-time card-name">{{ item.cardName }}</div>
              <div class="course-name">{{ item.memberName }}</div>
              <div class="course-coach">{{ item.createTime }}</div>
            </div>
          </div>
          <el-empty v-else description="暂无办卡记录" :image-size="60" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <div class="card-header-left">
                <el-icon class="header-icon" color="#6366f1"><TrendCharts /></el-icon>
                <span>商城销售统计</span>
              </div>
              <el-radio-group v-model="salesPeriod" size="small">
                <el-radio-button label="本周" />
                <el-radio-button label="本月" />
              </el-radio-group>
            </div>
          </template>
          <div ref="shopChartRef" class="chart-box"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <div class="card-header-left">
                <el-icon class="header-icon" color="#10b981"><TrendCharts /></el-icon>
                <span>课程销售统计</span>
              </div>
              <el-radio-group v-model="coursePeriod" size="small">
                <el-radio-button label="本周" />
                <el-radio-button label="本月" />
              </el-radio-group>
            </div>
          </template>
          <div ref="courseChartRef" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getDashboardStats, getDashboardSales } from '../api'

const stats = ref({})
const salesData = ref({})
const salesPeriod = ref('本周')
const coursePeriod = ref('本周')
const shopChartRef = ref()
const courseChartRef = ref()

const statCards = computed(() => [
  { label: '今日应收', value: `¥${(stats.value.todayRevenue || 0).toLocaleString()}`, color: '#6366f1', icon: 'Money' },
  { label: '昨日应收', value: `¥${(stats.value.yesterdayRevenue || 0).toLocaleString()}`, color: '#8b5cf6', icon: 'Wallet' },
  { label: '今日新增会员', value: `${stats.value.todayNewMembers || 0} 人`, color: '#10b981', icon: 'UserFilled' },
  { label: '昨日新增会员', value: `${stats.value.yesterdayNewMembers || 0} 人`, color: '#06b6d4', icon: 'User' },
  { label: '累积会员', value: `${stats.value.totalMembers || 0} 人`, color: '#f59e0b', icon: 'Avatar' },
  { label: '今日上课', value: `${stats.value.todayCourses || 0} 节`, color: '#ef4444', icon: 'DataLine' },
])

const makeChartOption = (data, name, color) => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#fff',
    borderColor: '#e2e8f0',
    textStyle: { color: '#334155', fontSize: 13 },
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  grid: { left: '3%', right: '4%', top: '10%', bottom: '10%', containLabel: true },
  xAxis: {
    type: 'category',
    data: data.dates || [],
    axisLine: { lineStyle: { color: '#e2e8f0' } },
    axisTick: { show: false },
    axisLabel: { color: '#94a3b8', fontSize: 12 },
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
    axisLabel: { color: '#94a3b8', fontSize: 12 },
  },
  series: [{
    name,
    type: 'line',
    data: data.shopSales || data.courseSales || [],
    smooth: true,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: { color, width: 3 },
    itemStyle: { color },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: color + '30' },
        { offset: 1, color: color + '02' },
      ]),
    },
  }],
})

const initCharts = () => {
  if (shopChartRef.value) {
    const shopChart = echarts.init(shopChartRef.value)
    shopChart.setOption(makeChartOption(salesData.value, '商城销售额', '#6366f1'))
    window.addEventListener('resize', () => shopChart.resize())
  }
  if (courseChartRef.value) {
    const courseChart = echarts.init(courseChartRef.value)
    courseChart.setOption(makeChartOption(salesData.value, '课程销售额', '#10b981'))
    window.addEventListener('resize', () => courseChart.resize())
  }
}

onMounted(async () => {
  try {
    const [statsRes, salesRes] = await Promise.all([getDashboardStats(), getDashboardSales()])
    stats.value = statsRes.data || {}
    salesData.value = salesRes.data || {}
    setTimeout(initCharts, 100)
  } catch (e) {}
})
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
}

/* 统计卡片网格 */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  padding: 20px;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition);
  display: flex;
  align-items: center;
  gap: 14px;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent);
}

.stat-icon {
  width: 46px;
  height: 46px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
}

.stat-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  opacity: 0;
  transition: opacity var(--transition);
}

.stat-card:hover .stat-bar {
  opacity: 1;
}

/* 信息行 */
.info-row {
  margin-bottom: 20px;
}

.info-card {
  height: 100%;
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
  color: var(--color-text);
}

.header-icon {
  font-size: 18px;
}

/* 课程/办卡列表 */
.course-list {
  display: flex;
  flex-direction: column;
}

.course-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
  transition: background var(--transition);
}

.course-item:last-child {
  border-bottom: none;
}

.course-item:hover {
  background: var(--color-bg);
  margin: 0 -20px;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
}

.course-item:hover:last-child {
  border-bottom: none;
}

.course-time {
  width: 70px;
  color: var(--color-primary);
  font-weight: 600;
  font-size: 13px;
}

.card-name {
  color: var(--color-warning) !important;
}

.course-name {
  flex: 1;
  font-size: 14px;
  color: var(--color-text);
}

.course-coach {
  color: var(--color-text-secondary);
  font-size: 13px;
}

/* 图表 */
.chart-box {
  height: 300px;
}

/* 响应式 */
@media (max-width: 1200px) {
  .stat-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
