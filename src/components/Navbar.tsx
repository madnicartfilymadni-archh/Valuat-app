import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Bookmark, 
  Settings, 
  Sparkles, 
  X, 
  Menu,
  ExternalLink,
  PlusCircle
} from 'lucide-react';
import { useAppDirectory } from '../context/AppContext';
import { CATEGORIES } from '../data/defaultApps';
import { SMARTLINK_URL } from './AdSlot';

export const Navbar: React.FC = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    bookmarks, 
    activeTab, 
    setActiveTab, 
    selectedCategory,
    setSelectedCategory,
    setIsAdminOpen,
    setIsBgRemoverOpen
  } = useAppDirectory();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCategoryClick = (catId: any) => {
    setSelectedCategory(catId);
    setActiveTab('all');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleBookmarksClick = () => {
    setActiveTab('bookmarks');
    setSelectedCategory('all');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => {
              setSelectedCategory('all');
              setActiveTab('all');
              setSearchQuery('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  App<span className="text-indigo-600">Vault</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded">
                  Directory
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Discover Apps & Online Tools
              </p>
            </div>
          </div>

          {/* Quick Search Input (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search apps, AI tools, video editors, utilities..."
                className="w-full pl-10 pr-9 py-2 text-sm bg-slate-100 hover:bg-slate-100/80 focus:bg-white border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl text-slate-900 placeholder:text-slate-400 transition-all outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            {/* Sponsored Smartlink Deals */}
            <a
              href={SMARTLINK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/90 rounded-xl transition-all shadow-xs"
              title="Special Deals & Exclusive Offers"
            >
              <span>🔥 Deals</span>
            </a>

            {/* Quick Background Remover Tool */}
            <button
              onClick={() => setIsBgRemoverOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200/80 rounded-xl transition-all shadow-xs cursor-pointer"
              title="Instant Online Background Remover"
            >
              <Sparkles className="w-4 h-4 text-pink-600" />
              <span className="hidden sm:inline">BG Remover</span>
            </button>

            {/* Bookmarks counter */}
            <button
              onClick={handleBookmarksClick}
              className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                activeTab === 'bookmarks'
                  ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="View Bookmarked Apps"
            >
              <Bookmark className={`w-4 h-4 ${bookmarks.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="hidden sm:inline">Saved</span>
              {bookmarks.length > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-rose-500 text-white rounded-full">
                  {bookmarks.length}
                </span>
              )}
            </button>

            {/* Admin trigger */}
            <button
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-xs shadow-indigo-600/30 transition-all cursor-pointer"
              title="Manage Apps & Add Tools"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2">
          {/* Mobile search bar */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps and tools..."
              className="w-full pl-10 pr-9 py-2 text-sm bg-slate-100 rounded-xl border border-slate-200 text-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Categories Navigation */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Browse Categories
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleCategoryClick('all')}
                className={`text-left px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`text-left px-3 py-2 text-xs font-semibold rounded-lg border truncate transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {cat.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Admin & Actions */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsBgRemoverOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 text-xs font-bold text-center text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-pink-600" />
              Open Background Remover Tool
            </button>
            <button
              onClick={() => {
                setIsAdminOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 text-xs font-bold text-center text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Add / Manage Tools
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
