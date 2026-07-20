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
      <el-table-column label="权益" min-width="140">
        <template #default="{row}">
          <span v-if="row.cardType === '次卡'">{{ row.remainTimes ?? row.times ?? 0 }}次</span>
          <span v-else-if="row.cardType === '期限卡'">{{ row.days ?? 0 }}天</span>
          <span v-else-if="row.cardType === '储值卡'">¥{{ row.balance ?? 0 }}</span>
          <span v-else>¥{{ row.balance ?? 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80" align="center">
        <template #default="{row}"><el-tag :type="row.status===1?'success':'danger'">{{row.status===1?'正常':'停用'}}</el-tag></template>
      </el-table-column>
      <el-table-column label="操作" width="260" fixed="right">
        <template #default="{row}">
          <el-button size="small" type="primary" link @click="openDetail(row)">查看</el-button>
          <el-button size="small" type="info" link @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="success" link @click="openOperation(row, 'renew')">续费</el-button>
          <el-button size="small" type="warning" link @click="openOperation(row, 'deduct')">扣费</el-button>
          <el-button size="small" type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination style="margin-top:12px;justify-content:flex-end;" background layout="total, prev, pager, next" :total="total" :page-size="pageSize" v-model:current-page="pageNum" @current-change="loadData" />
    <el-dialog v-model="dialogVisible" title="设置会员卡" width="480px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="卡名"><el-input v-model="form.cardName" /></el-form-item>
        <el-form-item label="卡类型">
          <el-select v-model="form.cardType" placeholder="请选择卡类型">
            <el-option label="次卡" value="次卡" />
            <el-option label="期限卡" value="期限卡" />
            <el-option label="储值卡" value="储值卡" />
          </el-select>
        </el-form-item>
        <el-form-item :label="cardValueLabel">
          <el-input-number v-model="cardValue" :min="0" :step="form.cardType === '储值卡' ? 0.01 : 1" controls-position="right" />
        </el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary" @click="handleSave">确定</el-button></template>
    </el-dialog>
    <el-dialog v-model="detailDialogVisible" title="会员卡详情" width="420px">
      <div style="line-height:28px; padding: 8px 0;">
        <div><strong>卡名：</strong>{{ selectedCard.cardName }}</div>
        <div><strong>绑定会员：</strong>{{ selectedCard.memberName }}</div>
        <div><strong>手机号：</strong>{{ selectedCard.phone }}</div>
        <div><strong>{{ selectedCard.cardType === '次卡' ? '次数' : selectedCard.cardType === '期限卡' ? '天数' : '余额' }}：</strong>
          <span v-if="selectedCard.cardType === '次卡'">{{ selectedCard.remainTimes ?? selectedCard.times ?? 0 }}次</span>
          <span v-else-if="selectedCard.cardType === '期限卡'">{{ selectedCard.days ?? 0 }}天</span>
          <span v-else>¥{{ selectedCard.balance ?? 0 }}</span>
        </div>
        <div><strong>状态：</strong><el-tag :type="selectedCard.status===1?'success':'danger'">{{ selectedCard.status===1?'正常':'停用' }}</el-tag></div>
      </div>
      <template #footer><el-button @click="detailDialogVisible=false">关闭</el-button></template>
    </el-dialog>
    <el-dialog v-model="operationDialogVisible" :title="operationType==='renew' ? '续费会员卡' : '扣费会员卡'" width="420px">
      <el-form :model="operationForm" label-width="90px">
        <el-form-item label="会员卡">
          <span>{{ selectedCard.cardName }}（{{ selectedCard.cardType }}）</span>
        </el-form-item>
        <el-form-item label="数量/金额"><el-input-number v-model="operationForm.amount" :min="1" /></el-form-item>
        <el-form-item label="说明"><el-input v-model="operationForm.note" placeholder="可选" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="operationDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="handleOperation">确定</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMemberCards, addMemberCard, updateMemberCard, deleteMemberCard } from '../../api'

const list = ref([])
const loading = ref(false)
const keyword = ref('')
const statusFilter = ref(null)
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

const dialogVisible = ref(false)
const detailDialogVisible = ref(false)
const operationDialogVisible = ref(false)
const editId = ref(null)
const operationType = ref('')
const selectedCard = reactive({ id: null, cardName:'', cardType:'', memberName:'', phone:'', remainTimes:0, balance:0, days:0, status:1 })
const operationForm = reactive({ amount: 0, note: '' })
const form = reactive({ cardName:'', cardType:'次卡', times:0, days:0, balance:0 })

const cardValueLabel = computed(() => {
  if (form.cardType === '次卡') return '次数'
  if (form.cardType === '期限卡') return '天数'
  return '余额'
})

const cardValue = computed({
  get() {
    if (form.cardType === '次卡') return form.times
    if (form.cardType === '期限卡') return form.days
    return form.balance
  },
  set(value) {
    form.times = 0
    form.days = 0
    form.balance = 0
    if (form.cardType === '次卡') form.times = value
    else if (form.cardType === '期限卡') form.days = value
    else form.balance = value
  }
})

const loadData = async () => {
  loading.value = true
  try {
    const r = await getMemberCards({ pageNum: pageNum.value, pageSize: pageSize.value, keyword: keyword.value, status: statusFilter.value })
    list.value = r.data.records
    total.value = Number(r.data.total)
  } finally {
    loading.value = false
  }
}

const openDialog = (row = null) => {
  if (row) {
    editId.value = row.id
    Object.assign(form, {
      cardName: row.cardName,
      cardType: row.cardType || '次卡',
      times: row.remainTimes ?? row.times ?? 0,
      days: row.days ?? 0,
      balance: row.balance ?? 0
    })
  } else {
    editId.value = null
    Object.assign(form, { cardName:'', cardType:'次卡', times:0, days:0, balance:0 })
  }
  dialogVisible.value = true
}

const handleSave = async () => {
  const payload = {
    cardName: form.cardName,
    cardType: form.cardType,
    remainTimes: form.cardType === '次卡' ? form.times : 0,
    times: form.cardType === '次卡' ? form.times : 0,
    days: form.cardType === '期限卡' ? form.days : 0,
    balance: form.cardType === '储值卡' ? form.balance : 0
  }

  if (editId.value) {
    await updateMemberCard(editId.value, payload)
    ElMessage.success('更新成功')
  } else {
    await addMemberCard(payload)
    ElMessage.success('保存成功')
  }
  dialogVisible.value = false
  editId.value = null
  loadData()
}

const openDetail = (row) => {
  Object.assign(selectedCard, row)
  detailDialogVisible.value = true
}

const openOperation = (row, type) => {
  Object.assign(selectedCard, row)
  operationType.value = type
  operationForm.amount = 0
  operationForm.note = ''
  operationDialogVisible.value = true
}

const handleDisable = async (row) => {
  if (row.status !== 1) {
    ElMessage.info('当前会员卡已停用')
    return
  }
  await ElMessageBox.confirm('确定停用该会员卡吗？', '提示', { type: 'warning' })
  await updateMemberCard(row.id, { status: 0 })
  ElMessage.success('已停用')
  loadData()
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定删除该会员卡吗？', '提示', { type: 'warning' })
  await deleteMemberCard(row.id)
  ElMessage.success('删除成功')
  loadData()
}

const handleOperation = async () => {
  if (!operationForm.amount || operationForm.amount <= 0) {
    ElMessage.warning('请输入有效数量')
    return
  }

  const data = {}
  if (operationType.value === 'renew') {
    if (selectedCard.cardType === '次卡') {
      data.remainTimes = (selectedCard.remainTimes || 0) + operationForm.amount
    } else if (selectedCard.cardType === '期限卡') {
      data.days = (selectedCard.days || 0) + operationForm.amount
    } else {
      data.balance = (selectedCard.balance || 0) + operationForm.amount
    }
  } else {
    if (selectedCard.cardType === '次卡') {
      data.remainTimes = Math.max((selectedCard.remainTimes || 0) - operationForm.amount, 0)
    } else if (selectedCard.cardType === '期限卡') {
      data.days = Math.max((selectedCard.days || 0) - operationForm.amount, 0)
    } else {
      data.balance = Math.max((selectedCard.balance || 0) - operationForm.amount, 0)
    }
  }

  await updateMemberCard(selectedCard.id, data)
  ElMessage.success(operationType.value === 'renew' ? '续费成功' : '扣费成功')
  operationDialogVisible.value = false
  loadData()
}

onMounted(loadData)
</script>
