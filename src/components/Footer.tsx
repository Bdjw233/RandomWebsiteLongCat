export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand-icon">✦</span>
          <span>灵感碎片</span>
        </div>
        <p className="footer-text">
          在无限的信息流中，打捞那些值得停留的瞬间
        </p>
        <p className="footer-copy">
          © {new Date().getFullYear()} Inspiration Fragments · 用 ♥ 与代码构建
        </p>
      </div>
    </footer>
  )
}
