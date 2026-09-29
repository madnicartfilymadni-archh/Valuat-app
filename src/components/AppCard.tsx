import React, { useState } from 'react';
import { 
  ExternalLink, 
  Star, 
  Bookmark, 
  CheckCircle, 
  Download, 
  ArrowUpRight, 
  Info,
  Layers
} from 'lucide-react';
import { AppItem } from '../types';
import { useAppDirectory } from '../context/AppContext';
import { CATEGORIES } from '../data/defaultApps';

interface AppCardProps {
  app: AppItem;
}

export const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const { setSelectedApp, toggleBookmark, isBookmarked } = useAppDirectory();
  const [imageError, setImageError] = useState(false);
  const bookmarked = isBookmarked(app.id);

  const categoryInfo = CATEGORIES.find(c => c.id === app.category);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      
      {/* Top Card Body */}
      <div className="p-5 flex-1 flex flex-col">
        
        {/* Header: Logo, Category, Bookmark Button */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            {/* App Logo */}
            <div 
              onClick={() => setSelectedApp(app)}
              className="w-13 h-13 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs flex-shrink-0 cursor-pointer group-hover:scale-105 transition-transform"
            >
              {app.logoUrl && !imageError ? (
                <img
                  src={app.logoUrl}
                  alt={`${app.name} logo`}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {app.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Name & Developer */}
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 
                  onClick={() => setSelectedApp(app)}
                  className="font-bold text-slate-900 text-base hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
                >
                  {app.name}
                </h3>
                <span title="Verified Official Software / Website" className="text-emerald-500 inline-flex">
                  <CheckCircle className="w-4 h-4 fill-emerald-100" />
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                by {app.developer}
              </p>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(app.id)}
            aria-label={bookmarked ? `Remove ${app.name} from saved` : `Save ${app.name}`}
            className={`p-2 rounded-xl border transition-colors ${
              bookmarked
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'text-slate-400 hover:text-slate-700 bg-slate-50 border-slate-200/70 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Short Description */}
        <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed line-clamp-2 mb-3.5 flex-1">
          {app.tagline || app.description}
        </p>

        {/* Badges row: Category, Pricing, Rating */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 mb-2">
          {/* Category */}
          {categoryInfo && (
            <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border ${categoryInfo.color}`}>
              {categoryInfo.shortName}
            </span>
          )}

          {/* Pricing */}
          <span className="px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-700 rounded-md border border-slate-200">
            {app.pricing}
          </span>

          {/* Rating */}
          <div className="flex items-center gap-1 ml-auto text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            <span>{app.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Platform tags */}
        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
          <span className="text-slate-400">Works on:</span>
          <span className="text-slate-600 font-semibold truncate">
            {app.platforms.join(', ')}
          </span>
        </div>

      </div>

      {/* Card Action Footer */}
      <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => setSelectedApp(app)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
        >
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <span>Details</span>
        </button>

        <a
          href={app.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-xs transition-all"
        >
          <span>Visit Official</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

    </div>
  );
};
