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
    submitting: false
  },

  onLoad(options) {
    const schedule = {
      id: options.scheduleId,
      courseId: options.courseId,
      courseName: decodeURIComponent(options.courseName || ''),
      date: options.date,
      startTime: options.startTime,
      endTime: options.endTime,
      coach: decodeURIComponent(options.coach || ''),
      capacity: parseInt(options.capacity || '4', 10),
      booked: parseInt(options.booked || '0', 10),
      venueName: decodeURIComponent(options.venueName || '')
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
  },

  goBack() { wx.navigateBack(); },

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
    this.setData({ payMethod: e.currentTarget.dataset.method });
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
      memberCard: this.data.payMethod === 'card' ? '体验次卡' : '',
      remark: this.data.remark || '',
      status: '已预约'
    };

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
