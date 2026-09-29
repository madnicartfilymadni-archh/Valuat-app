import React, { useMemo } from 'react';
import { useAppDirectory } from '../context/AppContext';
import { AppCard } from './AppCard';
import { AdSlot } from './AdSlot';
import { Sparkles, SearchX, RotateCcw } from 'lucide-react';
import { AppItem } from '../types';

export const AppGrid: React.FC = () => {
  const {
    apps,
    searchQuery,
    selectedCategory,
    activeTab,
    selectedPlatform,
    selectedPricing,
    sortOption,
    bookmarks,
    setSelectedCategory,
    setActiveTab,
    setSelectedPlatform,
    setSelectedPricing,
    setSearchQuery,
  } = useAppDirectory();

  const filteredApps = useMemo(() => {
    let result = [...apps];

    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((app) => {
        const inName = app.name.toLowerCase().includes(q);
        const inTagline = app.tagline?.toLowerCase().includes(q) || false;
        const inDesc = app.description?.toLowerCase().includes(q) || false;
        const inDev = app.developer?.toLowerCase().includes(q) || false;
        const inTags = app.tags?.some(tag => tag.toLowerCase().includes(q)) || false;
        const inCategory = app.category?.toLowerCase().includes(q) || false;
        return inName || inTagline || inDesc || inDev || inTags || inCategory;
      });
    }

    // 2. Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter((app) => app.category === selectedCategory);
    }

    // 3. Tab Filter
    if (activeTab === 'trending') {
      result = result.filter((app) => app.isTrending);
    } else if (activeTab === 'latest') {
      result = result.filter((app) => app.isLatest || (new Date(app.createdAt) > new Date('2024-01-01')));
    } else if (activeTab === 'popular') {
      result = result.filter((app) => app.isPopular || app.rating >= 4.8);
    } else if (activeTab === 'bookmarks') {
      result = result.filter((app) => bookmarks.includes(app.id));
    }

    // 4. Platform Filter
    if (selectedPlatform !== 'all') {
      result = result.filter((app) => app.platforms.includes(selectedPlatform));
    }

    // 5. Pricing Filter
    if (selectedPricing !== 'all') {
      result = result.filter((app) => app.pricing === selectedPricing);
    }

    // 6. Sorting
    result.sort((a, b) => {
      if (sortOption === 'trending') {
        if (a.isTrending && !b.isTrending) return -1;
        if (!a.isTrending && b.isTrending) return 1;
        return b.rating - a.rating;
      }
      if (sortOption === 'rating') {
        return b.rating - a.rating;
      }
      if (sortOption === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOption === 'popular') {
        return b.reviewCount - a.reviewCount;
      }
      if (sortOption === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return result;
  }, [
    apps,
    searchQuery,
    selectedCategory,
    activeTab,
    selectedPlatform,
    selectedPricing,
    sortOption,
    bookmarks,
  ]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setActiveTab('all');
    setSelectedPlatform('all');
    setSelectedPricing('all');
  };

  if (filteredApps.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <SearchX className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            No Apps or Tools Found
          </h3>
          <p className="text-xs text-slate-500 mb-6 text-center">
            {activeTab === 'bookmarks'
              ? "You haven't saved any apps to your favorites yet. Click the bookmark icon on any card to save it."
              : "We couldn't find any tool matching your filters. Try adjusting your search query or reset filters."}
          </p>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      
      {/* Grid count header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Showing
          </span>
          <span className="text-xs font-black text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {filteredApps.length} {filteredApps.length === 1 ? 'Tool' : 'Tools'}
          </span>
        </div>
      </div>

      {/* Main Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredApps.map((app, index) => {
          return (
            <React.Fragment key={app.id}>
              {/* The App Card */}
              <AppCard app={app} />

              {/* In-feed Adsterra Native Ad Slot after item 3 */}
              {index === 2 && (
                <AdSlot 
                  id="adsterra-native-feed-1" 
                  format="native-card" 
                  className="h-full"
                />
              )}

              {/* Second Adsterra Slot after item 9 */}
              {index === 8 && (
                <AdSlot 
                  id="adsterra-native-feed-2" 
                  format="native-card" 
                  className="h-full"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Middle Banner Ad Placement Area */}
      <AdSlot 
        id="adsterra-banner-middle" 
        format="banner-728x90" 
        className="mt-10" 
      />

    </div>
  );
};
