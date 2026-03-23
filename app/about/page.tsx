export default function About() {
  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:'60px 20px 80px' }}>
      <div style={{ textAlign:'center', marginBottom:60 }}>
        <div style={{ fontSize:11, letterSpacing:'3px', color:'#111111', textTransform:'uppercase', fontWeight:800, marginBottom:14 }}>✦ Our Story ✦</div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:48, color:'#111111', lineHeight:1.2, marginBottom:16 }}>Born from a <span style={{ fontStyle:'italic', color:'#e91e8c' }}>Love</span> for Little Ones</h1>
        <p style={{ fontSize:16, color:'#111111', lineHeight:1.8, maxWidth:580, margin:'0 auto', fontWeight:600 }}>LittleStarsTwinkle was founded by parents who believed that every child deserves to feel magical in what they wear.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:50 }}>
        {[['🌙','Our Mission','To create enchanting, high-quality clothing that sparks imagination while keeping your little stars comfortable.'],['⭐','Our Values','Every stitch is made with care. We use premium, child-safe fabrics that are soft, durable, and gentle on skin.'],['🌈','Sustainability',"We're committed to eco-friendly packaging and responsible sourcing to protect the world our children will inherit."],['💛','Community',"Every purchase helps support underprivileged children's education programs across India."]].map(([icon,title,text]) => (
          <div key={title as string} style={{ background:'rgba(255,240,248,0.9)', borderRadius:18, padding:'28px', border:'1px solid rgba(233,30,140,0.15)', boxShadow:'0 4px 16px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize:36, marginBottom:12 }}>{icon}</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'#111111', marginBottom:10 }}>{title}</div>
            <p style={{ fontSize:13, color:'#444444', lineHeight:1.7 }}>{text}</p>
          </div>
        ))}
      </div>

      <div style={{ background:'linear-gradient(135deg,rgba(233,30,140,0.08),rgba(155,89,182,0.1))', borderRadius:20, padding:'40px', textAlign:'center', border:'1px solid rgba(233,30,140,0.15)' }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:'#111111', marginBottom:10 }}>Join the <span style={{ background:'linear-gradient(90deg,#e91e8c,#9b59b6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>LittleStarsTwinkle</span> Family</div>
        <p style={{ color:'#444444', marginBottom:20, fontSize:14, fontWeight:600 }}>10,000+ happy little stars and counting!</p>
        <a href="/" style={{ background:'#111111', color:'white', padding:'13px 28px', borderRadius:50, fontWeight:800, fontSize:14, textDecoration:'none' }}>Home ✦</a>
      </div>
    </div>
  );
}
