<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:bold;font-size:16px;">优惠券管理</span>
        <el-button type="primary" @click="openDialog()">添加优惠券</el-button>
      </div>
    </template>
    <div style="display:flex;gap:10px;margin-bottom:12px;">
      <el-input v-model="keyword" placeholder="搜索优惠券" style="width:200px;" clearable />
      <el-button type="primary" @click="loadData">查询</el-button>
    </div>
    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="name" label="优惠券名称" min-width="140" />
      <el-table-column label="类型" width="90"><template #default="{row}"><el-tag size="small" :type="row.type==='课程券'?'':'warning'">{{row.type}}</el-tag></template></el-table-column>
      <el-table-column label="金额" width="90"><template #default="{row}">¥{{row.amount}}</template></el-table-column>
      <el-table-column label="最低消费" width="100"><template #default="{row}">¥{{row.minAmount}}</template></el-table-column>
      <el-table-column label="已领/总量" width="100" align="center"><template #default="{row}">{{row.used}}/{{row.total}}</template></el-table-column>
      <el-table-column label="状态" width="80" align="center"><template #default="{row}"><el-tag :type="row.status===1?'success':'info'" size="small">{{row.status===1?'进行中':'已结束'}}</el-tag></template></el-table-column>
      <el-table-column label="有效期" min-width="200"><template #default="{row}">{{row.startTime}} ~ {{row.endTime}}</template></el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{row}">
          <el-button size="small" type="primary" link @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top:12px;justify-content:flex-end;" background layout="total, prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="pageNum" @current-change="loadData" />
    <el-dialog v-model="dialogVisible" :title="editId?'编辑优惠券':'添加优惠券'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="类型"><el-select v-model="form.type"><el-option label="课程券" value="课程券" /><el-option label="商城券" value="商城券" /></el-select></el-form-item>
        <el-form-item label="金额"><el-input-number v-model="form.amount" :min="0" :precision="2" /></el-form-item>
        <el-form-item label="最低消费"><el-input-number v-model="form.minAmount" :min="0" :precision="2" /></el-form-item>
        <el-form-item label="发行量"><el-input-number v-model="form.total" :min="1" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary" @click="handleSave">确定</el-button></template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCoupons, addCoupon, updateCoupon, deleteCoupon } from '../../api'

const list=ref([]), loading=ref(false), keyword=ref(''), pageNum=ref(1), pageSize=ref(10), total=ref(0)
const dialogVisible=ref(false), editId=ref(null)
const form=reactive({name:'',type:'课程券',amount:0,minAmount:0,total:100})

const loadData=async()=>{loading.value=true;try{const r=await getCoupons({pageNum:pageNum.value,pageSize:pageSize.value,keyword:keyword.value});list.value=r.data.records;total.value=Number(r.data.total)}finally{loading.value=false}}
const openDialog=(row)=>{if(row){editId.value=row.id;Object.assign(form,row)}else{editId.value=null;Object.assign(form,{name:'',type:'课程券',amount:0,minAmount:0,total:100})}dialogVisible.value=true}
const handleSave=async()=>{if(editId.value)await updateCoupon(editId.value,form);else await addCoupon(form);ElMessage.success('保存成功');dialogVisible.value=false;loadData()}
const handleDelete=async(id)=>{await ElMessageBox.confirm('确定删除?','提示',{type:'warning'});await deleteCoupon(id);ElMessage.success('删除成功');loadData()}
onMounted(loadData)
</script>
