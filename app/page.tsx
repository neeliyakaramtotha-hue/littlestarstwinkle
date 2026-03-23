'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';

const CATEGORIES = [
  { key: 'Girls',       label: 'GIRLS',       img: '/products/p47-frock-a.jpg',            color: '#fce4ec' },
  { key: 'Boys',        label: 'BOYS',         img: '/products/7002-vehicle-romper.jpg',     color: '#e3f2fd' },
  { key: 'Rompers',     label: 'ROMPERS',      img: '/products/7049-smurfs-romper-blue.jpg', color: '#f0e6ff' },
  { key: 'Dresses',     label: 'DRESSES',      img: '/products/7055-butterfly-dress.jpg',    color: '#fce4ec' },
  { key: 'Nightwear',   label: 'NIGHTWEAR',    img: '/products/621-blue-pyjama-set.jpg',     color: '#e8eaf6' },
  { key: 'Co-ord Sets', label: 'CO-ORD SETS',  img: '/products/7063-polka-coord.jpg',        color: '#f3e5f5' },
];

function StarRating({ rating, count, size = 13 }: { rating: number; count?: number; size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: size, color: i <= Math.round(rating) ? '#f59e0b' : '#ddd' }}>★</span>
      ))}
      {count !== undefined && <span style={{ fontSize: size - 2, color: '#888', fontWeight: 800, marginLeft: 3 }}>({count})</span>}
    </div>
  );
}

