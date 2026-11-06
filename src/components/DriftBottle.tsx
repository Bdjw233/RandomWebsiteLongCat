import { useState, useMemo, useEffect } from 'react'
import type { FragmentItem } from '../types'
import { encodeFragments, decodeFragments } from '../lib/storage'

interface DriftBottleProps {
  fragments: FragmentItem[]
  onImport: (fragments: FragmentItem[]) => void
}

/** 漂流瓶：把灵感墙编码进 URL，分享给任何人 */
export default function DriftBottle({ fragments, onImport }: DriftBottleProps) {
  const [shareUrl, setShareUrl] = useState('')
  const [importCode, setImportCode] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const canShare = fragments.length > 0

  /** 生成分享链接 */
  const handleShare = () => {
    if (!canShare) return
    const encoded = encodeFragments(fragments)
    const url = `${window.location.origin}${window.location.pathname}#bottle=${encoded}`
    setShareUrl(url)
    // 尝试复制到剪贴板
    navigator.clipboard?.writeText(url).then(
      () => setMessage({ type: 'success', text: '链接已复制到剪贴板' }),
      () => setMessage({ type: 'success', text: '链接已生成，请手动复制' }),
    )
  }

  /** 从 URL 中检测漂流瓶 */
  const detectedBottle = useMemo(() => {
    const hash = window.location.hash
    const match = hash.match(/#bottle=([A-Za-z0-9\-_]+)/)
    if (match) return match[1]
    return null
  }, [])

  /** 导入漂流瓶 */
  const handleImport = (code?: string) => {
    const target = code ?? (importCode.trim() || detectedBottle)
    if (!target) {
      setMessage({ type: 'error', text: '请输入漂流瓶代码' })
      return
    }
    // 去掉可能的 URL 前缀
    const clean = target.includes('#bottle=')
      ? target.split('#bottle=')[1]
      : target
    const decoded = decodeFragments(clean)
    if (decoded && decoded.length > 0) {
      onImport(decoded)
      setMessage({ type: 'success', text: `已导入 ${decoded.length} 片灵感碎片` })
      setImportCode('')
    } else {
      setMessage({ type: 'error', text: '漂流瓶代码无效' })
    }
  }

  // 页面加载时自动检测 URL 中的漂流瓶
  useEffect(() => {
    if (detectedBottle) {
      const timer = setTimeout(() => handleImport(detectedBottle), 800)
      return () => clearTimeout(timer)
    }
    // 仅在挂载时运行一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section id="bottle" className="section bottle-section">
      <div className="section-header">
        <p className="section-eyebrow">DRIFT BOTTLE</p>
        <h2 className="section-title">灵感漂流瓶</h2>
        <p className="section-desc">
          把你的心绪装进瓶子，让它漂向远方；也拾起别人的瓶子，看看他们的世界
        </p>
      </div>

      <div className="bottle-grid">
        {/* 投掷漂流瓶 */}
        <div className="bottle-card">
          <div className="bottle-card-icon">↗</div>
          <h3>投掷瓶子</h3>
          <p>将你的 {fragments.length} 片灵感碎片编码成一个链接，分享给任何人。</p>
          <button className="btn btn-primary" onClick={handleShare} disabled={!canShare}>
            生成漂流瓶链接
          </button>
          {shareUrl && (
            <div className="share-result">
              <input
                type="text"
                readOnly
                value={shareUrl}
                onFocus={(e) => e.target.select()}
                className="share-input"
              />
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  navigator.clipboard?.writeText(shareUrl)
                  setMessage({ type: 'success', text: '已复制' })
                }}
              >
                复制
              </button>
            </div>
          )}
        </div>

        {/* 拾取漂流瓶 */}
        <div className="bottle-card">
          <div className="bottle-card-icon">↙</div>
          <h3>拾取瓶子</h3>
          <p>粘贴一个漂流瓶链接或代码，导入其中的灵感碎片。</p>
          <textarea
            className="import-textarea"
            placeholder="粘贴漂流瓶链接或代码…"
            value={importCode}
            onChange={(e) => setImportCode(e.target.value)}
            rows={3}
          />
          <button
            className="btn btn-primary"
            onClick={() => handleImport()}
            disabled={!importCode.trim() && !detectedBottle}
          >
            导入漂流瓶
          </button>
        </div>
      </div>

      {message && (
        <div className={`bottle-message bottle-message--${message.type}`}>
          {message.text}
        </div>
      )}
    </section>
  )
}
