import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { ExternalLink, MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- JIVOY MARKER (PULSE EFFEKT) ---
// Yorqin ko'k rangli pulsiruyushiy marker
const createPulseIcon = (color) => {
  return L.divIcon({
    className: 'custom-pulse-icon',
    html: `
      <div class="pulse-marker" style="background-color: ${color}; box-shadow: 0 0 20px ${color}, 0 0 40px ${color};">
        <div class="pulse-ring" style="border-color: ${color}"></div>
        <div class="pulse-ring delay" style="border-color: ${color}"></div>
        <div class="pulse-center"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const MockCenters = () => {
  // 1. Xarita Markazi: BUTUN O'ZBEKISTON
  const uzbCenter = [41.3775, 64.5853]; 
  const zoomLevel = 6; // Butun davlatni ko'rsatish uchun uzoqroq zoom
  
  // 2. Lokatsiya: TOSHKENT (Darhol MySchool taxminiy manzili)
  const darholLocation = [41.3250, 69.3000]; 
  
  const neonBlue = '#3b82f6'; // Marker uchun yorqin rang
  const bluePulse = createPulseIcon(neonBlue);

  return (
    <section className="mock-centers-section" style={styles.section}>
      <div style={styles.container}>
        <div className="mock-layout" style={styles.layout}>
          
          {/* --- CHAP TARAF: DARK DOT MAP (YANGILANDI) --- */}
          <div style={styles.mapSide}>
            <div className="mock-map-wrapper" style={styles.mapWrapper}>
              
              <div style={styles.mapContainerStyle}>
                <MapContainer 
                  center={uzbCenter} 
                  zoom={zoomLevel} 
                  scrollWheelZoom={false}
                  zoomControl={false} // Knopkalarsiz toza ko'rinish
                  dragging={false} // Statik xarita (qimirlamaydi)
                  doubleClickZoom={false}
                  // Xarita foni qop-qora bo'lishi kerak
                  style={{ height: '100%', width: '100%', background: '#020617' }} 
                >
                  {/* 1-QATLAM: ENG QORONG'U XARITA (Yo'llar va chegaralar uchun asos) */}
                  <TileLayer 
                    url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                    opacity={0.5} // Juda xira qilamiz, asosiy urg'u nuqtalarda bo'ladi
                  />
                  
                  {/* MARKER: DARHOL MYSCHOOL */}
                  <Marker position={darholLocation} icon={bluePulse}>
                    <Popup className="tech-popup" autoClose={false} closeButton={false}>
                      <div style={styles.popupContent}>
                        <span style={{color: '#94a3b8', fontSize: '10px', letterSpacing: '1px'}}>LOCATION</span><br/>
                        {/* Siz so'ragan nom */}
                        <span style={{color: neonBlue, fontWeight: 700, fontSize: '14px'}}>Darhol MySchool</span>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>

                {/* --- 2-QATLAM: NUQTALI EFFEKT (DOT GRID - ENG MUHIMI) --- */}
                {/* Bu qatlam xarita ustida TO'Q MOVIY nuqtalar hosil qiladi */}
                <div style={styles.dotGridOverlay}></div>

                {/* --- 3-QATLAM: TECH YORUG'LIK --- */}
                <div style={styles.hologramOverlay}></div>
                
              </div>
              
              {/* Kichik Badge */}
              <div style={styles.floatingBadge}>
                 <MapPin size={16} color="#fff" />
                 <span>UZB: Tashkent Branch</span>
              </div>

            </div>
            
            {/* Orqa fon Glow effekti */}
            <div style={styles.softGlow}></div>
          </div>

          {/* --- O'NG TARAF: YOZUVLARGA TEGILMADI --- */}
          <div className="mock-content" style={styles.contentSide}>
            <h2 style={styles.title}>
              take a cdi mock test in our <br /> 
              <span style={{color: '#3b82f6'}}>darhon elite center</span>
            </h2>
            <p style={styles.desc}>
              Experience the official IELTS atmosphere at our premium facility. 
              Equipped with high-end technology, noise-canceling headphones, and a professional proctoring team to ensure your exam success.
            </p>
            
            <div style={styles.infoBox}>
               <div style={styles.infoItem}>
                 <span style={styles.infoLabel}>Next Mock:</span>
                 <span style={styles.infoValue}>Sunday, 09:00 AM</span>
               </div>
               <div style={styles.infoItem}>
                 <span style={styles.infoLabel}>Price:</span>
                 <span style={styles.infoValue}>150,000 UZS</span>
               </div>
            </div>

            <button style={styles.btn}>
              Book a Seat Now <ExternalLink size={18} />
            </button>
          </div>

        </div>
      </div>

      {/* CSS Animatsiyalar (Marker va Popup uchun) */}
      <style>{`
        @media(max-width:900px){
          .mock-layout { grid-template-columns:1fr !important; gap:40px !important; }
          .mock-centers-section { padding:clamp(60px,8vw,100px) 0 !important; }
          .mock-centers-section > div { padding:0 20px !important; }
          .mock-map-wrapper { height:320px !important; }
          .mock-content { padding-left:0 !important; }
        }
        @media(max-width:480px){
          .mock-centers-section { padding:52px 0 !important; }
          .mock-map-wrapper { height:260px !important; }
        }
        .pulse-marker {
          width: 24px; height: 24px; border-radius: 50%;
          position: relative; z-index: 10; display: flex; align-items: center; justify-content: center;
        }
        .pulse-center { width: 8px; height: 8px; background: white; border-radius: 50%; z-index: 20; box-shadow: 0 0 10px white; }
        .pulse-ring {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 24px; height: 24px; border-radius: 50%; border: 2px solid;
          opacity: 0; animation: pulse-ring 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
        .pulse-ring.delay { animation-delay: 1s; }
        @keyframes pulse-ring {
          0% { width: 24px; height: 24px; opacity: 0.8; border-width: 3px; }
          100% { width: 100px; height: 100px; opacity: 0; border-width: 1px; }
        }
        .tech-popup .leaflet-popup-content-wrapper {
          background: rgba(2, 6, 23, 0.9); backdrop-filter: blur(10px);
          border: 1px solid #3b82f6; color: white; border-radius: 4px;
          text-align: center; box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
          padding: 0;
        }
        .tech-popup .leaflet-popup-tip { background: #3b82f6; }
        .leaflet-popup-content { margin: 10px 16px !important; }
      `}</style>
    </section>
  );
};

const styles = {
  section: { 
    padding: '140px 0', 
    // ASOSIY FON (TEGILMADI)
    background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    position: 'relative', zIndex: 20
  },
  container: { maxWidth: '1240px', margin: '0 auto', padding: '0 40px' },
  layout: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px', alignItems: 'center' },
  
  mapSide: { position: 'relative' },
  mapWrapper: {
    position: 'relative', width: '100%', height: '500px', zIndex: 2,
  },
  mapContainerStyle: {
    width: '100%', height: '100%',
    borderRadius: '40px', overflow: 'hidden',
    // Tech Ramka (To'q ko'k)
    border: '4px solid #1e293b', 
    boxShadow: '0 40px 80px rgba(15, 23, 42, 0.5)', 
    position: 'relative', background: '#020617' 
  },

  // --- NUQTALI EFFEKT (DOT GRID) ---
  // Bu qatlam xaritani zarrachalardan iboratdek ko'rsatadi
  dotGridOverlay: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    // TO'Q MOVIY NUQTALAR (#1e3a8a)
    backgroundImage: 'radial-gradient(circle, #1e3a8a 1.5px, transparent 1.5px)',
    backgroundSize: '12px 12px', // Nuqtalar zichligi
    opacity: 0.7, // Ko'rinish darajasi
    pointerEvents: 'none', zIndex: 400
  },

  // Tech Yorug'lik (Hologram)
  hologramOverlay: {
    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
    background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, rgba(2, 6, 23, 0.9) 90%)',
    pointerEvents: 'none', zIndex: 401
  },
  
  floatingBadge: {
    position: 'absolute', top: '30px', left: '30px',
    background: 'rgba(30, 41, 59, 0.9)', 
    color: '#fff', border: '1px solid rgba(255,255,255,0.1)',
    padding: '10px 20px', borderRadius: '100px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', 
    gap: '10px', fontWeight: '600', fontSize: '12px', zIndex: 1000
  },
  softGlow: {
    position: 'absolute', top: '20%', left: '10%', width: '80%', height: '80%',
    background: '#3b82f6', filter: 'blur(150px)', opacity: 0.15, zIndex: 1
  },

  // CONTENT SIDE (TEGILMADI)
  contentSide: { paddingLeft: '20px' },
  title: { 
    fontSize: '46px', fontWeight: '800', color: '#0f172a', 
    lineHeight: '1.1', marginBottom: '25px', letterSpacing: '-1.5px',
    textTransform: 'lowercase'
  },
  desc: { 
    fontSize: '18px', color: '#64748b', 
    lineHeight: '1.7', marginBottom: '35px', fontWeight: '500' 
  },
  infoBox: {
    display: 'flex', gap: '30px', marginBottom: '40px',
    padding: '20px', background: 'rgba(255,255,255,0.6)', borderRadius: '16px', border: '1px solid #e2e8f0'
  },
  infoItem: { display: 'flex', flexDirection: 'column' },
  infoLabel: { fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' },
  infoValue: { fontSize: '16px', color: '#0f172a', fontWeight: '700', marginTop: '4px' },

  btn: {
    background: '#3b82f6', color: '#fff', 
    padding: '18px 40px', borderRadius: '18px',
    border: 'none', fontWeight: '800', fontSize: '16px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: '10px', 
    boxShadow: '0 15px 30px rgba(59, 130, 246, 0.25)',
    transition: 'transform 0.2s ease'
  }
};

export default MockCenters;