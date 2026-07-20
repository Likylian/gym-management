// pages/booking/booking.js
const api = require('../../utils/api.js');
const app = getApp();

const TABS = ['团课', '私教'];
const WEEKS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

// 团课时间模板（每天从这些里挑 2~3 个）
const GROUP_TIME_TEMPLATES = [
  { start: '09:00', duration: 50 },
  { start: '10:30', duration: 60 },
  { start: '14:00', duration: 45 },
  { start: '16:00', duration: 50 },
  { start: '19:00', duration: 45 },
  { start: '20:30', duration: 50 }
];

const GROUP_EMOJI = ['🏃', '🤸', '🥊', '🧘', '🚴', '🏊', '🤾', '⛹️'];
const PRIVATE_EMOJI = ['💪', '🏃', '🥋', '🧘', '🏊'];

// 简单的种子随机数（保证同一天数据稳定）
function mulberry32(seed) {
  let t = seed >>> 0;
  return function() {
    t = (t + 0x6D2B79F5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromDate(dateStr) {
  // '2026-07-20' -> 20260720
  return parseInt(dateStr.replace(/-/g, ''), 10);
}

Page({
  data: {
    tabs: TABS,
    tabIdx: 0,
    openVenues: [],        // status=1 的场馆
    currentVenue: null,    // 当前选中
    showVenuePicker: false,

    dateList: [],          // 7 天
    selectedDate: '',

    groupSchedules: [],
    privateList: [],
    loading: false
  },

  onLoad() {
    this._initDateList();
    this._loadVenues();
  },

  onShow() {
    this._refreshCurrentView();
  },

  onPullDownRefresh() {
    this._refreshCurrentView().finally(() => wx.stopPullDownRefresh());
  },

  // ============ 初始化日期条 ============
  _initDateList() {
    const list = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      list.push({ dateStr, week: WEEKS[d.getDay()], day: d.getDate() });
    }
    this.setData({ dateList: list, selectedDate: list[0].dateStr });
  },

  // ============ 加载开放场馆（status=1） ============
  async _loadVenues() {
    try {
      const res = await api.getVenues({ pageSize: 50 });
      const all = (res && res.records) || [];
      const open = all.filter(v => v.status === 1);
      this.setData({ openVenues: open });
      if (open.length > 0) {
        // 优先选 app.globalData.preferredVenue（如从场馆详情跳转过来）
        const preferred = app.globalData && app.globalData.preferredVenue;
        let pick = open[0];
        if (preferred) {
          const match = open.find(v => v.id === preferred.id);
          if (match) {
            pick = match;
            // 用完即清空，避免下次进入还残留
            app.globalData.preferredVenue = null;
          }
        }
        this.setData({ currentVenue: pick });
        this._refreshCurrentView();
      }
    } catch (e) {
      wx.showToast({ title: '场馆加载失败', icon: 'none' });
    }
  },

  // ============ 切换 tab ============
  switchTab(e) {
    const idx = e.currentTarget.dataset.idx;
    if (idx === this.data.tabIdx) return;
    this.setData({ tabIdx: idx });
    // 顶部标题更新
    wx.setNavigationBarTitle({ title: idx === 0 ? '团课首页' : '私教课程' });
    this._refreshCurrentView();
  },

  // ============ 选择日期 ============
  selectDate(e) {
    const idx = e.currentTarget.dataset.idx;
    const date = this.data.dateList[idx];
    this.setData({ selectedDate: date.dateStr });
    if (this.data.tabIdx === 0) this._loadGroupSchedules();
  },

  // ============ 场馆弹层 ============
  openVenuePicker() { this.setData({ showVenuePicker: true }); },
  closeVenuePicker() { this.setData({ showVenuePicker: false }); },
  selectVenue(e) {
    const id = e.currentTarget.dataset.id;
    const v = this.data.openVenues.find(x => x.id === id);
    if (v) {
      this.setData({ currentVenue: v, showVenuePicker: false });
      this._refreshCurrentView();
    }
  },

  // ============ 切换 tab / 切场馆时刷新 ============
  async _refreshCurrentView() {
    if (this.data.tabIdx === 0) await this._loadGroupSchedules();
    else await this._loadPrivateCourses();
  },

  // ============ 团课排期（按日期差异化） ============
  async _loadGroupSchedules() {
    this.setData({ loading: true });
    try {
      const res = await api.getGroupCourses();
      const courses = (res && res.records) || [];
      if (courses.length === 0) {
        this.setData({ groupSchedules: [], loading: false });
        return;
      }
      const list = this._buildGroupSchedule(courses, this.data.selectedDate);
      this.setData({ groupSchedules: list, loading: false });
    } catch (e) {
      this.setData({ groupSchedules: [], loading: false });
    }
  },

  _buildGroupSchedule(courses, dateStr) {
    const seed = seedFromDate(dateStr);
    const rng = mulberry32(seed);
    // 每天挑 2~3 个课程
    const count = 2 + Math.floor(rng() * 2);
    const idxs = [...Array(courses.length).keys()];
    // 洗牌
    for (let i = idxs.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
    }
    const pickedIdxs = idxs.slice(0, count).sort((a, b) => a - b);

    return pickedIdxs.map((idx, i) => {
      const c = courses[idx];
      const tmpl = GROUP_TIME_TEMPLATES[(seed + i) % GROUP_TIME_TEMPLATES.length];
      const tags = (c.tags || '').split(/[,，]/).filter(Boolean);
      const capacity = 4;                          // 满 4 人开课
      const booked = Math.floor(rng() * (capacity + 1)); // 0~4
      let status = 'available';
      if (booked >= capacity) status = 'full';
      else if (booked === capacity - 1) status = 'waitlist';
      const statusText = status === 'full' ? '爆' : status === 'waitlist' ? '候' : '约';
      return {
        id: `${c.id}-${dateStr}-${i}`,
        courseId: c.id,
        courseName: c.name,
        coach: c.coach,
        startTime: tmpl.start,
        endTime: this._addMinutes(tmpl.start, tmpl.duration),
        duration: tmpl.duration,
        capacity,
        booked,
        status, statusText,
        tags,
        emoji: GROUP_EMOJI[idx % GROUP_EMOJI.length],
        colorIdx: idx % 8,
        estimatedPrice: (19.9 + (idx * 7.3) % 60).toFixed(2),  // 19.9~80 随机
        venueId: this.data.currentVenue ? this.data.currentVenue.id : null
      };
    });
  },

  _addMinutes(timeStr, minutes) {
    const [h, m] = timeStr.split(':').map(Number);
    const total = h * 60 + m + minutes;
    const hh = String(Math.floor(total / 60)).padStart(2, '0');
    const mm = String(total % 60).padStart(2, '0');
    return `${hh}:${mm}`;
  },

  // ============ 私教课程 ============
  async _loadPrivateCourses() {
    this.setData({ loading: true });
    try {
      const res = await api.getPrivateCourses();
      const list = (res && res.records) || [];
      const seed = seedFromDate(this.data.selectedDate);
      const rng = mulberry32(seed);
      this.setData({
        privateList: list.map((c, i) => this._decoratePrivate(c, i, rng)),
        loading: false
      });
    } catch (e) {
      this.setData({ privateList: [], loading: false });
    }
  },

  _decoratePrivate(c, i, rng) {
    return {
      id: c.id,
      name: c.name,
      coachTag: `${c.coach || '教练'}教练亲临`,
      emoji: PRIVATE_EMOJI[i % PRIVATE_EMOJI.length],
      colorIdx: i % 8,
      price: (180 + Math.floor(rng() * 200)).toFixed(2),
      full: rng() > 0.7
    };
  },

  // ============ 课程详情 ============
  goCourseDetail(e) {
    const item = e.currentTarget.dataset.item;
    if (!item) {
      wx.showToast({ title: '课程参数错误', icon: 'none' });
      return;
    }
    // 团课跳详情（带完整课节信息）
    if (this.data.tabIdx === 0) {
      const params = [
        `scheduleId=${item.id}`,
        `courseId=${item.courseId}`,
        `courseName=${encodeURIComponent(item.courseName)}`,
        `date=${this.data.selectedDate}`,
        `startTime=${item.startTime}`,
        `endTime=${item.endTime}`,
        `coach=${encodeURIComponent(item.coach || '')}`,
        `capacity=${item.capacity}`,
        `booked=${item.booked}`,
        `venueName=${encodeURIComponent(this.data.currentVenue ? this.data.currentVenue.name : '健身场馆')}`,
        `price=${item.estimatedPrice || '29.90'}`
      ].join('&');
      wx.navigateTo({ url: `/pages/group-detail/group-detail?${params}` });
    } else {
      // 私教跳详情
      const params = [
        `courseId=${item.id}`,
        `courseName=${encodeURIComponent(item.name)}`,
        `coach=${encodeURIComponent(item.coachTag ? item.coachTag.replace('教练亲临', '') : '')}`,
        `price1=800`,
        `price6=700`,
        `price10=600`,
        `venueName=${encodeURIComponent(this.data.currentVenue ? this.data.currentVenue.name : '健身场馆')}`
      ].join('&');
      wx.navigateTo({ url: `/pages/private-detail/private-detail?${params}` });
    }
  },

  goBack() {
    wx.switchTab({ url: '/pages/index/index' });
  }
});
