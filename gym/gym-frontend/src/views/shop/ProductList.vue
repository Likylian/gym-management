<template>
  <el-card>
    <template #header>
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-weight:bold;font-size:16px;">商品管理</span>
        <el-button type="primary" @click="openDialog()">添加商品</el-button>
      </div>
    </template>
    <div style="display:flex;gap:16px;margin-bottom:12px;align-items:center;">
      <el-radio-group v-model="statusTab" @change="loadData" size="small">
        <el-radio-button label="">全部商品({{stats.total||0}})</el-radio-button>
        <el-radio-button label="1">已上线({{stats.online||0}})</el-radio-button>
        <el-radio-button label="0">未上线({{stats.offline||0}})</el-radio-button>
      </el-radio-group>
      <div style="flex:1" />
      <el-input v-model="keyword" placeholder="商品名称" style="width:180px;" clearable />
      <el-select v-model="category" placeholder="商品分类" style="width:120px;" clearable>
        <el-option label="健身周边" value="健身周边" /><el-option label="食品" value="食品" />
      </el-select>
      <el-button type="primary" @click="loadData">查询</el-button>
    </div>
    <el-table :data="list" border stripe v-loading="loading" @selection-change="sel=>selected=sel">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="id" label="编号" width="70" />
      <el-table-column label="商品图片" width="90"><template #default><el-icon size="32" color="#ddd"><Picture /></el-icon></template></el-table-column>
      <el-table-column prop="name" label="商品名称" min-width="160" />
      <el-table-column label="价格" width="100"><template #default="{row}">¥{{row.price}}</template></el-table-column>
      <el-table-column label="上线" width="80" align="center"><template #default="{row}"><el-tag :type="row.status===1?'success':'info'" size="small">{{row.status===1?'已上线':'下架'}}</el-tag></template></el-table-column>
      <el-table-column prop="tags" label="标签" width="120" />
      <el-table-column prop="sales" label="销量" width="80" align="center" />
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{row}">
          <el-button size="small" type="primary" link @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display:flex;justify-content:space-between;margin-top:12px;">
      <el-button size="small" :disabled="!selected.length">批量操作</el-button>
      <el-pagination background layout="total, prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="pageNum" @current-change="loadData" />
    </div>
    <el-dialog v-model="dialogVisible" :title="editId?'编辑商品':'添加商品'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="商品名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="价格"><el-input-number v-model="form.price" :min="0" :precision="2" /></el-form-item>
        <el-form-item label="分类"><el-select v-model="form.category"><el-option label="健身周边" value="健身周边" /><el-option label="食品" value="食品" /></el-select></el-form-item>
        <el-form-item label="库存"><el-input-number v-model="form.stock" :min="0" /></el-form-item>
        <el-form-item label="标签"><el-input v-model="form.tags" /></el-form-item>
        <el-form-item label="状态"><el-switch v-model="form.status" :active-value="1" :inactive-value="0" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary" @click="handleSave">确定</el-button></template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProducts, getProductStats, addProduct, updateProduct, deleteProduct } from '../../api'

const list=ref([]), loading=ref(false), keyword=ref(''), category=ref(''), statusTab=ref('')
const pageNum=ref(1), pageSize=ref(10), total=ref(0), stats=ref({}), selected=ref([])
const dialogVisible=ref(false), editId=ref(null)
const form=reactive({name:'',price:0,category:'健身周边',stock:0,tags:'',status:1})

const loadData=async()=>{loading.value=true;try{const r=await getProducts({pageNum:pageNum.value,pageSize:pageSize.value,keyword:keyword.value,category:category.value,status:statusTab.value||undefined});list.value=r.data.records;total.value=Number(r.data.total);const s=await getProductStats();stats.value=s.data}catch(e){}finally{loading.value=false}}
const openDialog=(row)=>{if(row){editId.value=row.id;Object.assign(form,row)}else{editId.value=null;Object.assign(form,{name:'',price:0,category:'健身周边',stock:0,tags:'',status:1})}dialogVisible.value=true}
const handleSave=async()=>{if(editId.value)await updateProduct(editId.value,form);else await addProduct(form);ElMessage.success('保存成功');dialogVisible.value=false;loadData()}
const handleDelete=async(id)=>{await ElMessageBox.confirm('确定删除?','提示',{type:'warning'});await deleteProduct(id);ElMessage.success('删除成功');loadData()}
onMounted(loadData)
</script>
