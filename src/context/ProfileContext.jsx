import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { DEFAULT_PROFILES } from '../utils/mockData';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [activeProfileId, setActiveProfileId] = useState('');
  
  // Auth state parameters
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('tapqr_jwt_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync token to localStorage and update Axios interceptor reference
  useEffect(() => {
    if (token) {
      localStorage.setItem('tapqr_jwt_token', token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('tapqr_jwt_token');
      setIsAuthenticated(false);
      setUser(null);
      setProfiles([]);
      setCurrentProfile(null);
      setActiveProfileId('');
    }
  }, [token]);

  // Load authenticated user info and profiles from database
  const loadUserData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch current user
      const userRes = await api.get('/auth/me');
      setUser(userRes.data.user);
      setIsAuthenticated(true);

      // 2. Fetch user's profiles
      const profileRes = await api.get('/profile');
      let userProfiles = profileRes.data.data;

      // 3. If new user with no profiles, automatically initialize default template profile
      if (userProfiles.length === 0) {
        const defaultTemplate = DEFAULT_PROFILES[0];
        const userSlug = userRes.data.user.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(1000 + Math.random() * 9000);
        
        const createRes = await api.post('/profile', {
          ...defaultTemplate,
          id: undefined, // remove front-end id to let MongoDB generate it
          slug: userSlug,
          name: userRes.data.user.name,
          email: userRes.data.user.email,
        });
        userProfiles = [createRes.data.data];
      }

      setProfiles(userProfiles);
      
      // Select the first profile as active by default
      if (userProfiles.length > 0) {
        const activeId = userProfiles[0]._id;
        setActiveProfileId(activeId);
        setCurrentProfile(userProfiles[0]);
      }
    } catch (err) {
      console.error('Failed to load user session data from API:', err);
      // Clean up invalid/expired token
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Update current profile whenever active profile ID or profiles array changes
  useEffect(() => {
    if (activeProfileId && profiles.length > 0) {
      const active = profiles.find(p => p._id === activeProfileId);
      if (active) {
        setCurrentProfile(active);
      }
    }
  }, [activeProfileId, profiles]);

  // 1. User Registration Action
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // 2. User Login Action
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Invalid email or password';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // 3. User Logout Action
  const logout = () => {
    setToken(null);
  };

  // 4. Create Profile
  const addProfile = useCallback(async (newProfile) => {
    setError(null);
    try {
      const res = await api.post('/profile', newProfile);
      const created = res.data.data;
      setProfiles((prev) => [...prev, created]);
      setActiveProfileId(created._id);
      return created;
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to create profile card';
      setError(errMsg);
      throw new Error(errMsg);
    }
  }, []);

  // 5. Update Profile details in Database
  const updateProfile = useCallback(async (id, updatedFields) => {
    setError(null);
    try {
      // Map frontend keys properly (e.g. businessName to name, etc. is handled in schema)
      const res = await api.put(`/profile/${id}`, updatedFields);
      const updated = res.data.data;
      setProfiles((prev) =>
        prev.map((prof) => (prof._id === id ? updated : prof))
      );
      return updated;
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to save changes';
      setError(errMsg);
      throw new Error(errMsg);
    }
  }, []);

  // 6. Delete Profile card
  const deleteProfile = useCallback(async (id) => {
    setError(null);
    try {
      await api.delete(`/profile/${id}`);
      setProfiles((prev) => {
        const updated = prev.filter((prof) => prof._id !== id);
        if (activeProfileId === id && updated.length > 0) {
          setActiveProfileId(updated[0]._id);
        }
        return updated;
      });
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to delete profile';
      setError(errMsg);
      throw new Error(errMsg);
    }
  }, [activeProfileId]);

  // Keep stable reference getProfile (used by private dashboard check, public view uses direct fetch)
  const getProfile = useCallback((id) => {
    return profiles.find((prof) => prof._id === id || prof.slug === id) || null;
  }, [profiles]);

  // Reset Console callback
  const resetToDefaults = useCallback(async () => {
    if (!currentProfile) return;
    try {
      const defaultTemplate = DEFAULT_PROFILES[0];
      await updateProfile(currentProfile._id, {
        ...defaultTemplate,
        id: undefined,
        slug: currentProfile.slug,
        name: user?.name || defaultTemplate.name,
        email: user?.email || defaultTemplate.email,
      });
    } catch (err) {
      console.error('Failed to reset console profiles:', err);
    }
  }, [currentProfile, updateProfile, user]);

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
        resetToDefaults,
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
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
