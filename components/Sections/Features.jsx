import React, { useState } from 'react';
import { Send, Instagram, Youtube, Phone, MapPin, Mail, MessageCircle } from 'lucide-react';

const Footer = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Background color used for hover effect synchronization
  const bgColor = '#e6f7ff'; 

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          
          {/* BRAND COLUMN */}
          <div style={styles.column}>
            <div style={styles.logoWrapper}>
               <div 
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{
                    ...styles.epBadge,
                    backgroundColor: isHovered ? bgColor : '#3b82f6', 
                    color: isHovered ? '#3b82f6' : '#FFFFFF',
                    border: `2px solid ${isHovered ? '#3b82f6' : 'transparent'}`
                  }}
               >
                 EP
               </div>
               
               <h3 style={styles.logoMain}>ExamPulse</h3>
            </div>

            <p style={styles.about}>
              The ultimate IELTS mock test platform. We provide innovative solutions and real-exam environments to help you achieve your target band score.
            </p>
            
            <div style={styles.socials}>
              {/* INSTAGRAM HAVOLASI YANGILANDI */}
              <a 
                href="https://www.instagram.com/ielts_bakhromov?igsh=ZXZ6cmdtNjdocDVx" 
                target="_blank" 
                rel="noreferrer" 
                style={styles.socialIcon}
              >
                <Instagram size={20} />
              </a>

              <a href="https://t.me/+xhTgEC_plI1jYWUy" target="_blank" rel="noreferrer" style={styles.socialIcon}>
                <Send size={20} />
              </a>
              
              <a href="#" style={styles.socialIcon}><Youtube size={20} /></a>
            </div>
          </div>

          {/* PLATFORM LINKS */}
          <div style={styles.column}>
            <h4 style={styles.colTitle}>Platform</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}><a href="#" style={styles.link}>Take an Exam</a></li>
              <li style={styles.listItem}><a href="#" style={styles.link}>Our Centers</a></li>
              <li style={styles.listItem}><a href="#" style={styles.link}>Verify Results</a></li>
              <li style={styles.listItem}><a href="#" style={styles.link}>Help Center</a></li>
            </ul>
          </div>

          {/* CONTACT & TELEGRAM */}
          <div style={styles.column}>
            <h4 style={styles.colTitle}>Contact</h4>
            <ul style={styles.list}>
              <li style={styles.contactItem}>
                <div style={styles.iconCircle}><Phone size={16} color="#3b82f6" /></div>
                <span>+998 90 336 20 12</span>
              </li>
              <li style={styles.contactItem}>
                <div style={styles.iconCircle}><Mail size={16} color="#3b82f6" /></div>
                <span>support@exampulse.ai</span>
              </li>
              <li style={styles.contactItem}>
                <a href="https://t.me/+xhTgEC_plI1jYWUy" target="_blank" rel="noreferrer" style={styles.telegramLink}>
                  <div style={styles.iconCircle}><MessageCircle size={16} color="#fff" style={{fill: '#3b82f6'}} /></div>
                  <span>Join ExamPulse Channel</span>
                </a>
              </li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div style={styles.column}>
            <h4 style={styles.colTitle}>Newsletter</h4>
            <p style={styles.newsletterText}>Stay updated with the latest exam dates and exclusive offers.</p>
            <div style={styles.inputGroup}>
              <input type="email" placeholder="Your Email" style={styles.input} />
              <button style={styles.inputBtn}><Send size={18} /></button>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div style={styles.bottomBar}>
          <p>© {new Date().getFullYear()} ExamPulse Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    padding: '100px 0 40px 0',
    background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    borderTop: '1px solid rgba(255, 255, 255, 0.6)',
  },
  container: { maxWidth: '1240px', margin: '0 auto', padding: '0 40px' },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: '1.5fr 0.8fr 1.2fr 1fr', 
    gap: '40px',
    marginBottom: '60px'
  },
  logoWrapper: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' },
  epBadge: {
    width: '42px', height: '42px', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '800', fontSize: '16px', cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 5px 15px rgba(59, 130, 246, 0.15)'
  },
  logoMain: { fontSize: '28px', fontWeight: '800', color: '#3b82f6', margin: 0, letterSpacing: '-1.5px' },
  about: { fontSize: '15px', color: '#4b5563', lineHeight: '1.7', marginBottom: '30px', maxWidth: '350px' },
  socials: { display: 'flex', gap: '10px' },
  socialIcon: { 
    width: '38px', height: '38px', background: '#FFFFFF', borderRadius: '10px', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)', transition: 'all 0.3s', textDecoration: 'none'
  },
  colTitle: { fontSize: '14px', fontWeight: '800', color: '#1a1a1a', marginBottom: '25px', textTransform: 'uppercase', letterSpacing: '1px' },
  list: { listStyle: 'none', padding: 0, margin: 0 },
  listItem: { marginBottom: '12px' },
  link: { textDecoration: 'none', color: '#4b5563', fontSize: '14px', fontWeight: '500', transition: '0.3s' },
  contactItem: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', color: '#1a1a1a', fontWeight: '600', fontSize: '14px' },
  telegramLink: { display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#3b82f6', fontWeight: '700' },
  iconCircle: { width: '30px', height: '30px', background: '#FFFFFF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 6px rgba(0,0,0,0.05)' },
  newsletterText: { fontSize: '14px', color: '#4b5563', marginBottom: '20px', lineHeight: '1.6' },
  inputGroup: { display: 'flex', position: 'relative' },
  input: { width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid #FFFFFF', background: '#FFFFFF', outline: 'none', fontSize: '13px', boxShadow: '0 5px 10px rgba(0,0,0,0.02)' },
  inputBtn: { position: 'absolute', right: '4px', top: '4px', bottom: '4px', background: '#3b82f6', border: 'none', borderRadius: '10px', color: '#fff', padding: '0 10px', cursor: 'pointer' },
  bottomBar: { borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '30px', textAlign: 'center', fontSize: '13px', color: '#64748b' }
};

export default Footer;