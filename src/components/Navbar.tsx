import { useEffect, useState } from 'react'

interface NavbarProps {
  fragmentCount: number
  onNavigate: (section: string) => void
}

export default function Navbar({ fragmentCount, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar-inner">
        <button className="navbar-brand" onClick={() => onNavigate('hero')}>
          <span className="brand-icon">✦</span>
          <span className="brand-text">灵感碎片</span>
        </button>
        <div className="navbar-links">
          <button onClick={() => onNavigate('catch')}>捕捉</button>
          <button onClick={() => onNavigate('wall')}>
            灵感墙
            {fragmentCount > 0 && <span className="badge">{fragmentCount}</span>}
          </button>
          <button onClick={() => onNavigate('bottle')}>漂流瓶</button>
        </div>
      </div>
    </nav>
  )
}
