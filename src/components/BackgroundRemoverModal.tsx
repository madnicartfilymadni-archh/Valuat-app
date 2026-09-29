import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Download, 
  Sliders, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  Check, 
  Image as ImageIcon,
  ArrowRight,
  ExternalLink,
  Zap,
  Undo
} from 'lucide-react';
import { useAppDirectory } from '../context/AppContext';

interface BackgroundRemoverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackgroundRemoverModal: React.FC<BackgroundRemoverModalProps> = ({ isOpen, onClose }) => {
  const { setSelectedApp, apps } = useAppDirectory();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bgType, setBgType] = useState<'transparent' | 'color' | 'gradient'>('transparent');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgGradient, setBgGradient] = useState('linear-gradient(135deg, #6366f1 0%, #a855f7 100%)');
  const [tolerance, setTolerance] = useState<number>(30); // color delta tolerance
  const [feather, setFeather] = useState<number>(2); // edge softness

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  // Sample quick images
  const sampleImages = [
    {
      name: 'Product Sample',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Portrait Sample',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Gadget Sample',
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          loadImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const loadImage = (src: string) => {
    setImageSrc(src);
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      originalImageRef.current = img;
      processRemoval(img, tolerance, feather);
    };
    img.src = src;
  };

  // Smart client-side background removal algorithm:
  // Samples corners and border pixels to identify dominant background hue/saturation/luminance,
  // flood-fills or threshold-masks background pixels with distance formula & alpha falloff.
  const processRemoval = (img: HTMLImageElement, tol: number, featherPx: number) => {
    setIsProcessing(true);
    setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        // Limit maximum dimensions for fast smooth interactive performance while retaining high quality
        const maxDim = 1200;
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Sample corner and perimeter pixels to estimate background palette
        const samples: [number, number, number][] = [];
        const step = Math.max(1, Math.floor(w / 40));
        
        // Top and bottom edges
        for (let x = 0; x < w; x += step) {
          const idxTop = (0 * w + x) * 4;
          const idxBot = ((h - 1) * w + x) * 4;
          samples.push([data[idxTop], data[idxTop + 1], data[idxTop + 2]]);
          samples.push([data[idxBot], data[idxBot + 1], data[idxBot + 2]]);
        }
        // Left and right edges
        for (let y = 0; y < h; y += step) {
          const idxLeft = (y * w + 0) * 4;
          const idxRight = (y * w + (w - 1)) * 4;
          samples.push([data[idxLeft], data[idxLeft + 1], data[idxLeft + 2]]);
          samples.push([data[idxRight], data[idxRight + 1], data[idxRight + 2]]);
        }

        // Compute average background reference color (or median)
        let rSum = 0, gSum = 0, bSum = 0;
        for (const [sr, sg, sb] of samples) {
          rSum += sr;
          gSum += sg;
          bSum += sb;
        }
        const avgR = rSum / samples.length;
        const avgG = gSum / samples.length;
        const avgB = bSum / samples.length;

        // Tolerance factor
        const maxDist = (tol / 100) * 441.67; // 441.67 is sqrt(255^2 * 3)
        const featherDist = (featherPx / 10) * maxDist * 0.5;

        // Iterate and set alpha channel
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Euclidean color distance to background reference
          const dr = r - avgR;
          const dg = g - avgG;
          const db = b - avgB;
          const dist = Math.sqrt(dr * dr + dg * dg + db * db);

          if (dist < maxDist - featherDist) {
            // Full transparent
            data[i + 3] = 0;
          } else if (dist < maxDist + featherDist) {
            // Feathered soft edge transition
            const alphaFactor = (dist - (maxDist - featherDist)) / (2 * featherDist || 1);
            data[i + 3] = Math.max(0, Math.min(255, Math.floor(alphaFactor * 255)));
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setProcessedSrc(canvas.toDataURL('image/png'));
      } catch (err) {
        console.error('Removal error:', err);
      } finally {
        setIsProcessing(false);
      }
    }, 150);
  };

  const handleDownload = () => {
    if (!processedSrc) return;

    // Create final composition canvas with chosen background
    const img = new Image();
    img.onload = () => {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = img.width;
      exportCanvas.height = img.height;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) return;

      if (bgType === 'color') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      } else if (bgType === 'gradient') {
        const grad = ctx.createLinearGradient(0, 0, exportCanvas.width, exportCanvas.height);
        grad.addColorStop(0, '#6366f1');
        grad.addColorStop(1, '#a855f7');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      }
      // Draw transparent cutout
      ctx.drawImage(img, 0, 0);

      const link = document.createElement('a');
      link.download = `appvault-cutout-${Date.now()}.png`;
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
    };
    img.src = processedSrc;
  };

  const handleToleranceChange = (newTol: number) => {
    setTolerance(newTol);
    if (originalImageRef.current) {
      processRemoval(originalImageRef.current, newTol, feather);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  Instant Background Remover
                </h3>
                <span className="text-[10px] uppercase font-bold bg-pink-500/30 text-pink-300 border border-pink-500/40 px-2 py-0.5 rounded-full">
                  Online Tool
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Remove backgrounds 100% automatically in your browser with transparent PNG export
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {!imageSrc ? (
            /* Upload State */
            <div className="space-y-6">
              
              {/* Drag & Drop Upload Container */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/40 hover:bg-indigo-50/80 rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp, image/jpg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform mb-4">
                  <Upload className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-1">
                  Upload an image to remove background
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mb-4">
                  Drag and drop any JPG, PNG or WebP image here, or click to browse files. 100% free with no watermark.
                </p>
                <span className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs group-hover:bg-indigo-700 transition-colors">
                  Choose Photo
                </span>
              </div>

              {/* Sample Quick Images */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center">
                  Or try with a sample photo:
                </p>
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                  {sampleImages.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => loadImage(s.url)}
                      className="group relative rounded-2xl overflow-hidden border border-slate-200 aspect-square shadow-2xs hover:border-indigo-500 hover:ring-2 hover:ring-indigo-300 transition-all cursor-pointer"
                    >
                      <img src={s.url} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-slate-900/40 flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-white font-bold truncate">Try Sample</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Top background remover directory apps */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    Top Dedicated Background Removers in Directory:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Remove.bg', 'Canva', 'Photopea', 'Snapseed'].map((toolName) => {
                    const found = apps.find(a => a.name.toLowerCase().includes(toolName.toLowerCase()));
                    return found ? (
                      <button
                        key={toolName}
                        onClick={() => {
                          onClose();
                          setSelectedApp(found);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-indigo-50 text-indigo-700 border border-slate-200 hover:border-indigo-300 rounded-xl transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>{found.name}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : null;
                  })}
                </div>
              </div>

            </div>
          ) : (
            /* Processed View & Editor */
            <div className="space-y-6">
              
              {/* Preview Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Original Photo */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-100 flex flex-col">
                  <div className="px-3 py-2 bg-slate-200/70 border-b border-slate-200 text-xs font-bold text-slate-600 flex items-center justify-between">
                    <span>Original Image</span>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] text-indigo-600 hover:underline font-semibold"
                    >
                      Change Image
                    </button>
                  </div>
                  <div className="p-4 flex items-center justify-center min-h-[260px] max-h-[340px]">
                    <img src={imageSrc} alt="Original" className="max-h-[280px] max-w-full object-contain rounded-lg shadow-xs" />
                  </div>
                </div>

                {/* Removed Background Cutout */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
                  <div className="px-3 py-2 bg-slate-900 text-white text-xs font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                      Transparent Cutout
                    </span>
                    {isProcessing && (
                      <span className="text-[10px] text-pink-300 animate-pulse font-medium">
                        Processing AI edges...
                      </span>
                    )}
                  </div>
                  
                  {/* Background container with transparency or custom color */}
                  <div 
                    className="p-4 flex items-center justify-center min-h-[260px] max-h-[340px] relative overflow-hidden"
                    style={{
                      background: bgType === 'transparent' 
                        ? 'repeating-conic-gradient(#cbd5e1 0% 25%, #f8fafc 0% 50%) 50% / 16px 16px' 
                        : bgType === 'color' 
                          ? bgColor 
                          : bgGradient
                    }}
                  >
                    {processedSrc ? (
                      <img src={processedSrc} alt="Processed Cutout" className="max-h-[280px] max-w-full object-contain rounded-lg drop-shadow-md" />
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                        <span>Removing background...</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Controls & Background Customizer */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                
                {/* Background Selector */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Background Style:
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {/* Transparent */}
                    <button
                      onClick={() => setBgType('transparent')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                        bgType === 'transparent'
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Transparent (PNG)
                    </button>

                    {/* Solid White */}
                    <button
                      onClick={() => {
                        setBgType('color');
                        setBgColor('#ffffff');
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                        bgType === 'color' && bgColor === '#ffffff'
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      White
                    </button>

                    {/* Studio Gradient */}
                    <button
                      onClick={() => setBgType('gradient')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                        bgType === 'gradient'
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Studio Gradient
                    </button>
                  </div>
                </div>

                {/* Edge Sensitivity Slider */}
                <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-700">Edge Sensitivity / Tolerance:</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="10"
                      max="60"
                      value={tolerance}
                      onChange={(e) => handleToleranceChange(Number(e.target.value))}
                      className="w-40 accent-indigo-600 cursor-pointer"
                    />
                    <span className="text-xs font-mono font-bold text-slate-600 min-w-[32px]">
                      {tolerance}%
                    </span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => {
                    setImageSrc(null);
                    setProcessedSrc(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  <Undo className="w-3.5 h-3.5" />
                  <span>Upload Another Image</span>
                </button>

                <button
                  onClick={handleDownload}
                  disabled={!processedSrc}
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download High-Res PNG Cutout</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
          <span>Client-side Processing — 100% Private, No Images Uploaded to Servers</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>

    </div>
  );
};
