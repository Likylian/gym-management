// pages/private-detail/private-detail.js
const api = require('../../utils/api.js');

const TABS = ['详情', '支持会员卡', '评论'];
const REVIEW_EMOJIS = ['🏃', '🏋️', '🥊', '🚴', '🧘', '🤸', '💪', '🏊'];
const PRIVATE_EMOJI = ['💪', '🏃', '🥋', '🧘', '🏊'];

// 按课程名差异化
const COACH_INFO = {
  '私教减脂课程': {
    name: '阿豪', emoji: '💪', colorIdx: 1,
    titles: ['全国十佳明星教练', '武汉市体适能协会会长', '竞技健美操国家一级运动员']
  },
  '私教增肌课程': {
    name: '大壮', emoji: '🏋️', colorIdx: 0,
    titles: ['国家健美一级裁判', 'CBBA 高级私教认证', '十年力量训练经验']
  },
  '私教瑜伽课程': {
    name: '小美', emoji: '🧘', colorIdx: 4,
    titles: ['全美瑜伽联盟 RYT-500', '十年瑜伽教学经验', '产后修复认证']
  },
  '私教拳击训练': {
    name: '晓峰', emoji: '🥊', colorIdx: 2,
    titles: ['前省拳击队队员', 'IKF 国际搏击认证教练', '减脂塑形专家']
  }
};

const COURSE_CONTENT = {
  '私教减脂课程': [
    { title: '课程介绍', content: '训练动作进退阶、训练中保护、动作执行专业术语、训练中激励、训练中问题解答。', image: true, imageIdx: 1, imageEmoji: '🏃' },
    { title: '功能性伸展课程', content: '它是运动后恢复的主要手段，同时帮助客户调节身体肌肉平衡，缓解生活不良体态所带来的疼痛。', image: false }
  ],
  '私教增肌课程': [
    { title: '运动康复', content: '它是通过运动来缓解会员在生活中产生腰背部疼痛，肩颈不适，关节受损等问题，针对会员的具体情况进行评估，设计，训练。', image: true, imageIdx: 4, imageEmoji: '🏋️' },
    { title: '工具训练', content: '运动前准备设计、动作进退阶设计、BOSU、敏捷梯、悬吊、药球、壶铃、VIPR 训练及运用和泡沫轴。', image: false }
  ],
  '私教瑜伽课程': [
    { title: '课程介绍', content: '针对个人体态定制瑜伽方案，融合哈他、流瑜伽、艾扬格精华。每周 3 次，2 个月可见体态改善。', image: true, imageIdx: 5, imageEmoji: '🧘' },
    { title: '适合人群', content: '久坐人群、产后妈妈、瑜伽爱好者。每节课 60 分钟。', image: false }
  ],
  '私教拳击训练': [
    { title: '课程介绍', content: '专业拳击一对一教学。基本拳法、组合拳、实战对抗。提升反应速度与心肺能力。', image: true, imageIdx: 2, imageEmoji: '🥊' },
    { title: '安全须知', content: '训练全程佩戴专业装备，教练全程保护。', image: false }
  ]
};

// 会员卡主题色映射
const CARD_THEMES = {
  '次卡': 'purple',
  '储值': 'red',
  '储值卡': 'red',
  '期限': 'teal',
  '期限卡': 'teal'
};

const REVIEW_TEMPLATES = {
  '私教减脂课程': [
    { name: '王同学', avatarColor: 0, avatarText: '王', time: 20, text: '教练很专业，量身定制的方案！', tags: ['效果明显', '针对性强'], imgs: [0, 1, 2, 3] },
    { name: '慢跑的', avatarColor: 1, avatarText: '慢', time: 30, text: '2 个月瘦了 8 斤，赞！', tags: ['效果明显', '适合减脂'], imgs: [1, 2, 3, 4] }
  ],
  '私教增肌课程': [
    { name: '肌肉男', avatarColor: 0, avatarText: '肌', time: 15, text: '大壮教练专业度满分，3 个月胸围多了 3cm。', tags: ['专业到位', '效果明显'], imgs: [0, 2, 4, 6] }
  ],
  '私教瑜伽课程': [
    { name: 'Lily', avatarColor: 4, avatarText: 'L', time: 5, text: '小美老师超温柔，体式很标准。', tags: ['环境优雅', '老师nice'], imgs: [4, 5, 6, 7] }
  ],
  '私教拳击训练': [
    { name: '打工人小李', avatarColor: 2, avatarText: '李', time: 30, text: '晓峰教练动作示范清晰，出汗爽。', tags: ['出汗爆多', '燃脂高效'], imgs: [2, 4, 0, 5] }
  ]
};

