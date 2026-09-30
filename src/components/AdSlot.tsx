import React, { useEffect, useRef } from 'react';
import { ExternalLink, Sparkles, Zap, ArrowUpRight } from 'lucide-react';

interface AdSlotProps {
  id: string;
  format: 'banner-320x50' | 'native-banner' | 'native-card' | 'footer-banner' | 'smartlink-card';
  className?: string;
}

export const SMARTLINK_URL = 'https://www.profitableratecpmnetwork.com/rhsvhkgyph?key=8b3b32e5f57a66e61d446a88defa5382';

export const AdSlot: React.FC<AdSlotProps> = ({ id, format, className = '' }) => {

  // 1. BANNER 320x50 (Adsterra ID: 31492834)
  if (format === 'banner-320x50' || format === 'footer-banner') {
    const bannerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; height: 100vh; width: 100vw; }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '8cbb6e92e7bcd11ad494116f2bdee259',
            'format' : 'iframe',
            'height' : 50,
            'width' : 320,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highrevenueformat.com/8cbb6e92e7bcd11ad494116f2bdee259/invoke.js"></script>
      </body>
      </html>
    `;

    return (
      <div className={`w-full flex flex-col items-center justify-center my-3 ${className}`}>
        <div className="relative bg-white/60 backdrop-blur-xs rounded-2xl border border-slate-200/80 p-2 shadow-2xs flex flex-col items-center justify-center overflow-hidden">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 select-none">
            Advertisement
          </span>
          <iframe
            title={`adsterra-banner-${id}`}
            srcDoc={bannerHtml}
            width="320"
            height="50"
            className="border-0 overflow-hidden"
            scrolling="no"
          />
        </div>
      </div>
    );
  }

  // 2. NATIVE BANNER (Adsterra ID: 31492831)
  if (format === 'native-banner' || format === 'native-card') {
    const nativeHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: system-ui, -apple-system, sans-serif; background: transparent; overflow: hidden; padding: 4px; }
          #container-553b167be653171dda5d03eff11c1103 { width: 100%; display: flex; justify-content: center; }
        </style>
      </head>
      <body>
        <div id="container-553b167be653171dda5d03eff11c1103"></div>
        <script async="async" data-cfasync="false" src="https://pl31593330.profitableratecpmnetwork.com/553b167be653171dda5d03eff11c1103/invoke.js"></script>
      </body>
      </html>
    `;

    return (
      <div 
        id={id} 
        className={`bg-white rounded-2xl border border-indigo-200/80 p-4 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all ${className}`}
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.2 text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded">
              Sponsored
            </span>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
              Ad
            </span>
          </div>

          {/* Embedded Native Container */}
          <div className="w-full min-h-[140px] flex items-center justify-center overflow-hidden rounded-xl bg-slate-50 border border-slate-100">
            <iframe
              title={`adsterra-native-${id}`}
              srcDoc={nativeHtml}
              width="100%"
              height="160"
              className="border-0 w-full overflow-hidden"
              scrolling="no"
            />
          </div>
        </div>

        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-400">Featured Offer</span>
          <a
            href={SMARTLINK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
          >
            <span>Explore Now</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // 3. SMARTLINK HIGH-CONVERTING CARD (Adsterra ID: 31492832)
  return (
    <div className={`bg-gradient-to-br from-indigo-900 via-purple-950 to-slate-900 text-white rounded-2xl border border-indigo-500/30 p-4 flex flex-col justify-between shadow-md ${className}`}>
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="px-2 py-0.2 text-[9px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 rounded font-mono flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 fill-slate-950" />
            Top Deal
          </span>
          <span className="text-[10px] text-indigo-200 font-semibold">Sponsored</span>
        </div>

        <h4 className="text-sm font-bold text-white mb-1">
          Trending Software & Premium Tools
        </h4>
        <p className="text-xs text-slate-300 line-clamp-2 mb-3">
          Discover exclusive premium software, verified utility downloads, and special creator offers.
        </p>
      </div>

      <a
        href={SMARTLINK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-2 px-3 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-105 active:scale-95 rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
      >
        <span>Claim Special Offer</span>
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-950" />
      </a>
    </div>
  );
};
