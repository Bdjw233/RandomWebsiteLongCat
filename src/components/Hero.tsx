interface HeroProps {
  onStart: () => void
}

export default function Hero({ onStart }: HeroProps) {
  return (
    <section id="hero" className="hero">
      <div className="hero-bg">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="hero-particle"
            style={{
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`,
              '--size': `${2 + Math.random() * 4}px`,
              '--duration': `${8 + Math.random() * 12}s`,
              '--delay': `${Math.random() * 8}s`,
              '--hue': Math.random() * 360,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="hero-content">
        <p className="hero-eyebrow">INSPIRATION FRAGMENTS</p>
        <h1 className="hero-title">
          <span className="hero-title-line">捕捉</span>
          <span className="hero-title-line hero-title-line--glow">灵感</span>
          <span className="hero-title-line">碎片</span>
        </h1>
        <p className="hero-subtitle">
          那些一闪而过的念头，值得被看见、被收藏、被分享
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={onStart}>
            开始捕捉
            <span className="btn-arrow">→</span>
          </button>
          <button className="btn btn-ghost" onClick={() => document.getElementById('wall')?.scrollIntoView({ behavior: 'smooth' })}>
            查看灵感墙
          </button>
        </div>
      </div>

      <div className="hero-scroll">
        <span className="scroll-line" />
        <span className="scroll-text">向下探索</span>
      </div>
    </section>
  )
}
