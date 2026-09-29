import React from 'react';

interface AdSlotProps {
  id: string;
  format: 'banner-728x90' | 'square-300x250' | 'native-card' | 'footer-banner';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ id, format, className = '' }) => {
  if (format === 'banner-728x90') {
    return (
      <div className={`w-full max-w-5xl mx-auto my-6 ${className}`}>
        <div 
          id={id} 
          className="ad-slot-container border border-dashed border-slate-300 bg-slate-100/80 rounded-xl p-3 min-h-[90px] flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-xs"
        >
          <div className="absolute top-1.5 right-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            Advertisement
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Adsterra Ready Slot ({id}) — 728x90 / Responsive Leaderboard</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Ad space reserved for banner scripts
          </p>
        </div>
      </div>
    );
  }

  if (format === 'square-300x250') {
    return (
      <div className={`w-full max-w-sm mx-auto my-4 ${className}`}>
        <div 
          id={id} 
          className="ad-slot-container border border-dashed border-slate-300 bg-slate-100/80 rounded-xl p-4 min-h-[250px] flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-xs"
        >
          <div className="absolute top-2 right-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            Advertisement
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 font-bold mb-2">
            Ad
          </div>
          <span className="text-slate-600 text-xs font-semibold">
            Adsterra 300x250 Medium Rectangle
          </span>
          <span className="text-[11px] text-slate-400 mt-1">
            Slot ID: #{id}
          </span>
        </div>
      </div>
    );
  }

  if (format === 'native-card') {
    return (
      <div 
        id={id} 
        className={`bg-gradient-to-br from-indigo-50/70 via-slate-50 to-purple-50/70 rounded-2xl border border-dashed border-indigo-200 p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all ${className}`}
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 rounded-md">
              Sponsored
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Ad Placement
            </span>
          </div>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              Ad
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Adsterra Native Ad Space</h4>
              <p className="text-xs text-slate-500">In-Feed Native Banner Slot</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 line-clamp-3 mb-4">
            Placeholder for Adsterra native banner or direct link campaign. Perfectly styled to match directory cards.
          </p>
        </div>

        <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">ID: {id}</span>
          <span className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700">
            Learn More &rarr;
          </span>
        </div>
      </div>
    );
  }

  // Footer Banner format
  return (
    <div className={`w-full max-w-5xl mx-auto my-8 ${className}`}>
      <div 
        id={id} 
        className="ad-slot-container border border-dashed border-slate-300 bg-slate-100/90 rounded-2xl p-4 min-h-[90px] flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xs"
      >
        <div className="absolute top-2 right-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          Advertisement
        </div>
        <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold">
          <span>Adsterra Footer Banner Slot ({id})</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          728x90 Desktop / 320x50 Mobile Responsive Container
        </p>
      </div>
    </div>
  );
};
