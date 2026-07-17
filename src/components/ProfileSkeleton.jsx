import React from 'react';

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#eaebf0] flex items-center justify-center p-0 md:p-6 font-sans">
      <div className="w-full max-w-[420px] min-h-screen md:min-h-[820px] md:h-[820px] md:rounded-[42px] md:border-[10px] md:border-white shadow-2xl bg-[#f4f5f8] flex flex-col justify-between overflow-hidden relative">
        
        {/* Shimmer scroll layout */}
        <div className="flex-1 pb-24 space-y-6">
          {/* Cover Image Shimmer */}
          <div className="relative h-44 w-full bg-neutral-200/70 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
          </div>

          {/* Profile Details Shimmer */}
          <div className="px-5 relative -mt-16 flex flex-col items-center text-center space-y-4">
            {/* Avatar Circle Shimmer */}
            <div className="relative w-28 h-28 rounded-full border-4 border-white bg-neutral-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
            </div>

            {/* Name Shimmer */}
            <div className="h-6 w-44 bg-neutral-200/80 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
            </div>

            {/* Category badge Shimmer */}
            <div className="h-5 w-24 bg-neutral-200/60 rounded-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
            </div>

            {/* Bio description Shimmer */}
            <div className="space-y-1.5 w-full max-w-sm px-4 pt-1">
              <div className="h-3 w-full bg-neutral-200/70 rounded relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
              </div>
              <div className="h-3 w-5/6 bg-neutral-200/70 rounded mx-auto relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Quick Actions Shimmer */}
          <div className="px-5">
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-white border border-neutral-100 rounded-2xl flex flex-col items-center justify-center gap-2 h-20 relative overflow-hidden shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-neutral-100"></div>
                  <div className="h-2 w-10 bg-neutral-100/80 rounded"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Social grid Shimmer */}
          <div className="px-5 space-y-3">
            <div className="h-3.5 w-24 bg-neutral-200/60 rounded relative overflow-hidden ml-1">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[1, 2, 4, 5].map((i) => (
                <div key={i} className="p-3.5 bg-white border border-neutral-100 rounded-2xl flex items-center gap-3 h-12 relative overflow-hidden shadow-sm">
                  <div className="w-6 h-6 rounded-lg bg-neutral-100 shrink-0"></div>
                  <div className="space-y-1 flex-1">
                    <div className="h-2 w-16 bg-neutral-100 rounded"></div>
                    <div className="h-1.5 w-10 bg-neutral-150/60 rounded"></div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Floating bottom action shimmer */}
        <div className="absolute bottom-0 inset-x-0 h-20 flex items-center justify-center px-5 border-t border-neutral-100 bg-white/70 backdrop-blur-md z-30">
          <div className="w-full h-11 bg-neutral-200/60 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
