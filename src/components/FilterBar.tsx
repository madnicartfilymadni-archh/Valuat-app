import React from 'react';
import { 
  Flame, 
  Sparkles, 
  Star, 
  Bookmark, 
  LayoutGrid, 
  SlidersHorizontal, 
  RotateCcw,
  ArrowUpDown
} from 'lucide-react';
import { useAppDirectory } from '../context/AppContext';
import { Platform, PricingModel, SortOption } from '../types';

export const FilterBar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedPlatform,
    setSelectedPlatform,
    selectedPricing,
    setSelectedPricing,
    sortOption,
    setSortOption,
    bookmarks,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    setSearchQuery,
  } = useAppDirectory();

  const isFiltered = selectedPlatform !== 'all' || selectedPricing !== 'all' || searchQuery !== '' || selectedCategory !== 'all' || activeTab !== 'all';

  const handleResetFilters = () => {
    setSelectedPlatform('all');
    setSelectedPricing('all');
    setSelectedCategory('all');
    setActiveTab('all');
    setSearchQuery('');
  };

  return (
    <div id="directory-content" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-3">
        
        {/* Top Row: Primary Navigation Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none no-scrollbar">
            
            {/* Tab: All */}
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'all'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>All Apps</span>
            </button>

            {/* Tab: Trending */}
            <button
              onClick={() => setActiveTab('trending')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'trending'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Trending Apps</span>
            </button>

            {/* Tab: Latest */}
            <button
              onClick={() => setActiveTab('latest')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'latest'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Latest Added</span>
            </button>

            {/* Tab: Popular */}
            <button
              onClick={() => setActiveTab('popular')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'popular'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-purple-500" />
              <span>Popular / Top Rated</span>
            </button>

            {/* Tab: Bookmarks */}
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'bookmarks'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-rose-500" />
              <span>Saved ({bookmarks.length})</span>
            </button>

          </div>

          {/* Right side: Sort Selector */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sort by:</span>
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              aria-label="Sort by"
              className="text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="trending">🔥 Trending First</option>
              <option value="rating">⭐ Highest Rated</option>
              <option value="latest">✨ Newest First</option>
              <option value="popular">👑 Most Popular</option>
              <option value="name-asc">🔤 Name (A - Z)</option>
            </select>
          </div>

        </div>

        {/* Bottom Filter Controls (Platform & Pricing) */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Platform Dropdown */}
            <div className="flex items-center gap-1">
              <label htmlFor="platform-select" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Platform:</label>
              <select
                id="platform-select"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as Platform | 'all')}
                aria-label="Platform"
                className="text-xs font-semibold bg-slate-100 hover:bg-slate-200/70 border-none text-slate-700 rounded-lg px-2.5 py-1 outline-none cursor-pointer"
              >
                <option value="all">All Platforms</option>
                <option value="Web">🌐 Web</option>
                <option value="Android">🤖 Android</option>
                <option value="iOS">🍏 iOS</option>
                <option value="Windows">🪟 Windows</option>
                <option value="macOS">🍎 macOS</option>
                <option value="Linux">🐧 Linux</option>
              </select>
            </div>

            {/* Pricing Dropdown */}
            <div className="flex items-center gap-1">
              <label htmlFor="pricing-select" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pricing:</label>
              <select
                id="pricing-select"
                value={selectedPricing}
                onChange={(e) => setSelectedPricing(e.target.value as PricingModel | 'all')}
                aria-label="Pricing"
                className="text-xs font-semibold bg-slate-100 hover:bg-slate-200/70 border-none text-slate-700 rounded-lg px-2.5 py-1 outline-none cursor-pointer"
              >
                <option value="all">All Pricing</option>
                <option value="Free">Free</option>
                <option value="Freemium">Freemium</option>
                <option value="Open Source">Open Source</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

          </div>

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
