import React from 'react';
import { Quote, Star } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "DroneDB has transformed how we manage geospatial survey data. The ability to share interactive point clouds with clients directly in their browser is a game-changer.",
      author: "Marco R.",
      role: "Survey Engineer",
      rating: 5
    },
    {
      quote: "The CLI integration is fantastic. We've automated our entire geospatial data pipeline, from upload to visualization, saving hours every week.",
      author: "Sarah K.",
      role: "GIS Director",
      rating: 5
    },
    {
      quote: "Finally a platform that handles orthophotos, 3D models, and panoramas in one place. Our clients love the interactive viewers and easy sharing links.",
      author: "James T.",
      role: "Drone Operator",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-[#f8fafc] border-t border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] tracking-tight mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600">
            Trusted by professionals and organizations worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl border border-gray-200 light-card-shadow flex flex-col justify-between hover:border-gray-300 transition-all relative group"
            >
              <Quote className="w-10 h-10 text-blue-100 absolute top-6 right-6 pointer-events-none" />
              <div>
                <div className="flex items-center space-x-1 mb-6 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-6 italic">
                  "{item.quote}"
                </p>
              </div>
              <div className="pt-4 border-t border-gray-100 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0041e8] to-[#00c4cc] flex items-center justify-center font-bold text-white text-sm shadow-md">
                  {item.author[0]}
                </div>
                <div>
                  <div className="font-bold text-[#1a1a2e] text-sm">{item.author}</div>
                  <div className="text-xs text-gray-500 font-medium">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
