// pages/private-booking-success/private-booking-success.js
const app = getApp();

Page({
  data: {
    info: { payLabel: '微信支付', price: '0.00' }
  },

  onShow() {
    const data = wx.getStorageSync('lastPrivateBooking');
    if (data) {
      this.setData({
        info: {
          payLabel: data.payLabel || '微信支付',
          price: data.price || '0.00'
        }
      });
    }
  },

  goBack() { wx.switchTab({ url: '/pages/index/index' }); },
  goMyBookings() { wx.navigateTo({ url: '/pages/my-bookings/my-bookings' }); }
});
