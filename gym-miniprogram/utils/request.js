// utils/request.js - 统一请求封装
const app = getApp();

/**
 * 通用请求方法
 * @param {Object} options
 * @param {string} options.url    后端路径，如 '/api/member/login'
 * @param {string} options.method HTTP 方法，默认 POST
 * @param {Object} options.data   请求体
 * @param {boolean} options.auth  是否需要带 token
 */
function request({ url, method = 'POST', data = {}, auth = false, header = {} }) {
  const fullUrl = /^https?:\/\//.test(url) ? url : app.globalData.baseURL + url;
  const finalHeader = { 'Content-Type': 'application/json', ...header };
  if (auth) {
    const token = app.globalData.token || wx.getStorageSync('token');
    if (token) finalHeader['Authorization'] = 'Bearer ' + token;
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: fullUrl,
      method,
      data,
      header: finalHeader,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const body = res.data;
          if (body && typeof body.code !== 'undefined') {
            if (body.code === 200) {
              resolve(body.data);
            } else {
              wx.showToast({ title: body.message || '请求失败', icon: 'none' });
              reject(body);
            }
          } else {
            resolve(body);
          }
        } else if (res.statusCode === 401) {
          wx.showToast({ title: '登录已过期', icon: 'none' });
          app.clearLoginState();
          reject(res);
        } else {
          wx.showToast({ title: '网络异常(' + res.statusCode + ')', icon: 'none' });
          reject(res);
        }
      },
      fail(err) {
        wx.showToast({ title: '网络连接失败', icon: 'none' });
        reject(err);
      }
    });
  });
}

module.exports = { request };
