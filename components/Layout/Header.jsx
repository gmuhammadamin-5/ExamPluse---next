"use client"; // <--- Next.js uchun SHART

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // O'ZGARDI: Next.js hooklari
import { X, Sparkles, PenTool, Mic2, BookOpen, Headphones, GraduationCap, ChevronRight, LayoutDashboard, User, LogOut, Send, Zap } from 'lucide-react';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // O'ZGARDI: React Router o'rniga Next.js hooklari
  const pathname = usePathname(); 
  const router = useRouter();

  // 1. TESTLAR JARAYONIDA HEADER-NI YASHIRISH
  const hideHeaderRoutes = ['/test/', '/exam/', '/take-test', '/practice', '/mock'];
  
  // O'ZGARDI: location.pathname -> pathname
  const isTestPage = hideHeaderRoutes.some(route => pathname?.startsWith(route));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isTestPage) return null;

  // 2. NAVIGATSIYA BO'LIMLARI
  const mainSections = [
    { path: '/', name: 'Home' },
    { path: '/check-result', name: 'Results' },
    { path: '/leaderboard', name: 'Leaderboard' },
    { path: '/pricing', name: 'Pricing' },
    { path: '/test-mock', name: 'Tests' },
    { path: '/contact', name: 'Contact' },
    { path: '/global-chat', name: 'Global Chat', icon: '💬' },
    { path: '/lessons', name: 'Lessons' },
  ];

  const aiTutorSections = [
    { id: 1, path: '/ai-tutor', name: 'AI IELTS Tutor', icon: <GraduationCap size={22} />, color: '#3b82f6' },
    { id: 2, path: '/writing-evaluator', name: 'Writing Evaluator', icon: <PenTool size={22} />, color: '#FF3B30' },
    { id: 3, path: '/speaking-evaluator', name: 'Speaking Coach', icon: <Mic2 size={22} />, color: '#AF52DE' },
    { id: 4, path: '/vocabulary', name: 'Vocabulary Master', icon: <Sparkles size={22} />, color: '#FF9500' }
  ];

  const isActive = (path) => {
    // O'ZGARDI: location.pathname -> pathname
    if (path === '/' && pathname !== '/') return false;
    return pathname?.startsWith(path);
  };

  const brandColor = '#007bff';

  return (
    <>
      <header style={{
        ...styles.header,
        padding: scrolled ? '10px 0' : '22px 0',
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(25px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0, 0, 0, 0.04)' : 'none',
      }}>
        <div style={styles.container}>
          {/* Logo Section */}
          {/* O'ZGARDI: navigate -> router.push */}
          <div style={styles.logoGroup} onClick={() => router.push('/')}>
            <div style={{...styles.squircleLogo, backgroundColor: brandColor}}>EP</div>
            <span style={{...styles.logoBrand, color: brandColor}}>ExamPulse</span>
          </div>

          {/* Navigation */}
          <nav style={styles.navMain}>
            {mainSections.map((section) => (
              <div 
                key={section.name} 
                onClick={() => router.push(section.path)} // O'ZGARDI
                style={{
                  ...styles.navItem,
                  color: isActive(section.path) ? brandColor : '#1D1D1F',
                  opacity: isActive(section.path) ? 1 : 0.6
                }}
              >
                {section.icon && <span style={{marginRight:3}}>{section.icon}</span>}
                {section.name}
                {isActive(section.path) && <div style={{...styles.activePill, background: brandColor}} />}
              </div>
            ))}
          </nav>

          {/* AI Controls & Profile */}
          <div style={styles.rightActions}>
            <button 
              style={{...styles.aiTrigger, background: brandColor}} 
              onMouseEnter={() => setIsSidebarOpen(true)}
            >
              <Zap size={14} fill="white" stroke="white" />
              <span>AI Tutors</span>
            </button>

            <div style={styles.userContainer} onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
              <div style={styles.avatarMini}>MG</div>
              {isUserMenuOpen && (
                <div style={styles.userDropdown}>
                  {/* O'ZGARDI: navigate -> router.push */}
                  <div style={styles.dropLink} onClick={() => router.push('/dashboard')}><LayoutDashboard size={15}/> Dashboard</div>
                  <div style={styles.dropLink} onClick={() => router.push('/profile')}><User size={15}/> Profile</div>
                  <div style={{...styles.dropLink, color: '#FF3B30', borderTop: '1px solid #f5f5f7'}}><LogOut size={15}/> Sign Out</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* SIDEBAR PANEL */}
      <div 
        style={{...styles.overlay, opacity: isSidebarOpen ? 1 : 0, visibility: isSidebarOpen ? 'visible' : 'hidden'}} 
        onMouseEnter={() => setIsSidebarOpen(true)}
        onClick={() => setIsSidebarOpen(false)} 
      />
      <aside 
        style={{...styles.sidebarSheet, transform: isSidebarOpen ? 'translateX(0)' : 'translateX(110%)'}}
        onMouseLeave={() => setIsSidebarOpen(false)}
      >
        <div style={styles.sideTop}>
          <div style={styles.sideBrand}>
            <div style={{...styles.sideIconWrap, background: brandColor}}><Sparkles color="white" size={20} fill="white" /></div>
            <h4 style={styles.sideTitle}>AI Tutors</h4>
          </div>
          <button style={styles.sideClose} onClick={() => setIsSidebarOpen(false)}><X size={20}/></button>
        </div>

        <div style={styles.sideBody}>
          <div style={styles.tutorGrid}>
            {aiTutorSections.map(tutor => (
              <div 
                key={tutor.id} 
                style={styles.tutorItem} 
                onClick={() => {
                    router.push(tutor.path); // O'ZGARDI
                    setIsSidebarOpen(false);
                }}
              >
                <div style={{...styles.tutorCircle, backgroundColor: `${tutor.color}10`, color: tutor.color}}>
                  {tutor.icon}
                </div>
                <div style={{flex: 1}}>
                  <span style={styles.tutorTitle}>{tutor.name}</span>
                  <p style={styles.tutorMeta}>AI Simulation Ready</p>
                </div>
                <ChevronRight size={14} color="#C7C7CC" />
              </div>
            ))}
          </div>

          <a href="https://t.me/+xhTgEC_plI1jYWUy" target="_blank" rel="noreferrer" style={styles.telegramJoin}>
            <Send size={18} />
            <span>Join ExamPulse Telegram</span>
          </a>
        </div>
      </aside>
    </>
  );
}

