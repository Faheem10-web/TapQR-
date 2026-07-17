import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, QrCode, Sparkles, Smartphone, ShieldCheck, BarChart3, Star, Heart, Globe, Phone } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [demoName, setDemoName] = useState('Alex Rivera');
  const [demoColor, setDemoColor] = useState('#a855f7');

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
    <div className="min-h-screen bg-[#f4f5f8] text-neutral-800 font-sans relative overflow-hidden flex flex-col justify-between">
      {/* Background radial glowing effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none"></div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

      {/* Top Header Navigation */}
      <header className="relative w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-md shadow-purple-500/15">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <span className="font-outfit font-extrabold text-xl tracking-tight bg-gradient-to-r from-neutral-800 to-neutral-900 bg-clip-text text-transparent">
            Tap<span className="text-purple-600">QR</span>
          </span>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          aria-label="Enter console dashboard"
          className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-50 active:scale-95 text-xs font-bold transition-all duration-150 flex items-center gap-1.5 cursor-pointer text-neutral-700 border border-neutral-200/60 shadow-sm"
        >
          Go to Dashboard <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Hero Section */}
      <main className="relative flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto px-6 pt-12 pb-20 z-10 text-center space-y-16">
        
        {/* Main Pitch */}
        <div className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 text-xs font-semibold animate-pulse-subtle">
            <Sparkles className="w-3.5 h-3.5" /> Introducing TapQR PWA Edition
          </div>

          <h1 className="text-4xl md:text-6xl font-black font-outfit leading-tight md:leading-[1.1] tracking-tight text-neutral-900">
            One Scan. <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-purple-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
              Instantly Connected.
            </span>
          </h1>

          <p className="text-sm md:text-base text-neutral-550 max-w-2xl mx-auto leading-relaxed">
            Create premium mobile-first digital business profiles. Generate fully brand-customized QR codes, share instantly, and track interaction metrics locally.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              aria-label="Get started builder button"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-lg shadow-purple-500/20 active:scale-95 duration-100 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#demo"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-200 shadow-sm text-neutral-700 font-bold text-sm duration-100 flex items-center justify-center"
            >
              Try Interactive Demo
            </a>
          </div>
        </div>

        {/* Interactive Playable Sandbox Demo Card */}
        <section id="demo" className="w-full max-w-3xl bg-white/70 border border-neutral-200/80 backdrop-blur-md p-6 md:p-8 rounded-[28px] grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left relative overflow-hidden shadow-lg">
          <div className="space-y-4 relative z-10">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600">Playground Sandbox</span>
              <h2 className="text-xl md:text-2xl font-black font-outfit text-neutral-800">Live Customizer Demo</h2>
            </div>
            
            <p className="text-xs text-neutral-500 leading-relaxed">
              Interact below to see details compile in real time on the card mockup on the right.
            </p>

            <div className="space-y-3.5 pt-2">
              <div>
                <label htmlFor="demo-name-in" className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Enter Demo Name</label>
                <input
                  id="demo-name-in"
                  type="text"
                  value={demoName}
                  onChange={(e) => setDemoName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full bg-white/80 border border-neutral-200 text-neutral-800 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Brand Theme Color</label>
                <div className="flex gap-2.5">
                  {['#a855f7', '#f59e0b', '#3b82f6', '#10b981', '#ef4444'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setDemoColor(c)}
                      className={`w-7 h-7 rounded-full border transition-all cursor-pointer ${
                        demoColor === c ? 'border-neutral-800 scale-110 shadow-md' : 'border-transparent opacity-75 hover:opacity-100'
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
            <div className="w-[260px] h-[330px] rounded-3xl bg-white border border-neutral-200/80 p-5 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:scale-[1.02] duration-300">
              {/* Radial gradient background based on theme */}
              <div 
                className="absolute top-[-30%] right-[-30%] w-48 h-48 rounded-full blur-[60px] opacity-10 pointer-events-none transition-all duration-500"
                style={{ backgroundColor: demoColor }}
              ></div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center shadow-inner">
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
                <div className="p-2 rounded-xl bg-neutral-50/50 border border-neutral-200/60 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm" style={{ color: demoColor }}>
                    <Globe className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="text-[7px] font-bold text-neutral-400">Portfolio</p>
                    <p className="text-[8px] font-bold text-neutral-700">Visit Site</p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-neutral-50/50 border border-neutral-200/60 flex items-center gap-2">
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
        <section className="w-full space-y-12">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-black font-outfit text-neutral-900">Why Networking Professionals Choose TapQR</h2>
            <p className="text-xs md:text-sm text-neutral-500 max-w-xl mx-auto">
              We focus on premium visual details, micro-interactions, and instant loading speeds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {features.map((feat, idx) => (
              <div key={idx} className="bg-white border border-neutral-200 p-5 rounded-2xl hover:border-purple-400 duration-200 relative group overflow-hidden shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white duration-350 transition-all">
                  <feat.icon className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-neutral-800 text-xs uppercase tracking-wider mb-2 font-outfit">{feat.title}</h3>
                <p className="text-neutral-500 text-[11px] leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Customer Testimonial Widget */}
        <section className="w-full max-w-3xl bg-white border border-neutral-200 p-6 rounded-2xl relative shadow-sm">
          <div className="flex justify-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-xs md:text-sm italic text-neutral-600 leading-relaxed max-w-xl mx-auto">
            "I printed my customized TapQR code on my physical metal business cards. Customers are always amazed when they scan it and see a page that looks exactly like an official Apple app."
          </p>
          <p className="text-[10px] font-bold mt-3 text-neutral-400 uppercase tracking-widest">— Julian Sterling, Principal Architect</p>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative w-full border-t border-neutral-200/80 bg-white/60 py-6 px-6 z-10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[10px] font-semibold text-neutral-400 gap-4">
          <p>© 2026 TapQR Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 fill-rose-500 text-rose-500" /> on Earth
          </p>
        </div>
      </footer>
    </div>
  );
}