Page({
  data: {
    tabs: TABS,
    tabIdx: 0,
    course: null,
    reviewEmojis: REVIEW_EMOJIS
  },

  onLoad(options) {
    this._buildCourse(options);
  },

  _buildCourse(options) {
    const courseId = parseInt(options.courseId || '0', 10);
    const courseName = decodeURIComponent(options.courseName || '');
    const coachInfo = COACH_INFO[courseName] || {
      name: options.coach || '教练', emoji: '💪', colorIdx: 0,
      titles: ['资深认证教练', '5 年以上教学经验', '一对一动作指导']
    };
    const sections = COURSE_CONTENT[courseName] || COURSE_CONTENT['私教减脂课程'];
    const reviews = REVIEW_TEMPLATES[courseName] || REVIEW_TEMPLATES['私教减脂课程'];

    const idx = (courseId - 1) % PRIVATE_EMOJI.length;
    this.setData({
      course: {
        id: courseId,
        name: courseName,
        emoji: PRIVATE_EMOJI[idx],
        colorIdx: courseId % 8,
        price1: 800.00,
        price6: 700.00,
        price10: 600.00,
        coach: coachInfo.name,
        coachEmoji: coachInfo.emoji,
        coachColorIdx: coachInfo.colorIdx,
        coachTitles: coachInfo.titles,
        sections: sections.map(s => ({
          ...s,
          imageEmoji: s.imageEmoji || PRIVATE_EMOJI[(courseId + 1) % PRIVATE_EMOJI.length]
        })),
        memberCards: [],
        reviews: reviews
      }
    });
    this._loadMemberCards();
  },

  // 从后端加载会员卡（用于"支持会员卡"tab）
  async _loadMemberCards() {
    try {
      const api = require('../../utils/api.js');
      const list = await api.getCardProducts();
      const cards = (list || []).map(c => ({
        id: c.id,
        name: c.name,
        typeLabel: c.cardType === '次卡' ? '次卡类型'
                : c.cardType === '储值' || c.cardType === '储值卡' ? '储值类型'
                : c.cardType === '期限' || c.cardType === '期限卡' ? '期限类型'
                : c.cardType,
        typeValue: c.cardType,
        discount: c.cardType === '次卡' ? `${c.times || 0}次`
                : c.cardType === '储值' || c.cardType === '储值卡' ? `${c.balance || 0}元`
                : c.cardType === '期限' || c.cardType === '期限卡' ? `${c.days || 0}天`
                : '',
        venues: c.supportedVenues || '全部场馆',
        theme: CARD_THEMES[c.cardType] || 'purple'
      }));
      const course = this.data.course || {};
      course.memberCards = cards;
      this.setData({ course });
    } catch (e) {
      // 静默失败
    }
  },

  switchTab(e) {
    const idx = e.currentTarget.dataset.idx;
    if (idx === this.data.tabIdx) return;
    this.setData({ tabIdx: idx });
  },

  // ============ 立即预约 → 跳私教约课确认页（带课节信息） ============
  goBook() {
    if (!this.data.course) return;
    const c = this.data.course;
    const params = [
      `courseId=${c.id}`,
      `courseName=${encodeURIComponent(c.name)}`,
      `coach=${encodeURIComponent(c.coach)}`,
      `price1=${c.price1}`,
      `price6=${c.price6}`,
      `price10=${c.price10}`,
      `venueName=${encodeURIComponent('健身场馆')}`
    ].join('&');
    wx.navigateTo({ url: `/pages/private-booking-confirm/private-booking-confirm?${params}` });
  },

  goBack() {
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/booking/booking' }) });
  },

  contactCoach() { wx.showToast({ title: '联系教练功能开发中', icon: 'none' }); },
  shareCourse() { wx.showToast({ title: '分享课程功能开发中', icon: 'none' }); },
  buyCard(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/card-detail/card-detail?id=${id}` });
  }
});
