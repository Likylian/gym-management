// pages/card-success/card-success.js
const app = getApp();

Page({
  data: {
    info: { payLabel: '微信支付', price: '0.00' }
  },

  onShow() {
    const data = wx.getStorageSync('lastCardPurchase');
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
  viewCards() { wx.redirectTo({ url: '/pages/my-member-cards/my-member-cards' }); }
});
