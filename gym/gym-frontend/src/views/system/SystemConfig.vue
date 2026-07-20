<template>
  <el-card>
    <template #header><span style="font-weight:bold;font-size:16px;">系统配置</span></template>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基础配置" name="basic">
        <el-form label-width="140px" style="max-width:600px;margin-top:16px;">
          <el-form-item label="系统名称"><el-input v-model="config.systemName" /></el-form-item>
          <el-form-item label="系统Logo"><el-upload action="#"><el-button type="primary" size="small">上传Logo</el-button></el-upload></el-form-item>
          <el-form-item label="客服电话"><el-input v-model="config.phone" /></el-form-item>
          <el-form-item label="公司地址"><el-input v-model="config.address" /></el-form-item>
          <el-form-item label="版权信息"><el-input v-model="config.copyright" /></el-form-item>
          <el-form-item><el-button type="primary" @click="handleSave">保存配置</el-button></el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="预约配置" name="booking">
        <el-form label-width="140px" style="max-width:600px;margin-top:16px;">
          <el-form-item label="预约提前时间(分)"><el-input-number v-model="bookingConfig.advanceTime" :min="0" /></el-form-item>
          <el-form-item label="取消预约时间(分)"><el-input-number v-model="bookingConfig.cancelTime" :min="0" /></el-form-item>
          <el-form-item label="最大预约人数"><el-input-number v-model="bookingConfig.maxPeople" :min="1" /></el-form-item>
          <el-form-item label="开启候补功能"><el-switch v-model="bookingConfig.enableWaitlist" /></el-form-item>
          <el-form-item><el-button type="primary" @click="handleSave">保存配置</el-button></el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="积分配置" name="points">
        <el-form label-width="140px" style="max-width:600px;margin-top:16px;">
          <el-form-item label="消费返积分比例"><el-input-number v-model="pointsConfig.ratio" :min="1" />%</el-form-item>
          <el-form-item label="积分兑换比例"><el-input-number v-model="pointsConfig.exchangeRate" :min="1" />积分=1元</el-form-item>
          <el-form-item label="开启积分返现"><el-switch v-model="pointsConfig.enableCashback" /></el-form-item>
          <el-form-item><el-button type="primary" @click="handleSave">保存配置</el-button></el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('basic')
const config = reactive({ systemName:'健身管理系统', phone:'400-888-8888', address:'福州市鼓楼区', copyright:'Copyright © 2024 健身房管理系统' })
const bookingConfig = reactive({ advanceTime:30, cancelTime:60, maxPeople:100, enableWaitlist:true })
const pointsConfig = reactive({ ratio:10, exchangeRate:100, enableCashback:true })

const handleSave = () => ElMessage.success('配置保存成功')
</script>
