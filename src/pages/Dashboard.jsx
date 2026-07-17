import React, { useState } from 'react';
import { useProfiles } from '../context/ProfileContext';
import DeviceMockup from '../components/DeviceMockup';
import QrGenerator from '../components/QrGenerator';
import AnalyticsChart from '../components/AnalyticsChart';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Phone, MapPin, Share2, Eye, RefreshCw, 
  Check, Copy, Clock, Globe, Shield, Sparkles, QrCode, BarChart3,
  Image as ImageIcon
} from 'lucide-react';
import { FaCog, FaQrcode, FaChartBar, FaSlidersH } from 'react-icons/fa';

export default function Dashboard() {
  const { 
    currentProfile, updateProfile, resetToDefaults 
  } = useProfiles();

  const [activeView, setActiveView] = useState('editor'); // editor, qr, analytics
  const [copiedLink, setCopiedLink] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(true);
  const [saveState, setSaveState] = useState('idle'); // idle, saving, success

  const handleSaveClick = () => {
    setSaveState('saving');
    setTimeout(() => {
      setSaveState('success');
      setTimeout(() => {
        setSaveState('idle');
      }, 2000);
    }, 800);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/profile/${currentProfile.id}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const updateProfileField = (field, val) => {
    updateProfile(currentProfile.id, { [field]: val });
  };

  const updateNestedField = (parent, field, val) => {
    updateProfile(currentProfile.id, {
      [parent]: {
        ...currentProfile[parent],
        [field]: val
      }
    });
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateProfileField(field, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  // Dynamic URL configuration ensuring public production domain mapping
  const getPublicProfileUrl = (profileId) => {
    const origin = window.location.origin;
    const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('192.168.');
    const base = isLocal ? 'https://tap-qr.vercel.app' : origin;
    return `${base}/profile/${profileId}`;
  };
  const profileUrl = getPublicProfileUrl(currentProfile.id);

  return (
    <div className="min-h-screen bg-[#f4f5f8] text-neutral-800 flex flex-col lg:flex-row font-sans relative">
      
      {/* 1. DESKTOP SIDEBAR PANEL */}
      <aside className="hidden lg:flex w-64 bg-white border border-neutral-200/80 flex-col justify-between p-6 shrink-0 rounded-[24px] z-30 shadow-[0_8px_30px_rgba(0,0,0,0.015)] sidebar my-6 ml-6">
        <div className="space-y-8 text-left">
          {/* BRAND */}
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-505 flex items-center justify-center shadow-md shadow-purple-500/10">
              <FaQrcode className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-outfit font-extrabold text-lg tracking-tight text-neutral-900">
              Tap<span className="text-purple-600">QR</span>
            </span>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveView('editor')}
              className={`w-full px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all duration-150 cursor-pointer tap-haptic ${
                activeView === 'editor'
                  ? 'bg-neutral-100/80 text-purple-600'
                  : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
              }`}
            >
              <FaCog className="w-4.5 h-4.5" /> Profile Editor
            </button>
            
            <button
              onClick={() => setActiveView('qr')}
              className={`w-full px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all duration-150 cursor-pointer tap-haptic ${
                activeView === 'qr'
                  ? 'bg-neutral-100/80 text-purple-600'
                  : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
              }`}
            >
              <FaQrcode className="w-4.5 h-4.5" /> QR Designer
            </button>

            <button
              onClick={() => setActiveView('analytics')}
              className={`w-full px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all duration-150 cursor-pointer tap-haptic ${
                activeView === 'analytics'
                  ? 'bg-neutral-100/80 text-purple-600'
                  : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
              }`}
            >
              <FaChartBar className="w-4.5 h-4.5" /> Tap Analytics
            </button>
          </nav>
        </div>

        {/* SIDEBAR FOOTER ACTIONS */}
        <div className="space-y-3.5 text-left border-t border-neutral-100 pt-5">
          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 px-4 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200/60 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 duration-100 cursor-pointer tap-haptic"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedLink ? 'Copied Link' : 'Copy Profile URL'}
          </button>
          
          <a
            href={`/profile/${currentProfile.id}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-750 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 duration-100 shadow-md shadow-purple-500/10 text-center block tap-haptic"
          >
            <Eye className="w-3.5 h-3.5 inline-block -mt-0.5 mr-1" /> View Live Profile
          </a>

          <button
            onClick={() => {
              if (confirm('Reset profile to defaults? This will clear local changes.')) resetToDefaults();
            }}
            className="w-full py-2 bg-transparent text-neutral-400 hover:text-neutral-600 text-[9px] uppercase font-bold tracking-widest active:scale-95 duration-100 cursor-pointer text-center"
          >
            Reset Console
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT VIEWPORT */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        
        {/* MOBILE HEADER (Visible below lg) */}
        <header className="lg:hidden h-14 border-b border-neutral-200/80 bg-white/70 backdrop-blur-md px-6 flex flex-row items-center justify-between z-30 sticky top-0 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-sm">
              <FaQrcode className="w-4 h-4 text-white" />
            </div>
            <span className="font-outfit font-extrabold text-sm tracking-tight text-neutral-900">
              TapQR
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 bg-white hover:bg-neutral-50 text-neutral-600 border border-neutral-200 rounded-xl shadow-sm cursor-pointer tap-haptic"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
            
            <a
              href={`/profile/${currentProfile.id}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-sm cursor-pointer tap-haptic"
            >
              <Eye className="w-4 h-4" />
            </a>
          </div>
        </header>

        {/* WORKSPACE ROW CONTAINER (Editor + Mockup Preview) */}
        <div className="flex-1 flex flex-col lg:flex-row relative">
          
          {/* MOBILE PREVIEW FIXED CARD (Static header on top) */}
          {activeView === 'editor' && (
            <div className="lg:hidden w-full bg-white/80 border-b border-neutral-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.015)] overflow-hidden transition-all duration-300 flex flex-col items-center justify-center shrink-0 z-25 sticky top-14"
                 style={{ height: showMobilePreview ? '190px' : '44px' }}
            >
              {showMobilePreview ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="scale-[0.22] md:scale-[0.31] origin-center -translate-y-6">
                    <DeviceMockup profile={currentProfile} />
                  </div>
                  <button
                    onClick={() => setShowMobilePreview(false)}
                    className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-white/95 border border-neutral-200 text-[10px] font-bold text-neutral-600 hover:text-neutral-900 shadow-sm cursor-pointer z-30"
                  >
                    Hide Preview
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowMobilePreview(true)}
                  className="px-3 py-1 rounded-full bg-white border border-neutral-200 text-[10px] font-bold text-purple-650 hover:bg-neutral-50 shadow-sm cursor-pointer"
                >
                  Show Live Preview
                </button>
              )}
            </div>
          )}

          {/* CENTER EDITOR PANEL */}
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
                  
                  {/* GROUP 1: Core Branding (Notion/Stripe Floating Labels Style) */}
                  <div className="bg-white border border-neutral-200/80 p-6 md:p-8 rounded-[24px] space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] backdrop-blur-md">
                    <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                      <Shield className="w-4.5 h-4.5 text-purple-600" />
                      <h3 className="text-[10px] uppercase font-extrabold tracking-widest text-neutral-450">Core Branding Details</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Name Input with Floating Label */}
                      <div className="relative group mt-1">
                        <input
                          id="biz-name"
                          type="text"
                          placeholder=" "
                          value={currentProfile.name}
                          onChange={(e) => updateProfileField('name', e.target.value)}
                          className="peer w-full bg-neutral-50/55 border border-neutral-200 rounded-2xl px-4 py-3 text-xs text-neutral-850 placeholder-transparent focus:bg-white focus:border-purple-600 focus:outline-none transition-all duration-250 shadow-sm"
                        />
                        <label
                          htmlFor="biz-name"
                          className="absolute left-4 -top-2.5 px-1.5 bg-white text-[9px] font-bold text-neutral-450 uppercase tracking-widest transition-all duration-200 select-none pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-placeholder-shown:font-semibold peer-placeholder-shown:text-neutral-400 peer-focus:-top-2.5 peer-focus:text-[9px] peer-focus:text-purple-600 peer-focus:bg-white"
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
                          value={currentProfile.category || ''}
                          onChange={(e) => updateProfileField('category', e.target.value)}
                          className="peer w-full bg-neutral-50/55 border border-neutral-200 rounded-2xl px-4 py-3 text-xs text-neutral-850 placeholder-transparent focus:bg-white focus:border-purple-600 focus:outline-none transition-all duration-250 shadow-sm"
                        />
                        <label
                          htmlFor="biz-category"
                          className="absolute left-4 -top-2.5 px-1.5 bg-white text-[9px] font-bold text-neutral-450 uppercase tracking-widest transition-all duration-200 select-none pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-placeholder-shown:font-semibold peer-placeholder-shown:text-neutral-400 peer-focus:-top-2.5 peer-focus:text-[9px] peer-focus:text-purple-600 peer-focus:bg-white"
                        >
                          Business Category
                        </label>
                      </div>

                      {/* Logo URL Input with Upload Toggle Button */}
                      <div className="sm:col-span-2">
                        <label htmlFor="biz-logo" className="block text-[9px] font-bold text-neutral-450 uppercase tracking-widest mb-2 px-1">Logo Image (URL / Upload File)</label>
                        <div className="flex gap-2.5">
                          <input
                            id="biz-logo"
                            type="text"
                            value={currentProfile.avatar}
                            onChange={(e) => updateProfileField('avatar', e.target.value)}
                            placeholder="Paste external image link..."
                            className="flex-1 bg-neutral-50/50 border border-neutral-200/80 rounded-2xl px-4 py-3 text-xs text-neutral-800 focus:bg-white focus:border-purple-600 focus:outline-none transition-all shadow-sm"
                          />
                          <label className="px-4 py-3 bg-neutral-100 hover:bg-neutral-200/80 active:scale-95 text-neutral-600 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 duration-100 cursor-pointer shadow-sm shrink-0 border border-neutral-200/40 select-none tap-haptic">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'avatar')}
                              className="hidden"
                            />
                            <ImageIcon className="w-3.5 h-3.5" /> Upload
                          </label>
                        </div>
                      </div>

                      {/* Cover URL Input with Upload Toggle Button */}
                      <div className="sm:col-span-2">
                        <label htmlFor="biz-cover" className="block text-[9px] font-bold text-neutral-450 uppercase tracking-widest mb-2 px-1">Cover Photo (URL / Upload File)</label>
                        <div className="flex gap-2.5">
                          <input
                            id="biz-cover"
                            type="text"
                            value={currentProfile.coverPhoto}
                            onChange={(e) => updateProfileField('coverPhoto', e.target.value)}
                            placeholder="Paste external image link..."
                            className="flex-1 bg-neutral-50/50 border border-neutral-200/80 rounded-2xl px-4 py-3 text-xs text-neutral-800 focus:bg-white focus:border-purple-600 focus:outline-none transition-all shadow-sm"
                          />
                          <label className="px-4 py-3 bg-neutral-100 hover:bg-neutral-200/80 active:scale-95 text-neutral-600 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 duration-100 cursor-pointer shadow-sm shrink-0 border border-neutral-200/40 select-none tap-haptic">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'coverPhoto')}
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
                        value={currentProfile.bio}
                        onChange={(e) => updateProfileField('bio', e.target.value)}
                        rows={3}
                        placeholder=" "
                        className="peer w-full bg-neutral-50/55 border border-neutral-200 rounded-2xl px-4 py-3 text-xs text-neutral-850 placeholder-transparent focus:bg-white focus:border-purple-600 focus:outline-none transition-all duration-250 resize-none shadow-sm"
                      />
                      <label
                        htmlFor="biz-bio"
                        className="absolute left-4 -top-2.5 px-1.5 bg-white text-[9px] font-bold text-neutral-450 uppercase tracking-widest transition-all duration-200 select-none pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:bg-transparent peer-placeholder-shown:font-semibold peer-placeholder-shown:text-neutral-400 peer-focus:-top-2.5 peer-focus:text-[9px] peer-focus:text-purple-600 peer-focus:bg-white"
                      >
                        Business Description (Bio)
                      </label>
                    </div>
                  </div>

                  {/* GROUP 2: Contact Channels & Location */}
                  <div className="bg-white border border-neutral-200/80 p-6 md:p-8 rounded-[24px] space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] backdrop-blur-md">
                    <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                      <Phone className="w-4.5 h-4.5 text-purple-600" />
                      <h3 className="text-[10px] uppercase font-extrabold tracking-widest text-neutral-450">Contact Channels & Location</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Phone Input with Floating Label */}
                      <div className="relative group mt-1">
                        <input
                          id="biz-phone"
                          type="tel"
                          placeholder=" "
                          value={currentProfile.phone}
                          onChange={(e) => updateProfileField('phone', e.target.value)}
                          className="peer w-full bg-neutral-50/55 border border-neutral-200 rounded-2xl px-4 py-3 text-xs text-neutral-850 placeholder-transparent focus:bg-white focus:border-purple-600 focus:outline-none transition-all duration-250 shadow-sm"
                        />
                        <label
                          htmlFor="biz-phone"
                          className="absolute left-4 -top-2.5 px-1.5 bg-white text-[9px] font-bold text-neutral-450 uppercase tracking-widest transition-all duration-200 select-none pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-placeholder-shown:font-semibold peer-placeholder-shown:text-neutral-400 peer-focus:-top-2.5 peer-focus:text-[9px] peer-focus:text-purple-600 peer-focus:bg-white"
                        >
                          Phone Number
                        </label>
                      </div>

                      {/* WhatsApp Input with Floating Label */}
                      <div className="relative group mt-1">
                        <input
                          id="biz-whatsapp"
                          type="tel"
                          placeholder=" "
                          value={currentProfile.whatsapp || ''}
                          onChange={(e) => updateProfileField('whatsapp', e.target.value)}
                          className="peer w-full bg-neutral-50/55 border border-neutral-200 rounded-2xl px-4 py-3 text-xs text-neutral-850 placeholder-transparent focus:bg-white focus:border-purple-600 focus:outline-none transition-all duration-250 shadow-sm"
                        />
                        <label
                          htmlFor="biz-whatsapp"
                          className="absolute left-4 -top-2.5 px-1.5 bg-white text-[9px] font-bold text-neutral-450 uppercase tracking-widest transition-all duration-200 select-none pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-placeholder-shown:font-semibold peer-placeholder-shown:text-neutral-400 peer-focus:-top-2.5 peer-focus:text-[9px] peer-focus:text-purple-600 peer-focus:bg-white"
                        >
                          WhatsApp Number
                        </label>
                      </div>

                      {/* Email Input with Floating Label */}
                      <div className="relative group mt-1">
                        <input
                          id="biz-email"
                          type="email"
                          placeholder=" "
                          value={currentProfile.email}
                          onChange={(e) => updateProfileField('email', e.target.value)}
                          className="peer w-full bg-neutral-50/55 border border-neutral-200 rounded-2xl px-4 py-3 text-xs text-neutral-850 placeholder-transparent focus:bg-white focus:border-purple-600 focus:outline-none transition-all duration-250 shadow-sm"
                        />
                        <label
                          htmlFor="biz-email"
                          className="absolute left-4 -top-2.5 px-1.5 bg-white text-[9px] font-bold text-neutral-450 uppercase tracking-widest transition-all duration-200 select-none pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-placeholder-shown:font-semibold peer-placeholder-shown:text-neutral-400 peer-focus:-top-2.5 peer-focus:text-[9px] peer-focus:text-purple-600 peer-focus:bg-white"
                        >
                          Email Address
                        </label>
                      </div>

                      {/* Website Input with Floating Label */}
                      <div className="relative group mt-1">
                        <input
                          id="biz-website"
                          type="url"
                          placeholder=" "
                          value={currentProfile.website}
                          onChange={(e) => updateProfileField('website', e.target.value)}
                          className="peer w-full bg-neutral-50/55 border border-neutral-200 rounded-2xl px-4 py-3 text-xs text-neutral-850 placeholder-transparent focus:bg-white focus:border-purple-600 focus:outline-none transition-all duration-250 shadow-sm"
                        />
                        <label
                          htmlFor="biz-website"
                          className="absolute left-4 -top-2.5 px-1.5 bg-white text-[9px] font-bold text-neutral-450 uppercase tracking-widest transition-all duration-200 select-none pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-placeholder-shown:font-semibold peer-placeholder-shown:text-neutral-400 peer-focus:-top-2.5 peer-focus:text-[9px] peer-focus:text-purple-600 peer-focus:bg-white"
                        >
                          Website Address
                        </label>
                      </div>
                    </div>

                    {/* Address Input with Floating Label */}
                    <div className="relative group mt-2">
                      <input
                        id="biz-address"
                        type="text"
                        placeholder=" "
                        value={currentProfile.address}
                        onChange={(e) => updateProfileField('address', e.target.value)}
                        className="peer w-full bg-neutral-50/55 border border-neutral-200 rounded-2xl px-4 py-3 text-xs text-neutral-855 placeholder-transparent focus:bg-white focus:border-purple-600 focus:outline-none transition-all duration-250 shadow-sm"
                      />
                      <label
                        htmlFor="biz-address"
                        className="absolute left-4 -top-2.5 px-1.5 bg-white text-[9px] font-bold text-neutral-450 uppercase tracking-widest transition-all duration-200 select-none pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-placeholder-shown:font-semibold peer-placeholder-shown:text-neutral-400 peer-focus:-top-2.5 peer-focus:text-[9px] peer-focus:text-purple-600 peer-focus:bg-white"
                      >
                        Physical Location Address
                      </label>
                      <p className="text-[9px] text-neutral-400 mt-2 px-1 leading-normal">
                        This location will automatically generate a dynamic "Get Directions" link linking to Google Maps.
                      </p>
                    </div>
                  </div>

                  {/* GROUP 3: Social Connections handles */}
                  <div className="bg-white border border-neutral-200/80 p-6 md:p-8 rounded-[24px] space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] backdrop-blur-md">
                    <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                      <Globe className="w-4.5 h-4.5 text-purple-600" />
                      <h3 className="text-[10px] uppercase font-extrabold tracking-widest text-neutral-450">Social Connections</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {['instagram', 'facebook', 'twitter', 'youtube'].map(plat => (
                        <div key={plat} className="flex rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
                          <label htmlFor={`social-${plat}`} className="bg-neutral-50 text-neutral-555 text-[9px] uppercase font-bold tracking-wider px-4 flex items-center border-r border-neutral-100 w-24 select-none cursor-pointer">
                            {plat === 'twitter' ? 'X / Twitter' : plat}
                          </label>
                          <input
                            id={`social-${plat}`}
                            type="url"
                            value={currentProfile.socials[plat] || ''}
                            onChange={(e) => updateNestedField('socials', plat, e.target.value)}
                            placeholder={`https://${plat === 'twitter' ? 'twitter' : plat}.com/...`}
                            className="flex-1 bg-white text-neutral-800 px-3.5 py-3 text-xs focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* GROUP 4: Business Operating Hours */}
                  <div className="bg-white border border-neutral-200/80 p-6 md:p-8 rounded-[24px] space-y-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] backdrop-blur-md">
                    <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                      <Clock className="w-4.5 h-4.5 text-purple-600" />
                      <h3 className="text-[10px] uppercase font-extrabold tracking-widest text-neutral-450">Weekly Operating Hours</h3>
                    </div>

                    <div className="space-y-2">
                      {daysOfWeek.map(day => {
                        const dayHours = currentProfile.hours[day] || { open: 'closed', close: 'closed' };
                        const isClosed = dayHours.open === 'closed';

                        return (
                          <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/60 gap-3">
                            <span className="text-xs font-bold capitalize text-neutral-700 min-w-24">{day}</span>
                            
                            <div className="flex items-center gap-3.5">
                              <label htmlFor={`chk-${day}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 cursor-pointer">
                                <input
                                  id={`chk-${day}`}
                                  type="checkbox"
                                  checked={!isClosed}
                                  onChange={(e) => {
                                    const nextOpenState = e.target.checked ? '09:00' : 'closed';
                                    const nextCloseState = e.target.checked ? '17:00' : 'closed';
                                    updateNestedField('hours', day, { open: nextOpenState, close: nextCloseState });
                                  }}
                                  className="w-3.5 h-3.5 accent-purple-500 rounded cursor-pointer"
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
                                    onChange={(e) => updateNestedField('hours', day, { ...dayHours, open: e.target.value })}
                                    className="w-16 bg-white border border-neutral-200 text-neutral-855 rounded-xl px-2 py-1 text-center font-mono text-xs focus:outline-none focus:border-purple-500"
                                  />
                                  <span className="text-neutral-400">—</span>
                                  <input
                                    type="text"
                                    aria-label={`${day} closing hour`}
                                    value={dayHours.close}
                                    placeholder="17:00"
                                    onChange={(e) => updateNestedField('hours', day, { ...dayHours, close: e.target.value })}
                                    className="w-16 bg-white border border-neutral-200 text-neutral-855 rounded-xl px-2 py-1 text-center font-mono text-xs focus:outline-none focus:border-purple-500"
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
                  <div className="pt-4 flex items-center justify-end">
                    <button
                      onClick={handleSaveClick}
                      className="px-8 py-3 bg-purple-600 hover:bg-purple-750 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-500/10 active:scale-95 duration-100 flex items-center gap-1.5 cursor-pointer tap-haptic"
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
                  <div className="bg-white border border-neutral-200/80 p-6 md:p-8 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.015)] backdrop-blur-md">
                    <div className="flex items-center gap-2 border-b border-neutral-100 pb-3 mb-6">
                      <QrCode className="w-4.5 h-4.5 text-purple-600" />
                      <h3 className="text-[10px] uppercase font-extrabold tracking-widest text-neutral-450">QR Studio Designer</h3>
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
              <DeviceMockup profile={currentProfile} />
            </div>
          </div>

        </div>

        {/* 3. MOBILE FLOATING NAVIGATION BAR (Visible below lg) */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-[340px]">
          <div className="glass-premium shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-white/85 rounded-full py-2.5 px-3 flex items-center justify-between gap-1 shadow-purple-500/5">
            <button
              onClick={() => setActiveView('editor')}
              className={`flex-1 py-2 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all tap-haptic cursor-pointer ${
                activeView === 'editor'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <FaCog className="w-4 h-4" />
              <span className="text-[8px] font-bold uppercase tracking-wider">Editor</span>
            </button>
            
            <button
              onClick={() => setActiveView('qr')}
              className={`flex-1 py-2 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all tap-haptic cursor-pointer ${
                activeView === 'qr'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <FaQrcode className="w-4 h-4" />
              <span className="text-[8px] font-bold uppercase tracking-wider">QR Code</span>
            </button>

            <button
              onClick={() => setActiveView('analytics')}
              className={`flex-1 py-2 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all tap-haptic cursor-pointer ${
                activeView === 'analytics'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <FaChartBar className="w-4 h-4" />
              <span className="text-[8px] font-bold uppercase tracking-wider">Analytics</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
