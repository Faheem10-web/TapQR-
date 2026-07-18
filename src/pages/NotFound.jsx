import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinOff, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center font-sans relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Glass card container */}
      <div className="glass-card rounded-[24px] p-10 flex flex-col items-center gap-6 max-w-sm w-full hover-lift" style={{ boxShadow: 'var(--shadow-premium)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent-soft)', border: '1px solid rgba(15, 109, 115, 0.2)', color: 'var(--accent-primary)' }}>
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
          className="btn-glass-primary px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer mx-auto h-[48px]"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Homepage
        </button>
      </div>
    </div>
  );
}
