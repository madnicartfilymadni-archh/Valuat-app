import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  ShieldCheck, 
  CheckCircle2, 
  Settings, 
  HardDrive, 
  Check
} from 'lucide-react';
import { useAppDirectory } from '../context/AppContext';
import { getStoredApkBlob } from '../utils/apkStorage';

export const OfficialApkSection: React.FC = () => {
  const { officialApk, setIsAdminOpen } = useAppDirectory();
  const [logoError, setLogoError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!officialApk || !officialApk.enabled) {
    return null;
  }

  const handleDownloadClick = async (e: React.MouseEvent) => {
    setDownloading(true);

    try {
      // 1. Check if an APK file was uploaded into IndexedDB
      const localData = await getStoredApkBlob();
      if (localData && localData.blob) {
        const blobUrl = URL.createObjectURL(localData.blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = localData.fileName || officialApk.fileName || 'appvault-official.apk';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);
        
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
        setDownloading(false);
        return;
      }

      // 2. Fallback to downloadUrl
      if (officialApk.downloadUrl && officialApk.downloadUrl !== '#') {
        const a = document.createElement('a');
        a.href = officialApk.downloadUrl;
        a.download = officialApk.fileName || 'appvault-official.apk';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setTimeout(() => setDownloading(false), 1500);
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-3">
      {/* Compact Banner Container */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/25 shadow-md py-3 px-4 sm:px-5">
        
        {/* Subtle background glow */}
        <div className="absolute right-0 top-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Compact Logo & App Info */}
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            
            {/* Small Compact Logo */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-indigo-950 border border-indigo-400/30 p-0.5 flex-shrink-0 shadow-sm relative">
              <div className="w-full h-full rounded-lg overflow-hidden bg-slate-800 p-1 flex items-center justify-center">
                {officialApk.logoUrl && !logoError ? (
                  <img
                    src={officialApk.logoUrl}
                    alt={officialApk.appName}
                    onError={() => setLogoError(true)}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Smartphone className="w-6 h-6 text-emerald-400" />
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-white p-0.5 rounded-full shadow border border-slate-900">
                <CheckCircle2 className="w-2.5 h-2.5" />
              </span>
            </div>

            {/* App Details */}
            <div className="space-y-0.5 min-w-0 flex-1">
              
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-0.2 text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Official APK
                </span>
                
                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded">
                  {officialApk.version}
                </span>

                <span className="px-1.5 py-0.2 text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 rounded flex items-center gap-1">
                  <HardDrive className="w-2.5 h-2.5 text-slate-400" />
                  {officialApk.fileSize}
                </span>

                <span className="text-[10px] text-slate-400 font-medium hidden lg:inline">
                  • {officialApk.minAndroid}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  {officialApk.appName}
                </h3>
                <span className="text-xs text-slate-300 truncate hidden sm:inline">
                  — {officialApk.tagline || officialApk.description}
                </span>
              </div>

            </div>

          </div>

          {/* Right: Download Action & Trust Badges */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto flex-shrink-0 pt-1 md:pt-0 border-t md:border-t-0 border-slate-800/80">
            
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Safe
              </span>
              <button
                onClick={() => setIsAdminOpen(true)}
                className="text-slate-400 hover:text-white underline cursor-pointer text-[10px]"
                title="Manage APK"
              >
                <Settings className="w-3 h-3" />
              </button>
            </div>

            {/* Compact Download Button */}
            <button
              onClick={handleDownloadClick}
              disabled={downloading}
              className={`px-4 py-2 ${
                downloadSuccess 
                  ? 'bg-emerald-400 text-slate-950' 
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              } active:scale-95 font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer group flex-shrink-0`}
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Started</span>
                </>
              ) : (
                <>
                  <Download className={`w-4 h-4 text-slate-950 ${downloading ? 'animate-bounce' : 'group-hover:-translate-y-0.5'} transition-transform`} />
                  <span>{downloading ? 'Downloading...' : `Download APK (${officialApk.fileSize})`}</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};
