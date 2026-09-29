import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppItem, CategoryId, Platform, PricingModel, SortOption, OfficialApkConfig } from '../types';
import { DEFAULT_APPS } from '../data/defaultApps';

export const DEFAULT_OFFICIAL_APK: OfficialApkConfig = {
  enabled: true,
  appName: 'AppVault Official APK',
  tagline: 'Fast, secure and lightweight companion app for Android',
  description: 'Download the verified official AppVault Android application. Browse 50+ curated online tools, save favorite utilities offline, and receive instant alerts when trending AI tools launch.',
  version: 'v2.4.2',
  fileSize: '16.8 MB',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80',
  downloadUrl: 'https://github.com/appvault/releases/download/v2.4.2/appvault-official.apk',
  fileName: 'appvault-official-v2.4.2.apk',
  updatedAt: '2024-05-28',
  packageName: 'com.appvault.official',
  minAndroid: 'Android 7.0+',
  features: [
    'Offline saved tools & instant cache',
    'One-tap direct download manager',
    '100% VirusTotal verified official signature',
    'Clean, zero-battery drain dark & light mode'
  ]
};

interface AppContextType {
  apps: AppItem[];
  bookmarks: string[];
  searchQuery: string;
  selectedCategory: CategoryId | 'all';
  activeTab: 'all' | 'trending' | 'latest' | 'popular' | 'bookmarks';
  selectedPlatform: Platform | 'all';
  selectedPricing: PricingModel | 'all';
  sortOption: SortOption;
  selectedApp: AppItem | null;
  isAdminOpen: boolean;
  isBgRemoverOpen: boolean;
  officialApk: OfficialApkConfig;
  isAdminAuthenticated: boolean;
  
  // Actions
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (c: CategoryId | 'all') => void;
  setActiveTab: (tab: 'all' | 'trending' | 'latest' | 'popular' | 'bookmarks') => void;
  setSelectedPlatform: (p: Platform | 'all') => void;
  setSelectedPricing: (p: PricingModel | 'all') => void;
  setSortOption: (s: SortOption) => void;
  setSelectedApp: (app: AppItem | null) => void;
  setIsAdminOpen: (open: boolean) => void;
  setIsBgRemoverOpen: (open: boolean) => void;
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  
  // Admin Auth Operations
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (oldPass: string, newPass: string) => boolean;
  
  // Official APK Operations
  updateOfficialApk: (config: Partial<OfficialApkConfig>) => void;
  deleteOfficialApk: () => void;
  resetOfficialApk: () => void;
  
  // Admin Operations
  addApp: (app: Omit<AppItem, 'id' | 'createdAt' | 'reviewCount'>) => void;
  updateApp: (app: AppItem) => void;
  deleteApp: (id: string) => void;
  resetToDefault: () => void;
  importApps: (importedList: AppItem[]) => boolean;
}

