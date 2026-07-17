import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfiles } from '../context/ProfileContext';
import { DEFAULT_PROFILES } from '../utils/mockData';
import { downloadVcard } from '../utils/vcard';
import ProfileSkeleton from '../components/ProfileSkeleton';
import QRCode from 'qrcode';
import { 
  Phone, MapPin, CheckCircle2, ChevronDown, ChevronUp, 
  Copy, Check, ExternalLink, UserPlus, Clock, ArrowLeft, 
  Share2, Globe, Mail, X as CloseIcon
} from 'lucide-react';

// Custom SVG WhatsApp icon for authentic branding
const WhatsAppIcon = ({ className = 'w-5 h-5' }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.59 1.98 14.124.954 11.5.954c-5.442 0-9.863 4.372-9.867 9.802 0 1.691.451 3.344 1.306 4.795l-.997 3.639 3.734-.973zm13.04-5.321c-.328-.162-1.942-.947-2.242-1.054-.3-.109-.519-.163-.737.163-.218.327-.847 1.055-1.037 1.272-.19.218-.379.245-.708.083-.328-.162-1.385-.504-2.638-1.61-.976-.862-1.634-1.927-1.825-2.253-.19-.327-.02-.504.143-.666.148-.146.328-.382.493-.573.164-.19.219-.327.328-.545.109-.218.055-.409-.028-.573-.082-.164-.737-1.745-1.01-2.399-.266-.639-.56-.543-.737-.552-.191-.01-.409-.011-.628-.011-.219 0-.573.082-.873.409-.3.327-1.146 1.109-1.146 2.701 0 1.592 1.164 3.129 1.328 3.347.164.218 2.291 3.468 5.549 4.86.776.332 1.382.529 1.854.679.78.246 1.49.211 2.051.128.625-.093 1.943-.786 2.216-1.545.273-.76.273-1.411.191-1.545-.083-.134-.301-.218-.628-.381z" />
  </svg>
);

