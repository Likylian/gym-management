import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    component: () => import('../views/layout/AdminLayout.vue'),
    redirect: '/dashboard',
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('../views/Dashboard.vue'), meta: { title: '系统首页' } },
      { path: 'courses/group', name: 'GroupCourses', component: () => import('../views/courses/GroupCourses.vue'), meta: { title: '团课管理' } },
      { path: 'courses/private', name: 'PrivateCourses', component: () => import('../views/courses/PrivateCourses.vue'), meta: { title: '私教管理' } },
      { path: 'courses/reviews', name: 'CourseReviews', component: () => import('../views/courses/CourseReviews.vue'), meta: { title: '评价管理' } },
      { path: 'venues', name: 'Venues', component: () => import('../views/venues/VenueList.vue'), meta: { title: '场馆管理' } },
      { path: 'users/members', name: 'Members', component: () => import('../views/users/MemberList.vue'), meta: { title: '会员列表' } },
      { path: 'users/levels', name: 'MemberLevels', component: () => import('../views/users/MemberLevels.vue'), meta: { title: '会员等级' } },
      { path: 'users/cards', name: 'MemberCards', component: () => import('../views/users/MemberCards.vue'), meta: { title: '会员卡' } },
      { path: 'users/coaches', name: 'Coaches', component: () => import('../views/users/CoachList.vue'), meta: { title: '教练列表' } },
      { path: 'users/coaches/:id', name: 'CoachDetail', component: () => import('../views/users/CoachDetail.vue'), meta: { title: '教练详情' } },
      { path: 'shop/products', name: 'Products', component: () => import('../views/shop/ProductList.vue'), meta: { title: '商品列表' } },
      { path: 'shop/categories', name: 'ProductCategories', component: () => import('../views/shop/ProductCategories.vue'), meta: { title: '商品分类' } },
      { path: 'shop/orders', name: 'Orders', component: () => import('../views/shop/OrderList.vue'), meta: { title: '商城订单' } },
      { path: 'bookings', name: 'Bookings', component: () => import('../views/BookingRecords.vue'), meta: { title: '预约记录' } },
      { path: 'activity/coupons', name: 'Coupons', component: () => import('../views/activity/Coupons.vue'), meta: { title: '优惠券' } },
      { path: 'system/users', name: 'SystemUsers', component: () => import('../views/system/SystemUsers.vue'), meta: { title: '成员管理' } },
      { path: 'system/roles', name: 'Roles', component: () => import('../views/system/Roles.vue'), meta: { title: '角色管理' } },
      { path: 'system/ads', name: 'Ads', component: () => import('../views/system/Ads.vue'), meta: { title: '广告管理' } },
      { path: 'system/announcements', name: 'Announcements', component: () => import('../views/system/Announcements.vue'), meta: { title: '公告管理' } },
      { path: 'system/config', name: 'SystemConfig', component: () => import('../views/system/SystemConfig.vue'), meta: { title: '系统配置' } },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
