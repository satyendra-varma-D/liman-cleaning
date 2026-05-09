import React, { useState, useMemo } from 'react';
import { ArrowLeft, Edit2, Mail, Phone, Calendar as CalendarIcon, Briefcase, Star, MapPin, Clock, ChevronRight, Plus, List, Calendar, Info, AlertTriangle, CheckCircle2, ShieldCheck, ChevronLeft } from 'lucide-react';
import type { Worker, Job } from '../types';
import { useLanguage } from '../LanguageContext';
import { BLUE, ORANGE, JOB_TYPE_COLORS } from '../constants';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday, parseISO, addDays, subDays } from 'date-fns';

interface Props {
  worker: Worker;
  assignedJobs: Job[];
  onBack: () => void;
  onJobClick: (job: Job) => void;
  onAddLeave: (workerId: string, date: string) => void;
  allWorkers: Worker[];
}

export function WorkerDetail({ worker, assignedJobs, onBack, onJobClick, onAddLeave, allWorkers }: Props) {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'list' | 'month' | 'day'>('day');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentDay, setCurrentDay] = useState(new Date());
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveDate, setLeaveDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Calculate stats
  const attendancePercentage = 96; // Prototype value
  const inconsistencyScore = 4; // Prototype value (percentage of late/no-shows)

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const handleAddLeave = () => {
    onAddLeave(worker.id, leaveDate);
    setShowLeaveForm(false);
  };

  const handlePrevDate = () => {
    if (viewMode === 'month') setCurrentMonth(subMonths(currentMonth, 1));
    else setCurrentDay(subDays(currentDay, 1));
  };

  const handleNextDate = () => {
    if (viewMode === 'month') setCurrentMonth(addMonths(currentMonth, 1));
    else setCurrentDay(addDays(currentDay, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
    setCurrentDay(new Date());
  };

  return (
    <div style={{ width: '100%', maxWidth: 1400, margin: '0 auto', padding: '16px 24px', boxSizing: 'border-box', overflowX: 'hidden' }}>
      {/* Navigation Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button
            onClick={onBack}
            style={{
              width: 44, height: 44, borderRadius: 14,
              background: '#fff', border: '1.5px solid #F1F5F9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#64748B', transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.03em' }}>{worker.name}</h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: 14, fontWeight: 600 }}>{t('workerDetails')} ID: {worker.id}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => setShowLeaveForm(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#FEF2F2', border: '1.5px solid #FEE2E2',
              borderRadius: 14, padding: '12px 24px',
              cursor: 'pointer', fontSize: 15, fontWeight: 800, color: '#DC2626',
              transition: 'all 0.2s'
            }}
          >
            <Plus size={18} /> Add Leave
          </button>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#fff', border: '1.5px solid #E2E8F0',
              borderRadius: 14, padding: '12px 24px',
              cursor: 'pointer', fontSize: 15, fontWeight: 700, color: '#1E293B'
            }}
          >
            <Edit2 size={18} /> {t('edit')}
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 32 }}>
        <StatCard label={t('totalJobs')} value={worker.totalJobs?.toString() || '0'} color={BLUE} />
        <StatCard label="Attendance" value={`${attendancePercentage}%`} color="#16A34A" />
        <StatCard 
          label="Inconsistency" 
          value={`${inconsistencyScore}%`} 
          color={inconsistencyScore > 5 ? '#DC2626' : ORANGE}
          info="Rate of delayed starts or unannounced absences."
        />
        <StatCard label="Rating" value={`${worker.rating || '4.5'}★`} color={ORANGE} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Left Column: Profile Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
          <div style={{ 
            background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #F1F5F9',
            boxShadow: '0 20px 50px rgba(0,0,0,0.02)', textAlign: 'center'
          }}>
            <div style={{ 
              width: 100, height: 100, borderRadius: 32, background: BLUE, color: '#fff',
              margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, fontWeight: 700, position: 'relative', overflow: 'visible'
            }}>
              {worker.avatar ? (
                <img src={worker.avatar} alt={worker.name} style={{ width: '100%', height: '100%', borderRadius: 32, objectFit: 'cover' }} />
              ) : (
                worker.name[0]
              )}
              {worker.isSupervisor && (
                <div title="Supervisor" style={{ position: 'absolute', bottom: -10, right: -10, background: '#16A34A', borderRadius: '50%', border: '4px solid #fff', padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={20} color="#fff" />
                </div>
              )}
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>{worker.name}</h2>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginBottom: 24 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#F59E0B' }}>★</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#1E293B' }}>{worker.rating || '4.5'}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8', marginLeft: 4 }}>({worker.reliability}.0 rel.)</span>
            </div>

            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 24, textAlign: 'left' }}>
              <ProfileInfo icon={<Mail size={16} />} label="Email" value={worker.email || (worker.name.toLowerCase().replace(' ', '.') + '@liman-services.at')} />
              <ProfileInfo icon={<Phone size={16} />} label="Phone" value={worker.phone || "+43 664 123 45 67"} />
              <ProfileInfo icon={<MapPin size={16} />} label="Nationality" value={worker.nationality || "Austrian"} />
            </div>
          </div>

          <div style={{ 
            background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #F1F5F9',
            boxShadow: '0 20px 50px rgba(0,0,0,0.02)'
          }}>
             <h3 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 700, color: '#1E293B' }}>Skills & Expertise</h3>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {worker.skills.map(s => (
                   <span key={s} style={{ background: '#F1F5F9', color: '#475569', padding: '6px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}>{s}</span>
                ))}
             </div>

             {worker.tags && worker.tags.length > 0 && (
               <>
                 <h3 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 700, color: '#1E293B' }}>AI Optimization Tags</h3>
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                    {worker.tags.map(t => (
                       <span key={t} style={{ background: '#EFF6FF', color: BLUE, padding: '6px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700, border: '1px solid #DBEAFE' }}>
                         #{t}
                       </span>
                    ))}
                 </div>
               </>
             )}

             <h3 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 700, color: '#1E293B' }}>Additional Info</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: '#475569' }}>
                   <div style={{ width: 8, height: 8, borderRadius: '50%', background: worker.canDrive ? '#16A34A' : '#CBD5E1' }} />
                   <span>Driver's License: {worker.canDrive ? 'Yes' : 'No'}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {worker.languages.map(l => (
                    <span key={l} style={{ background: '#FFF7ED', color: '#C2410C', padding: '6px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700, border: '1px solid #FFEDD5' }}>{l}</span>
                  ))}
                </div>
             </div>
          </div>

          <div style={{ 
            background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #F1F5F9',
            boxShadow: '0 20px 50px rgba(0,0,0,0.02)'
          }}>
             <h3 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 700, color: '#1E293B' }}>Social Dynamics</h3>
             
             <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Good for grouping</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                   {worker.synergyWith && worker.synergyWith.length > 0 ? worker.synergyWith.map(id => {
                      const other = allWorkers.find(w => w.id === id);
                      return (
                        <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#F0FDF4', borderRadius: 12, border: '1px solid #DCFCE7' }}>
                           <div style={{ width: 28, height: 28, borderRadius: 8, background: '#16A34A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>{other?.name[0]}</div>
                           <span style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>{other?.name}</span>
                        </div>
                      );
                   }) : (
                      <div style={{ fontSize: 12, color: '#94A3B8', fontStyle: 'italic' }}>No specific synergies noted</div>
                   )}
                </div>
             </div>

             <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Avoid grouping</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                   {worker.conflictsWith && worker.conflictsWith.length > 0 ? worker.conflictsWith.map(id => {
                      const other = allWorkers.find(w => w.id === id);
                      return (
                        <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#FEF2F2', borderRadius: 12, border: '1px solid #FEE2E2' }}>
                           <div style={{ width: 28, height: 28, borderRadius: 8, background: '#DC2626', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>{other?.name[0]}</div>
                           <span style={{ fontSize: 13, fontWeight: 700, color: '#991B1B' }}>{other?.name}</span>
                        </div>
                      );
                   }) : (
                      <div style={{ fontSize: 12, color: '#94A3B8', fontStyle: 'italic' }}>No specific conflicts noted</div>
                   )}
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Deployment History / Calendar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
          <div style={{ 
            background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #F1F5F9',
            boxShadow: '0 20px 50px rgba(0,0,0,0.02)', minHeight: 600
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1E293B' }}>Assigned Work Orders</h3>
                <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontWeight: 600 }}>Active deployments and leave schedule</p>
              </div>
              <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 12 }}>
                <button 
                  onClick={() => setViewMode('list')}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10,
                    border: 'none', background: viewMode === 'list' ? '#fff' : 'transparent',
                    color: viewMode === 'list' ? BLUE : '#64748B', fontWeight: 800, cursor: 'pointer',
                    boxShadow: viewMode === 'list' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                    fontSize: 13, transition: 'all 0.2s'
                  }}
                >
                  <List size={16} /> List
                </button>
                <button 
                  onClick={() => setViewMode('month')}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10,
                    border: 'none', background: viewMode === 'month' ? '#fff' : 'transparent',
                    color: viewMode === 'month' ? BLUE : '#64748B', fontWeight: 800, cursor: 'pointer',
                    boxShadow: viewMode === 'month' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                    fontSize: 13, transition: 'all 0.2s'
                  }}
                >
                  <Calendar size={16} /> Month
                </button>
                <button 
                  onClick={() => setViewMode('day')}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10,
                    border: 'none', background: viewMode === 'day' ? '#fff' : 'transparent',
                    color: viewMode === 'day' ? BLUE : '#64748B', fontWeight: 800, cursor: 'pointer',
                    boxShadow: viewMode === 'day' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                    fontSize: 13, transition: 'all 0.2s'
                  }}
                >
                  <CalendarIcon size={16} /> Day
                </button>
              </div>
            </div>

            {viewMode === 'list' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {assignedJobs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', background: '#F8FAFD', borderRadius: 20 }}>
                    <Briefcase size={32} color="#94A3B8" style={{ marginBottom: 12 }} />
                    <div style={{ fontWeight: 700, color: '#64748B' }}>No assignments found</div>
                  </div>
                ) : (
                  assignedJobs.map(job => {
                    const typeStyle = JOB_TYPE_COLORS[job.type];
                    return (
                      <div 
                        key={job.id} 
                        onClick={() => onJobClick(job)}
                        style={{ 
                          padding: '20px 24px', borderRadius: 20, border: '1px solid #F1F5F9', background: '#F9FAFB',
                          display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer', transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = BLUE)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = '#F1F5F9')}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                            <span style={{ fontSize: 16, fontWeight: 700, color: '#1E293B' }}>{job.client}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: typeStyle.color, background: typeStyle.bg, padding: '2px 8px', borderRadius: 6 }}>
                              {job.type.toUpperCase()}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#64748B' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CalendarIcon size={13} /> {job.date}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} /> {job.time}</span>
                          </div>
                        </div>
                        <ChevronRight size={18} color="#CBD5E1" />
                      </div>
                    );
                  })
                )}
              </div>
            ) : viewMode === 'month' ? (
              <div style={{ padding: '0 4px' }}>
                {/* Calendar Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <h4 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#1E293B' }}>{format(currentMonth, 'MMMM yyyy')}</h4>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handlePrevDate} style={navBtnStyle}><ChevronLeft size={14} /></button>
                    <button onClick={handleToday} style={navBtnStyle}>Today</button>
                    <button onClick={handleNextDate} style={navBtnStyle}><ChevronRight size={14} /></button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                    <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 8 }}>{d}</div>
                  ))}
                  {monthDays.map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const dayJobs = assignedJobs.filter(j => j.date === dateStr);
                    const isLeave = worker.leaves?.includes(dateStr);
                    
                    return (
                      <div key={dateStr} style={{
                        minHeight: 100, padding: 8, borderRadius: 16, border: '1px solid #F1F5F9',
                        background: isLeave ? '#FEF2F2' : isToday(day) ? '#EFF6FF' : '#fff',
                        position: 'relative'
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: isToday(day) ? BLUE : '#64748B', marginBottom: 6 }}>
                          {format(day, 'd')}
                        </div>
                        
                        {isLeave && (
                          <div style={{ 
                            fontSize: 10, background: '#DC2626', color: '#fff', 
                            padding: '4px 8px', borderRadius: 6, fontWeight: 800, textAlign: 'center'
                          }}>
                            LEAVE
                          </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {dayJobs.map(j => (
                            <div 
                              key={j.id} 
                              onClick={(e) => { e.stopPropagation(); onJobClick(j); }}
                              style={{ 
                                fontSize: 9, padding: '3px 6px', borderRadius: 6, 
                                background: BLUE, color: '#fff', fontWeight: 700,
                                cursor: 'pointer', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'
                              }}
                            >
                              {j.time} {j.client}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* DAY VIEW */
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 500 }}>
                {/* Calendar Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <h4 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#1E293B' }}>{format(currentDay, 'EEEE, dd MMM yyyy')}</h4>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handlePrevDate} style={navBtnStyle}><ChevronLeft size={14} /></button>
                    <button onClick={handleToday} style={navBtnStyle}>Today</button>
                    <button onClick={handleNextDate} style={navBtnStyle}><ChevronRight size={14} /></button>
                  </div>
                </div>

                <div style={{ 
                  border: '1px solid #F1F5F9', 
                  borderRadius: 24, 
                  overflow: 'hidden', 
                  background: '#fff',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
                }}>
                  <div className="custom-scrollbar" style={{ 
                    overflowX: 'auto', 
                    WebkitOverflowScrolling: 'touch'
                  }}>
                    <div style={{ minWidth: 'max-content', position: 'relative' }}>
                      {/* Current Time Indicator Line */}
                      {isSameDay(currentDay, new Date()) && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          left: (new Date().getHours() + new Date().getMinutes()/60 - 6) * 120, // 180px per 1.5h = 120px per 1h
                          width: 2,
                          background: '#EF4444',
                          zIndex: 20,
                          pointerEvents: 'none'
                        }}>
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: -15,
                            width: 30,
                            height: 8,
                            background: '#EF4444',
                            borderRadius: '0 0 10px 10px'
                          }} />
                          <div style={{
                            position: 'absolute',
                            top: 10,
                            left: -20,
                            background: '#EF4444',
                            color: '#fff',
                            fontSize: 9,
                            fontWeight: 900,
                            padding: '1px 6px',
                            borderRadius: 6,
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                          }}>
                            {format(new Date(), 'HH:mm')}
                          </div>
                        </div>
                      )}

                      {/* Header */}
                      <div style={{ display: 'flex', background: '#F8FAFD', borderBottom: '1px solid #E2E8F0' }}>
                        {[
                          '06:00 - 07:30', '07:30 - 09:00', '09:00 - 10:30', 
                          '10:30 - 12:00', '12:00 - 13:30', '13:30 - 15:00',
                          '15:00 - 16:30', '16:30 - 18:00', '18:00 - 19:30',
                          '19:30 - 21:00', '21:00 - 22:30', '22:30 - 24:00'
                        ].map(block => (
                          <div key={block} style={{ width: 180, padding: '16px 12px', textAlign: 'center', fontSize: 11, fontWeight: 900, color: '#94A3B8', letterSpacing: '0.05em', borderRight: '1px solid #E2E8F0' }}>
                            {block}
                          </div>
                        ))}
                      </div>

                      {/* Slots */}
                      <div style={{ display: 'flex', minHeight: 400, background: '#fff', backgroundImage: 'linear-gradient(#F8FAFD 1px, transparent 1px), linear-gradient(90deg, #F8FAFD 1px, transparent 1px)', backgroundSize: '100% 60px, 180px 100%' }}>
                        {[6, 7.5, 9, 10.5, 12, 13.5, 15, 16.5, 18, 19.5, 21, 22.5].map(startHour => {
                          const endHour = startHour + 1.5;
                          const dateStr = format(currentDay, 'yyyy-MM-dd');
                          const blockJobs = assignedJobs.filter(j => {
                            const [h, m] = j.time.split(':').map(Number);
                            const jobTime = h + m/60;
                            return j.date === dateStr && jobTime >= startHour && jobTime < endHour;
                          });

                          return (
                            <div key={startHour} style={{ width: 180, borderRight: '1px solid #F1F5F9', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                              {blockJobs.map(job => {
                                const jobColor = job.type === 'general' ? '#10B981' : 
                                                job.type === 'deep' ? BLUE : 
                                                job.type === 'industrial' ? '#8B5CF6' : ORANGE;
                                return (
                                  <div 
                                    key={job.id} 
                                    onClick={() => onJobClick(job)}
                                    style={{ 
                                      padding: '12px 14px', borderRadius: 12, background: '#fff', 
                                      border: '1px solid #E2E8F0', borderLeft: `4px solid ${jobColor}`,
                                      cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', 
                                      transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: 4
                                    }}
                                    onMouseEnter={e => {
                                      e.currentTarget.style.transform = 'translateY(-2px)';
                                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)';
                                    }}
                                    onMouseLeave={e => {
                                      e.currentTarget.style.transform = 'translateY(0)';
                                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                                    }}
                                  >
                                    <div style={{ fontSize: 11, fontWeight: 900, color: '#64748B' }}>{job.time}</div>
                                    <div style={{ fontSize: 14, fontWeight: 800, color: '#1E293B', lineHeight: 1.2 }}>{job.client}</div>
                                    <div style={{ fontSize: 11, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, marginTop: 4 }}>
                                      <MapPin size={12} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.location}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                
                <style dangerouslySetInnerHTML={{ __html: `
                  .custom-scrollbar::-webkit-scrollbar {
                    height: 10px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: #F8FAFD;
                    border-radius: 5px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #CBD5E1;
                    border-radius: 5px;
                    border: 3px solid #F8FAFD;
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94A3B8;
                  }
                `}} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leave Modal */}
      {showLeaveForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 24, width: 400, boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: 20, fontWeight: 900, color: '#1E293B' }}>Register Leave</h3>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 8 }}>Select Date</label>
            <input 
              type="date" 
              value={leaveDate}
              onChange={e => setLeaveDate(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E2E8F0', outline: 'none', marginBottom: 24, fontSize: 15, fontWeight: 600 }}
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowLeaveForm(false)} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid #E2E8F0', background: '#fff', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleAddLeave} style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: '#DC2626', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Confirm Leave</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileInfo({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <div style={{ color: '#94A3B8' }}>{icon}</div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{value}</div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, info }: { label: string; value: string; color: string; info?: string }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div style={{ 
      background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #F1F5F9',
      boxShadow: '0 10px 30px rgba(0,0,0,0.02)', textAlign: 'center',
      position: 'relative'
    }}>
      {info && (
        <button 
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
          style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', color: '#94A3B8', cursor: 'help' }}
        >
          <Info size={14} />
        </button>
      )}
      {showInfo && info && (
        <div style={{
          position: 'absolute', top: 36, right: 0, width: 200, background: '#1E293B', color: '#fff',
          padding: 12, borderRadius: 12, fontSize: 11, fontWeight: 600, zIndex: 10, textAlign: 'left',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)', lineHeight: 1.4
        }}>
          {info}
        </div>
      )}
      <div style={{ fontSize: 32, fontWeight: 900, color: color, marginBottom: 4, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  );
}

const navBtnStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 8,
  background: '#fff',
  border: '1.5px solid #F1F5F9',
  fontSize: 12,
  fontWeight: 800,
  color: '#64748B',
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};
