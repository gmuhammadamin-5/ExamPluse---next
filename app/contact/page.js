"use client"
import { Mail, MessageSquare, AlertCircle, Briefcase } from 'lucide-react'
import { useState } from 'react'

export default function Page() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)', padding:'100px 40px 60px' }}>
      <div style={{ maxWidth:900, margin:'0 auto' }}>
        <div style={{ fontSize:12, fontWeight:800, color:'#3b82f6', textTransform:'uppercase', letterSpacing:2, marginBottom:8 }}>Support</div>
        <h1 style={{ fontSize:'2.5rem', fontWeight:900, color:'#0f172a', margin:'0 0 8px', letterSpacing:'-1.5px' }}>Contact Us</h1>
        <p style={{ color:'#64748b', fontSize:15, marginBottom:40 }}>We're here to help anytime.</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:32 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[
              { icon:Mail,          color:'#3b82f6', title:'Support Email',     desc:'support@exampulse.ai' },
              { icon:MessageSquare, color:'#059669', title:'Live Chat',          desc:'Available 24/7' },
              { icon:AlertCircle,   color:'#ea580c', title:'Report Issue',       desc:'bugs@exampulse.ai' },
              { icon:Briefcase,     color:'#7c3aed', title:'Business',           desc:'business@exampulse.ai' },
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.title} style={{ background:'#fff', borderRadius:14, padding:'18px 20px', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:42, height:42, borderRadius:11, background:item.color+'15', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon size={20} color={item.color}/>
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:800, color:'#0f172a' }}>{item.title}</div>
                    <div style={{ fontSize:12, color:'#64748b', marginTop:2 }}>{item.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ background:'#fff', borderRadius:20, padding:'32px', border:'1px solid #e2e8f0' }}>
            <h3 style={{ margin:'0 0 24px', fontSize:17, fontWeight:800, color:'#0f172a' }}>Send a Message</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {[
                { label:'Name',    key:'name',    type:'text',  ph:'John Doe' },
                { label:'Email',   key:'email',   type:'email', ph:'john@example.com' },
                { label:'Subject', key:'subject', type:'text',  ph:'How can we help?' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize:12, fontWeight:700, color:'#475569', display:'block', marginBottom:6 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph} onChange={e=>setForm({...form,[f.key]:e.target.value})}
                    style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1px solid #e2e8f0', fontSize:13, outline:'none', fontFamily:'inherit', boxSizing:'border-box' }}/>
                </div>
              ))}
              <div>
                <label style={{ fontSize:12, fontWeight:700, color:'#475569', display:'block', marginBottom:6 }}>Message</label>
                <textarea rows={4} placeholder="Tell us more..." onChange={e=>setForm({...form,message:e.target.value})}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:'1px solid #e2e8f0', fontSize:13, outline:'none', fontFamily:'inherit', resize:'vertical', boxSizing:'border-box' }}/>
              </div>
              <button style={{ background:'linear-gradient(135deg,#3b82f6,#1d4ed8)', color:'#fff', border:'none', padding:'13px', borderRadius:11, fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:'inherit' }}>
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}