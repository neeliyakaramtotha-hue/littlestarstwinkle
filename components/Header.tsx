'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCartStore(s => s.items.reduce((t, i) => t + i.quantity, 0));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/',             label: 'HOME' },
    { href: '/new-arrivals', label: 'COLLECTIONS' },
    { href: '/new-arrivals', label: 'NEW ARRIVALS' },
    { href: '/new-arrivals?filter=bestseller', label: 'BEST SELLERS' },
    { href: '/girls',        label: 'GIRLS' },
    { href: '/boys',         label: 'BOYS' },
    { href: '/about',        label: 'ABOUT' },
    { href: '/contact',      label: 'CONTACT' },
  ];

  return (
    <>
      {/* Announcement Bar — Pink like original */}
      <div style={{
        background: 'linear-gradient(90deg, #e91e8c, #9b59b6, #e91e8c)',
        backgroundSize: '200% 100%',
        color: 'white', padding: '9px 16px', fontSize: 12,
        fontWeight: 700, letterSpacing: '0.3px', overflow: 'hidden', whiteSpace: 'nowrap',
        fontFamily: "'Nunito', sans-serif"
      }}>
        <span>💬 24/7 Customer Support Available &nbsp;|&nbsp; 🛒 Online Orders Only &nbsp;|&nbsp; 🚚 Free Shipping Across India &nbsp;|&nbsp; 🌍 International? WhatsApp Us &nbsp;|&nbsp; 💬 24/7 Customer Support Available &nbsp;|&nbsp; 🛒 Online Orders Only &nbsp;|&nbsp; 🚚 Free Shipping Across India</span>
        <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noopener noreferrer"
          style={{ marginLeft: 20, background: '#25D366', color: 'white', padding: '3px 12px', borderRadius: 50, fontWeight: 800, fontSize: 11, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, verticalAlign: 'middle' }}>
          WhatsApp
        </a>
      </div>

      {/* Main Header */}
      <header style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '2px solid rgba(233,30,140,0.15)',
        boxShadow: scrolled ? '0 4px 24px rgba(233,30,140,0.12)' : 'none',
        transition: 'box-shadow 0.3s'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', position: 'relative', border: '2px solid rgba(233,30,140,0.25)', boxShadow: '0 2px 12px rgba(233,30,140,0.15)', flexShrink: 0 }}>
              <Image src="/logo.png" alt="LittleStarsTwinkle" fill style={{ objectFit: 'cover' }} priority />
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, background: 'linear-gradient(90deg, #e91e8c, #9b59b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>LittleStarsTwinkle</div>
              <div style={{ fontSize: 10, color: '#e91e8c', letterSpacing: '2px', fontWeight: 800, fontFamily: "'Nunito', sans-serif" }}>✦ Kids Wear ✦</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {navLinks.map(link => (
              <Link key={link.label} href={link.href} style={{
                color: '#555', textDecoration: 'none', fontSize: 11, fontWeight: 800,
                padding: '8px 10px', letterSpacing: '1px', transition: 'color 0.2s', borderRadius: 6,
                fontFamily: "'Nunito', sans-serif"
              }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#e91e8c'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = '#555'}
              >{link.label}</Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/wishlist" style={{ textDecoration: 'none', color: '#9b59b6', fontSize: 20, lineHeight: 1 }}>♡</Link>
            <Link href="/track-order" style={{
              color: '#555', textDecoration: 'none', fontSize: 11, fontWeight: 800,
              letterSpacing: '0.5px', padding: '7px 14px',
              border: '1.5px solid rgba(233,30,140,0.3)', borderRadius: 50,
              display: 'flex', alignItems: 'center', gap: 5,
              fontFamily: "'Nunito', sans-serif", transition: 'all 0.2s'
            }}>
              <span>📦</span><span className="track-text">Track</span>
            </Link>
            <Link href="/cart" style={{ textDecoration: 'none', position: 'relative' }}>
              <div style={{
                background: 'linear-gradient(135deg, #e91e8c, #9b59b6)',
                borderRadius: 50, padding: '8px 14px',
                display: 'flex', alignItems: 'center', gap: 6, color: 'white', fontSize: 13, fontWeight: 800
              }}>
                <span>🛒</span>
                {cartCount > 0 && (
                  <span style={{ background: 'white', color: '#e91e8c', borderRadius: '50%', width: 18, height: 18, fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: -5, right: -5 }}>{cartCount}</span>
                )}
              </div>
            </Link>
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', color: '#e91e8c', cursor: 'pointer', fontSize: 24, padding: 4, display: 'none' }}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{ background: 'white', borderTop: '1px solid rgba(233,30,140,0.12)', padding: '12px 24px 20px' }}>
            {navLinks.map(link => (
              <Link key={link.label} href={link.href} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', color: '#333', textDecoration: 'none', fontSize: 13, fontWeight: 800, padding: '11px 0', letterSpacing: '1px', borderBottom: '1px solid rgba(233,30,140,0.08)', fontFamily: "'Nunito', sans-serif" }}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
          .track-text { display: none; }
        }
      `}</style>
    </>
  );
}
