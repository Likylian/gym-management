// pages/booking-confirm/booking-confirm.js
const api = require('../../utils/api.js');
const app = getApp();

const WEEKS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function dateLabel(dateStr) {
  // 2026-07-20 → 2026-07-20 (周一)
  const d = new Date(dateStr);
  return `${dateStr}（${WEEKS[d.getDay()]}）`;
}

Page({
  data: {
    info: {
      courseName: '',
      dateLabel: '',
      timeLabel: '',
      venueName: '',
      coach: '',
      capacity: 4
    },
    people: 1,
    remark: '',
    payMethod: 'wechat',  // wechat | card
    price: 0,
    schedule: null,
    submitting: false,
    myMemberCards: [],          // 当前用户已购卡（仅 status=1）
    selectedMemberCardId: null, // 选中的会员卡
    selectedMemberCard: null    // 选中的卡详情
  },

  onLoad(options) {
    // 安全的 URL 解码：无论上游传过来的是单次编码还是双重编码，都能解出原始字符串
    const safeDecode = (s) => {
      if (!s) return '';
      const v = decodeURIComponent(s);
      // 解完一次还是 URL 编码形式（双重编码），再解一次
      return /%[0-9A-Fa-f]{2}/.test(v) ? decodeURIComponent(v) : v;
    };
    const schedule = {
      id: options.scheduleId,
      courseId: options.courseId,
      courseName: safeDecode(options.courseName),
      date: options.date,
      startTime: options.startTime,
      endTime: options.endTime,
      coach: safeDecode(options.coach),
      capacity: parseInt(options.capacity || '4', 10),
      booked: parseInt(options.booked || '0', 10),
      venueName: safeDecode(options.venueName || '健身场馆')
    };
    const price = parseFloat(options.price || '0');
    this.setData({
      schedule,
      price,
      info: {
        courseName: schedule.courseName,
        dateLabel: dateLabel(schedule.date),
        timeLabel: `${schedule.startTime} ~ ${schedule.endTime}`,
        venueName: schedule.venueName,
        coach: schedule.coach,
        capacity: schedule.capacity
      }
    });
    this._loadMyMemberCards();
  },

  // 加载当前用户的已购卡（status=1 有效）
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

  goBack() { wx.navigateBack(); },

  // 跳去购买会员卡
  goBuy() {
    wx.navigateTo({ url: '/pages/member-cards/member-cards' });
  },

  // ============ stepper ============
  onMinus() {
    if (this.data.people > 1) this.setData({ people: this.data.people - 1 });
  },
  onPlus() {
    if (this.data.people < this.data.schedule.capacity) this.setData({ people: this.data.people + 1 });
    else wx.showToast({ title: '已达最大人数', icon: 'none' });
  },

  // ============ 备注 ============
  onRemarkInput(e) { this.setData({ remark: e.detail.value }); },

  // ============ 支付方式 ============
  selectPay(e) {
    const method = e.currentTarget.dataset.method;
    this.setData({ payMethod: method });
    // 切到会员卡时，如果还没选过，自动选第一张
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

  // ============ 提交预约 ============
  async onSubmit() {
    if (this.data.submitting) return;
    const token = app.globalData.token || wx.getStorageSync('token');
    if (!token) {
      wx.showModal({
        title: '请先登录',
        content: '您还未登录，前往登录？',
        success: (res) => { if (res.confirm) wx.reLaunch({ url: '/pages/login/login' }); }
      });
      return;
    }

    this.setData({ submitting: true });
    const s = this.data.schedule;
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
    const phone = userInfo.phone || s.venueName;  // 兜底用 venueName 避免空指针

    const payload = {
      courseName: s.courseName,
      memberName: userInfo.nickname || userInfo.username || '微信用户',
      phone: phone,
      people: this.data.people,
      courseTime: `${s.date} ${s.startTime}-${s.endTime}`,
      coach: s.coach,
      memberCard: '',
      remark: this.data.remark || '',
      status: '已预约'
    };

    // 会员卡支付：传 memberCardId
    if (this.data.payMethod === 'card') {
      if (!this.data.selectedMemberCardId) {
        wx.showToast({ title: '请选择会员卡', icon: 'none' });
        this.setData({ submitting: false });
        return;
      }
      payload.memberCardId = this.data.selectedMemberCardId;
    }

    try {
      const res = await api.createBooking(payload);
      // 把这次订单关键信息存到 storage，给成功页读取
      const successData = {
        courseName: s.courseName,
        date: s.date,
        time: `${s.startTime} - ${s.endTime}`,
        people: this.data.people,
        price: (this.data.price * this.data.people).toFixed(2),
        payMethod: this.data.payMethod,
        payLabel: this.data.payMethod === 'wechat' ? '微信支付' : '会员卡',
        bookingId: (res && res.id) || null
      };
      wx.setStorageSync('lastBooking', successData);
      wx.redirectTo({ url: '/pages/booking-success/booking-success' });
    } catch (e) {
      this.setData({ submitting: false });
      // 后端报错已在 request.js 里统一 toast
    }
  }
});
