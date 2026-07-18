import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfiles } from '../context/ProfileContext';
import { DEFAULT_PROFILES } from '../utils/mockData';
import { downloadVcard } from '../utils/vcard';
import ProfileSkeleton from '../components/ProfileSkeleton';
import api from '../utils/api';
import QRCode from 'qrcode';
import { 
  Phone, MapPin, CheckCircle2, ChevronDown, ChevronUp, 
  Copy, Check, ExternalLink, UserPlus, Clock, ArrowLeft, 
  Share2, Globe, Mail, X as CloseIcon
} from 'lucide-react';
import { 
  FaInstagram, FaFacebook, FaWhatsapp, FaYoutube, FaLinkedin, 
  FaTelegram, FaDiscord, FaPinterest, FaSnapchat, FaTiktok,
  FaPhone, FaGlobe, FaEnvelope, FaMapMarkerAlt, FaQrcode
} from 'react-icons/fa';
import { SiX } from 'react-icons/si';

export default function ProfileView() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState(null);
  
  // Hours accordion
  const [showHoursList, setShowHoursList] = useState(false);
  
  // Share bottom drawer
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  const qrCanvasRef = useRef(null);

  // Fetch business profile card directly from MongoDB API on scan/view
  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      setErrorProfile(null);
      try {
        const res = await api.get(`/profile/${profileId}`);
        if (res.data.success) {
          setProfile(res.data.data);
        } else {
          setErrorProfile('The scanned profile was not found on our server.');
        }
      } catch (err) {
        console.error('Failed to load profile card from backend:', err);
        setErrorProfile('Failed to load business profile card. Please check the URL.');
      } finally {
        setLoadingProfile(false);
      }
    };
    
    if (profileId) {
      fetchProfile();
    }
  }, [profileId]);

  // Generate QR Code dynamically when share sheet opens
  useEffect(() => {
    if (showShareSheet && qrCanvasRef.current && profile) {
      const getPublicProfileUrl = (profileId) => {
        const origin = window.location.origin;
        const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('192.168.');
        const base = isLocal ? 'https://tap-qr.vercel.app' : origin;
        return `${base}/profile/${profileId}`;
      };

      const targetUrl = getPublicProfileUrl(profile.slug || profile.id);

      QRCode.toCanvas(qrCanvasRef.current, targetUrl, {
        width: 240,
        margin: 4,
        color: {
          dark: '#111827',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      }, (err) => {
        if (err) console.error('Failed to draw QR in drawer', err);
      });
    }
  }, [showShareSheet, profile]);

  if (loadingProfile) {
    return <ProfileSkeleton />;
  }

  if (errorProfile) {
    return (
      <div className="min-h-screen bg-[#eaebf0] flex items-center justify-center p-6 text-center font-sans">
        <div className="w-full max-w-sm glass-card p-8 rounded-[32px] shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-neutral-800">Profile Not Found</h2>
          <p className="text-xs text-neutral-500">{errorProfile}</p>
          <button 
            onClick={() => navigate('/')} 
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] duration-150 text-white rounded-2xl text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
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
    theme: rawTheme,
    socials: rawSocials,
    hours: rawHours
  } = profile;

  const theme = rawTheme || {};
  const socials = rawSocials || {};
  const hours = rawHours || {};

  const {
    primaryColor = '#0F6D73',
    fontFamily = 'Outfit',
    backgroundColor = '#F5F7FA',
    cardBackgroundColor = '#ffffff',
    buttonBackgroundColor = '#0F6D73',
    buttonTextColor = '#ffffff',
    iconBackgroundColor = '#0F6D73',
    iconColor = '#ffffff',
    textColor = '#111827',
    borderRadius = 24,
    shadowStyle = 'Soft',
    glassEffect = true,
    backgroundGradient = true
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

  // Social handles definitions with official icons and branding styles
  const socialConfig = [
    { name: 'Instagram', key: 'instagram', icon: FaInstagram, path: socials.instagram, colorClass: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]', textColor: 'text-white' },
    { name: 'Facebook', key: 'facebook', icon: FaFacebook, path: socials.facebook, colorClass: 'bg-[#1877F2]', textColor: 'text-white' },
    { name: 'WhatsApp', key: 'whatsapp', icon: FaWhatsapp, path: socials.whatsapp ? `https://wa.me/${socials.whatsapp.replace(/[^0-9]/g, '')}` : '', colorClass: 'bg-[#25D366]', textColor: 'text-white' },
    { name: 'X / Twitter', key: 'twitter', icon: SiX, path: socials.twitter, colorClass: 'bg-[#000000]', textColor: 'text-white' },
    { name: 'YouTube', key: 'youtube', icon: FaYoutube, path: socials.youtube, colorClass: 'bg-[#FF0000]', textColor: 'text-white' },
    { name: 'LinkedIn', key: 'linkedin', icon: FaLinkedin, path: socials.linkedin, colorClass: 'bg-[#0A66C2]', textColor: 'text-white' },
    { name: 'TikTok', key: 'tiktok', icon: FaTiktok, path: socials.tiktok, colorClass: 'bg-[#000000]', textColor: 'text-white' },
    { name: 'Telegram', key: 'telegram', icon: FaTelegram, path: socials.telegram, colorClass: 'bg-[#229ED9]', textColor: 'text-white' },
    { name: 'Snapchat', key: 'snapchat', icon: FaSnapchat, path: socials.snapchat, colorClass: 'bg-[#FFFC00]', textColor: 'text-black font-extrabold' },
    { name: 'Pinterest', key: 'pinterest', icon: FaPinterest, path: socials.pinterest, colorClass: 'bg-[#E60023]', textColor: 'text-white' },
    { name: 'Discord', key: 'discord', icon: FaDiscord, path: socials.discord, colorClass: 'bg-[#5865F2]', textColor: 'text-white' },
    { name: 'Website', key: 'website', icon: FaGlobe, path: website, colorClass: 'bg-neutral-500', textColor: 'text-white' },
    { name: 'Email', key: 'email', icon: FaEnvelope, path: email ? `mailto:${email}` : '', colorClass: 'bg-neutral-600', textColor: 'text-white' }
  ];

  const activeSocials = socialConfig.filter(s => s.path);

  // Dynamic Theme Customizations Objects
  const containerStyleObj = {
    backgroundColor: backgroundColor,
    backgroundImage: backgroundGradient 
      ? `linear-gradient(180deg, ${backgroundColor} 0%, ${backgroundColor}bb 100%)` 
      : 'none',
    color: textColor
  };

  const cardStyleObj = {
    backgroundColor: glassEffect 
      ? `${cardBackgroundColor}95`
      : cardBackgroundColor,
    borderRadius: `${borderRadius}px`,
    boxShadow: shadowStyle === 'None' ? 'none' : 
               shadowStyle === 'Hard' ? '0 16px 40px rgba(0, 0, 0, 0.16)' :
               shadowStyle === 'Medium' ? '0 8px 30px rgba(0, 0, 0, 0.08)' :
               '0 4px 16px rgba(0, 0, 0, 0.03)',
    backdropFilter: glassEffect ? 'blur(24px)' : 'none',
    WebkitBackdropFilter: glassEffect ? 'blur(24px)' : 'none',
    border: glassEffect ? '1px solid rgba(255, 255, 255, 0.60)' : '1px solid rgba(0, 0, 0, 0.05)',
    color: textColor
  };

  const ctaButtonStyleObj = {
    backgroundColor: buttonBackgroundColor,
    color: buttonTextColor,
    borderRadius: `${borderRadius}px`,
    boxShadow: shadowStyle === 'None' ? 'none' : `0 8px 24px ${buttonBackgroundColor}35`
  };

  const actionIconStyleObj = {
    backgroundColor: iconBackgroundColor,
    color: iconColor
  };

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
          className="px-4 py-2 rounded-full btn-glass-secondary text-neutral-700 active:scale-95 duration-150 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      {/* Mobile Frame Container */}
      <div className={`w-full max-w-[420px] min-h-screen md:min-h-[820px] md:h-[820px] md:rounded-[42px] md:border-[10px] md:border-white shadow-2xl relative flex flex-col justify-between overflow-hidden ${fontStyleClass}`} style={containerStyleObj}>
        
        {/* Scrollable Container */}
        <div className="flex-1 pb-24 overflow-y-auto no-scrollbar scroll-smooth relative">
          
          {/* Cover Photo */}
          <div className="relative h-44 w-full bg-neutral-200 overflow-hidden">
            {coverPhoto ? (
              <img src={coverPhoto} alt="Business Cover" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, rgba(110,231,183,0.30) 0%, rgba(125,211,252,0.20) 100%)' }}></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/05"></div>

            {/* Back Button for mobile viewports */}
            <button
              onClick={() => navigate('/dashboard')}
              aria-label="Back to Dashboard"
              className="md:hidden absolute top-4 left-4 p-2 rounded-full bg-white/72 backdrop-blur-md text-neutral-800 border border-white active:scale-90 duration-150 cursor-pointer shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* Share Trigger button in Top Header Cover */}
            <button
              onClick={() => setShowShareSheet(true)}
              aria-label="Share this Business Profile"
              className="absolute top-4 right-4 p-2 rounded-full bg-white/72 backdrop-blur-md text-neutral-800 border border-white active:scale-90 duration-150 cursor-pointer shadow-sm"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Card Header */}
          <div className="px-5 relative -mt-16 mb-5 flex flex-col items-center text-center">
            {/* Logo Avatar */}
            <div className="relative w-28 h-28 border-4 border-white overflow-hidden bg-white shadow-md spring-hover" style={{ borderRadius: `${borderRadius + 8}px` }}>
              {avatar ? (
                <img src={avatar} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400 font-extrabold text-3xl">
                  {name.charAt(0)}
                </div>
              )}
            </div>

            {/* Business Title Block */}
            <h2 className="text-xl md:text-2xl font-black mt-3.5 flex items-center gap-1.5 tracking-tight leading-tight" style={{ color: textColor }}>
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
            <p className="text-xs md:text-[13px] mt-4 opacity-75 leading-relaxed max-w-sm px-3" style={{ color: textColor }}>
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
                className="p-3.5 flex flex-col items-center justify-center gap-1.5 duration-150 active:scale-95 cursor-pointer"
                style={cardStyleObj}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                  style={actionIconStyleObj}
                >
                  <FaPhone className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-65" style={{ color: textColor }}>Call</span>
              </a>

              {/* WhatsApp */}
              <a
                href={whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}` : '#'}
                onClick={() => !whatsapp && alert('No WhatsApp number configured.')}
                target="_blank"
                rel="noreferrer"
                aria-label="Message Business on WhatsApp"
                className="p-3.5 flex flex-col items-center justify-center gap-1.5 duration-150 active:scale-95 cursor-pointer"
                style={cardStyleObj}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                  style={actionIconStyleObj}
                >
                  <FaWhatsapp className="w-5.5 h-5.5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-65" style={{ color: textColor }}>WhatsApp</span>
              </a>

              {/* Maps */}
              <a
                href={address ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : '#'}
                onClick={() => !address && alert('No address location configured.')}
                target="_blank"
                rel="noreferrer"
                aria-label="Get directions on Google Maps"
                className="p-3.5 flex flex-col items-center justify-center gap-1.5 duration-150 active:scale-95 cursor-pointer"
                style={cardStyleObj}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                  style={actionIconStyleObj}
                >
                  <FaMapMarkerAlt className="w-4.5 h-4.5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-65" style={{ color: textColor }}>Directions</span>
              </a>
            </div>
          </div>

          {/* Social Links Cards Grid */}
          {activeSocials.length > 0 && (
            <div className="px-5 mb-6 text-left">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest mb-3 px-1" style={{ color: textColor, opacity: 0.6 }}>Social Connect</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {activeSocials.map(soc => (
                  <a
                    key={soc.key}
                    href={soc.path}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Connect with us on ${soc.name}`}
                    className="p-3.5 flex items-center gap-2.5 duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                    style={cardStyleObj}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${soc.colorClass} ${soc.textColor} shrink-0 shadow-sm`}>
                      <soc.icon className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[11px] font-bold truncate leading-none capitalize" style={{ color: textColor }}>{soc.name}</p>
                      <p className="text-[8px] opacity-60 mt-1.5 truncate leading-none" style={{ color: textColor }}>Connect</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Business Hours Segment */}
          {hours && Object.keys(hours).length > 0 && (
            <div className="px-5 mb-6 text-left">
              <h3 className="text-[10px] font-extrabold uppercase tracking-widest mb-3 px-1" style={{ color: textColor, opacity: 0.6 }}>Operational Hours</h3>
              
              <div className="p-4 space-y-3" style={cardStyleObj}>
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowHoursList(!showHoursList)}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 opacity-70" />
                    <span className="text-xs font-bold" style={{ color: textColor }}>Weekly Schedule</span>
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
                          <span className="opacity-70" style={{ color: textColor }}>{day}</span>
                          <span className="font-mono text-[11px]" style={{ color: textColor }}>{range.open === 'closed' ? 'Closed' : `${range.open} - ${range.close}`}</span>
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
        <div className="absolute bottom-0 inset-x-0 h-20 flex items-center justify-center px-5 border-t z-35 md:rounded-b-[32px]" style={{ backgroundColor: glassEffect ? `${cardBackgroundColor}90` : cardBackgroundColor, borderTop: glassEffect ? '1px solid rgba(255, 255, 255, 0.40)' : '1px solid rgba(0, 0, 0, 0.05)', backdropFilter: glassEffect ? 'blur(20px)' : 'none' }}>
          <button
            onClick={handleSaveContact}
            aria-label="Save Business Contact to Phone"
            className="w-full py-3 text-white font-extrabold text-xs uppercase tracking-widest active:scale-[0.98] duration-150 flex items-center justify-center gap-2 cursor-pointer transition-all"
            style={ctaButtonStyleObj}
          >
            <UserPlus className="w-4 h-4" /> Save Contact Card
          </button>
        </div>

      </div>

      {/* Slide up bottom share drawer sheet */}
      {showShareSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 backdrop-blur-[2px] transition-opacity" onClick={() => setShowShareSheet(false)}>
          <div 
            className="w-full max-w-[420px] rounded-t-[32px] p-6 text-center space-y-5 animate-slide-up shadow-2xl relative text-neutral-800"
            style={{ background: '#FFFFFF', borderTop: '1px solid var(--border-color)', boxShadow: 'var(--shadow-hover)' }}
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
                <canvas ref={qrCanvasRef} className="rounded-lg" style={{ width: '180px', height: '180px' }} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>Scan code to view profile</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleCopyLink}
                aria-label="Copy Business Profile Link URL"
                className="py-3 px-4 btn-glass-secondary rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 duration-100 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4" style={{ color: '#12C97A' }} /> Copied Link
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
                className="py-3 px-4 btn-glass-primary rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 duration-100 cursor-pointer"
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
