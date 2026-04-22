"use client";
import React, { createContext, useContext, useReducer } from 'react';

const ProgressContext = createContext();

const progressReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_SCORE':
      const { section, score } = action.payload;
      return {
        ...state,
        scores: {
          ...state.scores,
          [section]: [...(state.scores[section] || []), score]
        },
        lastUpdated: new Date().toISOString()
      };
    case 'SET_GOAL':
      return {
        ...state,
        goals: {
          ...state.goals,
          [action.payload.section]: action.payload.target
        }
      };
    case 'UPDATE_WEAKNESS':
      return {
        ...state,
        weaknesses: action.payload
      };
    case 'COMPLETE_EXERCISE':
      return {
        ...state,
        completedExercises: [...state.completedExercises, action.payload],
        totalTimeSpent: state.totalTimeSpent + (action.payload.timeSpent || 0)
      };
    default:
      return state;
  }
};

const initialState = {
  scores: {
    listening: [],
    reading: [],
    writing: [],
    speaking: []
  },
  goals: {
    listening: 7.0,
    reading: 7.0,
    writing: 6.5,
    speaking: 6.5
  },
  weaknesses: {},
  completedExercises: [],
  totalTimeSpent: 0, // seconds
  lastUpdated: null
};

export const ProgressProvider = ({ children }) => {
  const [state, dispatch] = useReducer(progressReducer, initialState);

  const updateScore = (section, score) => {
    dispatch({
      type: 'UPDATE_SCORE',
      payload: { section, score }
    });
  };

  const setGoal = (section, target) => {
    dispatch({
      type: 'SET_GOAL',
      payload: { section, target }
    });
  };

  const completeExercise = (exercise) => {
    dispatch({
      type: 'COMPLETE_EXERCISE',
      payload: exercise
    });
  };

  const calculateProgress = (section) => {
    const sectionScores = state.scores[section] || [];
    if (sectionScores.length === 0) return 0;
    
    const latestScore = sectionScores[sectionScores.length - 1];
    const targetScore = state.goals[section] || 7.0;
    
    return Math.min((latestScore / targetScore) * 100, 100);
  };

  const identifyWeaknesses = () => {
    const weaknesses = {};
    Object.keys(state.scores).forEach(section => {
      const scores = state.scores[section];
      if (scores.length > 0) {
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        const target = state.goals[section];
        if (avgScore < target) {
          weaknesses[section] = {
            average: avgScore,
            target: target,
            gap: target - avgScore
          };
        }
      }
    });
    return weaknesses;
  };

  const value = {
    ...state,
    updateScore,
    setGoal,
    completeExercise,
    calculateProgress,
    identifyWeaknesses
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
};