import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Download, 
  Star, 
  Bookmark, 
  ShieldCheck, 
  Share2, 
  CheckCircle2, 
  Layers, 
  Calendar, 
  Globe, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAppDirectory } from '../context/AppContext';
import { CATEGORIES } from '../data/defaultApps';
import { SMARTLINK_URL } from './AdSlot';
import { AppItem } from '../types';

export const AppDetailModal: React.FC = () => {
  const { selectedApp, setSelectedApp, toggleBookmark, isBookmarked, apps } = useAppDirectory();
  const [copied, setCopied] = useState(false);
  const [logoError, setLogoError] = useState(false);

  if (!selectedApp) return null;

  const bookmarked = isBookmarked(selectedApp.id);
  const categoryInfo = CATEGORIES.find(c => c.id === selectedApp.category);

  // Related apps in same category
  const relatedApps = apps
    .filter(a => a.category === selectedApp.category && a.id !== selectedApp.id)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}?app=${selectedApp.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Dialog Card */}
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            {categoryInfo && (
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${categoryInfo.color}`}>
                {categoryInfo.name}
              </span>
            )}
            <span className="text-xs font-bold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
              {selectedApp.pricing}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Share button */}
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors relative"
              title="Share App Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              {copied && (
                <span className="absolute -top-7 right-0 text-[10px] bg-slate-900 text-white font-bold px-2 py-0.5 rounded shadow-sm">
                  Copied!
                </span>
              )}
            </button>

            {/* Bookmark */}
            <button
              onClick={() => toggleBookmark(selectedApp.id)}
              className={`p-2 rounded-xl border transition-colors ${
                bookmarked
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'text-slate-400 hover:text-slate-700 bg-white border-slate-200'
              }`}
              title="Save to Bookmarks"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-rose-500' : ''}`} />
            </button>

            {/* Close */}
            <button
              onClick={() => setSelectedApp(null)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Main Info Hero */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-20 h-20 rounded-3xl overflow-hidden bg-white p-2.5 border border-slate-200 shadow-sm flex-shrink-0 flex items-center justify-center">
              {selectedApp.logoUrl && !logoError ? (
                <img
                  src={selectedApp.logoUrl}
                  alt={selectedApp.name}
                  onError={() => setLogoError(true)}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl text-white flex items-center justify-center font-bold text-2xl">
                  {selectedApp.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-slate-900">
                  {selectedApp.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Official
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Developer: <span className="font-semibold text-slate-700">{selectedApp.developer}</span> • Release/Updated: {selectedApp.createdAt}
              </p>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{selectedApp.rating.toFixed(1)} / 5.0</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  ({selectedApp.reviewCount.toLocaleString()} community ratings)
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-indigo-950">
                Official Access & Downloads
              </p>
              <p className="text-[11px] text-indigo-700">
                Direct legal access to the developer's official site or app store page.
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={selectedApp.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all"
              >
                <Globe className="w-4 h-4" />
                <span>Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {selectedApp.downloadUrl && (
                <a
                  href={selectedApp.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Page</span>
                </a>
              )}

              <a
                href={SMARTLINK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold rounded-xl transition-all"
                title="Special Deals & Recommended Software"
              >
                <span>🔥 Special Deal</span>
              </a>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              About This Tool
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {selectedApp.description}
            </p>
          </div>

          {/* Key Features */}
          {selectedApp.features && selectedApp.features.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Key Features & Capabilities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedApp.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-slate-700">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Compatibility & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Supported Platforms
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedApp.platforms.map((p) => (
                  <span key={p} className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Tags & Categories
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedApp.tags?.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 text-xs text-slate-600 bg-slate-50 rounded-md border border-slate-200">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Safe & Official Guarantee */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="text-xs text-emerald-900">
              <span className="font-bold">Verified Direct Links:</span> We link exclusively to official vendor domains and verified app stores. No third-party modified APKs or bloatware.
            </div>
          </div>

          {/* Related Tools */}
          {relatedApps.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                More in {categoryInfo?.name}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedApps.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => setSelectedApp(rel)}
                    className="p-3 rounded-2xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50 cursor-pointer transition-all flex items-center gap-2.5 group"
                  >
                    <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center font-bold text-slate-700">
                      {rel.logoUrl ? (
                        <img src={rel.logoUrl} alt={rel.name} className="w-full h-full object-cover" />
                      ) : (
                        rel.name.charAt(0)
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                        {rel.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {rel.pricing} • {rel.rating}★
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>AppVault Official Directory</span>
          <button
            onClick={() => setSelectedApp(null)}
            className="px-4 py-1.5 font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>

    </div>
  );
};
