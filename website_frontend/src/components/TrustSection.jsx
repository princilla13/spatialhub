import React from 'react';
import { Code2, Server, ShieldCheck, Lock } from 'lucide-react';

export default function TrustSection() {
  const trustPoints = [
    { 
      icon: Code2, 
      title: "Open Source", 
      description: "Core technology available on GitHub with transparent codebase and community contribution.", 
      link: "https://github.com/DroneDB/DroneDB", 
      linkText: "View GitHub" 
    },
    { 
      icon: Server, 
      title: "Self-Hosted Option", 
      description: "Run on your own infrastructure or enterprise private cloud with Docker & Kubernetes.", 
      link: "https://docs.dronedb.app/docs/registry", 
      linkText: "Registry Setup" 
    },
    { 
      icon: ShieldCheck, 
      title: "Battle Tested", 
      description: "Reliable and robust solution processing millions of geospatial files worldwide.", 
      link: null, 
      linkText: "Uptime 99.9%" 
    },
    { 
      icon: Lock, 
      title: "GDPR Compliant", 
      description: "EU data protection standards, strict access controls, and encrypted storage at rest.", 
      link: "https://www.iubenda.com/privacy-policy/19576939", 
      linkText: "Privacy Policy" 
    }
  ];

  return (
    <section className="py-20 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="bg-white p-6 rounded-2xl border border-gray-200 light-card-shadow hover:border-[#0041e8]/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0041e8] border border-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1a1a2e] mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-4">{item.description}</p>
                </div>
                {item.link && (
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs font-bold text-[#0041e8] hover:underline flex items-center gap-1 mt-2"
                  >
                    <span>{item.linkText}</span> →
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
