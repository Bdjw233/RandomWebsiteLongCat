import { useEffect, useRef, useCallback, useState } from 'react'
import type { FragmentItem, FloatingFragment } from '../types'
import { COLOR_PALETTE } from '../data/fragments'

interface FragmentCanvasProps {
  /** 捕捉到碎片时的回调 */
  onCatch: (fragment: FragmentItem) => void
}

const FRAGMENT_POOL = [
  '星光不问赶路人', '心有猛虎', '上善若水', '采菊东篱下', '大道至简',
  '知行合一', '万物有灵', '时光不负', '悠然见南山', '柳暗花明',
  'Less is more', 'Think different', 'Stay foolish', '万物皆有裂痕',
  '把记忆的形状', '用代码写诗', '会呼吸的界面', '城市的声景',
  '时间装置', 'AI 重绘梦境', '星星的社交网络', '三维梦境',
]

/** 交互画布：碎片漂浮、鼠标排斥、点击捕捉 */
export default function FragmentCanvas({ onCatch }: FragmentCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fragmentsRef = useRef<FloatingFragment[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const rafRef = useRef<number>(0)
  const caughtCountRef = useRef(0)
  const [caughtCount, setCaughtCount] = useState(0)

  /** 生成一个漂浮碎片 */
  const spawnFragment = useCallback((width: number, height: number, fromEdge = false): FloatingFragment => {
    const palette = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)]
    const content = FRAGMENT_POOL[Math.floor(Math.random() * FRAGMENT_POOL.length)]
    const size = 40 + Math.random() * 50
    const edge = Math.floor(Math.random() * 4)
    let x = Math.random() * width
    let y = Math.random() * height

    if (fromEdge) {
      if (edge === 0) { x = -size; y = Math.random() * height }
      else if (edge === 1) { x = width + size; y = Math.random() * height }
      else if (edge === 2) { y = -size; x = Math.random() * width }
      else { y = height + size; x = Math.random() * width }
    }

    return {
      id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      content,
      category: 'idea',
      color: palette.color,
      accent: palette.accent,
      x,
      y,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.01,
      opacity: 0,
      shape: Math.floor(Math.random() * 4),
      glow: 0.6 + Math.random() * 0.4,
    }
  }, [])

  /** 绘制单个碎片 */
  const drawFragment = useCallback((ctx: CanvasRenderingContext2D, f: FloatingFragment) => {
    ctx.save()
    ctx.translate(f.x, f.y)
    ctx.rotate(f.rotation)
    ctx.globalAlpha = f.opacity

    const { size, color, accent, shape, glow } = f

    // 外层光晕
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.2)
    gradient.addColorStop(0, `${color}${Math.round(glow * 60).toString(16).padStart(2, '0')}`)
    gradient.addColorStop(1, `${color}00`)
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(0, 0, size * 1.2, 0, Math.PI * 2)
    ctx.fill()

    // 主体形状
    ctx.fillStyle = `${color}22`
    ctx.strokeStyle = `${accent}cc`
    ctx.lineWidth = 1.5

    ctx.beginPath()
    if (shape === 0) {
      // 圆形
      ctx.arc(0, 0, size * 0.55, 0, Math.PI * 2)
    } else if (shape === 1) {
      // 菱形
      ctx.moveTo(0, -size * 0.6)
      ctx.lineTo(size * 0.6, 0)
      ctx.lineTo(0, size * 0.6)
      ctx.lineTo(-size * 0.6, 0)
      ctx.closePath()
    } else if (shape === 2) {
      // 三角形
      ctx.moveTo(0, -size * 0.6)
      ctx.lineTo(size * 0.55, size * 0.4)
      ctx.lineTo(-size * 0.55, size * 0.4)
      ctx.closePath()
    } else {
      // 六边形
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i
        const px = Math.cos(angle) * size * 0.55
        const py = Math.sin(angle) * size * 0.55
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
    }
    ctx.fill()
    ctx.stroke()

    // 中心亮点
    const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.3)
    coreGrad.addColorStop(0, `${accent}ee`)
    coreGrad.addColorStop(1, `${color}00`)
    ctx.fillStyle = coreGrad
    ctx.beginPath()
    ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2)
    ctx.fill()

    // 文字
    ctx.globalAlpha = f.opacity * 0.9
    ctx.fillStyle = '#ffffff'
    ctx.font = `500 ${Math.max(11, size * 0.28)}px "Noto Serif SC", serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = color
    ctx.shadowBlur = 8
    ctx.fillText(f.content, 0, 0, size * 1.4)

    ctx.restore()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // 初始化碎片
    const initial: FloatingFragment[] = []
    for (let i = 0; i < 18; i++) {
      initial.push(spawnFragment(width, height))
    }
    fragmentsRef.current = initial

    /** 动画主循环 */
    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      const mouse = mouseRef.current
      const list = fragmentsRef.current

      for (let i = 0; i < list.length; i++) {
        const f = list[i]

        // 鼠标排斥力
        const dx = f.x - mouse.x
        const dy = f.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const repelRadius = 120
        if (dist < repelRadius && dist > 0) {
          const force = (1 - dist / repelRadius) * 1.5
          f.vx += (dx / dist) * force
          f.vy += (dy / dist) * force
        }

        // 阻尼
        f.vx *= 0.98
        f.vy *= 0.98

        // 最低速度，保持漂浮
        const speed = Math.sqrt(f.vx * f.vx + f.vy * f.vy)
        if (speed < 0.15) {
          f.vx += (Math.random() - 0.5) * 0.08
          f.vy += (Math.random() - 0.5) * 0.08
        }

        f.x += f.vx
        f.y += f.vy
        f.rotation += f.rotationSpeed

        // 淡入
        if (f.opacity < 1) f.opacity = Math.min(1, f.opacity + 0.01)

        // 边缘回绕
        const margin = f.size * 2
        if (f.x < -margin) f.x = width + margin
        if (f.x > width + margin) f.x = -margin
        if (f.y < -margin) f.y = height + margin
        if (f.y > height + margin) f.y = -margin

        drawFragment(ctx, f)
      }

      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [drawFragment, spawnFragment])

  /** 鼠标移动 */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 } }
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
    return () => {
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  /** 点击捕捉 */
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    const list = fragmentsRef.current
    let closest: FloatingFragment | null = null
    let closestDist = Infinity

    for (const f of list) {
      const dx = f.x - clickX
      const dy = f.y - clickY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < f.size && dist < closestDist) {
        closest = f
        closestDist = dist
      }
    }

    if (closest) {
      const target = closest as FloatingFragment
      // 移除被捕捉的碎片
      fragmentsRef.current = list.filter((f) => f.id !== target.id)

      // 生成一个替代碎片
      const canvas2 = canvasRef.current
      if (canvas2) {
        const rect2 = canvas2.getBoundingClientRect()
        const replacement = spawnFragment(rect2.width, rect2.height, true)
        fragmentsRef.current.push(replacement)
      }

      caughtCountRef.current += 1
      setCaughtCount(caughtCountRef.current)

      onCatch({
        id: target.id,
        content: target.content,
        category: target.category,
        color: target.color,
        accent: target.accent,
        caughtAt: Date.now(),
      })
    }
  }

  return (
    <div className="fragment-canvas-wrap">
      <canvas
        ref={canvasRef}
        className="fragment-canvas"
        onClick={handleClick}
        role="img"
        aria-label="漂浮的灵感碎片画布，点击捕捉碎片"
      />
      <div className="canvas-hint">
        <span className="hint-icon">✦</span>
        点击漂浮的碎片，捕捉你的灵感
      </div>
      <div className="canvas-counter">
        已捕捉 <strong>{caughtCount}</strong> 片
      </div>
    </div>
  )
}
