"use client";
import React, { createContext, useContext, useReducer } from 'react';

const GamificationContext = createContext();

const gamificationReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_POINTS':
      return {
        ...state,
        points: state.points + action.payload,
        totalPoints: state.totalPoints + action.payload
      };
    case 'INCREMENT_STREAK':
      return {
        ...state,
        streak: state.streak + 1,
        longestStreak: Math.max(state.longestStreak, state.streak + 1)
      };
    case 'RESET_STREAK':
      return { ...state, streak: 0 };
    case 'UNLOCK_ACHIEVEMENT':
      const achievementExists = state.achievements.find(a => a.id === action.payload.id);
      if (!achievementExists) {
        return {
          ...state,
          achievements: [...state.achievements, action.payload],
          points: state.points + action.payload.points
        };
      }
      return state;
    case 'PURCHASE_REWARD':
      const reward = state.availableRewards.find(r => r.id === action.payload);
      if (reward && state.points >= reward.cost) {
        return {
          ...state,
          points: state.points - reward.cost,
          purchasedRewards: [...state.purchasedRewards, reward]
        };
      }
      return state;
    default:
      return state;
  }
};

const initialState = {
  points: 0,
  totalPoints: 0,
  streak: 0,
  longestStreak: 0,
  achievements: [],
  availableRewards: [
    { id: 'premium_week', name: '1 hafta premium', cost: 1000, type: 'subscription' },
    { id: 'avatar', name: 'Maxsus avatar', cost: 500, type: 'cosmetic' },
    { id: 'hint_pack', name: '5 ta hint', cost: 300, type: 'utility' }
  ],
  purchasedRewards: []
};

export const GamificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gamificationReducer, initialState);

  const addPoints = (points) => {
    dispatch({ type: 'ADD_POINTS', payload: points });
  };

  const incrementStreak = () => {
    dispatch({ type: 'INCREMENT_STREAK' });
  };

  const resetStreak = () => {
    dispatch({ type: 'RESET_STREAK' });
  };

  const unlockAchievement = (achievement) => {
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievement });
  };

  const purchaseReward = (rewardId) => {
    dispatch({ type: 'PURCHASE_REWARD', payload: rewardId });
  };

  const value = {
    ...state,
    addPoints,
    incrementStreak,
    resetStreak,
    unlockAchievement,
    purchaseReward
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
};