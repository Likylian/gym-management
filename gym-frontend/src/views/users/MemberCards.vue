<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:bold;font-size:16px;">会员卡管理</span>
        <el-button type="primary" @click="openDialog()">设置会员卡</el-button>
      </div>
    </template>
    <div style="display:flex;gap:10px;margin-bottom:12px;">
      <el-input v-model="keyword" placeholder="卡名/手机号" style="width:200px;" clearable />
      <el-select v-model="statusFilter" placeholder="全部状态" style="width:120px;" clearable>
        <el-option label="正常" :value="1" /><el-option label="停用" :value="0" />
      </el-select>
      <el-button type="primary" @click="loadData">查询</el-button>
    </div>
    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="cardName" label="会员卡" width="120" />
      <el-table-column prop="memberName" label="绑定会员" width="100" />
      <el-table-column prop="phone" label="手机号" width="130" />
      <el-table-column label="余额" min-width="120">
        <template #default="{row}">
          <span v-if="row.remainTimes">{{row.remainTimes}}次</span>
          <span v-if="row.balance"> / ¥{{row.balance}}</span>
          <span v-if="row.days"> / {{row.days}}天</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80" align="center">
        <template #default="{row}"><el-tag :type="row.status===1?'success':'danger'">{{row.status===1?'正常':'停用'}}</el-tag></template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{row}">
          <el-button size="small" type="primary" link>查看</el-button>
          <el-button size="small" type="success" link>续费</el-button>
          <el-button size="small" type="warning" link>扣费</el-button>
          <el-button size="small" type="danger" link>停用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top:12px;justify-content:flex-end;" background layout="total, prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="pageNum" @current-change="loadData" />
    <el-dialog v-model="dialogVisible" title="设置会员卡" width="480px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="卡名"><el-input v-model="form.cardName" /></el-form-item>
        <el-form-item label="卡类型"><el-select v-model="form.cardType"><el-option label="次卡" value="次卡" /><el-option label="期限卡" value="期限卡" /><el-option label="储值卡" value="储值卡" /></el-select></el-form-item>
        <el-form-item label="次数"><el-input-number v-model="form.times" :min="0" /></el-form-item>
        <el-form-item label="天数"><el-input-number v-model="form.days" :min="0" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary" @click="handleSave">确定</el-button></template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getMemberCards, addMemberCard } from '../../api'

const list=ref([]), loading=ref(false), keyword=ref(''), statusFilter=ref(null), pageNum=ref(1), pageSize=ref(10), total=ref(0)
const dialogVisible=ref(false)
const form=reactive({cardName:'',cardType:'次卡',times:0,days:0})

const loadData=async()=>{loading.value=true;try{const r=await getMemberCards({pageNum:pageNum.value,pageSize:pageSize.value,keyword:keyword.value,status:statusFilter.value});list.value=r.data.records;total.value=Number(r.data.total)}finally{loading.value=false}}
const openDialog=()=>{Object.assign(form,{cardName:'',cardType:'次卡',times:0,days:0});dialogVisible.value=true}
const handleSave=async()=>{await addMemberCard(form);ElMessage.success('保存成功');dialogVisible.value=false;loadData()}
onMounted(loadData)
</script>
