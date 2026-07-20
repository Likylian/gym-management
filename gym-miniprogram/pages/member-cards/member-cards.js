// pages/member-cards/member-cards.js
const api = require('../../utils/api.js');

const TABS = ['全部', '次卡', '储值', '期限'];

Page({
  data: {
    tabs: TABS,
    activeTab: '全部',
    cards: [],
    loading: true
  },

  onShow() {
    this._load();
  },

  switchTab(e) {
    const name = e.currentTarget.dataset.name;
    if (name === this.data.activeTab) return;
    this.setData({ activeTab: name, loading: true });
    this._load();
  },

  async _load() {
    try {
      const type = this.data.activeTab === '全部' ? null : this.data.activeTab;
      const list = await api.getCardProducts(type);
      this.setData({ cards: list || [], loading: false });
    } catch (e) {
      this.setData({ cards: [], loading: false });
    }
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/card-detail/card-detail?id=${id}` });
  },

  goBack() {
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/mine/mine' }) });
  }
});
