import type { FragmentItem } from '../types'

/**
 * 环境氛围音乐引擎
 * 根据灵感碎片的颜色分布，用 Web Audio API 生成环境音景。
 * - 颜色色相 → 基础频率
 * - 碎片数量 → 声部数量
 * - 明暗程度 → 音量与滤波
 */

// 色相 → 音高（半音偏移，基于 A 大调五声音阶）
const SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24]

function hexToHue(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  if (d === 0) return 0
  let h: number
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return h
}

function freqFromSemis(semis: number): number {
  return 220 * Math.pow(2, semis / 12)
}

export class AtmosphereEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private oscillators: OscillatorNode[] = []
  private lfos: OscillatorNode[] = []
  private running = false

  /** 根据碎片集合重新生成音景 */
  build(items: FragmentItem[]): void {
    if (!this.ctx || !this.running) return
    this.teardown()

    if (items.length === 0) return

    const ctx = this.ctx
    this.masterGain = ctx.createGain()
    this.masterGain.gain.value = 0
    this.masterGain.connect(ctx.destination)

    // 目标音量淡入
    this.masterGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2)

    // 每种颜色对应一个振荡器
    const voices = Math.min(items.length, 5)
    for (let i = 0; i < voices; i++) {
      const item = items[i % items.length]
      const hue = hexToHue(item.color)
      const semitone = SCALE[Math.floor(hue * SCALE.length) % SCALE.length]

      const osc = ctx.createOscillator()
      osc.type = i % 2 === 0 ? 'sine' : 'triangle'
      osc.frequency.value = freqFromSemis(semitone)

      const gain = ctx.createGain()
      gain.gain.value = 0.25 / voices

      // LFO 让声音缓慢起伏
      const lfo = ctx.createOscillator()
      lfo.type = 'sine'
      lfo.frequency.value = 0.05 + Math.random() * 0.08
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 0.12 / voices
      lfo.connect(lfoGain)
      lfoGain.connect(gain.gain)

      osc.connect(gain)
      gain.connect(this.masterGain)
      osc.start()
      lfo.start()
      this.oscillators.push(osc)
      this.lfos.push(lfo)
    }
  }

  private teardown(): void {
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1)
      const oldMaster = this.masterGain
      setTimeout(() => {
        this.oscillators.forEach((o) => { try { o.stop() } catch { /* noop */ } })
        this.lfos.forEach((l) => { try { l.stop() } catch { /* noop */ } })
        oldMaster.disconnect()
      }, 1200)
    }
    this.oscillators = []
    this.lfos = []
    this.masterGain = null
  }

  async start(items: FragmentItem[]): Promise<void> {
    if (this.running) {
      this.build(items)
      return
    }
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    this.ctx = new Ctor()
    this.running = true
    await this.ctx.resume()
    this.build(items)
  }

  stop(): void {
    this.running = false
    this.teardown()
  }

  get isRunning(): boolean {
    return this.running
  }
}
