// pages/booking-success/booking-success.js
const app = getApp();

Page({
  data: {
    info: {
      payLabel: '微信支付',
      price: '0.00'
    }
  },

  onShow() {
    // 从 storage 读 booking-confirm 写进来的信息
    const data = wx.getStorageSync('lastBooking');
    if (data) {
      this.setData({
        info: {
          payLabel: data.payLabel || '微信支付',
          price: data.price || '0.00'
        }
      });
    }
  },

  goBack() {
    // 阻止返回上一页（已经预约成功）
    wx.switchTab({ url: '/pages/index/index' });
  },

  goMyBookings() {
    wx.navigateTo({ url: '/pages/my-bookings/my-bookings' });
  }
});
