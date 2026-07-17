import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinOff, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center font-sans relative overflow-hidden" style={{ background: '#F8FAF8' }}>
      {/* Glass card container */}
      <div className="glass-card rounded-[28px] p-10 flex flex-col items-center gap-6 max-w-sm w-full hover-lift" style={{ boxShadow: '0 20px 60px rgba(15,23,42,0.08)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.10)', border: '1px solid rgba(16, 185, 129, 0.22)', color: '#059669' }}>
          <MapPinOff className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black font-outfit text-neutral-900">Page Not Found</h1>
          <p className="text-sm max-w-sm" style={{ color: '#6B7280' }}>
            The page you are trying to visit does not exist or has been moved.
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="btn-glass-primary px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer mx-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Homepage
        </button>
      </div>
    </div>
  );
}
