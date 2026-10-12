import React, { useState } from 'react';
import { X, Check, Rocket, Shield, Server, Zap, ExternalLink } from 'lucide-react';

export default function PricingModal({ isOpen, onClose, onSelectPlan }) {
  const [billingCycle, setBillingCycle] = useState('monthly');

  if (!isOpen) return null;

  const plans = [
    {
      name: "Open Source / Community",
      price: "$0",
      period: "forever",
      description: "Self-host on your own infrastructure with core DroneDB registry.",
      icon: Server,
      badge: "FREE",
      highlight: false,
      features: [
        "Core DroneDB Registry engine",
        "Unlimited local datasets",
        "Command Line Interface (CLI)",
        "Potree & WebGL 2D/3D Viewers",
        "Community Discord support",
        "Self-managed S3 or local storage"
      ],
      cta: "Read Self-Host Docs",
      link: "https://docs.dronedb.app/docs/registry"
    },
    {
      name: "Cloud Pro",
      price: billingCycle === 'monthly' ? "$29" : "$24",
      period: "/month",
      description: "Cloud-hosted platform for surveying professionals & GIS teams.",
      icon: Zap,
      badge: "MOST POPULAR",
      highlight: true,
      features: [
        "100 GB Cloud Storage included",
        "Unlimited public & private projects",
        "Shareable TMS & COG GeoTIFF links",
        "Potree LiDAR pointcloud streaming",
        "EXIF GPS Flight path inspection",
        "Email & Priority Discord support"
      ],
      cta: "Start 30-Day Free Trial",
      action: "register"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "per org",
      description: "Dedicated cluster, custom SLAs, SOC2 & custom cloud integrations.",
      icon: Shield,
      badge: "ENTERPRISE",
      highlight: false,
      features: [
        "Unlimited Cloud Storage & Bandwidth",
        "Single Sign-On (SSO / SAML / OIDC)",
        "Custom domain & white-label viewer",
        "Dedicated cloud processing cluster",
        "24/7 SLA & Dedicated TAM Support",
        "Custom Data Processing Addendum"
      ],
      cta: "Contact Enterprise Sales",
      link: "https://dronedb.app/contact"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div>
            <h3 className="text-xl font-extrabold text-[#1a1a2e] flex items-center gap-2">
              DroneDB Pricing & Plans
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0041e8] font-bold border border-blue-200">
                30-Day Free Trial
              </span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">Flexible options for open source self-hosting or fully managed cloud.</p>
          </div>

          <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 bg-white overflow-y-auto custom-scrollbar">
          
          {/* Billing Cycle Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1.5 rounded-xl border border-gray-200 flex items-center gap-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  billingCycle === 'monthly' ? 'bg-[#0041e8] text-white shadow-md' : 'text-gray-600 hover:text-black'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual' ? 'bg-[#0041e8] text-white shadow-md' : 'text-gray-600 hover:text-black'
                }`}
              >
                Annual Billing <span className="text-[10px] text-green-600 font-extrabold">(Save 20%)</span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, idx) => {
              const Icon = plan.icon;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                    plan.highlight
                      ? 'bg-gradient-to-b from-blue-50/50 to-white border-2 border-[#0041e8] shadow-xl scale-102'
                      : 'bg-white border border-gray-200 hover:border-gray-300 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0041e8] border border-blue-100 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        plan.highlight ? 'bg-[#0041e8] text-white' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {plan.badge}
                      </span>
                    </div>

                    <h4 className="text-xl font-extrabold text-[#1a1a2e] mb-2">{plan.name}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed mb-6">{plan.description}</p>

                    <div className="mb-6">
                      <span className="text-3xl font-extrabold text-[#1a1a2e] font-mono">{plan.price}</span>
                      <span className="text-xs text-gray-500 ml-1">{plan.period}</span>
                    </div>

                    <div className="space-y-3 mb-8">
                      {plan.features.map((feat, i) => (
                        <div key={i} className="flex items-start space-x-2.5 text-xs font-semibold text-gray-700">
                          <Check className="w-4 h-4 text-[#0041e8] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    {plan.link ? (
                      <a
                        href={plan.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 rounded-xl font-bold text-xs text-center text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>{plan.cta}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                      </a>
                    ) : (
                      <button
                        onClick={() => {
                          onClose();
                          onSelectPlan && onSelectPlan(plan.action || 'register');
                        }}
                        className={`w-full py-3 rounded-xl font-bold text-xs text-center transition-all flex items-center justify-center gap-1.5 ${
                          plan.highlight
                            ? 'bg-[#0041e8] hover:bg-[#0036c2] text-white shadow-md'
                            : 'bg-gray-800 hover:bg-black text-white'
                        }`}
                      >
                        <Rocket className="w-4 h-4 text-[#00c4cc]" />
                        <span>{plan.cta}</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
