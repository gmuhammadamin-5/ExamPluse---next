import { API_ENDPOINTS } from '../utils/constants';

class AnalyticsService {
  constructor() {
    this.baseURL = process.env.REACT_APP_ANALYTICS_API_URL || 'https://api.exampulse.com/analytics';
    this.queue = [];
    this.flushing = false;
  }

  async trackScore(section, score, exerciseId = null) {
    const event = {
      type: 'SCORE_TRACKING',
      timestamp: new Date().toISOString(),
      data: {
        section,
        score,
        exerciseId,
        userId: this.getUserId()
      }
    };

    this.queue.push(event);
    await this.flushQueue();
  }

  async trackExerciseCompletion(exercise) {
    const event = {
      type: 'EXERCISE_COMPLETION',
      timestamp: new Date().toISOString(),
      data: {
        exerciseId: exercise.id,
        type: exercise.type,
        duration: exercise.duration,
        score: exercise.score,
        userId: this.getUserId()
      }
    };

    this.queue.push(event);
    await this.flushQueue();
  }

  async trackStudyTime(duration, activity) {
    const event = {
      type: 'STUDY_TIME',
      timestamp: new Date().toISOString(),
      data: {
        duration,
        activity,
        userId: this.getUserId()
      }
    };

    this.queue.push(event);
    await this.flushQueue();
  }

  async trackUserAction(action, metadata = {}) {
    const event = {
      type: 'USER_ACTION',
      timestamp: new Date().toISOString(),
      data: {
        action,
        ...metadata,
        userId: this.getUserId()
      }
    };

    this.queue.push(event);
    await this.flushQueue();
  }

  async getProgressAnalytics(userId, period = '30d') {
    try {
      const response = await fetch(
        `${this.baseURL}${API_ENDPOINTS.PROGRESS_ANALYTICS}?userId=${userId}&period=${period}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch progress analytics:', error);
      throw error;
    }
  }

  async getWeaknessAnalysis(userId) {
    try {
      const response = await fetch(
        `${this.baseURL}${API_ENDPOINTS.WEAKNESS_ANALYSIS}?userId=${userId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch weakness analysis:', error);
      throw error;
    }
  }

  async getStudyPatterns(userId) {
    try {
      const response = await fetch(
        `${this.baseURL}${API_ENDPOINTS.STUDY_PATTERNS}?userId=${userId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch study patterns:', error);
      throw error;
    }
  }

  async flushQueue() {
    if (this.flushing || this.queue.length === 0) return;

    this.flushing = true;

    try {
      const eventsToSend = [...this.queue];
      this.queue = [];

      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.BATCH_TRACKING}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: eventsToSend })
      });

      if (!response.ok) {
        // Requeue failed events
        this.queue.unshift(...eventsToSend);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to flush analytics queue:', error);
      // Requeue failed events
      this.queue.unshift(...eventsToSend);
    } finally {
      this.flushing = false;
    }
  }

  getUserId() {
    // This would typically get from auth context or localStorage
    return localStorage.getItem('userId') || 'anonymous';
  }
}

export const analyticsService = new AnalyticsService();