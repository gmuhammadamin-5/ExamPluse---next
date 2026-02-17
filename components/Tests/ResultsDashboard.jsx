import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Trophy, Target, Zap, ArrowUpRight, 
  CheckCircle2, RotateCcw, BrainCircuit, 
  Star, Award, TrendingUp, ShieldCheck, 
  Sparkles, Download, Layout, ChevronRight
} from 'lucide-react';

const BRAND_COLOR = '#3b82f6';
const GRADIENT_BG = 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)';

const ResultsDashboard = ({ testId = "MOCK-2026" }) => {
  const [selectedSection, setSelectedSection] = useState('overall');
  const [isDownloading, setIsDownloading] = useState(false);
  const pdfContentRef = useRef(null);

  const results = {
    overall: "7.5",
    listening: "8.0",
    reading: "7.5",
    writing: "6.5",
    speaking: "7.0",
    date: "Jan 18, 2026",
    candidate: "Student User",
    status: "Verified Mock Result"
  };

  // --- PDF GENERATION ENGINE ---
  const handleDownload = async () => {
    setIsDownloading(true);
    const element = pdfContentRef.current;
    
    try {
      const canvas = await html2canvas(element, {
        scale: 3, 
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Mock_Neural_Report_${testId}.pdf`); // Fayl nomi o'zgardi
    } catch (error) {
      console.error("PDF Error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const S = {
    wrapper: {
      minHeight: '100vh', background: GRADIENT_BG, padding: '40px 20px',
      fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'flex', justifyContent: 'center'
    },
    container: { width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '20px' },
    nav: {
      background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(20px)', padding: '15px 30px',
      borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      border: '1px solid #fff', boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
    },
    heroCard: {
      background: '#ffffff', borderRadius: '45px', padding: '60px', border: '1px solid rgba(0,0,0,0.03)',
      textAlign: 'center', boxShadow: '0 30px 100px rgba(59, 130, 246, 0.08)', position: 'relative', overflow: 'hidden'
    },
    bentoGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' },
    miniCard: (active) => ({
      background: active ? BRAND_COLOR : '#fff', padding: '20px', borderRadius: '25px',
      border: '1px solid #f1f5f9', cursor: 'pointer', transition: '0.3s',
      boxShadow: active ? `0 15px 30px ${BRAND_COLOR}30` : '0 4px 15px rgba(0,0,0,0.02)'
    }),
    btnPremium: {
      padding: '12px 25px', borderRadius: '16px', border: 'none', 
      background: `linear-gradient(135deg, ${BRAND_COLOR}, #2563eb)`,
      color: '#fff', fontWeight: '800', fontSize: '14px', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: '10px', boxShadow: `0 10px 25px ${BRAND_COLOR}30`
    }
  };

  return (
    <div style={S.wrapper}>
      <div style={S.container}>
        
        <header style={S.nav}>
          <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
            <div style={{background:BRAND_COLOR, padding:'8px', borderRadius:'10px'}}><BrainCircuit color="#fff" size={20}/></div>
            <h2 style={{fontSize:'18px', fontWeight:'900', color:'#1e293b', margin:0}}>Mock Intelligence</h2>
          </div>
          <button style={S.btnPremium} onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? <RotateCcw className="animate-spin" size={18}/> : <Download size={18}/>}
            {isDownloading ? 'Processing...' : 'Download Mock Report'}
          </button>
        </header>

        <div ref={pdfContentRef} style={{padding: '10px', borderRadius: '45px'}}>
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} style={S.heroCard}>
            <div style={{position:'absolute', top:0, right:0, opacity:0.05}}><Sparkles size={300}/></div>
            
            <div style={{display:'inline-flex', alignItems:'center', gap:'8px', background:`${BRAND_COLOR}10`, color:BRAND_COLOR, padding:'6px 18px', borderRadius:'100px', fontSize:'11px', fontWeight:'900', marginBottom:'25px'}}>
              <ShieldCheck size={14} fill={BRAND_COLOR}/> VERIFIED MOCK ASSESSMENT
            </div>

            <div style={{display:'flex', justifyContent:'center', alignItems:'baseline', gap:'15px'}}>
               <h1 style={{fontSize:'130px', fontWeight:'900', color:'#0f172a', margin:0, letterSpacing:'-8px'}}>{results.overall}</h1>
               <div style={{textAlign:'left'}}>
                  <div style={{fontSize:'28px', fontWeight:'800', color:BRAND_COLOR}}>BAND</div>
                  <div style={{fontSize:'14px', fontWeight:'700', color:'#94a3b8', marginTop:'-5px'}}>MOCK SCORE</div>
               </div>
            </div>

            <p style={{fontSize:'22px', fontWeight:'800', color:'#475569', maxWidth:'500px', margin:'10px auto 40px auto'}}>
              Simulation Result: <span style={{color:BRAND_COLOR}}>Neural Expert Path</span>
            </p>

            <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'20px', borderTop:'1px solid #f1f5f9', paddingTop:'40px'}}>
               {['listening', 'reading', 'writing', 'speaking'].map(s => (
                 <div key={s} style={{textAlign:'center'}}>
                    <p style={{margin:0, fontSize:'10px', fontWeight:'900', textTransform:'uppercase', color:'#94a3b8', letterSpacing:'1px'}}>{s}</p>
                    <p style={{margin:'5px 0 0 0', fontSize:'28px', fontWeight:'900', color:'#1e293b'}}>{results[s]}</p>
                 </div>
               ))}
            </div>
          </motion.div>
        </div>

        <div style={S.bentoGrid}>
          {['listening', 'reading', 'writing', 'speaking'].map(section => (
            <div 
              key={section} 
              onClick={() => setSelectedSection(section)}
              style={S.miniCard(selectedSection === section)}
            >
              <p style={{margin:0, fontSize:'10px', fontWeight:'900', textTransform:'uppercase', color: selectedSection === section ? 'rgba(255,255,255,0.7)' : '#94a3b8'}}>{section}</p>
              <h3 style={{margin:'5px 0', fontSize:'24px', fontWeight:'900', color: selectedSection === section ? '#fff' : '#1e293b'}}>{results[section]}</h3>
              <ChevronRight size={14} color={selectedSection === section ? '#fff' : '#cbd5e1'} />
            </div>
          ))}
        </div>

        <div style={{background:'#fff', borderRadius:'40px', padding:'40px', border:'1px solid #f1f5f9', boxShadow:'0 10px 40px rgba(0,0,0,0.02)'}}>
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px'}}>
               <Zap color={BRAND_COLOR} fill={BRAND_COLOR} size={20}/>
               <h3 style={{margin:0, fontSize:'18px', fontWeight:'900', color:'#0f172a'}}>Mock Path Recommendations</h3>
            </div>
            <div style={{background:'#f8fafc', padding:'25px', borderRadius:'22px', border:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:'20px'}}>
               <div style={{background:BRAND_COLOR, padding:'12px', borderRadius:'14px'}}><Target color="#fff" size={20}/></div>
               <p style={{margin:0, fontWeight:'700', color:'#475569', fontSize:'15px'}}>Based on your {selectedSection} mock results, focus on advanced lexical resource metrics.</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ResultsDashboard;