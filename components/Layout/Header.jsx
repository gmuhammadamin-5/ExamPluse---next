"use client";
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { X, Sparkles, PenTool, Mic2, GraduationCap, ChevronRight, LayoutDashboard, User, LogOut, Send, Zap, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen]   = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled]             = useState(false);
  const [isMobile, setIsMobile]             = useState(false);

  const pathname = usePathname();
  const router   = useRouter();
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  const hideHeaderRoutes = ['/test/', '/exam/', '/take-test', '/practice', '/mock'];
  const isTestPage = hideHeaderRoutes.some(route => pathname?.startsWith(route));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  if (isTestPage) return null;

  const mainSections = [
    { path: '/', name: 'Home' },
    { path: '/check-result', name: 'Results' },
    { path: '/leaderboard', name: 'Leaderboard' },
    { path: '/pricing', name: 'Pricing' },
    { path: '/test-mock', name: 'Tests' },
    { path: '/contact', name: 'Contact' },
    { path: '/global-chat', name: 'Global Chat' },
    { path: '/lessons', name: 'Lessons' },
  ];

  const aiTutorSections = [
    { id: 1, path: '/ai-tutor',            name: 'AI IELTS Tutor',     icon: <GraduationCap size={22} />, color: '#3b82f6' },
    { id: 2, path: '/writing-evaluator',   name: 'Writing Evaluator',  icon: <PenTool size={22} />,       color: '#FF3B30' },
    { id: 3, path: '/speaking-evaluator',  name: 'Speaking Coach',     icon: <Mic2 size={22} />,          color: '#AF52DE' },
    { id: 4, path: '/vocabulary',          name: 'Vocabulary Master',  icon: <Sparkles size={22} />,      color: '#FF9500' },
  ];

  const isActive = (path) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname?.startsWith(path);
  };

  const brandColor = '#007bff';

  const navigate = (path) => {
    router.push(path);
    setIsMobileMenuOpen(false);
    setIsSidebarOpen(false);
  };

  const initials = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'EP';

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        transition: 'all 0.4s',
        padding: scrolled ? '10px 0' : '18px 0',
        backgroundColor: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(25px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
      }}>
        <div style={{ maxWidth: 1440, width: '100%', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{ width: 40, height: 40, backgroundColor: brandColor, color: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14 }}>EP</div>
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-1px', color: brandColor }}>ExamPulse</span>
          </div>

          {/* Desktop nav */}
          {!isMobile && (
            <nav style={{ display: 'flex', gap: 28 }}>
              {mainSections.map((section) => (
                <div
                  key={section.name}
                  onClick={() => navigate(section.path)}
                  style={{
                    fontSize: 14, cursor: 'pointer', position: 'relative',
                    fontWeight: 600, transition: '0.2s',
                    color: isActive(section.path) ? brandColor : '#1D1D1F',
                    opacity: isActive(section.path) ? 1 : 0.65,
                  }}
                >
                  {section.name}
                  {isActive(section.path) && <div style={{ position: 'absolute', bottom: -6, left: 0, width: '100%', height: 3, background: brandColor, borderRadius: 10 }} />}
                </div>
              ))}
            </nav>
          )}

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* AI Tutors button — desktop only */}
            {!isMobile && (
              <button
                style={{ background: brandColor, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 100, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 6px 16px rgba(0,123,255,0.25)' }}
                onMouseEnter={() => setIsSidebarOpen(true)}
              >
                <Zap size={13} fill="white" stroke="white" /> AI Tutors
              </button>
            )}

            {/* Auth / Avatar */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <div
                  style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: brandColor, border: '2px solid #dbeafe', cursor: 'pointer', fontSize: 13 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  {initials}
                </div>
                {isUserMenuOpen && (
                  <div style={{ position: 'absolute', top: 52, right: 0, width: 200, background: '#fff', borderRadius: 18, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: 8, border: '1px solid #f1f5f9', zIndex: 100 }}>
                    <div style={{ padding: '10px 14px', borderBottom: '1px solid #f1f5f9', marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{user?.full_name || 'User'}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>{user?.email}</div>
                    </div>
                    <div style={dropStyle} onClick={() => { navigate('/dashboard'); setIsUserMenuOpen(false); }}><LayoutDashboard size={14}/> Dashboard</div>
                    <div style={dropStyle} onClick={() => { navigate('/profile'); setIsUserMenuOpen(false); }}><User size={14}/> Profile</div>
                    <div style={{ ...dropStyle, color: '#ef4444', borderTop: '1px solid #f1f5f9', marginTop: 4 }} onClick={() => { logout(); setIsUserMenuOpen(false); }}><LogOut size={14}/> Sign Out</div>
                  </div>
                )}
              </div>
            ) : (
              !isMobile && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openAuthModal('login')} style={{ background: '#f1f5f9', color: '#334155', border: 'none', padding: '9px 18px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Log in</button>
                  <button onClick={() => openAuthModal('register')} style={{ background: brandColor, color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Register</button>
                </div>
              )
            )}

            {/* Hamburger — mobile only */}
            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: 10, padding: '9px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                {isMobileMenuOpen ? <X size={20} color="#334155" /> : <Menu size={20} color="#334155" />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Menu */}
      {isMobile && isMobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 999, overflowY: 'auto', paddingTop: 80 }}>
          <div style={{ padding: '20px 24px' }}>
            {mainSections.map((section) => (
              <div
                key={section.name}
                onClick={() => navigate(section.path)}
                style={{
                  padding: '16px 0', fontSize: 18, fontWeight: 700, cursor: 'pointer',
                  borderBottom: '1px solid #f1f5f9',
                  color: isActive(section.path) ? brandColor : '#1D1D1F',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
              >
                {section.name} <ChevronRight size={18} color="#cbd5e1" />
              </div>
            ))}

            <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>AI Tutors</p>
              {aiTutorSections.map(t => (
                <div
                  key={t.id}
                  onClick={() => navigate(t.path)}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${t.color}15`, color: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t.icon}</div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>{t.name}</span>
                </div>
              ))}
            </div>

            {!isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 32 }}>
                <button onClick={() => { openAuthModal('register'); setIsMobileMenuOpen(false); }} style={{ background: brandColor, color: '#fff', border: 'none', borderRadius: 14, padding: '15px 0', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}>Register Free</button>
                <button onClick={() => { openAuthModal('login'); setIsMobileMenuOpen(false); }} style={{ background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: 14, padding: '14px 0', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}>Log in</button>
              </div>
            ) : (
              <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: 14, padding: '14px 0', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', width: '100%', marginTop: 32 }}>Sign Out</button>
            )}
          </div>
        </div>
      )}

      {/* AI Sidebar Panel — desktop */}
      {!isMobile && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.05)', backdropFilter: 'blur(4px)', zIndex: 2000, transition: '0.4s', opacity: isSidebarOpen ? 1 : 0, visibility: isSidebarOpen ? 'visible' : 'hidden' }}
            onMouseEnter={() => setIsSidebarOpen(true)}
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside
            style={{ position: 'fixed', top: 15, right: 15, bottom: 15, width: 380, background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)', borderRadius: 32, zIndex: 2001, transition: '0.6s cubic-bezier(0.19,1,0.22,1)', display: 'flex', flexDirection: 'column', boxShadow: '0 40px 100px rgba(0,0,0,0.1)', border: '1px solid #fff', transform: isSidebarOpen ? 'translateX(0)' : 'translateX(110%)' }}
            onMouseLeave={() => setIsSidebarOpen(false)}
          >
            <div style={{ padding: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles color="white" size={20} fill="white" />
                </div>
                <h4 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>AI Tutors</h4>
              </div>
              <button style={{ background: '#f5f5f7', border: 'none', padding: 10, borderRadius: '50%', cursor: 'pointer' }} onClick={() => setIsSidebarOpen(false)}><X size={20}/></button>
            </div>

            <div style={{ flex: 1, padding: '0 24px 24px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {aiTutorSections.map(tutor => (
                  <div key={tutor.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 18, borderRadius: 24, background: '#fff', cursor: 'pointer', border: '1px solid #f1f5f9' }} onClick={() => navigate(tutor.path)}>
                    <div style={{ width: 46, height: 46, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `${tutor.color}10`, color: tutor.color }}>{tutor.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#1a1a1a' }}>{tutor.name}</div>
                      <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, margin: 0 }}>AI Simulation Ready</p>
                    </div>
                    <ChevronRight size={14} color="#c7c7cc" />
                  </div>
                ))}
              </div>

              <a href="https://t.me/+xhTgEC_plI1jYWUy" target="_blank" rel="noreferrer" style={{ marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20, borderRadius: 24, background: '#0088CC', color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: 15 }}>
                <Send size={18} /> Join ExamPulse Telegram
              </a>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

const dropStyle = {
  padding: '10px 14px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10,
  fontSize: 13, fontWeight: 600, color: '#1D1D1F', cursor: 'pointer',
};

export default Header;
