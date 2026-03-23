'use client';
import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) { alert('Please fill all required fields'); return; }
    setSent(true);
  };

  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:'60px 20px 80px' }}>
      <div style={{ textAlign:'center', marginBottom:50 }}>
        <div style={{ fontSize:11, letterSpacing:'3px', color:'rgba(245,200,66,0.6)', textTransform:'uppercase', fontWeight:700, marginBottom:14 }}>✦ Get In Touch ✦</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:44, color:'rgba(255,240,220,0.97)', marginBottom:12 }}>We'd <span style={{ fontStyle:'italic', color:'#FF6FB7' }}>Love</span> to Hear from You</h1>
        <p style={{ color:'rgba(200,168,255,0.6)', fontSize:15 }}>Questions, feedback, or just want to say hi? We're here!</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:32 }}>
        <div>
          {[['📧','Email Us','hello@littlestarsttwinkle.com'],['📞','Call Us','+91 98765 43210'],['📍','Find Us','Hyderabad, Telangana, India'],['🕐','Hours','Mon–Sat, 9am–6pm IST']].map(([icon,label,val]) => (
            <div key={label as string} style={{ display:'flex', gap:14, marginBottom:24 }}>
              <div style={{ width:44,height:44,borderRadius:12,background:'rgba(245,200,66,0.1)',border:'1px solid rgba(245,200,66,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0 }}>{icon}</div>
              <div>
                <div style={{ fontSize:12,fontWeight:800,color:'rgba(245,200,66,0.7)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:3 }}>{label}</div>
                <div style={{ fontSize:14,color:'rgba(200,168,255,0.7)' }}>{val}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop:20 }}>
            <div style={{ fontSize:12,fontWeight:800,color:'rgba(245,200,66,0.55)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:12 }}>Follow Us</div>
            <div style={{ display:'flex', gap:10 }}>
              {['📘','📸','🐦','▶️'].map((icon,i) => <div key={i} style={{ width:36,height:36,borderRadius:10,background:'rgba(245,200,66,0.08)',border:'1px solid rgba(245,200,66,0.18)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,cursor:'pointer' }}>{icon}</div>)}
            </div>
          </div>
        </div>

        <div style={{ background:'rgba(22,3,54,0.9)',borderRadius:20,padding:'28px',border:'1px solid rgba(245,200,66,0.15)' }}>
          {sent ? (
            <div style={{ textAlign:'center', padding:'40px 0' }}>
              <div style={{ fontSize:56,marginBottom:14 }}>🌟</div>
              <div style={{ fontFamily:"'Playfair Display',serif",fontSize:24,color:'rgba(255,240,220,0.9)',marginBottom:8 }}>Message Sent!</div>
              <p style={{ color:'rgba(200,168,255,0.55)',fontSize:14 }}>We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <div style={{ display:'flex',flexDirection:'column',gap:14 }}>
              {[['name','Your Name *','text'],['email','Email Address *','email'],['subject','Subject','text']].map(([key,ph,type]) => (
                <div key={key}>
                  <input type={type} placeholder={ph} value={(form as any)[key]} onChange={e=>setForm({...form,[key]:e.target.value})} style={{ width:'100%',padding:'11px 14px',borderRadius:11,border:'1px solid rgba(245,200,66,0.2)',background:'rgba(11,1,32,0.6)',color:'rgba(255,240,220,0.9)',fontSize:14,outline:'none',fontFamily:'Nunito,sans-serif' }} />
                </div>
              ))}
              <textarea placeholder="Your message *" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows={4} style={{ width:'100%',padding:'11px 14px',borderRadius:11,border:'1px solid rgba(245,200,66,0.2)',background:'rgba(11,1,32,0.6)',color:'rgba(255,240,220,0.9)',fontSize:14,outline:'none',fontFamily:'Nunito,sans-serif',resize:'vertical' }} />
              <button onClick={handleSubmit} style={{ background:'linear-gradient(135deg,#F5C842,#FF6FB7)',border:'none',borderRadius:12,padding:'13px',color:'#0B0120',fontWeight:800,fontSize:15,cursor:'pointer',fontFamily:'Nunito,sans-serif' }}>
                Send Message ✦
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
