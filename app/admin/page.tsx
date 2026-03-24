'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Product {
  id: number; name: string; description: string; price: number;
  category: string; gender: string; image_url: string; stock: number;
  design_no?: string; age_group?: string; is_new?: boolean; is_bestseller?: boolean;
}

interface Order {
  id: number; customer_name: string; customer_email: string;
  customer_phone: string; shipping_address: string; total_amount: number;
  payment_status: string; order_status: string; created_at: string; items?: any[];
}

const TABS = ['Dashboard','Products','Add Product','Orders','Newsletter','Settings'];
const CATEGORIES = ['Rompers','Dresses','Nightwear','Co-ord Sets','T-Shirts','Jackets','Hoodies','Footwear','Accessories'];
const GENDERS = ['Kids','Girls','Boys','Unisex'];
const AGE_GROUPS = ['0-3M','3-6M','6-12M','1-2Y','2-3Y','3-4Y','4-5Y','5-6Y','6-8Y','8-10Y','10-12Y'];

const C = {
  bg: '#f8f5f2', sidebar: '#16213e', card: 'white', border: '#ece8e3',
  accent: '#e91e8c', text: '#1a1a1a', muted: '#888', green: '#22c55e', red: '#ef4444'
};

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const emptyForm = { name:'', description:'', price:'', category:'Rompers', gender:'Kids', image_url:'', stock:'50', design_no:'', age_group:'1-2Y', is_new: true, is_bestseller: false };
  const [form, setForm] = useState<any>(emptyForm);

  useEffect(() => {
    fetch('/api/admin/auth').then(r => { if (r.ok) setAuthenticated(true); }).finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetchProducts(); fetchOrders(); fetchSubscribers();
  }, [authenticated]);

  useEffect(() => { setImagePreview(form.image_url); }, [form.image_url]);

  const handleLogin = async () => {
    setAuthError('');
    const res = await fetch('/api/admin/auth', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({password:passwordInput}) });
    if (res.ok) setAuthenticated(true);
    else { const d = await res.json(); setAuthError(d.error || 'Incorrect password'); setPasswordInput(''); }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method:'DELETE' });
    setAuthenticated(false); setPasswordInput('');
  };

  const fetchProducts = async () => {
    try { const r = await fetch('/api/products?limit=100'); const d = await r.json(); setProducts(d.products || d); } catch {}
  };
  const fetchOrders = async () => {
    try { const r = await fetch('/api/admin/orders'); if (r.ok) setOrders(await r.json()); } catch {}
  };
  const fetchSubscribers = async () => {
    try { const r = await fetch('/api/newsletter'); if (r.ok) setSubscribers(await r.json()); } catch {}
  };

  const updateOrderStatus = async (id: number, status: string) => {
    await fetch('/api/admin/orders', { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id, order_status:status}) });
    setOrders(prev => prev.map(o => o.id===id ? {...o, order_status:status} : o));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { const r = reader.result as string; setImagePreview(r); setForm((f: any) => ({...f, image_url:r})); };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category) { alert('Please fill Name, Price and Category'); return; }
    setSaving(true);
    const data = { ...form, price:parseFloat(form.price), stock:parseInt(form.stock)||50, is_new: form.is_new===true||form.is_new==='true', is_bestseller: form.is_bestseller===true||form.is_bestseller==='true' };
    try {
      if (editingProduct) {
        await fetch(`/api/admin/products/${editingProduct.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
        alert('✅ Product updated!');
      } else {
        await fetch('/api/admin/products', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
        alert('✅ Product added!');
      }
      setForm(emptyForm); setEditingProduct(null); setImagePreview('');
      fetchProducts(); setActiveTab('Products');
    } catch { alert('Failed to save.'); }
    finally { setSaving(false); }
  };

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({ name:p.name, description:p.description, price:String(p.price), category:p.category, gender:p.gender||'Kids', image_url:p.image_url, stock:String(p.stock), design_no:p.design_no||'', age_group:p.age_group||'1-2Y', is_new:p.is_new??true, is_bestseller:p.is_bestseller??false });
    setImagePreview(p.image_url); setActiveTab('Add Product');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/admin/products/${id}`, {method:'DELETE'});
    fetchProducts();
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()) || (p.gender||'').toLowerCase().includes(search.toLowerCase()));
  const totalRevenue = orders.filter(o=>o.payment_status==='paid').reduce((s,o)=>s+Number(o.total_amount),0);

  const inp = { width:'100%', padding:'10px 14px', borderRadius:8, border:`1.5px solid ${C.border}`, background:'white', color:C.text, fontSize:13, outline:'none', fontFamily:'inherit', boxSizing:'border-box' as const };
  const lbl = { fontSize:11, fontWeight:700 as const, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'1px', display:'block' as const, marginBottom:6 };
  const btn = (variant: 'primary'|'ghost'='primary') => ({
    padding:'10px 20px', borderRadius:8, border:'none', cursor:'pointer', fontWeight:700, fontSize:12, letterSpacing:'0.5px',
    background:variant==='primary'?C.accent:'transparent', color:variant==='primary'?'white':C.muted,
    border2:variant==='ghost'?`1px solid ${C.border}`:'none'
  });

  if (!authChecked) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif'}}>Loading...</div>;

  if (!authenticated) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:C.bg,fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{background:C.card,borderRadius:16,padding:48,width:'100%',maxWidth:400,boxShadow:'0 20px 60px rgba(0,0,0,0.1)',textAlign:'center'}}>
        <div style={{fontSize:40,marginBottom:16}}>🔐</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:'#e91e8c',marginBottom:6,fontWeight:700}}>Admin Access</div>
        <p style={{color:C.muted,fontSize:13,marginBottom:28}}>Little Stars Twinkle — Admin Panel</p>
        <input type="password" placeholder="Enter admin password" value={passwordInput}
          onChange={e=>setPasswordInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleLogin()}
          style={{...inp,marginBottom:16,textAlign:'center'}} />
        {authError && <p style={{color:C.red,fontSize:12,marginBottom:12}}>{authError}</p>}
        <button onClick={handleLogin} style={{...inp,background:C.accent,color:'white',fontWeight:700,cursor:'pointer',border:'none',padding:'12px',letterSpacing:'1px'}}>LOGIN</button>
      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=DM+Sans:wght@400;600;700;800&display=swap');`}</style>
    </div>
  );

  // ── MAIN ADMIN LAYOUT ──
  return (
    <div style={{display:'flex',minHeight:'100vh',fontFamily:"'DM Sans',sans-serif",background:C.bg}}>

      {/* Sidebar */}
      <div style={{width:220,background:C.sidebar,flexShrink:0,display:'flex',flexDirection:'column',padding:'24px 0'}}>
        <div style={{padding:'0 20px 24px',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:'white',fontWeight:700}}>Little Stars</div>
          <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',letterSpacing:'2px',textTransform:'uppercase'}}>Admin Panel</div>
        </div>
        <nav style={{padding:'16px 12px',flex:1}}>
          {TABS.map(tab => {
            const icons: Record<string,string> = {Dashboard:'📊',Products:'👕',Orders:'📦','Add Product':'➕',Newsletter:'📧',Settings:'⚙️'};
            return (
              <button key={tab} onClick={()=>setActiveTab(tab)} style={{
                width:'100%',display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:8,
                background:activeTab===tab?'rgba(233,30,140,0.2)':'transparent',
                border:activeTab===tab?'1px solid rgba(139,26,74,0.5)':'1px solid transparent',
                color:activeTab===tab?'white':'rgba(255,255,255,0.55)',fontWeight:600,fontSize:13,cursor:'pointer',
                marginBottom:4,textAlign:'left',transition:'all 0.15s',fontFamily:'inherit'
              }}>
                <span style={{fontSize:14}}>{icons[tab]}</span>{tab}
              </button>
            );
          })}
        </nav>
        <div style={{padding:'16px 12px',borderTop:'1px solid rgba(255,255,255,0.08)'}}>
          <button onClick={handleLogout} style={{width:'100%',padding:'10px',borderRadius:8,border:'1px solid rgba(255,255,255,0.15)',background:'transparent',color:'rgba(255,255,255,0.5)',fontSize:12,cursor:'pointer',fontFamily:'inherit',fontWeight:600}}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{flex:1,overflow:'auto'}}>
        <div style={{padding:'28px 32px',maxWidth:1200}}>

          {/* ── DASHBOARD ── */}
          {activeTab==='Dashboard' && (
            <div>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,color:C.text,marginBottom:28,fontWeight:700}}>Dashboard</h1>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:20,marginBottom:32}}>
                {[
                  {label:'Total Products',value:products.length,icon:'👕',color:'#4f46e5'},
                  {label:'Total Orders',value:orders.length,icon:'📦',color:'#0891b2'},
                  {label:'Revenue',value:`₹${totalRevenue.toLocaleString()}`,icon:'💰',color:C.accent},
                  {label:'Subscribers',value:subscribers.length,icon:'📧',color:'#059669'},
                ].map(stat=>(
                  <div key={stat.label} style={{background:C.card,borderRadius:12,padding:'24px 20px',border:`1px solid ${C.border}`,display:'flex',alignItems:'center',gap:16}}>
                    <div style={{width:48,height:48,borderRadius:10,background:`${stat.color}15`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>{stat.icon}</div>
                    <div>
                      <div style={{fontSize:22,fontWeight:800,color:C.text}}>{stat.value}</div>
                      <div style={{fontSize:12,color:C.muted}}>{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Recent Orders */}
              <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,overflow:'hidden'}}>
                <div style={{padding:'16px 20px',borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:14}}>Recent Orders</div>
                {orders.slice(0,5).map(o=>(
                  <div key={o.id} style={{padding:'14px 20px',borderBottom:`1px solid ${C.border}`,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:13}}>#{o.id} — {o.customer_name}</div>
                      <div style={{fontSize:12,color:C.muted}}>{new Date(o.created_at).toLocaleDateString('en-IN')}</div>
                    </div>
                    <div style={{display:'flex',gap:12,alignItems:'center'}}>
                      <span style={{fontWeight:800,fontSize:14}}>₹{Number(o.total_amount).toLocaleString()}</span>
                      <span style={{fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:50,background:o.payment_status==='paid'?'#d1fae5':o.payment_status==='pending'?'#fef3c7':'#fee2e2',color:o.payment_status==='paid'?C.green:o.payment_status==='pending'?'#d97706':C.red}}>{o.payment_status}</span>
                    </div>
                  </div>
                ))}
                {!orders.length && <div style={{padding:32,textAlign:'center',color:C.muted,fontSize:13}}>No orders yet</div>}
              </div>
            </div>
          )}

          {/* ── PRODUCTS LIST ── */}
          {activeTab==='Products' && (
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24,flexWrap:'wrap',gap:12}}>
                <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,color:C.text,fontWeight:700,margin:0}}>Products <span style={{fontSize:16,color:C.muted,fontWeight:400}}>({filtered.length})</span></h1>
                <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                  <input placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)} style={{...inp,width:220}}/>
                  <button onClick={()=>{setEditingProduct(null);setForm(emptyForm);setImagePreview('');setActiveTab('Add Product');}} style={{background:C.accent,color:'white',border:'none',padding:'10px 18px',borderRadius:8,cursor:'pointer',fontWeight:700,fontSize:12,letterSpacing:'0.5px',fontFamily:'inherit'}}>+ Add Product</button>
                </div>
              </div>
              <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,overflow:'hidden'}}>
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
                    <thead>
                      <tr style={{background:'#f9f7f5'}}>
                        {['Image','Name','Category','Gender','Price','Stock','Badges','Actions'].map(h=>(
                          <th key={h} style={{padding:'12px 14px',textAlign:'left',fontWeight:700,fontSize:11,color:C.muted,letterSpacing:'1px',textTransform:'uppercase',borderBottom:`1px solid ${C.border}`,whiteSpace:'nowrap'}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(p=>(
                        <tr key={p.id} style={{borderBottom:`1px solid ${C.border}`,transition:'background 0.15s'}} onMouseEnter={e=>(e.currentTarget.style.background='#fafaf9')} onMouseLeave={e=>(e.currentTarget.style.background='white')}>
                          <td style={{padding:'10px 14px'}}>
                            <div style={{width:50,height:50,borderRadius:8,overflow:'hidden',position:'relative',background:'#f0f0f0'}}>
                              <Image src={p.image_url} alt={p.name} fill style={{objectFit:'cover'}} sizes="50px"
                                onError={(e)=>{(e.target as HTMLImageElement).src='https://via.placeholder.com/50x50/fce4ec/333?text=LST';}} />
                            </div>
                          </td>
                          <td style={{padding:'10px 14px'}}>
                            <div style={{fontWeight:700,color:C.text,marginBottom:2}}>{p.name}</div>
                            {p.design_no && <div style={{fontSize:11,color:C.muted}}>{p.design_no}</div>}
                          </td>
                          <td style={{padding:'10px 14px',color:C.muted}}>{p.category}</td>
                          <td style={{padding:'10px 14px'}}>
                            <span style={{fontSize:11,fontWeight:700,padding:'3px 8px',borderRadius:50,background:p.gender==='Girls'?'#fce4ec':p.gender==='Boys'?'#e3f2fd':'#f3f4f6',color:p.gender==='Girls'?'#e91e8c':p.gender==='Boys'?'#1565c0':'#555'}}>{p.gender||'Kids'}</span>
                          </td>
                          <td style={{padding:'10px 14px',fontWeight:800}}>₹{Number(p.price).toFixed(0)}</td>
                          <td style={{padding:'10px 14px'}}>
                            <span style={{color:p.stock<10?C.red:C.green,fontWeight:700}}>{p.stock}</span>
                          </td>
                          <td style={{padding:'10px 14px'}}>
                            <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                              {p.is_new && <span style={{fontSize:10,background:'#e53935',color:'white',padding:'2px 6px',borderRadius:3,fontWeight:800}}>NEW</span>}
                              {p.is_bestseller && <span style={{fontSize:10,background:'#f59e0b',color:'white',padding:'2px 6px',borderRadius:3,fontWeight:800}}>BEST</span>}
                            </div>
                          </td>
                          <td style={{padding:'10px 14px'}}>
                            <div style={{display:'flex',gap:6}}>
                              <button onClick={()=>handleEdit(p)} style={{padding:'6px 12px',borderRadius:6,border:`1px solid ${C.border}`,background:'white',cursor:'pointer',fontSize:12,fontWeight:700,color:C.text,fontFamily:'inherit'}}>Edit</button>
                              <button onClick={()=>handleDelete(p.id)} style={{padding:'6px 12px',borderRadius:6,border:'none',background:'#fee2e2',cursor:'pointer',fontSize:12,fontWeight:700,color:C.red,fontFamily:'inherit'}}>Del</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {!filtered.length && <div style={{padding:48,textAlign:'center',color:C.muted}}>No products found</div>}
                </div>
              </div>
            </div>
          )}

          {/* ── ADD / EDIT PRODUCT ── */}
          {activeTab==='Add Product' && (
            <div>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,color:C.text,marginBottom:28,fontWeight:700}}>{editingProduct?`Edit: ${editingProduct.name}`:'Add New Product'}</h1>
              <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:24,alignItems:'start'}}>
                {/* Left — Form */}
                <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:28,display:'flex',flexDirection:'column',gap:20}}>
                  {/* Name */}
                  <div>
                    <label style={lbl}>Product Name *</label>
                    <input value={form.name} onChange={e=>setForm((f: any)=>({...f,name:e.target.value}))} placeholder="e.g. Butterfly Garden Dress" style={inp}/>
                  </div>
                  {/* Price + Stock */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                    <div>
                      <label style={lbl}>Price (₹) *</label>
                      <input type="number" value={form.price} onChange={e=>setForm((f: any)=>({...f,price:e.target.value}))} placeholder="299" style={inp}/>
                    </div>
                    <div>
                      <label style={lbl}>Stock *</label>
                      <input type="number" value={form.stock} onChange={e=>setForm((f: any)=>({...f,stock:e.target.value}))} placeholder="50" style={inp}/>
                    </div>
                  </div>
                  {/* Category + Gender */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                    <div>
                      <label style={lbl}>Category *</label>
                      <select value={form.category} onChange={e=>setForm((f: any)=>({...f,category:e.target.value}))} style={{...inp}}>
                        {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>Gender *</label>
                      <select value={form.gender} onChange={e=>setForm((f: any)=>({...f,gender:e.target.value}))} style={{...inp}}>
                        {GENDERS.map(g=><option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                  {/* Design No + Age Group */}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
                    <div>
                      <label style={lbl}>Design No.</label>
                      <input value={form.design_no} onChange={e=>setForm((f: any)=>({...f,design_no:e.target.value}))} placeholder="D.no-7055" style={inp}/>
                    </div>
                    <div>
                      <label style={lbl}>Age Group</label>
                      <select value={form.age_group} onChange={e=>setForm((f: any)=>({...f,age_group:e.target.value}))} style={{...inp}}>
                        {AGE_GROUPS.map(a=><option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>
                  {/* Description */}
                  <div>
                    <label style={lbl}>Description</label>
                    <textarea value={form.description} onChange={e=>setForm((f: any)=>({...f,description:e.target.value}))} rows={3} placeholder="Describe the product..." style={{...inp,resize:'vertical'}} />
                  </div>
                  {/* Badges */}
                  <div style={{display:'flex',gap:24}}>
                    <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:13,fontWeight:600}}>
                      <input type="checkbox" checked={!!form.is_new} onChange={e=>setForm((f: any)=>({...f,is_new:e.target.checked}))} style={{width:16,height:16}}/>
                      Mark as NEW
                    </label>
                    <label style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:13,fontWeight:600}}>
                      <input type="checkbox" checked={!!form.is_bestseller} onChange={e=>setForm((f: any)=>({...f,is_bestseller:e.target.checked}))} style={{width:16,height:16}}/>
                      Mark as BESTSELLER
                    </label>
                  </div>
                  {/* Image */}
                  <div>
                    <label style={lbl}>Product Image</label>
                    <div style={{display:'flex',gap:10,marginBottom:12}}>
                      <button onClick={()=>fileRef.current?.click()} style={{flex:1,padding:'10px',borderRadius:8,border:`2px dashed ${C.border}`,background:'#fafaf9',cursor:'pointer',fontSize:12,fontWeight:700,color:C.muted,fontFamily:'inherit'}}>📁 Upload Image</button>
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} style={{display:'none'}}/>
                    </div>
                    <label style={{...lbl,marginBottom:4}}>Or paste image URL</label>
                    <input value={form.image_url} onChange={e=>setForm((f: any)=>({...f,image_url:e.target.value}))} placeholder="https://... or /products/..." style={inp}/>
                  </div>
                  {/* Actions */}
                  <div style={{display:'flex',gap:12,paddingTop:8}}>
                    <button onClick={handleSubmit} disabled={saving} style={{flex:1,padding:'13px',borderRadius:8,border:'none',background:C.accent,color:'white',fontWeight:800,fontSize:13,cursor:'pointer',letterSpacing:'1px',fontFamily:'inherit',opacity:saving?0.7:1}}>
                      {saving?'Saving...':editingProduct?'✓ Update Product':'+ Add Product'}
                    </button>
                    {editingProduct && <button onClick={()=>{setEditingProduct(null);setForm(emptyForm);setImagePreview('');}} style={{padding:'13px 20px',borderRadius:8,border:`1.5px solid ${C.border}`,background:'white',cursor:'pointer',fontWeight:700,fontSize:13,color:C.muted,fontFamily:'inherit'}}>Cancel</button>}
                  </div>
                </div>
                {/* Right — Preview */}
                <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:20,position:'sticky',top:20}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.muted,letterSpacing:'1px',textTransform:'uppercase',marginBottom:16}}>Preview</div>
                  <div style={{borderRadius:10,overflow:'hidden',border:`1px solid ${C.border}`}}>
                    <div style={{height:220,background:'#f5f0ec',position:'relative',display:'flex',alignItems:'center',justifyContent:'center'}}>
                      {imagePreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imagePreview} alt="preview" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{(e.target as HTMLImageElement).style.display='none';}} />
                      ) : (
                        <div style={{color:C.muted,fontSize:13}}>Image preview</div>
                      )}
                      {form.is_new && <div style={{position:'absolute',top:10,left:10,background:'#e53935',color:'white',fontSize:10,fontWeight:800,padding:'3px 8px',borderRadius:4}}>NEW</div>}
                      {form.is_bestseller && <div style={{position:'absolute',top:form.is_new?32:10,left:10,background:'#f59e0b',color:'white',fontSize:10,fontWeight:800,padding:'3px 8px',borderRadius:4}}>★ BESTSELLER</div>}
                    </div>
                    <div style={{padding:'12px 14px'}}>
                      {form.design_no && <div style={{fontSize:10,color:C.muted,marginBottom:3}}>{form.design_no}</div>}
                      <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:6}}>{form.name||'Product Name'}</div>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <span style={{fontSize:18,fontWeight:800}}>₹{form.price||'0'}</span>
                        <span style={{fontSize:11,padding:'3px 8px',borderRadius:50,background:form.gender==='Girls'?'#fce4ec':form.gender==='Boys'?'#e3f2fd':'#f3f4f6',color:form.gender==='Girls'?'#c2185b':form.gender==='Boys'?'#1565c0':'#555',fontWeight:700}}>{form.gender||'Kids'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeTab==='Orders' && (
            <div>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,color:C.text,marginBottom:28,fontWeight:700}}>Orders <span style={{fontSize:16,color:C.muted,fontWeight:400}}>({orders.length})</span></h1>
              {orders.map(o=>(
                <div key={o.id} style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:20,marginBottom:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12,marginBottom:12}}>
                    <div>
                      <div style={{fontWeight:800,fontSize:15}}>Order #{o.id} — {o.customer_name}</div>
                      <div style={{fontSize:12,color:C.muted}}>{o.customer_email} · {o.customer_phone}</div>
                      <div style={{fontSize:12,color:C.muted,marginTop:4}}>{new Date(o.created_at).toLocaleString('en-IN')}</div>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontSize:20,fontWeight:800}}>₹{Number(o.total_amount).toLocaleString()}</div>
                      <span style={{fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:50,background:o.payment_status==='paid'?'#d1fae5':'#fef3c7',color:o.payment_status==='paid'?C.green:'#d97706'}}>{o.payment_status}</span>
                    </div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
                    <span style={{fontSize:12,fontWeight:700,color:C.muted}}>Status:</span>
                    {['confirmed','processing','shipped','delivered','cancelled'].map(s=>(
                      <button key={s} onClick={()=>updateOrderStatus(o.id,s)} style={{padding:'5px 12px',borderRadius:50,border:`1.5px solid ${o.order_status===s?C.accent:C.border}`,background:o.order_status===s?C.accent:'white',color:o.order_status===s?'white':C.muted,fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'inherit',textTransform:'capitalize'}}>{s}</button>
                    ))}
                  </div>
                  {o.shipping_address && <div style={{marginTop:12,fontSize:12,color:C.muted,background:'#f9f7f5',borderRadius:8,padding:'8px 12px'}}>📍 {o.shipping_address}</div>}
                </div>
              ))}
              {!orders.length && <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:48,textAlign:'center',color:C.muted}}>No orders yet</div>}
            </div>
          )}

          {/* ── NEWSLETTER ── */}
          {activeTab==='Newsletter' && (
            <div>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,color:C.text,marginBottom:28,fontWeight:700}}>Newsletter Subscribers <span style={{fontSize:16,color:C.muted,fontWeight:400}}>({subscribers.length})</span></h1>
              <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,overflow:'hidden'}}>
                {subscribers.map((s,i)=>(
                  <div key={s.id} style={{padding:'14px 20px',borderBottom:`1px solid ${C.border}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{fontWeight:600,fontSize:13}}>{s.email}</div>
                    <div style={{fontSize:12,color:C.muted}}>{new Date(s.subscribed_at).toLocaleDateString('en-IN')}</div>
                  </div>
                ))}
                {!subscribers.length && <div style={{padding:48,textAlign:'center',color:C.muted}}>No subscribers yet</div>}
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeTab==='Settings' && (
            <div>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,color:C.text,marginBottom:28,fontWeight:700}}>Settings</h1>
              <div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,padding:32,maxWidth:500}}>
                <div style={{fontWeight:800,fontSize:14,marginBottom:20}}>Admin Account</div>
                <p style={{fontSize:13,color:C.muted,marginBottom:24}}>To change admin password, update the ADMIN_PASSWORD environment variable in your deployment settings.</p>
                <button onClick={handleLogout} style={{padding:'12px 24px',borderRadius:8,border:'none',background:C.red,color:'white',fontWeight:700,cursor:'pointer',fontSize:13,fontFamily:'inherit'}}>Logout</button>
              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        textarea { font-family: inherit; }
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 320px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
