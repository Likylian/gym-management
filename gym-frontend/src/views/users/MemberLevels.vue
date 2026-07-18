<template>
  <el-card>
    <template #header><span style="font-weight:bold;">会员等级</span></template>
    <el-table :data="levels" border stripe>
      <el-table-column prop="name" label="等级名称" /><el-table-column prop="discount" label="折扣" /><el-table-column prop="points" label="积分倍率" /><el-table-column prop="desc" label="说明" />
    </el-table>
  </el-card>
</template>
<script setup>
import { ref } from 'vue'
const levels = ref([
  { name:'一般会员', discount:'无折扣', points:'1倍', desc:'普通会员' },
  { name:'VIP会员', discount:'9.5折', points:'1.5倍', desc:'消费满5000升级' },
  { name:'钻石会员', discount:'9折', points:'2倍', desc:'消费满20000升级' },
])
</script>
