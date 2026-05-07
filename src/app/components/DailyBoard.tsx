import { useState } from 'react';
import { ChevronRight, AlertTriangle, Users, LayoutGrid, List, Clock, MapPin, CloudSun, CloudRain, Sun, Thermometer, Wind, Map as MapIcon } from 'lucide-react';
import type { Job, Worker, JobStatus, JobType } from '../types';
import { useLanguage } from '../LanguageContext';
import { JOB_TYPE_COLORS, STATUS_OPTIONS, BLUE, ORANGE } from '../constants';
import { MapPlanningView } from './MapPlanningView';

import { UserRole } from '../types';

interface Props {
  jobs: Job[];
  workers: Worker[];
  onJobClick: (job: Job) => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
  userRole: UserRole;
}

export function DailyBoard({ jobs, workers, onJobClick, onStatusChange, userRole }: Props) {
  const { t, language } = useLanguage();
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'map'>('kanban');

  const statusConfig: Record<JobStatus, { label: string; bg: string; color: string; bar: string; icon: string }> = {
    pending:      { label: t('statusPending'), bg: '#FEFCE8', color: '#854D0E', bar: '#FDE047', icon: '⏳' },
    scheduled:    { label: t('statusScheduled'),    bg: '#EFF6FF', color: '#1E40AF', bar: '#3B82F6', icon: '📅' },
    'in-progress':{ label: t('statusInProgress'),  bg: '#FFF7ED', color: '#9A3412', bar: '#F97316', icon: '⚡' },
    completed:    { label: t('statusCompleted'),   bg: '#F0FDF4', color: '#166534', bar: '#22C55E', icon: '✅' },
  };

  const jobTypeLabels: Record<JobType, string> = {
    window: t('windowCleaning'),
    special: t('specialCleaning'),
    snow: t('snowRemoval'),
    grass: 'Grass Cutting',
    machine: 'Machine Cleaning',
    general: t('generalCleaning'),
  };

  const getFirstName = (id: string) => {
    const w = workers.find(w => w.id === id);
    return w ? w.name.split(' ')[0] : '?';
  };

  const hasSupervisor = (job: Job) => {
    return job.assignedWorkers.some(id => workers.find(w => w.id === id)?.isSupervisor);
  };

  if (jobs.length === 0) {
    return (
      <div style={{ marginTop: 80, textAlign: 'center', padding: '48px 24px' }}>
        <div style={{ fontSize: 64, marginBottom: 20, opacity: 0.8 }}>📋</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#1E293B' }}>{t('noJobsToday')}</div>
        <div style={{ fontSize: 15, color: '#64748B', marginTop: 10, maxWidth: 300, margin: '10px auto 0' }}>
          {t('createFirstJob')}
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 10 }}>
      {/* Weather & Summary Bar */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
        {/* Weather Widget */}
        <div style={{ 
          flex: '0 0 300px', background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', 
          padding: '20px', borderRadius: 24, color: '#fff', position: 'relative', overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(37, 99, 235, 0.2)'
        }}>
          <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
            <CloudRain size={120} />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Wien, AT</div>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: 8, fontSize: 10, fontWeight: 700 }}>LIVE</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <CloudRain size={40} />
              <div>
                <div style={{ fontSize: 32, fontWeight: 800 }}>14°C</div>
                <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.9 }}>Light Rain</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', padding: '6px 10px', borderRadius: 12 }}>
                <Wind size={14} />
                <span style={{ fontSize: 11, fontWeight: 600 }}>12 km/h</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', padding: '6px 10px', borderRadius: 12 }}>
                <Thermometer size={14} />
                <span style={{ fontSize: 11, fontWeight: 600 }}>92% Rain</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16
        }}>
          <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 24, border: '1px solid #F1F5F9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Total Staff</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#1E293B' }}>{workers.length}</div>
          </div>
          <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 24, border: '1px solid #F1F5F9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', marginBottom: 4 }}>Available</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#16A34A' }}>{workers.filter(w => w.available && w.baseAvailable).length}</div>
          </div>
          <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 24, border: '1px solid #F1F5F9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: ORANGE, textTransform: 'uppercase', marginBottom: 4 }}>Assigned / Busy</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: ORANGE }}>{workers.filter(w => !w.available && w.baseAvailable).length}</div>
          </div>
          <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 24, border: '1px solid #F1F5F9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#DC2626', textTransform: 'uppercase', marginBottom: 4 }}>Not Available</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#DC2626' }}>{workers.filter(w => !w.baseAvailable).length}</div>
          </div>
        </div>
      </div>

      {/* View Switcher */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24, gap: 8 }}>
        <button
          onClick={() => setViewMode('list')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 10,
            background: viewMode === 'list' ? BLUE : '#fff',
            color: viewMode === 'list' ? '#fff' : '#64748B',
            border: '1.5px solid',
            borderColor: viewMode === 'list' ? BLUE : '#E2E8F0',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          <List size={16} /> {language === 'de' ? 'Liste' : 'List'}
        </button>
        <button
          onClick={() => setViewMode('kanban')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 10,
            background: viewMode === 'kanban' ? BLUE : '#fff',
            color: viewMode === 'kanban' ? '#fff' : '#64748B',
            border: '1.5px solid',
            borderColor: viewMode === 'kanban' ? BLUE : '#E2E8F0',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          <LayoutGrid size={16} /> Kanban
        </button>

        <button
          onClick={() => setViewMode('map')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 10,
            background: viewMode === 'map' ? BLUE : '#fff',
            color: viewMode === 'map' ? '#fff' : '#64748B',
            border: '1.5px solid',
            borderColor: viewMode === 'map' ? BLUE : '#E2E8F0',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          <MapIcon size={16} /> {language === 'de' ? 'Karte' : 'Map'}
        </button>
      </div>

      {viewMode === 'list' ? (
        <div style={{
          background: '#fff', borderRadius: 20, border: '1px solid #F1F5F9',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden'
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '100px 1fr 160px 200px 160px 40px',
            padding: '16px 24px', background: '#F8FAFD', borderBottom: '1px solid #F1F5F9'
          }}>
            {[t('time'), t('clientLocation'), t('type'), t('workers'), t('status'), ''].map((h, i) => (
              <div key={i} style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{h}</div>
            ))}
          </div>
          {/* List Rows */}
          {jobs.map((job, idx) => {
            const st = statusConfig[job.status];
            const ty = JOB_TYPE_COLORS[job.type] || JOB_TYPE_COLORS.general;
            const understaffed = job.assignedWorkers.length < job.workersNeeded;
            const missingSupervisor = job.workersNeeded > 1 && !hasSupervisor(job);
            return (
              <div
                key={job.id}
                onClick={() => onJobClick(job)}
                style={{
                  display: 'grid', gridTemplateColumns: '100px 1fr 160px 220px 160px 40px',
                  padding: '20px 24px', alignItems: 'center', cursor: 'pointer',
                  borderBottom: idx === jobs.length - 1 ? 'none' : '1px solid #F8FAFD',
                  borderLeft: `4px solid ${st.bar}`, transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              >
                <div style={{ fontSize: 20, fontWeight: 700, color: '#1E293B' }}>{job.time}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>{job.client}</div>
                    {job.isWeatherDependent && <CloudSun size={14} color={BLUE} />}
                  </div>
                  <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>📍 {job.location}</div>
                </div>
                <div><span style={{ background: ty.bg, color: ty.color, borderRadius: 8, padding: '5px 12px', fontSize: 12, fontWeight: 600 }}>{jobTypeLabels[job.type]}</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ 
                      display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8,
                      background: (understaffed || missingSupervisor) ? '#FEF2F2' : '#F8FAFC', 
                      color: (understaffed || missingSupervisor) ? '#DC2626' : '#64748B',
                      border: `1px solid ${(understaffed || missingSupervisor) ? '#FECACA' : '#E2E8F0'}`
                    }}>
                      <Users size={13} /> <span style={{ fontSize: 12, fontWeight: 700 }}>{job.assignedWorkers.length}/{job.workersNeeded}</span>
                    </div>
                    {(understaffed || missingSupervisor) && <AlertTriangle size={14} color="#DC2626" />}
                    {job.isWeatherDependent && (
                      <div style={{ 
                        display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8,
                        background: '#FFF7ED', color: '#C2410C', border: '1px solid #FFEDD5'
                      }}>
                        <CloudRain size={13} />
                        <span style={{ fontSize: 11, fontWeight: 800 }}>RISK</span>
                      </div>
                    )}
                  </div>
                <div onClick={e => e.stopPropagation()}>
                  <select
                    disabled={userRole === 'supervisor'}
                    value={job.status}
                    onChange={e => onStatusChange(job.id, e.target.value as JobStatus)}
                    style={{
                      background: st.bg, color: st.color, border: 'none', borderRadius: 8,
                      padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: userRole === 'supervisor' ? 'default' : 'pointer',
                      opacity: userRole === 'supervisor' ? 0.8 : 1
                    }}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{statusConfig[s].label}</option>)}
                  </select>
                </div>
                <ChevronRight size={18} style={{ color: '#CBD5E1', marginLeft: 'auto' }} />
              </div>
            );
          })}
        </div>
      ) : viewMode === 'map' ? (
        <MapPlanningView 
          jobs={jobs} 
          workers={workers} 
          onJobClick={onJobClick} 
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {STATUS_OPTIONS.map(status => {
            const statusJobs = jobs.filter(j => j.status === status);
            const conf = statusConfig[status];
            return (
              <div key={status} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Column Header */}
                <div style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: 12, background: '#fff', border: '1.5px solid #F1F5F9',
                  borderBottom: `3px solid ${conf.bar}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14 }}>{conf.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{conf.label}</span>
                  </div>
                  <div style={{ 
                    background: '#F1F5F9', color: '#64748B', borderRadius: 6, 
                    padding: '2px 8px', fontSize: 11, fontWeight: 700 
                  }}>
                    {statusJobs.length}
                  </div>
                </div>

                {/* Cards Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 400 }}>
                  {statusJobs.length === 0 ? (
                    <div style={{ 
                      padding: '24px', border: '2px dashed #F1F5F9', borderRadius: 16,
                      textAlign: 'center', color: '#94A3B8', fontSize: 12, fontWeight: 500
                    }}>
                      {language === 'de' ? 'Keine Aufträge' : 'No orders'}
                    </div>
                  ) : (
                    statusJobs.map(job => {
                      const ty = JOB_TYPE_COLORS[job.type] || JOB_TYPE_COLORS.general;
                      const understaffed = job.assignedWorkers.length < job.workersNeeded;
                      const missingSupervisor = job.workersNeeded > 1 && !hasSupervisor(job);
                      return (
                        <div
                          key={job.id}
                          onClick={() => onJobClick(job)}
                          style={{
                            background: '#fff', borderRadius: 16, padding: '16px',
                            border: '1.5px solid #F1F5F9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                            cursor: 'pointer', transition: 'all 0.2s', position: 'relative'
                          }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = BLUE)}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = '#F1F5F9')}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: '#1E293B' }}>{job.time}</div>
                            <span style={{ background: ty.bg, color: ty.color, borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 600 }}>
                              {jobTypeLabels[job.type]}
                            </span>
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A', marginBottom: 6 }}>{job.client}</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748B', fontSize: 12, marginBottom: 16 }}>
                            <MapPin size={12} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.location}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ 
                                display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 6,
                                background: (understaffed || missingSupervisor) ? '#FEF2F2' : '#F8FAFC', 
                                color: (understaffed || missingSupervisor) ? '#DC2626' : '#64748B',
                                border: `1px solid ${(understaffed || missingSupervisor) ? '#FECACA' : '#E2E8F0'}`
                              }}>
                                <Users size={11} /> <span style={{ fontSize: 11, fontWeight: 600 }}>{job.assignedWorkers.length}/{job.workersNeeded}</span>
                              </div>
                              {(understaffed || missingSupervisor) && <AlertTriangle size={12} color="#DC2626" title={missingSupervisor ? "Missing Supervisor" : "Understaffed"} />}
                              
                              {/* Weather Risk Alert */}
                              {job.isWeatherDependent && (
                                <div style={{ 
                                  display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 6,
                                  background: '#FFF7ED', color: '#C2410C', border: '1px solid #FFEDD5'
                                }}>
                                  <CloudRain size={11} />
                                  <span style={{ fontSize: 10, fontWeight: 700 }}>RISK</span>
                                </div>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: 2 }}>
                              {job.assignedWorkers.slice(0, 3).map(id => {
                                const w = workers.find(worker => worker.id === id);
                                return (
                                  <div key={id} title={w?.name} style={{ 
                                    width: 24, height: 24, borderRadius: 8, background: w?.isSupervisor ? '#16A34A' : BLUE, color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600,
                                    border: '2px solid #fff'
                                  }}>
                                    {w?.name[0] || '?'}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
