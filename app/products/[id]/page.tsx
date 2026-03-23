'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewForm, setReviewForm] = useState({ customer_name:'', customer_email:'', rating:5, review:'' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);
  const addItem = useCartStore(s => s.addItem);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/products/${params.id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data);
        setSelectedSize(data.sizes?.[0] || '');
        setSelectedColor(data.colors?.[0] || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/reviews?product_id=${params.id}`)
      .then(r => r.json())
      .then(setReviews)
      .catch(() => {});
  }, [params.id]);

  const handleAdd = () => {
    if (!product) return;
    addItem(product, quantity, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const submitReview = async () => {
    if (!reviewForm.rating) return;
    setReviewSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reviewForm, product_id: params.id }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews(prev => [newReview, ...prev]);
        setReviewDone(true);
        setReviewForm({ customer_name:'', customer_email:'', rating:5, review:'' });
      }
    } catch {}
    finally { setReviewSubmitting(false); }
  };

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + parseFloat(r.rating), 0) / reviews.length
    : 0;

  if (loading) return (
    <div style={{ textAlign:'center', padding:'100px 20px' }}>
      <div style={{ fontSize:48, animation:'spin 1.5s linear infinite', display:'inline-block' }}>🌸</div>
      <p style={{ color:'#333', marginTop:16, fontWeight:700 }}>Loading product...</p>
    </div>
  );

  if (!product) return (
    <div style={{ textAlign:'center', padding:100 }}>
      <div style={{ fontSize:50 }}>😢</div>
      <p style={{ color:'#111', marginTop:16, fontSize:18, fontWeight:700 }}>Product not found</p>
      <Link href="/" style={{ color:'#111', marginTop:16, display:'inline-block', fontWeight:800 }}>← Back to Shop</Link>
    </div>
  );

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'32px 20px 80px' }}>

      {/* Breadcrumb */}
      <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:28, fontSize:13, color:'#555', fontWeight:700 }}>
        <Link href="/" style={{ color:'#111', textDecoration:'none', fontWeight:800 }}>Home</Link>
        <span>/</span>
        <Link href="/" style={{ color:'#111', textDecoration:'none', fontWeight:800 }}>{product.category}</Link>
        <span>/</span>
        <span style={{ color:'#555' }}>{product.name}</span>
      </div>

      {/* Product grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(340px,100%),1fr))', gap:50, alignItems:'start', marginBottom:60 }}>

        {/* Images */}
        <div>
          <div style={{ borderRadius:20, overflow:'hidden', height:'min(480px,60vw)', position:'relative', border:'1px solid rgba(0,0,0,0.1)', marginBottom:12 }}>
            <Image src={product.image_url} alt={product.name} fill style={{ objectFit:'cover' }} priority
              onError={(e)=>{ (e.target as HTMLImageElement).src='https://via.placeholder.com/480x480/fce4ec/111?text=LittleStarsTwinkle'; }} />
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {[0,1,2].map(i => (
              <div key={i} onClick={()=>setActiveImg(i)} style={{ width:72, height:72, borderRadius:10, overflow:'hidden', position:'relative', cursor:'pointer', border:`2px solid ${activeImg===i?'#111':'rgba(0,0,0,0.1)'}`, opacity:activeImg===i?1:0.6, transition:'all 0.2s' }}>
                <Image src={product.image_url} alt="" fill style={{ objectFit:'cover' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(0,0,0,0.07)', border:'1px solid rgba(0,0,0,0.15)', borderRadius:50, padding:'4px 14px', fontSize:11, fontWeight:800, color:'#111', marginBottom:14, textTransform:'uppercase', letterSpacing:'1px' }}>
            {product.category}{product.age_group ? ` · ${product.age_group}` : ''}
          </div>
          {product.design_no && <div style={{ fontSize:12, color:'#555', fontWeight:800, marginBottom:6 }}>{product.design_no}</div>}
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(24px,4vw,34px)', color:'#111', lineHeight:1.2, marginBottom:14 }}>{product.name}</h1>

          {/* Price + stock */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
            <span style={{ fontSize:32, fontWeight:800, color:'#111' }}>₹{Number(product.price).toFixed(0)}</span>
            <span style={{ background:'rgba(0,0,0,0.07)', color:'#111', border:'1px solid rgba(0,0,0,0.15)', borderRadius:8, padding:'4px 12px', fontSize:12, fontWeight:800 }}>In Stock ({product.stock})</span>
          </div>

          {/* Live rating */}
          <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:16 }}>
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ fontSize:20, color:i<=Math.round(avgRating)?'#f59e0b':'#ddd' }}>★</span>
            ))}
            <span style={{ color:'#555', fontSize:13, marginLeft:6, fontWeight:700 }}>
              {reviews.length > 0
                ? `${avgRating.toFixed(1)} (${reviews.length} review${reviews.length>1?'s':''})`
                : 'No reviews yet — be the first!'}
            </span>
          </div>

          <p style={{ color:'#333', lineHeight:1.8, fontSize:14, marginBottom:24, fontWeight:600 }}>{product.description}</p>

          {/* Size */}
          {(product.sizes||[]).length > 0 && (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:12, fontWeight:800, color:'#111', textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:10 }}>Size</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {(product.sizes||[]).map((s:string) => (
                  <button key={s} onClick={()=>setSelectedSize(s)} style={{ padding:'8px 16px', borderRadius:10, border:`2px solid ${selectedSize===s?'#111':'rgba(0,0,0,0.15)'}`, background:selectedSize===s?'#111':'white', color:selectedSize===s?'white':'#111', fontWeight:800, fontSize:13, cursor:'pointer', fontFamily:'Nunito,sans-serif', transition:'all 0.2s' }}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {/* Color */}
          {(product.colors||[]).length > 0 && (
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:12, fontWeight:800, color:'#111', textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:10 }}>
                Color: <span style={{ fontWeight:700, textTransform:'none', letterSpacing:0 }}>{selectedColor}</span>
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {(product.colors||[]).map((col:string) => (
                  <button key={col} onClick={()=>setSelectedColor(col)} style={{ padding:'7px 16px', borderRadius:10, border:`2px solid ${selectedColor===col?'#111':'rgba(0,0,0,0.15)'}`, background:selectedColor===col?'#111':'white', color:selectedColor===col?'white':'#111', fontWeight:800, fontSize:13, cursor:'pointer', fontFamily:'Nunito,sans-serif', transition:'all 0.2s' }}>{col}</button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:12, fontWeight:800, color:'#111', textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:10 }}>Quantity</div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <button onClick={()=>setQuantity(Math.max(1,quantity-1))} style={{ width:38, height:38, borderRadius:10, border:'2px solid rgba(0,0,0,0.2)', background:'white', color:'#111', fontSize:18, fontWeight:800, cursor:'pointer' }}>−</button>
              <span style={{ fontSize:18, fontWeight:800, color:'#111', minWidth:28, textAlign:'center' }}>{quantity}</span>
              <button onClick={()=>setQuantity(quantity+1)} style={{ width:38, height:38, borderRadius:10, border:'2px solid rgba(0,0,0,0.2)', background:'white', color:'#111', fontSize:18, fontWeight:800, cursor:'pointer' }}>+</button>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display:'flex', gap:12, marginBottom:14 }}>
            <button onClick={handleAdd} style={{ flex:1, background:added?'#27ae60':'#111', border:'none', borderRadius:14, padding:'15px', color:'white', fontWeight:800, fontSize:15, cursor:'pointer', fontFamily:'Nunito,sans-serif', transition:'all 0.3s', boxShadow:'0 6px 20px rgba(0,0,0,0.2)' }}>
              {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
            </button>
            <button style={{ width:50, height:50, borderRadius:14, border:'2px solid rgba(0,0,0,0.2)', background:'white', color:'#e91e8c', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>♡</button>
          </div>

          <Link href="/cart" style={{ display:'block', textAlign:'center', background:'transparent', border:'2px solid rgba(0,0,0,0.2)', borderRadius:14, padding:'13px', color:'#111', fontWeight:800, fontSize:14, textDecoration:'none' }}>
            → View Cart & Checkout
          </Link>

          {/* Trust badges */}
          <div style={{ display:'flex', gap:16, marginTop:24, padding:'16px', background:'rgba(255,255,255,0.7)', borderRadius:14, border:'1px solid rgba(0,0,0,0.08)', flexWrap:'wrap' }}>
            {[['🚚','Free Delivery'],['↩️','Easy Returns'],['🔒','Secure Pay']].map(([icon,label]) => (
              <div key={label as string} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'#333', fontWeight:800 }}>
                <span style={{ fontSize:16 }}>{icon}</span>{label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── REVIEWS SECTION ── */}
      <div style={{ maxWidth:800, margin:'0 auto 80px' }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:'#111', marginBottom:8 }}>
          Customer Reviews
          {reviews.length > 0 && <span style={{ fontSize:16, fontFamily:'Nunito,sans-serif', color:'#888', fontWeight:700, marginLeft:8 }}>({reviews.length})</span>}
        </h2>

        {/* Rating summary */}
        {reviews.length > 0 && (
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:32, padding:'16px 20px', background:'rgba(245,158,11,0.06)', borderRadius:14, border:'1px solid rgba(245,158,11,0.15)' }}>
            <span style={{ fontSize:44, fontWeight:800, color:'#111', lineHeight:1 }}>{avgRating.toFixed(1)}</span>
            <div>
              <div style={{ display:'flex', gap:3, marginBottom:4 }}>
                {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize:22, color:i<=Math.round(avgRating)?'#f59e0b':'#ddd' }}>★</span>)}
              </div>
              <div style={{ fontSize:13, color:'#666', fontWeight:700 }}>Based on {reviews.length} review{reviews.length>1?'s':''}</div>
            </div>
          </div>
        )}

        {/* Review list */}
        {reviews.map((r, i) => (
          <div key={i} style={{ background:'white', borderRadius:16, padding:'20px', marginBottom:14, border:'1px solid rgba(0,0,0,0.08)', boxShadow:'0 2px 10px rgba(0,0,0,0.04)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <div>
                <div style={{ fontWeight:800, color:'#111', fontSize:15 }}>{r.customer_name || 'Anonymous'}</div>
                <div style={{ display:'flex', gap:2, marginTop:3 }}>
                  {[1,2,3,4,5].map(j => <span key={j} style={{ fontSize:14, color:j<=r.rating?'#f59e0b':'#ddd' }}>★</span>)}
                </div>
              </div>
              <div style={{ fontSize:11, color:'#bbb', fontWeight:700 }}>{r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN') : ''}</div>
            </div>
            {r.review && <p style={{ color:'#444', fontSize:14, lineHeight:1.7, margin:0 }}>{r.review}</p>}
          </div>
        ))}

        {/* Write a review form */}
        <div style={{ background:'linear-gradient(135deg,rgba(233,30,140,0.04),rgba(155,89,182,0.04))', borderRadius:20, padding:'28px', border:'1px solid rgba(233,30,140,0.12)', marginTop:32 }}>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'#111', marginBottom:20, marginTop:0 }}>
            {reviewDone ? '✅ Thank you for your review!' : '✍️ Write a Review'}
          </h3>

          {reviewDone ? (
            <div>
              <p style={{ color:'#555', fontWeight:600 }}>Your review has been submitted. It helps other parents find the best outfits!</p>
              <button onClick={()=>setReviewDone(false)} style={{ marginTop:12, background:'none', border:'1px solid rgba(0,0,0,0.2)', borderRadius:20, padding:'8px 20px', cursor:'pointer', fontSize:13, fontWeight:700, fontFamily:'Nunito,sans-serif' }}>Write another</button>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12 }}>
                <div>
                  <label style={{ fontSize:11, fontWeight:800, color:'#888', textTransform:'uppercase', letterSpacing:'1px', display:'block', marginBottom:6 }}>Your Name</label>
                  <input value={reviewForm.customer_name} onChange={e=>setReviewForm(f=>({...f,customer_name:e.target.value}))}
                    placeholder="e.g. Priya S."
                    style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'2px solid rgba(0,0,0,0.12)', fontSize:14, outline:'none', fontFamily:'Nunito,sans-serif', boxSizing:'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize:11, fontWeight:800, color:'#888', textTransform:'uppercase', letterSpacing:'1px', display:'block', marginBottom:6 }}>Email (optional)</label>
                  <input value={reviewForm.customer_email} onChange={e=>setReviewForm(f=>({...f,customer_email:e.target.value}))}
                    placeholder="your@email.com" type="email"
                    style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'2px solid rgba(0,0,0,0.12)', fontSize:14, outline:'none', fontFamily:'Nunito,sans-serif', boxSizing:'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize:11, fontWeight:800, color:'#888', textTransform:'uppercase', letterSpacing:'1px', display:'block', marginBottom:8 }}>Your Rating *</label>
                <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                  {[1,2,3,4,5].map(star => (
                    <button key={star} onClick={()=>setReviewForm(f=>({...f,rating:star}))}
                      style={{ fontSize:30, background:'none', border:'none', cursor:'pointer', color:star<=reviewForm.rating?'#f59e0b':'#ddd', transition:'transform 0.1s', transform:star<=reviewForm.rating?'scale(1.2)':'scale(1)', padding:'0 2px' }}>★</button>
                  ))}
                  <span style={{ fontSize:13, color:'#888', marginLeft:6, fontWeight:700 }}>
                    {['','Poor','Fair','Good','Very Good','Excellent'][reviewForm.rating]}
                  </span>
                </div>
              </div>

              <div>
                <label style={{ fontSize:11, fontWeight:800, color:'#888', textTransform:'uppercase', letterSpacing:'1px', display:'block', marginBottom:6 }}>Your Review</label>
                <textarea value={reviewForm.review} onChange={e=>setReviewForm(f=>({...f,review:e.target.value}))}
                  placeholder="Tell other parents what you think about this product..." rows={3}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'2px solid rgba(0,0,0,0.12)', fontSize:14, outline:'none', fontFamily:'Nunito,sans-serif', resize:'vertical', boxSizing:'border-box' }} />
              </div>

              <button onClick={submitReview} disabled={reviewSubmitting}
                style={{ alignSelf:'flex-start', background:'#111', color:'white', border:'none', borderRadius:50, padding:'12px 28px', fontWeight:800, fontSize:14, cursor:reviewSubmitting?'not-allowed':'pointer', fontFamily:'Nunito,sans-serif', opacity:reviewSubmitting?0.6:1 }}>
                {reviewSubmitting ? '⏳ Submitting...' : '⭐ Submit Review'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
