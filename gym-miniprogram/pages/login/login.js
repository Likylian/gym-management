// pages/login/login.js
const api = require('../../utils/api.js');
const app = getApp();

const PHONE_REG = /^1[3-9]\d{9}$/;
const COUNTDOWN_SECONDS = 60;

Page({
  data: {
    phone: '',
    code: '',
    agreed: false,
    loading: false,
    countdown: 0
  },

  _timer: null,

  onUnload() {
    if (this._timer) clearInterval(this._timer);
  },

  // ---------- 输入 ----------
  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onCodeInput(e) {
    this.setData({ code: e.detail.value });
  },

  // ---------- 协议勾选 ----------
  toggleAgree() {
    this.setData({ agreed: !this.data.agreed });
  },

  goAgreement() {
    wx.navigateTo({ url: '/pages/agreement/agreement' });
  },

  goPrivacy() {
    wx.navigateTo({ url: '/pages/privacy/privacy' });
  },

  // ---------- 发送验证码 ----------
  onSendCode() {
    if (this.data.countdown > 0) return;

    const phone = this.data.phone.trim();
    if (!PHONE_REG.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }

    api.sendCode(phone)
      .then(() => {
        wx.showToast({ title: '验证码已发送', icon: 'success' });
        this._startCountdown();
      })
      .catch(() => {
        // 错误提示已在 request.js 统一处理
      });
  },

  _startCountdown() {
    this.setData({ countdown: COUNTDOWN_SECONDS });
    this._timer = setInterval(() => {
      const next = this.data.countdown - 1;
      if (next <= 0) {
        clearInterval(this._timer);
        this._timer = null;
        this.setData({ countdown: 0 });
      } else {
        this.setData({ countdown: next });
      }
    }, 1000);
  },

  // ---------- 登录 ----------
  onLogin() {
    if (this.data.loading) return;

    const phone = this.data.phone.trim();
    const code = this.data.code.trim();

    if (!PHONE_REG.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      wx.showToast({ title: '请输入六位动态码', icon: 'none' });
      return;
    }
    if (!this.data.agreed) {
      wx.showToast({ title: '请先勾选用户协议和隐私政策', icon: 'none' });
      return;
    }

    this.setData({ loading: true });

    api.memberLogin(phone, code)
      .then((res) => {
        // res 即后端返回的 data：{ token, member: {...} } 或旧版 { token, username, nickname, avatar }
        const token = res.token || res.accessToken;
        const userInfo = res.member || {
          username: res.username,
          nickname: res.nickname,
          avatar: res.avatar,
          phone
        };
        if (!token) {
          wx.showToast({ title: '登录失败：未返回 token', icon: 'none' });
          return;
        }
        app.saveLoginState(token, userInfo);
        wx.showToast({ title: '登录成功', icon: 'success' });
        // 登录成功后跳转到首页（tabBar 页）
        setTimeout(() => {
          wx.switchTab({ url: '/pages/index/index' });
        }, 600);
      })
      .catch(() => {
        this.setData({ loading: false });
      });
  }
});
