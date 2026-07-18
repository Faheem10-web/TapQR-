import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useProfiles } from '../context/ProfileContext';
import DeviceMockup from '../components/DeviceMockup';
import QrGenerator from '../components/QrGenerator';
import AnalyticsChart from '../components/AnalyticsChart';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Phone, MapPin, Share2, Eye, RefreshCw, 
  Check, Copy, Clock, Globe, Shield, QrCode, BarChart3,
  Image as ImageIcon
} from 'lucide-react';
import { FaCog, FaQrcode, FaChartBar, FaSlidersH } from 'react-icons/fa';

export default function Dashboard() {
  const { 
    currentProfile, updateProfile, resetToDefaults,
    isAuthenticated, loading, login, register, logout
  } = useProfiles();

  const [activeView, setActiveView] = useState('editor');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(true);
  const [saveState, setSaveState] = useState('idle'); // idle, saving, success

  // Auth Overlay state
  const [authMode, setAuthMode] = useState('login'); // login, register
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [localAuthError, setLocalAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const defaultTheme = {
    primaryColor: '#10B981',
    fontFamily: 'Outfit',
    backgroundColor: '#f4f5f8',
    cardBackgroundColor: '#ffffff',
    buttonBackgroundColor: '#10B981',
    buttonTextColor: '#ffffff',
    iconBackgroundColor: '#10B981',
    iconColor: '#ffffff',
    textColor: '#111827',
    borderRadius: 20,
    shadowStyle: 'Soft',
    glassEffect: true,
    backgroundGradient: true
  };

  // Track the active profile ID to detect actual profile switches
  const activeProfileIdRef = useRef(currentProfile?._id || currentProfile?.id);

  const [draftTheme, setDraftTheme] = useState(() => ({
    ...defaultTheme,
    ...(currentProfile?.theme || {})
  }));

  const [draftProfile, setDraftProfile] = useState(() => {
    const profile = { ...currentProfile };
    profile.socials = profile.socials || {};
    profile.hours = profile.hours || {};
    return profile;
  });

  // Sync draft states when the selected profile changes
  useEffect(() => {
    const currentId = currentProfile?._id || currentProfile?.id;
    if (currentId !== activeProfileIdRef.current) {
      activeProfileIdRef.current = currentId;
      setDraftTheme({
        ...defaultTheme,
        ...(currentProfile?.theme || {})
      });
      setDraftProfile(() => {
        const profile = { ...currentProfile };
        profile.socials = profile.socials || {};
        profile.hours = profile.hours || {};
        return profile;
      });
    }
  }, [currentProfile]);

  // Live preview always reflects the latest draft (not the saved context state)
  const previewProfile = {
    ...draftProfile,
    theme: {
      ...defaultTheme,
      ...(draftProfile?.theme || {}),
      ...draftTheme
    }
  };

  // Unified save handler committing updates to MongoDB
  const handleSaveClick = useCallback(async () => {
    if (!currentProfile) return;
    setSaveState('saving');
    try {
      const targetId = currentProfile._id || currentProfile.id;
      await updateProfile(targetId, {
        ...draftProfile,
        theme: {
          ...defaultTheme,
          ...(draftProfile.theme || {}),
          ...draftTheme
        }
      });
      setSaveState('success');
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to save changes.');
      setSaveState('idle');
    }
  }, [currentProfile, draftProfile, draftTheme, updateProfile]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const updateDraftField = (field, val) => {
    setDraftProfile(prev => ({ ...prev, [field]: val }));
  };

  // Safe nested field update with null-coalescing for socials/hours
  const updateDraftNestedField = (parent, field, val) => {
    setDraftProfile(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] || {}),
        [field]: val
      }
    }));
  };

  // Image Upload handler pushing multipart data to Cloudinary via Express API
  const handleDraftImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const endpoint = field === 'avatar' ? '/upload/logo' : '/upload/banner';
      // Mark as uploading in UI input field
      updateDraftField(field, 'Uploading to Cloudinary...');
      
      const res = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        updateDraftField(field, res.data.url);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Secure image upload failed. Please try again.');
      updateDraftField(field, currentProfile?.[field] || '');
    }
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  // Clean public profile URL referencing the slug field
  const getPublicProfileUrl = (profileSlug) => {
    const origin = window.location.origin;
    const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('192.168.');
    const base = isLocal ? 'https://tap-qr.vercel.app' : origin;
    return `${base}/profile/${profileSlug}`;
  };
  const profileUrl = getPublicProfileUrl(currentProfile?.slug || currentProfile?.id || 'default');

  // Submit handler for Sign In / Sign Up authentication
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLocalAuthError('');
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        const res = await login(authEmail, authPassword);
        if (!res.success) setLocalAuthError(res.error);
      } else {
        const res = await register(authName, authEmail, authPassword);
        if (!res.success) setLocalAuthError(res.error);
      }
    } catch (err) {
      setLocalAuthError('Authentication request failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Shared floating label input style
  const floatInputClass = "floatInputClass";
  const floatInputStyle = {};
  const floatInputFocusStyle = {};

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-neutral-500 tracking-wider">Syncing session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen text-neutral-800 flex items-center justify-center p-4 relative font-sans select-none animate-fade-in" style={{ background: 'var(--bg-primary)' }}>
        <div className="w-full max-w-md glass-card p-8 rounded-[24px] shadow-glass-lg relative z-10 space-y-6">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md" style={{ background: 'var(--accent-primary)' }}>
              <FaQrcode className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-outfit font-black text-xl tracking-tight text-neutral-900 mt-2">
              Welcome to Tap<span className="text-[var(--accent-primary)]">QR</span>
            </h2>
            <p className="text-xs text-neutral-500">Create, customize, and manage your NFC & QR profile cards.</p>
          </div>

          <div className="flex border-b border-neutral-100 pb-1">
            <button 
              onClick={() => { setAuthMode('login'); setLocalAuthError(''); }}
              className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${authMode === 'login' ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-neutral-400 hover:text-neutral-600'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setAuthMode('register'); setLocalAuthError(''); }}
              className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${authMode === 'register' ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-neutral-400 hover:text-neutral-600'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
            {localAuthError && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold rounded-2xl animate-scale-up">
                {localAuthError}
              </div>
            )}

            {authMode === 'register' && (
              <div className="space-y-1">
                <label className="block text-[9px] font-bold text-neutral-450 uppercase tracking-widest px-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="John Doe"
                  className={floatInputClass}
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-neutral-450 uppercase tracking-widest px-1">Email Address</label>
              <input 
                type="email" 
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="john@example.com"
                className={floatInputClass}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-neutral-450 uppercase tracking-widest px-1">Password</label>
              <input 
                type="password" 
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className={floatInputClass}
              />
            </div>

            <button 
              type="submit" 
              disabled={authLoading}
              className="w-full py-3 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] active:scale-[0.98] text-white rounded-2xl text-xs font-bold uppercase tracking-wider duration-150 shadow-md shadow-teal-500/10 cursor-pointer text-center mt-2 disabled:opacity-50"
            >
              {authLoading ? 'Verifying...' : authMode === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-neutral-800 flex flex-col lg:flex-row font-sans relative z-10 bg-[var(--bg-primary)]">
      
      {/* 1. DESKTOP SIDEBAR PANEL */}
      <aside className="hidden lg:flex w-64 glass-sidebar flex-col justify-between p-6 shrink-0 rounded-[24px] z-30 sidebar my-6 ml-6">
        <div className="space-y-8 text-left">
          {/* BRAND */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'var(--accent-primary)' }}>
              <FaQrcode className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-outfit font-extrabold text-lg tracking-tight text-neutral-900">
              Tap<span style={{ color: 'var(--accent-primary)' }}>QR</span>
            </span>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveView('editor')}
              className={`w-full px-3.5 py-3 rounded-2xl text-xs font-semibold flex items-center gap-3 transition-all duration-200 cursor-pointer tap-haptic ${
                activeView === 'editor'
                  ? 'nav-item active'
                  : 'nav-item text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <FaCog className="w-4 h-4 shrink-0" /> Profile Editor
            </button>

            <button
              onClick={() => setActiveView('design')}
              className={`w-full px-3.5 py-3 rounded-2xl text-xs font-semibold flex items-center gap-3 transition-all duration-200 cursor-pointer tap-haptic ${
                activeView === 'design'
                  ? 'nav-item active'
                  : 'nav-item text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <FaSlidersH className="w-4 h-4 shrink-0" /> Design Settings
            </button>

            <button
              onClick={() => setActiveView('qr')}
              className={`w-full px-3.5 py-3 rounded-2xl text-xs font-semibold flex items-center gap-3 transition-all duration-200 cursor-pointer tap-haptic ${
                activeView === 'qr'
                  ? 'nav-item active'
                  : 'nav-item text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <FaQrcode className="w-4 h-4 shrink-0" /> QR Designer
            </button>

            <button
              onClick={() => setActiveView('analytics')}
              className={`w-full px-3.5 py-3 rounded-2xl text-xs font-semibold flex items-center gap-3 transition-all duration-200 cursor-pointer tap-haptic ${
                activeView === 'analytics'
                  ? 'nav-item active'
                  : 'nav-item text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <FaChartBar className="w-4 h-4 shrink-0" /> Tap Analytics
            </button>
          </nav>
        </div>

        {/* SIDEBAR FOOTER ACTIONS */}
        <div className="space-y-3 text-left border-t pt-5" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 px-4 btn-glass-secondary rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer tap-haptic"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" style={{ color: 'var(--success)' }} /> : <Copy className="w-3.5 h-3.5" />}
            {copiedLink ? 'Copied Link' : 'Copy Profile URL'}
          </button>
          
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 px-4 btn-glass-primary rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 text-center block tap-haptic"
          >
            <Eye className="w-3.5 h-3.5 inline-block -mt-0.5 mr-1" /> View Live Profile
          </a>

          <button
            onClick={() => {
              if (confirm('Reset profile to defaults? This will clear local changes.')) resetToDefaults();
            }}
            className="w-full py-2 bg-transparent text-[9px] uppercase font-bold tracking-widest active:scale-95 duration-100 cursor-pointer text-center transition-colors hover:text-neutral-600"
            style={{ color: '#9CA3AF' }}
          >
            Reset Console
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to sign out?')) logout();
            }}
            className="w-full py-2 bg-transparent text-[9px] uppercase font-bold tracking-widest active:scale-95 duration-100 cursor-pointer text-center text-rose-500/80 hover:text-rose-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT VIEWPORT */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        
        {/* MOBILE HEADER (Visible below lg) */}
        <header className="lg:hidden h-14 glass-navbar px-5 flex flex-row items-center justify-between z-30 sticky top-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'var(--accent-primary)' }}>
              <FaQrcode className="w-4 h-4 text-white" />
            </div>
            <span className="font-outfit font-extrabold text-sm tracking-tight text-neutral-900">
              TapQR
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 btn-glass-secondary rounded-xl cursor-pointer tap-haptic"
            >
              {copiedLink ? <Check className="w-4 h-4" style={{ color: 'var(--success)' }} /> : <Copy className="w-4 h-4" />}
            </button>
            
            <a
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 btn-glass-primary rounded-xl cursor-pointer tap-haptic"
            >
              <Eye className="w-4 h-4" />
            </a>
          </div>
        </header>

        {/* WORKSPACE ROW CONTAINER (Editor + Mockup Preview) */}
        <div className="flex-1 flex flex-col lg:flex-row relative">
          

          {/* LEFT SCROLLABLE EDITOR PANEL */}
          <div className="flex-1 p-6 md:p-8 space-y-8 pb-28 relative">
            <AnimatePresence mode="wait">

              {/* VIEW: Form Editor */}
              {activeView === 'editor' && (
                <motion.div
                  key="editor-view"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="space-y-8 text-left max-w-3xl"
                >
                  
                  {/* GROUP 1: Core Branding */}
                  <div className="glass-card p-6 md:p-8 rounded-[28px] space-y-6 hover-lift">
                    <div className="flex items-center gap-2.5 border-b pb-4" style={{ borderColor: 'rgba(255,255,255,0.50)' }}>
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)', color: '#059669' }}>
                        <Shield className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-[10px] uppercase font-extrabold tracking-widest" style={{ color: '#6B7280' }}>Core Branding Details</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Name Input with Floating Label */}
                      <div className="relative group mt-1">
                        <input
                          id="biz-name"
                          type="text"
                          placeholder=" "
                          value={draftProfile.name}
                          onChange={(e) => updateDraftField('name', e.target.value)}
                          className={`peer ${floatInputClass}`}
                        />
                        <label
                          htmlFor="biz-name"
                          className="absolute left-4 -top-2.5 px-1.5 bg-white/80 text-[9px] font-bold uppercase tracking-widest transition-all duration-200 select-none pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-placeholder-shown:font-semibold peer-placeholder-shown:text-neutral-400 peer-focus:-top-2.5 peer-focus:text-[9px] peer-focus:bg-white"
                          style={{ color: '#9CA3AF' }}
                        >
                          Business Name
                        </label>
                      </div>
                      
                      {/* Category Input with Floating Label */}
                      <div className="relative group mt-1">
                        <input
                          id="biz-category"
                          type="text"
                          placeholder=" "
                          value={draftProfile.category || ''}
                          onChange={(e) => updateDraftField('category', e.target.value)}
                          className={`peer ${floatInputClass}`}
                        />
                        <label
                          htmlFor="biz-category"
                          className="absolute left-4 -top-2.5 px-1.5 bg-white/80 text-[9px] font-bold uppercase tracking-widest transition-all duration-200 select-none pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-placeholder-shown:font-semibold peer-placeholder-shown:text-neutral-400 peer-focus:-top-2.5 peer-focus:text-[9px] peer-focus:bg-white"
                          style={{ color: '#9CA3AF' }}
                        >
                          Business Category
                        </label>
                      </div>

                      {/* Logo URL Input with Upload Toggle Button */}
                      <div className="sm:col-span-2">
                        <label htmlFor="biz-logo" className="block text-[9px] font-bold uppercase tracking-widest mb-2 px-1" style={{ color: '#9CA3AF' }}>Logo Image (URL / Upload File)</label>
                        <div className="flex gap-2.5">
                          <input
                            id="biz-logo"
                            type="text"
                            value={draftProfile.avatar}
                            onChange={(e) => updateDraftField('avatar', e.target.value)}
                            placeholder="Paste external image link..."
                            className="flex-1 bg-white/70 border border-white/70 rounded-2xl px-4 py-3 text-xs text-neutral-800 focus:bg-white focus:outline-none transition-all shadow-sm"
                            style={{ borderColor: 'rgba(255,255,255,0.70)' }}
                          />
                          <label className="px-4 py-3 btn-glass-secondary active:scale-95 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 duration-100 cursor-pointer shrink-0 select-none tap-haptic">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleDraftImageUpload(e, 'avatar')}
                              className="hidden"
                            />
                            <ImageIcon className="w-3.5 h-3.5" /> Upload
                          </label>
                        </div>
                      </div>

                      {/* Cover URL Input with Upload Toggle Button */}
                      <div className="sm:col-span-2">
                        <label htmlFor="biz-cover" className="block text-[9px] font-bold uppercase tracking-widest mb-2 px-1" style={{ color: '#9CA3AF' }}>Cover Photo (URL / Upload File)</label>
                        <div className="flex gap-2.5">
                          <input
                            id="biz-cover"
                            type="text"
                            value={draftProfile.coverPhoto}
                            onChange={(e) => updateDraftField('coverPhoto', e.target.value)}
                            placeholder="Paste external image link..."
                            className="flex-1 bg-white/70 border border-white/70 rounded-2xl px-4 py-3 text-xs text-neutral-800 focus:bg-white focus:outline-none transition-all shadow-sm"
                            style={{ borderColor: 'rgba(255,255,255,0.70)' }}
                          />
                          <label className="px-4 py-3 btn-glass-secondary active:scale-95 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 duration-100 cursor-pointer shrink-0 select-none tap-haptic">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleDraftImageUpload(e, 'coverPhoto')}
                              className="hidden"
                            />
                            <ImageIcon className="w-3.5 h-3.5" /> Upload
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Bio Textarea with Floating Label */}
                    <div className="relative group mt-2">
                      <textarea
                        id="biz-bio"
                        value={draftProfile.bio}
                        onChange={(e) => updateDraftField('bio', e.target.value)}
                        rows={3}
                        placeholder=" "
                        className={`peer ${floatInputClass} h-auto min-h-[140px] py-4 resize-none`}
                      />
                      <label
                        htmlFor="biz-bio"
                        className="absolute left-4 -top-2.5 px-1.5 bg-white/80 text-[9px] font-bold uppercase tracking-widest transition-all duration-200 select-none pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:bg-transparent peer-placeholder-shown:font-semibold peer-placeholder-shown:text-neutral-400 peer-focus:-top-2.5 peer-focus:text-[9px] peer-focus:bg-white"
                        style={{ color: '#9CA3AF' }}
                      >
                        Business Description (Bio)
                      </label>
                    </div>
                  </div>

                  {/* GROUP 2: Contact Channels & Location */}
                  <div className="glass-card p-6 md:p-8 rounded-[28px] space-y-6 hover-lift">
                    <div className="flex items-center gap-2.5 border-b pb-4" style={{ borderColor: 'rgba(255,255,255,0.50)' }}>
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(125,211,252,0.15)', color: '#0284c7' }}>
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-[10px] uppercase font-extrabold tracking-widest" style={{ color: '#6B7280' }}>Contact Channels & Location</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Phone Input with Floating Label */}
                      <div className="relative group mt-1">
                        <input
                          id="biz-phone"
                          type="tel"
                          placeholder=" "
                          value={draftProfile.phone}
                          onChange={(e) => updateDraftField('phone', e.target.value)}
                          className={`peer ${floatInputClass}`}
                        />
                        <label htmlFor="biz-phone" className="absolute left-4 -top-2.5 px-1.5 bg-white/80 text-[9px] font-bold uppercase tracking-widest transition-all duration-200 select-none pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-placeholder-shown:font-semibold peer-placeholder-shown:text-neutral-400 peer-focus:-top-2.5 peer-focus:text-[9px] peer-focus:bg-white" style={{ color: '#9CA3AF' }}>Phone Number</label>
                      </div>

                      {/* WhatsApp Input with Floating Label */}
                      <div className="relative group mt-1">
                        <input
                          id="biz-whatsapp"
                          type="tel"
                          placeholder=" "
                          value={draftProfile.whatsapp || ''}
                          onChange={(e) => updateDraftField('whatsapp', e.target.value)}
                          className={`peer ${floatInputClass}`}
                        />
                        <label htmlFor="biz-whatsapp" className="absolute left-4 -top-2.5 px-1.5 bg-white/80 text-[9px] font-bold uppercase tracking-widest transition-all duration-200 select-none pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-placeholder-shown:font-semibold peer-placeholder-shown:text-neutral-400 peer-focus:-top-2.5 peer-focus:text-[9px] peer-focus:bg-white" style={{ color: '#9CA3AF' }}>WhatsApp Number</label>
                      </div>

                      {/* Email Input with Floating Label */}
                      <div className="relative group mt-1">
                        <input
                          id="biz-email"
                          type="email"
                          placeholder=" "
                          value={draftProfile.email}
                          onChange={(e) => updateDraftField('email', e.target.value)}
                          className={`peer ${floatInputClass}`}
                        />
                        <label htmlFor="biz-email" className="absolute left-4 -top-2.5 px-1.5 bg-white/80 text-[9px] font-bold uppercase tracking-widest transition-all duration-200 select-none pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-placeholder-shown:font-semibold peer-placeholder-shown:text-neutral-400 peer-focus:-top-2.5 peer-focus:text-[9px] peer-focus:bg-white" style={{ color: '#9CA3AF' }}>Email Address</label>
                      </div>

                      {/* Website Input with Floating Label */}
                      <div className="relative group mt-1">
                        <input
                          id="biz-website"
                          type="url"
                          placeholder=" "
                          value={draftProfile.website}
                          onChange={(e) => updateDraftField('website', e.target.value)}
                          className={`peer ${floatInputClass}`}
                        />
                        <label htmlFor="biz-website" className="absolute left-4 -top-2.5 px-1.5 bg-white/80 text-[9px] font-bold uppercase tracking-widest transition-all duration-200 select-none pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-placeholder-shown:font-semibold peer-placeholder-shown:text-neutral-400 peer-focus:-top-2.5 peer-focus:text-[9px] peer-focus:bg-white" style={{ color: '#9CA3AF' }}>Website Address</label>
                      </div>
                    </div>

                    {/* Address Input with Floating Label */}
                    <div className="relative group mt-2">
                      <input
                        id="biz-address"
                        type="text"
                        placeholder=" "
                        value={draftProfile.address}
                        onChange={(e) => updateDraftField('address', e.target.value)}
                        className={`peer ${floatInputClass}`}
                      />
                      <label htmlFor="biz-address" className="absolute left-4 -top-2.5 px-1.5 bg-white/80 text-[9px] font-bold uppercase tracking-widest transition-all duration-200 select-none pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-placeholder-shown:font-semibold peer-placeholder-shown:text-neutral-400 peer-focus:-top-2.5 peer-focus:text-[9px] peer-focus:bg-white" style={{ color: '#9CA3AF' }}>Physical Location Address</label>
                      <p className="text-[9px] mt-2 px-1 leading-normal" style={{ color: '#9CA3AF' }}>
                        This location will automatically generate a dynamic "Get Directions" link linking to Google Maps.
                      </p>
                    </div>
                  </div>

                  {/* GROUP 3: Social Connections handles */}
                  <div className="glass-card p-6 md:p-8 rounded-[28px] space-y-6 hover-lift">
                    <div className="flex items-center gap-2.5 border-b pb-4" style={{ borderColor: 'rgba(255,255,255,0.50)' }}>
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(244,213,141,0.25)', color: '#b45309' }}>
                        <Globe className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-[10px] uppercase font-extrabold tracking-widest" style={{ color: '#6B7280' }}>Social Connections</h3>
                    </div>

                    {/* Only show filled platforms */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['instagram', 'facebook', 'twitter', 'youtube', 'linkedin', 'tiktok', 'whatsapp', 'telegram', 'snapchat', 'pinterest', 'discord'].map(plat => {
                        const val = (draftProfile?.socials || {})[plat] || '';
                        if (!val) return null;
                        return (
                          <div key={plat} className="flex rounded-2xl overflow-hidden border" style={{ background: 'rgba(255,255,255,0.60)', borderColor: 'rgba(255,255,255,0.65)' }}>
                            <label htmlFor={`social-${plat}`} className="text-[9px] uppercase font-bold tracking-wider px-4 flex items-center border-r w-24 select-none cursor-pointer" style={{ background: 'rgba(255,255,255,0.35)', color: '#9CA3AF', borderColor: 'rgba(255,255,255,0.50)' }}>
                              {plat === 'twitter' ? 'X / Twitter' : plat}
                            </label>
                            <input
                              id={`social-${plat}`}
                              type="url"
                              value={val}
                              onChange={(e) => updateDraftNestedField('socials', plat, e.target.value)}
                              placeholder={`https://${plat === 'twitter' ? 'twitter' : plat}.com/...`}
                              className="flex-1 bg-transparent text-neutral-800 px-3.5 py-3 text-xs focus:outline-none"
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Add more platforms - expandable */}
                    <details className="group">
                      <summary className="cursor-pointer list-none flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider select-none" style={{ color: '#10B981' }}>
                        <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-black leading-none" style={{ borderColor: 'rgba(16,185,129,0.40)', color: '#10B981' }}>+</span>
                        Add Social Platform
                      </summary>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {['instagram', 'facebook', 'twitter', 'youtube', 'linkedin', 'tiktok', 'whatsapp', 'telegram', 'snapchat', 'pinterest', 'discord'].map(plat => {
                          const val = (draftProfile?.socials || {})[plat] || '';
                          if (val) return null;
                          return (
                            <div key={plat} className="flex rounded-2xl overflow-hidden border border-dashed opacity-70 focus-within:opacity-100 transition-all" style={{ borderColor: 'rgba(16,185,129,0.30)' }}>
                              <label htmlFor={`social-add-${plat}`} className="text-[9px] uppercase font-bold tracking-wider px-4 flex items-center border-r w-24 select-none cursor-pointer" style={{ background: 'rgba(255,255,255,0.20)', color: '#9CA3AF', borderColor: 'rgba(255,255,255,0.40)' }}>
                                {plat === 'twitter' ? 'X / Twitter' : plat}
                              </label>
                              <input
                                id={`social-add-${plat}`}
                                type="url"
                                value={val}
                                onChange={(e) => updateDraftNestedField('socials', plat, e.target.value)}
                                placeholder={`https://${plat === 'twitter' ? 'twitter' : plat}.com/...`}
                                className="flex-1 bg-transparent text-neutral-800 px-3.5 py-3 text-xs focus:outline-none"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </details>
                  </div>

                  {/* GROUP 4: Business Operating Hours */}
                  <div className="glass-card p-6 md:p-8 rounded-[28px] space-y-6 hover-lift">
                    <div className="flex items-center gap-2.5 border-b pb-4" style={{ borderColor: 'rgba(255,255,255,0.50)' }}>
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)', color: '#059669' }}>
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-[10px] uppercase font-extrabold tracking-widest" style={{ color: '#6B7280' }}>Weekly Operating Hours</h3>
                    </div>

                    <div className="space-y-2">
                      {daysOfWeek.map(day => {
                        const dayHours = (draftProfile?.hours || {})[day] || { open: 'closed', close: 'closed' };
                        const isClosed = dayHours.open === 'closed';

                        return (
                          <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl gap-3" style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.65)' }}>
                            <span className="text-xs font-semibold capitalize text-neutral-700 min-w-24">{day}</span>
                            
                            <div className="flex items-center gap-3.5">
                               <label htmlFor={`chk-${day}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 cursor-pointer">
                                <input
                                  id={`chk-${day}`}
                                  type="checkbox"
                                  checked={!isClosed}
                                  onChange={(e) => {
                                    const nextOpenState = e.target.checked ? '09:00' : 'closed';
                                    const nextCloseState = e.target.checked ? '17:00' : 'closed';
                                    updateDraftNestedField('hours', day, { open: nextOpenState, close: nextCloseState });
                                  }}
                                  className="w-3.5 h-3.5 rounded cursor-pointer"
                                  style={{ accentColor: '#10B981' }}
                                />
                                Open
                              </label>

                              {!isClosed && (
                                <div className="flex items-center gap-1.5 animate-scale-up">
                                  <input
                                    type="text"
                                    aria-label={`${day} opening hour`}
                                    value={dayHours.open}
                                    placeholder="09:00"
                                    onChange={(e) => updateDraftNestedField('hours', day, { ...dayHours, open: e.target.value })}
                                    className="w-16 bg-white border border-neutral-200 text-neutral-800 rounded-xl px-2 py-1 text-center font-mono text-xs focus:outline-none"
                                    style={{ borderColor: 'rgba(16,185,129,0.30)' }}
                                  />
                                  <span className="text-neutral-300">—</span>
                                  <input
                                    type="text"
                                    aria-label={`${day} closing hour`}
                                    value={dayHours.close}
                                    placeholder="17:00"
                                    onChange={(e) => updateDraftNestedField('hours', day, { ...dayHours, close: e.target.value })}
                                    className="w-16 bg-white border border-neutral-200 text-neutral-800 rounded-xl px-2 py-1 text-center font-mono text-xs focus:outline-none"
                                    style={{ borderColor: 'rgba(16,185,129,0.30)' }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Save Changes CTA Button Panel */}
                  <div className="pt-2 flex items-center justify-end">
                    <button
                      onClick={handleSaveClick}
                      className="px-8 py-3 btn-glass-primary rounded-full text-xs font-bold transition-all active:scale-95 duration-200 flex items-center gap-1.5 cursor-pointer tap-haptic"
                    >
                      {saveState === 'saving' ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving Changes...
                        </>
                      ) : saveState === 'success' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          Changes Saved!
                        </>
                      ) : (
                        'Save Profile Changes'
                      )}
                    </button>
                  </div>

                </motion.div>
              )}

              {/* VIEW: Design Settings */}
              {activeView === 'design' && (
                <motion.div
                  key="design-view"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="space-y-8 text-left max-w-3xl"
                >
                  <div className="glass-card p-6 md:p-8 rounded-[28px] space-y-6 hover-lift">
                    <div className="flex items-center gap-2.5 border-b pb-4" style={{ borderColor: 'rgba(255,255,255,0.50)' }}>
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)', color: '#059669' }}>
                        <FaSlidersH className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-[10px] uppercase font-extrabold tracking-widest" style={{ color: '#6B7280' }}>Design Customization</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Color pickers */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] uppercase font-extrabold tracking-wider" style={{ color: '#9CA3AF' }}>Branding Colors</h4>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/60">
                            <span className="text-xs font-semibold text-neutral-700">Theme Color</span>
                            <input 
                              type="color" 
                              value={draftTheme.primaryColor} 
                              onChange={(e) => setDraftTheme(prev => ({ ...prev, primaryColor: e.target.value }))}
                              className="w-10 h-7 rounded-lg border-0 cursor-pointer p-0"
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/60">
                            <span className="text-xs font-semibold text-neutral-700">Button Background</span>
                            <input 
                              type="color" 
                              value={draftTheme.buttonBackgroundColor} 
                              onChange={(e) => setDraftTheme(prev => ({ ...prev, buttonBackgroundColor: e.target.value }))}
                              className="w-10 h-7 rounded-lg border-0 cursor-pointer p-0"
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/60">
                            <span className="text-xs font-semibold text-neutral-700">Button Text Color</span>
                            <input 
                              type="color" 
                              value={draftTheme.buttonTextColor} 
                              onChange={(e) => setDraftTheme(prev => ({ ...prev, buttonTextColor: e.target.value }))}
                              className="w-10 h-7 rounded-lg border-0 cursor-pointer p-0"
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/60">
                            <span className="text-xs font-semibold text-neutral-700">Text Color</span>
                            <input 
                              type="color" 
                              value={draftTheme.textColor} 
                              onChange={(e) => setDraftTheme(prev => ({ ...prev, textColor: e.target.value }))}
                              className="w-10 h-7 rounded-lg border-0 cursor-pointer p-0"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-[10px] uppercase font-extrabold tracking-wider" style={{ color: '#9CA3AF' }}>Container Colors</h4>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/60">
                            <span className="text-xs font-semibold text-neutral-700">Background Color</span>
                            <input 
                              type="color" 
                              value={draftTheme.backgroundColor} 
                              onChange={(e) => setDraftTheme(prev => ({ ...prev, backgroundColor: e.target.value }))}
                              className="w-10 h-7 rounded-lg border-0 cursor-pointer p-0"
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/60">
                            <span className="text-xs font-semibold text-neutral-700">Card Background</span>
                            <input 
                              type="color" 
                              value={draftTheme.cardBackgroundColor} 
                              onChange={(e) => setDraftTheme(prev => ({ ...prev, cardBackgroundColor: e.target.value }))}
                              className="w-10 h-7 rounded-lg border-0 cursor-pointer p-0"
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/60">
                            <span className="text-xs font-semibold text-neutral-700">Icon Background</span>
                            <input 
                              type="color" 
                              value={draftTheme.iconBackgroundColor} 
                              onChange={(e) => setDraftTheme(prev => ({ ...prev, iconBackgroundColor: e.target.value }))}
                              className="w-10 h-7 rounded-lg border-0 cursor-pointer p-0"
                            />
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/60">
                            <span className="text-xs font-semibold text-neutral-700">Icon Color</span>
                            <input 
                              type="color" 
                              value={draftTheme.iconColor} 
                              onChange={(e) => setDraftTheme(prev => ({ ...prev, iconColor: e.target.value }))}
                              className="w-10 h-7 rounded-lg border-0 cursor-pointer p-0"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.40)' }}>
                      {/* Structure Customizations */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] uppercase font-extrabold tracking-wider" style={{ color: '#9CA3AF' }}>Structure & Layout</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-1.5">
                              <label className="text-xs font-semibold text-neutral-700">Border Radius</label>
                              <span className="text-xs font-mono font-bold text-neutral-500">{draftTheme.borderRadius}px</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="40" 
                              value={draftTheme.borderRadius} 
                              onChange={(e) => setDraftTheme(prev => ({ ...prev, borderRadius: parseInt(e.target.value) }))}
                              className="w-full accent-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">Shadow Style</label>
                            <select 
                              value={draftTheme.shadowStyle} 
                              onChange={(e) => setDraftTheme(prev => ({ ...prev, shadowStyle: e.target.value }))}
                              className="w-full glass-input rounded-2xl px-4 py-2.5 text-xs focus:outline-none cursor-pointer"
                              style={{ color: '#111827' }}
                            >
                              <option value="None">None</option>
                              <option value="Soft">Soft</option>
                              <option value="Medium">Medium</option>
                              <option value="Hard">Hard</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Effects Customizations */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] uppercase font-extrabold tracking-wider" style={{ color: '#9CA3AF' }}>Effects & Overlays</h4>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/60">
                            <span className="text-xs font-semibold text-neutral-700">Glassmorphism Effect</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={draftTheme.glassEffect} 
                                onChange={(e) => setDraftTheme(prev => ({ ...prev, glassEffect: e.target.checked }))}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/60">
                            <span className="text-xs font-semibold text-neutral-700">Background Gradient</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={draftTheme.backgroundGradient} 
                                onChange={(e) => setDraftTheme(prev => ({ ...prev, backgroundGradient: e.target.checked }))}
                                className="sr-only peer"
                              />
                              <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Settings Actions (Reset to Default / Save Changes) */}
                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => {
                        if (confirm('Reset custom design styles to default values?')) {
                          setDraftTheme(defaultTheme);
                        }
                      }}
                      className="px-6 py-3 btn-glass-secondary rounded-full text-xs font-bold transition-all active:scale-95 duration-100 cursor-pointer"
                    >
                      Reset to Default
                    </button>

                    <button
                      onClick={handleSaveClick}
                      className="px-8 py-3 btn-glass-primary rounded-full text-xs font-bold transition-all active:scale-95 duration-100 flex items-center gap-1.5 cursor-pointer"
                    >
                      {saveState === 'saving' ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : saveState === 'success' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          Saved Changes
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}



              {/* VIEW: QR Customizer */}
              {activeView === 'qr' && (
                <motion.div
                  key="qr-view"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="space-y-4 max-w-3xl text-left"
                >
                  <div className="glass-card p-6 md:p-8 rounded-[28px] shadow-glass-md hover-lift">
                    <div className="flex items-center gap-2.5 border-b pb-4 mb-6" style={{ borderColor: 'rgba(255,255,255,0.50)' }}>
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)', color: '#059669' }}>
                        <QrCode className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-[10px] uppercase font-extrabold tracking-widest" style={{ color: '#6B7280' }}>QR Studio Designer</h3>
                    </div>
                    <QrGenerator profileUrl={profileUrl} profile={currentProfile} />
                  </div>
                </motion.div>
              )}

              {/* VIEW: Analytics Chart */}
              {activeView === 'analytics' && (
                <motion.div
                  key="analytics-view"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="space-y-4 max-w-3xl"
                >
                  <AnalyticsChart profileId={currentProfile.id} />
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* RIGHT DESKTOP STICKY PREVIEW COLUMN */}
          <div className="hidden lg:flex w-[440px] flex-col items-center justify-start shrink-0 z-20 preview-sticky py-6 pr-6 my-6 mr-6">
            <div className="scale-[0.82] xl:scale-[0.90] origin-top transition-all duration-300">
              <DeviceMockup profile={previewProfile} />
            </div>
          </div>

        </div>

        {/* 3. MOBILE FLOATING NAVIGATION BAR (Visible below lg) */}
        <div className="lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-[420px]">
          <div className="glass-premium shadow-glass-lg border-white/85 rounded-full py-2 px-2.5 flex items-center justify-between gap-1">
            <button
              onClick={() => setActiveView('editor')}
              className={`flex-1 py-2 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all tap-haptic cursor-pointer ${
                activeView === 'editor'
                  ? 'text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              style={activeView === 'editor' ? { background: 'var(--accent-primary)' } : {}}
            >
              <FaCog className="w-3.5 h-3.5" />
              <span className="text-[8px] font-bold uppercase tracking-wider">Editor</span>
            </button>

            <button
              onClick={() => setActiveView('design')}
              className={`flex-1 py-2 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all tap-haptic cursor-pointer ${
                activeView === 'design'
                  ? 'text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              style={activeView === 'design' ? { background: 'var(--accent-primary)' } : {}}
            >
              <FaSlidersH className="w-3.5 h-3.5" />
              <span className="text-[8px] font-bold uppercase tracking-wider">Design</span>
            </button>

            <button
              onClick={() => setActiveView('qr')}
              className={`flex-1 py-2 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all tap-haptic cursor-pointer ${
                activeView === 'qr'
                  ? 'text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              style={activeView === 'qr' ? { background: 'var(--accent-primary)' } : {}}
            >
              <FaQrcode className="w-3.5 h-3.5" />
              <span className="text-[8px] font-bold uppercase tracking-wider">QR Code</span>
            </button>

            <button
              onClick={() => setActiveView('analytics')}
              className={`flex-1 py-2 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all tap-haptic cursor-pointer ${
                activeView === 'analytics'
                  ? 'text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              style={activeView === 'analytics' ? { background: 'var(--accent-primary)' } : {}}
            >
              <FaChartBar className="w-3.5 h-3.5" />
              <span className="text-[8px] font-bold uppercase tracking-wider">Analytics</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
