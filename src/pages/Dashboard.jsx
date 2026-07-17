import React, { useState } from 'react';
import { useProfiles } from '../context/ProfileContext';
import DeviceMockup from '../components/DeviceMockup';
import QrGenerator from '../components/QrGenerator';
import AnalyticsChart from '../components/AnalyticsChart';
import { 
  Building2, Phone, MapPin, Share2, Eye, RefreshCw, 
  Check, Copy, Clock, Globe, Shield, Sparkles, QrCode, BarChart3,
  Image as ImageIcon
} from 'lucide-react';

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
    const link = `${window.location.origin}/p/${currentProfile.id}`;
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
    <div className="min-h-screen bg-[#f4f5f8] text-neutral-800 flex flex-col font-sans relative">
      
      {/* Top Professional Header Actions */}
      <header className="border-b border-neutral-200/80 bg-white/70 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky top-0 z-30 shadow-[0_2px_12px_rgba(0,0,0,0.01)]">
        
        {/* Portal brand title */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-md shadow-purple-500/15">
            <Building2 className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-outfit font-extrabold text-sm tracking-tight text-neutral-900">
            TapQR <span className="text-purple-600 font-bold text-[10px] ml-1 bg-purple-500/10 px-2 py-0.5 rounded-full">Console</span>
          </span>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {/* Quick Copy Link */}
          <button
            onClick={handleCopyLink}
            aria-label="Copy Profile URL"
            className="py-2 px-3.5 bg-white hover:bg-neutral-50 active:scale-95 text-neutral-700 border border-neutral-200 shadow-sm rounded-xl text-xs font-bold flex items-center gap-1.5 duration-100 cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Link
              </>
            )}
          </button>

          {/* View Public Screen */}
          <a
            href={`/p/${currentProfile.id}`}
            target="_blank"
            rel="noreferrer"
            className="py-2 px-3.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 duration-100 shadow-md shadow-purple-500/10"
          >
            <Eye className="w-3.5 h-3.5" /> Live Profile
          </a>

          {/* Reset profile state */}
          <button
            onClick={() => {
              if (confirm('Reset profile configurations back to defaults? This will erase edits in LocalStorage.')) {
                resetToDefaults();
              }
            }}
            className="p-2 rounded-xl bg-white hover:bg-neutral-50 text-neutral-500 hover:text-neutral-700 border border-neutral-200 active:scale-95 duration-100 cursor-pointer shadow-sm"
            title="Reset Settings"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Panel Viewport */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Mobile/Tablet Fixed Preview Widget */}
        {activeView === 'editor' && (
          <div className="lg:hidden w-full bg-white/80 border-b border-neutral-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.015)] overflow-hidden transition-all duration-300 flex flex-col items-center justify-center shrink-0 z-25 relative"
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

        {/* Left Form Settings Panel */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scroll-smooth pb-28 relative no-scrollbar">

          {/* VIEW: Form Editor */}
          {activeView === 'editor' && (
            <div className="space-y-6 text-left max-w-3xl animate-fade-in">
              
              {/* GROUP 1: Core Branding */}
              <div className="bg-white border border-neutral-200/80 p-5 md:p-6 rounded-[24px] space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.015)] backdrop-blur-md">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <h3 className="text-[10px] uppercase font-extrabold tracking-widest text-neutral-450">Core Branding Details</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="biz-name" className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider mb-1.5">Business Name</label>
                    <input
                      id="biz-name"
                      type="text"
                      value={currentProfile.name}
                      onChange={(e) => updateProfileField('name', e.target.value)}
                      placeholder="e.g. Luna Brew Coffee"
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="biz-category" className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider mb-1.5">Business Category</label>
                    <input
                      id="biz-category"
                      type="text"
                      value={currentProfile.category || ''}
                      onChange={(e) => updateProfileField('category', e.target.value)}
                      placeholder="e.g. Cafe & Roastery"
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="biz-logo" className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider mb-1.5">Logo Image (URL / File)</label>
                    <div className="flex gap-2">
                      <input
                        id="biz-logo"
                        type="text"
                        value={currentProfile.avatar}
                        onChange={(e) => updateProfileField('avatar', e.target.value)}
                        placeholder="Paste URL or upload image..."
                        className="flex-1 glass-input rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                      />
                      <label className="px-3.5 py-2.5 bg-neutral-100 hover:bg-neutral-250 active:scale-95 text-neutral-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 duration-100 cursor-pointer shadow-sm shrink-0 select-none border border-neutral-200/40">
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

                  <div>
                    <label htmlFor="biz-cover" className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider mb-1.5">Cover Image (URL / File)</label>
                    <div className="flex gap-2">
                      <input
                        id="biz-cover"
                        type="text"
                        value={currentProfile.coverPhoto}
                        onChange={(e) => updateProfileField('coverPhoto', e.target.value)}
                        placeholder="Paste URL or upload image..."
                        className="flex-1 glass-input rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                      />
                      <label className="px-3.5 py-2.5 bg-neutral-100 hover:bg-neutral-250 active:scale-95 text-neutral-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 duration-100 cursor-pointer shadow-sm shrink-0 select-none border border-neutral-200/40">
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

                <div>
                  <label htmlFor="biz-bio" className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider mb-1.5">Business Description (Bio)</label>
                  <textarea
                    id="biz-bio"
                    value={currentProfile.bio}
                    onChange={(e) => updateProfileField('bio', e.target.value)}
                    rows={3}
                    placeholder="Short description of your services, product offerings, or values..."
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* GROUP 2: Contact Channels & Location */}
              <div className="bg-white border border-neutral-200/80 p-5 md:p-6 rounded-[24px] space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.015)] backdrop-blur-md">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                  <Phone className="w-4 h-4 text-purple-600" />
                  <h3 className="text-[10px] uppercase font-extrabold tracking-widest text-neutral-450">Contact Channels & Location</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="biz-phone" className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider mb-1.5">Phone Number</label>
                    <input
                      id="biz-phone"
                      type="tel"
                      value={currentProfile.phone}
                      onChange={(e) => updateProfileField('phone', e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="biz-whatsapp" className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider mb-1.5">WhatsApp Number</label>
                    <input
                      id="biz-whatsapp"
                      type="tel"
                      value={currentProfile.whatsapp || ''}
                      onChange={(e) => updateProfileField('whatsapp', e.target.value)}
                      placeholder="e.g. +15550192834"
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="biz-email" className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input
                      id="biz-email"
                      type="email"
                      value={currentProfile.email}
                      onChange={(e) => updateProfileField('email', e.target.value)}
                      placeholder="hello@business.com"
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="biz-website" className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider mb-1.5">Website Address</label>
                    <input
                      id="biz-website"
                      type="url"
                      value={currentProfile.website}
                      onChange={(e) => updateProfileField('website', e.target.value)}
                      placeholder="https://mybusiness.com"
                      className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="biz-address" className="block text-[10px] font-bold text-neutral-450 uppercase tracking-wider mb-1.5">Physical Location Address</label>
                  <input
                    id="biz-address"
                    type="text"
                    value={currentProfile.address}
                    onChange={(e) => updateProfileField('address', e.target.value)}
                    placeholder="e.g. 820 Valencia St, San Francisco, CA"
                    className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs focus:outline-none"
                  />
                  <p className="text-[9px] text-neutral-400 mt-1.5 leading-normal">
                    This location will automatically generate a dynamic "Get Directions" link linking to Google Maps.
                  </p>
                </div>
              </div>

              {/* GROUP 3: Social handles */}
              <div className="bg-white border border-neutral-200/80 p-5 md:p-6 rounded-[24px] space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.015)] backdrop-blur-md">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                  <Globe className="w-4 h-4 text-purple-600" />
                  <h3 className="text-[10px] uppercase font-extrabold tracking-widest text-neutral-450">Social Connections</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['instagram', 'facebook', 'twitter', 'youtube'].map(plat => (
                    <div key={plat} className="flex rounded-xl overflow-hidden border border-neutral-200">
                      <label htmlFor={`social-${plat}`} className="bg-neutral-50 text-neutral-500 text-[9px] uppercase font-bold tracking-wider px-3.5 flex items-center border-r border-neutral-100 w-24 select-none cursor-pointer">
                        {plat === 'twitter' ? 'X / Twitter' : plat}
                      </label>
                      <input
                        id={`social-${plat}`}
                        type="url"
                        value={currentProfile.socials[plat] || ''}
                        onChange={(e) => updateNestedField('socials', plat, e.target.value)}
                        placeholder={`https://${plat === 'twitter' ? 'twitter' : plat}.com/...`}
                        className="flex-1 bg-white text-neutral-800 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* GROUP 4: Business Hours */}
              <div className="bg-white border border-neutral-200/80 p-5 md:p-6 rounded-[24px] space-y-4 shadow-[0_8px_30px_rgba(0,0,0,0.015)] backdrop-blur-md">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <h3 className="text-[10px] uppercase font-extrabold tracking-widest text-neutral-450">Weekly Operating Hours</h3>
                </div>

                <div className="space-y-2">
                  {daysOfWeek.map(day => {
                    const dayHours = currentProfile.hours[day] || { open: 'closed', close: 'closed' };
                    const isClosed = dayHours.open === 'closed';

                    return (
                      <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-150/60 gap-2.5">
                        <span className="text-xs font-bold capitalize text-neutral-700 min-w-24">{day}</span>
                        
                        <div className="flex items-center gap-3.5">
                          <label htmlFor={`chk-${day}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 cursor-pointer">
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
                                className="w-16 bg-white border border-neutral-200 text-neutral-800 rounded px-2 py-1 text-center font-mono text-xs focus:outline-none focus:border-purple-500"
                              />
                              <span className="text-neutral-400">—</span>
                              <input
                                type="text"
                                aria-label={`${day} closing hour`}
                                value={dayHours.close}
                                placeholder="17:00"
                                onChange={(e) => updateNestedField('hours', day, { ...dayHours, close: e.target.value })}
                                className="w-16 bg-white border border-neutral-200 text-neutral-800 rounded px-2 py-1 text-center font-mono text-xs focus:outline-none focus:border-purple-500"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Manual Save Button Trigger */}
              <div className="pt-4 flex items-center justify-end">
                <button
                  onClick={handleSaveClick}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-500/10 active:scale-95 duration-100 flex items-center gap-1.5 cursor-pointer shadow-purple-500/5"
                >
                  {saveState === 'saving' ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving Changes...
                    </>
                  ) : saveState === 'success' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Changes Saved!
                    </>
                  ) : (
                    'Save Profile Changes'
                  )}
                </button>
              </div>

            </div>
          )}

          {/* VIEW: QR Customizer */}
          {activeView === 'qr' && (
            <div className="space-y-4 max-w-3xl animate-fade-in text-left">
              <div className="bg-white border border-neutral-200/80 p-5 md:p-6 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.015)] backdrop-blur-md">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-3 mb-6">
                  <QrCode className="w-4 h-4 text-purple-600" />
                  <h3 className="text-[10px] uppercase font-extrabold tracking-widest text-neutral-450">QR Studio Designer</h3>
                </div>
                <QrGenerator profileUrl={profileUrl} profile={currentProfile} />
              </div>
            </div>
          )}

          {/* VIEW: Analytics Chart */}
          {activeView === 'analytics' && (
            <div className="space-y-4 max-w-3xl animate-fade-in">
              <AnalyticsChart profileId={currentProfile.id} />
            </div>
          )}

          {/* Floating Bottom Navigation Bar */}
          <div className="fixed bottom-6 left-1/2 md:left-[calc(50%-160px)] -translate-x-1/2 z-40 w-[90%] max-w-[340px]">
            <div className="glass-premium shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-white/80 rounded-full py-2 px-3 flex items-center justify-between gap-1 shadow-purple-500/5">
              <button
                onClick={() => setActiveView('editor')}
                className={`flex-1 py-2 rounded-full flex flex-col items-center justify-center gap-0.5 transition-all tap-haptic cursor-pointer ${
                  activeView === 'editor'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Building2 className="w-4 h-4" />
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
                <QrCode className="w-4 h-4" />
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
                <BarChart3 className="w-4 h-4" />
                <span className="text-[8px] font-bold uppercase tracking-wider">Analytics</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Preview Frame (Only visible on medium and larger viewports) */}
        <div className="hidden lg:flex w-[440px] border-l border-neutral-200/80 bg-neutral-50/50 flex-col items-center justify-start overflow-y-auto no-scrollbar relative pt-6 pb-20 h-full shrink-0">
          <div className="scale-[0.82] xl:scale-[0.90] origin-top transition-all duration-300 sticky top-6">
            <DeviceMockup profile={currentProfile} />
          </div>
        </div>

      </div>
    </div>
  );
}
