import React, { useState } from 'react';
import { Users, Database, ShieldAlert, Activity, HardDrive, Search, Filter, ShieldCheck, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';
import Dashboard from './Dashboard.jsx';

function LegacyDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Users', value: '12,540', change: '+12%', icon: Users, color: 'text-[#00c4cc]' },
    { label: 'Organizations', value: '1,450', change: '+8%', icon: Activity, color: 'text-[#0041e8]' },
    { label: 'Storage Used', value: '920.4 TB', change: '+24%', icon: HardDrive, color: 'text-purple-400' },
    { label: 'Abuse Reports', value: '3 Pending', change: 'Action Required', icon: ShieldAlert, color: 'text-red-400' }
  ];

  const reports = [
    { id: 'AB-849201', reporter: 'Jane Doe', target: 'https://hub.dronedb.app/r/user1/datasetA', reason: 'Copyright DMCA', status: 'Pending', priority: 'High' },
    { id: 'AB-392019', reporter: 'Alex Smith', target: 'https://hub.dronedb.app/r/user2/scan02', reason: 'Privacy Violation', status: 'In Review', priority: 'Medium' },
    { id: 'AB-102948', reporter: 'Marco R.', target: 'https://hub.dronedb.app/r/surveyor9/mesh', reason: 'Illegal Content', status: 'Resolved', priority: 'Critical' }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col font-['Inter',sans-serif]">
      
      {/* Admin Topbar */}
      <header className="bg-[#131b2e] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#0041e8] flex items-center justify-center font-bold text-white text-sm">
            DB
          </div>
          <span className="text-lg font-bold text-white tracking-tight">DroneDB Admin Dashboard</span>
          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-xs font-semibold">SUPERADMIN</span>
        </div>

        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <div className="flex items-center space-x-1 text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>API Server Online (99.98%)</span>
          </div>
          <span>|</span>
          <span>admin@dronedb.app</span>
        </div>
      </header>

      <div className="flex-1 flex">
        
        {/* Sidebar */}
        <aside className="w-64 bg-[#0d1322] border-r border-white/10 p-6 flex flex-col justify-between">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
                activeTab === 'overview' ? 'bg-[#0041e8] text-white shadow-lg shadow-[#0041e8]/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
                activeTab === 'reports' ? 'bg-[#0041e8] text-white shadow-lg shadow-[#0041e8]/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Abuse Reports (3)</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
                activeTab === 'users' ? 'bg-[#0041e8] text-white shadow-lg shadow-[#0041e8]/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>User Accounts</span>
            </button>

            <button
              onClick={() => setActiveTab('datasets')}
              className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-3 transition-colors ${
                activeTab === 'datasets' ? 'bg-[#0041e8] text-white shadow-lg shadow-[#0041e8]/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Geospatial Datasets</span>
            </button>
          </nav>

          <div className="pt-6 border-t border-white/10 text-xs text-gray-500">
            DroneDB Admin v2.4.0
          </div>
        </aside>

        {/* Main Content View */}
        <main className="flex-1 p-8 overflow-y-auto">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white capitalize">{activeTab} Dashboard</h1>
              <p className="text-xs text-gray-400">System oversight & platform moderation</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search accounts or datasets..."
                  className="pl-9 pr-4 py-2 rounded-xl bg-[#131b2e] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00c4cc]"
                />
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="glass-card p-6 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400 font-medium">{stat.label}</span>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-white font-mono">{stat.value}</div>
                  <div className="text-[11px] text-green-400 mt-1 font-semibold">{stat.change}</div>
                </div>
              );
            })}
          </div>

          {/* Abuse Reports Section */}
          <div className="glass-card rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>Platform Abuse Reports Queue</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 font-semibold">3 Action Required</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Ticket ID</th>
                    <th className="py-3 px-4">Reporter</th>
                    <th className="py-3 px-4">Violating Link</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-mono text-[#00c4cc] font-semibold">{report.id}</td>
                      <td className="py-3 px-4 text-white">{report.reporter}</td>
                      <td className="py-3 px-4 font-mono text-gray-400 max-w-xs truncate">{report.target}</td>
                      <td className="py-3 px-4 text-gray-300">{report.reason}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                          report.priority === 'High' || report.priority === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {report.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          report.status === 'Resolved' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="px-3 py-1 rounded bg-[#0041e8] hover:bg-[#0036c2] text-white text-[11px] font-semibold transition-colors">
                          Review Ticket
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

    </div>
  );
}

export default Dashboard;
