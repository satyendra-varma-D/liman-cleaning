import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Briefcase } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Job } from '../types';
import { useLanguage } from '../LanguageContext';

interface Props {
  jobs: Job[];
}

export function Schedule({ jobs }: Props) {
  const { t, language } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Calendar grid math (padding for start of week)
  const startDay = monthStart.getDay(); // 0 is Sunday
  const paddingDays = Array.from({ length: startDay === 0 ? 6 : startDay - 1 }); // Assuming Monday start

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{t('schedule')}</h2>
          <p className="text-sm text-slate-400 font-semibold mt-1">{language === 'de' ? 'Verwalten und Anzeigen von Aufträgen über den Monat.' : 'Manage and view jobs across the month.'}</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <span className="text-sm font-bold text-slate-700 min-w-[140px] text-center uppercase tracking-widest">
            {format(currentMonth, 'MMMM yyyy', { locale: language === 'de' ? de : undefined })}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-50">
          {(language === 'de' ? ['MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO'] : ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']).map(day => (
            <div key={day} className="py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {paddingDays.map((_, i) => (
            <div key={`pad-${i}`} className="h-32 border-r border-b border-slate-50 bg-slate-50/30" />
          ))}
          
          {days.map(day => {
            const dayJobs = jobs.filter(j => isSameDay(new Date(j.date), day));
            return (
              <div 
                key={day.toString()} 
                className={`h-32 border-r border-b border-slate-50 p-3 transition-colors hover:bg-blue-50/10 relative ${isToday(day) ? 'bg-blue-50/5' : ''}`}
              >
                <span className={`text-sm font-bold ${isToday(day) ? 'text-blue-600' : 'text-slate-400'}`}>
                  {format(day, 'd')}
                </span>
                
                <div className="mt-2 space-y-1">
                  {dayJobs.slice(0, 3).map(job => (
                    <div 
                      key={job.id} 
                      className="text-[10px] font-bold px-2 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100/50 truncate flex items-center gap-1.5 shadow-sm"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      {job.client}
                    </div>
                  ))}
                  {dayJobs.length > 3 && (
                    <div className="text-[9px] font-bold text-slate-400 pl-2">
                      + {dayJobs.length - 3} {language === 'de' ? 'weitere' : 'more'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
