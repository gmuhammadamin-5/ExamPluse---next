export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f8ff 0%, #e6f7ff 50%, #d6f0ff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    }}>
      <div style={{ textAlign:'center' }}>
        {/* animated logo */}
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, fontWeight: 900, color: '#fff',
          margin: '0 auto 20px',
          animation: 'pulse .9s ease-in-out infinite alternate',
          boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
        }}>EP</div>

        {/* dots */}
        <div style={{ display:'flex', gap: 6, justifyContent:'center', marginBottom: 16 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius:'50%',
              background: '#2563eb',
              animation: `bounce .8s ease-in-out ${i * .15}s infinite alternate`,
            }}/>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>Loading...</div>
      </div>

      <style>{`
        @keyframes pulse {
          from { transform: scale(1);    box-shadow: 0 8px 24px rgba(37,99,235,0.3); }
          to   { transform: scale(1.08); box-shadow: 0 12px 32px rgba(37,99,235,0.45); }
        }
        @keyframes bounce {
          from { transform: translateY(0);   opacity:.4; }
          to   { transform: translateY(-8px); opacity:1; }
        }
      `}</style>
    </div>
  );
}
