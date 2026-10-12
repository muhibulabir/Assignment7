import Link from 'next/link'
import './dashboard.css'
import AuthControls from './components/auth-controls'

const prices = [
  { name: 'পেঁয়াজ', unit: 'প্রতি কেজি', icon: '🧅', price: '৫৪ টাকা', change: '৪.৫%', trend: 'up' },
  { name: 'আদা', unit: 'প্রতি কেজি', icon: '🫚', price: '৮৫ টাকা', change: '১.৯%', trend: 'down' },
  { name: 'বেগুন', unit: 'প্রতি কেজি', icon: '🍆', price: '৪৪ টাকা', change: '৪.৭%', trend: 'up' },
  { name: 'রুই মাছ', unit: 'প্রতি কেজি', icon: '🐟', price: '৩২০ টাকা', change: '২.১%', trend: 'down' },
  { name: 'ডিম', unit: 'প্রতি ডজন', icon: '🥚', price: '১৪৫ টাকা', change: '৩.২%', trend: 'up' },
  { name: 'ময়দা (৫০০ গ্রাম)', unit: 'প্রতি প্যাকেট', icon: '🌽', price: '৪০ টাকা', change: '০.৬%', trend: 'down' },
]

const navItems = ['চাল', 'ডাল', 'তেল', 'সবজি', 'মাছ', 'মাংস', 'চিনি-লবণ', 'মসলা']

function App() {
  return (
    <main className="market-app min-h-screen">
      <header className="topbar">
        <Link className="brand" href="/" aria-label="বাজার দর হোম">
          <span className="brand-mark" aria-hidden="true">🛒</span>
          <span className="brand-copy">
            <strong>বাজার দর</strong>
            <small>জনসেবা, ৩ অক্টোবর, ২০২৬</small>
          </span>
        </Link>
        <AuthControls />
      </header>

      <nav className="category-nav" aria-label="পণ্যের বিভাগ">
        {navItems.map((item, index) => (
          <Link href={`#${item}`} key={item} className={index === 3 ? 'active' : ''}>
            <span aria-hidden="true">{['🌾', '🫘', '🫙', '🫑', '🐟', '🍗', '🧂', '🌶️'][index]}</span>
            {item}
          </Link>
        ))}
      </nav>

      <div className="price-ticker" aria-label="বাজারের দামের সংক্ষিপ্ত তথ্য">
        <span>🧅&nbsp; দেশি পেঁয়াজ <b>৫৪ টাকা/কেজি</b> <em>▲ ৪.৫%</em></span>
        <span>🫚&nbsp; আদা <b>৮৫ টাকা/কেজি</b> <i>▼ ১.৯%</i></span>
        <span>🍆&nbsp; বেগুন <b>৪৪ টাকা/কেজি</b> <em>▲ ৪.৭%</em></span>
        <span>🐟&nbsp; রুই মাছ <b>৩২০ টাকা/কেজি</b> <i>▼ ২.১%</i></span>
      </div>

      <section className="hero" id="home">
        <div className="hero-copy">
          <span className="date-pill">জনসেবা, ৩ অক্টোবর, ২০২৬</span>
          <h1>আজকের বাজারের দাম এক নজরে</h1>
          <p>চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিশ্লেষণ, ট্রেন্ড, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।</p>
          <Link className="primary-button" href="#prices">সব দাম দেখুন</Link>
        </div>
        <div className="basket-art" aria-hidden="true">
          <span>🍅</span><span>🫑</span><span>🍊</span><span>🍆</span><span>🥕</span>
          <div className="basket">🥬</div>
        </div>
      </section>

      <section className="prices-section" id="prices">
        <h2><span aria-hidden="true">▲</span> আজ দাম বেড়েছে</h2>
        <div className="price-grid">
          {prices.map((item) => (
            <article className="price-card" key={item.name}>
              <div className="product">
                <span className="product-icon" aria-hidden="true">{item.icon}</span>
                <span className="product-name">
                  <strong>{item.name}</strong>
                  <small>{item.unit}</small>
                </span>
              </div>
              <small className="market-label">আজকের বাজার</small>
              <div className="price-line">
                <strong>{item.price}</strong>
                <span className={`change ${item.trend}`}>
                  {item.trend === 'up' ? '▲' : '▼'} {item.change}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
