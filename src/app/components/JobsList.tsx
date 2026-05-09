import { ChevronRight, AlertTriangle, Calendar, Users, Plus, Truck } from 'lucide-react';
import type { Job, Worker, JobStatus, JobType, Vehicle } from '../types';
import { useLanguage } from '../LanguageContext';
import { JOB_TYPE_COLORS, STATUS_OPTIONS } from '../constants';

interface Props {
  jobs: Job[];
  workers: Worker[];
  vehicles: Vehicle[];
  onJobClick: (job: Job) => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
  onCreateJob: () => void;
}

export function JobsList({ jobs, workers, vehicles, onJobClick, onStatusChange, onCreateJob }: Props) {
  const { t } = useLanguage();

  const jobTypeLabels: Record<JobType, string> = {
    window: t('windowCleaning'),
    special: t('specialCleaning'),
    snow: t('snowRemoval'),
    grass: 'Grass Cutting',
    machine: 'Machine Cleaning',
    general: t('generalCleaning'),
  };

  const statusConfig: Record<JobStatus, { label: string; bg: string; color: string; bar: string }> = {
    pending:      { label: t('statusPending'), bg: '#FEFCE8', color: '#854D0E', bar: '#FDE047' },
    scheduled:    { label: t('statusScheduled'),    bg: '#EFF6FF', color: '#1E40AF', bar: '#3B82F6' },
    'in-progress':{ label: t('statusInProgress'),  bg: '#FFF7ED', color: '#9A3412', bar: '#F97316' },
    completed:    { label: t('statusCompleted'),   bg: '#F0FDF4', color: '#166534', bar: '#22C55E' },
    unassigned:   { label: 'Unassigned', bg: '#FEF2F2', color: '#EF4444', bar: '#EF4444' },
    incomplete:   { label: 'Incomplete', bg: '#FFF1F2', color: '#E11D48', bar: '#E11D48' },
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    const dateComp = a.date.localeCompare(b.date);
    if (dateComp !== 0) return dateComp;
    return a.time.localeCompare(b.time);
  });

  const getFirstName = (id: string) => {
    const w = workers.find(w => w.id === id);
    return w ? w.name.split(' ')[0] : '?';
  };

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0F1A2A', margin: 0 }}>{t('allJobs')}</h2>
          <p style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>{jobs.length} {t('totalJobs')}</p>
        </div>
        <button 
          onClick={onCreateJob}
          style={{
            background: '#2563EB', color: '#fff', border: 'none', borderRadius: 14,
            padding: '12px 24px', fontSize: 13, fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all 0.2s'
          }}
        >
          <Plus size={18} strokeWidth={2.5} /> Create Order
        </button>
      </div>

      <div style={{
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
        overflow: 'hidden',
        border: '1px solid #F1F5F9',
        maxWidth: 1600,
        margin: '0 auto'
      }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 2.5fr 1.2fr 1fr 1.5fr 1.5fr 0.5fr',
          padding: '18px 24px',
          background: '#F8FAFD',
          borderBottom: '1px solid #F1F5F9',
        }}>
          {[t('date'), t('time'), t('clientLocation'), t('type'), t('workers'), 'Vehicle', t('status'), ''].map((h, i) => (
            <div key={i} style={{ 
              fontSize: 10, 
              fontWeight: 900, 
              color: '#94A3B8', 
              letterSpacing: '0.1em', 
              textTransform: 'uppercase' 
            }}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {sortedJobs.map((job, idx) => {
          const st = statusConfig[job.status];
          const ty = JOB_TYPE_COLORS[job.type];
          const understaffed = job.assignedWorkers.length < job.workersNeeded;
          const isLast = idx === sortedJobs.length - 1;

          return (
            <div
              key={job.id}
              onClick={() => onJobClick(job)}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 2.5fr 1.2fr 1fr 1.5fr 1.5fr 0.5fr',
                padding: '24px',
                alignItems: 'center',
                borderBottom: isLast ? 'none' : '1px solid #F8FAFD',
                cursor: 'pointer',
                borderLeft: `4px solid ${st.bar}`,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
              onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
            >
              {/* Date */}
              <div style={{ fontSize: 14, fontWeight: 600, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} className="text-blue-500" />
                {job.date}
              </div>

              {/* Time */}
              <div style={{ fontSize: 18, fontWeight: 700, color: '#1E293B', fontVariantNumeric: 'tabular-nums' }}>
                {job.time}
              </div>

              {/* Client + location */}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.client}</div>
                <div style={{ fontSize: 13, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📍 {job.location}</div>
              </div>

              {/* Type */}
              <div>
                <span style={{
                  background: ty.bg, color: ty.color,
                  borderRadius: 8, padding: '5px 12px',
                  fontSize: 12, fontWeight: 600,
                  display: 'inline-block',
                }}>
                  {jobTypeLabels[job.type]}
                </span>
              </div>

              {/* Workers */}
              <div>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 10,
                  background: understaffed ? '#FEF2F2' : '#F1F5F9',
                  color: understaffed ? '#DC2626' : '#475569',
                  width: 'fit-content',
                  fontSize: 13, fontWeight: 700
                }}>
                  {understaffed ? <AlertTriangle size={14} /> : <Users size={14} />}
                  <span>{job.assignedWorkers.length}/{job.workersNeeded}</span>
                </div>
              </div>

              {/* Vehicle */}
              <div>
                {job.assignedVehicleId ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#475569' }}>
                    <Truck size={14} style={{ color: '#3B82F6' }} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                      {vehicles.find(v => v.id === job.assignedVehicleId)?.name || 'Unknown'}
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: 12, color: '#94A3B8', fontStyle: 'italic' }}>No vehicle</span>
                )}
              </div>

              {/* Status */}
              <div onClick={e => e.stopPropagation()}>
                <select
                  value={job.status}
                  onChange={e => onStatusChange(job.id, e.target.value as JobStatus)}
                  style={{
                    background: st.bg, color: st.color,
                    border: 'none', borderRadius: 8,
                    padding: '6px 12px',
                    fontSize: 12, fontWeight: 700,
                    cursor: 'pointer',
                    width: '130px'
                  }}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{statusConfig[s].label}</option>
                  ))}
                </select>
              </div>

              {/* Arrow */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ChevronRight size={18} style={{ color: '#CBD5E1' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
