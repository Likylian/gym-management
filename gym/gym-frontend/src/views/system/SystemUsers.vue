<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:bold;font-size:16px;">成员管理</span>
        <el-button type="primary" @click="openDialog()">添加成员</el-button>
      </div>
    </template>
    <div style="display:flex;gap:10px;margin-bottom:12px;">
      <el-input v-model="keyword" placeholder="用户名/昵称" style="width:200px;" clearable />
      <el-button type="primary" @click="loadData">查询</el-button>
    </div>
    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="nickname" label="昵称" width="100" />
      <el-table-column prop="phone" label="电话" width="130" />
      <el-table-column prop="email" label="邮箱" min-width="160" />
      <el-table-column prop="roleName" label="角色" width="100" />
      <el-table-column label="状态" width="80" align="center"><template #default="{row}"><el-tag :type="row.status===1?'success':'info'" size="small">{{row.status===1?'启用':'禁用'}}</el-tag></template></el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{row}">
          <el-button size="small" type="primary" link @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top:12px;justify-content:flex-end;" background layout="total, prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="pageNum" @current-change="loadData" />
    <el-dialog v-model="dialogVisible" :title="editId?'编辑成员':'添加成员'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名"><el-input v-model="form.username" /></el-form-item>
        <el-form-item label="昵称"><el-input v-model="form.nickname" /></el-form-item>
        <el-form-item label="电话"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
        <el-form-item label="角色"><el-select v-model="form.roleName"><el-option v-for="r in roles" :key="r.id" :label="r.name" :value="r.name" /></el-select></el-form-item>
        <el-form-item label="状态"><el-switch v-model="form.status" :active-value="1" :inactive-value="0" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary" @click="handleSave">确定</el-button></template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSystemUsers, addSystemUser, updateSystemUser, deleteSystemUser, getAllRoles } from '../../api'

const list=ref([]), loading=ref(false), keyword=ref(''), pageNum=ref(1), pageSize=ref(10), total=ref(0), roles=ref([])
const dialogVisible=ref(false), editId=ref(null)
const form=reactive({username:'',nickname:'',phone:'',email:'',roleName:'',status:1})

const loadData=async()=>{loading.value=true;try{const r=await getSystemUsers({pageNum:pageNum.value,pageSize:pageSize.value,keyword:keyword.value});list.value=r.data.records;total.value=Number(r.data.total)}finally{loading.value=false}}
const openDialog=async(row)=>{if(row){editId.value=row.id;Object.assign(form,row)}else{editId.value=null;Object.assign(form,{username:'',nickname:'',phone:'',email:'',roleName:'',status:1})}dialogVisible.value=true;try{const r=await getAllRoles();roles.value=r.data}catch(e){}}
const handleSave=async()=>{if(editId.value)await updateSystemUser(editId.value,form);else await addSystemUser(form);ElMessage.success('保存成功');dialogVisible.value=false;loadData()}
const handleDelete=async(id)=>{await ElMessageBox.confirm('确定删除?','提示',{type:'warning'});await deleteSystemUser(id);ElMessage.success('删除成功');loadData()}
onMounted(loadData)
</script>
