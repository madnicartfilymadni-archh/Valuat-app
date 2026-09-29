import React from 'react';
import { CATEGORIES } from '../data/defaultApps';
import { CategoryIcon } from './CategoryIcon';
import { useAppDirectory } from '../context/AppContext';
import { CategoryId } from '../types';

export const CategoryChips: React.FC = () => {
  const { apps, selectedCategory, setSelectedCategory, setActiveTab } = useAppDirectory();

  const getCategoryCount = (catId: CategoryId | 'all') => {
    if (catId === 'all') return apps.length;
    return apps.filter(app => app.category === catId).length;
  };

  const handleSelect = (catId: CategoryId | 'all') => {
    setSelectedCategory(catId);
    if (selectedCategory !== catId) {
      setActiveTab('all');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Browse by Category
        </h2>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => handleSelect('all')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
          >
            Show All ({apps.length})
          </button>
        )}
      </div>

      {/* Horizontal scrollable category pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        
        {/* "All" button */}
        <button
          onClick={() => handleSelect('all')}
          className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CategoryIcon categoryId="all" size={16} />
          <span>All Categories</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            selectedCategory === 'all' ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-600'
          }`}>
            {getCategoryCount('all')}
          </span>
        </button>

        {/* Dynamic Category buttons */}
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = getCategoryCount(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 ring-2 ring-indigo-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <CategoryIcon categoryId={cat.id} size={16} className={isSelected ? 'text-white' : 'text-indigo-600'} />
              <span>{cat.name}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                isSelected ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}

      </div>
    </div>
  );
};
