import React, { useState } from 'react';
import { ChevronRight, AlertTriangle, Users, LayoutGrid, List, Clock, MapPin, CloudSun, CloudRain, Sun, Thermometer, Wind, Cloud, Map as MapIcon } from 'lucide-react';
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
  userRole: UserRole;
}

export function DailyBoard({ jobs, workers, vehicles, onJobClick, onStatusChange, onUnassignWorker, onAssignWorker, onWorkerClick, onReschedule, userRole }: Props) {
  const { t, language } = useLanguage();
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'map'>('kanban');
  const [selectedWorkerFilter, setSelectedWorkerFilter] = useState<'total' | 'available' | 'busy' | 'not-available' | null>('available');

  const statusConfig: Record<string, { label: string; bg: string; color: string; bar: string; icon: string }> = {
    upcoming:     { label: 'Scheduled / At Risk', bg: '#EFF6FF', color: '#1E40AF', bar: '#3B82F6', icon: '📅' },
    ongoing:      { label: 'Work in Progress',    bg: '#FFF7ED', color: '#9A3412', bar: '#F97316', icon: '⚡' },
    completed:    { label: 'Completed',          bg: '#F0FDF4', color: '#166534', bar: '#22C55E', icon: '✅' },
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
  };

  const hasSupervisor = (job: Job) => {
    return job.assignedWorkers.some(id => workers.find(w => w.id === id)?.isSupervisor);
  };

  const availableWorkers = workers.filter(w => w.available && w.baseAvailable);
  const busyWorkers = workers.filter(w => !w.available && w.baseAvailable);
  const unavailableWorkers = workers.filter(w => !w.baseAvailable);

  const filteredWorkersForTable = selectedWorkerFilter === 'total' ? workers :
                                  selectedWorkerFilter === 'available' ? availableWorkers :
                                  selectedWorkerFilter === 'busy' ? busyWorkers :
                                  selectedWorkerFilter === 'not-available' ? unavailableWorkers : [];

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1E293B' }}>Workers Status</h2>
          {selectedWorkerFilter && (
            <button 
              onClick={() => setSelectedWorkerFilter(null)}
              style={{ fontSize: 12, fontWeight: 600, color: BLUE, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Clear Filter
            </button>
          )}
        </div>
        
        {/* Stats Grid - Clickable */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { id: 'total', label: 'Total Workers', count: workers.length, color: '#1E293B', bg: '#fff', icon: <Users size={20} /> },
            { id: 'available', label: 'Available', count: availableWorkers.length, color: '#16A34A', bg: '#fff', icon: <Sun size={20} /> },
            { id: 'busy', label: 'Assigned / Busy', count: busyWorkers.length, color: ORANGE, bg: '#fff', icon: <Clock size={20} /> },
            { id: 'not-available', label: 'Not Available', count: unavailableWorkers.length, color: '#DC2626', bg: '#fff', icon: <AlertTriangle size={20} /> }
          ].map(stat => (
            <div 
              key={stat.id}
              onClick={() => setSelectedWorkerFilter(stat.id as any)}
              style={{ 
                background: stat.bg, padding: '24px', borderRadius: 24, border: '1.5px solid',
                borderColor: selectedWorkerFilter === stat.id ? BLUE : '#F1F5F9',
                boxShadow: selectedWorkerFilter === stat.id ? '0 10px 25px rgba(37, 99, 235, 0.1)' : '0 4px 12px rgba(0,0,0,0.02)', 
                cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: selectedWorkerFilter === stat.id ? 'translateY(-4px)' : 'none',
                position: 'relative', overflow: 'hidden'
              }}
            >
              {selectedWorkerFilter === stat.id && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, background: BLUE }} />
              )}
              <div style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.1em' }}>{stat.label}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 32, fontWeight: 900, color: '#1E293B', letterSpacing: '-0.02em' }}>{stat.count}</div>
                <div style={{ 
                  background: selectedWorkerFilter === stat.id ? '#EFF6FF' : '#F8FAFD', 
                  padding: '10px', borderRadius: 14, color: selectedWorkerFilter === stat.id ? BLUE : stat.color,
                  transition: 'all 0.3s'
                }}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Workers Detail Table - Appears on Click */}
        {selectedWorkerFilter && (
          <div style={{ 
            background: '#fff', borderRadius: 24, border: '1px solid #E2E8F0', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)', overflow: 'hidden',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid #F1F5F9', background: '#F8FAFD' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.3fr 1.8fr 1.5fr 1fr', gap: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Worker Name</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Skills</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Current Assignment / Details</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Vehicle</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', textAlign: 'right' }}>Actions</div>
              </div>
            </div>
            <div style={{ maxHeight: 500, overflowY: 'auto' }}>
              {filteredWorkersForTable.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>No workers in this category</div>
              ) : (
                filteredWorkersForTable.map((worker, idx) => {
                  const activeJob = jobs.find(j => j.assignedWorkers.includes(worker.id));
                  const vehicle = activeJob?.assignedVehicleId ? vehicles.find(v => v.id === activeJob.assignedVehicleId) : null;
                  const isAvailable = worker.baseAvailable && !activeJob;
                  
                  return (
                    <div key={worker.id} style={{ 
                      padding: '12px 20px', display: 'grid', gridTemplateColumns: '1.2fr 1.3fr 1.8fr 1.5fr 1fr', gap: 16,
                      alignItems: 'center', borderBottom: idx === filteredWorkersForTable.length - 1 ? 'none' : '1px solid #F1F5F9',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F8FAFD'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ 
                          width: 36, height: 36, borderRadius: 12, background: worker.isSupervisor ? '#16A34A' : BLUE, 
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800 
                        }}>
                          {worker.name[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#1E293B', fontSize: 14 }}>{worker.name}</div>
                          {worker.isSupervisor && <div style={{ fontSize: 9, color: '#16A34A', fontWeight: 800 }}>SUPERVISOR</div>}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {worker.skills.map(s => (
                          <span key={s} style={{ 
                            background: '#F1F5F9', color: '#475569', padding: '4px 10px', 
                            borderRadius: 8, fontSize: 11, fontWeight: 700, border: '1px solid #E2E8F0' 
                          }}>
                            {s}
                          </span>
                        ))}
                      </div>

                      <div>
                        {activeJob ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 13, fontWeight: 800, color: BLUE }}>{activeJob.client}</span>
                              <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>• {activeJob.time}</span>
                            </div>
                            <div style={{ fontSize: 10, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                              <MapPin size={10} /> {activeJob.location}
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                             <div style={{ width: 8, height: 8, borderRadius: '50%', background: worker.baseAvailable ? '#16A34A' : '#DC2626' }} />
                             <span style={{ fontSize: 13, color: worker.baseAvailable ? '#16A34A' : '#DC2626', fontWeight: 700 }}>
                              {worker.baseAvailable ? 'Available' : 'Off Duty'}
                             </span>
                          </div>
                        )}
                      </div>

                      {/* Vehicle Column */}
                      <div>
                        {vehicle ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <div style={{ fontSize: 12, fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: 14 }}>🚚</span> {vehicle.name}
                            </div>
                            <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700, fontFamily: 'monospace', background: '#F1F5F9', padding: '2px 6px', borderRadius: 4, width: 'fit-content' }}>
                              {vehicle.licensePlate}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: '#CBD5E1', fontSize: 11, fontWeight: 600 }}>—</span>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        {isAvailable ? (
                          <button 
                            onClick={() => onAssignWorker(worker.id)}
                            style={{ 
                              background: BLUE, color: '#fff', border: 'none', 
                              padding: '8px 16px', borderRadius: 10, fontSize: 12, 
                              fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)'
                            }}
                          >
                            Assign Work
                          </button>
                        ) : activeJob ? (
                          <>
                            <button 
                              onClick={() => onWorkerClick(worker)}
                              style={{ 
                                background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0',
                                padding: '8px 12px', borderRadius: 10, fontSize: 12, 
                                fontWeight: 700, cursor: 'pointer'
                              }}
                            >
                              Details
                            </button>
                            <button 
                              onClick={() => onReschedule(activeJob)}
                              style={{ 
                                background: '#FEF2F2', color: '#DC2626', border: '1px solid #FEE2E2',
                                padding: '8px 12px', borderRadius: 10, fontSize: 12, 
                                fontWeight: 700, cursor: 'pointer'
                              }}
                            >
                              Reschedule
                            </button>
                          </>
                        ) : (
                          <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700 }}>No actions</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Orders Kanban View */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1E293B' }}>Orders Management</h2>
          
          <div style={{ display: 'flex', background: '#fff', borderRadius: 12, padding: '4px', border: '1.5px solid #E2E8F0' }}>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 8,
                background: viewMode === 'kanban' ? BLUE : 'transparent',
                color: viewMode === 'kanban' ? '#fff' : '#64748B',
                border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <LayoutGrid size={14} /> Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 8,
                background: viewMode === 'list' ? BLUE : 'transparent',
                color: viewMode === 'list' ? '#fff' : '#64748B',
                border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <List size={14} /> List
            </button>
            <button
              onClick={() => setViewMode('map')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 8,
                background: viewMode === 'map' ? BLUE : 'transparent',
                color: viewMode === 'map' ? '#fff' : '#64748B',
                border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <MapIcon size={14} /> Map
            </button>
          </div>
        </div>

        {viewMode === 'kanban' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {['upcoming', 'ongoing', 'completed'].map(status => {
              const statusJobs = jobs.filter(j => {
                if (status === 'upcoming') return j.status === 'pending' || j.status === 'scheduled';
                if (status === 'ongoing') return j.status === 'in-progress';
                return j.status === 'completed';
              }).sort((a, b) => {
                if (status === 'upcoming') {
                  const riskA = getJobRisk(a).isRisk ? 1 : 0;
                  const riskB = getJobRisk(b).isRisk ? 1 : 0;
                  return riskB - riskA;
                }
                return 0;
              });
              const conf = statusConfig[status];
              return (
                <div key={status} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 14px', borderRadius: 12, background: '#fff', border: '1.5px solid #F1F5F9',
                    borderBottom: `3px solid ${conf.bar}`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14 }}>{conf.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{conf.label}</span>
                    </div>
                    <div style={{ background: '#F1F5F9', color: '#64748B', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                      {statusJobs.length}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 400 }}>
                    {statusJobs.length === 0 ? (
                      <div style={{ padding: '24px', border: '2px dashed #E2E8F0', borderRadius: 16, textAlign: 'center', color: '#94A3B8', fontSize: 12 }}>
                        No orders
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
                              background: '#fff', borderRadius: 12, padding: '10px',
                              border: '1.5px solid #F1F5F9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                              cursor: 'pointer', transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = BLUE)}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = '#F1F5F9')}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                              <div style={{ fontSize: 14, fontWeight: 800, color: '#1E293B' }}>{job.time}</div>
                              <span style={{ background: ty.bg, color: ty.color, borderRadius: 6, padding: '3px 8px', fontSize: 9, fontWeight: 700 }}>
                                {jobTypeLabels[job.type]}
                              </span>
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{job.client}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748B', fontSize: 11, marginBottom: 12 }}>
                              <MapPin size={10} /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.location}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ 
                                  display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 8,
                                  background: (status === 'upcoming' && getJobRisk(job).isRisk) ? '#FEF2F2' : '#F8FAFC', 
                                  color: (status === 'upcoming' && getJobRisk(job).isRisk) ? '#DC2626' : '#64748B',
                                  border: `1px solid ${(status === 'upcoming' && getJobRisk(job).isRisk) ? '#FECACA' : '#E2E8F0'}`
                                }}>
                                  <Users size={10} /> <span style={{ fontSize: 10, fontWeight: 800 }}>{job.assignedWorkers.length}/{job.workersNeeded}</span>
                                </div>
                                {status === 'upcoming' && getJobRisk(job).isRisk && (
                                  <div style={{ fontSize: 9, fontWeight: 900, color: '#DC2626', textTransform: 'uppercase', background: '#FEF2F2', padding: '2px 6px', borderRadius: 4, border: '1px solid #FECACA' }}>
                                    {getJobRisk(job).reason}
                                  </div>
                                )}
                              </div>
                              <div style={{ display: 'flex', gap: 2 }}>
                                {job.assignedWorkers.slice(0, 3).map(id => {
                                  const w = workers.find(worker => worker.id === id);
                                  return (
                                    <div key={id} title={w?.name} style={{ 
                                      width: 20, height: 20, borderRadius: 6, background: w?.isSupervisor ? '#16A34A' : BLUE, color: '#fff',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700,
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
        ) : viewMode === 'list' ? (
          <div style={{ background: '#fff', borderRadius: 24, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 160px 200px 160px 40px', padding: '16px 24px', background: '#F8FAFD', borderBottom: '1px solid #F1F5F9' }}>
              {['Time', 'Client', 'Type', 'Staff', 'Status', ''].map((h, i) => (
                <div key={i} style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>
            {jobs.map((job, idx) => {
              const st = statusConfig[job.status];
              const ty = JOB_TYPE_COLORS[job.type] || JOB_TYPE_COLORS.general;
              return (
                <div
                  key={job.id}
                  onClick={() => onJobClick(job)}
                  style={{
                    display: 'grid', gridTemplateColumns: '100px 1fr 160px 200px 160px 40px',
                    padding: '20px 24px', alignItems: 'center', cursor: 'pointer',
                    borderBottom: idx === jobs.length - 1 ? 'none' : '1px solid #F1F5F9'
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#1E293B' }}>{job.time}</div>
                  <div style={{ fontWeight: 700 }}>{job.client}</div>
                  <div><span style={{ background: ty.bg, color: ty.color, borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600 }}>{jobTypeLabels[job.type]}</span></div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748B', fontSize: 12 }}>
                      <Users size={14} /> {job.assignedWorkers.length}/{job.workersNeeded}
                    </div>
                  </div>
                  <div><span style={{ background: st.bg, color: st.color, padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>{st.label}</span></div>
                  <ChevronRight size={18} color="#CBD5E1" />
                </div>
              );
            })}
          </div>
        ) : (
          <MapPlanningView jobs={jobs} workers={workers} onJobClick={onJobClick} />
        )}
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
