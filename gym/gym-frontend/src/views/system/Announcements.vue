<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:bold;">公告管理</span>
        <el-button type="primary" size="small">发布公告</el-button>
      </div>
    </template>
    <el-table :data="list" border stripe>
      <el-table-column prop="id" label="ID" width="70" />
      <el-table-column prop="title" label="公告标题" min-width="200" />
      <el-table-column prop="type" label="类型" width="100" />
      <el-table-column label="状态" width="80" align="center"><template #default="{row}"><el-tag :type="row.status?'success':'info'" size="small">{{row.status?'已发布':'草稿'}}</el-tag></template></el-table-column>
      <el-table-column prop="createTime" label="发布时间" width="160" />
      <el-table-column label="操作" width="140">
        <template #default><el-button size="small" type="primary" link>编辑</el-button><el-button size="small" type="danger" link>删除</el-button></template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script setup>
import { ref } from 'vue'
const list = ref([
  { id:1, title:'系统维护通知 - 2024年1月25日凌晨2:00-6:00', type:'系统通知', status:true, createTime:'2024-01-20 10:00:00' },
  { id:2, title:'春节期间课程调整通知', type:'课程通知', status:true, createTime:'2024-01-18 15:30:00' },
  { id:3, title:'新功能上线公告 - 积分商城', type:'活动公告', status:false, createTime:'2024-01-15 09:00:00' },
])
</script>
