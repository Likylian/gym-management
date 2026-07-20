// pages/index/index.js
const api = require('../../utils/api.js');
const app = getApp();

const COURSE_EMOJI = ['🏋️', '🤸', '🏃', '🤾', '🧘', '🥊', '🚴', '🏊'];
const PRODUCT_EMOJI = ['👟', '💪', '🍳', '🧴', '🏋️', '🎽', '🥤', '🎒'];
const COLORS = [0, 1, 2, 3, 4, 5, 6, 7];

const BANNERS = [
  { emoji: '🏋️', title: '专业健身  健康生活', sub: '400+ 门店 · 200+ 教练 · 一键预约', bg: 'linear-gradient(135deg, #4A90E2, #2C5F8D)' },
  { emoji: '💪', title: '私教课程  量身定制', sub: '专业教练一对一指导', bg: 'linear-gradient(135deg, #FF6B6B, #C44569)' },
  { emoji: '🤸', title: '团课体验  燃脂塑形', sub: '瑜伽 / 搏击 / 动感单车', bg: 'linear-gradient(135deg, #5B8DEF, #3D5AFE)' },
  { emoji: '🥗', title: '健身周边  优选好物', sub: '蛋白粉 / 健身装备 / 营养品', bg: 'linear-gradient(135deg, #26C6DA, #00838F)' }
];

Page({
  data: {
    banners: BANNERS,
    bannerIdx: 0,
    privateCourses: [],
    groupCourses: [],
    products: [],
    loading: false,
    loadingText: ''
  },

  _bannerTimer: null,

  onLoad() {
    this.loadAll();
  },

  onShow() {
    this._startBannerLoop();
  },

  onHide() {
    this._stopBannerLoop();
  },

  onUnload() {
    this._stopBannerLoop();
  },

  onPullDownRefresh() {
    this.loadAll().finally(() => wx.stopPullDownRefresh());
  },

  // ============ 数据加载 ============
  async loadAll() {
    this.setData({ loading: true, loadingText: '正在加载...' });
    try {
      await Promise.all([
        this._loadPrivateCourses(),
        this._loadGroupCourses(),
        this._loadProducts()
      ]);
    } finally {
      this.setData({ loading: false, loadingText: '— 已经到底了 —' });
    }
  },

  async _loadPrivateCourses() {
    try {
      const list = await api.getPrivateCourses() || [];
      this.setData({ privateCourses: list.map((item, i) => this._decorateCourse(item, i, true)) });
    } catch (e) { /* 接口失败时静默 */ }
  },

  async _loadGroupCourses() {
    try {
      const list = await api.getGroupCourses() || [];
      this.setData({ groupCourses: list.map((item, i) => this._decorateCourse(item, i, false)) });
    } catch (e) { /* 静默 */ }
  },

  async _loadProducts() {
    try {
      const list = await api.getProducts() || [];
      this.setData({ products: list.map((item, i) => this._decorateProduct(item, i)) });
    } catch (e) { /* 静默 */ }
  },

  _decorateCourse(item, i, isPrivate) {
    const tags = (item.tags || '').split(/[,，]/).filter(Boolean);
    // 默认价：数据库里没有 price 字段，给个展示用的随机价
    const price = isPrivate ? (item.price || (180 + (i * 37) % 200)) : (item.price || (39 + (i * 23) % 80));
    return {
      ...item,
      emoji: COURSE_EMOJI[i % COURSE_EMOJI.length],
      colorIdx: COLORS[i % COLORS.length],
      tagsText: tags.join(' '),
      price: Number(price).toFixed(2),
      hot: i === 0 && isPrivate   // 私教第一条给 HOT 角标
    };
  },

  _decorateProduct(item, i) {
    return {
      ...item,
      emoji: PRODUCT_EMOJI[i % PRODUCT_EMOJI.length],
      colorIdx: COLORS[(i + 1) % COLORS.length],
      price: Number(item.price || 99).toFixed(2)
    };
  },

  // ============ Banner 轮播 ============
  _startBannerLoop() {
    this._stopBannerLoop();
    this._bannerTimer = setInterval(() => {
      const next = (this.data.bannerIdx + 1) % this.data.banners.length;
      this.setData({ bannerIdx: next });
    }, 3500);
  },

  _stopBannerLoop() {
    if (this._bannerTimer) {
      clearInterval(this._bannerTimer);
      this._bannerTimer = null;
    }
  }
});
