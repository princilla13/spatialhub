import React, { useState } from 'react';
import { Terminal, Copy, Check, ExternalLink, ChevronRight } from 'lucide-react';

export default function DeveloperSection() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('install');

  const installCmd = "curl -fsSL https://dronedb.app/install.sh | sh";

  const cliTabs = [
    {
      id: 'install',
      label: 'Install CLI',
      cmd: 'curl -fsSL https://dronedb.app/install.sh | sh',
      output: [
        'Downloading DroneDB CLI v2.4.1...',
        'Checking system compatibility (x86_64-linux)... OK',
        'Installing ddb binary to /usr/local/bin/ddb...',
        'DroneDB CLI installed successfully!',
        'Run "ddb --help" to get started.'
      ]
    },
    {
      id: 'upload',
      label: 'Upload Datasets',
      cmd: 'ddb push ./orthophoto.tif --hub https://hub.dronedb.app --project site-alpha',
      output: [
        '[1/3] Parsing GeoTIFF headers... EPSG:4326',
        '[2/3] Generating image tiles pyramid... Done',
        '[3/3] Uploading 412 MB to DroneDB Hub...',
        'SUCCESS: Dataset uploaded.'
      ]
    },
    {
      id: 'list',
      label: 'List Datasets',
      cmd: 'ddb list --type pointcloud',
      output: [
        'ID      NAME               TYPE        POINTS      SIZE',
        '4982    survey_flight_01   LAZ         14.2M       1.2 GB',
        '5012    quarry_scan_v2     Potree      82.5M       4.8 GB',
        '5104    bridge_inspection   glTF 3D    5.1M        640 MB'
      ]
    },
    {
      id: 'sync',
      label: 'Sync Local',
      cmd: 'ddb pull --project-id 4982 --out ./local_survey',
      output: [
        'Syncing dataset ID 4982 to ./local_survey...',
        'Fetched survey_flight_01.laz (1.2 GB)',
        'Fetched metadata.json',
        'Sync complete. 2 files updated.'
      ]
    }
  ];

  const currentTab = cliTabs.find(t => t.id === activeTab);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 bg-[#f8fafc] border-t border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#0041e8] text-xs font-bold mb-4 border border-blue-100 shadow-xs">
              <Terminal className="w-3.5 h-3.5" />
              <span>AUTOMATION & CLI</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a2e] tracking-tight mb-4 leading-tight">
              Power users <span className="text-red-500">❤️</span> us
            </h2>

            <p className="text-gray-600 text-base leading-relaxed mb-8">
              Command line friendly, excellent for automations and scripts.
            </p>

            <div className="bg-white p-4 rounded-2xl border border-gray-300 mb-8 font-mono text-xs sm:text-sm text-gray-800 flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-[#0041e8] font-bold">$</span>
                <span className="text-gray-900 whitespace-nowrap">{installCmd}</span>
              </div>
              <button
                onClick={() => handleCopy(installCmd)}
                className="p-2 text-gray-500 hover:text-[#0041e8] hover:bg-blue-50 rounded-lg transition-colors shrink-0"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <a 
                href="https://docs.dronedb.app/docs/cli" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-5 py-2.5 rounded-xl bg-[#0041e8] hover:bg-[#0036c2] text-white font-bold text-xs shadow-md shadow-[#0041e8]/20 flex items-center gap-1.5 transition-all"
              >
                <Terminal className="w-4 h-4 text-[#00c4cc]" />
                <span>Download CLI</span>
              </a>

              <a 
                href="https://docs.dronedb.app/docs/registry" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-semibold text-xs flex items-center gap-1 transition-all shadow-xs"
              >
                <span>Self-Host Guide</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-gray-800 overflow-hidden shadow-2xl bg-[#0f172a]">
              <div className="flex items-center justify-between px-4 py-3 bg-[#1e293b] border-b border-gray-700 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                  <span className="ml-2 font-mono text-gray-300">bash — dronedb-cli v2.4.1</span>
                </div>
                <button
                  onClick={() => handleCopy(currentTab.cmd)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-200 text-[11px] font-mono transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>

              <div className="flex border-b border-gray-800 bg-[#0f172a] px-2 pt-2 gap-1 overflow-x-auto">
                {cliTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-2 text-xs font-mono font-medium rounded-t-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-[#1e293b] text-[#00c4cc] border-t-2 border-[#00c4cc]'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                    }`}
                  >
                    <ChevronRight className="w-3 h-3" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-6 font-mono text-xs sm:text-sm leading-relaxed text-gray-300 min-h-[220px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4 text-[#00c4cc]">
                    <span>$</span>
                    <span className="text-white font-semibold">{currentTab.cmd}</span>
                  </div>
                  <div className="space-y-1.5 text-gray-400 text-xs">
                    {currentTab.output.map((line, idx) => (
                      <div key={idx} className={line.startsWith('SUCCESS') ? 'text-green-400 font-semibold' : ''}>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
                  <span>Status: READY</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Connected to DroneDB Hub
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
