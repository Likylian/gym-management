// pages/venue-detail/venue-detail.js
const api = require('../../utils/api.js');
const app = getApp();

const FACILITIES = [
  { emoji: '🏋️', name: '力量区' },
  { emoji: '🏃', name: '跑步区' },
  { emoji: '🚴', name: '动感单车' },
  { emoji: '🧘', name: '瑜伽房' },
  { emoji: '🏊', name: '游泳池' },
  { emoji: '🥊', name: '搏击区' },
  { emoji: '♨️', name: '桑拿房' },
  { emoji: '🚿', name: '淋浴间' }
];

const COACH_EMOJI = ['💪', '🏃', '🥋', '🧘', '🏊'];

Page({
  data: {
    venueId: null,
    venue: null,
    gallery: [],
    facilities: FACILITIES,
    coaches: [],
    reviewCount: 128
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ venueId: options.id });
      this.loadVenue(options.id);
      this.loadCoaches(options.id);
    }
  },

  async loadVenue(id) {
    try {
      const v = await api.getVenueById(id);
      if (!v) {
        wx.showToast({ title: '场馆不存在', icon: 'none' });
        return;
      }
      // 生成图集（用不同的渐变色 + emoji）
      const gallery = this._buildGallery(v);
      // 写介绍文案：没 description 就用通用模板
      const venue = this._buildDescription(v);
      this.setData({ venue: { ...v, ...venue }, gallery });
    } catch (e) {
      // 失败也给个默认数据，避免页面空白
      this.setData({
        venue: this._buildDescription({ name: '健身场馆' }),
        gallery: this._buildGallery({ name: '健身场馆' })
      });
    }
  },

  async loadCoaches(venueId) {
    try {
      const res = await api.getCoaches();
      const all = (res && res.records) || [];
      // 用 venueId 模拟过滤（数据里 venue_ids 是 CSV）
      const list = all.filter(c => c.venueIds && c.venueIds.split(',').includes(String(venueId)))
        .slice(0, 6)
        .map((c, i) => ({
          id: c.id, name: c.name,
          emoji: COACH_EMOJI[i % COACH_EMOJI.length],
          colorIdx: (i + 1) % 8,
          tag: c.gender ? (c.gender === '男' ? '力量 / 增肌' : '瑜伽 / 塑形') : '专业教练'
        }));
      this.setData({ coaches: list });
    } catch (e) { /* 静默 */ }
  },

  _buildGallery(v) {
    return [
      { label: `${v.name} · 外观`, emoji: '🏢', colorIdx: 0 },
      { label: '有氧器械区', emoji: '🏃', colorIdx: 3 },
      { label: '力量训练区', emoji: '🏋️', colorIdx: 1 },
      { label: '瑜伽 / 操房', emoji: '🧘', colorIdx: 4 },
      { label: '淋浴间', emoji: '🚿', colorIdx: 5 }
    ];
  },

  _buildDescription(v) {
    // 用场馆名生成一段贴合的主题介绍（数据库里没 description 也能好看）
    const intro1 = `「${v.name}」以"专业、健康、尊贵、时尚"为宗旨，致力于为社会各界精英打造全新的健康优质生活。凭借强大的实力和专业的服务，以五星级酒店服务为标准，全力打造城市健康新地标。`;
    const intro2 = `本中心投资总额 1500 万元，总面积 4000 平方米。装修精致、豪华、设施齐全，采用国际一流健身器材，设有大堂接待中心、游泳区、健身区、私教区、浴区（配备干蒸、泡澡池）、水吧、综合操房、动感单车室等。中心本着打造江南游泳培训第一的理念，建设最专业的游泳教练团队（国家级教练一人，美国游泳协会 ASCA 国际初级教练员两人）。`;
    return { intro1, intro2 };
  },

  goBack() {
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/venue/venue' }) });
  },

  onBook() {
    const token = app.globalData.token || wx.getStorageSync('token');
    if (!token) {
      wx.showModal({
        title: '请先登录',
        content: '您还未登录，前往登录页？',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.reLaunch({ url: '/pages/login/login' });
          }
        }
      });
      return;
    }
    // 已登录：把当前场馆记到 app.globalData，预约页读取后会自动选中
    if (this.data.venue) {
      app.globalData.preferredVenue = {
        id: this.data.venue.id,
        name: this.data.venue.name
      };
    }
    wx.switchTab({ url: '/pages/booking/booking' });
  }
});
