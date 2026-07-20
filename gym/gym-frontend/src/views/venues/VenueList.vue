<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:bold;font-size:16px;">场馆管理</span>
        <el-button type="primary" @click="openDialog()">添加场馆</el-button>
      </div>
    </template>
    <div style="display:flex;gap:10px;margin-bottom:12px;">
      <el-input v-model="keyword" placeholder="搜索关键词" style="width:200px;" clearable @keyup.enter="loadData" />
      <el-button type="primary" @click="loadData">查询</el-button>
    </div>
    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="name" label="场馆名称" min-width="120" />
      <el-table-column prop="phone" label="电话" width="130" />
      <el-table-column prop="address" label="地址" min-width="180" />
      <el-table-column prop="email" label="邮箱" width="160" />
      <el-table-column prop="sort" label="排序" width="70" align="center" />
      <el-table-column label="状态" width="80" align="center">
        <template #default="{ row }"><el-tag :type="row.status===1?'success':'info'">{{ row.status===1?'正常':'关闭' }}</el-tag></template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="primary" link @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top:12px;justify-content:flex-end;" background layout="total, prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="pageNum" @current-change="loadData" />
    <el-dialog v-model="dialogVisible" :title="editId?'编辑场馆':'添加场馆'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="场馆名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="电话"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="地址"><el-input v-model="form.address" /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
        <el-form-item label="排序"><el-input-number v-model="form.sort" :min="0" /></el-form-item>
        <el-form-item label="状态"><el-switch v-model="form.status" :active-value="1" :inactive-value="0" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getVenues, addVenue, updateVenue, deleteVenue } from '../../api'

const list=ref([]), loading=ref(false), keyword=ref(''), pageNum=ref(1), pageSize=ref(10), total=ref(0)
const dialogVisible=ref(false), editId=ref(null)
const form=reactive({name:'',phone:'',address:'',email:'',sort:0,status:1})

const loadData=async()=>{loading.value=true;try{const r=await getVenues({pageNum:pageNum.value,pageSize:pageSize.value,keyword:keyword.value});list.value=r.data.records;total.value=Number(r.data.total)}finally{loading.value=false}}
const openDialog=(row)=>{if(row){editId.value=row.id;Object.assign(form,row)}else{editId.value=null;Object.assign(form,{name:'',phone:'',address:'',email:'',sort:0,status:1})}dialogVisible.value=true}
const handleSave=async()=>{if(editId.value)await updateVenue(editId.value,form);else await addVenue(form);ElMessage.success('保存成功');dialogVisible.value=false;loadData()}
const handleDelete=async(id)=>{await ElMessageBox.confirm('确定删除?','提示',{type:'warning'});await deleteVenue(id);ElMessage.success('删除成功');loadData()}
onMounted(loadData)
</script>
