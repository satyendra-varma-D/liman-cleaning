import React, { useState } from 'react';
import { LogIn, User, Lock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Infer role based on email for the prototype
    let inferredRole: UserRole = 'admin';
    const emailLower = email.toLowerCase();
    
    if (emailLower.includes('office') || emailLower.includes('secretary')) {
      inferredRole = 'secretary';
    }
    
    onLogin(inferredRole);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Left Side - Login Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-12 bg-white z-10 shadow-[20px_0_60px_rgba(0,0,0,0.02)]">
        <div className="w-full max-w-md space-y-10 relative">


          <div className="text-center lg:text-left">
            <h2 className="text-5xl font-bold text-slate-800 tracking-tight leading-tight">{t('welcomeBack')}</h2>
            <p className="mt-4 text-slate-400 font-semibold text-lg">Enter your professional credentials.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">{t('emailAddress')}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors">
                  <User className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="block w-full pl-14 pr-4 py-4.5 bg-slate-50/50 border-2 border-transparent rounded-2xl text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-500 transition-all font-bold"
                  required
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{t('password')}</label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-14 pr-4 py-4.5 bg-slate-50/50 border-2 border-transparent rounded-2xl text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-500 transition-all font-bold"
                  required
                />
              </div>
            </div>


            <button
              type="submit"
              className="w-full flex items-center justify-center px-6 py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-blue-100 group active:scale-[0.98] mt-8"
            >
              {t('signIn')}
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1.5 transition-transform" strokeWidth={3} />
            </button>
          </form>

          <div className="pt-4">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4 shadow-sm">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-2">Demo Credentials</div>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">Admin</span>
                  <div className="text-[11px] font-mono text-slate-600">admin@liman.at / admin123</div>
                </div>
                

              </div>
              <p className="text-[9px] text-slate-400 text-center italic">Any email/password will work for this prototype.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-slate-100">
        <img
          src="/login_right.png"
          alt="Liman Cleaning Service"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" /> {/* Subtle vignette for readability */}
        
        {/* Reference Content Overlay */}
        <div className="relative z-10 text-center px-12">
          <div className="mb-10">
            <h1 className="text-8xl md:text-10xl font-bold tracking-tighter text-white drop-shadow-2xl">
              Li<span className="text-blue-500">man</span>
            </h1>
          </div>
          <div className="inline-block px-10 py-4 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl">
            <h3 className="text-lg md:text-xl font-bold text-white tracking-[0.5em] uppercase opacity-90">
              Reinigung & Pflege
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};
