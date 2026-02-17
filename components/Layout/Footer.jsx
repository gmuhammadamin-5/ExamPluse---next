import React from 'react';
import Link from 'next/link'; // O'ZGARDI: Next.js Linki

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Main Footer Content */}
        <div style={styles.mainContent}>
          {/* Logo Section */}
          <div style={styles.footerSection}>
            <div style={styles.logoContainer}>
              <div style={styles.logo3D}>
                <span style={styles.logoText}>EP</span>
              </div>
              <div style={styles.logoContent}>
                {/* O'ZGARDI: to -> href */}
                <Link href="/" style={styles.logoLink}>
                  <span style={styles.logoMain}>Exam</span>
                  <span style={styles.logoAccent}>Pulse</span>
                </Link>
                <p style={styles.logoDescription}>
                  Your trusted partner for IELTS preparation. Free mock tests, 
                  realistic practice, and expert guidance to achieve your target band score.
                </p>
              </div>
            </div>
            
            {/* Social Links */}
            <div style={styles.socialContainer}>
              {[
                { icon: 'fab fa-facebook-f', color: '#1877F2', label: 'Facebook' },
                { icon: 'fab fa-twitter', color: '#1DA1F2', label: 'Twitter' },
                { icon: 'fab fa-instagram', color: '#E4405F', label: 'Instagram' },
                { icon: 'fab fa-linkedin-in', color: '#0A66C2', label: 'LinkedIn' },
                { icon: 'fab fa-youtube', color: '#FF0000', label: 'YouTube' }
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  aria-label={social.label}
                  style={styles.socialLink}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.background = social.color;
                    e.currentTarget.querySelector('i').style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.querySelector('i').style.color = social.color;
                  }}
                >
                  <i className={social.icon} style={{ color: social.color }}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div style={styles.linksGrid}>
            <div style={styles.linksSection}>
              <h4 style={styles.linksTitle}>Quick Links</h4>
              <ul style={styles.linksList}>
                {/* O'ZGARDI: to -> href */}
                <li><Link href="/" style={styles.linkItem}>Home</Link></li>
                <li><Link href="/features" style={styles.linkItem}>Features</Link></li>
                <li><Link href="/how-it-works" style={styles.linkItem}>How It Works</Link></li>
                <li><Link href="/tests" style={styles.linkItem}>Practice Tests</Link></li>
                <li><Link href="/resources" style={styles.linkItem}>Resources</Link></li>
              </ul>
            </div>

            <div style={styles.linksSection}>
              <h4 style={styles.linksTitle}>IELTS Test Types</h4>
              <ul style={styles.linksList}>
                <li><Link href="/tests/speaking" style={styles.linkItem}>Speaking Tests</Link></li>
                <li><Link href="/tests/listening" style={styles.linkItem}>Listening Tests</Link></li>
                <li><Link href="/tests/reading" style={styles.linkItem}>Reading Tests</Link></li>
                <li><Link href="/tests/writing" style={styles.linkItem}>Writing Tests</Link></li>
                <li><Link href="/tests/full" style={styles.linkItem}>Full IELTS Tests</Link></li>
              </ul>
            </div>

            <div style={styles.linksSection}>
              <h4 style={styles.linksTitle}>IELTS Resources</h4>
              <ul style={styles.linksList}>
                <li><Link href="/vocabulary" style={styles.linkItem}>Vocabulary Builder</Link></li>
                <li><Link href="/grammar" style={styles.linkItem}>Grammar Guide</Link></li>
                <li><Link href="/tips" style={styles.linkItem}>Exam Tips</Link></li>
                <li><Link href="/samples" style={styles.linkItem}>Sample Answers</Link></li>
                <li><Link href="/band-calculator" style={styles.linkItem}>Band Calculator</Link></li>
              </ul>
            </div>

            <div style={styles.linksSection}>
              <h4 style={styles.linksTitle}>Support</h4>
              <ul style={styles.linksList}>
                <li>
                  <a href="mailto:support@exampulse.com" style={styles.linkItem}>
                    <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>
                    support@exampulse.com
                  </a>
                </li>
                <li>
                  <a href="tel:+1234567890" style={styles.linkItem}>
                    <i className="fas fa-phone" style={{ marginRight: '8px' }}></i>
                    +1 (234) 567-890
                  </a>
                </li>
                <li><Link href="/help" style={styles.linkItem}>Help Center</Link></li>
                <li><Link href="/privacy" style={styles.linkItem}>Privacy Policy</Link></li>
                <li><Link href="/terms" style={styles.linkItem}>Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div style={styles.statsBar}>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>500+</div>
            <div style={styles.statLabel}>Practice Tests</div>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>10K+</div>
            <div style={styles.statLabel}>Active Students</div>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>1.5+</div>
            <div style={styles.statLabel}>Avg Band Improvement</div>
          </div>
          <div style={styles.statDivider}></div>
          <div style={styles.statItem}>
            <div style={styles.statNumber}>99%</div>
            <div style={styles.statLabel}>Satisfaction Rate</div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={styles.bottomBar}>
          <div style={styles.bottomContent}>
            <p style={styles.copyright}>
              &copy; {new Date().getFullYear()} ExamPulse. All rights reserved.
              <span style={styles.divider}> | </span>
              Preparing students for IELTS success since 2024
            </p>
            
            <div style={styles.bottomLinks}>
              <Link href="/sitemap" style={styles.bottomLink}>Sitemap</Link>
              <span style={styles.divider}> • </span>
              <Link href="/cookies" style={styles.bottomLink}>Cookie Policy</Link>
              <span style={styles.divider}> • </span>
              <Link href="/accessibility" style={styles.bottomLink}>Accessibility</Link>
              <span style={styles.divider}> • </span>
              <Link href="/contact" style={styles.bottomLink}>Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Styles (O'ZGARISHSIZ)
const styles = {
  footer: {
    background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)',
    color: '#4a5568',
    position: 'relative',
    overflow: 'hidden',
    borderTop: '2px solid rgba(30, 144, 255, 0.1)'
  },

  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 30px 30px'
  },

  // Main Content
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '80px',
    marginBottom: '60px',
    alignItems: 'start'
  },

  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },

  logoContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px'
  },

  logo3D: {
    width: '60px',
    height: '60px',
    background: 'linear-gradient(135deg, #1e90ff, #00bfff)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    boxShadow: '0 10px 25px rgba(30, 144, 255, 0.4)',
    flexShrink: 0
  },

  logoText: {
    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },

  logoContent: {
    flex: '1'
  },

  logoLink: {
    textDecoration: 'none',
    display: 'block',
    marginBottom: '15px'
  },

  logoMain: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1a365d'
  },

  logoAccent: {
    fontSize: '28px',
    fontWeight: '800',
    background: 'linear-gradient(90deg, #1e90ff, #00bfff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },

  logoDescription: {
    color: '#4a5568',
    lineHeight: '1.6',
    fontSize: '14px'
  },

  socialContainer: {
    display: 'flex',
    gap: '12px'
  },

  socialLink: {
    width: '44px',
    height: '44px',
    background: 'white',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 5px 15px rgba(30, 144, 255, 0.1)'
  },

  // Links Grid
  linksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '40px'
  },

  linksSection: {
    display: 'flex',
    flexDirection: 'column'
  },

  linksTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a365d',
    marginBottom: '25px',
    position: 'relative',
    paddingBottom: '10px'
  },

  linksTitleAfter: {
    content: '""',
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '40px',
    height: '3px',
    background: 'linear-gradient(90deg, #1e90ff, #00bfff)',
    borderRadius: '2px'
  },

  linksList: {
    listStyle: 'none',
    padding: '0',
    margin: '0'
  },

  linkItem: {
    color: '#4a5568',
    textDecoration: 'none',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    padding: '8px 0',
    transition: 'all 0.2s ease'
  },

  // Stats Bar
  statsBar: {
    background: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '40px',
    border: '2px solid rgba(30, 144, 255, 0.1)',
    boxShadow: '0 10px 30px rgba(30, 144, 255, 0.1)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  },

  statItem: {
    textAlign: 'center',
    flex: '1'
  },

  statNumber: {
    fontSize: '32px',
    fontWeight: '800',
    background: 'linear-gradient(90deg, #1e90ff, #00bfff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '5px'
  },

  statLabel: {
    color: '#718096',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },

  statDivider: {
    width: '1px',
    height: '40px',
    background: 'rgba(30, 144, 255, 0.2)'
  },

  // Bottom Bar
  bottomBar: {
    borderTop: '1px solid rgba(30, 144, 255, 0.1)',
    padding: '30px 0'
  },

  bottomContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px'
  },

  copyright: {
    color: '#718096',
    fontSize: '14px',
    margin: '0'
  },

  divider: {
    color: '#a0aec0'
  },

  bottomLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap'
  },

  bottomLink: {
    color: '#718096',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.2s ease'
  },

  // Hover Effects
  linkItemHover: {
    color: '#1e90ff',
    transform: 'translateX(5px)'
  },

  bottomLinkHover: {
    color: '#1e90ff'
  },

  // Responsive
  '@media (max-width: 1024px)': {
    mainContent: {
      gridTemplateColumns: '1fr',
      gap: '50px'
    },
    linksGrid: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '40px'
    }
  },

  '@media (max-width: 768px)': {
    container: {
      padding: '40px 20px'
    },
    linksGrid: {
      gridTemplateColumns: '1fr',
      gap: '30px'
    },
    statsBar: {
      flexDirection: 'column',
      gap: '30px',
      padding: '40px 20px'
    },
    statDivider: {
      width: '80%',
      height: '1px'
    },
    bottomContent: {
      flexDirection: 'column',
      textAlign: 'center'
    }
  }
};

export default Footer;