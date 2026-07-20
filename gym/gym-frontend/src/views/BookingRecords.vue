<template>
  <el-card>
    <template #header><span style="font-weight:bold;font-size:16px;">预约记录管理</span></template>
    <div style="display:flex;gap:10px;margin-bottom:12px;">
      <el-input v-model="keyword" placeholder="课程/会员" style="width:180px;" clearable />
      <el-select v-model="statusFilter" placeholder="全部状态" style="width:120px;" clearable>
        <el-option label="未签到" value="未签到" /><el-option label="已签到" value="已签到" /><el-option label="已取消" value="已取消" />
      </el-select>
      <el-button type="primary" @click="loadData">查询</el-button>
    </div>
    <!-- 课程统计概览 -->
    <el-row :gutter="12" style="margin-bottom:16px;">
      <el-col :span="6" v-for="s in [{l:'已预约',v:bookedCount,c:'#409eff'},{l:'已签到',v:checkedCount,c:'#67c23a'},{l:'已取消',v:cancelCount,c:'#909399'},{l:'候补中',v:0,c:'#e6a23c'}]" :key="s.l">
        <el-card shadow="hover" :body-style="{padding:'12px',textAlign:'center'}">
          <div style="font-size:20px;font-weight:bold;" :style="{color:s.c}">{{s.v}}</div>
          <div style="font-size:12px;color:#999;margin-top:4px;">{{s.l}}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="courseName" label="预约课程" min-width="140" />
      <el-table-column prop="memberName" label="姓名" width="80" />
      <el-table-column prop="phone" label="电话" width="120" />
      <el-table-column prop="people" label="人数" width="60" align="center" />
      <el-table-column prop="courseTime" label="上课时间" width="110" />
      <el-table-column prop="memberCard" label="会员卡" width="120" />
      <el-table-column label="状态" width="90" align="center">
        <template #default="{row}"><el-tag :type="row.status==='已签到'?'success':row.status==='已取消'?'info':'warning'" size="small">{{row.status}}</el-tag></template>
      </el-table-column>
      <el-table-column label="预约时间" width="160"><template #default="{row}">{{row.bookingTime}}</template></el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{row}">
          <el-button v-if="row.status==='未签到'" size="small" type="success" link @click="handleCheckin(row.id)">签到</el-button>
          <el-button v-if="row.status!=='已取消'" size="small" type="danger" link @click="handleCancel(row.id)">取消预约</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top:12px;justify-content:flex-end;" background layout="total, prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="pageNum" @current-change="loadData" />
  </el-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBookings, checkinBooking, cancelBooking } from '../api'

const list=ref([]), loading=ref(false), keyword=ref(''), statusFilter=ref('')
const pageNum=ref(1), pageSize=ref(10), total=ref(0)

const bookedCount=computed(()=>list.value.filter(r=>r.status!=='已取消').length)
const checkedCount=computed(()=>list.value.filter(r=>r.status==='已签到').length)
const cancelCount=computed(()=>list.value.filter(r=>r.status==='已取消').length)

const loadData=async()=>{loading.value=true;try{const r=await getBookings({pageNum:pageNum.value,pageSize:pageSize.value,keyword:keyword.value,status:statusFilter.value});list.value=r.data.records;total.value=Number(r.data.total)}finally{loading.value=false}}
const handleCheckin=async(id)=>{await ElMessageBox.confirm('确认为该会员签到?','签到确认');await checkinBooking(id);ElMessage.success('签到成功');loadData()}
const handleCancel=async(id)=>{await ElMessageBox.confirm('确定取消该预约?','提示',{type:'warning'});await cancelBooking(id);ElMessage.success('已取消');loadData()}
onMounted(loadData)
</script>
