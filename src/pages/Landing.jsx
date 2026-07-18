import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, QrCode, Sparkles, Smartphone, ShieldCheck, BarChart3, Star, Heart, Globe, Phone } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [demoName, setDemoName] = useState('Alex Rivera');
  const [demoColor, setDemoColor] = useState('#0F6D73');

  const features = [
    {
      icon: Smartphone,
      title: "Mobile-First UX",
      desc: "Designed to look and feel like a native Apple app on scanning. Clean sheets, smooth transitions, and haptic feedback animations."
    },
    {
      icon: QrCode,
      title: "QR Studio Designer",
      desc: "Design custom QR codes that match your brand. Customize dark patterns, background hues, and overlay your avatar in the center."
    },
    {
      icon: BarChart3,
      title: "Rich Interaction Analytics",
      desc: "Track every view, custom link click, and vCard download. Analyze referrers and device categories directly on your dashboard."
    },
    {
      icon: ShieldCheck,
      title: "Zero Backend, Safe Storage",
      desc: "We run completely in-browser. All profiles and analytics remain securely stored in your local browser sandbox."
    }
  ];

  return (
    <div className="min-h-screen text-neutral-800 font-sans relative overflow-hidden flex flex-col justify-between" style={{ background: '#FCFCFA' }}>

      {/* Floating Glass Navbar */}
      <div className="relative w-full z-20 px-4 pt-5">
        <header className="max-w-5xl mx-auto glass-navbar rounded-full px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style={{ background: 'var(--accent-primary)' }}>
              <QrCode className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-outfit font-extrabold text-lg tracking-tight text-neutral-900">
              Tap<span style={{ color: 'var(--accent-primary)' }}>QR</span>
            </span>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            aria-label="Enter console dashboard"
            className="btn-glass-secondary px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer animate-fade-in"
          >
            Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </header>
      </div>

      {/* Hero Section */}
      <main className="relative flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto px-6 pt-10 pb-20 z-10 text-center space-y-14">
        
        {/* Main Pitch */}
        <div className="space-y-7 max-w-3xl animate-slide-up">
          <div className="chip-emerald animate-pulse-subtle mx-auto w-fit">
            <Sparkles className="w-3.5 h-3.5" /> Introducing TapQR PWA Edition
          </div>

          <h1 className="text-4xl md:text-6xl font-black font-outfit leading-tight md:leading-[1.08] tracking-tight text-neutral-900">
            One Scan.{' '}
            <br className="sm:hidden" />
            <span style={{ color: 'var(--accent-primary)' }}>
              Instantly Connected.
            </span>
          </h1>

          <p className="text-sm md:text-base max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
            Create premium mobile-first digital business profiles. Generate fully brand-customized QR codes, share instantly, and track interaction metrics locally.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              aria-label="Get started builder button"
              className="btn-glass-primary w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#demo"
              className="btn-glass-secondary w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold flex items-center justify-center"
            >
              Try Interactive Demo
            </a>
          </div>
        </div>

        {/* Interactive Playable Sandbox Demo Card */}
        <section id="demo" className="w-full max-w-3xl glass-card p-6 md:p-8 rounded-[24px] grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left relative overflow-hidden hover-lift">
          <div className="space-y-4 relative z-10">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--accent-primary)' }}>Playground Sandbox</span>
              <h2 className="text-xl md:text-2xl font-black font-outfit text-neutral-800">Live Customizer Demo</h2>
            </div>
            
            <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
              Interact below to see details compile in real time on the card mockup on the right.
            </p>

            <div className="space-y-3.5 pt-2">
              <div>
                <label htmlFor="demo-name-in" className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#9CA3AF' }}>Enter Demo Name</label>
                <input
                  id="demo-name-in"
                  type="text"
                  value={demoName}
                  onChange={(e) => setDemoName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="floatInputClass w-full text-xs focus:outline-none h-[46px] px-4 rounded-[14px]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: '#9CA3AF' }}>Brand Theme Color</label>
                <div className="flex gap-2.5">
                  {['#0F6D73', '#12C97A', '#7DD3FC', '#6EE7B7', '#111827'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setDemoColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        demoColor === c ? 'border-neutral-800 scale-115 shadow-md' : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Card Render Mockup */}
          <div className="relative flex justify-center z-10">
            <div className="w-[260px] h-[330px] rounded-3xl bg-white/90 border border-white/80 p-5 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:scale-[1.02] duration-300" style={{ boxShadow: '0 20px 60px rgba(15,23,42,0.10)' }}>
              {/* Radial gradient background based on theme */}
              <div 
                className="absolute top-[-30%] right-[-30%] w-48 h-48 rounded-full blur-[60px] opacity-15 pointer-events-none transition-all duration-500"
                style={{ backgroundColor: demoColor }}
              ></div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 border border-white overflow-hidden flex items-center justify-center shadow-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&h=300&fit=crop" 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div 
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: demoColor }}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <h3 className="font-extrabold text-neutral-800 text-sm tracking-tight flex items-center gap-1">
                    {demoName || 'Your Name'}
                    <span className="w-3.5 h-3.5 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-500 border border-sky-500/20 text-[7px] font-black">✓</span>
                  </h3>
                  <p className="text-[10px] text-neutral-500 font-medium">Lead Designer at Aura Studio</p>
                </div>

                <p className="text-[9px] text-neutral-400 leading-relaxed text-left line-clamp-3">
                  Crafting premium digital brand experiences. Play with this card to preview the dynamic output system.
                </p>
              </div>

              {/* Action grid preset */}
              <div className="grid grid-cols-2 gap-2 text-left pt-2 border-t border-neutral-100">
                <div className="p-2 rounded-xl bg-neutral-50/80 border border-neutral-100 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm" style={{ color: demoColor }}>
                    <Globe className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="text-[7px] font-bold text-neutral-400">Portfolio</p>
                    <p className="text-[8px] font-bold text-neutral-700">Visit Site</p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-neutral-50/80 border border-neutral-100 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm" style={{ color: demoColor }}>
                    <Phone className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="text-[7px] font-bold text-neutral-400">Call Me</p>
                    <p className="text-[8px] font-bold text-neutral-700">Phone</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="w-full space-y-10">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-black font-outfit text-neutral-900">Why Networking Professionals Choose TapQR</h2>
            <p className="text-xs md:text-sm max-w-xl mx-auto" style={{ color: '#6B7280' }}>
              We focus on premium visual details, micro-interactions, and instant loading speeds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
            {features.map((feat, idx) => (
              <div key={idx} className="glass-card p-5 rounded-[24px] hover-lift relative group overflow-hidden cursor-default">
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: 'var(--accent-soft)', border: '1px solid rgba(15, 109, 115, 0.2)', color: 'var(--accent-primary)' }}
                >
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-neutral-800 text-xs uppercase tracking-wider mb-2">{feat.title}</h3>
                <p className="text-[11px] leading-relaxed" style={{ color: '#6B7280' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Customer Testimonial Widget */}
        <section className="w-full max-w-3xl glass-card p-6 md:p-8 rounded-[24px] hover-lift">
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-xs md:text-sm italic leading-relaxed max-w-xl mx-auto" style={{ color: '#374151' }}>
            "I printed my customized TapQR code on my physical metal business cards. Customers are always amazed when they scan it and see a page that looks exactly like an official Apple app."
          </p>
          <p className="text-[10px] font-bold mt-4 uppercase tracking-widest" style={{ color: '#9CA3AF' }}>— Julian Sterling, Principal Architect</p>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative w-full glass-premium py-5 px-6 z-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[10px] font-semibold gap-4" style={{ color: '#9CA3AF' }}>
          <p>© 2026 TapQR Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 fill-rose-400 text-rose-400" /> on Earth
          </p>
        </div>
      </footer>
    </div>
  );
}
