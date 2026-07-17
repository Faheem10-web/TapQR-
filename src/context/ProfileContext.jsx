import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_PROFILES } from '../utils/mockData';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem('tapqr_profiles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse local profiles, resetting to default', e);
      }
    }
    return DEFAULT_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState(() => {
    return profiles.length > 0 ? profiles[0].id : '';
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('tapqr_profiles', JSON.stringify(profiles));
  }, [profiles]);

  const addProfile = (newProfile) => {
    const profileWithId = {
      ...newProfile,
      id: newProfile.id || `profile-${Date.now()}`
    };
    setProfiles((prev) => [...prev, profileWithId]);
    setActiveProfileId(profileWithId.id);
    return profileWithId;
  };

  const updateProfile = (id, updatedFields) => {
    setProfiles((prev) =>
      prev.map((prof) => (prof.id === id ? { ...prof, ...updatedFields } : prof))
    );
  };

  const deleteProfile = (id) => {
    const updated = profiles.filter((prof) => prof.id !== id);
    setProfiles(updated);
    if (activeProfileId === id && updated.length > 0) {
      setActiveProfileId(updated[0].id);
    }
  };

  const getProfile = (id) => {
    return profiles.find((prof) => prof.id === id);
  };

  const resetToDefaults = () => {
    setProfiles(DEFAULT_PROFILES);
    setActiveProfileId(DEFAULT_PROFILES[0].id);
  };

  const currentProfile = profiles.find((prof) => prof.id === activeProfileId) || profiles[0];

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        currentProfile,
        activeProfileId,
        setActiveProfileId,
        addProfile,
        updateProfile,
        deleteProfile,
        getProfile,
        resetToDefaults
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfiles = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfiles must be used within a ProfileProvider');
  }
  return context;
};
