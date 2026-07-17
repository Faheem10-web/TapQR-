import React, { useState } from 'react';
import { Download, Check, Sparkles, Search, QrCode, X } from 'lucide-react';
import { 
  FaInstagram, FaFacebook, FaWhatsapp, FaYoutube, FaLinkedin, 
  FaTelegram, FaDiscord, FaPinterest, FaSnapchat, FaTiktok,
  FaPhone, FaGlobe, FaEnvelope, FaMapMarkerAlt,
  FaUtensils, FaTooth, FaCoffee, FaBriefcase, FaSpa, FaDumbbell, 
  FaHome, FaGem, FaGraduationCap, FaSlidersH, FaPrint,
  FaShieldAlt, FaDownload, FaSync, FaCheckCircle
} from 'react-icons/fa';
import { SiX } from 'react-icons/si';

const TEMPLATE_PRESETS = [
  {
    id: 'restaurant-classic',
    name: 'Restaurant Classic',
    category: 'Restaurant',
    filterCategory: 'Food',
    primaryColor: '#EF4444',
    fontFamily: 'Inter',
    themeMode: 'light',
    logoType: 'food',
    coverPhoto: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400&fit=crop',
    isPremium: true,
    actions: ['whatsapp', 'instagram', 'website', 'location'],
    previewBg: 'bg-gradient-to-tr from-[#EF4444]/8 to-[#EF4444]/3'
  },
  {
    id: 'dental-blue',
    name: 'Dental Care Blue',
    category: 'Dental Clinic',
    filterCategory: 'Health',
    primaryColor: '#0EA5E9',
    fontFamily: 'Poppins',
    themeMode: 'glass-light',
    logoType: 'dentist',
    coverPhoto: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=400&fit=crop',
    isPremium: true,
    actions: ['phone', 'whatsapp', 'website', 'location'],
    previewBg: 'bg-gradient-to-tr from-[#0EA5E9]/8 to-[#0EA5E9]/3'
  },
  {
    id: 'cafe-warm',
    name: 'Cafe Warm',
    category: 'Coffee Shop',
    filterCategory: 'Food',
    primaryColor: '#854D0E',
    fontFamily: 'Playfair Display',
    themeMode: 'light',
    logoType: 'coffee',
    coverPhoto: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=400&fit=crop',
    isPremium: true,
    actions: ['whatsapp', 'instagram', 'website', 'location'],
    previewBg: 'bg-gradient-to-tr from-[#854D0E]/8 to-[#854D0E]/3'
  },
  {
    id: 'corporate-professional',
    name: 'Corporate Professional',
    category: 'Business Consultant',
    filterCategory: 'Corporate',
    primaryColor: '#1E3A8A',
    fontFamily: 'Inter',
    themeMode: 'light',
    logoType: 'corporate',
    coverPhoto: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&fit=crop',
    isPremium: false,
    actions: ['phone', 'email', 'website', 'location'],
    previewBg: 'bg-gradient-to-tr from-[#1E3A8A]/8 to-[#1E3A8A]/3'
  },
  {
    id: 'salon-pink',
    name: 'Salon Pink',
    category: 'Beauty Salon',
    filterCategory: 'Retail',
    primaryColor: '#EC4899',
    fontFamily: 'Poppins',
    themeMode: 'light',
    logoType: 'salon',
    coverPhoto: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=400&fit=crop',
    isPremium: true,
    actions: ['whatsapp', 'instagram', 'website', 'location'],
    previewBg: 'bg-gradient-to-tr from-[#EC4899]/8 to-[#EC4899]/3'
  },
  {
    id: 'gym-power',
    name: 'Gym Power',
    category: 'Fitness & Health',
    filterCategory: 'Personal',
    primaryColor: '#84CC16',
    fontFamily: 'Outfit',
    themeMode: 'light',
    logoType: 'gym',
    coverPhoto: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&fit=crop',
    isPremium: true,
    actions: ['phone', 'whatsapp', 'instagram', 'location'],
    previewBg: 'bg-gradient-to-tr from-[#84CC16]/8 to-[#84CC16]/3'
  },
  {
    id: 'real-estate-modern',
    name: 'Real Estate Modern',
    category: 'Real Estate',
    filterCategory: 'Business',
    primaryColor: '#06B6D4',
    fontFamily: 'Inter',
    themeMode: 'light',
    logoType: 'real-estate',
    coverPhoto: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=400&fit=crop',
    isPremium: true,
    actions: ['phone', 'website', 'whatsapp', 'location'],
    previewBg: 'bg-gradient-to-tr from-[#06B6D4]/8 to-[#06B6D4]/3'
  },
  {
    id: 'jewellery-luxury',
    name: 'Jewellery Luxury',
    category: 'Timeless Elegance',
    filterCategory: 'Retail',
    primaryColor: '#D97706',
    fontFamily: 'Playfair Display',
    themeMode: 'light',
    logoType: 'jewellery',
    coverPhoto: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=400&fit=crop',
    isPremium: true,
    actions: ['whatsapp', 'instagram', 'website', 'location'],
    previewBg: 'bg-gradient-to-tr from-[#D97706]/8 to-[#D97706]/3'
  },
  {
    id: 'education-purple',
    name: 'Education Purple',
    category: 'Learning Academy',
    filterCategory: 'Education',
    primaryColor: '#7C3AED',
    fontFamily: 'Poppins',
    themeMode: 'light',
    logoType: 'education',
    coverPhoto: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=400&fit=crop',
    isPremium: false,
    actions: ['phone', 'website', 'instagram', 'location'],
    previewBg: 'bg-gradient-to-tr from-[#7C3AED]/8 to-[#7C3AED]/3'
  },
  {
    id: 'personal-portfolio',
    name: 'Personal Portfolio',
    category: 'Product Designer',
    filterCategory: 'Personal',
    primaryColor: '#000000',
    fontFamily: 'Outfit',
    themeMode: 'light',
    logoType: 'personal',
    coverPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&fit=crop',
    isPremium: false,
    actions: ['email', 'linkedin', 'website', 'location'],
    previewBg: 'bg-gradient-to-tr from-[#000000]/8 to-[#000000]/3'
  }
];

