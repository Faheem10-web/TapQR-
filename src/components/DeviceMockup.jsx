import React, { useState, useEffect } from 'react';
import { Link2, Clock, ChevronUp, ChevronDown, UserPlus, Signal, Wifi, BatteryCharging, CheckCircle2 } from 'lucide-react';
import { 
  FaInstagram, FaFacebook, FaWhatsapp, FaYoutube, FaLinkedin, 
  FaTelegram, FaDiscord, FaPinterest, FaSnapchat, FaTiktok,
  FaPhone, FaGlobe, FaEnvelope, FaMapMarkerAlt
} from 'react-icons/fa';
import { SiX } from 'react-icons/si';

export default function DeviceMockup({ profile }) {
  const [time, setTime] = useState('09:41');
  const [showHoursList, setShowHoursList] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!profile) return null;

  const {
    name = 'Business Name',
    category = 'Business Category',
    bio = 'Describe your professional work, services, or product offerings.',
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
    primaryColor = '#10B981',
    fontFamily = 'Outfit',
    backgroundColor = '#f4f5f8',
    cardBackgroundColor = '#ffffff',
    buttonBackgroundColor = '#10B981',
    buttonTextColor = '#ffffff',
    iconBackgroundColor = '#10B981',
    iconColor = '#ffffff',
    textColor = '#111827',
    borderRadius = 20,
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
    { name: 'Email', key: 'email', icon: FaEnvelope, path: email, colorClass: 'bg-neutral-600', textColor: 'text-white' }
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
               shadowStyle === 'Hard' ? '0 12px 32px rgba(0, 0, 0, 0.16)' :
               shadowStyle === 'Medium' ? '0 8px 24px rgba(0, 0, 0, 0.08)' :
               '0 4px 12px rgba(0, 0, 0, 0.03)',
    backdropFilter: glassEffect ? 'blur(16px)' : 'none',
    WebkitBackdropFilter: glassEffect ? 'blur(16px)' : 'none',
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

  return (
    <div className="relative mx-auto w-[375px] h-[750px] rounded-[56px] border-[8px] border-white bg-white shadow-xl overflow-hidden shrink-0 select-none">
      
      {/* Top Dynamic Island cut-out */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-2xl z-50 flex items-center justify-between px-3">
        <div className="w-2 h-2 rounded-full bg-neutral-900"></div>
        <div className="w-10 h-1 bg-neutral-900 rounded-full"></div>
      </div>

      {/* Screen Status Bar */}
      <div className="absolute top-0 inset-x-0 h-10 px-6 flex items-center justify-between text-[11px] font-bold text-neutral-600 z-40">
        <span>{time}</span>
        <div className="flex items-center gap-1.5">
          <Signal className="w-3 h-3" />
          <Wifi className="w-3 h-3" />
          <BatteryCharging className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Profile Scroll Container */}
      <div 
        className={`w-full h-full pt-10 pb-24 overflow-y-auto no-scrollbar ${fontStyleClass} scroll-smooth`}
        style={containerStyleObj}
      >
        {/* Cover Photo */}
        <div className="relative h-32 w-full bg-neutral-200 overflow-hidden">
          {coverPhoto ? (
            <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-neutral-200 to-neutral-100"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        </div>

        {/* Profile Header Details */}
        <div className="px-4 relative -mt-12 mb-4 flex flex-col items-center text-center">
          {/* Avatar / Logo */}
          <div className="relative w-20 h-20 rounded-[20px] border-4 border-white overflow-hidden bg-white shadow-sm" style={{ borderRadius: `${borderRadius}px` }}>
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 font-bold text-xl">
                {name.charAt(0)}
              </div>
            )}
          </div>

          {/* Business Name */}
          <h2 className="text-sm font-bold mt-2.5 flex items-center gap-1" style={{ color: textColor }}>
            {name}
            <CheckCircle2 className="w-4 h-4 fill-sky-500 text-white" />
          </h2>
          
          {/* Category Pill */}
          <span 
            className="mt-1.5 px-2.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-widest border"
            style={{ 
              color: primaryColor, 
              borderColor: `${primaryColor}20`,
              backgroundColor: `${primaryColor}08` 
            }}
          >
            {category || 'Services'}
          </span>

          {/* Description */}
          <p className="text-[10px] mt-2.5 opacity-75 leading-relaxed max-w-xs px-2 line-clamp-3" style={{ color: textColor }}>
            {bio}
          </p>
        </div>

        {/* Quick Actions Grid (Call, WhatsApp, Maps) */}
        <div className="px-4 mb-4">
          <div className="grid grid-cols-3 gap-2.5">
            {/* Call */}
            <div className="p-2.5 flex flex-col items-center justify-center gap-1" style={cardStyleObj}>
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={actionIconStyleObj}
              >
                <FaPhone className="w-3.5 h-3.5" />
              </div>
              <span className="text-[8px] font-bold uppercase tracking-wider text-neutral-400">Call</span>
            </div>

            {/* WhatsApp */}
            <div className="p-2.5 flex flex-col items-center justify-center gap-1" style={cardStyleObj}>
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={actionIconStyleObj}
              >
                <FaWhatsapp className="w-4 h-4" />
              </div>
              <span className="text-[8px] font-bold uppercase tracking-wider text-neutral-400">WhatsApp</span>
            </div>

            {/* Maps */}
            <div className="p-2.5 flex flex-col items-center justify-center gap-1" style={cardStyleObj}>
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={actionIconStyleObj}
              >
                <FaMapMarkerAlt className="w-3.5 h-3.5" />
              </div>
              <span className="text-[8px] font-bold uppercase tracking-wider text-neutral-400">Directions</span>
            </div>
          </div>
        </div>

        {/* Social Links Cards Grid */}
        {activeSocials.length > 0 && (
          <div className="px-4 mb-4 text-left">
            <h3 className="text-[8px] font-bold uppercase tracking-widest mb-2 px-1" style={{ color: textColor, opacity: 0.6 }}>Social Connect</h3>
            <div className="grid grid-cols-2 gap-2">
              {activeSocials.map(soc => (
                <div
                  key={soc.key}
                  className="p-2.5 flex items-center gap-2 border border-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.005)]"
                  style={cardStyleObj}
                >
                  <div className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center ${soc.colorClass} ${soc.textColor} shrink-0`}>
                    <soc.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[9px] font-bold truncate leading-none capitalize" style={{ color: textColor }}>{soc.name}</p>
                    <p className="text-[7px] opacity-60 mt-1.5 truncate leading-none">Connect</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Business Hours Segment */}
        {hours && Object.keys(hours).length > 0 && (
          <div className="px-4 mb-4 text-left">
            <h3 className="text-[8px] font-bold uppercase tracking-widest mb-2 px-1" style={{ color: textColor, opacity: 0.6 }}>Operational Hours</h3>
            
            <div className="p-3 space-y-2" style={cardStyleObj}>
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowHoursList(!showHoursList)}
              >
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 opacity-70" />
                  <span className="text-[10px] font-bold" style={{ color: textColor }}>Schedule</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border ${currentStatus.class}`}>
                    {currentStatus.label}
                  </span>
                  {showHoursList ? <ChevronUp className="w-3 h-3 opacity-50" /> : <ChevronDown className="w-3 h-3 opacity-50" />}
                </div>
              </div>

              {/* Hour rows */}
              {showHoursList && (
                <div className="space-y-1.5 pt-2 border-t border-neutral-100 text-[9px] font-semibold opacity-90 transition-all duration-300">
                  {Object.entries(hours).map(([day, range]) => {
                    if (day === 'timezone') return null;
                    return (
                      <div key={day} className="flex justify-between capitalize">
                        <span className="opacity-70" style={{ color: textColor }}>{day}</span>
                        <span className="font-mono text-[9px]" style={{ color: textColor }}>{range.open === 'closed' ? 'Closed' : `${range.open} - ${range.close}`}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Save Action Bar in Mockup */}
      <div className="absolute bottom-0 inset-x-0 h-16 flex items-center justify-center px-4 border-t border-neutral-100 bg-white/70 backdrop-blur-md z-40">
        <button
          className="w-full py-2.5 text-white font-bold text-xs active:scale-95 duration-100 flex items-center justify-center gap-1.5 cursor-pointer"
          style={ctaButtonStyleObj}
        >
          <UserPlus className="w-3.5 h-3.5" /> Save Contact Card
        </button>
      </div>

      {/* Home Indicator Bar */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-neutral-350 rounded-full z-50"></div>
    </div>
  );
}
