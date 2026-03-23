export default function Wishlist() {
  return (
    <div style={{ textAlign:'center', padding:'100px 20px' }}>
      <div style={{ fontSize:64, marginBottom:20 }}>♡</div>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:32, color:'rgba(255,240,220,0.9)', marginBottom:12 }}>Your Wishlist</div>
      <p style={{ color:'rgba(200,168,255,0.5)', marginBottom:28 }}>Save your favourite items here. Click the ♡ on any product to add it!</p>
      <a href="/" style={{ background:'linear-gradient(135deg,#F5C842,#FF6FB7)', color:'#0B0120', padding:'13px 30px', borderRadius:50, fontWeight:800, fontSize:14, textDecoration:'none' }}>Browse Products ✦</a>
    </div>
  );
}
