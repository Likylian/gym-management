// pages/venue/venue.js
const api = require('../../utils/api.js');

const EMOJI = ['🏢', '🏛️', '🏗️', '🏘️', '🏬', '🏟️'];
const COLORS = [0, 1, 2, 3, 4, 5];

Page({
  data: {
    venues: [],
    loading: true
  },

  onShow() {
    this.loadVenues();
  },

  onPullDownRefresh() {
    this.loadVenues().finally(() => wx.stopPullDownRefresh());
  },

  async loadVenues() {
    this.setData({ loading: true });
    try {
      const res = await api.getVenues({ pageSize: 50 });
      const list = (res && res.records) || [];
      this.setData({
        venues: list.map((v, i) => this._decorate(v, i)),
        loading: false
      });
    } catch (e) {
      this.setData({ loading: false });
    }
  },

  _decorate(v, i) {
    return {
      ...v,
      emoji: EMOJI[i % EMOJI.length],
      colorIdx: COLORS[i % COLORS.length],
      // 没有真实距离就伪造一个 0.x km 的值
      distance: ((0.3 + (i * 0.7) % 3) || 0.6).toFixed(1) + 'km'
    };
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/venue-detail/venue-detail?id=${id}` });
  },

  onSearch() {
    wx.showToast({ title: '搜索功能开发中', icon: 'none' });
  }
});
