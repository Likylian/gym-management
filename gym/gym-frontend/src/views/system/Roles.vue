<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:bold;font-size:16px;">角色管理</span>
        <el-button type="primary" @click="openDialog()">添加角色</el-button>
      </div>
    </template>
    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="name" label="角色名称" width="140" />
      <el-table-column prop="code" label="角色编码" width="140" />
      <el-table-column prop="description" label="描述" min-width="200" />
      <el-table-column label="状态" width="80" align="center"><template #default="{row}"><el-tag :type="row.status===1?'success':'info'" size="small">{{row.status===1?'启用':'禁用'}}</el-tag></template></el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{row}">
          <el-button size="small" type="primary" link @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog v-model="dialogVisible" :title="editId?'编辑角色':'添加角色'" width="460px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="编码"><el-input v-model="form.code" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="form.description" type="textarea" /></el-form-item>
        <el-form-item label="状态"><el-switch v-model="form.status" :active-value="1" :inactive-value="0" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary" @click="handleSave">确定</el-button></template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getRoles, addRole, updateRole, deleteRole } from '../../api'

const list=ref([]), loading=ref(false)
const dialogVisible=ref(false), editId=ref(null)
const form=reactive({name:'',code:'',description:'',status:1})

const loadData=async()=>{loading.value=true;try{const r=await getRoles({pageNum:1,pageSize:50});list.value=r.data.records}catch(e){}finally{loading.value=false}}
const openDialog=(row)=>{if(row){editId.value=row.id;Object.assign(form,row)}else{editId.value=null;Object.assign(form,{name:'',code:'',description:'',status:1})}dialogVisible.value=true}
const handleSave=async()=>{if(editId.value)await updateRole(editId.value,form);else await addRole(form);ElMessage.success('保存成功');dialogVisible.value=false;loadData()}
const handleDelete=async(id)=>{await ElMessageBox.confirm('确定删除?','提示',{type:'warning'});await deleteRole(id);ElMessage.success('删除成功');loadData()}
onMounted(loadData)
</script>
