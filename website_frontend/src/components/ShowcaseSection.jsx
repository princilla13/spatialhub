import React, { useState } from 'react';
import { ExternalLink, Play, Sparkles } from 'lucide-react';
import ShowcaseModal from './ShowcaseModal';

export default function ShowcaseSection() {
  const [selectedShowcase, setSelectedShowcase] = useState(null);

  const showcaseItems = [
    {
      id: 'orthophoto',
      title: 'Orthophoto',
      description: 'High-resolution georeferenced imagery with interactive map controls',
      image: '/assets/showcase/orthophoto.jpg',
      tag: 'GeoTIFF / Raster',
      url: 'https://hub.dronedb.app/r/odm/zoo/view/b2RtX29ydGhvcGhvdG8vb2RtX29ydGhvcGhvdG8udGlm/map'
    },
    {
      id: 'pointcloud',
      title: 'Point Cloud',
      description: 'Dense 3D point clouds with measurement and analysis tools',
      image: '/assets/showcase/pointcloud.jpg',
      tag: 'LAZ / LAS',
      url: 'https://hub.dronedb.app/r/odm/waterbury/view/b2RtX2dlb3JlZmVyZW5jaW5nL29kbV9nZW9yZWZlcmVuY2VkX21vZGVsLmxheg==/pointcloud'
    },
    {
      id: '3dmodel',
      title: '3D Model',
      description: 'Textured 3D meshes for immersive exploration and presentation',
      image: '/assets/showcase/3dmodel.jpg',
      tag: 'OBJ / glTF',
      url: 'https://hub.dronedb.app/r/odm/wietrznia/view/b2RtX3RleHR1cmluZy9vZG1fdGV4dHVyZWRfbW9kZWxfZ2VvLm9iag==/model'
    },
    {
      id: 'panorama',
      title: '360° Panorama',
      description: 'Immersive spherical panoramas for virtual site tours',
      image: '/assets/showcase/panorama.jpg',
      tag: 'Spherical EXIF',
      url: 'https://hub.dronedb.app/r/pierotofy/panoexample/view/cGFuby5qcGc=/panorama'
    },
    {
      id: 'vector',
      title: 'Vector Files',
      description: 'GeoJSON, shapefiles and other vector data overlays',
      image: '/assets/showcase/vector.jpg',
      tag: 'GeoJSON / SHP',
      url: 'https://hub.dronedb.app/r/odm/vector'
    },
    {
      id: 'gaussian-splat',
      title: 'Gaussian Splats',
      description: 'New Gaussian Splat viewer for efficient point cloud visualization and analysis',
      image: '/assets/showcase/gaussian-splat.jpg',
      tag: 'PLY / Splat 3D',
      badge: 'NEW',
      url: 'https://hub.dronedb.app/r/odx/splats/view/V2lsbGEgR2xvYmFsIFBvbGFuZC5wbHk=/splat'
    }
  ];

  return (
    <section className="py-24 bg-white relative border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0041e8] text-xs font-bold mb-4 border border-blue-100 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE DATASETS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a1a2e] tracking-tight mb-4">
            Explore Your Geospatial Data
          </h2>
          <p className="text-lg text-gray-600">
            Visualize any type of geospatial data directly in your browser. Click to explore real examples.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {showcaseItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedShowcase(item)}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#0041e8]/50 transition-all duration-300 light-card-shadow hover:-translate-y-1 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://dronedb.app/wp-content/themes/dronedb-theme/img/home/showcase/orthophoto.jpg";
                  }}
                />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-md text-[11px] font-mono font-bold text-gray-800 border border-gray-200 shadow-xs">
                    {item.tag}
                  </span>
                  {item.badge && (
                    <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-md">
                      {item.badge}
                    </span>
                  )}
                </div>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                  <span className="px-5 py-2.5 rounded-full bg-[#0041e8] text-white font-bold text-xs flex items-center gap-2 shadow-lg transform group-hover:scale-105 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Explore Preview</span>
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#1a1a2e] mb-2 group-hover:text-[#0041e8] transition-colors flex items-center justify-between">
                    <span>{item.title}</span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#0041e8] transition-colors" />
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ShowcaseModal item={selectedShowcase} onClose={() => setSelectedShowcase(null)} />
    </section>
  );
}
