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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1E293B', letterSpacing: '-0.03em' }}>{t('schedule')}</h2>
          <p style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600, marginTop: 4 }}>
            {language === 'de' ? 'Intelligente Monatsplanung & Einsatzübersicht' : 'Intelligent monthly planning & deployment overview'}
          </p>
        </div>
        
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 8, background: '#fff', padding: '6px', 
          borderRadius: 16, border: '1.5px solid #F1F5F9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}>
          <button 
            onClick={prevMonth} 
            style={{ 
              padding: '8px', background: 'transparent', border: 'none', color: '#64748B', 
              cursor: 'pointer', borderRadius: 10, transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F8FAFD'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#1E293B', minWidth: 120, textCenter: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {format(currentMonth, 'MMMM yyyy', { locale: language === 'de' ? de : undefined })}
          </span>
          <button 
            onClick={nextMonth} 
            style={{ 
              padding: '8px', background: 'transparent', border: 'none', color: '#64748B', 
              cursor: 'pointer', borderRadius: 10, transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F8FAFD'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div style={{ 
        background: '#fff', borderRadius: 32, border: '1.5px solid #F1F5F9', 
        boxShadow: '0 20px 40px rgba(0,0,0,0.03)', overflow: 'hidden'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1.5px solid #F1F5F9' }}>
          {(language === 'de' ? ['MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO'] : ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']).map(day => (
            <div key={day} style={{ padding: '16px 0', textAlign: 'center', fontSize: 10, fontWeight: 900, color: '#94A3B8', letterSpacing: '0.15em' }}>
              {day}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {paddingDays.map((_, i) => (
            <div key={`pad-${i}`} style={{ height: 140, borderRight: '1px solid #F8FAFD', borderBottom: '1px solid #F8FAFD', background: '#FAFBFE' }} />
          ))}
          
          {days.map(day => {
            const dayJobs = jobs.filter(j => isSameDay(new Date(j.date), day));
            const isTdy = isToday(day);
            return (
              <div 
                key={day.toString()} 
                style={{ 
                  height: 140, borderRight: '1px solid #F8FAFD', borderBottom: '1px solid #F8FAFD', 
                  padding: '12px', transition: 'all 0.2s', position: 'relative',
                  background: isTdy ? 'linear-gradient(180deg, #F0F7FF 0%, #fff 100%)' : '#fff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ 
                    fontSize: 14, fontWeight: 800, 
                    color: isTdy ? '#2563EB' : '#1E293B',
                    width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 10, background: isTdy ? '#DBEAFE' : 'transparent'
                  }}>
                    {format(day, 'd')}
                  </span>
                  {dayJobs.length > 0 && (
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563EB', boxShadow: '0 0 8px rgba(37, 99, 235, 0.4)' }} />
                  )}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {dayJobs.slice(0, 3).map(job => (
                    <div 
                      key={job.id} 
                      style={{ 
                        fontSize: 10, fontWeight: 800, padding: '6px 10px', borderRadius: 10, 
                        background: '#fff', color: '#1E293B', border: '1px solid #E2E8F0',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        display: 'flex', alignItems: 'center', gap: 6
                      }}
                    >
                      <div style={{ minWidth: 4, height: 10, borderRadius: 4, background: '#2563EB' }} />
                      {job.client}
                    </div>
                  ))}
                  {dayJobs.length > 3 && (
                    <div style={{ fontSize: 9, fontWeight: 800, color: '#94A3B8', padding: '2px 8px' }}>
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
