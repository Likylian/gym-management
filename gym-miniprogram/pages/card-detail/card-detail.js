// pages/card-detail/card-detail.js
const api = require('../../utils/api.js');
const app = getApp();

// 销售人员候选（用 coach 表数据兜底，模拟销售员）
const FALLBACK_SALESMEN = [
  { id: 1, name: '阿豪（销售经理）' },
  { id: 2, name: '小美（资深顾问）' },
  { id: 3, name: '晓峰（销售顾问）' },
  { id: 4, name: '莉莉（销售顾问）' }
];

Page({
  data: {
    card: null,
    selectedSpecId: null,
    currentPrice: '0.00',
    salesmen: FALLBACK_SALESMEN,
    salesmanIndex: 0,
    selectedSalesman: null,
    agreed: false,
    canBuy: false
  },

  onLoad(options) {
    this._loadCard(options.id);
  },

  async _loadCard(id) {
    try {
      const card = await api.getCardProductById(id);
      const firstSpec = (card.specs || [])[0] || null;
      this.setData({
        card,
        selectedSpecId: firstSpec ? firstSpec.id : null,
        currentPrice: firstSpec ? firstSpec.price : card.basePrice
      });
    } catch (e) {
      this.setData({ card: null });
    }
  },

  selectSpec(e) {
    const id = e.currentTarget.dataset.id;
    const spec = this.data.card.specs.find(s => s.id === id);
    if (!spec) return;
    this.setData({
      selectedSpecId: id,
      currentPrice: spec.price
    });
  },

  onSalesmanChange(e) {
    const idx = e.detail.value;
    this.setData({ salesmanIndex: idx, selectedSalesman: this.data.salesmen[idx] });
  },

  toggleAgree() {
    const agreed = !this.data.agreed;
    this.setData({ agreed });
    this._refreshCanBuy();
  },

  _refreshCanBuy() {
    this.setData({ canBuy: this.data.agreed && !!this.data.selectedSpecId });
  },

  async onBuy() {
    if (!this.data.agreed) {
      wx.showToast({ title: '请先同意协议', icon: 'none' });
      return;
    }
    if (!this.data.selectedSpecId) {
      wx.showToast({ title: '请选择规格', icon: 'none' });
      return;
    }
    const token = app.globalData.token || wx.getStorageSync('token');
    if (!token) {
      wx.showModal({
        title: '请先登录',
        content: '您还未登录，前往登录？',
        success: (r) => { if (r.confirm) wx.reLaunch({ url: '/pages/login/login' }); }
      });
      return;
    }

    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
    try {
      const res = await api.purchaseCard(this.data.card.id, {
        specId: this.data.selectedSpecId,
        memberId: userInfo.id || 0,
        memberName: userInfo.nickname || userInfo.username || '',
        phone: userInfo.phone || ''
      });
      const successData = {
        cardName: this.data.card.name,
        price: this.data.currentPrice,
        payLabel: '微信支付',
        cardId: (res && res.id) || null
      };
      wx.setStorageSync('lastCardPurchase', successData);
      wx.redirectTo({ url: '/pages/card-success/card-success' });
    } catch (err) {
      // 错误已统一提示
    }
  },

  goAgreement() {
    wx.navigateTo({ url: '/pages/agreement/agreement' });
  },

  goBack() {
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/mine/mine' }) });
  }
});
