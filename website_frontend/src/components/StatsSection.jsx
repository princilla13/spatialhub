import React, { useState, useEffect } from 'react';
import { Users, Building2, Database, HardDrive } from 'lucide-react';

export default function StatsSection() {
  const [counts, setCounts] = useState({ users: 0, orgs: 0, datasets: 0, tb: 0 });

  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const intervalTime = duration / steps;
    
    const targetUsers = 1300;
    const targetOrgs = 2500;
    const targetDatasets = 5600;
    const targetTB = 4.5;

    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({
        users: Math.floor(targetUsers * progress),
        orgs: Math.floor(targetOrgs * progress),
        datasets: Math.floor(targetDatasets * progress),
        tb: (targetTB * progress).toFixed(1),
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts({
          users: targetUsers,
          orgs: targetOrgs,
          datasets: targetDatasets,
          tb: targetTB.toFixed(1)
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    { icon: Users, value: `${counts.users.toLocaleString()}`, label: "Active Users", color: "text-[#0041e8]", bg: "bg-blue-50" },
    { icon: Building2, value: `${counts.orgs.toLocaleString()}`, label: "Organizations", color: "text-[#0099b8]", bg: "bg-cyan-50" },
    { icon: Database, value: `${counts.datasets.toLocaleString()}`, label: "Datasets", color: "text-purple-600", bg: "bg-purple-50" },
    { icon: HardDrive, value: `${counts.tb} TB`, label: "Data Stored", color: "text-emerald-600", bg: "bg-emerald-50" }
  ];

  return (
    <section className="py-12 bg-[#f8fafc] border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex items-center space-x-4 p-5 rounded-2xl bg-white border border-gray-200 shadow-xs hover:shadow-md transition-all">
                <div className={`p-3.5 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#1a1a2e] tracking-tight font-mono">{stat.value}</div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-500">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
