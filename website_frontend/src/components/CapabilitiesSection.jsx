import React, { useState } from 'react';
import { UploadCloud, Eye, BarChart3, Share2, Check, ShieldCheck, Zap, Copy, CheckCircle } from 'lucide-react';

export default function CapabilitiesSection() {
  const [activeTab, setActiveTab] = useState('upload');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const shareOptions = [
    {
      title: 'Direct Link',
      icon: '🔗',
      description: 'Share a direct link to your dataset viewer. Recipients can view, navigate and explore your data instantly.',
      value: 'https://hub.dronedb.app/r/odm/waterbury/view/b2RtX29ydGhvcGhvdG8vb2RtX29ydGhvcGhvdG8udGlm/map'
    },
    {
      title: 'Embed Code',
      icon: '💻',
      description: 'Embed an interactive viewer directly into your website or blog. Supports fullscreen and touch navigation.',
      value: '<iframe frameborder="0" width="600" height="400" allowfullscreen src="https://hub.dronedb.app/r/odm/waterbury/view/b2RtX29ydGhvcGhvdG8vb2RtX29ydGhvcGhvdG8udGlm/map?embed=1"></iframe>'
    },
    {
      title: 'TMS Tiles',
      icon: '🗺️',
      description: 'Use this URL in QGIS, Leaflet, MapLibre, OpenLayers or any mapping software that supports TMS tile layers.',
      value: 'https://hub.dronedb.app/orgs/odm/ds/waterbury/tiles/{z}/{x}/{y}.png?path=odm_orthophoto/odm_orthophoto.tif'
    },
    {
      title: 'QGIS Raster Layer (COG)',
      icon: '📡',
      description: 'Cloud-Optimized GeoTIFF URL for direct use in QGIS, ArcGIS, or any software supporting COG format.',
      value: 'https://hub.dronedb.app/orgs/odm/ds/waterbury/build/0d1bbaf4211c4ba05b448e82e21e3fdd06b150a264f5793951a5d50f2e980b76/cog/cog.tif'
    },
    {
      title: 'Point Cloud Layer (COPC)',
      icon: '🧊',
      description: 'Cloud-Optimized Point Cloud URL for streaming point clouds in QGIS, Potree, or any COPC-compatible viewer.',
      value: 'https://hub.dronedb.app/orgs/odm/ds/waterbury/build/f60509c271080a56c2926881c00364d5d18f0970337dacb4c5978abf435cc79d/copc/cloud.copc.laz'
    }
  ];

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const capabilities = [
    {
      id: 'upload',
      title: 'Upload',
      subtitle: 'Upload Any Format',
      icon: UploadCloud,
      description: 'Drag and drop your geospatial files. We support all major formats including raster images, point clouds (LAZ/LAS), 3D meshes (OBJ, glTF), and vector files.',
      image: '/assets/images-preview.jpg',
      highlights: [
        'Orthophotos (GeoTIFF, COG)',
        'Point clouds (LAZ, LAS, PLY, E57, PTS, XYZ)',
        '3D Models & Gaussian Splats (OBJ, PLY, glTF/GLB, SPZ/SPLAT)',
        'Vector files (GeoJSON/TopoJSON, SHP/SHZ, KML/KMZ, DWG, GPKG)',
        '360° Panoramas',
        'Geotagged images with GPS metadata'
      ]
    },
    {
      id: 'visualize',
      title: 'Visualize',
      subtitle: 'Interactive Visualization',
      icon: Eye,
      description: 'Explore your data with powerful web-based viewers. No plugins required: everything works seamlessly inside your browser.',
      image: '/assets/potree.jpg',
      highlights: [
        '2D map viewer for orthophotos with opacity slider',
        '3D point cloud explorer powered by Potree',
        'Textured 3D model viewer with orbit & lighting controls',
        'Gaussian Splat renderer for real-time radiance fields',
        '360° panorama viewer with hotspot navigation',
        'Built-in linear, area, and volumetric measurement tools'
      ]
    },
    {
      id: 'analyze',
      title: 'Analyze',
      subtitle: 'Analyze Your Data',
      icon: BarChart3,
      description: 'Extract insights from your geospatial data. View flight paths, inspect image metadata, measure 3D distances, and partition datasets for efficient workflows.',
      image: '/assets/flight-paths.jpg',
      highlights: [
        'Flight path visualization & camera direction cones',
        'EXIF metadata extraction (GSD, altitude, timestamp)',
        'Dataset partitioning into spatial tiles',
        'STAC (SpatioTemporal Asset Catalog) compliance',
        'Geospatial indexing and fast spatial bounding box query'
      ]
    },
    {
      id: 'share',
      title: 'Share',
      subtitle: 'Share Instantly',
      icon: Share2,
      description: 'Generate shareable links with one click. Control access with organizations and permissions. Make your work public or keep it private.',
      image: '/assets/share.jpg',
      highlights: [
        'Direct Link sharing for instant web browser viewing',
        'HTML iFrame Embed codes for blogs & GIS web apps',
        'Standard TMS Tile URLs for Leaflet & MapLibre',
        'Cloud-Optimized GeoTIFF (COG) URLs for QGIS & ArcGIS',
        'COPC Point Cloud URLs for remote GIS streaming'
      ]
    }
  ];

  const currentCap = capabilities.find(c => c.id === activeTab);

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] tracking-tight mb-4">
            What can you do with DroneDB?
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to manage, analyze, and share your geospatial data securely in the cloud.
          </p>
        </div>

        {/* Capability Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {capabilities.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-[#0041e8] text-white shadow-lg shadow-[#0041e8]/25 scale-105'
                    : 'bg-gray-100 text-gray-700 hover:text-black hover:bg-gray-200 border border-gray-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#00c4cc]' : 'text-gray-500'}`} />
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 light-card-shadow">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Info Side */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-blue-50 text-[#0041e8] text-xs font-bold w-max mb-4 border border-blue-100">
                <Zap className="w-3.5 h-3.5" />
                <span>CAPABILITY HIGHLIGHT</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1a1a2e] mb-4">{currentCap.subtitle}</h3>
              <p className="text-gray-600 text-base leading-relaxed mb-6">{currentCap.description}</p>

              <div className="space-y-3 mb-6">
                {currentCap.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-sm font-semibold text-gray-800">
                    <div className="w-5 h-5 rounded-full bg-blue-50 text-[#0041e8] flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual / Code Snippet Side */}
            <div className="lg:col-span-7">
              {activeTab === 'share' ? (
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                  {shareOptions.map((opt, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0041e8] flex items-center gap-1.5">
                          <span>{opt.icon}</span> {opt.title}
                        </span>
                        <button
                          onClick={() => handleCopy(opt.value, idx)}
                          className="px-3 py-1 text-xs bg-white hover:bg-[#0041e8] hover:text-white text-gray-800 border border-gray-300 rounded-lg transition-colors flex items-center gap-1 font-semibold shadow-xs"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                              <span className="text-green-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-gray-500" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-600 leading-snug">{opt.description}</p>
                      <div className="bg-white p-2.5 rounded-lg border border-gray-200 font-mono text-[11px] text-gray-800 overflow-x-auto select-all shadow-inner">
                        {opt.value}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-md group bg-gray-50">
                  <img
                    src={currentCap.image}
                    alt={currentCap.subtitle}
                    className="w-full h-[380px] object-cover transition-transform duration-500 group-hover:scale-102"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://dronedb.app/wp-content/themes/dronedb-theme/img/home/images-preview.jpg";
                    }}
                  />
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-200 text-xs text-gray-800 font-semibold flex items-center gap-2 shadow-lg">
                    <ShieldCheck className="w-4 h-4 text-[#0041e8]" />
                    <span>Enterprise Geospatial Platform</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
