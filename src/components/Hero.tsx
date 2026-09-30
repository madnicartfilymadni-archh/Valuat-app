import React from 'react';
import { Search, Sparkles, ArrowRight, Wand2 } from 'lucide-react';
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
    <section className="relative pt-6 pb-2 bg-gradient-to-b from-indigo-50/50 via-slate-50 to-slate-50 border-b border-slate-200/70">
      
      {/* Background soft glow blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-4 left-1/4 w-72 h-72 bg-indigo-300/15 rounded-full blur-3xl"></div>
        <div className="absolute top-8 right-1/4 w-80 h-80 bg-purple-300/15 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Clean Hero Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-2">
          Discover Best <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Apps & Tools</span>
        </h1>

        {/* Concise Subtitle */}
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mb-4">
          Find top AI tools, video & photo editors, productivity software, and Android apps.
        </p>

        {/* Clean Search Box */}
        <div className="max-w-xl mx-auto mb-3">
          <div className="relative flex items-center bg-white rounded-2xl p-1 shadow-md shadow-indigo-500/5 border border-slate-200 hover:border-indigo-300 focus-within:border-indigo-500 focus-within:ring-3 focus-within:ring-indigo-100 transition-all">
            <div className="pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps, tools or categories..."
              className="w-full px-2.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-2 py-1 text-xs text-slate-400 hover:text-slate-600 mr-1 rounded cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => {
                const el = document.getElementById('directory-content');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden sm:inline-flex items-center gap-1 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Quick Popular Keywords */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Popular:
            </span>
            {trendingSearches.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setSearchQuery(item.query);
                  setSelectedCategory('all');
                  setActiveTab('all');
                }}
                className={`px-2 py-0.5 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
                  item.label === 'Background Remover'
                    ? 'bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100 font-bold'
                    : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200'
                }`}
              >
                {item.label === 'Background Remover' ? '✨ ' + item.label : item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Compact Online Background Remover Spotlight */}
        <div className="max-w-xl mx-auto my-3 bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 border border-pink-200/70 rounded-xl p-2.5 sm:px-4 flex items-center justify-between gap-3 text-left shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 to-indigo-600 text-white flex items-center justify-center flex-shrink-0">
              <Wand2 className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  Background Remover
                </h4>
                <span className="px-1.5 py-0.2 text-[9px] font-bold bg-pink-100 text-pink-700 rounded uppercase">
                  Free
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                Instant transparent PNG background removal tool.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBgRemoverOpen(true)}
            className="px-3 py-1.5 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 active:scale-95 rounded-lg shadow-2xs transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer"
          >
            <span>Open</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Top Header Ad Placement Area (Adsterra 320x50) */}
        <AdSlot id="adsterra-banner-top" format="banner-320x50" className="mt-3 mb-1" />

      </div>
    </section>
  );
};
