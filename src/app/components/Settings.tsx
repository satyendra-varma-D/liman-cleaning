import React from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Languages, Database, LogOut } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export function Settings() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">System {t('settings')}</h2>
        <p className="text-sm text-slate-400 font-bold mt-1">Configure your workspace and preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Section */}
        <SettingSection icon={User} title="Admin Profile">
          <div className="flex items-center gap-6 p-2">
            <div className="w-20 h-20 bg-blue-600 rounded-[28px] flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-blue-100">
              AD
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-black text-slate-800">Administrator</h4>
              <p className="text-sm text-slate-400 font-bold">admin@liman.ok</p>
              <div className="flex gap-2 mt-3">
                <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-slate-50 text-slate-500 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">Edit Profile</button>
                <button className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-slate-50 text-slate-500 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">Change Password</button>
              </div>
            </div>
          </div>
        </SettingSection>

        {/* Localization */}
        <SettingSection icon={Languages} title="Localization">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-black text-slate-800">System Language</h4>
              <p className="text-xs text-slate-400 font-bold mt-1">Change the interface language across all modules.</p>
            </div>
            <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-sm">
              <button
                onClick={() => setLanguage('de')}
                className={`px-6 py-2 text-[10px] font-black rounded-xl transition-all ${
                  language === 'de' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                DEUTSCH
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-6 py-2 text-[10px] font-black rounded-xl transition-all ${
                  language === 'en' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                ENGLISH
              </button>
            </div>
          </div>
        </SettingSection>

        {/* Notifications */}
        <SettingSection icon={Bell} title="Notifications">
          <div className="space-y-4">
            <ToggleItem label="WhatsApp Updates" description="Send job updates to workers automatically via WhatsApp." defaultChecked />
            <ToggleItem label="Email Reports" description="Receive a daily summary of completed and pending jobs." />
            <ToggleItem label="System Alerts" description="Notify when a job is understaffed or delayed." defaultChecked />
          </div>
        </SettingSection>

        {/* Security & Data */}
        <SettingSection icon={Database} title="Data Management">
          <div className="flex items-center justify-between p-4 bg-red-50/30 rounded-2xl border border-red-100/50">
            <div>
              <h4 className="text-sm font-black text-red-900">Danger Zone</h4>
              <p className="text-xs text-red-500 font-bold mt-1">Permanently delete all job history and worker data.</p>
            </div>
            <button className="px-6 py-2.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-100 hover:bg-red-600 transition-all">Reset Database</button>
          </div>
        </SettingSection>
      </div>
    </div>
  );
}

function SettingSection({ icon: Icon, title, children }: any) {
  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3 bg-slate-50/30">
        <Icon size={18} className="text-blue-500" strokeWidth={2.5} />
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{title}</h3>
      </div>
      <div className="p-8">
        {children}
      </div>
    </div>
  );
}

function ToggleItem({ label, description, defaultChecked }: any) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <h4 className="text-sm font-black text-slate-800">{label}</h4>
        <p className="text-xs text-slate-400 font-bold mt-0.5">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
}
