import React, { useState } from 'react';

const ExamCreator = () => {
  const [examData, setExamData] = useState({ title: '', type: 'Reading', content: '' });

  const handleSave = async () => {
    // API ga ma'lumot yuborish qismi (Backend tayyor bo'lganda)
    console.log("Bazaga saqlanmoqda:", examData);
    alert("Test saqlandi!");
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2>📝 Yangi Mock Test Yaratish</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '600px' }}>
        <input 
          placeholder="Test Sarlavhasi (masalan: IELTS Mock #5)" 
          onChange={(e) => setExamData({...examData, title: e.target.value})}
          style={styles.input}
        />
        <select onChange={(e) => setExamData({...examData, type: e.target.value})} style={styles.input}>
          <option value="Reading">Reading</option>
          <option value="Listening">Listening</option>
        </select>
        <textarea 
          placeholder="Matn yoki Savollarni kiriting (JSON formatida)" 
          rows="10"
          onChange={(e) => setExamData({...examData, content: e.target.value})}
          style={styles.input}
        />
        <button onClick={handleSave} style={styles.btn}>Bazaga Saqlash</button>
      </div>
    </div>
  );
};

const styles = {
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #ddd' },
  btn: { padding: '15px', backgroundColor: '#1e293b', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }
};

export default ExamCreator;