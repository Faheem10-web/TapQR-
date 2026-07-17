import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinOff, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-805 flex items-center justify-center text-purple-400 mb-6">
        <MapPinOff className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-black font-outfit mb-2">Page Not Found</h1>
      <p className="text-sm text-neutral-400 max-w-sm mb-6">
        The page you are trying to visit does not exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold transition-all duration-100 flex items-center gap-2 cursor-pointer mx-auto"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Homepage
      </button>
    </div>
  );
}
