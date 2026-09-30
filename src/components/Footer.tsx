import React from 'react';
import { Layers, ArrowUp } from 'lucide-react';
import { CATEGORIES } from '../data/defaultApps';
import { useAppDirectory } from '../context/AppContext';
import { AdSlot } from './AdSlot';

export const Footer: React.FC = () => {
  const { setSelectedCategory, setActiveTab, setSearchQuery, setIsAdminOpen } = useAppDirectory();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (catId: any) => {
    setSelectedCategory(catId);
    setActiveTab('all');
    setSearchQuery('');
    const el = document.getElementById('directory-content');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-slate-200 mt-12 pt-8 pb-6 text-slate-600">
      
      {/* Bottom Adsterra Banner */}
      <AdSlot id="adsterra-banner-bottom" format="footer-banner" className="mb-8" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-8">
          
          {/* Brand Info */}
          <div className="sm:col-span-3 md:col-span-2 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-base font-black text-slate-900">
                App<span className="text-indigo-600">Vault</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-500 max-w-sm">
              Discover official tools, generative AI software, video & photo editors, and mobile apps.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5">
              Categories
            </h4>
            <ul className="space-y-1 text-xs">
              {CATEGORIES.slice(0, 4).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className="hover:text-indigo-600 hover:underline cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2.5">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  Admin Portal &rarr;
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} AppVault. All rights reserved.</p>
          
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-600 p-1 cursor-pointer"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
