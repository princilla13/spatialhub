import React from 'react';
import { Rocket, BookOpen, Globe } from 'lucide-react';
import Globe3D from './Globe3D';

export default function HeroSection({ onOpenAuth }) {
  return (
    <section className="hero-section-orig smart-first-div">
      <div className="container-fluid max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column Content */}
          <div className="lg:col-span-6">
            <div className="py-8 sm:py-12">
              
              {/* Badge */}
              <div className="hero-badge-orig">
                <Globe className="w-4 h-4 text-[#00c4cc]" />
                <span>Geospatial Data Platform</span>
              </div>

              {/* Title with exact highlight */}
              <h1 className="hero-title-orig">
                Modern<br />
                <span className="highlight">Geospatial Data</span><br />
                Management
              </h1>

              {/* Subtitle */}
              <p className="hero-subtitle-orig">
                Store, visualize and share your geospatial data in the cloud.
                Orthophotos, point clouds, 3D models, geotagged files: all in one place.
              </p>

              {/* CTA Group */}
              <div className="flex flex-wrap gap-4 items-center">
                <button
                  type="button"
                  onClick={() => onOpenAuth('register')}
                  className="btn-hero-primary-orig"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Start Free Trial</span>
                </button>

                <a
                  href="https://docs.dronedb.app/docs/overview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-hero-secondary-orig"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read the Docs</span>
                </a>
              </div>

            </div>
          </div>

          {/* Right Column Interactive Globe */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <Globe3D />
          </div>

        </div>
      </div>
    </section>
  );
}
