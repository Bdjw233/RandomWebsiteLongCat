import type { FragmentItem } from '../types'

/** 灵感碎片的内容池 —— 中文为主，间有英文短句 */
const RAW_POOL: Array<{ content: string; category: FragmentItem['category'] }> = [
  { content: '星光不问赶路人，时光不负有心人', category: 'quote' },
  { content: '愿你的一生，有云可停，有海可看', category: 'quote' },
  { content: '凡是过往，皆为序章', category: 'quote' },
  { content: '心有猛虎，细嗅蔷薇', category: 'quote' },
  { content: '生如夏花之绚烂，死如秋叶之静美', category: 'quote' },
  { content: '把每一个黎明当作生命的开始', category: 'quote' },
  { content: '愿你被这个世界温柔以待', category: 'quote' },
  { content: '不忘初心，方得始终', category: 'quote' },
  { content: '山中无甲子，寒尽不知年', category: 'quote' },
  { content: '愿你出走半生，归来仍是少年', category: 'quote' },
  { content: '大道至简，大音希声', category: 'philosophy' },
  { content: '知人者智，自知者明', category: 'philosophy' },
  { content: '上善若水，水善利万物而不争', category: 'philosophy' },
  { content: '天地有大美而不言', category: 'philosophy' },
  { content: '无为而无不为', category: 'philosophy' },
  { content: '万物并育而不相害，道并行而不相悖', category: 'philosophy' },
  { content: '己所不欲，勿施于人', category: 'philosophy' },
  { content: '知行合一', category: 'philosophy' },
  { content: '采菊东篱下，悠然见南山', category: 'poetry' },
  { content: '明月松间照，清泉石上流', category: 'poetry' },
  { content: '落霞与孤鹜齐飞，秋水共长天一色', category: 'poetry' },
  { content: '疏影横斜水清浅，暗香浮动月黄昏', category: 'poetry' },
  { content: '山重水复疑无路，柳暗花明又一村', category: 'poetry' },
  { content: '长风破浪会有时，直挂云帆济沧海', category: 'poetry' },
  { content: '人生如逆旅，我亦是行人', category: 'poetry' },
  { content: '此情可待成追忆，只是当时已惘然', category: 'poetry' },
  { content: '海上生明月，天涯共此时', category: 'poetry' },
  { content: 'What we think, we become.', category: 'word' },
  { content: 'Stay hungry, stay foolish.', category: 'word' },
  { content: 'Less is more.', category: 'word' },
  { content: 'Make it simple, but significant.', category: 'word' },
  { content: 'Think different.', category: 'word' },
  { content: 'Between stimulus and response there is a space.', category: 'word' },
  { content: 'Simplicity is the ultimate sophistication.', category: 'word' },
  { content: '给记忆一个形状', category: 'idea' },
  { content: '用代码写一首诗', category: 'idea' },
  { content: '设计一个会呼吸的界面', category: 'idea' },
  { content: '把城市的声音可视化', category: 'idea' },
  { content: '做一个关于时间的交互装置', category: 'idea' },
  { content: '用 AI 重绘童年记忆', category: 'idea' },
  { content: '为星星建立一个社交网络', category: 'idea' },
  { content: '把梦境记录成三维场景', category: 'idea' },
  { content: '万物皆有裂痕，那是光照进来的地方', category: 'quote' },
  { content: '人生没有白走的路，每一步都算数', category: 'quote' },
  { content: '种一棵树最好的时间是十年前，其次是现在', category: 'quote' },
  { content: '愿你眼里有光，心中有爱，脚下有路', category: 'quote' },
  { content: '在有限的生命里，体验无限的生活', category: 'quote' },
]

/** 荧光色板 —— 用于碎片配色 */
export const COLOR_PALETTE: Array<{ color: string; accent: string }> = [
  { color: '#6366f1', accent: '#a5b4fc' }, // indigo
  { color: '#ec4899', accent: '#f9a8d4' }, // pink
  { color: '#8b5cf6', accent: '#c4b5fd' }, // violet
  { color: '#06b6d4', accent: '#67e8f9' }, // cyan
  { color: '#10b981', accent: '#6ee7b7' }, // emerald
  { color: '#f59e0b', accent: '#fcd34d' }, // amber
  { color: '#ef4444', accent: '#fca5a5' }, // red
  { color: '#3b82f6', accent: '#93c5fd' }, // blue
  { color: '#d946ef', accent: '#f0abfc' }, // fuchsia
  { color: '#14b8a6', accent: '#5eead4' }, // teal
]

/** 分类对应的图标与名称 */
export const CATEGORY_META: Record<FragmentItem['category'], { label: string; icon: string }> = {
  quote: { label: '名言', icon: '❝' },
  poetry: { label: '诗句', icon: '❧' },
  philosophy: { label: '哲思', icon: '☯' },
  idea: { label: '创意', icon: '✦' },
  word: { label: '英文', icon: '✧' },
}

/** 随机生成一片碎片（含配色与 ID） */
export function generateFragment(): FragmentItem {
  const raw = RAW_POOL[Math.floor(Math.random() * RAW_POOL.length)]
  const palette = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)]
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    content: raw.content,
    category: raw.category,
    color: palette.color,
    accent: palette.accent,
    caughtAt: Date.now(),
  }
}

/** 初始的灵感碎片集合（首次访问时展示） */
export function getSeedFragments(): FragmentItem[] {
  const seedIndices = [0, 18, 12, 28, 34, 6, 24]
  return seedIndices.map((i) => {
    const raw = RAW_POOL[i]
    const palette = COLOR_PALETTE[i % COLOR_PALETTE.length]
    return {
      id: `seed-${i}-${Math.random().toString(36).slice(2, 7)}`,
      content: raw.content,
      category: raw.category,
      color: palette.color,
      accent: palette.accent,
      caughtAt: Date.now() - (seedIndices.length - i) * 60000,
    }
  })
}
