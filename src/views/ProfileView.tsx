import React, { useState } from 'react';
import {
  Check,
  Cpu,
  Database,
  Globe,
  HardDrive,
  Languages,
  Moon,
  RotateCcw,
  Server,
  Settings,
  Shield,
  Sliders,
  Sun,
  User,
  Volume2,
} from 'lucide-react';
import { APP_CONFIG, SUPPORTED_LANGUAGES } from '../config/app.config';
import { useApp } from '../context/AppContext';
import { providerManager } from '../providers/ProviderManager';
import { mediaApi } from '../services/api';

export const ProfileView: React.FC = () => {
  const {
    userProfile,
    updatePreferences,
    theme,
    setTheme,
    showToast,
    clearAllHistory,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'preferences' | 'providers' | 'account' | 'storage'>('preferences');
  const [providersList, setProvidersList] = useState(providerManager.getProviders());
  const [activeProvId, setActiveProvId] = useState(providerManager.getActiveProvider().id);

  const togglePreferredLanguage = (lang: string) => {
    const current = userProfile.preferences.preferredLanguages || [];
    const exists = current.includes(lang);
    const updated = exists ? current.filter((l) => l !== lang) : [...current, lang];
    updatePreferences({ preferredLanguages: updated });
    showToast(`Updated preferred languages`, 'info');
  };

  const handleProviderSwitch = async (id: string) => {
    const success = await mediaApi.setActiveProvider(id);
    if (success) {
      setActiveProvId(id);
      showToast(`Switched active media provider to: ${id}`, 'success');
      // refresh provider list
      const info = await mediaApi.getProviders();
      setProvidersList(info.providers);
      setActiveProvId(info.activeProviderId);
    }
  };

  const handleClearCache = () => {
    localStorage.removeItem('watchwithme_recent_searches');
    localStorage.removeItem('streamora_recent_searches');
    showToast('Search cache and temporary store cleared', 'success');
  };

  return (
    <div id="profile-page-view" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* User Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0e121a] border border-slate-800 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <img
          src={userProfile.avatar}
          alt={userProfile.name}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-amber-500/30"
        />
        <div className="space-y-1 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              {userProfile.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase border border-amber-500/30">
              {userProfile.role}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">{userProfile.email}</p>
          <p className="text-xs text-slate-400 pt-1">
            Member of {APP_CONFIG.name} since {new Date(userProfile.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-1">
        {[
          { id: 'preferences', label: 'Streaming & Playback', icon: <Sliders className="w-4 h-4" /> },
          { id: 'providers', label: 'Provider Architecture', icon: <Server className="w-4 h-4" /> },
          { id: 'storage', label: 'Storage & Privacy', icon: <HardDrive className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Preferences Section */}
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          {/* Default Quality */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="font-heading font-bold text-base text-white">Default Video Resolution</h3>
            <p className="text-xs text-slate-400">
              Choose stream quality preference when launching media.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Auto', '1080p', '720p', '4K'].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => updatePreferences({ defaultQuality: q as any })}
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    userProfile.preferences.defaultQuality === q
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                      : 'bg-slate-850 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Autoplay & Subtitles */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="font-heading font-bold text-base text-white">Playback Behaviors</h3>

            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <div>
                <p className="text-sm font-semibold text-white">Autoplay Next Episode</p>
                <p className="text-xs text-slate-400">
                  Automatically roll into subsequent episodes when credits finish.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  updatePreferences({
                    autoplayNextEpisode: !userProfile.preferences.autoplayNextEpisode,
                  })
                }
                className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative ${
                  userProfile.preferences.autoplayNextEpisode ? 'bg-amber-500' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    userProfile.preferences.autoplayNextEpisode ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-semibold text-white">Default Subtitle Language</p>
                <p className="text-xs text-slate-400">Preferred closed captions track.</p>
              </div>
              <select
                value={userProfile.preferences.defaultSubtitleLanguage}
                onChange={(e) => updatePreferences({ defaultSubtitleLanguage: e.target.value })}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
              >
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Hindi">Hindi</option>
                <option value="Japanese">Japanese</option>
              </select>
            </div>
          </div>

          {/* Preferred Languages (Requirement 11 & 22) */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <Languages className="w-5 h-5 text-amber-400" />
              <span>Language Personalization</span>
            </h3>
            <p className="text-xs text-slate-400">
              Select your priority languages to curate your home page and discovery feed.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = userProfile.preferences.preferredLanguages.includes(lang.name);
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => togglePreferredLanguage(lang.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-850 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Provider Architecture (Requirement 30: Replaceable Provider Management) */}
      {activeTab === 'providers' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-amber-400" />
              <span>Provider Architecture (ProviderManager)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Watch With Me adheres to a strict provider-agnostic abstraction layer. Front-end components
              never communicate directly with hardcoded media endpoints. All requests pass through
              the <code className="text-amber-400">IMediaProvider</code> gateway.
            </p>
          </div>

          <div className="space-y-3">
            {providersList.map((p) => {
              const isActive = activeProvId === p.id;
              return (
                <div
                  key={p.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-amber-500/10 border-amber-500/40 text-white'
                      : 'bg-slate-900/40 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-sm text-white">{p.name}</span>
                        <span className="px-2 py-0.2 rounded text-[10px] bg-slate-800 text-slate-400">
                          v{p.version}
                        </span>
                        {p.isAuthorized && (
                          <span className="px-2 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Licensed & Authorized
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{p.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleProviderSwitch(p.id)}
                      disabled={isActive}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      {isActive ? 'Active Provider' : 'Select Provider'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Storage & Privacy */}
      {activeTab === 'storage' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="font-heading font-bold text-base text-white">Local Storage & Privacy</h3>
            <p className="text-xs text-slate-400">
              Manage local cache, bookmarks, and watch history records.
            </p>

            <div className="flex items-center justify-between py-2 border-b border-slate-800">
              <div>
                <p className="text-sm font-semibold text-white">Clear Search Cache</p>
                <p className="text-xs text-slate-400">Delete recent query terms and suggestions.</p>
              </div>
              <button
                type="button"
                onClick={handleClearCache}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                Clear Search Cache
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-semibold text-white">Reset Watch History</p>
                <p className="text-xs text-slate-400">Remove all continue-watching progress.</p>
              </div>
              <button
                type="button"
                onClick={clearAllHistory}
                className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-semibold border border-red-900/40 cursor-pointer"
              >
                Reset All History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
