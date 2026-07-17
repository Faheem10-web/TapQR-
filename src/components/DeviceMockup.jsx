import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';

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

// Dynamic icon helper to map string keys to Lucide icon components
export const DynamicIcon = ({ name, className = 'w-5 h-5' }) => {
  if (!name) return <Icons.Link2 className={className} />;
  
  // Convert kebab-case to PascalCase
  const pascalName = name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
    
  const IconComponent = Icons[pascalName] || Icons.Link2;
  return <IconComponent className={className} />;
};

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
    { name: 'Instagram', key: 'instagram', path: socials.instagram, theme: 'hover:text-pink-600 bg-pink-500/5 hover:bg-pink-500/10 border-pink-500/10' },
    { name: 'Facebook', key: 'facebook', path: socials.facebook, theme: 'hover:text-blue-700 bg-blue-600/5 hover:bg-blue-600/10 border-blue-600/10' },
    { name: 'X / Twitter', key: 'twitter', path: socials.twitter, theme: 'hover:text-neutral-900 bg-neutral-500/5 hover:bg-neutral-500/10 border-neutral-500/10' },
    { name: 'YouTube', key: 'youtube', path: socials.youtube, theme: 'hover:text-red-600 bg-red-500/5 hover:bg-red-500/10 border-red-500/10' },
    { name: 'Website', key: 'website', path: website, theme: 'hover:text-purple-600 bg-purple-500/5 hover:bg-purple-500/10 border-purple-500/10' },
    { name: 'Email', key: 'email', path: email, theme: 'hover:text-emerald-600 bg-emerald-50/5 hover:bg-emerald-500/10 border-emerald-500/10' }
  ];

  const activeSocials = socialConfig.filter(s => s.path);

  // Card Background styles mapping (Light-Mode Only)
  const bgStyle = 'bg-[#f4f5f8] text-neutral-800';
  const cardStyle = 'bg-white border border-white/80 shadow-[0_4px_12px_rgba(0,0,0,0.015)] backdrop-blur-md rounded-[20px]';

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
          <Icons.Signal className="w-3 h-3" />
          <Icons.Wifi className="w-3 h-3" />
          <Icons.BatteryCharging className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Profile Scroll Container */}
      <div className={`w-full h-full pt-10 pb-16 overflow-y-auto no-scrollbar ${bgStyle} ${fontStyleClass} scroll-smooth`}>
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
          <div className="relative w-20 h-20 rounded-[20px] border-4 border-white overflow-hidden bg-white shadow-sm">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 font-bold text-xl">
                {name.charAt(0)}
              </div>
            )}
          </div>

          {/* Business Name */}
          <h2 className="text-sm font-bold mt-2.5 flex items-center gap-1 text-neutral-950">
            {name}
            <Icons.CheckCircle2 className="w-4 h-4 fill-sky-500 text-white" />
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
          <p className="text-[10px] mt-2.5 opacity-75 leading-relaxed max-w-xs px-2 line-clamp-3 text-neutral-550">
            {bio}
          </p>
        </div>

        {/* Quick Actions Grid (Call, WhatsApp, Maps) */}
        <div className="px-4 mb-4">
          <div className="grid grid-cols-3 gap-2.5">
            {/* Call */}
            <div className={`p-2.5 rounded-2xl ${cardStyle} flex flex-col items-center justify-center gap-1`}>
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Icons.Phone className="w-3.5 h-3.5" />
              </div>
              <span className="text-[8px] font-bold uppercase tracking-wider text-neutral-400">Call</span>
            </div>

            {/* WhatsApp */}
            <div className={`p-2.5 rounded-2xl ${cardStyle} flex flex-col items-center justify-center gap-1`}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-500 text-white">
                <WhatsAppIcon className="w-3.5 h-3.5" />
              </div>
              <span className="text-[8px] font-bold uppercase tracking-wider text-neutral-400">WhatsApp</span>
            </div>

            {/* Maps */}
            <div className={`p-2.5 rounded-2xl ${cardStyle} flex flex-col items-center justify-center gap-1`}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-sky-500 text-white">
                <Icons.MapPin className="w-3.5 h-3.5" />
              </div>
              <span className="text-[8px] font-bold uppercase tracking-wider text-neutral-400">Directions</span>
            </div>
          </div>
        </div>

        {/* Social Links Cards Grid */}
        {activeSocials.length > 0 && (
          <div className="px-4 mb-4 text-left">
            <h3 className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mb-2 px-1">Social Connect</h3>
            <div className="grid grid-cols-2 gap-2">
              {activeSocials.map(soc => (
                <div
                  key={soc.key}
                  className={`p-2.5 rounded-2xl flex items-center gap-2 border border-transparent shadow-sm ${cardStyle} ${soc.theme}`}
                >
                  <div 
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {soc.key === 'email' ? <Icons.Mail className="w-3 h-3" /> : <Icons.Globe className="w-3 h-3" />}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[9px] font-bold truncate leading-none text-neutral-800 capitalize">{soc.name}</p>
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
            <h3 className="text-[8px] font-bold uppercase tracking-widest text-neutral-400 mb-2 px-1">Operational Hours</h3>
            
            <div className={`p-3 rounded-2xl ${cardStyle} space-y-2`}>
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowHoursList(!showHoursList)}
              >
                <div className="flex items-center gap-1.5">
                  <Icons.Clock className="w-3.5 h-3.5 opacity-70" />
                  <span className="text-[10px] font-bold">Schedule</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border ${currentStatus.class}`}>
                    {currentStatus.label}
                  </span>
                  {showHoursList ? <Icons.ChevronUp className="w-3 h-3 opacity-50" /> : <Icons.ChevronDown className="w-3 h-3 opacity-50" />}
                </div>
              </div>

              {/* Hour rows */}
              {showHoursList && (
                <div className="space-y-1.5 pt-2 border-t border-neutral-100 text-[9px] font-semibold opacity-90 transition-all duration-300">
                  {Object.entries(hours).map(([day, range]) => {
                    if (day === 'timezone') return null;
                    return (
                      <div key={day} className="flex justify-between capitalize">
                        <span className="opacity-70">{day}</span>
                        <span className="font-mono text-[9px]">{range.open === 'closed' ? 'Closed' : `${range.open} - ${range.close}`}</span>
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
          className="w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-md shadow-purple-500/10 active:scale-95 duration-100 flex items-center justify-center gap-1.5 cursor-pointer"
          style={{ backgroundColor: primaryColor }}
        >
          <Icons.UserPlus className="w-3.5 h-3.5" /> Save Contact Card
        </button>
      </div>

      {/* Home Indicator Bar */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-neutral-350 rounded-full z-50"></div>
    </div>
  );
}
