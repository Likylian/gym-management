// pages/mine/mine.js
const app = getApp();
const api = require('../../utils/api.js');

Page({
  data: {
    isLogin: false,
    userInfo: null,
    avatarText: '',
    dbOK: false
  },

  onShow() {
    this._checkLoginState();
    this._checkDB();
  },

  _checkLoginState() {
    const token = app.globalData.token || wx.getStorageSync('token');
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    const isLogin = !!token;
    const avatarText = (userInfo && userInfo.nickname ? userInfo.nickname.charAt(0) : '?').toUpperCase();
    this.setData({ isLogin, userInfo, avatarText });
  },

  _checkDB() {
    // 调一个公开 GET 接口验证数据库连接
    api.getCoaches().then(() => {
      this.setData({ dbOK: true });
    }).catch(() => {
      this.setData({ dbOK: false });
    });
  },

  handleLogout() {
    wx.showModal({
      title: '退出登录',
      content: '退出后需要重新登录才能使用',
      confirmColor: '#FF4D4F',
      success: (res) => {
        if (res.confirm) {
          app.clearLoginState();
          this.setData({ isLogin: false, userInfo: null, dbOK: false });
          wx.showToast({ title: '已退出', icon: 'success', duration: 1200 });
          // 回到首页
          setTimeout(() => {
            wx.reLaunch({ url: '/pages/login/login' });
          }, 500);
        }
      }
    });
  },

  goLogin() {
    wx.reLaunch({ url: '/pages/login/login' });
  },

  goMyBookings() {
    wx.navigateTo({ url: '/pages/my-bookings/my-bookings' });
  },

  goMemberCards() {
    wx.navigateTo({ url: '/pages/member-cards/member-cards' });
  },

  goMyMemberCards() {
    wx.navigateTo({ url: '/pages/my-member-cards/my-member-cards' });
  }
});
