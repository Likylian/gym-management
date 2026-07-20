<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">健身管理系统</h2>
      <p class="login-subtitle">PC管理端登录</p>
      <el-form :model="form" :rules="rules" ref="formRef" @submit.prevent="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="form.username" prefix-icon="User" placeholder="用户名" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" prefix-icon="Lock" placeholder="登录密码" type="password" show-password size="large" />
        </el-form-item>
        <el-form-item prop="captcha">
          <div style="display:flex;gap:10px;width:100%">
            <el-input v-model="form.captcha" prefix-icon="Key" placeholder="验证码" size="large" style="flex:1" />
            <div class="captcha-img" @click="refreshCaptcha">{{ captchaText }}</div>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" style="width:100%" :loading="loading" @click="handleLogin">登 录</el-button>
        </el-form-item>
      </el-form>
      <div class="login-footer">Copyright &copy; 2024 健身房管理系统 All Rights Reserved.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '../api'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)

const captchaText = ref('ABC123')
const refreshCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  captchaText.value = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

const form = reactive({ username: 'admin', password: 'admin123', captcha: '' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

const handleLogin = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  loading.value = true
  try {
    const res = await login({ username: form.username, password: form.password })
    userStore.setLoginInfo(res.data)
    ElMessage.success('登录成功')
    router.push('/')
  } catch (e) {
    // error handled by interceptor
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%);
}
.login-box {
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}
.login-title {
  text-align: center;
  color: #1a2a6c;
  font-size: 24px;
  margin-bottom: 4px;
}
.login-subtitle {
  text-align: center;
  color: #999;
  font-size: 13px;
  margin-bottom: 28px;
}
.captcha-img {
  height: 40px;
  padding: 0 16px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 3px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
.login-footer {
  text-align: center;
  color: #aaa;
  font-size: 12px;
  margin-top: 20px;
}
</style>
