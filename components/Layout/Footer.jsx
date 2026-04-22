"use client";
import Link from 'next/link';
import { Mail, MessageCircle, Send, ArrowRight, Zap, Globe, Trophy, Users } from 'lucide-react';

const LINKS = {
  "Platform": [
    { label: "Home",        href: "/" },
    { label: "Tests",       href: "/tests" },
    { label: "Lessons",     href: "/lessons" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Pricing",     href: "/pricing" },
  ],
  "AI Tools": [
    { label: "AI IELTS Tutor",    href: "/ai-tutor" },
    { label: "Writing Evaluator", href: "/writing-evaluator" },
    { label: "Speaking Coach",    href: "/speaking-evaluator" },
    { label: "Vocabulary Master", href: "/vocabulary" },
    { label: "Global Chat",       href: "/global-chat" },
  ],
  "Exams": [
    { label: "IELTS Mock Tests", href: "/tests" },
    { label: "Cambridge",        href: "/tests" },
    { label: "TOEFL iBT",        href: "/tests" },
    { label: "CEFR Levels",      href: "/tests" },
    { label: "SAT Practice",     href: "/tests" },
  ],
  "Support": [
    { label: "About Us",       href: "/contact" },
    { label: "Contact",        href: "/contact" },
    { label: "Privacy Policy", href: "/contact" },
    { label: "Terms of Use",   href: "/contact" },
  ],
};

const STATS = [
  { Icon: Users,  val: "18,000+", label: "Active Students"  },
  { Icon: Trophy, val: "56",      label: "Mock Tests"        },
  { Icon: Globe,  val: "150+",    label: "Countries"         },
  { Icon: Zap,    val: "98.7%",   label: "Success Rate"      },
];

const SOCIALS = [
  { Icon: Send,          href: "https://t.me/exampulse", color: "#0088cc", label: "Telegram"  },
  { Icon: MessageCircle, href: "#",                       color: "#e4405f", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(135deg,#f0f8ff 0%,#e6f7ff 50%,#d6f0ff 100%)', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", borderTop: '1.5px solid rgba(0,123,255,0.10)' }}>

      {/* CTA strip */}
      <div style={{ background: 'linear-gradient(135deg,#007bff,#0056b3)', padding: '48px 24px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
          <div>
            <div style={{ fontSize:24, fontWeight:900, color:'#fff', marginBottom:6 }}>
              Start your IELTS journey today
            </div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,0.75)' }}>
              Free tests — no sign up required
            </div>
          </div>
          <Link href="/tests" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#fff', color:'#007bff', padding:'14px 28px', borderRadius:14, fontSize:14, fontWeight:800, boxShadow:'0 8px 24px rgba(0,0,0,0.14)', textDecoration:'none' }}>
            Start Free <ArrowRight size={15}/>
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ borderBottom:'1.5px solid rgba(0,123,255,0.08)', padding:'28px 24px', background:'rgba(255,255,255,0.5)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
          {STATS.map(({ Icon, val, label }) => (
            <div key={label} style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:11, background:'rgba(0,123,255,0.10)', border:'1px solid rgba(0,123,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={17} color="#007bff"/>
              </div>
              <div>
                <div style={{ fontSize:18, fontWeight:900, color:'#0f172a' }}>{val}</div>
                <div style={{ fontSize:11, color:'#64748b', fontWeight:600 }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main links */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'52px 24px 40px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr 1fr 1fr 1fr', gap:40 }}>

          {/* Brand col */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#007bff,#0056b3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:'#fff' }}>EP</div>
              <span style={{ fontSize:18, fontWeight:900, color:'#0f172a' }}>ExamPulse</span>
            </div>
            <p style={{ fontSize:13, lineHeight:1.75, color:'#64748b', marginBottom:24, maxWidth:220 }}>
              The best platform for IELTS, Cambridge, TOEFL, CEFR and SAT exam preparation.
            </p>

            <div style={{ display:'flex', gap:8, marginBottom:20 }}>
              {SOCIALS.map(({ Icon, href, color, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                  style={{ width:36, height:36, borderRadius:10, background:'rgba(0,123,255,0.08)', border:'1px solid rgba(0,123,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all .2s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.background=color+'22'; e.currentTarget.style.borderColor=color+'55'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='rgba(0,123,255,0.08)'; e.currentTarget.style.borderColor='rgba(0,123,255,0.15)'; }}>
                  <Icon size={15} color={color}/>
                </a>
              ))}
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <a href="mailto:support@exampulse.uz" style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'#64748b', transition:'color .2s', textDecoration:'none' }}
                onMouseEnter={e=>e.currentTarget.style.color='#007bff'}
                onMouseLeave={e=>e.currentTarget.style.color='#64748b'}>
                <Mail size={13}/> support@exampulse.uz
              </a>
              <a href="https://t.me/exampulse" target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'#64748b', transition:'color .2s', textDecoration:'none' }}
                onMouseEnter={e=>e.currentTarget.style.color='#007bff'}
                onMouseLeave={e=>e.currentTarget.style.color='#64748b'}>
                <MessageCircle size={13}/> @exampulse
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <div style={{ fontSize:11, fontWeight:800, color:'#007bff', textTransform:'uppercase', letterSpacing:'1.2px', marginBottom:16 }}>{title}</div>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:10, padding:0, margin:0 }}>
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} style={{ fontSize:13, color:'#475569', transition:'color .18s', textDecoration:'none' }}
                      onMouseEnter={e=>e.currentTarget.style.color='#007bff'}
                      onMouseLeave={e=>e.currentTarget.style.color='#475569'}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop:'1.5px solid rgba(0,123,255,0.08)', padding:'20px 24px', background:'rgba(255,255,255,0.4)' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <span style={{ fontSize:12, color:'#94a3b8' }}>
            © {new Date().getFullYear()} ExamPulse. All rights reserved.
          </span>
          <div style={{ display:'flex', gap:20 }}>
            {["Privacy", "Terms", "Cookie Policy"].map(t => (
              <Link key={t} href="/contact" style={{ fontSize:12, color:'#94a3b8', transition:'color .2s', textDecoration:'none' }}
                onMouseEnter={e=>e.currentTarget.style.color='#007bff'}
                onMouseLeave={e=>e.currentTarget.style.color='#94a3b8'}>
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
