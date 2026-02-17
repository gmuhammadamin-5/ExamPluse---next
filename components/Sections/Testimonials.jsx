// components/Sections/Testimonials.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import { Quote, Star, CheckCircle2, Award, TrendingUp } from 'lucide-react';

// Swiper stillarini import qilish
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const Testimonials = () => {
  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "Graduate Student",
      score: "8.5",
      text: "The AI Speaking mentor is a game-changer. It caught pronunciation errors that my human tutors missed. Achieving an 8.5 was only possible through ExamPulse's feedback.",
      image: "https://i.pravatar.cc/150?u=sarah"
    },
    {
      name: "Marcus Chen",
      role: "Medical Professional",
      score: "8.0",
      text: "As a working professional, I needed efficiency. The precise scoring and instant Writing analysis allowed me to focus on my weak points. Highly recommended for candidates.",
      image: "https://i.pravatar.cc/150?u=marcus"
    },
    {
      name: "Abdurakhmon J.",
      role: "Tech Engineer",
      score: "7.5",
      text: "ExamPulse mirrors the real CBT IELTS environment perfectly. The AI's band prediction was within 0.1 of my actual result. Simply the most accurate platform available.",
      image: "https://i.pravatar.cc/150?u=abdurakhmon"
    },
    {
      name: "Elena Rodriguez",
      role: "University Applicant",
      score: "8.0",
      text: "The Listening and Reading simulations are identical to the actual exam. I felt so much more confident on the test day thanks to the recursive practice on this platform.",
      image: "https://i.pravatar.cc/150?u=elena"
    },
    {
      name: "David Smith",
      role: "PhD Candidate",
      score: "9.0",
      text: "Incredible depth of lexical resource analysis. The AI doesn't just score; it explains how to move from a Band 7 to a Band 9 structure. Truly a masterpiece of ed-tech.",
      image: "https://i.pravatar.cc/150?u=david"
    },
    {
      name: "Amina Al-Sayed",
      role: "Business Consultant",
      score: "7.5",
      text: "I struggled with Writing Task 2 for months. ExamPulse's structural breakdown helped me reorganize my thinking. My score jumped 1.5 bands in just three weeks!",
      image: "https://i.pravatar.cc/150?u=amina"
    }
  ];

  return (
    <section style={styles.section}>
      <div className="container" style={styles.container}>
        
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.badge}>
            <Award size={14} color="#3b82f6" />
            <span>ELITE GLOBAL SUCCESS</span>
          </div>
          <h2 style={styles.h2}>Proven Success <br /> <span style={styles.blueText}>Real Candidates.</span></h2>
          <p style={styles.subTitle}>Don't just take our word for it. Join 10,000+ candidates who achieved their target band score using our AI ecosystem.</p>
        </div>

        {/* SWIPER CAROUSEL */}
        <div className="testimonial-slider-wrapper" style={styles.sliderWrapper}>
          <Swiper
            modules={[Pagination, Autoplay, EffectCoverflow]}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            loop={true}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2.5,
              slideShadows: false,
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1 },
              1024: { slidesPerView: 3 },
            }}
            style={{ padding: '40px 0 80px 0' }}
          >
            {reviews.map((rev, i) => (
              <SwiperSlide key={i} style={styles.slide}>
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <div style={styles.quoteBox}><Quote size={20} fill="#3b82f6" color="#3b82f6" opacity={0.2} /></div>
                    <div style={styles.stars}>
                      {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#3b82f6" color="#3b82f6" />)}
                    </div>
                  </div>

                  <p style={styles.text}>"{rev.text}"</p>

                  <div style={styles.profileRow}>
                    <img src={rev.image} alt={rev.name} style={styles.avatar} />
                    <div style={styles.nameBlock}>
                      <div style={styles.nameLine}>
                        <span style={styles.name}>{rev.name}</span>
                        <CheckCircle2 size={14} color="#10b981" />
                      </div>
                      <span style={styles.role}>{rev.role}</span>
                    </div>
                    <div style={styles.scoreBadge}>
                      <span style={styles.scoreSub}>BAND</span>
                      <span style={styles.scoreVal}>{rev.score}</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div style={styles.bottomStats}>
          <TrendingUp size={20} color="#3b82f6" />
          <span>Average Band Increase Across Our Users: <strong>+1.5 Score</strong></span>
        </div>

      </div>

      <style>{`
        .swiper-pagination-bullet { background: #3b82f6 !important; width: 12px; height: 12px; opacity: 0.3; }
        .swiper-pagination-bullet-active { width: 30px; border-radius: 6px; opacity: 1; }
      `}</style>
    </section>
  );
};

const styles = {
  section: {
    padding: '120px 0',
    background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    overflow: 'hidden'
  },
  container: { maxWidth: '1280px', margin: '0 auto', padding: '0 20px' },
  header: { textAlign: 'center', marginBottom: '60px' },
  badge: {
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    background: '#FFFFFF', padding: '10px 20px', borderRadius: '50px',
    fontSize: '11px', fontWeight: '800', color: '#3b82f6',
    border: '1px solid #dbeafe', marginBottom: '24px', letterSpacing: '1.2px'
  },
  h2: {
    fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: '900', color: '#0f172a',
    lineHeight: '1.1', margin: '0 0 20px 0', letterSpacing: '-2px'
  },
  blueText: { color: '#3b82f6', background: 'linear-gradient(90deg, #3b82f6, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subTitle: { fontSize: '1.1rem', color: '#64748b', maxWidth: '600px', margin: '0 auto', fontWeight: '500' },
  
  sliderWrapper: { width: '100%' },
  slide: { width: '420px', height: 'auto' },
  
  card: {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(20px)',
    padding: '40px',
    borderRadius: '35px',
    border: '1px solid #FFFFFF',
    height: '100%',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.03)',
    display: 'flex',
    flexDirection: 'column'
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  stars: { display: 'flex', gap: '2px' },
  text: { fontSize: '1rem', lineHeight: '1.7', color: '#475569', fontWeight: '500', fontStyle: 'italic', marginBottom: '35px', flex: 1 },
  profileRow: { display: 'flex', alignItems: 'center', gap: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '25px' },
  avatar: { width: '45px', height: '45px', borderRadius: '50%', border: '2px solid #eff6ff' },
  nameBlock: { flex: 1 },
  nameLine: { display: 'flex', alignItems: 'center', gap: '6px' },
  name: { fontSize: '14px', fontWeight: '800', color: '#0f172a' },
  role: { fontSize: '11px', fontWeight: '600', color: '#94a3b8' },
  scoreBadge: { background: '#eff6ff', padding: '6px 12px', borderRadius: '12px', textAlign: 'center' },
  scoreSub: { fontSize: '7px', fontWeight: '900', color: '#3b82f6', display: 'block' },
  scoreVal: { fontSize: '16px', fontWeight: '900', color: '#0f172a' },
  
  bottomStats: { marginTop: '30px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: '600', color: '#64748b' }
};

export default Testimonials