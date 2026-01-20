/**
 * 分享平台
 */
export const SHARE_PLATFORMS = [
  {
    id: 'wechat',
    name: '微信好友',
    icon: '💬',
    color: '#07C160',
  },
  {
    id: 'moments',
    name: '朋友圈',
    icon: '⭕',
    color: '#07C160',
  },
  {
    id: 'weibo',
    name: '微博',
    icon: '📢',
    color: '#E6162D',
  },
  {
    id: 'xiaohongshu',
    name: '小红书',
    icon: '📕',
    color: '#FE2C55',
  },
] as const;

/**
 * 分享文案模板
 */
export const SHARE_TEMPLATES = {
  default: '我家主子的内心戏，太真实了 😂 #宠灵感 #宠物内心戏',
  funny: '原来我家主子心里是这么想的 🤣 #宠物搞笑',
  cute: '萌化了！看看我家宝贝在想什么 🥰 #萌宠日常',
} as const;
