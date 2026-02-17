import React, { useState, useEffect } from 'react';

const ProgressCharts = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedSkill, setSelectedSkill] = useState('all');
  
  const progressData = {
    reading: [6.0, 6.5, 7.0, 7.0, 7.5, 7.5, 8.0],
    writing: [5.5, 6.0, 6.0, 6.5, 6.5, 7.0, 7.0],
    speaking: [5.0, 5.5, 6.0, 6.0, 6.5, 6.5, 7.0],
    listening: [6.5, 7.0, 7.0, 7.5, 8.0, 8.0, 8.5]
  };

  const weeklyData = [
    { week: '1-Hafta', reading: 6.0, writing: 5.5, speaking: 5.0, listening: 6.5 },
    { week: '2-Hafta', reading: 6.5, writing: 6.0, speaking: 5.5, listening: 7.0 },
    { week: '3-Hafta', reading: 7.0, writing: 6.0, speaking: 6.0, listening: 7.0 },
    { week: '4-Hafta', reading: 7.0, writing: 6.5, speaking: 6.0, listening: 7.5 },
    { week: '5-Hafta', reading: 7.5, writing: 6.5, speaking: 6.5, listening: 8.0 },
    { week: '6-Hafta', reading: 7.5, writing: 7.0, speaking: 6.5, listening: 8.0 },
    { week: '7-Hafta', reading: 8.0, writing: 7.0, speaking: 7.0, listening: 8.5 }
  ];

  const skillDetails = {
    reading: {
      improvement: '+2.0',
      trend: 'up',
      weakAreas: ['Time Management', 'Complex Texts'],
      strength: ['Skimming', 'Vocabulary']
    },
    writing: {
      improvement: '+1.5', 
      trend: 'up',
      weakAreas: ['Grammar Accuracy', 'Task Response'],
      strength: ['Structure', 'Coherence']
    },
    speaking: {
      improvement: '+2.0',
      trend: 'up',
      weakAreas: ['Fluency', 'Pronunciation'],
      strength: ['Vocabulary', 'Grammar']
    },
    listening: {
      improvement: '+2.0',
      trend: 'up',
      weakAreas: ['Section 4', 'Accents'],
      strength: ['Note-taking', 'Focus']
    }
  };

  const getSkillColor = (skill) => {
    const colors = {
      reading: '#6366F1',
      writing: '#10B981', 
      speaking: '#F59E0B',
      listening: '#EF4444'
    };
    return colors[skill] || '#6B7280';
  };

  const calculateOverallProgress = () => {
    const skills = Object.values(progressData);
    const latestScores = skills.map(skill => skill[skill.length - 1]);
    return (latestScores.reduce((a, b) => a + b, 0) / latestScores.length).toFixed(1);
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️';
  };

  return (
    <div className="progress-charts">
      <div className="analytics-header">
        <div className="header-content">
          <h2>📈 Progress Tahlillari</h2>
          <p>IELTS tayyorgarligingizni batafsil kuzatib boring</p>
        </div>
        
        <div className="controls">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-selector"
          >
            <option value="week">1 Hafta</option>
            <option value="month">1 Oy</option>
            <option value="quarter">3 Oy</option>
            <option value="year">1 Yil</option>
          </select>
          
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="skill-selector"
          >
            <option value="all">Barcha Ko'nikmalar</option>
            <option value="reading">O'qish</option>
            <option value="writing">Yozish</option>
            <option value="speaking">Gapirish</option>
            <option value="listening">Eshitish</option>
          </select>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="overview-stats">
        <div className="stat-card main-stat">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{calculateOverallProgress()}/9.0</div>
            <div className="stat-label">Umumiy Ball</div>
            <div className="stat-trend positive">
              <span>+0.5</span>
              <span>📈</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-value">12</div>
            <div className="stat-label">Ketma-ket Kunlar</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-value">45h</div>
            <div className="stat-label">O'qilgan Vaqt</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-value">24</div>
            <div className="stat-label">Testlar</div>
          </div>
        </div>
      </div>

      {/* Progress Charts */}
      <div className="charts-section">
        <div className="main-chart">
          <h3>Ko'nikmalar Rivoji</h3>
          <div className="chart-container">
            <div className="chart-bars">
              {Object.entries(progressData).map(([skill, scores]) => (
                <div key={skill} className="skill-chart">
                  <span className="skill-name" style={{color: getSkillColor(skill)}}>
                    {skill.charAt(0).toUpperCase() + skill.slice(1)}
                  </span>
                  <div className="score-bars">
                    {scores.map((score, index) => (
                      <div 
                        key={index}
                        className="score-bar"
                        style={{
                          height: `${(score / 9) * 100}%`,
                          backgroundColor: getSkillColor(skill)
                        }}
                        title={`Hafta ${index + 1}: ${score}`}
                      >
                        <div className="score-tooltip">{score}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Breakdown */}
        <div className="skill-breakdown">
          <h3>Ko'nikma Tahlillari</h3>
          <div className="skills-grid">
            {Object.entries(skillDetails).map(([skill, details]) => (
              <div key={skill} className="skill-card">
                <div className="skill-header">
                  <h4 style={{color: getSkillColor(skill)}}>
                    {skill.charAt(0).toUpperCase() + skill.slice(1)}
                  </h4>
                  <div className="skill-score">
                    {progressData[skill][progressData[skill].length - 1]}/9.0
                  </div>
                </div>
                
                <div className="skill-improvement">
                  <span className={`trend ${details.trend}`}>
                    {getTrendIcon(details.trend)} {details.improvement}
                  </span>
                </div>
                
                <div className="skill-details">
                  <div className="weak-areas">
                    <h5>Zaif Tomonlar:</h5>
                    <ul>
                      {details.weakAreas.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="strengths">
                    <h5>Kuchli Tomonlar:</h5>
                    <ul>
                      {details.strength.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <button className="improve-btn">
                  Takomillashtirish
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Progress Table */}
      <div className="progress-table">
        <h3>Haftalik Progress</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Hafta</th>
                <th>📖 O'qish</th>
                <th>✍️ Yozish</th>
                <th>🎤 Gapirish</th>
                <th>👂 Eshitish</th>
                <th>📊 O'rtacha</th>
              </tr>
            </thead>
            <tbody>
              {weeklyData.map((week, index) => (
                <tr key={index}>
                  <td className="week-label">{week.week}</td>
                  <td>
                    <span className="score" style={{color: getSkillColor('reading')}}>
                      {week.reading}
                    </span>
                  </td>
                  <td>
                    <span className="score" style={{color: getSkillColor('writing')}}>
                      {week.writing}
                    </span>
                  </td>
                  <td>
                    <span className="score" style={{color: getSkillColor('speaking')}}>
                      {week.speaking}
                    </span>
                  </td>
                  <td>
                    <span className="score" style={{color: getSkillColor('listening')}}>
                      {week.listening}
                    </span>
                  </td>
                  <td>
                    <span className="average-score">
                      {((week.reading + week.writing + week.speaking + week.listening) / 4).toFixed(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="ai-recommendations">
        <h3>🤖 AI Takliflari</h3>
        <div className="recommendations-grid">
          <div className="recommendation-card">
            <div className="rec-icon">🎯</div>
            <div className="rec-content">
              <h4>Writing ko'nikmasini oshirish</h4>
              <p>Complex sentence structures va academic vocabulary ustida ishlashingiz kerak</p>
              <div className="rec-actions">
                <button className="action-btn">Mashq boshlash</button>
                <button className="action-btn outline">Batafsil</button>
              </div>
            </div>
          </div>
          
          <div className="recommendation-card">
            <div className="rec-icon">⏰</div>
            <div className="rec-content">
              <h4>Vaqt boshqaruv</h4>
              <p>Reading testda tezroq o'qish uchun maxsus mashqlar</p>
              <div className="rec-actions">
                <button className="action-btn">Mashq boshlash</button>
                <button className="action-btn outline">Batafsil</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCharts;