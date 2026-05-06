import React from 'react';
import { BarChart3, TrendingUp, CheckCircle2, Clock, Users, Briefcase } from 'lucide-react';
import type { Job } from '../types';
import { useLanguage } from '../LanguageContext';

interface Props {
  jobs: Job[];
}

export function Reports({ jobs }: Props) {
  const { t, language } = useLanguage();
  
  const completedJobs = jobs.filter(j => j.status === 'completed').length;
  const pendingJobs = jobs.filter(j => j.status === 'pending' || j.status === 'scheduled').length;
  const totalRevenue = completedJobs * 250; // Mock calculation

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{t('reports')}</h2>
        <p className="text-sm text-slate-400 font-semibold mt-1">{language === 'de' ? 'Analyse und Leistungsübersicht.' : 'Analytics and performance overview.'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={CheckCircle2} 
          label={t('statusCompleted')} 
          value={completedJobs.toString()} 
          color="emerald" 
          trend="+12%" 
        />
        <StatCard 
          icon={Clock} 
          label={t('statusInProgress')} 
          value={pendingJobs.toString()} 
          color="amber" 
          trend="-2%" 
        />
        <StatCard 
          icon={TrendingUp} 
          label={language === 'de' ? 'Gesch. Umsatz' : 'Est. Revenue'} 
          value={`€${totalRevenue.toLocaleString()}`} 
          color="blue" 
          trend="+8%" 
        />
        <StatCard 
          icon={Users} 
          label={language === 'de' ? 'Mitarbeiterauslastung' : 'Worker Utilization'} 
          value="84%" 
          color="purple" 
          trend="+5%" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Job Types Distribution */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Briefcase size={20} className="text-blue-500" />
            {language === 'de' ? 'Verteilung der Auftragsarten' : 'Job Types Distribution'}
          </h3>
          <div className="space-y-6">
            <ProgressBar label={t('windowCleaning')} percentage={45} color="#3B82F6" />
            <ProgressBar label={t('generalCleaning')} percentage={30} color="#10B981" />
            <ProgressBar label={t('specialCleaning')} percentage={15} color="#8B5CF6" />
            <ProgressBar label={t('snowRemoval')} percentage={10} color="#F59E0B" />
          </div>
        </div>

        {/* Recent Performance */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-orange-500" />
            {language === 'de' ? 'Monatliches Wachstum' : 'Monthly Growth'}
          </h3>
          <div className="flex items-end gap-3 h-48 px-4">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3">
                <div 
                  className="w-full bg-gradient-to-t from-slate-50 to-blue-500/20 rounded-xl transition-all hover:from-blue-100 hover:to-blue-600/30" 
                  style={{ height: `${h}%` }}
                />
                <span className="text-[9px] font-bold text-slate-400 uppercase">{(language === 'de' ? ['MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO'] : ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'])[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, trend }: any) {
  const colorMap: any = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  return (
    <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] group hover:border-blue-100 transition-all duration-500">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl border ${colorMap[color]} shadow-sm group-hover:scale-110 transition-transform`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {trend}
        </span>
      </div>
      <div className="text-2xl font-bold text-slate-800 tracking-tight">{value}</div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}

function ProgressBar({ label, percentage, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
        <span>{label}</span>
        <span className="text-slate-800">{percentage}%</span>
      </div>
      <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
        <div 
          className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.05)]" 
          style={{ width: `${percentage}%`, backgroundColor: color }} 
        />
      </div>
    </div>
  );
}