const styles = {
  header: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  container: {
    maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '0 40px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  logoGroup: { display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' },
  squircleLogo: {
    width: '42px', height: '42px', color: '#fff', borderRadius: '12px', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '15px'
  },
  logoBrand: { fontSize: '26px', fontWeight: '800', letterSpacing: '-1.2px' },
  navMain: { display: 'flex', gap: '35px' },
  navItem: { fontSize: '15px', cursor: 'pointer', position: 'relative', transition: '0.3s', fontWeight: '600' },
  activePill: { position: 'absolute', bottom: '-8px', left: '0', width: '100%', height: '3px', borderRadius: '10px' },
  rightActions: { display: 'flex', alignItems: 'center', gap: '40px' }, 
  aiTrigger: {
    color: '#fff', border: 'none', padding: '11px 24px', borderRadius: '100px', 
    fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.25)', transition: '0.3s'
  },
  userContainer: { position: 'relative', cursor: 'pointer' },
  avatarMini: { 
    width: '45px', height: '45px', borderRadius: '50%', background: '#f8fafc', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', 
    color: '#3b82f6', border: '2px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
  },
  userDropdown: { position: 'absolute', top: '60px', right: 0, width: '220px', background: '#fff', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '10px', border: '1px solid #f1f5f9' },
  dropLink: { padding: '12px 15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: '600', color: '#1D1D1F' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.05)', backdropFilter: 'blur(4px)', zIndex: 2000, transition: '0.4s' },
  sidebarSheet: { 
    position: 'fixed', top: '15px', right: '15px', bottom: '15px', width: '380px', 
    background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(20px)', borderRadius: '32px', 
    zIndex: 2001, transition: '0.7s cubic-bezier(0.19, 1, 0.22, 1)', display: 'flex', flexDirection: 'column',
    boxShadow: '0 40px 100px rgba(0,0,0,0.1)', border: '1px solid #fff'
  },
  sideTop: { padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  sideBrand: { display: 'flex', alignItems: 'center', gap: '15px' },
  sideIconWrap: { width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  sideTitle: { fontSize: '22px', fontWeight: '800', color: '#1a1a1a' },
  sideClose: { background: '#F5F5F7', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer' },
  sideBody: { flex: 1, padding: '0 24px 24px', overflowY: 'auto' },
  tutorGrid: { display: 'flex', flexDirection: 'column', gap: '10px' },
  tutorItem: {
    display: 'flex', alignItems: 'center', gap: '16px', padding: '18px', borderRadius: '24px',
    background: '#fff', cursor: 'pointer', border: '1px solid #f1f5f9', transition: '0.3s'
  },
  tutorCircle: { width: '46px', height: '46px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  tutorTitle: { fontSize: '16px', fontWeight: '800', color: '#1a1a1a' },
  tutorMeta: { fontSize: '12px', color: '#94a3b8', marginTop: '2px' },
  telegramJoin: { 
    marginTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', 
    padding: '20px', borderRadius: '24px', background: '#0088CC', color: '#fff', textDecoration: 'none', 
    fontWeight: '800', fontSize: '15px', boxShadow: '0 10px 20px rgba(0,136,204,0.2)' 
  }
};

export default Header;