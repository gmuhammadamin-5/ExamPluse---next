import { useState, useEffect, useCallback } from 'react';
import { collaborationService } from '../services/collaborationService';

export const useRealTimeCollab = (sessionId) => {
  const [connected, setConnected] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (sessionId) {
      collaborationService.joinSession(sessionId);
      setConnected(true);

      collaborationService.onMessage((message) => {
        setMessages(prev => [...prev, message]);
      });

      collaborationService.onParticipantsUpdate((users) => {
        setParticipants(users);
      });

      collaborationService.onActiveUsersUpdate((users) => {
        setActiveUsers(users);
      });

      return () => {
        collaborationService.leaveSession(sessionId);
        setConnected(false);
      };
    }
  }, [sessionId]);

  const sendMessage = useCallback((content, type = 'text') => {
    if (!sessionId) return;
    
    const message = {
      id: Date.now().toString(),
      sessionId,
      content,
      type,
      timestamp: new Date().toISOString(),
      sender: 'current-user' // This would be replaced with actual user ID
    };
    
    collaborationService.sendMessage(message);
  }, [sessionId]);

  const startPeerReview = useCallback((documentId, reviewers) => {
    return collaborationService.startPeerReview(documentId, reviewers);
  }, []);

  const submitReview = useCallback((reviewId, feedback, scores) => {
    return collaborationService.submitReview(reviewId, feedback, scores);
  }, []);

  const shareScreen = useCallback(() => {
    return collaborationService.startScreenShare(sessionId);
  }, [sessionId]);

  return {
    connected,
    participants,
    messages,
    activeUsers,
    sendMessage,
    startPeerReview,
    submitReview,
    shareScreen
  };
};