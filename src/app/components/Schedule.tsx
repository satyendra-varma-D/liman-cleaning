import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Briefcase, AlertCircle, Clock, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday, startOfWeek, endOfWeek } from 'date-fns';
import { de } from 'date-fns/locale';
import type { Job, JobStatus } from '../types';
import { useLanguage } from '../LanguageContext';
import { BLUE, ORANGE } from '../constants';

interface Props {
  jobs: Job[];
  onMoveJob: (jobId: string, newDate: string) => void;
  onJobClick: (job: Job) => void;
}

const STATUS_COLORS: Record<JobStatus, { bg: string; color: string; border: string; icon?: React.ReactNode }> = {
  'unassigned': { bg: '#F8FAFD', color: '#64748B', border: '1.5px dashed #CBD5E1' },
  'scheduled': { bg: '#EFF6FF', color: BLUE, border: '1px solid #DBEAFE' },
  'in-progress': { bg: '#EEF2FF', color: '#4F46E5', border: '1px solid #E0E7FF' },
  'completed': { bg: '#F0FDF4', color: '#16A34A', border: '1px solid #DCFCE7' },
  'pending': { bg: '#FFFBEB', color: '#D97706', border: '1px solid #FEF3C7' },
  'incomplete': { bg: '#FEF2F2', color: '#DC2626', border: '1px solid #FEE2E2' }
};

export function Schedule({ jobs, onMoveJob, onJobClick }: Props) {
  const { t, language } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  // Get the start of the week for the first day of the month to fill padding
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const handleDragStart = (e: React.DragEvent, jobId: string) => {
    e.dataTransfer.setData('jobId', jobId);
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('jobId');
    onMoveJob(jobId, format(date, 'yyyy-MM-dd'));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header matching reference image */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Deployment planning</h2>
          <p style={{ fontSize: 14, color: '#64748B', marginTop: 4, fontWeight: 600 }}>
            Intelligent monthly planning & deployment overview
          </p>
        </div>
        
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 12, background: '#fff', padding: '8px 16px', 
          borderRadius: 18, border: '1.5px solid #F1F5F9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}>
          <button onClick={prevMonth} style={navBtnStyle}><ChevronLeft size={20} /></button>
          <span style={{ fontSize: 15, fontWeight: 900, color: '#1E293B', minWidth: 140, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {format(currentMonth, 'MMMM yyyy', { locale: language === 'de' ? de : undefined })}
          </span>
          <button onClick={nextMonth} style={navBtnStyle}><ChevronRight size={20} /></button>
        </div>
      </div>

      <div style={{ 
        background: '#fff', borderRadius: 32, border: '1.5px solid #F1F5F9', 
        boxShadow: '0 20px 60px rgba(0,0,0,0.03)', overflow: 'hidden'
      }}>
        {/* Days of week header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#F8FAFD', borderBottom: '1.5px solid #F1F5F9' }}>
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
            <div key={day} style={{ padding: '20px 0', textAlign: 'center', fontSize: 11, fontWeight: 900, color: '#94A3B8', letterSpacing: '0.1em' }}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {days.map((day, idx) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayJobs = jobs.filter(j => j.date === dateStr);
            const isTdy = isToday(day);
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            
            return (
              <div 
                key={day.toString()} 
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, day)}
                style={{ 
                  height: 180, borderRight: '1px solid #F1F5F9', borderBottom: '1px solid #F1F5F9', 
                  padding: '16px', transition: 'all 0.2s', position: 'relative',
                  background: !isCurrentMonth ? '#FAFBFE' : isTdy ? '#F0F7FF' : '#fff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ 
                    fontSize: 15, fontWeight: 900, 
                    color: !isCurrentMonth ? '#CBD5E1' : isTdy ? BLUE : '#1E293B',
                    width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: 12, background: isTdy ? '#DBEAFE' : 'transparent'
                  }}>
                    {format(day, 'd')}
                  </span>
                  {dayJobs.length > 0 && (
                    <div style={{ 
                      fontSize: 10, fontWeight: 800, color: BLUE, background: '#DBEAFE', 
                      padding: '2px 8px', borderRadius: 8 
                    }}>
                      {dayJobs.length} {dayJobs.length === 1 ? 'Job' : 'Jobs'}
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 110, overflowY: 'hidden' }}>
                  {dayJobs.map(job => {
                    const style = STATUS_COLORS[job.status] || STATUS_COLORS['scheduled'];
                    return (
                      <div 
                        key={job.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, job.id)}
                        onClick={() => onJobClick(job)}
                        style={{ 
                          fontSize: 11, fontWeight: 800, padding: '8px 12px', borderRadius: 12, 
                          background: style.bg, color: style.color, border: style.border,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          display: 'flex', alignItems: 'center', gap: 8, cursor: 'grab',
                          transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                        }}
                      >
                        <div style={{ minWidth: 4, height: 12, borderRadius: 4, background: style.color }} />
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.client}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const navBtnStyle: React.CSSProperties = {
  padding: '8px',
  background: 'transparent',
  border: 'none',
  color: '#64748B',
  cursor: 'pointer',
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s'
};
