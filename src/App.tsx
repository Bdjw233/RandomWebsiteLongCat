import { useEffect, useRef, useState, useCallback } from 'react'
import type { FragmentItem } from './types'
import { loadFragments, saveFragments } from './lib/storage'
import { AtmosphereEngine } from './lib/audio'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FragmentCanvas from './components/FragmentCanvas'
import Collection from './components/Collection'
import DriftBottle from './components/DriftBottle'
import Footer from './components/Footer'

export default function App() {
  const [fragments, setFragments] = useState<FragmentItem[]>(() => loadFragments())
  const [atmosphereOn, setAtmosphereOn] = useState(false)
  const audioRef = useRef<AtmosphereEngine | null>(null)

  // 持久化
  useEffect(() => {
    saveFragments(fragments)
  }, [fragments])

  /** 捕捉到一片碎片 */
  const handleCatch = useCallback((fragment: FragmentItem) => {
    setFragments((prev) => [fragment, ...prev])
  }, [])

  /** 移除一片碎片 */
  const handleRemove = useCallback((id: string) => {
    setFragments((prev) => prev.filter((f) => f.id !== id))
  }, [])

  /** 清空灵感墙 */
  const handleClear = useCallback(() => {
    if (window.confirm('确定要清空整面灵感墙吗？')) {
      setFragments([])
    }
  }, [])

  /** 导入漂流瓶 */
  const handleImport = useCallback((imported: FragmentItem[]) => {
    setFragments((prev) => {
      const existingIds = new Set(prev.map((f) => f.id))
      const newItems = imported.filter((f) => !existingIds.has(f.id))
      return [...newItems, ...prev]
    })
  }, [])

  /** 平滑滚动到指定区域 */
  const handleNavigate = useCallback((section: string) => {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  /** 切换氛围音景 */
  const handleToggleAtmosphere = useCallback(async () => {
    if (!audioRef.current) {
      audioRef.current = new AtmosphereEngine()
    }
    const engine = audioRef.current
    if (atmosphereOn) {
      engine.stop()
      setAtmosphereOn(false)
    } else {
      await engine.start(fragments)
      setAtmosphereOn(true)
    }
  }, [atmosphereOn, fragments])

  // 碎片变化时，如果氛围音景开启，重新生成音景
  useEffect(() => {
    if (atmosphereOn && audioRef.current?.isRunning) {
      audioRef.current.build(fragments)
    }
  }, [fragments, atmosphereOn])

  return (
    <div className="app">
      <Navbar fragmentCount={fragments.length} onNavigate={handleNavigate} />
      <Hero onStart={() => handleNavigate('catch')} />

      <section id="catch" className="section catch-section">
        <div className="section-header">
          <p className="section-eyebrow">CATCH</p>
          <h2 className="section-title">捕捉碎片</h2>
          <p className="section-desc">
            移动鼠标，拨开漂浮的碎片；点击那些吸引你的，收入灵感墙
          </p>
        </div>
        <FragmentCanvas onCatch={handleCatch} />
      </section>

      <Collection
        fragments={fragments}
        atmosphereOn={atmosphereOn}
        onClear={handleClear}
        onRemove={handleRemove}
        onToggleAtmosphere={handleToggleAtmosphere}
      />

      <DriftBottle fragments={fragments} onImport={handleImport} />

      <Footer />
    </div>
  )
}
