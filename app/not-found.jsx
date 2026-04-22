"use client";
import Link from 'next/link';
import { Home, ArrowRight, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
      padding: 24,
    }}>
      {/* bg blobs */}
      <div style={{ position:'fixed',top:-120,left:-120,width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,rgba(37,99,235,0.10) 0%,transparent 70%)',pointerEvents:'none' }}/>
      <div style={{ position:'fixed',bottom:-80,right:-80,width:350,height:350,borderRadius:'50%',background:'radial-gradient(circle,rgba(124,58,237,0.08) 0%,transparent 70%)',pointerEvents:'none' }}/>

      <div style={{ textAlign:'center', maxWidth: 480, animation: 'fadeUp .5s cubic-bezier(.4,0,.2,1) both' }}>
        {/* big number */}
        <div style={{
          fontSize: 120, fontWeight: 900, lineHeight: 1,
          background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 8, letterSpacing: '-4px',
        }}>404</div>

        <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>
          Page Not Found
        </div>
        <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: 36 }}>
          The page you&apos;re looking for has been moved, deleted, or never existed.
        </p>

        {/* quick links */}
        <div style={{ display:'flex', flexDirection:'column', gap: 10, marginBottom: 32 }}>
          {[
            { href:'/', label:'Home', Icon: Home },
            { href:'/tests', label:'Tests', Icon: Search },
          ].map(({ href, label, Icon }) => (
            <Link key={href} href={href} style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'14px 20px',
              background:'rgba(255,255,255,0.85)', backdropFilter:'blur(12px)',
              border:'1.5px solid rgba(255,255,255,0.9)',
              borderRadius: 14, fontSize: 14, fontWeight: 700, color: '#0f172a',
              transition: 'all .2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='#2563eb'; e.currentTarget.style.color='#2563eb'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.9)'; e.currentTarget.style.color='#0f172a'; }}
            >
              <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
                <Icon size={16}/>{label}
              </div>
              <ArrowRight size={14}/>
            </Link>
          ))}
        </div>

        <Link href="/" style={{
          display:'inline-flex', alignItems:'center', gap: 8,
          padding:'13px 28px',
          background:'linear-gradient(135deg,#2563eb,#1d4ed8)',
          color:'#fff', border:'none', borderRadius: 14,
          fontSize: 14, fontWeight: 800,
          boxShadow: '0 8px 24px rgba(37,99,235,0.28)',
          transition:'all .2s',
        }}>
          <Home size={15}/> Back to Home
        </Link>
      </div>

      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
