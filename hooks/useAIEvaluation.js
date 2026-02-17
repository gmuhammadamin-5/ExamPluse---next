import { useState, useCallback } from 'react';
import { aiService } from '../services/aiService';

export const useAIEvaluation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const evaluateWriting = useCallback(async (text, question) => {
    setLoading(true);
    setError(null);
    
    try {
      const evaluation = await aiService.evaluateWriting(text, question);
      setResults(evaluation);
      return evaluation;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const evaluateSpeaking = useCallback(async (audioBlob, question) => {
    setLoading(true);
    setError(null);
    
    try {
      const evaluation = await aiService.evaluateSpeaking(audioBlob, question);
      setResults(evaluation);
      return evaluation;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getVocabularySuggestions = useCallback(async (text, level = 'academic') => {
    setLoading(true);
    setError(null);
    
    try {
      const suggestions = await aiService.getVocabularySuggestions(text, level);
      return suggestions;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    results,
    evaluateWriting,
    evaluateSpeaking,
    getVocabularySuggestions,
    clearResults
  };
};