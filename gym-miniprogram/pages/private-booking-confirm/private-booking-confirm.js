// pages/private-booking-confirm/private-booking-confirm.js
const api = require('../../utils/api.js');
const app = getApp();

const WEEKS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function dateLabel(dateStr) {
  const d = new Date(dateStr);
  return `${dateStr}（${WEEKS[d.getDay()]}）`;
}

function genDateList() {
  const list = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    list.push({ dateStr, week: WEEKS[d.getDay()], day: d.getDate() });
  }
  return list;
}

Page({
  data: {
    info: {
      courseName: '',
      dateLabel: '',
      timeLabel: '',
      venueName: '',
      coach: ''
    },
    dateList: [],
    selectedDate: '',
    selectedSlotId: null,
    selectedSlotTime: '',
    slots: [],
    pkgOptions: [
      { id: 1, label: '1 课时', price: 0 },
      { id: 6, label: '6 课时', price: 0 },
      { id: 10, label: '10 课时', price: 0 }
    ],
    selectedPkg: 1,
    remark: '',
    payMethod: 'wechat',
    courseId: null,
    coach: '',
    price1: 800,
    price6: 700,
    price10: 600,
    totalPrice: '800.00',
    showConfirm: false,
    submitting: false,
    myMemberCards: [],           // 当前用户已购卡
    selectedMemberCardId: null,  // 选中的会员卡
    selectedMemberCard: null
  },

  onLoad(options) {
    const safeDecode = (s) => {
      if (!s) return '';
      const v = decodeURIComponent(s);
      return /%[0-9A-Fa-f]{2}/.test(v) ? decodeURIComponent(v) : v;
    };
    const courseId = parseInt(options.courseId || '0', 10);
    const courseName = safeDecode(options.courseName);
    const coach = safeDecode(options.coach);
    const venueName = safeDecode(options.venueName || '健身场馆');
    const price1 = parseFloat(options.price1 || '800');
    const price6 = parseFloat(options.price6 || '700');
    const price10 = parseFloat(options.price10 || '600');

    const dateList = genDateList();
    const selectedDate = dateList[0].dateStr;

    const pkgOptions = [
      { id: 1, label: '1 课时', price: price1 },
      { id: 6, label: '6 课时', price: price6 },
      { id: 10, label: '10 课时', price: price10 }
    ];

    this.setData({
      courseId,
      coach,
      price1, price6, price10,
      pkgOptions,
      dateList,
      selectedDate,
      info: {
        courseName,
        dateLabel: dateLabel(selectedDate),
        timeLabel: '请选择时段',
        venueName,
        coach
      },
      totalPrice: price1.toFixed(2)
    });

    this._loadSlots(selectedDate);
    this._loadMyMemberCards();
  },

  // 加载当前用户的已购卡
  async _loadMyMemberCards() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
    const keyword = userInfo.phone || userInfo.username || userInfo.nickname || '';
    if (!keyword) return;
    try {
      const res = await api.getMyMemberCards({ keyword, pageSize: 50, status: 1 });
      const records = (res && res.records) || [];
      this.setData({
        myMemberCards: records.map(c => this._decorateCard(c))
      });
    } catch (e) {
      this.setData({ myMemberCards: [] });
    }
  },

  _decorateCard(c) {
    let displayValue = '';
    let displayUnit = '';
    if (c.cardType === '次卡') {
      displayValue = `${c.remainTimes != null ? c.remainTimes : c.times || 0}`;
      displayUnit = '剩余次数';
    } else if (c.cardType === '储值' || c.cardType === '储值卡') {
      displayValue = `¥${(c.balance || 0).toFixed(0)}`;
      displayUnit = '可用余额';
    } else if (c.cardType === '期限' || c.cardType === '期限卡') {
      displayValue = c.expireTime ? String(c.expireTime).substring(0, 10) : '长期';
      displayUnit = '有效期至';
    } else {
      displayValue = '';
      displayUnit = '';
    }
    return { ...c, displayValue, displayUnit };
  },

  // ============ 加载时段（首次或切换日期时） ============
  async _loadSlots(dateStr) {
    try {
      const list = await api.getPrivateSlots(this.data.courseId, dateStr);
      this.setData({ slots: list || [] });
    } catch (e) {
      this.setData({ slots: [] });
    }
  },

  // ============ 选择日期 ============
  selectDate(e) {
    const idx = e.currentTarget.dataset.idx;
    const date = this.data.dateList[idx];
    this.setData({
      selectedDate: date.dateStr,
      selectedSlotId: null,
      selectedSlotTime: '',
      info: { ...this.data.info, dateLabel: dateLabel(date.dateStr), timeLabel: '请选择时段' }
    });
    this._loadSlots(date.dateStr);
  },

  // ============ 选择时段 ============
  onSlotTap(e) {
    const id = e.currentTarget.dataset.id;
    const slot = this.data.slots.find(s => s.id === id);
    if (!slot || slot.status !== 1) return;     // 不可约时段忽略
    this.setData({
      selectedSlotId: id,
      selectedSlotTime: slot.slotTime,
      info: { ...this.data.info, timeLabel: slot.slotTime }
    });
  },

  // ============ 选择课时 ============
  selectPkg(e) {
    const id = e.currentTarget.dataset.id;
    const pkg = this.data.pkgOptions.find(p => p.id === id);
    if (!pkg) return;
    this.setData({ selectedPkg: id, totalPrice: pkg.price.toFixed(2) });
  },

  onRemarkInput(e) { this.setData({ remark: e.detail.value }); },

  // ============ 支付方式 ============
  selectPay(e) {
    const method = e.currentTarget.dataset.method;
    this.setData({ payMethod: method });
    if (method === 'card' && !this.data.selectedMemberCardId && this.data.myMemberCards.length > 0) {
      this.setData({
        selectedMemberCardId: this.data.myMemberCards[0].id,
        selectedMemberCard: this.data.myMemberCards[0]
      });
    }
    if (method === 'wechat') {
      this.setData({ selectedMemberCardId: null, selectedMemberCard: null });
    }
  },

  // ============ 选择具体会员卡 ============
  selectMemberCard(e) {
    const id = e.currentTarget.dataset.id;
    const card = this.data.myMemberCards.find(c => c.id === id);
    if (card) {
      this.setData({ selectedMemberCardId: id, selectedMemberCard: card });
    }
  },

  goBuy() {
    wx.navigateTo({ url: '/pages/member-cards/member-cards' });
  },

  // ============ 提交 ============
  onSubmit() {
    if (this.data.submitting) return;
    if (!this.data.selectedSlotId) {
      wx.showToast({ title: '请先选择时段', icon: 'none' });
      return;
    }
    this.setData({ showConfirm: true });
  },

  cancelConfirm() { this.setData({ showConfirm: false }); },

  async confirmBook() {
    this.setData({ showConfirm: false });
    const token = app.globalData.token || wx.getStorageSync('token');
    if (!token) {
      wx.showModal({
        title: '请先登录',
        content: '您还未登录，前往登录？',
        success: (r) => { if (r.confirm) wx.reLaunch({ url: '/pages/login/login' }); }
      });
      return;
    }

    this.setData({ submitting: true });
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};

    const payload = {
      courseName: this.data.info.courseName,
      memberName: userInfo.nickname || '微信用户',
      phone: userInfo.phone || '',
      coach: this.data.coach,
      price: this.data.totalPrice,
      remark: this.data.remark || ''
    };

    if (this.data.payMethod === 'card') {
      if (!this.data.selectedMemberCardId) {
        wx.showToast({ title: '请选择会员卡', icon: 'none' });
        this.setData({ submitting: false });
        return;
      }
      payload.memberCardId = this.data.selectedMemberCardId;
    }

    try {
      const res = await api.bookPrivateSlot(this.data.selectedSlotId, payload);
      const successData = {
        courseName: this.data.info.courseName,
        date: this.data.selectedDate,
        time: this.data.selectedSlotTime,
        people: 1,
        price: this.data.totalPrice,
        payMethod: this.data.payMethod,
        payLabel: this.data.payMethod === 'wechat' ? '微信支付' : '会员卡',
        bookingId: (res && res.id) || null
      };
      wx.setStorageSync('lastPrivateBooking', successData);
      wx.redirectTo({ url: '/pages/private-booking-success/private-booking-success' });
    } catch (e) {
      this.setData({ submitting: false });
    }
  },

  goBack() { wx.navigateBack(); }
});
