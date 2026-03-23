import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: 'rgba(255,255,255,0.7)', fontFamily: "'Nunito', sans-serif", position: 'relative', overflow: 'hidden' }}>
      {/* Glow */}
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,30,140,0.08) 0%,transparent 70%)', top: '-100px', right: '10%', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 24px 32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 40, position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, background: 'linear-gradient(90deg,#e91e8c,#9b59b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800, marginBottom: 4 }}>LittleStarsTwinkle</div>
          <div style={{ fontSize: 11, color: '#e91e8c', fontWeight: 800, letterSpacing: '2px', marginBottom: 14 }}>✦ Kids Wear ✦</div>
          <p style={{ fontSize: 13, lineHeight: 1.7, fontWeight: 600 }}>Magical kids wear crafted with love for your little stars.</p>
          <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#25D366', color: 'white', padding: '8px 18px', borderRadius: 50, textDecoration: 'none', fontSize: 12, fontWeight: 800, marginTop: 18 }}>
            📱 WhatsApp Us
          </a>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'white', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 18 }}>Quick Links</div>
          {[
            ['/new-arrivals','New Arrivals'],
            ['/new-arrivals','Best Sellers'],
            ['/girls','Girls Collection'],
            ['/boys','Boys Collection'],
          ].map(([href, label]) => (
            <Link key={label} href={href} style={{ display: 'block', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: 13, marginBottom: 10, fontWeight: 600, transition: 'color 0.2s' }}>{label}</Link>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'white', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 18 }}>Support</div>
          {[
            ['/about','About Us'],
            ['/contact','Contact'],
            ['/track-order','Track Order'],
          ].map(([href, label]) => (
            <Link key={label} href={href} style={{ display: 'block', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: 13, marginBottom: 10, fontWeight: 600 }}>{label}</Link>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'white', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 18 }}>Contact</div>
          <div style={{ fontSize: 13, marginBottom: 10, fontWeight: 600 }}>📧 hello@littlestarstinkle.com</div>
          <div style={{ fontSize: 13, marginBottom: 10, fontWeight: 600 }}>📱 +91 XXXXX XXXXX</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>🕐 24/7 Customer Support</div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '18px 24px', maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, position: 'relative', zIndex: 1 }}>
        <span style={{ fontSize: 12, fontWeight: 600 }}>© 2025 LittleStarsTwinkle. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 16 }}>
          {['🔒 Secure Payments','🚚 Free Shipping','⭐ Premium Quality'].map(b => (
            <span key={b} style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{b}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
