import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Download, 
  Upload, 
  Search, 
  Check, 
  AlertTriangle,
  Globe,
  Sparkles,
  Link as LinkIcon,
  Layers,
  Image as ImageIcon,
  Smartphone,
  ShieldCheck,
  HardDrive,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  ShieldAlert,
  Loader2,
  FileCheck
} from 'lucide-react';
import { useAppDirectory } from '../context/AppContext';
import { CATEGORIES } from '../data/defaultApps';
import { AppItem, CategoryId, Platform, PricingModel } from '../types';
import { saveApkBlob, deleteStoredApkBlob, formatDownloadLink } from '../utils/apkStorage';

export const AdminPanel: React.FC = () => {
  const { 
    apps, 
    isAdminOpen, 
    setIsAdminOpen, 
    addApp, 
    updateApp, 
    deleteApp, 
    resetToDefault, 
    importApps,
    officialApk,
    updateOfficialApk,
    deleteOfficialApk,
    resetOfficialApk,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    changeAdminPassword
  } = useAppDirectory();

  // Navigation & Auth State
  const [activeTab, setActiveTab] = useState<'manage' | 'add' | 'apk' | 'security' | 'settings'>('manage');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Security tab state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Apps Management State
  const [adminSearch, setAdminSearch] = useState('');
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Tools Form State
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryId>('ai-tools');
  const [logoUrl, setLogoUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [developer, setDeveloper] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>(['Web']);
  const [pricing, setPricing] = useState<PricingModel>('Free');
  const [rating, setRating] = useState<number>(4.8);
  const [featuresStr, setFeaturesStr] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [isTrending, setIsTrending] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [isLatest, setIsLatest] = useState(true);

  // Official APK Form State
  const [apkAppName, setApkAppName] = useState(officialApk.appName);
  const [apkTagline, setApkTagline] = useState(officialApk.tagline);
  const [apkDescription, setApkDescription] = useState(officialApk.description);
  const [apkVersion, setApkVersion] = useState(officialApk.version);
  const [apkFileSize, setApkFileSize] = useState(officialApk.fileSize);
  const [apkLogoUrl, setApkLogoUrl] = useState(officialApk.logoUrl);
  const [apkDownloadUrl, setApkDownloadUrl] = useState(officialApk.downloadUrl);
  const [apkFileName, setApkFileName] = useState(officialApk.fileName);
  const [apkMinAndroid, setApkMinAndroid] = useState(officialApk.minAndroid);
  const [apkFeaturesStr, setApkFeaturesStr] = useState(officialApk.features ? officialApk.features.join('\n') : '');
  const [apkEnabled, setApkEnabled] = useState(officialApk.enabled);
  const [isUploadingApk, setIsUploadingApk] = useState(false);
  const [hasStoredLocalFile, setHasStoredLocalFile] = useState(!!officialApk.hasLocalFile);

  if (!isAdminOpen) return null;

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const success = loginAdmin(enteredPassword);
    if (success) {
      setEnteredPassword('');
      showToast('Welcome back! Admin Portal unlocked.');
    } else {
      setAuthError('Incorrect admin password. Please try again.');
    }
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      showToast('New password must be at least 4 characters long', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    const success = changeAdminPassword(oldPassword, newPassword);
    if (success) {
      showToast('Admin password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      showToast('Current password entered is incorrect', 'error');
    }
  };

  const handleStartEdit = (app: AppItem) => {
    setEditingApp(app);
    setName(app.name);
    setTagline(app.tagline || '');
    setDescription(app.description);
    setCategory(app.category);
    setLogoUrl(app.logoUrl);
    setWebsiteUrl(app.websiteUrl);
    setDownloadUrl(app.downloadUrl || '');
    setDeveloper(app.developer);
    setPlatforms(app.platforms);
    setPricing(app.pricing);
    setRating(app.rating);
    setFeaturesStr(app.features ? app.features.join('\n') : '');
    setTagsStr(app.tags ? app.tags.join(', ') : '');
    setIsTrending(app.isTrending);
    setIsPopular(app.isPopular);
    setIsLatest(app.isLatest);
    setActiveTab('add');
  };

  const handleResetForm = () => {
    setEditingApp(null);
    setName('');
    setTagline('');
    setDescription('');
    setCategory('ai-tools');
    setLogoUrl('');
    setWebsiteUrl('');
    setDownloadUrl('');
    setDeveloper('');
    setPlatforms(['Web']);
    setPricing('Free');
    setRating(4.8);
    setFeaturesStr('');
    setTagsStr('');
    setIsTrending(false);
    setIsPopular(false);
    setIsLatest(true);
  };

  const handlePlatformToggle = (plat: Platform) => {
    if (platforms.includes(plat)) {
      if (platforms.length > 1) {
        setPlatforms(platforms.filter(p => p !== plat));
      }
    } else {
      setPlatforms([...platforms, plat]);
    }
  };

  const handleApkFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingApk(true);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      
      // Save full binary into IndexedDB
      await saveApkBlob(file);

      setApkFileSize(sizeMb);
      setApkFileName(file.name);
      setHasStoredLocalFile(true);
      setApkDownloadUrl('local-indexeddb');
      
      // Auto-update context state immediately so it's live
      updateOfficialApk({
        fileName: file.name,
        fileSize: sizeMb,
        hasLocalFile: true,
      });

      showToast(`APK file "${file.name}" (${sizeMb}) stored successfully in database!`);
    } catch (err) {
      console.error('APK storage error:', err);
      showToast('Failed to store APK file. Please check storage permission or use direct URL.', 'error');
    } finally {
      setIsUploadingApk(false);
    }
  };

  const handleSaveOfficialApk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apkAppName.trim()) {
      showToast('App name is required', 'error');
      return;
    }

    const features = apkFeaturesStr
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const formattedUrl = formatDownloadLink(apkDownloadUrl);

    updateOfficialApk({
      enabled: apkEnabled,
      appName: apkAppName.trim(),
      tagline: apkTagline.trim(),
      description: apkDescription.trim(),
      version: apkVersion.trim() || 'v1.0.0',
      fileSize: apkFileSize.trim() || '15.0 MB',
      logoUrl: apkLogoUrl.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80',
      downloadUrl: formattedUrl || '#',
      fileName: apkFileName.trim() || 'official-app.apk',
      minAndroid: apkMinAndroid.trim() || 'Android 8.0+',
      hasLocalFile: hasStoredLocalFile,
      features: features.length > 0 ? features : ['Verified official APK', 'Fast direct installation']
    });

    showToast('Official APK settings updated successfully!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('App name is required', 'error');
      return;
    }
    if (!websiteUrl.trim() || !websiteUrl.startsWith('http')) {
      showToast('A valid official URL starting with http:// or https:// is required', 'error');
      return;
    }

    const features = featuresStr
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const tags = tagsStr
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (editingApp) {
      const updated: AppItem = {
        ...editingApp,
        name: name.trim(),
        tagline: tagline.trim() || name.trim(),
        description: description.trim(),
        category,
        logoUrl: logoUrl.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80',
        websiteUrl: websiteUrl.trim(),
        downloadUrl: downloadUrl.trim() || undefined,
        developer: developer.trim() || 'Official Developer',
        platforms,
        pricing,
        rating: Number(rating) || 4.5,
        features: features.length > 0 ? features : ['Official web service and secure access'],
        tags: tags.length > 0 ? tags : [name.trim()],
        isTrending,
        isPopular,
        isLatest,
      };

      updateApp(updated);
      showToast(`"${name}" updated successfully!`);
      handleResetForm();
      setActiveTab('manage');
    } else {
      addApp({
        name: name.trim(),
        tagline: tagline.trim() || name.trim(),
        description: description.trim() || `${name} is a useful online tool and application.`,
        category,
        logoUrl: logoUrl.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80',
        websiteUrl: websiteUrl.trim(),
        downloadUrl: downloadUrl.trim() || undefined,
        developer: developer.trim() || 'Official Developer',
        platforms,
        pricing,
        rating: Number(rating) || 4.8,
        features: features.length > 0 ? features : ['Fast and responsive official tool', 'Verified secure direct link'],
        tags: tags.length > 0 ? tags : [name.trim(), category],
        isTrending,
        isPopular,
        isLatest,
      });

      showToast(`"${name}" added to directory successfully!`);
      handleResetForm();
      setActiveTab('manage');
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(apps, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `appvault_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Catalog exported as JSON');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            importApps(parsed);
            showToast(`Imported ${parsed.length} apps successfully!`);
          } else {
            showToast('Invalid JSON format', 'error');
          }
        } catch (err) {
          showToast('Failed to parse JSON file', 'error');
        }
      };
    }
  };

  const filteredAdminApps = apps.filter(app => {
    if (!adminSearch.trim()) return true;
    const q = adminSearch.toLowerCase();
    return app.name.toLowerCase().includes(q) || app.developer.toLowerCase().includes(q) || app.category.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* If NOT Authenticated: Show Secure Password Gate Screen */}
      {!isAdminAuthenticated ? (
        <div 
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">
                  Admin Portal Access
                </h3>
                <p className="text-[11px] text-slate-300">
                  Password Required
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div className="text-center pb-2">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 border border-indigo-100 shadow-xs">
                <KeyRound className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                Enter Administrator Passcode
              </h4>
              <p className="text-xs text-slate-500">
                Please enter your password to manage catalog tools and the official APK.
              </p>
            </div>

            {/* Password input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Admin Password:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={enteredPassword}
                  onChange={(e) => {
                    setEnteredPassword(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="Enter admin password..."
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Error feedback */}
              {authError && (
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAdminOpen(false)}
                className="flex-1 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Portal</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Authenticated Full Admin Dashboard */
        <div 
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Top Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-white">
                    AppVault Administration
                  </h3>
                  <span className="px-2 py-0.2 text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded uppercase">
                    Authenticated
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Manage Directory Tools, Official APK, Security, and Backups
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Logout button */}
              <button
                onClick={() => {
                  logoutAdmin();
                  showToast('Logged out of Admin Portal');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-700/60 rounded-xl transition-colors cursor-pointer"
                title="Lock & Log Out of Admin Portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>

              <button
                onClick={() => setIsAdminOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tab Navigation & Status Toast */}
          <div className="flex items-center justify-between px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex-wrap gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => {
                  setActiveTab('manage');
                  handleResetForm();
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'manage'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                All Tools ({apps.length})
              </button>

              <button
                onClick={() => {
                  handleResetForm();
                  setActiveTab('add');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'add'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {editingApp ? `Edit: ${editingApp.name}` : '+ Add New Tool'}
              </button>

              {/* Official APK Tab */}
              <button
                onClick={() => setActiveTab('apk')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'apk'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Official APK</span>
                {officialApk.enabled && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
              </button>

              {/* Security & Password Tab */}
              <button
                onClick={() => setActiveTab('security')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'security'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Password & Security</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                Backup & Reset
              </button>
            </div>

            {/* Toast alert */}
            {statusMessage && (
              <div className={`text-xs font-bold px-3 py-1 rounded-lg ${
                statusMessage.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {statusMessage.text}
              </div>
            )}
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-y-auto flex-1">
            
            {/* TAB: PASSWORD & SECURITY */}
            {activeTab === 'security' && (
              <form onSubmit={handleChangePasswordSubmit} className="space-y-4 max-w-md">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    Admin Security Settings
                  </h4>
                  <p className="text-xs text-slate-500">
                    Change your admin portal master password to protect tool and APK management.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter current password..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    New Password * (Min 4 characters)
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-xs cursor-pointer"
                  >
                    Update Admin Password
                  </button>
                </div>
              </form>
            )}

            {/* TAB: OFFICIAL APK MANAGEMENT */}
            {activeTab === 'apk' && (
              <form onSubmit={handleSaveOfficialApk} className="space-y-5">
                
                {/* Top Security & Official Status Banner */}
                <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        My Official Tool APK Manager
                      </h4>
                      <p className="text-xs text-slate-600">
                        Configure your verified app APK file, version details, and home page banner.
                      </p>
                    </div>
                  </div>

                  {/* Enable/Disable Toggle */}
                  <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-emerald-300 shadow-2xs">
                    <input
                      type="checkbox"
                      checked={apkEnabled}
                      onChange={(e) => setApkEnabled(e.target.checked)}
                      className="rounded text-emerald-600 accent-emerald-600"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      {apkEnabled ? 'Show on Home Page' : 'Hidden on Home Page'}
                    </span>
                  </label>
                </div>

                {/* Upload/Replace APK File Box */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-emerald-600" />
                      Upload / Replace APK File
                    </span>
                    <div className="flex items-center gap-2 text-[11px]">
                      {hasStoredLocalFile ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-lg flex items-center gap-1">
                          <FileCheck className="w-3 h-3 text-emerald-600" />
                          Local Binary Saved ({apkFileSize})
                        </span>
                      ) : (
                        <span className="text-slate-500 font-medium">
                          Current: <strong className="text-slate-800">{apkFileName}</strong> ({apkFileSize})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <label className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 ${
                      isUploadingApk ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
                    } text-white text-xs font-bold rounded-xl shadow-xs transition-colors`}>
                      {isUploadingApk ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving APK into Database...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>Choose APK File from Device</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept=".apk,application/vnd.android.package-archive,application/octet-stream,*/*"
                        onChange={handleApkFileUpload}
                        disabled={isUploadingApk}
                        className="hidden"
                      />
                    </label>

                    <span className="text-xs text-slate-400 text-center sm:text-left">or enter direct download URL below:</span>
                  </div>

                  {/* Direct Download URL Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-slate-600">
                        APK Download Link / Host URL (Google Drive, MediaFire, Server Link):
                      </label>
                      <span className="text-[10px] text-indigo-600 font-medium">
                        Auto-converts Google Drive links
                      </span>
                    </div>
                    <input
                      type="text"
                      value={apkDownloadUrl}
                      onChange={(e) => setApkDownloadUrl(e.target.value)}
                      placeholder="https://drive.google.com/... or https://yourserver.com/app.apk"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                {/* APK Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* App Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official App Name *
                    </label>
                    <input
                      type="text"
                      value={apkAppName}
                      onChange={(e) => setApkAppName(e.target.value)}
                      placeholder="e.g., AppVault Official APK"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                      required
                    />
                  </div>

                  {/* Version */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Version (e.g. v2.4.2)
                    </label>
                    <input
                      type="text"
                      value={apkVersion}
                      onChange={(e) => setApkVersion(e.target.value)}
                      placeholder="v2.4.2"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  {/* File Size */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      File Size (e.g. 16.8 MB)
                    </label>
                    <input
                      type="text"
                      value={apkFileSize}
                      onChange={(e) => setApkFileSize(e.target.value)}
                      placeholder="16.8 MB"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  {/* Min Android Requirement */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Android Requirement
                    </label>
                    <input
                      type="text"
                      value={apkMinAndroid}
                      onChange={(e) => setApkMinAndroid(e.target.value)}
                      placeholder="Android 7.0 or higher"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  {/* Logo Image URL */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      APK Logo Image URL
                    </label>
                    <input
                      type="url"
                      value={apkLogoUrl}
                      onChange={(e) => setApkLogoUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  {/* Short Tagline */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Short Tagline
                    </label>
                    <input
                      type="text"
                      value={apkTagline}
                      onChange={(e) => setApkTagline(e.target.value)}
                      placeholder="Short catchy 1-line description"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  {/* Full Description */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Description
                    </label>
                    <textarea
                      rows={3}
                      value={apkDescription}
                      onChange={(e) => setApkDescription(e.target.value)}
                      placeholder="Detailed explanation of what the official APK does..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                  {/* Key Features (1 per line) */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Key Features / Highlights (1 per line)
                    </label>
                    <textarea
                      rows={2}
                      value={apkFeaturesStr}
                      onChange={(e) => setApkFeaturesStr(e.target.value)}
                      placeholder="Offline tool bookmarking&#10;Instant clean search&#10;100% Virus-Free verified"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 outline-none"
                    />
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        if (window.confirm('Delete/Disable the Official APK section on the home page?')) {
                          await deleteStoredApkBlob();
                          deleteOfficialApk();
                          setApkEnabled(false);
                          setHasStoredLocalFile(false);
                          showToast('Official APK disabled and removed from database');
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete / Disable APK</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        resetOfficialApk();
                        showToast('APK reset to official defaults');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Defaults</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-xs cursor-pointer"
                  >
                    Save Official APK Settings
                  </button>
                </div>

              </form>
            )}

            {/* TAB 1: MANAGE APPS */}
            {activeTab === 'manage' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      placeholder="Filter apps by name or category..."
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>

                  <button
                    onClick={() => {
                      handleResetForm();
                      setActiveTab('add');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-indigo-600 text-white rounded-xl shadow-xs hover:bg-indigo-700 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Tool</span>
                  </button>
                </div>

                {/* Apps Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-100 text-slate-500 font-bold sticky top-0 uppercase tracking-wider text-[10px] border-b border-slate-200">
                        <tr>
                          <th className="p-3">App</th>
                          <th className="p-3 hidden sm:table-cell">Category</th>
                          <th className="p-3 hidden md:table-cell">Pricing</th>
                          <th className="p-3 hidden md:table-cell">Rating</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredAdminApps.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 flex items-center justify-center font-bold text-slate-600">
                                  {app.logoUrl ? (
                                    <img src={app.logoUrl} alt={app.name} className="w-full h-full object-cover" />
                                  ) : (
                                    app.name.charAt(0)
                                  )}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-900 line-clamp-1">{app.name}</p>
                                  <p className="text-[10px] text-slate-400">{app.developer}</p>
                                </div>
                              </div>
                            </td>

                            <td className="p-3 hidden sm:table-cell">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                                {app.category}
                              </span>
                            </td>

                            <td className="p-3 hidden md:table-cell">
                              <span className="text-slate-600 font-medium">{app.pricing}</span>
                            </td>

                            <td className="p-3 hidden md:table-cell">
                              <span className="font-bold text-amber-600">{app.rating}★</span>
                            </td>

                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleStartEdit(app)}
                                  className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                                  title="Edit App"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>

                                {deleteConfirmId === app.id ? (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => {
                                        deleteApp(app.id);
                                        setDeleteConfirmId(null);
                                        showToast(`"${app.name}" deleted`);
                                      }}
                                      className="px-2 py-1 text-[10px] font-bold bg-rose-600 text-white rounded hover:bg-rose-700 cursor-pointer"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirmId(null)}
                                      className="px-1.5 py-1 text-[10px] text-slate-500 hover:bg-slate-200 rounded cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeleteConfirmId(app.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    title="Delete App"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ADD / EDIT APP FORM */}
            {activeTab === 'add' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      App / Tool Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., DaVinci Resolve"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                      required
                    />
                  </div>

                  {/* Developer */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Developer / Publisher
                    </label>
                    <input
                      type="text"
                      value={developer}
                      onChange={(e) => setDeveloper(e.target.value)}
                      placeholder="e.g., Blackmagic Design"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as CategoryId)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Pricing Model */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pricing Model
                    </label>
                    <select
                      value={pricing}
                      onChange={(e) => setPricing(e.target.value as PricingModel)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                    >
                      <option value="Free">Free</option>
                      <option value="Freemium">Freemium</option>
                      <option value="Open Source">Open Source</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>

                  {/* Official Website URL */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Website URL * (Legal official link only)
                    </label>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                      required
                    />
                  </div>

                  {/* Official Download URL */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Download URL (Google Play / App Store / Direct Page)
                    </label>
                    <input
                      type="url"
                      value={downloadUrl}
                      onChange={(e) => setDownloadUrl(e.target.value)}
                      placeholder="https://play.google.com/store/apps/details?id=..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                    />
                  </div>

                  {/* Logo Image URL */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Logo Image URL
                    </label>
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                    />
                  </div>

                  {/* Short Tagline */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Short Tagline / Summary
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="Brief 1-line punchy description"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                    />
                  </div>

                  {/* Detailed Description */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Detailed Description
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Comprehensive overview of features, use cases, and benefits..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                    />
                  </div>

                  {/* Key Features (One per line) */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Key Features (1 per line)
                    </label>
                    <textarea
                      rows={2}
                      value={featuresStr}
                      onChange={(e) => setFeaturesStr(e.target.value)}
                      placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                    />
                  </div>

                  {/* Tags (comma separated) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={tagsStr}
                      onChange={(e) => setTagsStr(e.target.value)}
                      placeholder="AI, Design, Editor, Free"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Rating (1.0 to 5.0)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={rating}
                      onChange={(e) => setRating(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                    />
                  </div>

                  {/* Supported Platforms */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Supported Platforms
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(['Web', 'Android', 'iOS', 'Windows', 'macOS', 'Linux'] as Platform[]).map(plat => (
                        <button
                          key={plat}
                          type="button"
                          onClick={() => handlePlatformToggle(plat)}
                          className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                            platforms.includes(plat)
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {plat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Badges toggles */}
                  <div className="md:col-span-2 flex flex-wrap gap-4 pt-1">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isTrending}
                        onChange={(e) => setIsTrending(e.target.checked)}
                        className="rounded text-indigo-600"
                      />
                      <span>🔥 Mark as Trending</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isPopular}
                        onChange={(e) => setIsPopular(e.target.checked)}
                        className="rounded text-indigo-600"
                      />
                      <span>⭐ Mark as Popular</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isLatest}
                        onChange={(e) => setIsLatest(e.target.checked)}
                        className="rounded text-indigo-600"
                      />
                      <span>✨ Mark as Latest</span>
                    </label>
                  </div>

                </div>

                {/* Form Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleResetForm();
                      setActiveTab('manage');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl shadow-xs cursor-pointer"
                  >
                    {editingApp ? 'Save Changes' : 'Publish Tool to Directory'}
                  </button>
                </div>

              </form>
            )}

            {/* TAB 3: BACKUP & RESTORE */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-xl">
                
                {/* Complete Website Source Code (.ZIP) */}
                <div className="p-5 bg-gradient-to-r from-indigo-50 via-slate-50 to-emerald-50 border-2 border-indigo-300/80 rounded-2xl shadow-xs">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                      📦
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Complete Website Source Code (.ZIP)
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        Download the entire project (React, TypeScript, Tailwind, Components, Vite config).
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 my-2.5 leading-relaxed">
                    Ready to run on any computer or server with <code className="px-1 py-0.5 bg-slate-200 text-slate-800 rounded font-mono">npm install</code> and <code className="px-1 py-0.5 bg-slate-200 text-slate-800 rounded font-mono">npm run dev</code>.
                  </p>

                  <a
                    href="/appvault-source-code.zip"
                    download="appvault-source-code.zip"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Complete Source Code (.ZIP)</span>
                  </a>
                </div>

                {/* Backup / Export */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Export Catalog Backup
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">
                    Download all {apps.length} tools and settings as a standalone JSON backup file.
                  </p>
                  <button
                    onClick={handleExportJSON}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>

                {/* Import / Restore */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Import Catalog from JSON
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">
                    Upload a previously exported JSON backup to restore or overwrite your app list.
                  </p>
                  <label className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose JSON File</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Reset to Factory Defaults */}
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                  <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-1">
                    Reset to Curated Default Catalog
                  </h4>
                  <p className="text-xs text-rose-700 mb-3">
                    This will restore the original curated set of verified tools across all categories.
                  </p>
                  <button
                    onClick={() => {
                      if (window.confirm('Reset all apps to default curated collection? Any custom apps will be overwritten.')) {
                        resetToDefault();
                        showToast('Directory reset to default catalog');
                        setActiveTab('manage');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 rounded-xl cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Default Catalog</span>
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
            <span>Admin Status: Authenticated Session</span>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="px-4 py-1.5 font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Close Admin
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
