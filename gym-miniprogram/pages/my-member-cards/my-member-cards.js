// pages/my-member-cards/my-member-cards.js
const api = require('../../utils/api.js');
const app = getApp();

Page({
  data: {
    cards: [],
    loading: true
  },

  onShow() {
    this._load();
  },

  async _load() {
    this.setData({ loading: true });
    try {
      const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
      const keyword = userInfo.phone || userInfo.username || userInfo.nickname || '';
      if (!keyword) {
        this.setData({ cards: [], loading: false });
        return;
      }
      const res = await api.getMyMemberCards({ keyword, pageSize: 50, status: 1 });
      const records = (res && res.records) || [];
      this.setData({
        cards: records.map(c => this._decorate(c)),
        loading: false
      });
    } catch (e) {
      this.setData({ cards: [], loading: false });
    }
  },

  // 美化单张卡的展示
  _decorate(c) {
    let displayValue = '';
    let displayUnit = '';
    if (c.cardType === '次卡') {
      displayValue = (c.remainTimes != null ? c.remainTimes : c.times) || 0;
      displayUnit = `剩余${displayValue}次可用`;
    } else if (c.cardType === '储值' || c.cardType === '储值卡') {
      displayValue = (c.balance || 0).toFixed(0);
      displayUnit = `剩余¥${displayValue}`;
    } else if (c.cardType === '期限') {
      displayValue = (c.days || 0) + '天';
      displayUnit = '有效期';
    } else {
      displayValue = '0';
      displayUnit = '未识别';
    }
    // 主题色
    const themeMap = { '次卡': 'orange', '储值': 'teal', '储值卡': 'teal', '期限': 'purple' };
    const theme = themeMap[c.cardType] || 'orange';

    return {
      ...c,
      displayValue,
      displayUnit,
      theme,
      expireTimeLabel: c.expireTime ? String(c.expireTime).substring(0, 10) : '长期有效'
    };
  },

  onUse(e) {
    // 跳预约 tab（团课/私教 都可以根据卡片类型选）
    wx.switchTab({ url: '/pages/booking/booking' });
  },

  goBuy() {
    wx.navigateTo({ url: '/pages/member-cards/member-cards' });
  },

  goBack() {
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/mine/mine' }) });
  }
});