export default function ProfileView() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { getProfile } = useProfiles();
  const [profile, setProfile] = useState(null);
  
  // Hours accordion
  const [showHoursList, setShowHoursList] = useState(false);
  
  // Share bottom drawer
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  const qrCanvasRef = useRef(null);

  useEffect(() => {
    // 1. Fetch from LocalStorage context
    let found = getProfile(profileId);
    
    // 2. Fallback to default presets
    if (!found) {
      found = DEFAULT_PROFILES.find(p => p.id === profileId);
    }
    
    // 3. Simple default fallback
    if (!found && profileId === 'default') {
      found = DEFAULT_PROFILES[0];
    }
    
    setProfile(found);
  }, [profileId, getProfile]);

  // Generate QR Code dynamically when share sheet opens
  useEffect(() => {
    if (showShareSheet && qrCanvasRef.current && profile) {
      const currentUrl = window.location.href;
      QRCode.toCanvas(qrCanvasRef.current, currentUrl, {
        width: 160,
        margin: 1.5,
        color: {
          dark: '#1c1c1e',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      }, (err) => {
        if (err) console.error('Failed to draw QR in drawer', err);
      });
    }
  }, [showShareSheet, profile]);

  if (!profile) {
    return <ProfileSkeleton />;
  }

  const {
    name = 'Business Name',
    company = 'Company',
    category = 'Business Category',
    bio = 'About our services and company offerings.',
    phone = '',
    whatsapp = '',
    email = '',
    website = '',
    address = '',
    avatar = '',
    coverPhoto = '',
    theme = {},
    socials = {},
    hours = {}
  } = profile;

  const {
    primaryColor = '#a855f7',
    fontFamily = 'Outfit'
  } = theme;

  const fontStyleClass = fontFamily === 'Outfit' ? 'font-outfit' : 'font-sans';

  // Open / Closed calculation logic
  const getOpenStatus = () => {
    if (!hours || Object.keys(hours).length === 0) return { label: 'Closed', class: 'text-rose-600 bg-rose-50 border-rose-100' };
    try {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const currentDay = days[new Date().getDay()];
      const dayHours = hours[currentDay];
      
      if (!dayHours || dayHours.open === 'closed' || dayHours.open === 'Closed') {
        return { label: 'Closed Today', class: 'text-rose-600 bg-rose-50 border-rose-100' };
      }
      
      const now = new Date();
      const currentHour = now.getHours();
      const currentMin = now.getMinutes();
      const currentTimeVal = currentHour * 60 + currentMin;

      const [oH, oM] = dayHours.open.split(':').map(Number);
      const [cH, cM] = dayHours.close.split(':').map(Number);
      
      const openTimeVal = oH * 60 + oM;
      const closeTimeVal = cH * 60 + cM;

      if (currentTimeVal >= openTimeVal && currentTimeVal <= closeTimeVal) {
        return { label: 'Open Now', class: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
      }
      return { label: 'Closed Now', class: 'text-rose-500 bg-rose-50 border-rose-100' };
    } catch (e) {
      return { label: 'Closed', class: 'text-rose-600 bg-rose-50 border-rose-100' };
    }
  };

  const currentStatus = getOpenStatus();

  // Social handles definitions
  const socialConfig = [
    { name: 'Instagram', key: 'instagram', icon: Globe, path: socials.instagram, theme: 'hover:text-pink-600 bg-pink-500/5 hover:bg-pink-500/10 border-pink-500/10' },
    { name: 'Facebook', key: 'facebook', icon: Globe, path: socials.facebook, theme: 'hover:text-blue-700 bg-blue-600/5 hover:bg-blue-600/10 border-blue-600/10' },
    { name: 'X / Twitter', key: 'twitter', icon: Globe, path: socials.twitter, theme: 'hover:text-neutral-900 bg-neutral-500/5 hover:bg-neutral-500/10 border-neutral-500/10' },
    { name: 'YouTube', key: 'youtube', icon: Globe, path: socials.youtube, theme: 'hover:text-red-600 bg-red-500/5 hover:bg-red-500/10 border-red-500/10' },
    { name: 'Website', key: 'website', icon: Globe, path: website, theme: 'hover:text-purple-600 bg-purple-500/5 hover:bg-purple-500/10 border-purple-500/10' },
    { name: 'Email', key: 'email', icon: Mail, path: email ? `mailto:${email}` : '', theme: 'hover:text-emerald-600 bg-emerald-50/5 hover:bg-emerald-500/10 border-emerald-500/10' }
  ];

  const activeSocials = socialConfig.filter(s => s.path);

  // Apple Premium Light Mode styles mapping
  const bgStyle = 'bg-[#f4f5f8] text-neutral-800';
  const cardStyle = 'bg-white border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.015)] backdrop-blur-md rounded-[24px]';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: bio,
          url: window.location.href
        });
      } catch (err) {
        console.log('User cancelled native share or not supported', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSaveContact = () => {
    downloadVcard(profile);
  };

  return (
    <div className="min-h-screen bg-[#eaebf0] flex items-center justify-center p-0 md:p-6 select-none font-sans relative overflow-x-hidden">
      
      {/* Floating Back to Editor Link (Only visible on desktop/wide views) */}
      <div className="hidden md:block absolute top-6 left-6 z-40">
        <button
          onClick={() => navigate('/dashboard')}
          aria-label="Back to Dashboard"
          className="px-4 py-2 rounded-xl bg-white/80 hover:bg-white border border-neutral-200/80 text-neutral-700 active:scale-95 duration-150 backdrop-blur-md cursor-pointer flex items-center gap-1.5 text-xs font-bold font-outfit shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      {/* Mobile Frame Container */}
      <div className={`w-full max-w-[420px] min-h-screen md:min-h-[820px] md:h-[820px] md:rounded-[42px] md:border-[10px] md:border-white shadow-2xl relative flex flex-col justify-between overflow-y-auto no-scrollbar scroll-smooth ${bgStyle} ${fontStyleClass}`}>
        
        {/* Scrollable Container */}
        <div className="flex-1 pb-24 relative">
          
          {/* Cover Photo */}
          <div className="relative h-44 w-full bg-neutral-200 overflow-hidden">
            {coverPhoto ? (
              <img src={coverPhoto} alt="Business Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-neutral-200 to-neutral-100"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5"></div>

            {/* Back Button for mobile viewports */}
            <button
              onClick={() => navigate('/dashboard')}
              aria-label="Back to Dashboard"
              className="md:hidden absolute top-4 left-4 p-2 rounded-full bg-white/70 backdrop-blur-md text-neutral-800 border border-white active:scale-90 duration-150 cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Share Trigger button in Top Header Cover */}
            <button
              onClick={() => setShowShareSheet(true)}
              aria-label="Share this Business Profile"
              className="absolute top-4 right-4 p-2 rounded-full bg-white/70 backdrop-blur-md text-neutral-800 border border-white active:scale-90 duration-150 cursor-pointer shadow-sm"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Card Header */}
          <div className="px-5 relative -mt-16 mb-5 flex flex-col items-center text-center">
            {/* Logo Avatar */}
            <div className="relative w-28 h-28 rounded-[28px] border-4 border-white overflow-hidden bg-white shadow-md spring-hover">
              {avatar ? (
                <img src={avatar} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400 font-extrabold text-3xl">
                  {name.charAt(0)}
                </div>
              )}
            </div>

            {/* Business Title Block */}
            <h2 className="text-xl md:text-2xl font-black mt-3.5 flex items-center gap-1.5 tracking-tight text-neutral-900 leading-tight">
              {name}
              <CheckCircle2 className="w-5 h-5 fill-sky-500 text-white shrink-0" />
            </h2>
            
            {/* Category badge */}
            <span 
              className="mt-2 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest border"
              style={{ 
                color: primaryColor, 
                borderColor: `${primaryColor}20`,
                backgroundColor: `${primaryColor}08` 
              }}
            >
              {category || 'Services'}
            </span>

            {/* Business Bio / Description */}
            <p className="text-xs md:text-[13px] mt-4 opacity-75 leading-relaxed max-w-sm px-3 text-neutral-600">
              {bio}
            </p>
          </div>

          {/* Quick Actions Grid (Call, WhatsApp, Maps) */}
          <div className="px-5 mb-6">
            <div className="grid grid-cols-3 gap-3">
              {/* Call */}
              <a
                href={phone ? `tel:${phone}` : '#'}
                onClick={() => !phone && alert('No phone number configured.')}
                aria-label="Call Business Phone"
                className={`p-3.5 rounded-[24px] ${cardStyle} flex flex-col items-center justify-center gap-1.5 duration-150 active:scale-95 cursor-pointer`}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Call</span>
              </a>

              {/* WhatsApp */}
              <a
                href={whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}` : '#'}
                onClick={() => !whatsapp && alert('No WhatsApp number configured.')}
                target="_blank"
                rel="noreferrer"
                aria-label="Message Business on WhatsApp"
                className={`p-3.5 rounded-[24px] ${cardStyle} flex flex-col items-center justify-center gap-1.5 duration-150 active:scale-95 cursor-pointer`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-500 text-white shadow-sm">
                  <WhatsAppIcon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">WhatsApp</span>
              </a>

              {/* Maps */}
              <a
                href={address ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : '#'}
                onClick={() => !address && alert('No address location configured.')}
                target="_blank"
                rel="noreferrer"
                aria-label="Get directions on Google Maps"
                className={`p-3.5 rounded-[24px] ${cardStyle} flex flex-col items-center justify-center gap-1.5 duration-150 active:scale-95 cursor-pointer`}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-500 text-white shadow-sm">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Directions</span>
              </a>
            </div>
          </div>

          {/* Social Links Cards Grid */}
          {activeSocials.length > 0 && (
            <div className="px-5 mb-6 text-left">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 mb-3 px-1">Social Connect</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {activeSocials.map(soc => (
                  <a
                    key={soc.key}
                    href={soc.path}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Connect with us on ${soc.name}`}
                    className={`p-3.5 rounded-[24px] flex items-center gap-2.5 duration-200 border border-transparent shadow-sm ${cardStyle} ${soc.theme} hover:-translate-y-0.5 active:scale-95 cursor-pointer`}
                  >
                    <div 
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {soc.key === 'email' ? <Mail className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-bold truncate leading-none text-neutral-800 capitalize">{soc.name}</p>
                      <p className="text-[8px] opacity-60 mt-1.5 truncate leading-none">Connect</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Business Hours Segment */}
          {hours && Object.keys(hours).length > 0 && (
            <div className="px-5 mb-6 text-left">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 mb-3 px-1">Operational Hours</h3>
              
              <div className={`p-4 rounded-[24px] ${cardStyle} space-y-3`}>
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowHoursList(!showHoursList)}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 opacity-70" />
                    <span className="text-xs font-bold">Weekly Schedule</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${currentStatus.class}`}>
                      {currentStatus.label}
                    </span>
                    {showHoursList ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
                  </div>
                </div>

                {/* Collapsible hour rows list */}
                {showHoursList && (
                  <div className="space-y-2 pt-3 border-t border-neutral-200 text-xs font-medium opacity-90 transition-all duration-300">
                    {Object.entries(hours).map(([day, range]) => {
                      if (day === 'timezone') return null;
                      return (
                        <div key={day} className="flex justify-between capitalize">
                          <span className="opacity-70">{day}</span>
                          <span className="font-mono text-[11px]">{range.open === 'closed' ? 'Closed' : `${range.open} - ${range.close}`}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Floating Bottom sheet action layout */}
        <div className="absolute bottom-0 inset-x-0 h-20 flex items-center justify-center px-5 border-t border-neutral-200/40 bg-white/75 backdrop-blur-lg z-35 md:rounded-b-[32px]">
          <button
            onClick={handleSaveContact}
            aria-label="Save Business Contact to Phone"
            className="w-full py-3 rounded-2xl text-white font-extrabold text-xs uppercase tracking-widest shadow-md hover:shadow-lg active:scale-[0.98] duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-purple-500/10 transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            <UserPlus className="w-4 h-4" /> Save Contact Card
          </button>
        </div>

      </div>

      {/* Slide up bottom share drawer sheet */}
      {showShareSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setShowShareSheet(false)}>
          <div 
            className="w-full max-w-[420px] bg-white border-t border-white/80 rounded-t-[32px] p-6 text-center space-y-5 animate-slide-up shadow-2xl relative text-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Draw Handle */}
            <div className="w-12 h-1 bg-neutral-200 rounded-full mx-auto mb-2" />

            <div className="flex justify-between items-center pb-2">
              <h3 className="font-outfit font-black text-neutral-800 text-base">Share QR Card</h3>
              <button 
                onClick={() => setShowShareSheet(false)}
                aria-label="Close Share Sheet"
                className="p-1.5 rounded-full bg-neutral-100 text-neutral-500 hover:text-neutral-800 cursor-pointer border border-neutral-200/40"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* QR Canvas */}
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="p-3 bg-white rounded-2xl border border-neutral-200 inline-block shadow-md">
                <canvas ref={qrCanvasRef} className="rounded-lg" style={{ width: '160px', height: '160px' }} />
              </div>
              <p className="text-[10px] text-neutral-450 font-bold uppercase tracking-wider">Scan code to view profile</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleCopyLink}
                aria-label="Copy Business Profile Link URL"
                className="py-3 px-4 bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-700 border border-neutral-200/80 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 duration-100 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" /> Copied Link
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy Profile URL
                  </>
                )}
              </button>

              <button
                onClick={handleNativeShare}
                aria-label="Share Business Profile Link"
                className="py-3 px-4 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 duration-100 cursor-pointer shadow-md shadow-purple-500/10"
              >
                <Share2 className="w-4 h-4" /> Web Share API
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
