"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Send, Search, Users, MessageSquare, UserPlus, UserCheck,
  UserX, Globe, Lock, ArrowLeft, Phone, Video,
  Smile, Paperclip, Check, CheckCheck, Mic, StopCircle,
  Reply, Edit2, Trash2, X, ChevronDown, MoreHorizontal, Image,
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const getColor = (id) => ['#007AFF','#34C759','#AF52DE','#FF9500','#00C7BE','#FF2D55','#5AC8FA','#FF6B6B'][id%8]

const USERS = [
  { id:1, name:'Alijon Valiyev',    username:'alijon94',   avatar:'AV', score:8.0, country:'🇺🇿', online:true,  lastSeen:'Online' },
  { id:2, name:'Malika Yusupova',   username:'malika_uz',  avatar:'MY', score:7.5, country:'🇺🇿', online:true,  lastSeen:'Online' },
  { id:3, name:'Bobur Toshmatov',   username:'bobur99',    avatar:'BT', score:6.5, country:'🇰🇿', online:false, lastSeen:'2 soat oldin' },
  { id:4, name:'Dilnoza Rahimova',  username:'dilnoza_r',  avatar:'DR', score:9.0, country:'🇹🇯', online:true,  lastSeen:'Online' },
  { id:5, name:'Jasur Qodirov',     username:'jasur_j',    avatar:'JQ', score:7.0, country:'🇺🇿', online:false, lastSeen:'1 kun oldin' },
  { id:6, name:'Kamola Mirzayeva',  username:'kamola_m',   avatar:'KM', score:8.5, country:'🇦🇿', online:true,  lastSeen:'Online' },
  { id:7, name:'Sardor Abdullayev', username:'sardor_dev', avatar:'SA', score:6.0, country:'🇺🇿', online:true,  lastSeen:'Online' },
  { id:8, name:'Nilufar Hasanova',  username:'nilu_has',   avatar:'NH', score:7.5, country:'🇹🇲', online:false, lastSeen:'3 soat oldin' },
]

const GLOBAL_INIT = [
  { id:1, uid:2, text:"Salom hammaga! IELTS writing task 2 mashq qildim 📝", time:'09:12', r:{}, pinned:false },
  { id:2, uid:4, text:"Task 2 qiyin! Band 7 uchun nimalar muhim?", time:'09:14', r:{}, pinned:false },
  { id:3, uid:1, text:"Coherence va lexical resource eng muhimi 👌", time:'09:16', r:{'👍':2}, pinned:false },
  { id:4, uid:7, text:"3 oyda 6.0 dan 7.5 ga chiqtim. Har kuni 1 essay yozing!", time:'09:20', r:{'🔥':3,'👏':1}, pinned:true },
  { id:5, uid:6, text:"Listening uchun BBC podcasts tavsiya qilaman 🎧", time:'09:25', r:{'❤️':2}, pinned:false },
  { id:6, uid:3, text:"TOEFL va IELTS dan qaysi biri osonroq?", time:'09:30', r:{}, pinned:false },
  { id:7, uid:2, text:"TOEFL computer based, IELTS paper. Qaysi qulay bo'lsa shu 😊", time:'09:31', r:{'👍':1}, pinned:false },
  { id:8, uid:1, text:"Khan Academy SAT prep eng yaxshi bepul resurs!", time:'09:47', r:{'🙏':4}, pinned:false },
]

const DM_INIT = {
  2: [
    { id:1, from:'them', text:"Salom! IELTS da qanday score olding?", time:'Kecha', read:true },
    { id:2, from:'me',   text:"7.5 oldim alhamdulillah 😊", time:'Kecha', read:true },
    { id:3, from:'them', text:"Zo'r! Qanday tayyorlandingiz?", time:'Kecha', read:true },
    { id:4, from:'me',   text:"6 oy ExamPulse da mashq qildim", time:'Kecha', read:true },
    { id:5, from:'them', text:"Study partner bo'lamizmi? 🤝", time:'09:02', read:false },
  ],
  4: [
    { id:1, from:'them', text:"Writing template yuborasizmi?", time:'08:15', read:true },
    { id:2, from:'me',   text:"Ha albatta!", time:'08:16', read:true },
    { id:3, from:'them', text:"Rahmat! Juda foydali 🙏", time:'08:20', read:false },
  ],
  7: [
    { id:1, from:'them', text:"SAT math section qanday?", time:'07:30', read:true },
    { id:2, from:'me',   text:"Algebra qiyin, lekin mashq bilan bo'ladi", time:'07:32', read:true },
  ],
}

const EMOJIS = ['👍','❤️','😂','🔥','👏','🙏','😊','🎯','💯','✨']

