'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';

interface Product {
  id: number; name: string; price: number; category: string; gender: string;
  image_url: string; stock: number; design_no?: string; colors?: string[];
  is_new?: boolean; is_bestseller?: boolean;
}

interface Pagination {
  total: number; page: number; limit: number; totalPages: number; hasMore: boolean;
}

interface Props { gender?: string; category?: string; title: string; subtitle?: string; }

export default function GenderPage({ gender, category, title, subtitle }: Props) {
  const [products, setProducts]       = useState<Product[]>([]);
  const [pagination, setPagination]   = useState<Pagination | null>(null);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sortBy, setSortBy]           = useState('newest');
  const [filter, setFilter]           = useState('all');
  const [page, setPage]               = useState(1);
  const addItem = useCartStore(s => s.addItem);

  const buildUrl = useCallback((pageNum: number) => {
    const params = new URLSearchParams();
    params.set('page', String(pageNum));
    params.set('limit', '20');
    if (gender)   params.set('gender', gender);
    if (category) params.set('category', category);
    if (filter !== 'all') params.set('filter', filter);
    if (sortBy !== 'newest') params.set('sortBy', sortBy);
    return `/api/products?${params.toString()}`;
  }, [gender, category, filter, sortBy]);

  // Reset and fetch on filter/sort change
  useEffect(() => {
    setLoading(true);
    setPage(1);
    setProducts([]);
    fetch(buildUrl(1))
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || []);
        setPagination(data.pagination || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [gender, category, filter, sortBy, buildUrl]);

  const loadMore = () => {
    if (!pagination?.hasMore || loadingMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    fetch(buildUrl(nextPage))
      .then(r => r.json())
      .then(data => {
        setProducts(prev => [...prev, ...(data.products || [])]);
        setPagination(data.pagination || null);
        setPage(nextPage);
        setLoadingMore(false);
      })
      .catch(() => setLoadingMore(false));
  };

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Nunito', sans-serif" }}>
      {/* Page Header */}
      <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(233,30,140,0.12)', padding: 'clamp(32px,5vw,56px) 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ fontSize: 11, letterSpacing: '3px', color: '#e91e8c', textTransform: 'uppercase', fontWeight: 800, marginBottom: 12 }}>LITTLESTARSTTWINKLE</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(30px,5vw,52px)', fontWeight: 800, color: '#111', marginBottom: 8 }}>{title}</h1>
          {subtitle && <p style={{ color: '#666', fontSize: 14, fontWeight: 600 }}>{subtitle}</p>}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[['all','All'], ['new','New Arrivals'], ['bestseller','Best Sellers']].map(([v, l]) => (
              <button key={v} onClick={() => setFilter(v)} style={{
                padding: '8px 18px', borderRadius: 50, fontFamily: "'Nunito', sans-serif",
                border: `1.5px solid ${filter === v ? '#e91e8c' : 'rgba(233,30,140,0.2)'}`,
                background: filter === v ? 'linear-gradient(135deg,#e91e8c,#9b59b6)' : 'white',
                color: filter === v ? 'white' : '#555', fontSize: 12, fontWeight: 800, cursor: 'pointer',
                boxShadow: filter === v ? '0 4px 12px rgba(233,30,140,0.25)' : 'none'
              }}>{l}</button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#888', fontWeight: 700 }}>
              {pagination ? `${products.length} of ${pagination.total} items` : `${products.length} items`}
            </span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '8px 14px', borderRadius: 50, border: '1.5px solid rgba(233,30,140,0.2)', background: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Nunito', sans-serif", color: '#333' }}>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 80, color: '#9b59b6', fontSize: 16, fontWeight: 700 }}>🌸 Loading magical outfits...</div>
        )}

        {!loading && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: 80 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
            <div style={{ fontSize: 16, color: '#888', fontWeight: 700, marginBottom: 16 }}>No products found. Add products from the admin panel.</div>
            <Link href="/admin" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#e91e8c,#9b59b6)', color: 'white', padding: '12px 28px', borderRadius: 50, textDecoration: 'none', fontWeight: 800, fontSize: 13 }}>Go to Admin →</Link>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(195px, 44vw), 1fr))', gap: 'clamp(12px,2vw,20px)' }}>
          {products.map(p => <ProductCardGrid key={p.id} product={p} addItem={addItem} />)}
        </div>

        {/* Load More Button */}
        {pagination?.hasMore && (
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button
              onClick={loadMore}
              disabled={loadingMore}
              style={{
                background: loadingMore ? '#ccc' : 'linear-gradient(135deg,#e91e8c,#9b59b6)',
                color: 'white', border: 'none', borderRadius: 50,
                padding: '14px 40px', fontSize: 14, fontWeight: 800,
                cursor: loadingMore ? 'not-allowed' : 'pointer',
                fontFamily: "'Nunito', sans-serif",
                boxShadow: loadingMore ? 'none' : '0 6px 20px rgba(233,30,140,0.3)',
              }}
            >
              {loadingMore ? 'Loading...' : `Load More (${pagination.total - products.length} remaining)`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCardGrid({ product, addItem }: { product: Product; addItem: any }) {
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded]       = useState(false);
  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1, product.colors?.[0] || 'Default');
    setAdded(true); setTimeout(() => setAdded(false), 1500);
  };
  return (
    <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{ background: 'white', borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(233,30,140,0.10)', boxShadow: '0 4px 16px rgba(233,30,140,0.06)', transition: 'all 0.3s', cursor: 'pointer' }}>
        <div style={{ position: 'relative', paddingTop: '118%', background: 'linear-gradient(135deg,#fdf0f8,#f0e6ff)', overflow: 'hidden' }}>
          <Image src={product.image_url} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="(max-width:600px)50vw,25vw"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x355/fce4ec/e91e8c?text=LST'; }} />
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {product.is_new && <span style={{ background: 'linear-gradient(90deg,#e91e8c,#9b59b6)', color: 'white', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 50 }}>NEW</span>}
            {product.is_bestseller && <span style={{ background: 'linear-gradient(90deg,#f59e0b,#e67e22)', color: 'white', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 50 }}>★ BEST</span>}
          </div>
          <button onClick={e => { e.preventDefault(); setWishlist(!wishlist); }} style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(233,30,140,0.15)', fontSize: 14, cursor: 'pointer', color: wishlist ? '#e91e8c' : '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{wishlist ? '♥' : '♡'}</button>
        </div>
        <div style={{ padding: '12px 14px 14px' }}>
          {product.design_no && <div style={{ fontSize: 10, color: '#9b59b6', fontWeight: 800, marginBottom: 3 }}>{product.design_no}</div>}
          <div style={{ fontSize: 13, fontWeight: 800, color: '#111', marginBottom: 8, lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>{product.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 17, fontWeight: 800, color: '#111' }}>₹{Number(product.price).toFixed(0)}</span>
            <button onClick={quickAdd} style={{ background: added ? '#27ae60' : 'linear-gradient(135deg,#e91e8c,#9b59b6)', color: 'white', border: 'none', borderRadius: 50, padding: '6px 14px', fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: "'Nunito',sans-serif" }}>{added ? '✓' : '+ Add'}</button>
          </div>
        </div>
      </div>
    </Link>
  );
}
