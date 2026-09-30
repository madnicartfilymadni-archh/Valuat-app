import React, { useState } from 'react';
import { 
  Star, 
  Bookmark, 
  CheckCircle, 
  ArrowUpRight, 
  Info
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
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden">
      
      {/* Top Card Body */}
      <div className="p-4 flex-1 flex flex-col">
        
        {/* Header: Logo, Category, Bookmark Button */}
        <div className="flex items-start justify-between gap-2.5 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* App Logo */}
            <div 
              onClick={() => setSelectedApp(app)}
              className="w-11 h-11 rounded-xl overflow-hidden bg-white p-1.5 border border-slate-200/90 shadow-2xs flex-shrink-0 cursor-pointer group-hover:scale-105 transition-transform flex items-center justify-center"
            >
              {app.logoUrl && !imageError ? (
                <img
                  src={app.logoUrl}
                  alt={`${app.name} logo`}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-base">
                  {app.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Name & Developer */}
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <h3 
                  onClick={() => setSelectedApp(app)}
                  className="font-bold text-slate-900 text-sm hover:text-indigo-600 transition-colors cursor-pointer truncate"
                >
                  {app.name}
                </h3>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100 flex-shrink-0" />
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {app.developer}
              </p>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(app.id)}
            aria-label={bookmarked ? `Remove ${app.name} from saved` : `Save ${app.name}`}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer flex-shrink-0 ${
              bookmarked
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'text-slate-400 hover:text-slate-700 bg-slate-50 border-slate-200/70 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3 flex-1">
          {app.tagline || app.description}
        </p>

        {/* Badges row: Category, Pricing, Rating */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {categoryInfo && (
            <span className={`px-2 py-0.2 text-[10px] font-semibold rounded-md border ${categoryInfo.color}`}>
              {categoryInfo.shortName}
            </span>
          )}

          <span className="px-1.5 py-0.2 text-[10px] font-medium bg-slate-100 text-slate-600 rounded-md">
            {app.pricing}
          </span>

          <div className="flex items-center gap-0.5 ml-auto text-[11px] font-bold text-amber-600">
            <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
            <span>{app.rating.toFixed(1)}</span>
          </div>
        </div>

      </div>

      {/* Card Action Footer */}
      <div className="bg-slate-50/70 px-3.5 py-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => setSelectedApp(app)}
          className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          <Info className="w-3 h-3 text-slate-400" />
          <span>Details</span>
        </button>

        <a
          href={app.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg shadow-2xs transition-all"
        >
          <span>Open</span>
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

    </div>
  );
};