function Avatar({ user, size=40, imgSrc=null }) {
  return (
    <div style={{ position:'relative', flexShrink:0, width:size, height:size }}>
      {imgSrc
        ? <img src={imgSrc} alt="" style={{ width:size, height:size, borderRadius:'50%', objectFit:'cover' }}/>
        : <div style={{ width:size, height:size, borderRadius:'50%', background:`linear-gradient(145deg,${getColor(user.id)},${getColor(user.id)}bb)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size>40?15:11, fontWeight:700, color:'#fff' }}>
            {user.avatar}
          </div>
      }
      {user.online!==undefined && (
        <div style={{ position:'absolute', bottom:1, right:1, width:size>36?11:9, height:size>36?11:9, borderRadius:'50%', background:user.online?'#34C759':'#8E8E93', border:'2px solid #F2F2F7' }}/>
      )}
    </div>
  )
}

export default function GlobalChat() {
  const { profile, initials } = useUser();

  const ME = { id:99, name:`${profile.firstName} ${profile.lastName}`, avatar:initials, online:true, lastSeen:'Online' }

  const [view, setView]           = useState('global')
  const [globalMsgs, setGMsgs]    = useState(GLOBAL_INIT)
  const [dmMsgs, setDMsgs]        = useState(DM_INIT)
  const [requests, setRequests]   = useState([{id:3,dir:'in'},{id:6,dir:'in'}])
  const [friends, setFriends]     = useState([1,2,4,7])
  const [activeDM, setActiveDM]   = useState(null)
  const [input, setInput]         = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText]   = useState('')
  const [replyTo, setReplyTo]     = useState(null)
  const [searchQ, setSearchQ]     = useState('')
  const [hoverMsg, setHoverMsg]   = useState(null)
  const [hoverEmoji, setHoverEmoji] = useState(null)
  const [typing, setTyping]       = useState(false)
  const [recording, setRecording] = useState(false)
  const [recSec, setRecSec]       = useState(0)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [chatSearch, setChatSearch] = useState('')
  const bottomRef  = useRef(null)
  const scrollRef  = useRef(null)
  const inputRef   = useRef(null)
  const fileRef    = useRef(null)
  const recTimer   = useRef(null)

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior:'smooth' }), 60)
  }, [globalMsgs, dmMsgs, activeDM, view])

  // scroll to bottom button
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const fn = () => setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 200)
    el.addEventListener('scroll', fn)
    return () => el.removeEventListener('scroll', fn)
  }, [view])

  // fake typing
  useEffect(() => {
    if (view!=='global') return
    const t1 = setTimeout(()=>setTyping(true), 5000)
    const t2 = setTimeout(()=>{
      setTyping(false)
      const r = ["Zo'r tavsiya 🙏","Men ham shu fikrdaman","Band 8 maqsadim 💪","Rahmat do'stlar!"]
      setGMsgs(p=>[...p,{ id:Date.now(), uid:[1,2,4,6,7][Math.floor(Math.random()*5)], text:r[Math.floor(Math.random()*r.length)], time:'Hozir', r:{}, pinned:false }])
    }, 7500)
    return ()=>{ clearTimeout(t1); clearTimeout(t2) }
  }, [view])

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior:'smooth' })

  const send = useCallback(() => {
    if (!input.trim() && !editingId) return
    if (editingId) {
      setGMsgs(p=>p.map(m=>m.id===editingId?{...m,text:editText,edited:true}:m))
      setEditingId(null); setEditText(''); setInput(''); return
    }
    const msg = {
      id:Date.now(), time:'Hozir', r:{}, pinned:false,
      ...(replyTo ? { replyTo } : {}),
    }
    if (view==='global') {
      setGMsgs(p=>[...p,{...msg, uid:-1, text:input.trim(), isMe:true}])
    } else if (activeDM) {
      setDMsgs(p=>({...p,[activeDM]:[...(p[activeDM]||[]),{...msg,from:'me',text:input.trim(),read:false}]}))
    }
    setInput(''); setReplyTo(null)
    inputRef.current?.focus()
  }, [input, editingId, editText, replyTo, view, activeDM])

  const deleteMsg = (id) => setGMsgs(p=>p.map(m=>m.id===id?{...m,deleted:true,text:''}:m))
  const pinMsg    = (id) => setGMsgs(p=>p.map(m=>m.id===id?{...m,pinned:!m.pinned}:m))
  const startEdit = (m)  => { setEditingId(m.id); setEditText(m.text); setInput(m.text); inputRef.current?.focus() }
  const cancelEdit= ()   => { setEditingId(null); setEditText(''); setInput('') }

  const addReaction = (msgId, emoji) => {
    setGMsgs(p=>p.map(m=>{
      if(m.id!==msgId) return m
      const r={...m.r}; r[emoji]=(r[emoji]||0)+1; return{...m,r}
    }))
    setHoverEmoji(null)
  }

  const startRecord = () => {
    setRecording(true); setRecSec(0)
    recTimer.current = setInterval(()=>setRecSec(s=>s+1),1000)
  }
  const stopRecord = () => {
    clearInterval(recTimer.current); setRecording(false)
    const dur = recSec
    setRecSec(0)
    const msg = { id:Date.now(), uid:-1, isMe:true, time:'Hozir', r:{}, pinned:false, voice:true, duration:dur }
    if(view==='global') setGMsgs(p=>[...p,msg])
    else if(activeDM) setDMsgs(p=>({...p,[activeDM]:[...(p[activeDM]||[]),{...msg,from:'me',read:false}]}))
  }

  const handleImage = (file) => {
    if(!file||!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const msg = { id:Date.now(), uid:-1, isMe:true, time:'Hozir', r:{}, pinned:false, img:e.target.result }
      if(view==='global') setGMsgs(p=>[...p,msg])
      else if(activeDM) setDMsgs(p=>({...p,[activeDM]:[...(p[activeDM]||[]),{...msg,from:'me',read:false}]}))
    }
    reader.readAsDataURL(file)
  }

  const accept   = (id) => { setFriends(p=>[...p,id]); setRequests(p=>p.filter(r=>r.id!==id)) }
  const decline  = (id) => setRequests(p=>p.filter(r=>r.id!==id))
  const addFriend= (id) => { if(!requests.find(r=>r.id===id)) setRequests(p=>[...p,{id,dir:'out'}]) }
  const openDM   = (id) => { setActiveDM(id); setView('dm') }
  const getUser  = (id) => USERS.find(u=>u.id===id)

  const incoming = requests.filter(r=>r.dir==='in')
  const unreadDM = Object.entries(dmMsgs).filter(([,m])=>m.some(x=>x.from==='them'&&!x.read)).length
  const filtered = USERS.filter(u=>u.name.toLowerCase().includes(searchQ.toLowerCase())||u.username.toLowerCase().includes(searchQ.toLowerCase()))
  const pinnedMsgs = globalMsgs.filter(m=>m.pinned)

  const dmFriends = friends.map(id=>{
    const u=getUser(id); if(!u) return null
    const msgs=dmMsgs[id]||[]
    return{...u,last:msgs[msgs.length-1],unread:msgs.filter(m=>m.from==='them'&&!m.read).length}
  }).filter(Boolean)

  const visibleGlobal = chatSearch
    ? globalMsgs.filter(m=>m.text?.toLowerCase().includes(chatSearch.toLowerCase()))
    : globalMsgs

  const navItems = [
    { id:'global',   label:'Global',    badge:0, icon:(
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>)},
    { id:'dm',       label:'Xabarlar',  badge:unreadDM, icon:(
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>)},
    { id:'people',   label:"Do'stlar",  badge:0, icon:(
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>)},
    { id:'requests', label:"So'rovlar", badge:incoming.length, icon:(
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
      </svg>)},
  ]

  // ── MESSAGE BUBBLE ──
  const Bubble = ({ msg, isDM=false }) => {
    const isMe = msg.isMe || msg.from==='me'
    const user = isMe ? ME : getUser(msg.uid)
    if(!user) return null
    const replyMsg = msg.replyTo ? globalMsgs.find(m=>m.id===msg.replyTo.id) : null

    return (
      <div
        onMouseEnter={()=>setHoverMsg(msg.id)}
        onMouseLeave={()=>{ setHoverMsg(null); setHoverEmoji(null) }}
        style={{ display:'flex', gap:8, flexDirection:isMe?'row-reverse':'row', alignItems:'flex-end', marginTop:4, position:'relative' }}>

        {/* Avatar */}
        <div style={{ width:30, flexShrink:0, display:'flex', alignItems:'flex-end' }}>
          {!isMe
            ? <Avatar user={user} size={28} showBadge={false}/>
            : profile.avatar
              ? <img src={profile.avatar} alt="" style={{ width:28, height:28, borderRadius:'50%', objectFit:'cover' }}/>
              : <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(145deg,#007AFF,#5856D6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:'#fff' }}>{initials}</div>
          }
        </div>

        <div style={{ maxWidth:'60%', minWidth:60 }}>
          {/* Reply preview */}
          {replyMsg && (
            <div style={{ background:isMe?'rgba(255,255,255,0.2)':'rgba(0,122,255,0.07)', borderLeft:`3px solid ${isMe?'rgba(255,255,255,0.7)':'#007AFF'}`, borderRadius:'8px 8px 0 0', padding:'5px 10px', fontSize:11, color:isMe?'rgba(255,255,255,0.85)':'#007AFF', marginBottom:-4 }}>
              <span style={{ fontWeight:700 }}>{replyMsg.isMe?'Siz':getUser(replyMsg.uid)?.name}</span>: {replyMsg.text?.slice(0,60)}
            </div>
          )}

          {/* Bubble */}
          <div style={{
            padding: msg.deleted?'8px 12px':msg.img?'4px':msg.voice?'10px 14px':'9px 13px',
            borderRadius:isMe?'18px 4px 18px 18px':'4px 18px 18px 18px',
            background:msg.deleted?'rgba(142,142,147,0.12)':isMe?'#007AFF':'#fff',
            color:msg.deleted?'#8E8E93':isMe?'#fff':'#1C1C1E',
            fontSize:msg.deleted?13:15, lineHeight:1.45, fontStyle:msg.deleted?'italic':'normal',
            boxShadow:isMe?'0 2px 8px rgba(0,122,255,0.22)':'0 1px 4px rgba(0,0,0,0.07)',
          }}>
            {msg.deleted && '🚫 Xabar o\'chirildi'}
            {msg.img && <img src={msg.img} alt="" style={{ maxWidth:220, maxHeight:180, borderRadius:12, display:'block' }}/>}
            {msg.voice && (
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:isMe?'rgba(255,255,255,0.25)':'rgba(0,122,255,0.10)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={isMe?'#fff':'#007AFF'}><path d="M8 5v14l11-7z"/></svg>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ height:3, background:isMe?'rgba(255,255,255,0.35)':'rgba(0,122,255,0.15)', borderRadius:3, position:'relative' }}>
                    <div style={{ width:'40%', height:'100%', background:isMe?'rgba(255,255,255,0.8)':'#007AFF', borderRadius:3 }}/>
                  </div>
                </div>
                <span style={{ fontSize:12, opacity:.7, minWidth:28 }}>{msg.duration||0}s</span>
              </div>
            )}
            {!msg.deleted && !msg.img && !msg.voice && msg.text}
          </div>

          {/* Reactions */}
          {Object.keys(msg.r||{}).length>0 && (
            <div style={{ display:'flex', gap:4, marginTop:4, flexWrap:'wrap', justifyContent:isMe?'flex-end':'flex-start' }}>
              {Object.entries(msg.r).map(([e,c])=>(
                <div key={e} onClick={()=>addReaction(msg.id,e)} style={{ background:'rgba(255,255,255,0.95)', border:'1px solid rgba(0,0,0,0.07)', borderRadius:12, padding:'2px 8px', fontSize:12, cursor:'pointer', fontWeight:500 }}>{e} {c}</div>
              ))}
            </div>
          )}

          <div style={{ fontSize:10, color:'#8E8E93', marginTop:3, textAlign:isMe?'right':'left', display:'flex', justifyContent:isMe?'flex-end':'flex-start', alignItems:'center', gap:4 }}>
            {msg.edited&&<span style={{fontSize:9}}>tahrirlangan ·</span>}
            {msg.pinned&&<span style={{fontSize:9}}>📌 ·</span>}
            {msg.time}
            {isMe&&!isDM&&<></>}
            {isDM&&isMe&&(msg.read?<CheckCheck size={11} color="#007AFF"/>:<Check size={11} color="#C7C7CC"/>)}
          </div>
        </div>

        {/* Action buttons on hover */}
        {hoverMsg===msg.id && !msg.deleted && (
          <div style={{
            position:'absolute', top:-36, [isMe?'left':'right']:0,
            background:'rgba(255,255,255,0.97)', backdropFilter:'blur(16px)',
            borderRadius:14, padding:'4px 6px',
            boxShadow:'0 4px 20px rgba(0,0,0,0.12)', display:'flex', gap:2, zIndex:30,
          }}>
            {/* Emoji quick */}
            {EMOJIS.slice(0,5).map(e=>(
              <button key={e} onClick={()=>addReaction(msg.id,e)}
                style={{ background:'none', border:'none', cursor:'pointer', fontSize:16, padding:'3px 4px', borderRadius:8, transition:'transform .1s' }}
                onMouseEnter={ev=>ev.currentTarget.style.transform='scale(1.35)'}
                onMouseLeave={ev=>ev.currentTarget.style.transform='none'}>
                {e}
              </button>
            ))}
            <div style={{ width:1, background:'rgba(0,0,0,0.07)', margin:'4px 2px' }}/>
            {/* Reply */}
            <button onClick={()=>setReplyTo(msg)} style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 6px', borderRadius:8, color:'#007AFF', display:'flex' }}>
              <Reply size={14}/>
            </button>
            {/* Edit (only mine) */}
            {isMe && !msg.img && !msg.voice && (
              <button onClick={()=>startEdit(msg)} style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 6px', borderRadius:8, color:'#FF9500', display:'flex' }}>
                <Edit2 size={14}/>
              </button>
            )}
            {/* Delete (only mine) */}
            {isMe && (
              <button onClick={()=>deleteMsg(msg.id)} style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 6px', borderRadius:8, color:'#FF3B30', display:'flex' }}>
                <Trash2 size={14}/>
              </button>
            )}
            {/* Pin */}
            {!isDM && (
              <button onClick={()=>pinMsg(msg.id)} style={{ background:'none', border:'none', cursor:'pointer', padding:'4px 6px', borderRadius:8, color:msg.pinned?'#FF9500':'#8E8E93', display:'flex', fontSize:13 }}>
                📌
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <style>{`
        *{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,'Inter',sans-serif}
        .gc-i:focus{outline:none}
        .gc-btn{background:none;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;border-radius:10px;padding:6px}
        .gc-btn:hover{background:rgba(0,0,0,0.05)}
        .gc-btn:active{transform:scale(.92)}
        .gc-row{transition:background .12s;cursor:pointer;border-radius:12px}
        .gc-row:hover{background:rgba(0,0,0,0.04)}
        .gc-nav{display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 4px;border-radius:12px;border:none;cursor:pointer;transition:all .15s;position:relative;width:54px}
        .gc-nav:hover{background:rgba(0,122,255,0.08)}
        @keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        .gc-msg{animation:msgIn .18s ease}
        @keyframes dot{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}
        ::-webkit-scrollbar{width:0}
        .rec-pulse{animation:recPulse 1s infinite}
        @keyframes recPulse{0%,100%{opacity:1}50%{opacity:.4}}
      `}</style>

      <div style={{ display:'flex', height:'calc(100vh - 70px)', background:'#F2F2F7', overflow:'hidden' }}>

        {/* ══ COL 1 NAV ══ */}
        <div style={{ width:68, background:'rgba(255,255,255,0.88)', backdropFilter:'blur(20px)', borderRight:'1px solid rgba(0,0,0,0.06)', display:'flex', flexDirection:'column', alignItems:'center', padding:'14px 0', gap:4 }}>
          <div style={{ width:42, height:42, borderRadius:13, background:'linear-gradient(145deg,#007AFF,#5856D6)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14, boxShadow:'0 4px 12px rgba(0,122,255,0.32)', flexShrink:0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          </div>
          {navItems.map(n=>{
            const active=view===n.id
            return(
              <button key={n.id} className="gc-nav" onClick={()=>{setView(n.id);if(n.id!=='dm')setActiveDM(null)}}
                style={{ color:active?'#007AFF':'#8E8E93', background:active?'rgba(0,122,255,0.10)':undefined }}>
                {n.icon}
                <span style={{ fontSize:9, fontWeight:600 }}>{n.label}</span>
                {n.badge>0&&<div style={{ position:'absolute', top:3, right:3, minWidth:15, height:15, borderRadius:8, background:'#FF3B30', color:'#fff', fontSize:8, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', padding:'0 3px' }}>{n.badge}</div>}
              </button>
            )
          })}
          <div style={{ flex:1 }}/>
          {/* My avatar */}
          <div style={{ width:40, height:40, borderRadius:'50%', overflow:'hidden', cursor:'pointer' }} onClick={()=>window.location.href='/profile'}>
            {profile.avatar
              ? <img src={profile.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              : <div style={{ width:'100%', height:'100%', background:'linear-gradient(145deg,#007AFF,#5856D6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#fff' }}>{initials}</div>
            }
          </div>
        </div>

        {/* ══ COL 2 LIST ══ */}
        <div style={{ width:290, background:'rgba(255,255,255,0.78)', backdropFilter:'blur(20px)', borderRight:'1px solid rgba(0,0,0,0.06)', display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'18px 14px 10px' }}>
            <div style={{ fontSize:22, fontWeight:700, color:'#1C1C1E', letterSpacing:'-0.5px', marginBottom:10 }}>
              {view==='global'?'Global Chat':view==='dm'?'Xabarlar':view==='people'?"Do'stlar":"So'rovlar"}
            </div>
            <div style={{ position:'relative' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2.5" strokeLinecap="round" style={{ position:'absolute', left:9, top:'50%', transform:'translateY(-50%)' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input className="gc-i" value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Qidirish"
                style={{ width:'100%', padding:'7px 10px 7px 28px', background:'rgba(118,118,128,0.12)', border:'none', borderRadius:10, fontSize:13, color:'#1C1C1E' }}/>
            </div>
          </div>

          <div style={{ flex:1, overflowY:'auto', padding:'0 8px 8px' }}>

            {view==='global'&&<>
              {/* Online avatars scroll */}
              <div style={{ display:'flex', gap:12, padding:'4px 6px 14px', overflowX:'auto' }}>
                {USERS.filter(u=>u.online).map(u=>(
                  <div key={u.id} onClick={()=>openDM(u.id)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, cursor:'pointer', flexShrink:0 }}>
                    <Avatar user={u} size={44}/>
                    <div style={{ fontSize:10, color:'#3C3C43', fontWeight:500, maxWidth:44, textAlign:'center', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.name.split(' ')[0]}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:11, fontWeight:600, color:'#8E8E93', padding:'0 6px 6px', letterSpacing:'0.5px' }}>GLOBAL CHAT</div>
              <div className="gc-row" onClick={()=>setView('global')} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px', background:'rgba(0,122,255,0.07)' }}>
                <div style={{ width:46, height:46, borderRadius:14, background:'linear-gradient(145deg,#007AFF,#5856D6)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 3px 10px rgba(0,122,255,0.25)', flexShrink:0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-.61.08-1.21.21-1.78L8.99 15v1c0 1.1.9 2 2 2v1.93C7.06 19.43 4 16.07 4 12zm13.89 5.4c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41C17.92 5.77 20 8.65 20 12c0 2.08-.81 3.98-2.11 5.4z"/></svg>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:600, color:'#1C1C1E' }}>Barcha Studentlar</div>
                  <div style={{ fontSize:12, color:'#34C759', fontWeight:500 }}>{USERS.filter(u=>u.online).length} online · Faol</div>
                </div>
                <div style={{ width:8, height:8, borderRadius:'50%', background:'#34C759' }}/>
              </div>
            </>}

            {view==='dm'&&<>
              {dmFriends.length===0
                ? <div style={{ textAlign:'center', padding:'60px 16px', color:'#8E8E93', fontSize:13 }}>Hali xabar yo'q</div>
                : dmFriends.map(u=>(
                  <div key={u.id} className="gc-row" onClick={()=>setActiveDM(u.id)} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px', background:activeDM===u.id?'rgba(0,122,255,0.08)':undefined }}>
                    <Avatar user={u} size={46}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', justifyContent:'space-between' }}>
                        <div style={{ fontSize:15, fontWeight:u.unread?700:500, color:'#1C1C1E' }}>{u.name}</div>
                        {u.last&&<div style={{ fontSize:11, color:'#8E8E93' }}>{u.last.time}</div>}
                      </div>
                      {u.last&&<div style={{ fontSize:13, color:u.unread?'#1C1C1E':'#8E8E93', fontWeight:u.unread?500:400, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:165, marginTop:1 }}>{u.last.from==='me'?'Siz: ':''}{u.last.text}</div>}
                    </div>
                    {u.unread>0&&<div style={{ width:20, height:20, borderRadius:10, background:'#007AFF', color:'#fff', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{u.unread}</div>}
                  </div>
                ))
              }
            </>}

            {view==='people'&&<>
              <div style={{ fontSize:11, fontWeight:600, color:'#8E8E93', padding:'4px 6px 6px' }}>DO'STLARIM · {friends.length}</div>
              {friends.map(fid=>{
                const u=getUser(fid); if(!u) return null
                return(
                  <div key={u.id} className="gc-row" style={{ display:'flex', alignItems:'center', gap:12, padding:'10px' }}>
                    <Avatar user={u} size={44}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:15, fontWeight:500, color:'#1C1C1E' }}>{u.name}</div>
                      <div style={{ fontSize:12, color:u.online?'#34C759':'#8E8E93' }}>{u.online?'Online':u.lastSeen}</div>
                    </div>
                    <button onClick={()=>openDM(u.id)} className="gc-btn" style={{ background:'rgba(0,122,255,0.10)', color:'#007AFF', fontSize:13, fontWeight:600, padding:'6px 12px' }}>DM</button>
                  </div>
                )
              })}
              <div style={{ fontSize:11, fontWeight:600, color:'#8E8E93', padding:'12px 6px 6px' }}>TAVSIYALAR</div>
              {filtered.filter(u=>!friends.includes(u.id)&&!requests.find(r=>r.id===u.id)).map(u=>(
                <div key={u.id} className="gc-row" style={{ display:'flex', alignItems:'center', gap:12, padding:'10px' }}>
                  <Avatar user={u} size={44}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:500, color:'#1C1C1E' }}>{u.name}</div>
                    <div style={{ fontSize:12, color:'#8E8E93' }}>{u.mutual} umumiy · Band {u.score}</div>
                  </div>
                  <button onClick={()=>addFriend(u.id)} className="gc-btn" style={{ background:'#007AFF', color:'#fff', fontSize:13, fontWeight:600, padding:'6px 12px', borderRadius:10 }}>+ Qo'sh</button>
                </div>
              ))}
            </>}

            {view==='requests'&&<>
              {incoming.length===0
                ? <div style={{ textAlign:'center', padding:'60px 16px' }}><div style={{ fontSize:36 }}>👋</div><div style={{ fontSize:15, fontWeight:600, color:'#1C1C1E', marginTop:8 }}>So'rovlar yo'q</div></div>
                : incoming.map(req=>{
                    const u=getUser(req.id); if(!u) return null
                    return(
                      <div key={u.id} style={{ background:'rgba(255,255,255,0.80)', borderRadius:14, padding:'14px', marginBottom:6 }}>
                        <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:12 }}>
                          <Avatar user={u} size={46}/>
                          <div>
                            <div style={{ fontSize:15, fontWeight:600, color:'#1C1C1E' }}>{u.name}</div>
                            <div style={{ fontSize:11, color:'#8E8E93' }}>@{u.username} · Band {u.score} · {u.country}</div>
                            <div style={{ fontSize:11, color:'#8E8E93' }}>{u.mutual} umumiy do'st</div>
                          </div>
                        </div>
                        <div style={{ display:'flex', gap:8 }}>
                          <button onClick={()=>accept(u.id)} style={{ flex:1, background:'#007AFF', border:'none', borderRadius:10, padding:'9px', cursor:'pointer', color:'#fff', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}><UserCheck size={13}/>Qabul</button>
                          <button onClick={()=>decline(u.id)} style={{ flex:1, background:'rgba(255,59,48,0.09)', border:'none', borderRadius:10, padding:'9px', cursor:'pointer', color:'#FF3B30', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}><UserX size={13}/>Rad</button>
                        </div>
                      </div>
                    )
                  })
              }
              {requests.filter(r=>r.dir==='out').length>0&&<>
                <div style={{ fontSize:11, fontWeight:600, color:'#8E8E93', padding:'10px 6px 4px' }}>YUBORILGAN</div>
                {requests.filter(r=>r.dir==='out').map(req=>{
                  const u=getUser(req.id); if(!u) return null
                  return(
                    <div key={u.id} className="gc-row" style={{ display:'flex', alignItems:'center', gap:10, padding:'10px' }}>
                      <Avatar user={u} size={38}/>
                      <div style={{ flex:1, fontSize:14, fontWeight:500, color:'#1C1C1E' }}>{u.name}</div>
                      <span style={{ fontSize:11, color:'#FF9500', fontWeight:600, background:'rgba(255,149,0,0.10)', padding:'3px 9px', borderRadius:8 }}>Kutilmoqda</span>
                    </div>
                  )
                })}
              </>}
            </>}
          </div>
        </div>

        {/* ══ COL 3 CHAT ══ */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>

          {/* Empty state */}
          {view!=='global'&&!activeDM&&(
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#8E8E93' }}>
              <div style={{ width:72, height:72, borderRadius:22, background:'rgba(142,142,147,0.10)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                <MessageSquare size={34} color="#C7C7CC"/>
              </div>
              <div style={{ fontSize:17, fontWeight:600, color:'#1C1C1E' }}>Suhbat tanlang</div>
              <div style={{ fontSize:13, marginTop:5 }}>Chap paneldan bosing</div>
            </div>
          )}

          {(view==='global'||activeDM)&&<>
            {/* Top bar */}
            <div style={{ padding:'12px 18px', background:'rgba(255,255,255,0.88)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(0,0,0,0.06)', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
              {view==='dm'&&activeDM&&<button className="gc-btn" onClick={()=>setActiveDM(null)} style={{ color:'#007AFF', marginRight:2 }}><ArrowLeft size={18}/></button>}

              {view==='global'?(
                <>
                  <div style={{ width:38, height:38, borderRadius:12, background:'linear-gradient(145deg,#007AFF,#5856D6)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-.61.08-1.21.21-1.78L8.99 15v1c0 1.1.9 2 2 2v1.93C7.06 19.43 4 16.07 4 12zm13.89 5.4c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41C17.92 5.77 20 8.65 20 12c0 2.08-.81 3.98-2.11 5.4z"/></svg>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:'#1C1C1E', letterSpacing:'-0.3px' }}>Global Chat</div>
                    <div style={{ fontSize:11, color:'#34C759', fontWeight:500 }}>{USERS.filter(u=>u.online).length} online</div>
                  </div>
                  <div style={{ display:'flex', gap:4 }}>
                    <button className="gc-btn" onClick={()=>setShowSearch(s=>!s)} style={{ color:showSearch?'#007AFF':'#8E8E93' }}><Search size={17}/></button>
                    <div style={{ fontSize:11, background:'rgba(52,199,89,0.10)', color:'#34C759', padding:'4px 10px', borderRadius:20, fontWeight:700 }}>● Live</div>
                  </div>
                </>
              ):(
                <>
                  <Avatar user={getUser(activeDM)} size={38}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:15, fontWeight:700, color:'#1C1C1E' }}>{getUser(activeDM)?.name}</div>
                    <div style={{ fontSize:11, color:getUser(activeDM)?.online?'#34C759':'#8E8E93', fontWeight:500 }}>{getUser(activeDM)?.online?'Online':getUser(activeDM)?.lastSeen}</div>
                  </div>
                  <button className="gc-btn" style={{ color:'#007AFF' }}><Phone size={17}/></button>
                  <button className="gc-btn" style={{ color:'#007AFF' }}><Video size={17}/></button>
                </>
              )}
            </div>

            {/* Search bar */}
            {showSearch&&view==='global'&&(
              <div style={{ padding:'8px 16px', background:'rgba(255,255,255,0.80)', borderBottom:'1px solid rgba(0,0,0,0.05)', display:'flex', alignItems:'center', gap:8 }}>
                <Search size={13} color="#8E8E93"/>
                <input className="gc-i" value={chatSearch} onChange={e=>setChatSearch(e.target.value)} placeholder="Xabarlarda qidirish..."
                  style={{ flex:1, background:'transparent', border:'none', fontSize:13, color:'#1C1C1E' }} autoFocus/>
                {chatSearch&&<button className="gc-btn" onClick={()=>setChatSearch('')} style={{ color:'#8E8E93', padding:3 }}><X size={13}/></button>}
              </div>
            )}

            {/* Pinned message banner */}
            {view==='global'&&pinnedMsgs.length>0&&(
              <div style={{ padding:'8px 16px', background:'rgba(0,122,255,0.06)', borderBottom:'1px solid rgba(0,122,255,0.08)', display:'flex', alignItems:'center', gap:8, cursor:'pointer', flexShrink:0 }}>
                <span style={{ fontSize:13 }}>📌</span>
                <div style={{ flex:1, fontSize:12, color:'#007AFF', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {pinnedMsgs[pinnedMsgs.length-1].text}
                </div>
              </div>
            )}

            {/* Messages */}
            <div ref={scrollRef} style={{ flex:1, overflowY:'auto', padding:'14px 18px', display:'flex', flexDirection:'column', gap:2, position:'relative' }}>
              <div style={{ textAlign:'center', margin:'4px 0 12px' }}>
                <span style={{ fontSize:11, color:'#8E8E93', fontWeight:500, background:'rgba(142,142,147,0.10)', padding:'4px 12px', borderRadius:20 }}>Bugun</span>
              </div>

              {view==='global' && visibleGlobal.map((msg,i)=>{
                const prev=visibleGlobal[i-1]
                const showHead=!prev||prev.uid!==msg.uid||prev.isMe!==msg.isMe
                return(
                  <div key={msg.id} className="gc-msg" style={{ marginTop:showHead?10:0 }}>
                    {showHead&&!msg.isMe&&!msg.deleted&&(
                      <div style={{ fontSize:10, fontWeight:700, color:getColor(msg.uid), marginBottom:2, paddingLeft:38 }}>
                        {getUser(msg.uid)?.name} <span style={{ color:'#8E8E93', fontWeight:400 }}>Band {getUser(msg.uid)?.score} {getUser(msg.uid)?.country}</span>
                      </div>
                    )}
                    <Bubble msg={msg}/>
                  </div>
                )
              })}

              {view==='dm'&&activeDM&&(dmMsgs[activeDM]||[]).map((msg,i)=>{
                return <div key={msg.id} className="gc-msg"><Bubble msg={msg} isDM/></div>
              })}

              {/* Typing */}
              {view==='global'&&typing&&(
                <div style={{ display:'flex', gap:8, alignItems:'flex-end', marginTop:10 }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(145deg,#007AFF,#5856D6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, color:'#fff', fontWeight:800 }}>?</div>
                  <div style={{ background:'#fff', borderRadius:'4px 18px 18px 18px', padding:'12px 16px', boxShadow:'0 1px 4px rgba(0,0,0,0.07)', display:'flex', gap:5 }}>
                    {[0,1,2].map(i=><div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#C7C7CC', animation:`dot 1.2s ${i*0.2}s ease-in-out infinite` }}/>)}
                  </div>
                </div>
              )}

              <div ref={bottomRef}/>
            </div>

            {/* Scroll to bottom */}
            {showScrollBtn&&(
              <button onClick={scrollToBottom} style={{
                position:'absolute', bottom:80, right:28,
                width:38, height:38, borderRadius:'50%',
                background:'rgba(255,255,255,0.95)', backdropFilter:'blur(12px)',
                border:'1px solid rgba(0,0,0,0.08)', cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 4px 16px rgba(0,0,0,0.12)', zIndex:20,
                color:'#007AFF',
              }}>
                <ChevronDown size={18}/>
              </button>
            )}

            {/* Reply bar */}
            {replyTo&&(
              <div style={{ padding:'8px 16px', background:'rgba(0,122,255,0.06)', borderTop:'1px solid rgba(0,122,255,0.10)', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                <Reply size={14} color="#007AFF"/>
                <div style={{ flex:1, fontSize:12, color:'#007AFF', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  <span style={{ fontWeight:700 }}>{replyTo.isMe?'Siz':getUser(replyTo.uid)?.name}</span>: {replyTo.text?.slice(0,80)}
                </div>
                <button className="gc-btn" onClick={()=>setReplyTo(null)} style={{ color:'#8E8E93', padding:3 }}><X size={14}/></button>
              </div>
            )}

            {/* Edit bar */}
            {editingId&&(
              <div style={{ padding:'8px 16px', background:'rgba(255,149,0,0.07)', borderTop:'1px solid rgba(255,149,0,0.12)', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
                <Edit2 size={14} color="#FF9500"/>
                <div style={{ flex:1, fontSize:12, color:'#FF9500', fontWeight:600 }}>Xabarni tahrirlash</div>
                <button className="gc-btn" onClick={cancelEdit} style={{ color:'#8E8E93', padding:3 }}><X size={14}/></button>
              </div>
            )}

            {/* Input */}
            <div style={{ padding:'10px 14px 12px', background:'rgba(255,255,255,0.88)', backdropFilter:'blur(20px)', borderTop:'1px solid rgba(0,0,0,0.06)', flexShrink:0 }}>
              {recording?(
                <div style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(255,59,48,0.06)', borderRadius:24, padding:'10px 16px', border:'1.5px solid rgba(255,59,48,0.15)' }}>
                  <div className="rec-pulse" style={{ width:10, height:10, borderRadius:'50%', background:'#FF3B30', flexShrink:0 }}/>
                  <div style={{ flex:1, fontSize:14, color:'#FF3B30', fontWeight:600 }}>Yozilmoqda... {recSec}s</div>
                  <button className="gc-btn" onClick={stopRecord} style={{ background:'#FF3B30', color:'#fff', borderRadius:10, padding:'7px 14px', fontSize:13, fontWeight:700, gap:5 }}>
                    <StopCircle size={14}/> Yuborish
                  </button>
                </div>
              ):(
                <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(118,118,128,0.10)', borderRadius:24, padding:'8px 8px 8px 14px' }}>
                  <input ref={inputRef} className="gc-i" value={input} onChange={e=>setInput(e.target.value)}
                    onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&send()}
                    placeholder={view==='dm'&&activeDM?`${getUser(activeDM)?.name}ga xabar...`:'Xabar yozing...'}
                    style={{ flex:1, background:'transparent', border:'none', fontSize:15, color:'#1C1C1E' }}/>
                  <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>handleImage(e.target.files[0])}/>
                  <button className="gc-btn" onClick={()=>fileRef.current?.click()} style={{ color:'#8E8E93' }}><Image size={18}/></button>
                  <button className="gc-btn" style={{ color:'#8E8E93' }}><Smile size={18}/></button>
                  {!input.trim()
                    ? <button className="gc-btn" onMouseDown={startRecord} style={{ width:36, height:36, borderRadius:'50%', background:'rgba(0,122,255,0.10)', color:'#007AFF' }}><Mic size={17}/></button>
                    : <button className="gc-btn" onClick={send} style={{ width:36, height:36, borderRadius:'50%', background:'#007AFF', color:'#fff' }}><Send size={16}/></button>
                  }
                </div>
              )}
            </div>
          </>}
        </div>
      </div>
    </>
  )
}