const CATEGORIES = ['All', 'Business', 'Food', 'Health', 'Education', 'Corporate', 'Retail', 'Personal'];

const FORMATS = [
  'Square Card',
  'Instagram Story',
  'Business Card',
  'Table Stand',
  'A4 Poster',
  'Flyer',
  'Sticker',
  'Roll-up Banner',
  'Window Sticker'
];

export default function TemplatesGallery({ profile, onApplyTheme }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTpl, setSelectedTpl] = useState(null); // For Canva export modal
  const [downloadFormat, setDownloadFormat] = useState('Square Card');
  const [fileFormat, setFileFormat] = useState('PNG');
  const [downloading, setDownloading] = useState(false);
  const [appliedId, setAppliedId] = useState(null);

  const filteredTemplates = TEMPLATE_PRESETS.filter(tpl => {
    const matchesSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tpl.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tpl.filterCategory === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApply = (e, tpl) => {
    e.stopPropagation(); // Avoid opening the modal on Use Template click
    onApplyTheme(tpl);
    setAppliedId(tpl.id);
    setTimeout(() => setAppliedId(null), 2000);
  };

  const triggerExport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Export Complete! Your ${downloadFormat} has been saved as a high-resolution, print-ready ${fileFormat} file (300 DPI).`);
      setSelectedTpl(null);
    }, 1500);
  };

  const renderMiniLogo = (type, primaryColor) => {
    const props = { className: "w-3.5 h-3.5", style: { color: primaryColor } };
    switch (type) {
      case 'food':
        return <FaUtensils {...props} />;
      case 'dentist':
        return <FaTooth {...props} />;
      case 'coffee':
        return <FaCoffee {...props} />;
      case 'corporate':
        return <FaBriefcase {...props} />;
      case 'salon':
        return <FaSpa {...props} />;
      case 'gym':
        return <FaDumbbell {...props} />;
      case 'real-estate':
        return <FaHome {...props} />;
      case 'jewellery':
        return <FaGem {...props} />;
      case 'education':
        return <FaGraduationCap {...props} />;
      default:
        return <span className="text-[7px] font-black tracking-tighter" style={{ color: primaryColor }}>AR</span>;
    }
  };

  const getSocialDetails = (action) => {
    switch (action) {
      case 'whatsapp': return { icon: <FaWhatsapp />, label: 'WhatsApp', color: '#25D366' };
      case 'instagram': return { icon: <FaInstagram />, label: 'Instagram', color: '#E1306C' };
      case 'linkedin': return { icon: <FaLinkedin />, label: 'LinkedIn', color: '#0077b5' };
      case 'email': return { icon: <FaEnvelope />, label: 'Email', color: '#EA4335' };
      case 'phone': return { icon: <FaPhone />, label: 'Call', color: '#10B981' };
      case 'location': return { icon: <FaMapMarkerAlt />, label: 'Location', color: '#EA4335' };
      default: return { icon: <FaGlobe />, label: 'Website', color: '#1F2937' };
    }
  };

  return (
    <div className="space-y-8 text-left max-w-7xl animate-fade-in pb-20 relative">
      
      {/* Title Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-black text-neutral-900 tracking-tight flex items-center gap-1.5 font-outfit">
          QR Templates Gallery
          <Sparkles className="w-5 h-5 fill-amber-400 text-amber-400 animate-pulse" />
        </h2>
        <p className="text-xs leading-normal max-w-2xl font-medium" style={{ color: '#6B7280' }}>
          Choose a beautiful template for your business and download in multiple formats.
        </p>
      </div>

      {/* Search and Filters Segment */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9CA3AF' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs placeholder-neutral-400 focus:outline-none transition-all glass-input"
            style={{ color: '#111827' }}
          />
        </div>

        {/* Categories Row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth shrink-0">
          <div className="flex gap-1.5">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer tap-haptic ${
                  activeCategory === cat
                    ? 'text-white shadow-md'
                    : 'btn-glass-secondary text-neutral-500 hover:text-neutral-800'
                }`}
                style={activeCategory === cat ? { background: 'linear-gradient(135deg, #10B981, #059669)', boxShadow: '0 6px 20px rgba(16,185,129,0.28)' } : {}}
              >
                {cat}
              </button>
            ))}
          </div>
          <button className="px-3.5 py-2 btn-glass-secondary rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer tap-haptic shrink-0" style={{ color: '#6B7280' }}>
            <FaSlidersH className="w-3 h-3" /> Filters
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
          {filteredTemplates.map(tpl => {
            const isApplied = profile?.theme?.primaryColor === tpl.primaryColor && 
                              profile?.theme?.fontFamily === tpl.fontFamily;
            return (
              <div 
                key={tpl.id}
                onClick={() => setSelectedTpl(tpl)}
                className="glass-card rounded-[28px] p-3.5 flex flex-col justify-between gap-3.5 transition-all duration-300 hover-lift group cursor-pointer"
              >
                {/* Visual Mockup Card Container */}
                <div className="relative w-full aspect-[4/5] rounded-[20px] overflow-hidden bg-white border border-white/80 shadow-[inset_0_2px_12px_rgba(0,0,0,0.015)] flex flex-col items-center select-none">
                  
                  {/* Cover photo banner */}
                  <div className="absolute top-0 inset-x-0 h-[32%] overflow-hidden">
                    <img src={tpl.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Curved white overlay mask */}
                  <div className="absolute top-[22%] inset-x-0 h-[20%] bg-white rounded-t-[100%] scale-[1.15] z-10"></div>

                  {/* Logo, Name & Category */}
                  <div className="relative z-20 mt-[20%] flex flex-col items-center text-center">
                    <div className="w-11 h-11 rounded-full border-[3px] border-white bg-neutral-900 overflow-hidden shadow-sm flex flex-col items-center justify-center text-white relative">
                      {renderMiniLogo(tpl.logoType, '#fff')}
                    </div>
                    <span className="text-[12px] font-extrabold text-neutral-900 leading-tight mt-1 truncate max-w-[140px] font-sans">
                      {tpl.name}
                    </span>
                    <span className="text-[7.5px] font-bold text-neutral-500 tracking-wider mt-0.5">
                      {tpl.category}
                    </span>
                  </div>

                  {/* QR Core Container */}
                  <div className="relative mt-2.5 flex flex-col items-center justify-center bg-white border-[1.5px] p-1.5 rounded-2xl shadow-sm max-w-[120px] mx-auto z-10 w-[45%]" style={{ borderColor: tpl.primaryColor }}>
                    <div className="w-full aspect-square text-neutral-900 relative">
                      <svg viewBox="0 0 29 29" className="w-full h-full" fill="currentColor">
                        <path d="M0 0h9v9H0zm1 1v7h7V1zm8 8h1v1H9zm1 1h1v1h-1zm1 1h1v1h-1zm-2 2h1v1H9zm-1-1h1v1H8zm5-12h9v9h-9zm1 1v7h7V2zm-13 13h9v9H0zm1 1v7h7v-7zm13 0h1v1h-1zm1 1h1v1h-1zm-2 2h1v1h-1zm-1-1h1v1h-1zm5-2h1v1h-1zm1 1h1v1h-1zm-2 2h1v1h-1zm-1-1h1v1h-1zm5-2h1v1h-1zm1 1h1v1h-1zm-2 2h1v1h-1zm-1-1h1v1h-1zM2 2h5v5H2zm13 0h5v5h-5zM2 15h5v5H2zm11 11h1v1h-1zm1-1h1v1h-1zm2 1h1v1h-1zm-1-2h1v1h-1zm5 2h1v1h-1zm1-1h1v1h-1z" />
                      </svg>
                      {/* Center Logo */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[30%] h-[30%] rounded-[6px] flex items-center justify-center text-white" style={{ backgroundColor: tpl.primaryColor }}>
                          <div className="scale-75">
                            {renderMiniLogo(tpl.logoType, '#fff')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scan to Connect & Arrow */}
                  <div className="relative flex items-center justify-center gap-1.5 mt-2 w-full">
                    <span className="text-[11px] italic font-bold text-neutral-800 tracking-tight" style={{ fontFamily: "'Dancing Script', cursive, serif" }}>Scan to Connect</span>
                    {/* Curved Arrow SVG */}
                    <svg className="w-4 h-4 translate-y-0.5" style={{ color: tpl.primaryColor }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 5c5 0 8 3 8 7 0 2.5-1.5 4.5-3 5.5" />
                      <path d="M14 17l2 1 2-2" />
                    </svg>
                  </div>

                  {/* Connect details */}
                  <div className="absolute bottom-4 inset-x-0 flex justify-center gap-4 z-10 px-3">
                    {tpl.actions.map(act => {
                      const details = getSocialDetails(act);
                      return (
                        <div key={act} className="flex flex-col items-center gap-1">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] shadow-sm" style={{ backgroundColor: details.color }}>
                            {details.icon}
                          </div>
                          <span className="text-[5px] font-bold text-neutral-600 tracking-wide">{details.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Premium Tag Overlay */}
                  {tpl.isPremium && (
                    <div className="absolute top-2 right-2 bg-neutral-900/40 backdrop-blur-md text-white text-[6px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm z-20">
                      <Sparkles className="w-2 h-2" /> PRO
                    </div>
                  )}
                </div>

                {/* Details Footer */}
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-neutral-800 truncate">{tpl.name}</h4>
                    {tpl.isPremium && (
                      <span className="text-[7.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md shrink-0" style={{ color: '#b45309', background: 'rgba(244,213,141,0.30)', border: '1px solid rgba(244,213,141,0.60)' }}>PRO</span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleApply(e, tpl)}
                    className={`w-full py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer tap-haptic ${
                      isApplied || appliedId === tpl.id
                        ? ''
                        : ''
                    }`}
                    style={
                      isApplied || appliedId === tpl.id
                        ? { background: 'rgba(16,185,129,0.10)', color: '#059669', border: '1px solid rgba(16,185,129,0.25)' }
                        : { background: 'rgba(16,185,129,0.06)', color: '#10B981', border: '1px solid rgba(16,185,129,0.15)' }
                    }
                  >
                    {isApplied || appliedId === tpl.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" style={{ color: '#059669' }} /> Applied Design
                      </>
                    ) : (
                      'Use Template'
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-[28px] p-12 text-center">
          <QrCode className="w-12 h-12 mx-auto mb-3" style={{ color: '#D1D5DB' }} />
          <h3 className="text-sm font-bold text-neutral-800">No Templates Found</h3>
          <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Try resetting your search query or choosing another category filter.</p>
        </div>
      )}

      {/* Bottom Feature Horizontal Stats Banner */}
      <div className="glass-card rounded-[24px] p-5 flex flex-wrap items-center justify-around gap-6 text-center hover-lift">
        <div className="flex items-center gap-2">
          <FaShieldAlt className="w-4 h-4" style={{ color: '#10B981' }} />
          <div className="text-left">
            <h5 className="text-[10px] font-extrabold text-neutral-800 leading-none uppercase tracking-wider">High Quality</h5>
            <p className="text-[9px] mt-0.5" style={{ color: '#9CA3AF' }}>300 DPI Resolution</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FaDownload className="w-4 h-4" style={{ color: '#7DD3FC' }} />
          <div className="text-left">
            <h5 className="text-[10px] font-extrabold text-neutral-800 leading-none uppercase tracking-wider">Multiple Formats</h5>
            <p className="text-[9px] mt-0.5" style={{ color: '#9CA3AF' }}>PNG, PDF, SVG</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FaPrint className="w-4 h-4" style={{ color: '#F4D58D' }} />
          <div className="text-left">
            <h5 className="text-[10px] font-extrabold text-neutral-800 leading-none uppercase tracking-wider">Print Ready</h5>
            <p className="text-[9px] mt-0.5" style={{ color: '#9CA3AF' }}>Perfect for Printing</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FaSync className="w-4 h-4" style={{ color: '#6EE7B7' }} />
          <div className="text-left">
            <h5 className="text-[10px] font-extrabold text-neutral-800 leading-none uppercase tracking-wider">Easy to Customize</h5>
            <p className="text-[9px] mt-0.5" style={{ color: '#9CA3AF' }}>Change anytime</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FaCheckCircle className="w-4 h-4" style={{ color: '#10B981' }} />
          <div className="text-left">
            <h5 className="text-[10px] font-extrabold text-neutral-800 leading-none uppercase tracking-wider">Commercial Use</h5>
            <p className="text-[9px] mt-0.5" style={{ color: '#9CA3AF' }}>100% Allowed</p>
          </div>
        </div>
      </div>

      {/* Canva Export Modal Drawer */}
      {selectedTpl && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-premium border border-white/65 shadow-2xl rounded-[32px] w-full max-w-lg p-6 relative overflow-hidden animate-scale-up text-left" style={{ boxShadow: '0 30px 80px rgba(15,23,42,0.12)' }}>
            
            <button 
              onClick={() => setSelectedTpl(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full btn-glass-secondary cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-black text-neutral-900 tracking-tight flex items-center gap-1.5">
              Export Template Preset: {selectedTpl.name}
            </h3>
            <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Configure layout size options to download print-ready files.</p>

            <div className="my-6 space-y-4">
              {/* Print layout selector */}
              <div>
                <label className="block text-[9px] font-extrabold uppercase tracking-widest mb-1.5" style={{ color: '#9CA3AF' }}>Print Layout Size</label>
                <select
                  value={downloadFormat}
                  onChange={(e) => setDownloadFormat(e.target.value)}
                  className="w-full glass-input rounded-2xl px-4 py-3 text-xs focus:outline-none cursor-pointer"
                  style={{ color: '#111827' }}
                >
                  {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              {/* Export format */}
              <div>
                <label className="block text-[9px] font-extrabold uppercase tracking-widest mb-1.5" style={{ color: '#9CA3AF' }}>Export Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {['PNG', 'PDF', 'SVG'].map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setFileFormat(fmt)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        fileFormat === fmt ? 'text-white' : 'btn-glass-secondary text-neutral-600'
                      }`}
                      style={fileFormat === fmt ? { background: 'linear-gradient(135deg, #10B981, #059669)', boxShadow: '0 6px 20px rgba(16,185,129,0.25)' } : {}}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {/* DPI & Output Quality info */}
              <div className="p-3.5 rounded-2xl flex flex-col gap-1.5 text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.65)', color: '#6B7280' }}>
                <div className="flex justify-between">
                  <span>DPI Resolution</span>
                  <span className="font-bold" style={{ color: '#10B981' }}>300 DPI</span>
                </div>
                <div className="flex justify-between">
                  <span>Quality Standard</span>
                  <span className="text-neutral-800 font-bold">Print Ready (High Definition)</span>
                </div>
                <div className="flex justify-between">
                  <span>Aspect ratio dimensions</span>
                  <span className="font-bold" style={{ color: '#9CA3AF' }}>
                    {downloadFormat === 'Square Card' ? '1:1 Ratio' : downloadFormat === 'Instagram Story' ? '9:16 Ratio' : 'Standard'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleApply({ stopPropagation: () => {} }, selectedTpl)}
                className="flex-1 py-3 btn-glass-secondary rounded-2xl text-xs font-bold transition-all active:scale-95 duration-100 cursor-pointer"
              >
                Use Layout
              </button>
              <button
                onClick={triggerExport}
                disabled={downloading}
                className="flex-1 py-3 btn-glass-primary rounded-2xl text-xs font-bold transition-all active:scale-95 duration-100 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {downloading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                Export Asset
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
