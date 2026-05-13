import React, { useState } from 'react';
import { ChevronRight, AlertTriangle, Users, LayoutGrid, List, Clock, MapPin, CloudSun, CloudRain, Sun, Thermometer, Wind, Cloud, Map as MapIcon, ShieldCheck, Plus, Briefcase, CheckCircle2, Calendar as CalendarIcon } from 'lucide-react';
import type { Job, Worker, JobStatus, JobType, Vehicle } from '../types';
import { useLanguage } from '../LanguageContext';
import { JOB_TYPE_COLORS, STATUS_OPTIONS, BLUE, ORANGE } from '../constants';
import { MapPlanningView } from './MapPlanningView';
import { UserRole } from '../types';

interface Props {
  jobs: Job[];
  workers: Worker[];
  vehicles: Vehicle[];
  onJobClick: (job: Job) => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
  onUnassignWorker: (workerId: string, jobId: string) => void;
  onAssignWorker: (workerId: string) => void;
  onWorkerClick: (worker: Worker) => void;
  onReschedule: (job: Job) => void;
  onCreateJob: () => void;
}

export function DailyBoard({ jobs, workers, vehicles, onJobClick, onStatusChange, onUnassignWorker, onAssignWorker, onWorkerClick, onReschedule, onCreateJob }: Props) {
  const { t, language } = useLanguage();
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'map'>('kanban');

  const HOURLY_FORECAST = [
    { time: '22:00', temp: 14, icon: <CloudRain size={20} />, pop: '90%' },
    { time: '23:00', temp: 13, icon: <CloudRain size={20} />, pop: '85%' },
    { time: '00:00', temp: 12, icon: <CloudSun size={20} />, pop: '40%' },
    { time: '01:00', temp: 12, icon: <CloudSun size={20} />, pop: '20%' },
    { time: '02:00', temp: 11, icon: <Cloud size={20} />, pop: '10%' },
    { time: '03:00', temp: 11, icon: <Cloud size={20} />, pop: '5%' },
    { time: '04:00', temp: 10, icon: <Sun size={20} />, pop: '0%' },
    { time: '05:00', temp: 10, icon: <Sun size={20} />, pop: '0%' },
    { time: '06:00', temp: 12, icon: <Sun size={20} />, pop: '0%' },
    { time: '07:00', temp: 14, icon: <Sun size={20} />, pop: '0%' },
    { time: '08:00', temp: 15, icon: <Sun size={20} />, pop: '0%' },
    { time: '09:00', temp: 17, icon: <Sun size={20} />, pop: '0%' },
  ];

  const statusConfig: Record<string, { label: string; bg: string; color: string; bar: string; icon: string }> = {
    pending:      { label: t('statusPending'), bg: '#FEFCE8', color: '#854D0E', bar: '#FDE047', icon: '⏳' },
    scheduled:    { label: t('statusScheduled'), bg: '#EFF6FF', color: '#1E40AF', bar: '#3B82F6', icon: '📅' },
    'in-progress':{ label: t('statusInProgress'), bg: '#FFF7ED', color: '#9A3412', bar: '#F97316', icon: '⚡' },
    completed:    { label: t('statusCompleted'), bg: '#F0FDF4', color: '#166534', bar: '#22C55E', icon: '✅' },
    unassigned:   { label: 'Unassigned',         bg: '#FEF2F2', color: '#EF4444', bar: '#EF4444', icon: '⚠️' },
    incomplete:   { label: 'Incomplete',         bg: '#FFF1F2', color: '#E11D48', bar: '#E11D48', icon: '❗' },
    // Column mappings
    upcoming:     { label: 'Scheduled / At Risk', bg: '#EFF6FF', color: '#1E40AF', bar: '#3B82F6', icon: '📅' },
    ongoing:      { label: 'Work in Progress',    bg: '#FFF7ED', color: '#9A3412', bar: '#F97316', icon: '⚡' },
  };

  const getJobRisk = (job: Job) => {
    // Weather risk (highest priority)
    const currentPop = parseInt(HOURLY_FORECAST[0].pop);
    const isHeavyPrecip = currentPop > 70;
    
    if ((job.type === 'snow' || job.type === 'window' || job.type === 'facade' || job.type === 'special') && isHeavyPrecip) {
      const weatherReason = job.type === 'snow' ? 'Heavy Snow Risk' : 'Bad Weather Risk';
      return { isRisk: true, reason: weatherReason };
    }

    const understaffed = job.assignedWorkers.length < job.workersNeeded;
    const missingSupervisor = job.workersNeeded > 1 && !hasSupervisor(job);
    const hasInactiveMember = job.assignedWorkers.some(id => !workers.find(w => w.id === id)?.available);

    if (hasInactiveMember) return { isRisk: true, reason: 'Inactive Member' };
    if (understaffed) return { isRisk: true, reason: 'Understaffed' };
    if (missingSupervisor) return { isRisk: true, reason: 'No Supervisor' };
    
    return { isRisk: false };
  };

  const jobTypeLabels: Record<JobType, string> = {
    window: t('windowCleaning'),
    special: t('specialCleaning'),
    snow: t('snowRemoval'),
    grass: 'Grass Cutting',
    machine: 'Machine Cleaning',
    general: t('generalCleaning'),
    office: 'Office Cleaning',
    facade: 'Facade Cleaning',
    industrial: 'Industrial Cleaning',
  };

  const hasSupervisor = (job: Job) => {
    return job.assignedWorkers.some(id => workers.find(w => w.id === id)?.isSupervisor);
  };

  const jobStats = {
    total: jobs.length,
    completed: jobs.filter(j => j.status === 'completed').length,
    scheduled: jobs.filter(j => (j.status === 'scheduled' || j.status === 'pending' || j.status === 'in-progress') && !getJobRisk(j).isRisk).length,
    atRisk: jobs.filter(j => j.status === 'unassigned' || j.status === 'incomplete' || getJobRisk(j).isRisk).length
  };



  return (
    <div style={{ marginTop: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* 1. Google Weather Hourly Forecast */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)', 
        padding: '16px 20px', borderRadius: 20, color: '#fff', 
        boxShadow: '0 10px 30px rgba(59, 130, 246, 0.2)',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', marginBottom: 2 }}>Wien, AT</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <CloudRain size={36} />
                <div style={{ fontSize: 36, fontWeight: 800 }}>14°</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>Light Rain</div>
            </div>
            <div style={{ height: 40, width: 1, background: 'rgba(255,255,255,0.2)' }} />
            <div style={{ display: 'flex', gap: 20 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.7, marginBottom: 2 }}>PRECIPITATION</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>92%</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.7, marginBottom: 2 }}>HUMIDITY</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>78%</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.7, marginBottom: 2 }}>WIND</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>12 km/h</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>Updated 5m ago</div>
            <div style={{ background: '#EF4444', color: '#fff', padding: '6px 12px', borderRadius: 12, fontSize: 12, fontWeight: 800 }}>LIVE</div>
          </div>
        </div>
        
        {/* Hourly Scroll */}
        <div style={{ 
          display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 4,
          scrollbarWidth: 'none', msOverflowStyle: 'none'
        }}>
          {HOURLY_FORECAST.map((h, i) => (
            <div key={i} style={{ textAlign: 'center', minWidth: 50 }}>
              <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.8, marginBottom: 8 }}>{h.time}</div>
              <div style={{ marginBottom: 8, color: h.pop !== '0%' ? '#93C5FD' : '#FDE047' }}>
                {React.cloneElement(h.icon as React.ReactElement, { size: 16 })}
              </div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>{h.temp}°</div>
              <div style={{ fontSize: 9, fontWeight: 700, opacity: 0.6, marginTop: 2 }}>{h.pop}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Workers Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1E293B' }}>Workers Status</h2>
        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { id: 'total', label: 'Total Workers', count: 250, color: '#1E293B', bg: '#fff', icon: <Users size={20} /> },
            { id: 'busy', label: 'Assigned / Busy', count: 198, color: ORANGE, bg: '#fff', icon: <Clock size={20} /> },
            { id: 'available', label: 'Available', count: 42, color: '#16A34A', bg: '#fff', icon: <Sun size={20} /> },
            { id: 'not-available', label: 'Not Available', count: 10, color: '#DC2626', bg: '#fff', icon: <AlertTriangle size={20} /> }
          ].map(stat => (
            <div 
              key={stat.id}
              style={{ 
                background: stat.bg, padding: '24px', borderRadius: 24, border: '1.5px solid #F1F5F9',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)', 
                position: 'relative', overflow: 'hidden',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.1em' }}>{stat.label}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#1E293B', letterSpacing: '-0.02em' }}>{stat.count}</div>
                <div style={{ 
                  background: '#F8FAFD', 
                  padding: '10px', borderRadius: 14, color: stat.color
                }}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2.5 Job Status Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1E293B' }}>Job Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'Total Jobs', count: jobStats.total, color: BLUE, icon: <Briefcase size={20} /> },
            { label: 'Completed', count: jobStats.completed, color: '#16A34A', icon: <CheckCircle2 size={20} /> },
            { label: 'Scheduled', count: jobStats.scheduled, color: BLUE, icon: <CalendarIcon size={20} /> },
            { label: 'Unscheduled / At Risk', count: jobStats.atRisk, color: '#DC2626', icon: <AlertTriangle size={20} /> }
          ].map((stat, i) => (
            <div 
              key={i}
              style={{ 
                background: '#fff', padding: '24px', borderRadius: 24, border: '1.5px solid #F1F5F9',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)', 
                transition: 'transform 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.1em' }}>{stat.label}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#1E293B', letterSpacing: '-0.02em' }}>{stat.count}</div>
                <div style={{ 
                  background: '#F8FAFD', 
                  padding: '10px', borderRadius: 14, color: stat.color
                }}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
