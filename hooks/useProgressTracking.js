import { useState, useEffect } from 'react';

export const useProgressTracking = () => {
  const [progress, setProgress] = useState({
    overallScore: 6.5,
    skills: {
      reading: 70,
      writing: 60,
      speaking: 55,
      listening: 75
    },
    streak: 12,
    totalTime: '45h 30m',
    testsCompleted: 24,
    weeklyGoal: 5,
    weeklyProgress: 3
  });

  const [studyHistory, setStudyHistory] = useState([]);

  useEffect(() => {
    // Load progress from localStorage or API
    const savedProgress = localStorage.getItem('ielts-progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }

    // Mock study history
    const mockHistory = [
      { date: '2024-01-15', activity: 'Writing Test', score: 6.5, duration: '60min' },
      { date: '2024-01-14', activity: 'Speaking Practice', score: 7.0, duration: '30min' },
      { date: '2024-01-13', activity: 'Reading Test', score: 7.5, duration: '60min' },
      { date: '2024-01-12', activity: 'Listening Test', score: 8.0, duration: '30min' },
      { date: '2024-01-11', activity: 'Vocabulary', score: null, duration: '20min' }
    ];
    setStudyHistory(mockHistory);
  }, []);

  const updateProgress = (newData) => {
    setProgress(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem('ielts-progress', JSON.stringify(updated));
      return updated;
    });
  };

  const addStudySession = (session) => {
    setStudyHistory(prev => [session, ...prev.slice(0, 49)]); // Keep last 50 sessions
  };

  const calculateWeeklyProgress = () => {
    return (progress.weeklyProgress / progress.weeklyGoal) * 100;
  };

  const getSkillTrend = (skill) => {
    // Mock trend data - in real app, this would come from historical data
    const trends = {
      reading: 'up',
      writing: 'up',
      speaking: 'stable',
      listening: 'up'
    };
    return trends[skill];
  };

  return {
    progress,
    studyHistory,
    updateProgress,
    addStudySession,
    calculateWeeklyProgress,
    getSkillTrend
  };
};