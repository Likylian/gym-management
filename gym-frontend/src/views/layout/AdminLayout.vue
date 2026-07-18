<template>
  <el-container class="admin-layout">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '72px' : '240px'" class="aside-wrap">
      <div class="logo-area" @click="$router.push('/dashboard')">
        <span class="logo-icon">🏋️</span>
        <transition name="fade">
          <div v-show="!isCollapse" class="logo-info">
            <span class="logo-title">GYM PRO</span>
            <span class="logo-desc">管理后台</span>
          </div>
        </transition>
      </div>

      <div class="menu-wrap">
        <el-menu
          :default-active="$route.path"
          :collapse="isCollapse"
          background-color="transparent"
          text-color="rgba(255,255,255,0.65)"
          active-text-color="#fff"
          router
          :collapse-transition="false"
        >
          <el-menu-item index="/dashboard">
            <template #title>
              <el-icon><HomeFilled /></el-icon>
              <span>系统首页</span>
            </template>
          </el-menu-item>

          <el-sub-menu index="courses">
            <template #title>
              <el-icon><Reading /></el-icon>
              <span>课程管理</span>
            </template>
            <el-menu-item index="/courses/group">团课管理</el-menu-item>
            <el-menu-item index="/courses/private">私教管理</el-menu-item>
            <el-menu-item index="/courses/reviews">评价管理</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="venues">
            <template #title>
              <el-icon><OfficeBuilding /></el-icon>
              <span>场馆管理</span>
            </template>
            <el-menu-item index="/venues">场馆列表</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="users">
            <template #title>
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/users/members">会员列表</el-menu-item>
            <el-menu-item index="/users/levels">会员等级</el-menu-item>
            <el-menu-item index="/users/cards">会员卡</el-menu-item>
            <el-menu-item index="/users/coaches">教练列表</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="shop">
            <template #title>
              <el-icon><ShoppingCart /></el-icon>
              <span>商城管理</span>
            </template>
            <el-menu-item index="/shop/products">商品列表</el-menu-item>
            <el-menu-item index="/shop/categories">商品分类</el-menu-item>
            <el-menu-item index="/shop/orders">商城订单</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/bookings">
            <template #title>
              <el-icon><Calendar /></el-icon>
              <span>预约记录</span>
            </template>
          </el-menu-item>

          <el-sub-menu index="activity">
            <template #title>
              <el-icon><Present /></el-icon>
              <span>活动管理</span>
            </template>
            <el-menu-item index="/activity/coupons">优惠券</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="system">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item index="/system/users">成员管理</el-menu-item>
            <el-menu-item index="/system/roles">角色管理</el-menu-item>
            <el-menu-item index="/system/ads">广告管理</el-menu-item>
            <el-menu-item index="/system/announcements">公告管理</el-menu-item>
            <el-menu-item index="/system/config">系统配置</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
    </el-aside>

    <!-- 右侧主区域 -->
    <el-container>
      <el-header class="top-header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="isCollapse = !isCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="breadcrumb">{{ breadcrumb }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <span class="header-time">{{ currentTime }}</span>
          <el-dropdown trigger="click">
            <span class="user-info">
              <el-avatar :size="32" icon="UserFilled" />
              <span class="user-name">{{ userStore.nickname || userStore.username || '管理员' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="$router.push('/dashboard')">
                  <el-icon><HomeFilled /></el-icon> 系统首页
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon> 退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../../stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const isCollapse = ref(false)
const currentTime = ref('')
let timer = null

const breadcrumb = computed(() => {
  const map = {
    '/dashboard': '',
    '/courses/group': '课程管理 / 团课管理',
    '/courses/private': '课程管理 / 私教管理',
    '/courses/reviews': '课程管理 / 评价管理',
    '/venues': '场馆管理 / 场馆列表',
    '/users/members': '用户管理 / 会员列表',
    '/users/levels': '用户管理 / 会员等级',
    '/users/cards': '用户管理 / 会员卡',
    '/users/coaches': '用户管理 / 教练列表',
    '/shop/products': '商城管理 / 商品列表',
    '/shop/categories': '商城管理 / 商品分类',
    '/shop/orders': '商城管理 / 商城订单',
    '/bookings': '预约记录',
    '/activity/coupons': '活动管理 / 优惠券',
    '/system/users': '系统管理 / 成员管理',
    '/system/roles': '系统管理 / 角色管理',
    '/system/ads': '系统管理 / 广告管理',
    '/system/announcements': '系统管理 / 公告管理',
    '/system/config': '系统管理 / 系统配置',
  }
  return map[route.path] || ''
})

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', { hour12: false })
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
.admin-layout {
  height: 100vh;
  background: var(--color-bg);
}

/* 侧边栏 */
.aside-wrap {
  background: linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255,255,255,0.06);
}

.logo-area {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
  transition: padding 0.3s;
}

.logo-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.logo-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  white-space: nowrap;
}

.logo-title {
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 2px;
  line-height: 1.2;
}

.logo-desc {
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  letter-spacing: 1px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 菜单区域 */
.menu-wrap {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.menu-wrap::-webkit-scrollbar {
  width: 3px;
}

.menu-wrap::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
  border-radius: 3px;
}

.el-menu {
  border-right: none;
  padding: 8px 0;
}

.el-menu-item {
  margin: 2px 8px;
  border-radius: var(--radius-sm);
  height: 44px;
  line-height: 44px;
  transition: all var(--transition);
}

.el-menu-item:hover {
  background: rgba(255, 255, 255, 0.08) !important;
}

.el-menu-item.is-active {
  background: linear-gradient(135deg, var(--color-primary), #8b5cf6) !important;
  color: #fff !important;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
}

.el-sub-menu .el-menu-item {
  padding-left: 56px !important;
  min-width: auto;
}

:deep(.el-sub-menu__title) {
  height: 44px;
  line-height: 44px;
  margin: 2px 8px;
  border-radius: var(--radius-sm);
  transition: all var(--transition);
}

:deep(.el-sub-menu__title):hover {
  background: rgba(255, 255, 255, 0.08) !important;
}

:deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  color: #fff !important;
}

/* 顶部栏 */
.top-header {
  background: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 60px;
  box-shadow: var(--shadow-sm);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all var(--transition);
  padding: 6px;
  border-radius: var(--radius-sm);
}

.collapse-btn:hover {
  color: var(--color-primary);
  background: rgba(99, 102, 241, 0.08);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-time {
  font-size: 13px;
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: background var(--transition);
}

.user-info:hover {
  background: var(--color-bg);
}

.user-name {
  font-size: 14px;
  color: var(--color-text);
  font-weight: 500;
}

/* 主内容区 */
.main-content {
  background: var(--color-bg);
  padding: 24px;
  overflow-y: auto;
  height: calc(100vh - 60px);
}
</style>
