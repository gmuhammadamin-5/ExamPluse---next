import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{textAlign: 'center', padding: '100px 20px'}}>
      <h1 style={{fontSize: '40px', color: '#1e293b'}}>404 - Sahifa topilmadi</h1>
      <p style={{color: '#64748b'}}>Uzr, siz qidirgan sahifa mavjud emas.</p>
      <Link href="/" style={{color: '#3b82f6', fontWeight: 'bold', marginTop: '20px', display: 'inline-block'}}>
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
}