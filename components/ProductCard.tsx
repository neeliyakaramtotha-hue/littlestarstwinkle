'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

const catEmojis: Record<string,string> = { 'Rompers':'🍼','Dresses':'👗','Nightwear':'🌙','Co-ord Sets':'👚','T-Shirts':'👕','Jackets':'🧥','Hoodies':'🧸','Footwear':'👟' };

function StarRating({ rating, count }: { rating:number, count:number }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:3, marginBottom:6 }}>
      {[1,2,3,4,5].map(i=>(
        <span key={i} style={{ fontSize:12, color:i<=Math.round(rating)?'#f59e0b':'#ddd' }}>★</span>
      ))}
      <span style={{ fontSize:11, color:'#888', fontWeight:700 }}>({count})</span>
    </div>
  );
}

export default function ProductCard({ product }: { product: any }) {
  const [hovered, setHovered] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);
  const [rating, setRating] = useState<{avg:number,count:number}|null>(null);
  const addItem = useCartStore(s => s.addItem);
  const em = catEmojis[product.category] || '✨';

  useEffect(()=>{
    fetch(`/api/reviews?product_id=${product.id}`)
      .then(r=>r.json())
      .then((reviews:any[])=>{
        if(reviews.length>0){
          const avg = reviews.reduce((s,r)=>s+parseFloat(r.rating),0)/reviews.length;
          setRating({ avg, count:reviews.length });
        }
      }).catch(()=>{});
  },[product.id]);

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1, product.sizes?.[0] || '1-2Y', product.colors?.[0] || 'Pink');
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: '#ffffff', borderRadius: 20, overflow: 'hidden', cursor: 'pointer',
          border: `1px solid ${hovered ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)'}`,
          boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.15)' : '0 4px 16px rgba(0,0,0,0.07)',
          transform: hovered ? 'translateY(-6px)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ position: 'relative', height: 260, overflow: 'hidden', background: '#fdf0f8' }}>
          <Image src={product.image_url} alt={product.name} fill
            style={{ objectFit: 'cover', transition: 'transform 0.5s ease', transform: hovered ? 'scale(1.07)' : 'scale(1)' }}
            sizes="(max-width:768px) 100vw,33vw"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x260/fce4ec/111111?text=LittleStarsTwinkle'; }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)' }} />
          <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(6px)', borderRadius: 10, padding: '4px 10px', fontSize: 11, fontWeight: 800, color: '#111', border: '1px solid rgba(0,0,0,0.12)' }}>
            {em} {product.category}
          </div>
          <button onClick={(e) => { e.preventDefault(); setWishlist(!wishlist); }} style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, cursor: 'pointer', color: wishlist ? '#e91e8c' : '#111', transition: 'all 0.2s' }}>
            {wishlist ? '♥' : '♡'}
          </button>
          {product.stock < 10 && product.stock > 0 && (
            <div style={{ position: 'absolute', bottom: 50, left: 12, background: '#111', color: 'white', borderRadius: 8, padding: '3px 10px', fontSize: 11, fontWeight: 800 }}>Only {product.stock} left!</div>
          )}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 12px 12px', transform: hovered ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.3s ease', opacity: hovered ? 1 : 0 }}>
            <button onClick={quickAdd} style={{ width: '100%', background: added ? '#27ae60' : '#111', border: 'none', borderRadius: 10, padding: '10px', color: 'white', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Nunito,sans-serif', transition: 'all 0.3s' }}>
              {added ? '✓ Added to Cart!' : '+ Quick Add to Cart'}
            </button>
          </div>
        </div>
        <div style={{ padding: '14px 16px 16px', background: 'white' }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#111', marginBottom: 3, lineHeight: 1.3 }}>{product.name}</div>
          {product.design_no && <div style={{ fontSize: 11, color: '#555', marginBottom: 4, fontWeight: 700 }}>{product.design_no} · {product.age_group || ''}</div>}
          {rating ? <StarRating rating={rating.avg} count={rating.count} /> : <div style={{ fontSize:11, color:'#ccc', marginBottom:6 }}>No reviews yet</div>}
          <div style={{ fontSize: 12, color: '#444', marginBottom: 12, lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>{product.description}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 21, fontWeight: 800, color: '#111' }}>₹{Number(product.price).toFixed(0)}</span>
            <div style={{ background: '#111', color: 'white', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 800 }}>View →</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
