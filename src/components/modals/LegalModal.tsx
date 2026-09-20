import React, { useState } from 'react';
import { FileText, Mail, ShieldAlert, ShieldCheck, X } from 'lucide-react';
import { APP_CONFIG } from '../../config/app.config';
import { useApp } from '../../context/AppContext';

export const LegalModal: React.FC<{
  initialTab?: 'terms' | 'privacy' | 'dmca' | 'compliance';
}> = ({ initialTab = 'terms' }) => {
  const { closeModal } = useApp();
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'dmca' | 'compliance'>(
    initialTab as any
  );

  return (
    <div
      id="legal-modal-backdrop"
      onClick={closeModal}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-150"
    >
      <div
        id="legal-modal-window"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-[#0b0e14] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-heading font-bold text-lg text-white">
              Legal, Safety & Compliance
            </h3>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-800/80 bg-slate-900/30 overflow-x-auto">
          {[
            { id: 'compliance', label: 'Authorized Media Notice' },
            { id: 'dmca', label: 'DMCA Takedown Policy' },
            { id: 'terms', label: 'Terms of Service' },
            { id: 'privacy', label: 'Privacy Policy' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar text-xs sm:text-sm text-slate-300 space-y-4 leading-relaxed">
          {activeTab === 'compliance' && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-white font-heading">
                Strict Authorized & Licensed Media Architecture
              </h4>
              <p>
                {APP_CONFIG.name} is engineered strictly in compliance with all relevant digital
                copyright laws and intellectual property rights.
              </p>
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-2">
                <p className="font-semibold text-white">Guiding Principles & Commitments:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>No unauthorized copyrighted media hosting or unlawful scraping.</li>
                  <li>No BitTorrent indexing, tracker sharing, or P2P swarm participation.</li>
                  <li>No DRM bypassing, key extraction, or proprietary protocol circumvention.</li>
                  <li>
                    All preview videos, trailers, and catalog metadata are sourced via authorized public-domain
                    archives, open-source movie benchmarks (Blender Open Projects), licensed distributor trailers,
                    or authenticated third-party catalog APIs.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'dmca' && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-white font-heading">
                DMCA & Copyright Compliance Notice
              </h4>
              <p>
                {APP_CONFIG.name} respects the intellectual property rights of creators and copyright holders
                worldwide. In accordance with the Digital Millennium Copyright Act (17 U.S.C. § 512), we respond
                promptly to notices of alleged copyright infringement.
              </p>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <p className="font-semibold text-white mb-1">Filing a Notification of Infringement:</p>
                <p className="text-xs text-slate-400 mb-2">
                  Please direct formal takedown requests to our designated agent:
                </p>
                <p className="text-xs text-amber-400 font-mono">
                  {APP_CONFIG.legalContactEmail}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-white font-heading">Terms of Service</h4>
              <p>
                By accessing and using {APP_CONFIG.name}, you agree to abide by these terms of use. This
                platform is provided as a modern digital discovery hub for cinema and television enthusiasts.
              </p>
              <p>
                Users agree not to attempt reverse-engineering, automated scraping beyond authorized rate limits,
                or misuse of public stream endpoints.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-white font-heading">Privacy & Data Governance</h4>
              <p>
                {APP_CONFIG.name} collects zero intrusive personal trackers or behavioral surveillance profiles.
                Your Watch History, My List selections, and audio/subtitle preferences remain strictly stored on
                your local client device and session database.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {APP_CONFIG.copyrightNotice}
          </span>
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
