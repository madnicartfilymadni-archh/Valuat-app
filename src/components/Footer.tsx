import React from 'react';
import { Layers, ShieldCheck, ArrowUp, ExternalLink, Heart } from 'lucide-react';
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
    <footer className="bg-white border-t border-slate-200 mt-16 pt-12 pb-8 text-slate-600">
      
      {/* Bottom Adsterra Leaderboard Banner */}
      <AdSlot id="adsterra-banner-bottom" format="footer-banner" className="mb-12" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-xs">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-slate-900">
                App<span className="text-indigo-600">Vault</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              A fast, clean, and reliable directory for discovering official software, generative AI tools, mobile apps, and productivity utilities.
            </p>

            <div className="pt-2 flex items-start gap-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p>
                <strong>Legal & Safety Notice:</strong> All links point exclusively to official vendor domains and verified app stores (Google Play, Apple App Store, official portals). We do not host APKs or unverified binaries.
              </p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              App Categories
            </h4>
            <ul className="space-y-1.5 text-xs">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className="hover:text-indigo-600 hover:underline transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* More Categories & Directory */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Explore & Admin
            </h4>
            <ul className="space-y-1.5 text-xs">
              {CATEGORIES.slice(5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className="hover:text-indigo-600 hover:underline transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li className="pt-1.5 flex flex-col gap-1.5">
                <a
                  href="/appvault-source-code.zip"
                  download="appvault-source-code.zip"
                  className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1 text-xs"
                >
                  <span>📦 Download Source Code (.ZIP)</span>
                </a>
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-1 text-left cursor-pointer"
                >
                  <span>Admin Portal</span> &rarr;
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} AppVault Directory. All official trademarks belong to their respective owners.</p>
          
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors p-1"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
