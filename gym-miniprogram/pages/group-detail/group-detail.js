// pages/group-detail/group-detail.js
const api = require('../../utils/api.js');

const TABS = ['详情', '支持会员卡', '评论'];

// 教练库（按课程名匹配）
const COACH_INFO = {
  '魔鬼速度减脂课程': {
    name: '阿豪', emoji: '💪', colorIdx: 1,
    titles: ['全国十佳明星教练', '武汉市体适能协会会长', '竞技健美操国家一级运动员']
  },
  '核心力量训练': {
    name: '大壮', emoji: '🏋️', colorIdx: 0,
    titles: ['国家健美一级裁判', 'CBBA 高级私教认证', '十年力量训练经验']
  },
  '瑜伽塑形课': {
    name: '小美', emoji: '🧘', colorIdx: 4,
    titles: ['全美瑜伽联盟 RYT-500', '印度 Kaivalyadhama 认证', '十年瑜伽教学经验']
  },
  '搏击有氧': {
    name: '晓峰', emoji: '🥊', colorIdx: 2,
    titles: ['前省拳击队队员', 'IKF 国际搏击认证教练', '减脂塑形专家']
  },
  '普拉提入门': {
    name: '莉莉', emoji: '🤸', colorIdx: 5,
    titles: ['STOTT 普拉提认证教练', '体态调整专家', '产后修复认证']
  },
  '动感单车': {
    name: '阿豪', emoji: '🚴', colorIdx: 3,
    titles: ['RPM 国际单车认证', '心肺训练专家', '燃脂塑形教练']
  }
};

// 差异化课程内容（每门课给不同 section）
const COURSE_CONTENT = {
  '魔鬼速度减脂课程': [
    { title: '课程介绍', content: '训练动作进退阶、训练中保护、动作执行专业术语、训练中激励、训练中问题解答。', image: true, imageIdx: 1, imageEmoji: '🏃' },
    { title: '功能性伸展课程', content: '它是运动后恢复的主要手段，同时帮助客户调节身体肌肉平衡，缓解生活不良体态所带来的疼痛。', image: false }
  ],
  '核心力量训练': [
    { title: '运动康复', content: '它是通过运动来缓解会员在生活中产生腰背部疼痛，肩颈不适，关节受损等问题，针对会员的具体情况进行评估，设计，训练。', image: true, imageIdx: 4, imageEmoji: '🏋️' },
    { title: '工具训练', content: '运动前准备设计、动作进退阶设计、BOSU、敏捷梯、悬吊、药球、壶铃、VIPR 训练及运用和泡沫轴。', image: false }
  ],
  '瑜伽塑形课': [
    { title: '课程介绍', content: '哈他瑜伽基础体式、流瑜伽序列编排、呼吸控制法、冥想引导。塑形、放松，针对久坐人群特别有效。', image: true, imageIdx: 5, imageEmoji: '🧘' },
    { title: '课程收益', content: '改善体态、增强核心、缓解压力、提升睡眠质量。每节课后配合 10 分钟深度放松。', image: false }
  ],
  '搏击有氧': [
    { title: '课程介绍', content: '拳击基础动作 + 有氧间歇训练。每节课消耗 500-800 大卡，3 周见效。', image: true, imageIdx: 2, imageEmoji: '🥊' },
    { title: '安全须知', content: '所有训练佩戴专业手套（前台可借），高血压、心脏病等患者请提前告知教练。', image: false }
  ],
  '普拉提入门': [
    { title: '课程介绍', content: '垫上普拉提基础动作 + 小工具。适合初学者、产后妈妈、上班族。', image: true, imageIdx: 6, imageEmoji: '🤸' },
    { title: '课程效果', content: '8 节课塑造完美体态，提升核心力量。教练一对一指导，确保动作精准。', image: false }
  ],
  '动感单车': [
    { title: '课程介绍', content: '40 分钟高强度间歇骑行，模拟户外爬坡、平路、冲刺等场景，跟着节拍燃脂。', image: true, imageIdx: 3, imageEmoji: '🚴' },
    { title: '适合人群', content: '适合所有体能水平，强度可自由调节。膝盖不适者请提前咨询。', image: false }
  ]
};

// 会员卡模板（所有课程共用）
const MEMBER_CARDS = [
  { id: 1, name: '健身2次体验', typeLabel: '次卡类型', typeValue: '次卡', discount: '1次', venues: '全部场馆', theme: 'purple' },
  { id: 2, name: '健身黄金卡', typeLabel: '储值类型', typeValue: '储值卡', discount: '100元', venues: '全部场馆', theme: 'red' },
  { id: 3, name: '健身2次体验', typeLabel: '期限类型', typeValue: '期限卡', discount: '30天', venues: '全部场馆', theme: 'teal' }
];

