/** 一片灵感碎片的数据结构 */
export interface FragmentItem {
  /** 唯一 ID */
  id: string
  /** 文字内容 */
  content: string
  /** 分类标签 */
  category: 'quote' | 'poetry' | 'philosophy' | 'idea' | 'word'
  /** 主色调（hex） */
  color: string
  /** 辅色（hex） */
  accent: string
  /** 捕捉时间戳 */
  caughtAt: number
}

/** 画布中漂浮的碎片（含运动状态） */
export interface FloatingFragment {
  id: string
  content: string
  category: FragmentItem['category']
  color: string
  accent: string
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rotation: number
  rotationSpeed: number
  opacity: number
  shape: number
  glow: number
}

/** 网站整体状态 */
export type AtmosphereMode = 'calm' | 'dreamy' | 'energetic'
