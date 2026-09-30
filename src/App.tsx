import React, { useEffect } from 'react';
import { AppProvider, useAppDirectory } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { OfficialApkSection } from './components/OfficialApkSection';
import { CategoryChips } from './components/CategoryChips';
import { FilterBar } from './components/FilterBar';
import { AppGrid } from './components/AppGrid';
import { AppDetailModal } from './components/AppDetailModal';
import { BackgroundRemoverModal } from './components/BackgroundRemoverModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { SeoManager } from './components/SeoManager';

const AppContent: React.FC = () => {
  const { apps, setSelectedApp, setSelectedCategory, isBgRemoverOpen, setIsBgRemoverOpen } = useAppDirectory();

  // Support direct URL params like ?app=chatgpt or ?category=ai-tools or ?tool=bg-remover
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const appParam = urlParams.get('app');
      const categoryParam = urlParams.get('category');
      const toolParam = urlParams.get('tool');

      if (toolParam === 'bg-remover' || toolParam === 'background-remover') {
        setIsBgRemoverOpen(true);
      }

      if (appParam) {
        const found = apps.find(a => a.id.toLowerCase() === appParam.toLowerCase());
        if (found) {
          setSelectedApp(found);
        }
      }

      if (categoryParam) {
        setSelectedCategory(categoryParam as any);
      }
    } catch (e) {
      console.error(e);
    }
  }, [apps, setSelectedApp, setSelectedCategory, setIsBgRemoverOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Dynamic SEO & OpenGraph Synchronizer */}
      <SeoManager />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Banner & Live Search */}
        <Hero />

        {/* Separate Official Tool APK Section */}
        <OfficialApkSection />

        {/* Categories Pills */}
        <CategoryChips />

        {/* Tabs & Filtering Controls */}
        <FilterBar />

        {/* Catalog Grid with in-feed Ad slots */}
        <AppGrid />
      </main>

      {/* Built-in Background Remover Online Tool Modal */}
      <BackgroundRemoverModal 
        isOpen={isBgRemoverOpen} 
        onClose={() => setIsBgRemoverOpen(false)} 
      />

      {/* App Details Modal */}
      <AppDetailModal />

      {/* Admin Panel Modal */}
      <AdminPanel />

      {/* Site Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
