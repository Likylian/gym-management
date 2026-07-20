<template>
  <el-container style="height:100vh">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" style="transition: width 0.3s; background:#1d2b45;">
      <div class="logo-area">
        <span v-show="!isCollapse" class="logo-text">健身房管理</span>
        <span v-show="isCollapse" class="logo-text-sm">Gym</span>
      </div>
      <el-menu
        :default-active="$route.path"
        :collapse="isCollapse"
        background-color="#1d2b45"
        text-color="#b0bec5"
        active-text-color="#409eff"
        router
        :collapse-transition="false"
      >
        <el-menu-item index="/dashboard">
          <el-icon><HomeFilled /></el-icon>
          <template #title>系统首页</template>
        </el-menu-item>

        <el-sub-menu index="courses">
          <template #title>
            <el-icon><Reading /></el-icon><span>课程管理</span>
          </template>
          <el-menu-item index="/courses/group">团课管理</el-menu-item>
          <el-menu-item index="/courses/private">私教管理</el-menu-item>
          <el-menu-item index="/courses/reviews">评价管理</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="venues">
          <template #title>
            <el-icon><OfficeBuilding /></el-icon><span>场馆管理</span>
          </template>
          <el-menu-item index="/venues">场馆列表</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="users">
          <template #title>
            <el-icon><User /></el-icon><span>用户管理</span>
          </template>
          <el-menu-item index="/users/members">会员列表</el-menu-item>
          <el-menu-item index="/users/levels">会员等级</el-menu-item>
          <el-menu-item index="/users/cards">会员卡</el-menu-item>
          <el-menu-item index="/users/coaches">教练列表</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="shop">
          <template #title>
            <el-icon><ShoppingCart /></el-icon><span>商城管理</span>
          </template>
          <el-menu-item index="/shop/products">商品列表</el-menu-item>
          <el-menu-item index="/shop/categories">商品分类</el-menu-item>
          <el-menu-item index="/shop/orders">商城订单</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/bookings">
          <el-icon><Calendar /></el-icon>
          <template #title>预约记录</template>
        </el-menu-item>

        <el-sub-menu index="activity">
          <template #title>
            <el-icon><Present /></el-icon><span>活动管理</span>
          </template>
          <el-menu-item index="/activity/coupons">优惠券</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="system">
          <template #title>
            <el-icon><Setting /></el-icon><span>系统管理</span>
          </template>
          <el-menu-item index="/system/users">成员管理</el-menu-item>
          <el-menu-item index="/system/roles">角色管理</el-menu-item>
          <el-menu-item index="/system/ads">广告管理</el-menu-item>
          <el-menu-item index="/system/announcements">公告管理</el-menu-item>
          <el-menu-item index="/system/config">系统配置</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <!-- 右侧内容 -->
    <el-container>
      <el-header style="background:#fff; border-bottom:1px solid #ebeef5; display:flex; align-items:center; justify-content:space-between; padding:0 20px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <el-icon style="cursor:pointer;font-size:20px;" @click="isCollapse=!isCollapse"><Fold v-if="!isCollapse" /><Expand v-else /></el-icon>
          <span style="color:#666;font-size:14px;">欢迎 - <strong>{{ userStore.nickname || userStore.username || '管理员' }}</strong> -</span>
          <span style="color:#999;font-size:13px;">{{ currentTime }}</span>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <el-button type="primary" size="small" @click="$router.push('/dashboard')">系统首页</el-button>
          <el-button size="small" @click="handleLogout">退出登录</el-button>
        </div>
      </el-header>

      <el-main style="background:#f5f7fa; padding:20px;">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const userStore = useUserStore()
const isCollapse = ref(false)
const currentTime = ref('')
let timer = null

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { hour12: false })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => clearInterval(timer))

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.logo-area {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.logo-text {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 2px;
}
.logo-text-sm {
  color: #fff;
  font-size: 20px;
  font-weight: bold;
}
.el-menu {
  border-right: none;
}
</style>
