import { useCallback } from 'react';
import { useGamification } from '../contexts/GamificationContext';
import { gamificationUtils } from '../utils/gamification';

export const useGamification = () => {
  const {
    points,
    streak,
    achievements,
    addPoints,
    incrementStreak,
    unlockAchievement,
    purchaseReward
  } = useGamification();

  const awardPoints = useCallback((activity, performance = 1) => {
    const pointsMap = {
      exercise_completed: 10,
      high_score: 25,
      streak_bonus: 50,
      daily_login: 5,
      peer_review: 15,
      study_group: 20
    };
    
    const basePoints = pointsMap[activity] || 0;
    const awardedPoints = Math.floor(basePoints * performance);
    
    addPoints(awardedPoints);
    return awardedPoints;
  }, [addPoints]);

  const checkAchievements = useCallback((userStats) => {
    const newAchievements = gamificationUtils.checkEligibleAchievements(userStats, achievements);
    
    newAchievements.forEach(achievement => {
      unlockAchievement(achievement);
    });
    
    return newAchievements;
  }, [achievements, unlockAchievement]);

  const handleDailyLogin = useCallback(() => {
    incrementStreak();
    awardPoints('daily_login');
    
    // Check for streak achievements
    const streakAchievements = gamificationUtils.getStreakAchievements(streak + 1);
    streakAchievements.forEach(achievement => {
      if (!achievements.find(a => a.id === achievement.id)) {
        unlockAchievement(achievement);
      }
    });
  }, [incrementStreak, awardPoints, streak, achievements, unlockAchievement]);

  const getLevel = useCallback(() => {
    return gamificationUtils.calculateLevel(points);
  }, [points]);

  const getNextLevelPoints = useCallback(() => {
    return gamificationUtils.getNextLevelRequirements(points);
  }, [points]);

  const canPurchase = useCallback((rewardId, availableRewards) => {
    const reward = availableRewards.find(r => r.id === rewardId);
    return reward && points >= reward.cost;
  }, [points]);

  return {
    points,
    streak,
    achievements,
    awardPoints,
    checkAchievements,
    handleDailyLogin,
    getLevel,
    getNextLevelPoints,
    purchaseReward,
    canPurchase
  };
};