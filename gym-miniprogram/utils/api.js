// utils/api.js - 接口地址统一管理
const { request } = require('./request');

module.exports = {
  // ===== 会员 =====
  // 发送手机验证码
  sendCode(phone) {
    return request({
      url: '/api/member/send-code',
      method: 'POST',
      data: { phone }
    });
  },

  // 会员登录（手机号 + 动态码）
  memberLogin(phone, code) {
    return request({
      url: '/api/member/login',
      method: 'POST',
      data: { phone, code }
    });
  },

  // 获取当前会员信息
  getMemberInfo() {
    return request({
      url: '/api/member/info',
      method: 'GET',
      auth: true
    });
  },

  // ===== 首页数据（公开 GET） =====
  getVenues(params) {
    const query = params ? '?' + Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&') : '';
    return request({ url: '/api/venues' + query, method: 'GET' });
  },

  getVenueById(id) {
    return request({ url: `/api/venues/${id}`, method: 'GET' });
  },

  getCoaches() {
    return request({ url: '/api/coaches', method: 'GET' });
  },

  getGroupCourses() {
    return request({ url: '/api/group-courses', method: 'GET' });
  },

  getPrivateCourses() {
    return request({ url: '/api/private-courses', method: 'GET' });
  },

  getProducts() {
    return request({ url: '/api/products', method: 'GET' });
  },

  // ===== 团课详情 / 预约 =====
  getGroupCourseById(id) {
    return request({ url: `/api/group-courses/${id}`, method: 'GET' });
  },

  createBooking(payload) {
    return request({
      url: '/api/bookings',
      method: 'POST',
      data: payload,
      auth: true
    });
  },

  getMyBookings(params) {
    const q = params ? '?' + Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&') : '';
    return request({ url: '/api/bookings' + q, method: 'GET', auth: true });
  }
};
