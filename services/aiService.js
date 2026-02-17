import { API_ENDPOINTS } from '../utils/constants';

class AIService {
  constructor() {
    this.baseURL = process.env.REACT_APP_AI_API_URL || 'https://api.exampulse.com/ai';
  }

  async evaluateWriting(text, question, criteria = null) {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.WRITING_EVALUATION}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          question,
          criteria: criteria || {
            task_achievement: true,
            coherence_cohesion: true,
            lexical_resource: true,
            grammatical_range: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.status}`);
      }

      const result = await response.json();
      return this.formatWritingEvaluation(result);
    } catch (error) {
      console.error('Writing evaluation failed:', error);
      throw error;
    }
  }

  async evaluateSpeaking(audioBlob, question) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('question', question);

      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.SPEAKING_EVALUATION}`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.status}`);
      }

      const result = await response.json();
      return this.formatSpeakingEvaluation(result);
    } catch (error) {
      console.error('Speaking evaluation failed:', error);
      throw error;
    }
  }

  async getVocabularySuggestions(text, level = 'academic') {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.VOCABULARY_HELPER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          level,
          max_suggestions: 10
        })
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Vocabulary suggestions failed:', error);
      throw error;
    }
  }

  async generatePracticeQuestions(section, difficulty, topic = null) {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.PRACTICE_QUESTIONS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section,
          difficulty,
          topic,
          count: 5
        })
      });

      if (!response.ok) {
        throw new Error(`AI service error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Practice questions generation failed:', error);
      throw error;
    }
  }

  formatWritingEvaluation(rawResult) {
    return {
      overallScore: rawResult.overall_score,
      bandScores: {
        taskAchievement: rawResult.criteria_scores?.task_achievement || 0,
        coherenceCohesion: rawResult.criteria_scores?.coherence_cohesion || 0,
        lexicalResource: rawResult.criteria_scores?.lexical_resource || 0,
        grammaticalRange: rawResult.criteria_scores?.grammatical_range || 0
      },
      feedback: {
        strengths: rawResult.feedback?.strengths || [],
        improvements: rawResult.feedback?.improvements || [],
        suggestions: rawResult.feedback?.suggestions || []
      },
      correctedText: rawResult.corrected_text,
      vocabularySuggestions: rawResult.vocabulary_suggestions || []
    };
  }

  formatSpeakingEvaluation(rawResult) {
    return {
      overallScore: rawResult.overall_score,
      criteriaScores: {
        fluency: rawResult.fluency_score || 0,
        pronunciation: rawResult.pronunciation_score || 0,
        vocabulary: rawResult.vocabulary_score || 0,
        grammar: rawResult.grammar_score || 0
      },
      transcription: rawResult.transcription,
      feedback: rawResult.feedback || [],
      wordTimings: rawResult.word_timings || []
    };
  }
}

export const aiService = new AIService();