// 评价模板（按课程名区分）
const REVIEW_TEMPLATES = {
  '魔鬼速度减脂课程': [
    { name: '张同学', avatarColor: 0, avatarText: '张', time: 20, text: '教练很帅，哈哈！', tags: ['强度适中', '适合新手'], imgs: [0, 1, 2, 3] },
    { name: '慢跑的', avatarColor: 1, avatarText: '慢', time: 20, text: '教练很帅，哈哈！', tags: ['强度适中', '适合新手'], imgs: [1, 2, 3, 4] },
    { name: '慢跑的', avatarColor: 2, avatarText: '慢', time: 20, text: '教练很帅，哈哈！', tags: ['强度适中', '适合新手'], imgs: [2, 3, 4, 5] }
  ],
  '核心力量训练': [
    { name: '王大力', avatarColor: 0, avatarText: '王', time: 15, text: '大壮教练讲得真细致，器械用法都讲清楚了！', tags: ['专业到位', '效果明显'], imgs: [0, 2, 4, 6] }
  ],
  '瑜伽塑形课': [
    { name: 'Lily', avatarColor: 4, avatarText: 'L', time: 5, text: '小美老师超温柔，体式很标准，环境也好。', tags: ['环境优雅', '老师nice'], imgs: [4, 5, 6, 7] },
    { name: '王女士', avatarColor: 1, avatarText: '王', time: 12, text: '第三次来打卡，体态真的有改善！', tags: ['效果明显'], imgs: [3, 5, 0, 6] }
  ],
  '搏击有氧': [
    { name: '打工人小李', avatarColor: 2, avatarText: '李', time: 30, text: '出汗超爽，晓峰教练动作示范清晰。', tags: ['出汗爆多', '燃脂高效'], imgs: [2, 4, 0, 5] }
  ],
  '普拉提入门': [
    { name: '新手妈妈', avatarColor: 5, avatarText: '新', time: 8, text: '莉莉老师很专业，产后修复效果明显。', tags: ['适合新手', '效果明显'], imgs: [5, 6, 0, 7] }
  ],
  '动感单车': [
    { name: '夜跑族', avatarColor: 3, avatarText: '夜', time: 60, text: '跟着节拍燃脂爽歪歪，氛围满分！', tags: ['氛围超棒', '燃脂高效'], imgs: [3, 4, 5, 6] }
  ]
};

const REVIEW_EMOJIS = ['🏃', '🏋️', '🥊', '🚴', '🧘', '🤸', '💪', '🏊'];

const GROUP_EMOJI = ['🏃', '🤸', '🥊', '🧘', '🚴', '🏊'];
const PRICE_TABLE = [19.9, 29.9, 39.9, 49.9, 59.9, 69.9];

Page({
  data: {
    tabs: TABS,
    tabIdx: 0,
    course: null,
    showConfirm: false,
    reviewEmojis: REVIEW_EMOJIS,
    schedule: null
  },

  onLoad(options) {
    // 从 booking 页带过来的课节信息
    const schedule = {
      id: options.scheduleId,
      courseId: parseInt(options.courseId, 10),
      courseName: decodeURIComponent(options.courseName || ''),
      date: options.date,
      startTime: options.startTime,
      endTime: options.endTime,
      coach: options.coach,
      capacity: parseInt(options.capacity || '4', 10),
      booked: parseInt(options.booked || '0', 10),
      status: options.status,
      venueName: options.venueName || '健身场馆'
    };
    this.setData({ schedule });
    this._buildCourse(schedule);
  },

  _buildCourse(schedule) {
    const idx = (schedule.courseId - 1) % GROUP_EMOJI.length;
    const coachInfo = COACH_INFO[schedule.courseName] || {
      name: schedule.coach || '教练', emoji: '💪', colorIdx: 0,
      titles: ['资深认证教练', '5 年以上教学经验', '一对一动作指导']
    };
    const sections = COURSE_CONTENT[schedule.courseName] || COURSE_CONTENT['魔鬼速度减脂课程'];
    const reviews = REVIEW_TEMPLATES[schedule.courseName] || REVIEW_TEMPLATES['魔鬼速度减脂课程'];

    const course = {
      id: schedule.courseId,
      name: schedule.courseName,
      emoji: GROUP_EMOJI[idx],
      colorIdx: schedule.courseId % 8,
      price: PRICE_TABLE[schedule.courseId % PRICE_TABLE.length].toFixed(2),
      originPrice: (PRICE_TABLE[schedule.courseId % PRICE_TABLE.length] * 6).toFixed(2),
      tag: schedule.courseName.split(' ')[0] || '热销',
      tagColor: 'FFB84D',
      reviewCount: reviews.length,
      coach: coachInfo.name,
      coachEmoji: coachInfo.emoji,
      coachColorIdx: coachInfo.colorIdx,
      coachTitles: coachInfo.titles,
      sections: sections.map(s => ({
        ...s,
        imageEmoji: s.imageEmoji || GROUP_EMOJI[(schedule.courseId + 1) % GROUP_EMOJI.length]
      })),
      memberCards: MEMBER_CARDS,
      reviews: reviews
    };
    this.setData({ course });
  },

  // ============ tab 切换 ============
  switchTab(e) {
    const idx = e.currentTarget.dataset.idx;
    if (idx === this.data.tabIdx) return;
    this.setData({ tabIdx: idx });
  },

  // ============ 约课流程 ============
  goBook() {
    if (!this.data.schedule) return;
    this.setData({ showConfirm: true });
  },

  cancelConfirm() { this.setData({ showConfirm: false }); },

  confirmBook() {
    this.setData({ showConfirm: false });
    const s = this.data.schedule;
    const c = this.data.course;
    // 跳到确认页
    const params = [
      `scheduleId=${s.id}`,
      `courseId=${s.id}`,                  // 用 scheduleId 作主键也行
      `courseName=${encodeURIComponent(s.courseName)}`,
      `date=${s.date}`,
      `startTime=${s.startTime}`,
      `endTime=${s.endTime}`,
      `coach=${encodeURIComponent(s.coach)}`,
      `capacity=${s.capacity}`,
      `booked=${s.booked}`,
      `venueName=${encodeURIComponent(s.venueName || '健身场馆')}`,
      `price=${c.price}`
    ].join('&');
    wx.navigateTo({ url: `/pages/booking-confirm/booking-confirm?${params}` });
  },

  // ============ 辅助操作 ============
  contactCoach() {
    wx.showToast({ title: '联系教练功能开发中', icon: 'none' });
  },

  shareCourse() {
    wx.showToast({ title: '分享课程功能开发中', icon: 'none' });
  },

  buyCard(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ title: `购买会员卡 ${id} 待开发`, icon: 'none' });
  }
});
