<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:bold;">广告管理</span>
        <el-button type="primary" size="small">添加广告</el-button>
      </div>
    </template>
    <el-table :data="ads" border stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column label="广告图片" width="120"><template #default><el-icon size="32" color="#ddd"><Picture /></el-icon></template></el-table-column>
      <el-table-column prop="title" label="广告标题" min-width="160" />
      <el-table-column prop="position" label="展示位置" width="120" />
      <el-table-column label="状态" width="80" align="center"><template #default="{row}"><el-tag :type="row.status?'success':'info'" size="small">{{row.status?'启用':'禁用'}}</el-tag></template></el-table-column>
      <el-table-column prop="sort" label="排序" width="70" align="center" />
      <el-table-column label="操作" width="140">
        <template #default><el-button size="small" type="primary" link>编辑</el-button><el-button size="small" type="danger" link>删除</el-button></template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script setup>
import { ref } from 'vue'
const ads = ref([
  { id:1, title:'新年促销活动', position:'首页轮播', status:true, sort:1 },
  { id:2, title:'私教课程优惠', position:'首页推荐', status:true, sort:2 },
  { id:3, title:'会员日特别活动', position:'弹窗广告', status:false, sort:3 },
])
</script>
