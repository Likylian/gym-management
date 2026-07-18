<template>
  <div class="login-wrapper">
    <!-- 装饰背景 -->
    <div class="login-bg">
      <div class="bg-shape bg-shape-1"></div>
      <div class="bg-shape bg-shape-2"></div>
      <div class="bg-shape bg-shape-3"></div>
    </div>

    <div class="login-container">
      <!-- 左侧品牌区 -->
      <div class="login-brand">
        <div class="brand-icon">🏋️</div>
        <h1 class="brand-title">GYM PRO</h1>
        <p class="brand-desc">专业健身管理系统</p>
        <div class="brand-features">
          <div class="feature-item">
            <span class="feature-dot"></span>智能预约管理
          </div>
          <div class="feature-item">
            <span class="feature-dot"></span>会员数据追踪
          </div>
          <div class="feature-item">
            <span class="feature-dot"></span>课程灵活排期
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-form-box">
        <h2 class="form-title">管理员登录</h2>
        <p class="form-subtitle">欢迎回来，请登录您的账户</p>

        <el-form :model="form" :rules="rules" ref="formRef" @submit.prevent="handleLogin">
          <el-form-item prop="username">
            <el-input 
              v-model="form.username" 
              placeholder="请输入用户名" 
              size="large"
              :prefix-icon="User"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input 
              v-model="form.password" 
              placeholder="请输入密码" 
              type="password" 
              show-password 
              size="large"
              :prefix-icon="Lock"
            />
          </el-form-item>

          <el-form-item prop="captcha">
            <div class="captcha-row">
              <el-input 
                v-model="form.captcha" 
                placeholder="验证码" 
                size="large"
                :prefix-icon="Key"
              />
              <div class="captcha-box" @click="refreshCaptcha">
                {{ captchaText }}
              </div>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="large" class="login-btn" :loading="loading" @click="handleLogin">
              立即登录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="form-footer">© 2024 Gym Pro · 健身房管理系统</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Key } from '@element-plus/icons-vue'
import { login } from '../api'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)

const captchaText = ref('AB3C9K')
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
    // handled by interceptor
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  position: relative;
  overflow: hidden;
}

/* 装饰背景 */
.login-bg {
  position: absolute;
  inset: 0;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.08;
  filter: blur(80px);
}

.bg-shape-1 {
  width: 500px;
  height: 500px;
  background: var(--color-primary);
  top: -150px;
  right: -100px;
  animation: float 8s ease-in-out infinite;
}

.bg-shape-2 {
  width: 400px;
  height: 400px;
  background: var(--color-warning);
  bottom: -100px;
  left: -100px;
  animation: float 10s ease-in-out infinite reverse;
}

.bg-shape-3 {
  width: 300px;
  height: 300px;
  background: var(--color-danger);
  top: 50%;
  left: 30%;
  animation: float 12s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

/* 登录卡片 */
.login-container {
  display: flex;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  max-width: 880px;
  width: 90%;
  position: relative;
  z-index: 1;
}

/* 左侧品牌 */
.login-brand {
  flex: 1;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(79, 70, 229, 0.5));
  padding: 60px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.brand-icon {
  font-size: 56px;
  margin-bottom: 16px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}

.brand-title {
  font-size: 32px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 4px;
  margin-bottom: 8px;
}

.brand-desc {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 36px;
  letter-spacing: 2px;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.feature-item {
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.feature-dot {
  width: 6px;
  height: 6px;
  background: var(--color-success);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--color-success);
}

/* 右侧表单 */
.login-form-box {
  flex: 1;
  padding: 48px 44px;
  background: rgba(255, 255, 255, 0.97);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-title {
  font-size: 26px;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 4px;
}

.form-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
}

.captcha-row {
  display: flex;
  gap: 12px;
  width: 100%;
}

.captcha-row .el-input {
  flex: 1;
}

.captcha-box {
  height: 40px;
  padding: 0 18px;
  background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 4px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  transition: all var(--transition);
  flex-shrink: 0;
}

.captcha-box:hover {
  filter: brightness(1.1);
  transform: scale(1.02);
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--color-primary), #8b5cf6) !important;
  border: none !important;
}

.login-btn:hover {
  background: linear-gradient(135deg, var(--color-primary-light), #a78bfa) !important;
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

.form-footer {
  text-align: center;
  color: var(--color-text-placeholder);
  font-size: 12px;
  margin-top: 8px;
}

/* 响应式 */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    max-width: 400px;
  }
  .login-brand {
    padding: 36px 32px;
  }
  .login-form-box {
    padding: 32px;
  }
  .brand-title {
    font-size: 24px;
  }
}
</style>
