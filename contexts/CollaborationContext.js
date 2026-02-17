import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CollaborationContext = createContext();

const collaborationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STUDY_GROUPS':
      return { ...state, studyGroups: action.payload };
    case 'ADD_STUDY_GROUP':
      return { ...state, studyGroups: [...state.studyGroups, action.payload] };
    case 'SET_LIVE_SESSIONS':
      return { ...state, liveSessions: action.payload };
    case 'JOIN_SESSION':
      return { ...state, activeSession: action.payload };
    case 'SET_GROUP_CHAT':
      return { ...state, groupChats: action.payload };
    case 'SEND_MESSAGE':
      return {
        ...state,
        groupChats: state.groupChats.map(chat => 
          chat.id === action.payload.chatId 
            ? { ...chat, messages: [...chat.messages, action.payload.message] }
            : chat
        )
      };
    case 'SET_PEER_REVIEWS':
      return { ...state, peerReviews: action.payload };
    default:
      return state;
  }
};

const initialState = {
  studyGroups: [],
  liveSessions: [],
  activeSession: null,
  groupChats: [],
  peerReviews: []
};

export const CollaborationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(collaborationReducer, initialState);

  const createStudyGroup = (groupData) => {
    const newGroup = {
      id: Date.now().toString(),
      ...groupData,
      members: [groupData.creator],
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_STUDY_GROUP', payload: newGroup });
  };

  const joinStudyGroup = (groupId, user) => {
    dispatch({
      type: 'SET_STUDY_GROUPS',
      payload: state.studyGroups.map(group =>
        group.id === groupId
          ? { ...group, members: [...group.members, user] }
          : group
      )
    });
  };

  const sendChatMessage = (chatId, message) => {
    dispatch({
      type: 'SEND_MESSAGE',
      payload: { chatId, message }
    });
  };

  const value = {
    ...state,
    createStudyGroup,
    joinStudyGroup,
    sendChatMessage,
    dispatch
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within CollaborationProvider');
  }
  return context;
};