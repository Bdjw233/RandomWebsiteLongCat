import type { FragmentItem } from '../types'
import { CATEGORY_META } from '../data/fragments'

interface CollectionProps {
  fragments: FragmentItem[]
  atmosphereOn: boolean
  onClear: () => void
  onRemove: (id: string) => void
  onToggleAtmosphere: () => void
}

export default function Collection({
  fragments,
  atmosphereOn,
  onClear,
  onRemove,
  onToggleAtmosphere,
}: CollectionProps) {
  return (
    <section id="wall" className="section wall-section">
      <div className="section-header">
        <p className="section-eyebrow">COLLECTION</p>
        <h2 className="section-title">我的灵感墙</h2>
        <p className="section-desc">
          每一片碎片，都是某个瞬间的闪光
        </p>
      </div>

      <div className="wall-controls">
        <button
          className={`btn btn-atmosphere ${atmosphereOn ? 'is-active' : ''}`}
          onClick={onToggleAtmosphere}
        >
          <span className="atmo-icon">{atmosphereOn ? '◉' : '◎'}</span>
          {atmosphereOn ? '氛围音景已开启' : '开启氛围音景'}
        </button>
        <div className="wall-actions-right">
          <span className="wall-count">{fragments.length} 片</span>
          <button className="btn btn-ghost btn-sm" onClick={onClear} disabled={fragments.length === 0}>
            清空
          </button>
        </div>
      </div>

      {fragments.length === 0 ? (
        <div className="wall-empty">
          <span className="empty-icon">✧</span>
          <p>灵感墙还是空的</p>
          <p className="empty-hint">去捕捉一些碎片吧</p>
        </div>
      ) : (
        <div className="wall-grid">
          {fragments.map((fragment) => (
            <article
              key={fragment.id}
              className="wall-card"
              style={{
                '--fragment-color': fragment.color,
                '--fragment-accent': fragment.accent,
              } as React.CSSProperties}
            >
              <div className="wall-card-glow" />
              <div className="wall-card-content">
                <span className="wall-card-category">
                  {CATEGORY_META[fragment.category]?.icon}{' '}
                  {CATEGORY_META[fragment.category]?.label}
                </span>
                <p className="wall-card-text">{fragment.content}</p>
                <div className="wall-card-footer">
                  <time className="wall-card-time">
                    {new Date(fragment.caughtAt).toLocaleString('zh-CN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                  <button
                    className="wall-card-remove"
                    onClick={() => onRemove(fragment.id)}
                    aria-label="移除这片碎片"
                    title="移除"
                  >
                    ×
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
