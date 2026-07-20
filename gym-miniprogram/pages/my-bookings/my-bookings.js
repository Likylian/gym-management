// pages/my-bookings/my-bookings.js
const api = require('../../utils/api.js');
const app = getApp();

Page({
  data: {
    bookings: [],
    loading: true
  },

  onShow() {
    this._loadBookings();
  },

  onPullDownRefresh() {
    this._loadBookings().finally(() => wx.stopPullDownRefresh());
  },

  async _loadBookings() {
    this.setData({ loading: true });
    try {
      const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
      const token = app.globalData.token || wx.getStorageSync('token') || '';
      // 调试日志：看清用户态和 token
      console.log('[my-bookings] userInfo=', userInfo, 'token exists=', !!token);

      // 优先用手机号，再 username，再 nickname 作 keyword
      const keyword = userInfo.phone || userInfo.username || userInfo.nickname || '';

      // 不带 keyword 也拉一次，看后端是否真返回数据
      const res = await api.getMyBookings({ pageSize: 50, keyword });
      const allRecords = (res && res.records) || [];
      console.log('[my-bookings] keyword=', keyword, '后端返回', allRecords.length, '条');

      // 在 JS 里再过滤一次（兜底，防后端 keyword 漏字段）
      const filtered = keyword
        ? allRecords.filter(b =>
            b.phone === keyword ||
            b.memberName === keyword ||
            (b.courseName && b.courseName.indexOf(keyword) >= 0))
        : allRecords;
      console.log('[my-bookings] filtered=', filtered, 'filtered.length=', filtered.length);

      this.setData({
        bookings: filtered.map(b => ({
          ...b,
          statusClass: b.status === '已预约' ? 'booked'
            : b.status === '已签到' ? 'done' : 'canceled',
          bookingTime: this._formatTime(b.bookingTime),
          courseTime: b.courseTime ? b.courseTime.split('.')[0] : ''
        })),
        loading: false
      });
      console.log('[my-bookings] setData 后 this.data.bookings.length=', this.data.bookings.length);
    } catch (e) {
      console.log('[my-bookings] 出错', e);
      this.setData({ bookings: [], loading: false });
    }
  },

  _formatTime(t) {
    if (!t) return '';
    // 2026-07-20T15:06:35 → 2026-07-20 15:06
    return String(t).replace('T', ' ').substring(0, 16);
  },

  onCancel(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '取消预约',
      content: '确定要取消这个预约吗？取消后时段将被释放。',
      confirmColor: '#FF4D4F',
      success: async (res) => {
        if (!res.confirm) return;
        try {
          await api.cancelBooking(id);
          wx.showToast({ title: '已取消', icon: 'success' });
          this._loadBookings();
        } catch (err) {
          // 错误已在 request.js 统一提示
        }
      }
    });
  },

  goBack() {
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/mine/mine' }) });
  }
});
