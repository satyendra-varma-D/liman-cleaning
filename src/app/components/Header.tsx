import { ChevronLeft, ChevronRight, Plus, Briefcase, Users } from 'lucide-react';
import { format, addDays, subDays, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

const BLUE = '#2563EB';
const ORANGE = '#F59E0B';

import { useLanguage } from '../LanguageContext';

import { UserRole } from '../types';

interface HeaderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onAddJob: () => void;
  jobCount: number;
  workerCount: number;
  userRole: UserRole;
}

export function Header({ selectedDate, onDateChange, onAddJob, jobCount, workerCount, userRole }: HeaderProps) {
  const { t, language } = useLanguage();
  const date = parseISO(selectedDate);
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const prevDate = format(subDays(date, 1), 'yyyy-MM-dd');
  const nextDate = format(addDays(date, 1), 'yyyy-MM-dd');
  const dayLabel = format(date, 'EEEE', { locale: language === 'de' ? de : undefined });
  const dateLabelShort = format(date, 'd. MMMM yyyy', { locale: language === 'de' ? de : undefined });
  const dayCapitalized = dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100">
      {/* Brand bar */}
      <div className="px-7 py-5 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="md:hidden w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-blue-100">L</div>
          <div className="hidden md:block">
            <h1 className="text-xl font-bold tracking-tight text-slate-800">{t('schedule')}</h1>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-1.5 flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
              Liman {t('cleaningService')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {/* Summary pills - integrated here for cleaner look */}
          <div className="hidden lg:flex gap-4 items-center mr-2">
            <div className="flex items-center gap-3 bg-blue-50/50 px-5 py-2.5 rounded-2xl border border-blue-100/50">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-blue-50 shadow-sm">
                <Briefcase size={15} className="text-blue-500" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-sm font-bold text-blue-900 leading-none tracking-tight">{jobCount}</div>
                <div className="text-[9px] text-blue-400 font-bold uppercase tracking-[0.1em] mt-1.5">{t('jobsCount')}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-orange-50/50 px-5 py-2.5 rounded-2xl border border-orange-100/50">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-orange-50 shadow-sm">
                <Users size={15} className="text-orange-400" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-sm font-bold text-orange-900 leading-none tracking-tight">{workerCount}</div>
                <div className="text-[9px] text-orange-400 font-bold uppercase tracking-[0.1em] mt-1.5">{t('staff')}</div>
              </div>
            </div>
          </div>

          {userRole !== 'supervisor' && (
            <button
              onClick={onAddJob}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl text-sm font-bold shadow-xl shadow-blue-100 transition-all active:scale-[0.97] group"
            >
              <Plus size={18} strokeWidth={3.5} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="tracking-tight">{t('createJob')}</span>
            </button>
          )}
        </div>
      </div>

    </header>
  );
}
