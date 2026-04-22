'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Trophy, Flame, TrendingUp, BarChart2, Play, Calendar, Star, Mic, Headphones, BookOpen, PenTool } from 'lucide-react'
import { dashboardApi } from '../../app/lib/api'
import { useAuth } from '../../contexts/AuthContext'

const TIMEFRAMES = [
  { key:'weekly',  icon:'📅', label:'This Week'  },
  { key:'monthly', icon:'🗓️', label:'This Month' },
  { key:'alltime', icon:'⭐', label:'All Time'   },
]

const CATEGORIES = [
  { key:'overall',   icon:<Trophy size={15}/>,     label:'Overall'   },
  { key:'speaking',  icon:<Mic size={15}/>,         label:'Speaking'  },
  { key:'listening', icon:<Headphones size={15}/>,  label:'Listening' },
  { key:'reading',   icon:<BookOpen size={15}/>,    label:'Reading'   },
  { key:'writing',   icon:<PenTool size={15}/>,     label:'Writing'   },
]

const RANK_META = {
  1: { medal:'🥇', color:'#F59E0B', bg:'#FFFBEB', border:'#FCD34D' },
  2: { medal:'🥈', color:'#94A3B8', bg:'#F8FAFC', border:'#CBD5E1' },
  3: { medal:'🥉', color:'#EA580C', bg:'#FFF7ED', border:'#FED7AA' },
}

function scoreColor(s) {
  if (s >= 8)   return '#059669'
  if (s >= 7.5) return '#10B981'
  if (s >= 7)   return '#F59E0B'
  if (s >= 6.5) return '#F97316'
  return '#EF4444'
}

// CSS keyframes injected once
const CSS = `
@keyframes ep-spin { to { transform: translate(-50%,-50%) rotate(360deg); } }
@keyframes ep-spin-r { to { transform: translate(-50%,-50%) rotateX(60deg) rotate(-360deg); } }
@keyframes ep-float {
  0%,100% { transform: translateY(0px); opacity:.5; }
  50%      { transform: translateY(-16px); opacity:1; }
}
@keyframes ep-shimmer {
  0%   { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
}
@keyframes ep-fadein {
  from { opacity:0; transform:translateY(24px); }
  to   { opacity:1; transform:translateY(0);    }
}
@keyframes ep-slidein {
  from { opacity:0; transform:translateX(-24px); }
  to   { opacity:1; transform:translateX(0);     }
}
@keyframes ep-glow {
  0%,100% { box-shadow: 0 0 20px rgba(59,130,246,0.25); }
  50%     { box-shadow: 0 0 40px rgba(59,130,246,0.5);  }
}
`

/* ─────────── Loading ─────────── */
function Loading() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'60vh', gap:32 }}>
      {/* spinner */}
      <div style={{ width:80, height:80, position:'relative' }}>
        <div style={{ position:'absolute', top:'50%', left:'50%', width:72, height:72, borderRadius:'50%', border:'3px solid rgba(59,130,246,0.12)', borderTopColor:'#3b82f6', animation:'ep-spin 1.2s linear infinite' }}/>
        <div style={{ position:'absolute', top:'50%', left:'50%', width:52, height:52, borderRadius:'50%', border:'2px solid rgba(14,165,233,0.12)', borderRightColor:'#0ea5e9', animation:'ep-spin-r 2s linear infinite' }}/>
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:32, height:32, background:'linear-gradient(135deg,#3b82f6,#0ea5e9)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:11 }}>EP</div>
      </div>
      {/* text */}
      <div style={{ fontSize:'1.6rem', fontWeight:800, color:'#0f172a' }}>
        Loading{' '}
        <span style={{ background:'linear-gradient(90deg,#3b82f6,#0ea5e9,#3b82f6)', backgroundSize:'300% 100%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'ep-shimmer 2s linear infinite' }}>
          Leaderboard
        </span>
      </div>
      {/* dots */}
      <div style={{ display:'flex', gap:14 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width:14, height:14, borderRadius:'50%', background:'linear-gradient(135deg,#3b82f6,#0ea5e9)', animation:`ep-float 1.6s ease-in-out infinite ${i*0.28}s`, boxShadow:'0 6px 16px rgba(59,130,246,0.35)' }}/>
        ))}
      </div>
    </div>
  )
}

