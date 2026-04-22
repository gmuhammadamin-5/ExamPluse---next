"use client"
import { Check } from 'lucide-react'
import { useState } from 'react'

const plans = [
  { name:'Free',    price:{ m:0,  y:0  }, color:'#64748b', features:['5 tests/month','Basic AI feedback','Leaderboard','Community chat'], cta:'Get Started' },
  { name:'Premium', price:{ m:12, y:8  }, color:'#3b82f6', popular:true, features:['Unlimited tests','Advanced AI','Speaking simulation','Writing evaluation','Study plan','Analytics','Priority support'], cta:'Start Free Trial' },
  { name:'Pro',     price:{ m:24, y:16 }, color:'#7c3aed', features:['Everything in Premium','1-on-1 AI tutor','Band score prediction','Mock certificates','Offline access'], cta:'Go Pro' },
]

export default function Page() {
  const [yearly, setYearly] = useState(false)
  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)', padding:'100px 40px 60px', textAlign:'center' }}>
      <div style={{ maxWidth:1000, margin:'0 auto' }}>
        <div style={{ fontSize:12, fontWeight:800, color:'#3b82f6', textTransform:'uppercase', letterSpacing:2, marginBottom:8 }}>Pricing</div>
        <h1 style={{ fontSize:'2.5rem', fontWeight:900, color:'#0f172a', margin:'0 0 8px', letterSpacing:'-1.5px' }}>Simple Pricing</h1>
        <p style={{ color:'#64748b', fontSize:15, marginBottom:32 }}>Start free. Upgrade when ready.</p>
        <div style={{ display:'inline-flex', alignItems:'center', gap:12, background:'#fff', border:'1px solid #e2e8f0', borderRadius:100, padding:'6px 16px', marginBottom:48 }}>
          <span style={{ fontSize:13, fontWeight:600, color:yearly?'#94a3b8':'#0f172a' }}>Monthly</span>
          <div onClick={()=>setYearly(!yearly)} style={{ width:44, height:24, background:yearly?'#3b82f6':'#e2e8f0', borderRadius:100, cursor:'pointer', position:'relative', transition:'background 0.2s' }}>
            <div style={{ width:18, height:18, background:'#fff', borderRadius:'50%', position:'absolute', top:3, left:yearly?23:3, transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }}/>
          </div>
          <span style={{ fontSize:13, fontWeight:600, color:yearly?'#0f172a':'#94a3b8' }}>Yearly <span style={{ color:'#059669', fontSize:11 }}>-33%</span></span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
          {plans.map(p => (
            <div key={p.name} style={{ background:'#fff', borderRadius:20, padding:'32px 28px', border:p.popular?`2px solid ${p.color}`:'1px solid #e2e8f0', boxShadow:p.popular?`0 8px 32px ${p.color}22`:'none', position:'relative' }}>
              {p.popular && <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:p.color, color:'#fff', fontSize:11, fontWeight:800, padding:'3px 14px', borderRadius:100 }}>POPULAR</div>}
              <h3 style={{ margin:'0 0 8px', fontSize:18, fontWeight:900, color:'#0f172a' }}>{p.name}</h3>
              <div style={{ fontSize:40, fontWeight:900, color:p.color, lineHeight:1, marginBottom:24 }}>${yearly?p.price.y:p.price.m}<span style={{ fontSize:14, color:'#94a3b8', fontWeight:600 }}>/mo</span></div>
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24, textAlign:'left' }}>
                {p.features.map(f => (
                  <div key={f} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#475569' }}>
                    <Check size={15} color={p.color}/>{f}
                  </div>
                ))}
              </div>
              <button style={{ width:'100%', padding:'12px', borderRadius:12, border:p.popular?'none':`2px solid ${p.color}`, background:p.popular?p.color:'transparent', color:p.popular?'#fff':p.color, fontSize:14, fontWeight:800, cursor:'pointer' }}>{p.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}