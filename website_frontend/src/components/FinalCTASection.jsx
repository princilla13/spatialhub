import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function FinalCTASection({ onOpenAuth }) {
  return (
    <section className="py-20 bg-white border-t border-gray-200 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="bg-gradient-to-br from-blue-50/70 via-white to-cyan-50/50 rounded-3xl p-8 sm:p-14 border border-blue-100 light-card-shadow">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-[#0041e8] text-xs font-bold mb-6 border border-blue-200 shadow-xs">
            <Sparkles className="w-4 h-4" />
            <span>GET STARTED TODAY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1a1a2e] tracking-tight mb-6">
            Ready to get started?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Join thousands of professionals managing their geospatial data with DroneDB. Start your free 30-day trial today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button
              onClick={() => onOpenAuth('register')}
              className="px-8 py-4 rounded-xl bg-[#0041e8] hover:bg-[#0036c2] text-white font-bold text-base shadow-lg shadow-[#0041e8]/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group w-full sm:w-auto"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5 text-[#00c4cc] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 font-semibold flex-wrap gap-2">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#0041e8]" /> No credit card required</span>
            <span>•</span>
            <span>Instant setup</span>
            <span>•</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
