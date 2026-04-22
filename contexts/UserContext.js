"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [profile, setProfile] = useState({
    firstName: 'Muhammadali',
    lastName: "G'aniyev",
    username: 'muhammadali_g',
    email: 'muhammadali@gmail.com',
    country: "O'zbekiston",
    targetBand: '7.5',
    examType: 'IELTS',
    bio: 'IELTS ga tayyorlanayapman 🎯',
    avatar: null, // base64 yoki null
  });

  // localStorage dan yuklash
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ep_profile');
      if (saved) setProfile(JSON.parse(saved));
    } catch {}
  }, []);

  const updateProfile = (data) => {
    setProfile(prev => {
      const next = { ...prev, ...data };
      try { localStorage.setItem('ep_profile', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const updateAvatar = (base64) => updateProfile({ avatar: base64 });

  // avatar initials
  const initials = `${profile.firstName?.[0]||''}${profile.lastName?.[0]||''}`.toUpperCase() || 'ME';

  return (
    <UserContext.Provider value={{ profile, updateProfile, updateAvatar, initials }}>
      {children}
    </UserContext.Provider>
  );
}