function ProductCard({ product, ratings }: { product: any; ratings: Record<number, { avg: number; count: number }> }) {
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const r = ratings[product.id];

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1, product.sizes?.[0] || '1-2Y', product.colors?.[0] || 'Pink');
    setAdded(true); setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="product-card" style={{
        background: 'white', borderRadius: 18, overflow: 'hidden',
        border: '1px solid rgba(233,30,140,0.10)',
        boxShadow: '0 4px 16px rgba(233,30,140,0.07)',
        transition: 'all 0.3s', cursor: 'pointer'
      }}>
        <div style={{ position: 'relative', paddingTop: '118%', background: 'linear-gradient(135deg, #fdf0f8, #f0e6ff)', overflow: 'hidden' }}>
          <Image src={product.image_url} alt={product.name} fill
            style={{ objectFit: 'cover', transition: 'transform 0.4s' }}
            sizes="(max-width:600px) 50vw, 25vw"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x355/fce4ec/e91e8c?text=LST'; }}
          />
          {/* Badges */}
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {product.is_new && <span style={{ background: 'linear-gradient(90deg,#e91e8c,#9b59b6)', color: 'white', fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 50, letterSpacing: '0.5px', boxShadow: '0 2px 8px rgba(233,30,140,0.3)' }}>NEW</span>}
            {product.is_bestseller && <span style={{ background: 'linear-gradient(90deg,#f59e0b,#e67e22)', color: 'white', fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 50, letterSpacing: '0.5px' }}>★ BEST</span>}
            {product.stock < 10 && product.stock > 0 && <span style={{ background: '#111', color: 'white', fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 50 }}>LOW STOCK</span>}
          </div>
          <button onClick={e => { e.preventDefault(); setWishlist(!wishlist); }} style={{
            position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(233,30,140,0.15)',
            fontSize: 16, cursor: 'pointer', color: wishlist ? '#e91e8c' : '#ccc',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>{wishlist ? '♥' : '♡'}</button>
          {/* Quick add */}
          <div className="quick-add-overlay" style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)',
            padding: '40px 10px 10px', opacity: 0, transition: 'opacity 0.3s'
          }}>
            <button onClick={quickAdd} style={{
              width: '100%', background: added ? '#27ae60' : 'white',
              border: 'none', borderRadius: 50, padding: '9px', color: added ? 'white' : '#e91e8c',
              fontWeight: 800, fontSize: 12, cursor: 'pointer', letterSpacing: '0.5px', fontFamily: "'Nunito',sans-serif"
            }}>{added ? '✓ Added!' : '+ QUICK ADD'}</button>
          </div>
        </div>
        <div style={{ padding: '12px 14px 14px' }}>
          {product.design_no && <div style={{ fontSize: 10, color: '#9b59b6', fontWeight: 800, marginBottom: 3, letterSpacing: '0.5px' }}>{product.design_no}</div>}
          <div style={{ fontSize: 13, fontWeight: 800, color: '#111', marginBottom: 5, lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>{product.name}</div>
          {r && <StarRating rating={r.avg} count={r.count} />}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#111' }}>₹{Number(product.price).toFixed(0)}</span>
            <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              {(product.colors || []).slice(0, 4).map((c: string, i: number) => (
                <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c.toLowerCase(), border: '1px solid rgba(0,0,0,0.15)', display: 'inline-block' }} />
              ))}
              {(product.colors || []).length > 4 && <span style={{ fontSize: 10, color: '#9b59b6', fontWeight: 800 }}>+{product.colors.length - 4}</span>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function HScrollSection({ title, badge, children, seeAllHref }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  return (
    <section style={{ padding: '56px 0 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          {badge && (
            <div style={{ display: 'inline-block', background: 'linear-gradient(90deg,#e91e8c,#9b59b6)', color: 'white', fontSize: 11, fontWeight: 800, padding: '4px 14px', borderRadius: 50, letterSpacing: '1px', marginBottom: 10 }}>★ {badge}</div>
          )}
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(22px,4vw,34px)', color: '#111', fontWeight: 800, margin: 0 }}>{title}</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {seeAllHref && <Link href={seeAllHref} style={{ fontSize: 13, fontWeight: 800, color: '#e91e8c', textDecoration: 'none', borderBottom: '1.5px solid #e91e8c', paddingBottom: 1 }}>See all →</Link>}
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => scroll(-1)} style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid rgba(233,30,140,0.25)', background: 'white', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e91e8c' }}>‹</button>
            <button onClick={() => scroll(1)}  style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid rgba(233,30,140,0.25)', background: 'white', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e91e8c' }}>›</button>
          </div>
        </div>
      </div>
      <div ref={ref} style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingLeft: 24, paddingRight: 24, paddingBottom: 24, scrollbarWidth: 'none' }}>
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [ratings, setRatings] = useState<Record<number, { avg: number; count: number }>>({});

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(setProducts).catch(() => {});
    fetch('/api/reviews').then(r => r.json()).then((data: any[]) => {
      const map: Record<number, { avg: number; count: number }> = {};
      data.forEach(d => { map[d.product_id] = { avg: parseFloat(d.avg_rating), count: parseInt(d.count) }; });
      setRatings(map);
    }).catch(() => {});
  }, []);

  const allNew   = products.filter(p => p.is_new).slice(0, 12).length
    ? products.filter(p => p.is_new).slice(0, 12)
    : [...products].sort((a, b) => b.id - a.id).slice(0, 12);
  const allBest  = products.filter(p => p.is_bestseller).slice(0, 12).length
    ? products.filter(p => p.is_bestseller).slice(0, 12)
    : [...products].slice(0, 12);

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: 'clamp(480px,78vh,620px)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,30,140,0.09) 0%,transparent 70%)', top: '-120px', right: '8%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,89,182,0.10) 0%,transparent 70%)', bottom: '-60px', left: '3%', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(40px,7vw,72px) 24px', display: 'grid', gridTemplateColumns: '1fr min(360px,38vw)', gap: 'clamp(24px,5vw,60px)', alignItems: 'center', width: '100%' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(233,30,140,0.08)', border: '1px solid rgba(233,30,140,0.2)', borderRadius: 50, padding: '6px 16px', fontSize: 12, fontWeight: 800, color: '#e91e8c', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 22 }}>✦ New Collection 2025 ✦</div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px,5.5vw,66px)', fontWeight: 800, lineHeight: 1.12, color: '#111', margin: '0 0 16px' }}>
              Where Little<br />
              <span style={{ fontStyle: 'italic', background: 'linear-gradient(90deg,#e91e8c,#9b59b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Stars</span> Shine ✨
            </h1>
            <p style={{ fontSize: 'clamp(13px,1.8vw,16px)', color: '#444', lineHeight: 1.75, marginBottom: 30, maxWidth: 430, fontWeight: 600 }}>
              Enchanting, high-quality kids wear that sparks imagination and keeps your little ones comfortable all day long.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="#new-arrivals" style={{ background: 'linear-gradient(135deg,#e91e8c,#9b59b6)', color: 'white', padding: '13px 30px', borderRadius: 50, fontWeight: 800, fontSize: 14, textDecoration: 'none', boxShadow: '0 6px 20px rgba(233,30,140,0.3)' }}>Shop Collection</a>
              <a href="/about" style={{ color: '#111', padding: '13px 22px', borderRadius: 50, fontWeight: 800, fontSize: 14, textDecoration: 'none', border: '2px solid rgba(0,0,0,0.15)' }}>Our Story →</a>
            </div>
            <div style={{ display: 'flex', gap: 'clamp(16px,4vw,36px)', marginTop: 32, borderTop: '1px solid rgba(233,30,140,0.12)', paddingTop: 28 }}>
              {[['500+','Products'],['10K+','Happy Kids'],['4.9★','Rating'],['Free','Shipping']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 'clamp(18px,3vw,22px)', fontWeight: 800, color: '#111', fontFamily: "'Playfair Display',serif" }}>{n}</div>
                  <div style={{ fontSize: 11, color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-img" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 'min(300px,80vw)', height: 'min(300px,80vw)', borderRadius: '50%', overflow: 'hidden', border: '4px solid rgba(233,30,140,0.2)', boxShadow: '0 0 60px rgba(233,30,140,0.18), 0 0 0 8px rgba(233,30,140,0.06)', position: 'relative' }}>
              <Image src="/logo.png" alt="LittleStarsTwinkle" fill style={{ objectFit: 'cover' }} priority />
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section style={{ background: 'white', borderTop: '1px solid rgba(233,30,140,0.08)', borderBottom: '1px solid rgba(233,30,140,0.08)', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
          {[['🚚','Free Shipping','On all orders across India'],['💬','24/7 Support','WhatsApp & customer care'],['🔄','Easy Returns','7-day hassle-free'],['🔒','Secure Payments','Razorpay encrypted']].map(([icon,title,sub]) => (
            <div key={title as string} style={{ textAlign: 'center', padding: '12px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>{icon}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#111' }}>{title}</div>
                <div style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SHOP BY CATEGORY (O Maguva circles) ── */}
      <section style={{ padding: 'clamp(40px,6vw,64px) 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px,4vw,36px)', color: '#111', fontWeight: 800, marginBottom: 8 }}>
              Shop by <span style={{ fontStyle: 'italic', background: 'linear-gradient(90deg,#e91e8c,#9b59b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Category</span>
            </h2>
            <p style={{ color: '#666', fontSize: 14, fontWeight: 600 }}>Explore our diverse collection for every little one</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(130px,42vw), 1fr))', gap: 'clamp(12px,2vw,28px)' }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.key} href={`/${cat.key.toLowerCase().replace(/[' ]/g, c => c === ' ' ? '-' : '')}`} style={{ textDecoration: 'none' }}>
                <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                  <div className="cat-circle" style={{
                    width: '100%', paddingBottom: '100%', borderRadius: '50%', overflow: 'hidden',
                    position: 'relative', background: cat.color,
                    border: '3px solid rgba(233,30,140,0.12)',
                    boxShadow: '0 4px 18px rgba(233,30,140,0.10)',
                    transition: 'all 0.3s'
                  }}>
                    <Image src={cat.img} alt={cat.label} fill style={{ objectFit: 'cover' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                  <div style={{ marginTop: 12, fontSize: 12, fontWeight: 800, color: '#111', letterSpacing: '1.5px' }}>{cat.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <div id="new-arrivals" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)', paddingBottom: 48 }}>
        <HScrollSection title="✨ New Collections" badge="New Arrivals" seeAllHref="/new-arrivals">
          {allNew.map(p => (
            <div key={p.id} style={{ flexShrink: 0, width: 'clamp(175px,22vw,230px)' }}>
              <ProductCard product={p} ratings={ratings} />
            </div>
          ))}
        </HScrollSection>
      </div>

      {/* ── PROMO BANNER ── */}
      <section style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: 'clamp(40px,6vw,64px) 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,30,140,0.15) 0%,transparent 70%)', top: '-80px', left: '10%' }} />
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(155,89,182,0.15) 0%,transparent 70%)', bottom: '-50px', right: '15%' }} />
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, letterSpacing: '3px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 12, fontWeight: 800 }}>✦ Special Offer ✦</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(26px,5vw,40px)', color: 'white', marginBottom: 14, fontWeight: 800, fontStyle: 'italic' }}>Get 20% OFF Your First Order</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 24, fontSize: 14, fontWeight: 600 }}>
            Use code <strong style={{ color: 'white', background: 'rgba(255,255,255,0.1)', padding: '3px 12px', borderRadius: 6 }}>TWINKLE20</strong> at checkout
          </p>
          <a href="/new-arrivals" style={{ background: 'linear-gradient(135deg,#e91e8c,#9b59b6)', color: 'white', padding: '13px 36px', borderRadius: 50, fontWeight: 800, fontSize: 14, textDecoration: 'none', display: 'inline-block', boxShadow: '0 6px 24px rgba(233,30,140,0.35)' }}>Shop Now ✦</a>
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      <div style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(4px)', paddingBottom: 56 }}>
        <HScrollSection title="🔥 Best Sellers" badge="Best Seller" seeAllHref="/new-arrivals">
          {allBest.map(p => (
            <div key={p.id} style={{ flexShrink: 0, width: 'clamp(175px,22vw,230px)' }}>
              <ProductCard product={p} ratings={ratings} />
            </div>
          ))}
        </HScrollSection>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .hero-img { display: none !important; }
        }
      `}</style>
    </div>
  );
}