const STORAGE_KEY_APPS = 'appvault_apps_v2';
const STORAGE_KEY_BOOKMARKS = 'appvault_bookmarks_v1';
const STORAGE_KEY_OFFICIAL_APK = 'appvault_official_apk_v1';
const STORAGE_KEY_ADMIN_PASS = 'appvault_admin_pass_v2';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apps, setApps] = useState<AppItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge any missing default apps like moviebox
          const existingIds = new Set(parsed.map((a: AppItem) => a.id));
          const missingDefaults = DEFAULT_APPS.filter(d => !existingIds.has(d.id));
          if (missingDefaults.length > 0) {
            return [...DEFAULT_APPS];
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load apps from localStorage', e);
    }
    return DEFAULT_APPS;
  });

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load bookmarks', e);
    }
    return [];
  });

  const [officialApk, setOfficialApk] = useState<OfficialApkConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OFFICIAL_APK);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.appName) {
          return { ...DEFAULT_OFFICIAL_APK, ...parsed };
        }
      }
    } catch (e) {
      console.error('Failed to load official APK config', e);
    }
    return DEFAULT_OFFICIAL_APK;
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ADMIN_PASS);
      if (saved) return saved;
    } catch (e) {
      console.error('Failed to load admin password', e);
    }
    return 'madnijamrahi';
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'latest' | 'popular' | 'bookmarks'>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [selectedPricing, setSelectedPricing] = useState<PricingModel | 'all'>('all');
  const [sortOption, setSortOption] = useState<SortOption>('trending');
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [isAdminOpen, setIsAdminOpenState] = useState(false);
  const [isBgRemoverOpen, setIsBgRemoverOpen] = useState(false);

  const setIsAdminOpen = (open: boolean) => {
    if (!open) {
      // Auto-lock every time user exits or closes admin panel
      setIsAdminAuthenticated(false);
    }
    setIsAdminOpenState(open);
  };

  // Persist admin password
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_PASS, adminPassword);
    } catch (e) {
      console.error('Failed to save admin password', e);
    }
  }, [adminPassword]);

  const loginAdmin = (enteredPass: string): boolean => {
    if (enteredPass.trim() === adminPassword.trim()) {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
  };

  const changeAdminPassword = (oldPass: string, newPass: string): boolean => {
    if (oldPass.trim() === adminPassword.trim() && newPass.trim().length >= 4) {
      setAdminPassword(newPass.trim());
      return true;
    }
    return false;
  };

  // Persist apps
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(apps));
    } catch (e) {
      console.error('Failed to save apps to localStorage', e);
    }
  }, [apps]);

  // Persist bookmarks
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save bookmarks to localStorage', e);
    }
  }, [bookmarks]);

  // Persist official APK
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_OFFICIAL_APK, JSON.stringify(officialApk));
    } catch (e) {
      console.error('Failed to save official APK config', e);
    }
  }, [officialApk]);

  const updateOfficialApk = (config: Partial<OfficialApkConfig>) => {
    setOfficialApk(prev => ({
      ...prev,
      ...config,
      updatedAt: new Date().toISOString().split('T')[0]
    }));
  };

  const deleteOfficialApk = () => {
    setOfficialApk(prev => ({
      ...prev,
      enabled: false,
      downloadUrl: '',
    }));
  };

  const resetOfficialApk = () => {
    setOfficialApk(DEFAULT_OFFICIAL_APK);
  };

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isBookmarked = (id: string) => bookmarks.includes(id);

  const addApp = (newApp: Omit<AppItem, 'id' | 'createdAt' | 'reviewCount'>) => {
    const id = newApp.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString(36);
    const fullApp: AppItem = {
      ...newApp,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      reviewCount: 100 + Math.floor(Math.random() * 500),
    };
    setApps(prev => [fullApp, ...prev]);
  };

  const updateApp = (updatedApp: AppItem) => {
    setApps(prev => prev.map(a => a.id === updatedApp.id ? updatedApp : a));
    if (selectedApp?.id === updatedApp.id) {
      setSelectedApp(updatedApp);
    }
  };

  const deleteApp = (id: string) => {
    setApps(prev => prev.filter(a => a.id !== id));
    if (selectedApp?.id === id) {
      setSelectedApp(null);
    }
  };

  const resetToDefault = () => {
    setApps(DEFAULT_APPS);
    try {
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(DEFAULT_APPS));
    } catch (e) {
      console.error(e);
    }
  };

  const importApps = (importedList: AppItem[]): boolean => {
    if (Array.isArray(importedList) && importedList.length > 0) {
      setApps(importedList);
      return true;
    }
    return false;
  };

  return (
    <AppContext.Provider
      value={{
        apps,
        bookmarks,
        searchQuery,
        selectedCategory,
        activeTab,
        selectedPlatform,
        selectedPricing,
        sortOption,
        selectedApp,
        isAdminOpen,
        isBgRemoverOpen,
        officialApk,
        isAdminAuthenticated,
        setSearchQuery,
        setSelectedCategory,
        setActiveTab,
        setSelectedPlatform,
        setSelectedPricing,
        setSortOption,
        setSelectedApp,
        setIsAdminOpen,
        setIsBgRemoverOpen,
        toggleBookmark,
        isBookmarked,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        updateOfficialApk,
        deleteOfficialApk,
        resetOfficialApk,
        addApp,
        updateApp,
        deleteApp,
        resetToDefault,
        importApps,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppDirectory = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppDirectory must be used within an AppProvider');
  }
  return context;
};
