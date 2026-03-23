'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

declare global { interface Window { Razorpay: any; } }

const ORDER_STEPS = [
  { key: 'confirmed', label: 'Order Confirmed', icon: '✅', desc: 'Your order has been placed successfully' },
  { key: 'processing', label: 'Processing', icon: '📦', desc: 'We are preparing your order' },
  { key: 'dispatched', label: 'Dispatched', icon: '🚚', desc: 'Your order is on the way' },
  { key: 'delivered', label: 'Delivered', icon: '🌟', desc: 'Enjoy your magical outfits!' },
];

export default function Cart() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const [step, setStep] = useState<'cart'|'checkout'|'success'>('cart');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ customer_name:'', customer_email:'', customer_phone:'', shipping_address:'' });
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [placedOrderId, setPlacedOrderId] = useState<number|null>(null);
  const [orderStatus, setOrderStatus] = useState('confirmed');

  useEffect(() => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    document.body.appendChild(s);
    return () => { try { document.body.removeChild(s); } catch {} };
  }, []);

  // Poll order status every 15 seconds after order placed
  useEffect(() => {
    if (!placedOrderId) return;
    const poll = async () => {
      try {
        const r = await fetch(`/api/orders/${placedOrderId}/status`);
        if (r.ok) { const d = await r.json(); setOrderStatus(d.order_status || 'confirmed'); }
      } catch {}
    };
    poll();
    const interval = setInterval(poll, 15000);
    return () => clearInterval(interval);
  }, [placedOrderId]);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'TWINKLE20') setDiscount(20);
    else alert('Invalid coupon code');
  };

  const subtotal = getTotalPrice();
  const discountAmt = Math.round(subtotal * discount / 100);
  const shipping = subtotal >= 500 ? 0 : 49;
  const total = subtotal - discountAmt + shipping;

  const handleCheckout = async () => {
    if (!form.customer_name || !form.customer_email || !form.shipping_address) { alert('Please fill all required fields'); return; }
    setLoading(true);
    try {
      const orderRes = await fetch('/api/orders/create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total, ...form, items }),
      });
      const orderData = await orderRes.json();
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount, currency: orderData.currency,
        name: 'LittleStarsTwinkle Kids Wear', description: 'Purchase from LittleStarsTwinkle',
        image: '/logo.png', order_id: orderData.orderId,
        handler: async (response: any) => {
          const v = await (await fetch('/api/orders/verify', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...response, dbOrderId:orderData.dbOrderId}) })).json();
          if (v.success) {
            clearCart();
            setPlacedOrderId(orderData.dbOrderId);
            setOrderStatus('confirmed');
            setStep('success');
          } else { alert('Payment verification failed.'); }
        },
        prefill: { name:form.customer_name, email:form.customer_email, contact:form.customer_phone },
        theme: { color: '#111111' },
      };
      new window.Razorpay(options).open();
    } catch { alert('Checkout failed. Try again.'); }
    finally { setLoading(false); }
  };

  const inp = { width:'100%', padding:'12px 16px', borderRadius:12, border:'2px solid rgba(0,0,0,0.15)', background:'white', color:'#111111', fontSize:14, outline:'none', fontFamily:'Nunito,sans-serif', fontWeight:700 };

  // ── SUCCESS / ORDER TRACKING SCREEN ──
  if (step === 'success') {
    const currentStepIndex = ORDER_STEPS.findIndex(s => s.key === orderStatus);
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '60px 20px 80px', textAlign: 'center' }}>
        {/* Celebration header */}
        <div style={{ fontSize: 72, marginBottom: 16, animation: 'float 3s ease-in-out infinite', display: 'inline-block' }}>🌟</div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, color: '#111111', marginBottom: 10 }}>Order Confirmed!</h1>
        <p style={{ color: '#333333', lineHeight: 1.7, marginBottom: 8, fontWeight: 600, fontSize: 16 }}>
          Your magical outfits are on their way!
        </p>
        <p style={{ color: '#777', fontSize: 13, fontWeight: 700, marginBottom: 40 }}>
          Check your email for order details & invoice. {placedOrderId && `Order #${placedOrderId}`}
        </p>

        {/* Real-time Order Tracking */}
        <div style={{ background: 'white', borderRadius: 24, padding: '32px 28px', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)', marginBottom: 32, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: '#111111', margin: 0 }}>Track Your Order</h2>
            <span style={{ fontSize: 11, color: '#aaa', fontWeight: 700, background: '#f5f5f5', padding: '4px 10px', borderRadius: 20 }}>Live Updates</span>
          </div>

          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{ position: 'absolute', left: 19, top: 20, bottom: 20, width: 2, background: 'linear-gradient(to bottom, #111111, rgba(0,0,0,0.08))', zIndex: 0 }} />

            {ORDER_STEPS.map((s, i) => {
              const isDone = i <= currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <div key={s.key} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: i < ORDER_STEPS.length - 1 ? 28 : 0, position: 'relative', zIndex: 1 }}>
                  {/* Circle */}
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: isDone ? '#111111' : 'white',
                    border: `3px solid ${isDone ? '#111111' : 'rgba(0,0,0,0.12)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                    boxShadow: isCurrent ? '0 0 0 4px rgba(233,30,140,0.15)' : 'none',
                    transition: 'all 0.4s ease',
                  }}>
                    {isDone ? <span style={{ fontSize: 16 }}>{s.icon}</span> : <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(0,0,0,0.15)', display: 'block' }} />}
                  </div>
                  {/* Text */}
                  <div style={{ paddingTop: 6 }}>
                    <div style={{ fontWeight: 800, fontSize: 15, color: isDone ? '#111111' : '#aaaaaa', marginBottom: 2 }}>
                      {s.label}
                      {isCurrent && <span style={{ marginLeft: 8, fontSize: 10, background: 'linear-gradient(90deg,#e91e8c,#9b59b6)', color: 'white', padding: '2px 8px', borderRadius: 10, verticalAlign: 'middle', fontWeight: 800 }}>CURRENT</span>}
                    </div>
                    <div style={{ fontSize: 12, color: isDone ? '#555555' : '#cccccc', fontWeight: 600 }}>{s.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 24, padding: '12px 16px', background: 'rgba(233,30,140,0.04)', borderRadius: 12, border: '1px solid rgba(233,30,140,0.1)', fontSize: 12, color: '#888', textAlign: 'center', fontWeight: 700 }}>
            🔄 This page updates automatically every 15 seconds
          </div>
        </div>

        <Link href="/" style={{ background: '#111111', color: 'white', padding: '14px 36px', borderRadius: 50, fontWeight: 800, fontSize: 15, textDecoration: 'none', boxShadow: '0 6px 20px rgba(0,0,0,0.2)', display: 'inline-block' }}>
          Continue Shopping ✦
        </Link>
      </div>
    );
  }

  if (items.length === 0) return (
    <div style={{ textAlign:'center', padding:'100px 20px' }}>
      <div style={{ fontSize:64, marginBottom:20 }}>🛒</div>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, color:'#111111', marginBottom:12 }}>Your cart is empty</h1>
      <p style={{ color:'#333333', marginBottom:28, fontWeight:600 }}>Add some magical outfits to get started!</p>
      <Link href="/" style={{ background:'#111111', color:'white', padding:'13px 30px', borderRadius:50, fontWeight:800, fontSize:14, textDecoration:'none' }}>Start Shopping ✦</Link>
    </div>
  );

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'32px 20px 80px' }}>
      {/* Steps */}
      <div style={{ display:'flex', gap:0, marginBottom:36, justifyContent:'center' }}>
        {['Cart','Checkout','Done'].map((s,i) => (
          <div key={s} style={{ display:'flex', alignItems:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:i<=(['cart','checkout','success'].indexOf(step))?'#111111':'rgba(0,0,0,0.08)', border:`2px solid ${i<=(['cart','checkout','success'].indexOf(step))?'#111111':'rgba(0,0,0,0.15)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:i<=(['cart','checkout','success'].indexOf(step))?'white':'#555555' }}>{i+1}</div>
              <span style={{ fontSize:13, fontWeight:800, color:i<=(['cart','checkout','success'].indexOf(step))?'#111111':'#999999' }}>{s}</span>
            </div>
            {i<2 && <div style={{ width:40, height:2, background:'rgba(0,0,0,0.1)', margin:'0 10px' }} />}
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:24, alignItems:'start' }}>
        <div>
          {step === 'cart' ? (
            <div>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:'#111111', marginBottom:20 }}>Shopping Cart <span style={{ fontSize:16, fontFamily:'Nunito,sans-serif', color:'#555555', fontWeight:700 }}>({items.length} items)</span></h1>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {items.map((item, idx) => (
                  <div key={idx} style={{ background:'white', borderRadius:16, padding:'14px', border:'1px solid rgba(0,0,0,0.08)', display:'flex', gap:14, alignItems:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ width:80, height:80, borderRadius:12, overflow:'hidden', position:'relative', flexShrink:0, border:'1px solid rgba(0,0,0,0.08)' }}>
                      <Image src={item.product.image_url} alt={item.product.name} fill style={{ objectFit:'cover' }} />
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:800, color:'#111111', fontSize:15, marginBottom:3 }}>{item.product.name}</div>
                      <div style={{ fontSize:12, color:'#555555', marginBottom:6, fontWeight:700 }}>Size: {item.size} · Color: {item.color}</div>
                      <div style={{ fontSize:19, fontWeight:800, color:'#111111' }}>₹{Number(item.product.price).toFixed(0)}</div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <button onClick={()=>updateQuantity(item.product.id,item.size,item.color,Math.max(1,item.quantity-1))} style={{ width:32,height:32,borderRadius:8,border:'2px solid rgba(0,0,0,0.15)',background:'white',color:'#111111',fontSize:16,fontWeight:800,cursor:'pointer' }}>−</button>
                      <span style={{ fontWeight:800, color:'#111111', minWidth:20, textAlign:'center' }}>{item.quantity}</span>
                      <button onClick={()=>updateQuantity(item.product.id,item.size,item.color,item.quantity+1)} style={{ width:32,height:32,borderRadius:8,border:'2px solid rgba(0,0,0,0.15)',background:'white',color:'#111111',fontSize:16,fontWeight:800,cursor:'pointer' }}>+</button>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:16, fontWeight:800, color:'#111111', marginBottom:6 }}>₹{(Number(item.product.price)*item.quantity).toFixed(0)}</div>
                      <button onClick={()=>removeItem(item.product.id,item.size,item.color)} style={{ background:'none',border:'none',color:'#e91e8c',cursor:'pointer',fontSize:13,fontFamily:'Nunito,sans-serif',fontWeight:800 }}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:20 }}>
                <Link href="/" style={{ color:'#111111', textDecoration:'none', fontSize:14, fontWeight:800 }}>← Continue Shopping</Link>
              </div>
            </div>
          ) : (
            <div>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:'#111111', marginBottom:24 }}>Checkout Details</h1>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {[{name:'customer_name',placeholder:'Full Name *',type:'text'},{name:'customer_email',placeholder:'Email Address *',type:'email'},{name:'customer_phone',placeholder:'Phone Number',type:'tel'}].map(f => (
                  <input key={f.name} type={f.type} placeholder={f.placeholder} value={(form as any)[f.name]} onChange={e=>setForm({...form,[f.name]:e.target.value})} style={inp} />
                ))}
                <textarea placeholder="Shipping Address *" value={form.shipping_address} onChange={e=>setForm({...form,shipping_address:e.target.value})} rows={3} style={{ ...inp, resize:'vertical' }} />
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div style={{ background:'white', borderRadius:20, padding:'22px', border:'1px solid rgba(0,0,0,0.1)', position:'sticky', top:80, boxShadow:'0 4px 20px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'#111111', marginBottom:18 }}>Order Summary</h2>
          <div style={{ marginBottom:16, maxHeight:200, overflowY:'auto' }}>
            {items.map((item,i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#333333', marginBottom:8, fontWeight:700 }}>
                <span>{item.product.name} ×{item.quantity}</span>
                <span>₹{(Number(item.product.price)*item.quantity).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid rgba(0,0,0,0.08)', paddingTop:14, marginBottom:14 }}>
            <div style={{ display:'flex', gap:8, marginBottom:14 }}>
              <input value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="Coupon code" style={{ flex:1,padding:'8px 12px',borderRadius:10,border:'2px solid rgba(0,0,0,0.15)',background:'white',color:'#111111',fontSize:13,outline:'none',fontFamily:'Nunito,sans-serif',fontWeight:700 }} />
              <button onClick={applyCoupon} style={{ background:'#111111',border:'none',borderRadius:10,padding:'8px 14px',color:'white',fontWeight:800,fontSize:13,cursor:'pointer',fontFamily:'Nunito,sans-serif' }}>Apply</button>
            </div>
            {[['Subtotal',`₹${subtotal.toFixed(0)}`],['Discount',discount>0?`−₹${discountAmt}`:'-'],['Shipping',shipping===0?'FREE 🎉':`₹${shipping}`]].map(([l,v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#333333', marginBottom:8, fontWeight:700 }}>
                <span>{l}</span><span style={{ color:l==='Discount'&&discount>0?'#27ae60':'#111111' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:18, fontWeight:800, color:'#111111', marginBottom:20, padding:'12px 0', borderTop:'2px solid rgba(0,0,0,0.1)' }}>
            <span>Total</span><span>₹{total.toFixed(0)}</span>
          </div>
          {step === 'cart' ? (
            <button onClick={()=>setStep('checkout')} style={{ width:'100%',background:'#111111',border:'none',borderRadius:14,padding:'14px',color:'white',fontWeight:800,fontSize:15,cursor:'pointer',fontFamily:'Nunito,sans-serif',boxShadow:'0 6px 20px rgba(0,0,0,0.2)' }}>
              Proceed to Checkout →
            </button>
          ) : (
            <button onClick={handleCheckout} disabled={loading} style={{ width:'100%',background:loading?'rgba(0,0,0,0.4)':'#111111',border:'none',borderRadius:14,padding:'14px',color:'white',fontWeight:800,fontSize:15,cursor:loading?'not-allowed':'pointer',fontFamily:'Nunito,sans-serif' }}>
              {loading ? '⏳ Processing...' : '🔒 Pay with Razorpay'}
            </button>
          )}
          {step==='checkout' && <button onClick={()=>setStep('cart')} style={{ width:'100%',background:'none',border:'none',color:'#555555',fontSize:13,marginTop:10,cursor:'pointer',fontFamily:'Nunito,sans-serif',fontWeight:700 }}>← Back to Cart</button>}
          <div style={{ textAlign:'center', marginTop:12, fontSize:11, color:'#777777', fontWeight:700 }}>🔒 Secured by Razorpay · SSL Encrypted</div>
        </div>
      </div>
    </div>
  );
}
