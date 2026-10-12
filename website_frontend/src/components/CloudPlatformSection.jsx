import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CloudPlatformSection({ onOpenAuth }) {
  const features = [
    {
      icon: "https://dronedb.app/wp-content/themes/dronedb-theme/img/home/icons/flexible-storage-options.svg",
      title: "Cloud Platform",
      description: "Secure, scalable cloud storage built for geospatial professionals. Access all your data remotely, share datasets with fine-grained permissions, and leverage cloud processing for large files. Your data stays safe, available, and ready when you need it.",
      linkText: "Start free trial",
      action: () => onOpenAuth('register'),
      image: "/assets/images-preview.jpg"
    },
    {
      icon: "https://dronedb.app/wp-content/themes/dronedb-theme/img/home/icons/flight-path.svg",
      title: "Flight Paths & Partitioning",
      description: "View image locations and inspect flight paths. Easily partition your data into logical groups for better organization and faster access.",
      linkText: "Explore demo dataset",
      url: "https://hub.dronedb.app/r/odm/wietrznia",
      image: "/assets/flight-paths.jpg"
    },
    {
      icon: "https://dronedb.app/wp-content/themes/dronedb-theme/img/home/icons/orthophoto-map.svg",
      title: "Interactive Exploration",
      description: "Explore and measure orthophotos, point clouds, and 3D models directly in your browser. No plugins or downloads required.",
      linkText: "Try point cloud viewer",
      url: "https://hub.dronedb.app/r/odm/brighton-beach/view/b2RtX2dlb3JlZmVyZW5jaW5nL29kbV9nZW9yZWZlcmVuY2VkX21vZGVsLmxheg==/pointcloud",
      image: "/assets/potree.jpg"
    }
  ];

  return (
    <section className="py-24 bg-[#f8fafc] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {features.map((item, idx) => (
          <div 
            key={idx} 
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 light-card-shadow"
          >
            <div className="lg:col-span-6 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 p-2.5 flex items-center justify-center">
                <img 
                  src={item.icon} 
                  alt={item.title} 
                  className="w-full h-full object-contain" 
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1a1a2e]">{item.title}</h3>
              
              <p className="text-gray-600 text-base leading-relaxed">
                {item.description}
              </p>

              <div className="pt-2">
                {item.action ? (
                  <button
                    onClick={item.action}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#0041e8] hover:text-[#0036c2] transition-colors group"
                  >
                    <span>{item.linkText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#0041e8] hover:text-[#0036c2] transition-colors group"
                  >
                    <span>{item.linkText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-md group bg-gray-50">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-[320px] object-cover transition-transform duration-500 group-hover:scale-102"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://dronedb.app/wp-content/themes/dronedb-theme/img/home/images-preview.jpg";
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
