/**
 * 图片滤镜配置
 */
export const FILTERS = {
  none: {
    name: '原图',
    css: '',
  },
  vintage: {
    name: '复古',
    css: 'sepia(0.4) contrast(1.1) brightness(0.9)',
  },
  blackwhite: {
    name: '黑白',
    css: 'grayscale(1) contrast(1.2)',
  },
} as const;

/**
 * 可用字体
 */
export const FONTS = [
  { id: 'zcool-kuaile', name: 'ZCOOL KuaiLe', family: '"ZCOOL KuaiLe", cursive' },
  { id: 'noto-sans', name: '思源黑体', family: '"Noto Sans SC", sans-serif' },
  { id: 'noto-serif', name: '思源宋体', family: '"Noto Serif SC", serif' },
  { id: 'long-cang', name: '龙藏体', family: '"Long Cang", cursive' },
  { id: 'zhi-mang-xing', name: '芝麻行', family: '"Zhi Mang Xing", cursive' },
] as const;

/**
 * 默认文字样式
 */
export const DEFAULT_TEXT_STYLE = {
  fontFamily: FONTS[0].family,
  fontSize: 24,
  color: '#FFFFFF',
  strokeColor: '#000000',
  strokeWidth: 2,
  isBold: true,
} as const;

/**
 * 默认文字位置
 */
export const DEFAULT_TEXT_POSITION = {
  x: 50,
  y: 80,
  rotation: 0,
} as const;

/**
 * 水印配置
 */
export const WATERMARK = {
  text: 'PetSoul 宠灵感',
  position: { x: 95, y: 95 },
  fontSize: 12,
  color: 'rgba(255, 255, 255, 0.6)',
} as const;
