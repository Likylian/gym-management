<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:bold;">商品分类</span>
        <el-button type="primary" size="small">添加分类</el-button>
      </div>
    </template>
    <el-table :data="categories" border stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="count" label="商品数量" width="120" align="center" />
      <el-table-column prop="sort" label="排序" width="80" align="center" />
      <el-table-column label="操作" width="140">
        <template #default><el-button size="small" type="primary" link>编辑</el-button><el-button size="small" type="danger" link>删除</el-button></template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script setup>
import { ref } from 'vue'
const categories = ref([
  { id:1, name:'健身周边', count:6, sort:1 },
  { id:2, name:'食品', count:2, sort:2 },
])
</script>
