import { useState, useEffect, useCallback } from 'react';
import { testService } from '../services/testService';
import { useProgressTracking } from './useProgressTracking';
import { useGamification } from './useGamification';
import { useOfflineSync } from './useOfflineSync';

export const useTest = (testId) => {
  const [test, setTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testStatus, setTestStatus] = useState('idle'); // 'idle', 'loading', 'in_progress', 'paused', 'completed', 'submitted'
  const [error, setError] = useState(null);
  
  const { trackScore, trackExerciseCompletion } = useProgressTracking();
  const { awardPoints } = useGamification();
  const { saveOffline, isOnline } = useOfflineSync();

  useEffect(() => {
    if (testId) {
      loadTest(testId);
    }
  }, [testId]);

  const loadTest = async (id) => {
    setTestStatus('loading');
    setError(null);
    
    try {
      const testData = await testService.getTest(id);
      setTest(testData);
      setTimeRemaining(testData.duration * 60); // Convert to seconds
      setTestStatus('idle');
    } catch (error) {
      setError(error.message);
      setTestStatus('idle');
    }
  };

  const startTest = useCallback(() => {
    if (!test) return;
    
    setTestStatus('in_progress');
    setCurrentQuestion(0);
    setAnswers({});
    
    // Start timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          autoSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [test]);

  const pauseTest = useCallback(() => {
    setTestStatus('paused');
  }, []);

  const resumeTest = useCallback(() => {
    setTestStatus('in_progress');
  }, []);

  const goToQuestion = useCallback((questionIndex) => {
    if (questionIndex >= 0 && questionIndex < test.questions.length) {
      setCurrentQuestion(questionIndex);
    }
  }, [test]);

  const goToNextQuestion = useCallback(() => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  }, [currentQuestion, test]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  }, [currentQuestion]);

  const answerQuestion = useCallback((questionId, answer, questionIndex = null) => {
    const index = questionIndex !== null ? questionIndex : currentQuestion;
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        answer,
        timestamp: new Date().toISOString(),
        timeSpent: prev[questionId]?.timeSpent || 0
      }
    }));

    // Auto-save progress
    saveOffline(`test_${testId}_progress`, {
      testId,
      answers: { ...answers, [questionId]: answer },
      currentQuestion: index,
      timeRemaining
    }, 'SYNC_TEST_PROGRESS');
  }, [testId, currentQuestion, answers, timeRemaining, saveOffline]);

  const markForReview = useCallback((questionId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        markedForReview: true
      }
    }));
  }, []);

  const autoSubmitTest = useCallback(async () => {
    if (testStatus !== 'in_progress') return;
    
    setTestStatus('submitted');
    await submitTest();
  }, [testStatus]);

  const submitTest = async () => {
    if (testStatus !== 'in_progress' && testStatus !== 'paused') return;
    
    setTestStatus('submitting');
    setError(null);
    
    try {
      const submissionData = {
        testId: test.id,
        answers,
        timeSpent: test.duration * 60 - timeRemaining,
        completedAt: new Date().toISOString()
      };

      let result;
      
      if (isOnline) {
        result = await testService.submitTest(submissionData);
      } else {
        // Save offline for later sync
        await saveOffline(`test_${test.id}_submission`, submissionData, 'SYNC_TEST_SUBMISSION');
        result = await testService.evaluateOffline(submissionData);
      }

      // Track progress and award points
      await trackScore(test.section, result.overallScore, test.id);
      await trackExerciseCompletion({
        id: test.id,
        type: 'mock_test',
        duration: submissionData.timeSpent,
        score: result.overallScore
      });

      // Award points based on performance
      const points = Math.round(result.overallScore * 10);
      awardPoints('high_score', result.overallScore / 9.0);

      setTestStatus('completed');
      
      return {
        success: true,
        result,
        pointsEarned: points
      };
    } catch (error) {
      setError(error.message);
      setTestStatus('in_progress');
      
      return {
        success: false,
        error: error.message
      };
    }
  };

  const getTestProgress = useCallback(() => {
    if (!test) return 0;
    
    const answeredCount = Object.keys(answers).length;
    return (answeredCount / test.questions.length) * 100;
  }, [test, answers]);

  const getAnsweredQuestions = useCallback(() => {
    return Object.keys(answers).length;
  }, [answers]);

  const getMarkedForReview = useCallback(() => {
    return Object.values(answers).filter(answer => answer.markedForReview).length;
  }, [answers]);

  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getSectionTimeLimit = useCallback((section) => {
    const timeLimits = {
      listening: 30 * 60, // 30 minutes
      reading: 60 * 60,   // 60 minutes
      writing: 60 * 60,   // 60 minutes
      speaking: 15 * 60   // 15 minutes
    };
    
    return timeLimits[section] || 60 * 60;
  }, []);

  const getCurrentSection = useCallback(() => {
    if (!test) return null;
    
    return test.section;
  }, [test]);

  const isLastQuestion = useCallback(() => {
    return currentQuestion === test.questions.length - 1;
  }, [currentQuestion, test]);

  const isFirstQuestion = useCallback(() => {
    return currentQuestion === 0;
  }, [currentQuestion]);

  return {
    // State
    test,
    currentQuestion,
    answers,
    timeRemaining: formatTime(timeRemaining),
    testStatus,
    error,
    
    // Actions
    startTest,
    pauseTest,
    resumeTest,
    goToQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    answerQuestion,
    markForReview,
    submitTest,
    
    // Getters
    getTestProgress,
    getAnsweredQuestions,
    getMarkedForReview,
    getCurrentSection,
    isLastQuestion,
    isFirstQuestion,
    
    // Current question details
    currentQuestionData: test?.questions[currentQuestion] || null,
    totalQuestions: test?.questions.length || 0,
    currentAnswer: answers[test?.questions[currentQuestion]?.id]
  };
};