/* ─────────── Top 3 Card ─────────── */
function TopCard({ user, rank, delay }) {
  const meta = RANK_META[rank]
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:'#fff',
        borderRadius:20,
        padding:'32px 24px',
        border:`2px solid ${hovered ? meta.border : meta.border+'80'}`,
        boxShadow: hovered ? `0 20px 48px ${meta.color}25` : `0 8px 24px rgba(0,0,0,0.06)`,
        textAlign:'center',
        position:'relative',
        overflow:'hidden',
        transition:'all 0.3s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        animation:`ep-fadein 0.6s ease both ${delay}s`,
      }}
    >
      {/* rank badge */}
      <div style={{ position:'absolute', top:14, left:14, fontSize:28 }}>{meta.medal}</div>

      {/* avatar */}
      <div style={{ width:72, height:72, margin:'0 auto 16px', background:`linear-gradient(135deg,#3b82f6,#0ea5e9)`, borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:900, color:'#fff', boxShadow:`0 8px 24px rgba(59,130,246,0.3)` }}>
        {user.avatar}
      </div>

      <div style={{ fontWeight:800, fontSize:17, color:'#0f172a', marginBottom:4 }}>{user.name}</div>
      <div style={{ fontSize:13, color:'#94a3b8', marginBottom:18 }}>{user.country}</div>

      {/* score ring */}
      <div style={{ width:90, height:90, margin:'0 auto 18px', position:'relative' }}>
        <svg width={90} height={90} style={{ position:'absolute', top:0, left:0, transform:'rotate(-90deg)' }}>
          <circle cx={45} cy={45} r={38} fill="none" stroke="#f1f5f9" strokeWidth={6}/>
          <circle cx={45} cy={45} r={38} fill="none" stroke={scoreColor(user.score)} strokeWidth={6}
            strokeDasharray={`${2*Math.PI*38 * (user.score/10)} ${2*Math.PI*38}`}
            strokeLinecap="round"/>
        </svg>
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <div style={{ fontSize:22, fontWeight:900, color:scoreColor(user.score), lineHeight:1 }}>{user.score}</div>
          <div style={{ fontSize:9, color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>Band</div>
        </div>
      </div>

      {/* mini stats */}
      <div style={{ display:'flex', justifyContent:'center', gap:18 }}>
        {[
          { icon:'📊', v:user.tests,           l:'Tests'   },
          { icon:'📈', v:`+${user.improvement}`,l:'Growth'  },
          { icon:'🔥', v:user.streak,           l:'Streak'  },
        ].map(s => (
          <div key={s.l} style={{ textAlign:'center' }}>
            <div style={{ fontSize:16, marginBottom:2 }}>{s.icon}</div>
            <div style={{ fontSize:14, fontWeight:800, color:'#0f172a' }}>{s.v}</div>
            <div style={{ fontSize:10, color:'#94a3b8', textTransform:'uppercase', letterSpacing:1 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────── Row ─────────── */
function RankRow({ user, rank, delay }) {
  const [hovered, setHovered] = useState(false)
  const isCurrent = user.isCurrentUser

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:'grid', gridTemplateColumns:'60px 1fr 130px',
        alignItems:'center', padding:'18px 24px',
        borderBottom:'1px solid #f1f5f9',
        background: hovered ? '#f8faff' : isCurrent ? 'rgba(59,130,246,0.04)' : 'transparent',
        transition:'background 0.2s',
        animation:`ep-slidein 0.5s ease both ${delay}s`,
        borderLeft: isCurrent ? '3px solid #3b82f6' : '3px solid transparent',
      }}
    >
      {/* rank */}
      <div style={{ textAlign:'center' }}>
        <div style={{ width:38, height:38, margin:'0 auto', background:'#f1f5f9', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#64748b' }}>
          #{rank}
        </div>
      </div>

      {/* user info */}
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ position:'relative', flexShrink:0 }}>
          <div style={{ width:46, height:46, borderRadius:12, background: isCurrent ? 'linear-gradient(135deg,#3b82f6,#0ea5e9)' : '#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:800, color: isCurrent ? '#fff' : '#475569' }}>
            {user.avatar}
          </div>
          {user.streak > 7 && (
            <div style={{ position:'absolute', top:-6, right:-6, background:'#f97316', color:'#fff', fontSize:9, fontWeight:800, padding:'2px 5px', borderRadius:8 }}>
              🔥{user.streak}
            </div>
          )}
        </div>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
            <span style={{ fontWeight:700, fontSize:14, color:'#0f172a' }}>{user.name}</span>
            <span>{user.country}</span>
            {isCurrent && <span style={{ fontSize:10, fontWeight:800, background:'#3b82f6', color:'#fff', padding:'2px 8px', borderRadius:20 }}>YOU</span>}
          </div>
          <div style={{ display:'flex', gap:14, fontSize:12, color:'#94a3b8' }}>
            <span>📊 {user.tests} tests</span>
            <span>📈 +{user.improvement}</span>
          </div>
        </div>
      </div>

      {/* score */}
      <div style={{ textAlign:'right' }}>
        <div style={{ display:'inline-block', background: scoreColor(user.score), color:'#fff', padding:'8px 16px', borderRadius:10, boxShadow:`0 4px 14px ${scoreColor(user.score)}40` }}>
          <div style={{ fontSize:18, fontWeight:900, lineHeight:1 }}>{user.score}</div>
          <div style={{ fontSize:9, opacity:0.85, letterSpacing:1, textTransform:'uppercase' }}>Band</div>
        </div>
      </div>
    </div>
  )
}

/* ─────────── Main ─────────── */
export default function Leaderboard() {
  const { user } = useAuth()
  const [data, setData]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [timeframe, setTimeframe] = useState('weekly')
  const [category, setCategory]   = useState('overall')

  // inject CSS once
  useEffect(() => {
    if (document.getElementById('ep-lb-css')) return
    const el = document.createElement('style')
    el.id = 'ep-lb-css'
    el.textContent = CSS
    document.head.appendChild(el)
    return () => el.remove()
  }, [])

  useEffect(() => {
    setLoading(true)
    setData([])
    dashboardApi.leaderboard()
      .then(rows => {
        const formatted = rows.map((r, i) => ({
          id: r.id,
          name: r.name || 'User',
          score: parseFloat((r.avg_score / 11.1).toFixed(1)),
          tests: r.total_tests,
          improvement: 0,
          avatar: (r.name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
          country: '🌍',
          streak: 0,
          isCurrentUser: user && r.id === user.id,
          rank: i + 1,
        }))
        setData(formatted)
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [timeframe, category, user])

  const top3 = data.slice(0, 3)
  const rest = data.slice(3)
  const myRank = data.findIndex(d => d.isCurrentUser) + 1

  const motivationText = () => {
    if (!myRank) return "Start a test to join the leaderboard! ✨"
    if (myRank <= 3) return "Amazing! You're in the top 3! Keep it up! 🎉"
    if (myRank <= 5) return "So close to the podium! One more test! ⭐"
    return "Keep practicing — your rank will climb! 🔥"
  }

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)', padding:'100px 0 60px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 32px' }}>

        {/* ── Header ── */}
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,#3b82f6,#0ea5e9)', color:'#fff', padding:'7px 20px', borderRadius:100, fontSize:11, fontWeight:800, letterSpacing:2, textTransform:'uppercase', marginBottom:18, animation:'ep-glow 3s infinite' }}>
            <Trophy size={13}/> Global Leaderboard
          </div>
          <h1 style={{ fontSize:'clamp(2rem,4vw,3rem)', fontWeight:900, color:'#0f172a', margin:'0 0 10px', letterSpacing:'-1.5px', lineHeight:1.1 }}>
            Compete with{' '}
            <span style={{ background:'linear-gradient(90deg,#3b82f6,#0ea5e9)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              IELTS Learners
            </span>
          </h1>
          <p style={{ color:'#64748b', fontSize:15, margin:0 }}>See how you stack up worldwide</p>
        </div>

        {/* ── Controls ── */}
        <div style={{ background:'#fff', borderRadius:18, padding:'28px 32px', marginBottom:36, border:'1px solid #e2e8f0', boxShadow:'0 4px 20px rgba(0,0,0,0.04)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32 }}>
            {/* timeframe */}
            <div>
              <div style={{ fontSize:11, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:2, marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
                <Calendar size={13}/> Timeframe
              </div>
              <div style={{ display:'flex', gap:10 }}>
                {TIMEFRAMES.map(t => (
                  <button key={t.key} onClick={() => setTimeframe(t.key)}
                    style={{ flex:1, padding:'10px 8px', borderRadius:11, border: timeframe===t.key ? 'none' : '1.5px solid #e2e8f0', background: timeframe===t.key ? 'linear-gradient(135deg,#3b82f6,#0ea5e9)' : '#fff', color: timeframe===t.key ? '#fff' : '#64748b', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.2s', display:'flex', flexDirection:'column', alignItems:'center', gap:5, boxShadow: timeframe===t.key ? '0 4px 14px rgba(59,130,246,0.35)' : 'none', fontFamily:'inherit' }}>
                    <span style={{ fontSize:18 }}>{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            {/* category */}
            <div>
              <div style={{ fontSize:11, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:2, marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>
                <BarChart2 size={13}/> Category
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                {CATEGORIES.map(c => (
                  <button key={c.key} onClick={() => setCategory(c.key)}
                    style={{ padding:'8px 10px', borderRadius:10, border: category===c.key ? 'none' : '1.5px solid #e2e8f0', background: category===c.key ? 'linear-gradient(135deg,#3b82f6,#0ea5e9)' : '#fff', color: category===c.key ? '#fff' : '#64748b', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:6, boxShadow: category===c.key ? '0 4px 14px rgba(59,130,246,0.35)' : 'none', fontFamily:'inherit' }}>
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? <Loading /> : (
          <>
            {/* ── Top 3 ── */}
            <div style={{ marginBottom:36 }}>
              <div style={{ fontSize:11, fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:2, marginBottom:20, textAlign:'center' }}>🎉 Top Performers</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
                {top3.map((u, i) => <TopCard key={u.id} user={u} rank={i+1} delay={i*0.1}/>)}
              </div>
            </div>

            {/* ── Rankings list ── */}
            <div style={{ background:'#fff', borderRadius:18, border:'1px solid #e2e8f0', overflow:'hidden', marginBottom:28, boxShadow:'0 4px 20px rgba(0,0,0,0.04)' }}>
              <div style={{ padding:'20px 24px', borderBottom:'1px solid #f1f5f9' }}>
                <div style={{ fontWeight:800, fontSize:16, color:'#0f172a' }}>📋 Global Rankings</div>
                <div style={{ fontSize:13, color:'#94a3b8', marginTop:3 }}>Full standings</div>
              </div>
              {rest.map((u, i) => <RankRow key={u.id} user={u} rank={i+4} delay={i*0.06}/>)}
            </div>

            {/* ── Motivation banner ── */}
            <div style={{ background:'linear-gradient(135deg,#3b82f6,#0ea5e9)', borderRadius:18, padding:'28px 32px', display:'flex', alignItems:'center', gap:24, boxShadow:'0 8px 32px rgba(59,130,246,0.3)' }}>
              <div style={{ width:56, height:56, background:'rgba(255,255,255,0.2)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>🚀</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, fontSize:17, color:'#fff', marginBottom:6 }}>Keep Pushing Forward! 💪</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.85)', lineHeight:1.5 }}>{motivationText()}</div>
              </div>
              <button style={{ background:'#fff', color:'#3b82f6', border:'none', padding:'12px 24px', borderRadius:12, fontSize:13, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', gap:8, flexShrink:0, fontFamily:'inherit', whiteSpace:'nowrap' }}
                onMouseOver={e=>e.currentTarget.style.transform='scale(1.04)'}
                onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                <Play size={14}/> Take a Test
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}