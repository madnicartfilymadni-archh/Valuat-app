import React from 'react';
import { Search, Sparkles, ShieldCheck, ArrowRight, Zap, CheckCircle2, Image as ImageIcon, Wand2 } from 'lucide-react';
import { useAppDirectory } from '../context/AppContext';
import { AdSlot } from './AdSlot';

export const Hero: React.FC = () => {
  const { searchQuery, setSearchQuery, setSelectedCategory, setActiveTab, setIsBgRemoverOpen } = useAppDirectory();

  const trendingSearches = [
    { label: 'MovieBox', query: 'MovieBox' },
    { label: 'Background Remover', query: 'Background Remover' },
    { label: 'ChatGPT', query: 'ChatGPT' },
    { label: 'CapCut', query: 'CapCut' },
    { label: 'Canva', query: 'Canva' },
    { label: 'Photoroom', query: 'Photoroom' },
    { label: 'Photopea', query: 'Photopea' },
    { label: 'Notion', query: 'Notion' },
  ];

  return (
    <section className="relative pt-6 pb-4 bg-gradient-to-b from-indigo-50/60 via-slate-50 to-slate-50 border-b border-slate-200/80">
      
      {/* Background soft glow blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-4 left-1/4 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-8 right-1/4 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-100 shadow-xs mb-4">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-slate-700">
            Curated Directory of Official Apps & Online Tools
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-3">
          Discover the Best <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Apps & Tools</span> for Any Task
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto mb-5">
          Find top-rated AI tools, video & photo editors, productivity software, and Android apps with direct official websites & legal store links.
        </p>

        {/* Big Search Box */}
        <div className="max-w-2xl mx-auto mb-4">
          <div className="relative flex items-center bg-white rounded-2xl p-1.5 shadow-lg shadow-indigo-500/10 border border-slate-200 hover:border-indigo-300 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
            <div className="pl-3.5 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, category, use case (e.g., 'background remover', 'AI', 'video editor')..."
              className="w-full px-3 py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-2 py-1 text-xs text-slate-400 hover:text-slate-600 mr-1 rounded"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => {
                const el = document.getElementById('directory-content');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Trending Keyword Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Popular:
            </span>
            {trendingSearches.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.label === 'Background Remover') {
                    setSearchQuery('Background Remover');
                    setSelectedCategory('all');
                    setActiveTab('all');
                  } else {
                    setSearchQuery(item.query);
                    setSelectedCategory('all');
                    setActiveTab('all');
                  }
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg shadow-2xs transition-colors ${
                  item.label === 'Background Remover'
                    ? 'bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100 font-bold'
                    : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 hover:border-indigo-200'
                }`}
              >
                {item.label === 'Background Remover' ? '✨ ' + item.label : item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Background Remover Tool Spotlight Banner */}
        <div className="max-w-2xl mx-auto my-4 bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 border border-pink-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-left shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black text-slate-900">
                  Instant Online Background Remover
                </h4>
                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-pink-100 text-pink-700 rounded uppercase">
                  Free Tool
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Remove backgrounds 100% automatically with instant transparent PNG download.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBgRemoverOpen(true)}
            className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 active:scale-95 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer"
          >
            <span>Open Tool</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-2 pb-2 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>100% Official Links</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Zero APK Re-hosting</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Fast & Clean Experience</span>
          </div>
        </div>

        {/* Top Header Ad Placement Area (Adsterra Ready) */}
        <AdSlot id="adsterra-banner-top" format="banner-728x90" className="mt-6 mb-2" />

      </div>
    </section>
  );
};
