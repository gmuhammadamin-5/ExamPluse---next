import { API_ENDPOINTS } from '../utils/constants';

class CollaborationService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.baseURL = process.env.REACT_APP_COLLAB_API_URL || 'https://api.exampulse.com/collab';
  }

  connect() {
    // WebSocket connection implementation
    this.socket = new WebSocket(process.env.REACT_APP_WS_URL || 'wss://ws.exampulse.com');
    
    this.socket.onopen = () => {
      this.emit('connected');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.emit(data.type, data.payload);
    };

    this.socket.onclose = () => {
      this.emit('disconnected');
    };
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  async joinSession(sessionId) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'JOIN_SESSION',
        payload: { sessionId }
      }));
    }
    
    // Also update via HTTP API
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.JOIN_SESSION}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId })
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to join session:', error);
      throw error;
    }
  }

  async leaveSession(sessionId) {
    if (this.socket) {
      this.socket.send(JSON.stringify({
        type: 'LEAVE_SESSION',
        payload: { sessionId }
      }));
    }
  }

  async sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'SEND_MESSAGE',
        payload: message
      }));
    }
  }

  async createStudyGroup(groupData) {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.STUDY_GROUPS}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create study group:', error);
      throw error;
    }
  }

  async getStudyGroups(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.STUDY_GROUPS}?${queryParams}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch study groups:', error);
      throw error;
    }
  }

  async startPeerReview(documentId, reviewers) {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.PEER_REVIEW}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          reviewers
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to start peer review:', error);
      throw error;
    }
  }

  async submitReview(reviewId, feedback, scores) {
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.SUBMIT_REVIEW}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          feedback,
          scores
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to submit review:', error);
      throw error;
    }
  }

  async startScreenShare(sessionId) {
    try {
      // Implementation for screen sharing
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      return stream;
    } catch (error) {
      console.error('Screen share failed:', error);
      throw error;
    }
  }
}

export const collaborationService = new CollaborationService();