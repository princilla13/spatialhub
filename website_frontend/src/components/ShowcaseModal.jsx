import React, { useState } from 'react';
import { X, ExternalLink, Globe, Layers, ZoomIn, ZoomOut, Maximize2, Compass, Sliders, Ruler, Eye } from 'lucide-react';

export default function ShowcaseModal({ item, onClose }) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeLayer, setActiveLayer] = useState('ortho');
  const [measuring, setMeasuring] = useState(false);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl bg-[#131b2e] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0b0f19]">
          <div className="flex items-center space-x-3">
            <span className="p-2 rounded-lg bg-[#0041e8]/20 text-[#00c4cc]">
              <Globe className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {item.title}
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#00c4cc]/20 text-[#00c4cc] font-mono font-bold">
                  INTERACTIVE VIEWER
                </span>
              </h3>
              <p className="text-xs text-gray-400">{item.description}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-[#0041e8] hover:bg-[#0036c2] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
            >
              <span>Launch Full Hub Viewer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewer Viewport & Interactive Toolbar */}
        <div className="relative flex-1 bg-[#090d16] overflow-hidden min-h-[420px] flex items-center justify-center">
          
          {/* Simulated Controls Toolbar */}
          <div className="absolute top-4 left-4 z-20 bg-[#0b0f19]/90 backdrop-blur-md p-1.5 rounded-xl border border-white/15 flex items-center space-x-1 text-xs text-gray-300 shadow-xl">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 15, 160))}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-[#00c4cc]" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 15, 70))}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-[#00c4cc]" />
            </button>
            <span className="w-px h-5 bg-white/10"></span>
            <button
              onClick={() => setMeasuring(!measuring)}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 font-semibold ${
                measuring ? 'bg-[#0041e8] text-white' : 'hover:bg-white/10 text-gray-300'
              }`}
              title="Measure 3D Distance"
            >
              <Ruler className="w-4 h-4" />
              <span className="hidden sm:inline text-[11px]">{measuring ? 'Measuring...' : 'Measure'}</span>
            </button>
            <button
              onClick={() => setActiveLayer(activeLayer === 'ortho' ? 'potree' : 'ortho')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1"
              title="Toggle Layer"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline text-[11px]">Toggle Layer</span>
            </button>
          </div>

          {/* Top Right Status Badge */}
          <div className="absolute top-4 right-4 z-20 bg-[#0b0f19]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 text-[11px] font-mono text-[#00c4cc] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>FPS: 60 | GPU Accelerated</span>
          </div>

          {/* Interactive Image / Canvas Viewport */}
          <div
            className="w-full h-full flex items-center justify-center overflow-hidden transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-2xl"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/assets/potree.jpg";
              }}
            />
          </div>

          {/* Simulated Measurement Line Overlay */}
          {measuring && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="relative border-2 border-dashed border-[#00c4cc] w-64 h-32 rounded-lg flex items-center justify-center bg-[#00c4cc]/10">
                <span className="bg-[#0041e8] text-white text-[11px] font-mono px-2 py-0.5 rounded font-bold">
                  Distance: 142.85 meters
                </span>
              </div>
            </div>
          )}

          {/* Bottom Info Bar */}
          <div className="absolute bottom-4 left-4 right-4 z-20 bg-[#0b0f19]/90 backdrop-blur-md p-4 rounded-xl border border-white/10 flex flex-wrap items-center justify-between text-xs text-gray-300 gap-4 shadow-2xl">
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-1.5 font-medium text-white">
                <Compass className="w-4 h-4 text-[#00c4cc]" />
                <span>Format: {item.tag}</span>
              </span>
              <span className="hidden sm:inline text-gray-500">|</span>
              <span className="hidden sm:inline text-gray-400 font-mono text-[11px]">
                CRS: EPSG:3857 (WGS 84 / Pseudo-Mercator)
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00c4cc] hover:underline font-semibold flex items-center gap-1.5"
              >
                <span>Full Screen Interactive Session</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
