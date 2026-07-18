import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertOctagon, RefreshCw, Home, ChevronRight } from 'lucide-react';

export default function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error('Captured by global ErrorBoundary:', error);

  // Extract error message/stack safely
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string' 
      ? error 
      : JSON.stringify(error) || 'An unknown error occurred';

  const errorStack = error instanceof Error ? error.stack : null;

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center font-sans relative overflow-hidden" 
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Main glass-card container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card rounded-[24px] p-8 md:p-10 flex flex-col items-center gap-6 max-w-lg w-full relative"
        style={{ 
          boxShadow: 'var(--shadow-premium)', 
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)'
        }}
      >
        {/* Warning Icon Badge */}
        <motion.div 
          initial={{ rotate: -15, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4, type: 'spring' }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center" 
          style={{ 
            background: 'var(--accent-soft)', 
            border: '1px solid rgba(15, 109, 115, 0.2)', 
            color: 'var(--accent-primary)' 
          }}
        >
          <AlertOctagon className="w-8 h-8" />
        </motion.div>

        {/* Messaging */}
        <div className="space-y-3">
          <h1 className="text-2xl font-black font-outfit text-neutral-900 tracking-tight">
            Unexpected Error Occurred
          </h1>
          <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
            The application crashed while rendering this view. This has been logged, but you can try reloading the page or returning home.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button
            onClick={() => window.location.reload()}
            className="btn-glass-primary px-6 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer h-[48px] text-white flex-1"
          >
            <RefreshCw className="w-4 h-4" /> Reload Page
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="btn-glass-secondary px-6 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer h-[48px] flex-1"
          >
            <Home className="w-4 h-4 text-neutral-600" /> Go Back Home
          </button>
        </div>

        {/* Developer Diagnostics Expandable details */}
        <div className="w-full border-t border-dashed mt-4 pt-4" style={{ borderColor: 'var(--border-color)' }}>
          <details className="group text-left">
            <summary className="list-none flex items-center gap-1.5 cursor-pointer text-[10px] text-neutral-400 hover:text-neutral-600 transition-colors font-bold uppercase tracking-wider select-none">
              <ChevronRight className="w-3.5 h-3.5 transform group-open:rotate-90 transition-transform duration-200" />
              Diagnostics (Developer Info)
            </summary>
            
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-3 overflow-hidden"
            >
              <div className="bg-[#18181B] text-[#F4F4F5] p-4 rounded-xl text-[11px] font-mono leading-relaxed overflow-x-auto border border-[#27272A] shadow-inner max-h-[180px] no-scrollbar">
                <div className="text-amber-400 font-semibold mb-1">Error: {errorMessage}</div>
                {errorStack && (
                  <pre className="text-[#A1A1AA] whitespace-pre-wrap select-text selection:bg-amber-400/20">{errorStack}</pre>
                )}
              </div>
            </motion.div>
          </details>
        </div>
      </motion.div>
    </div>
  );
}
