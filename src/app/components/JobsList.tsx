import { ChevronRight, AlertTriangle, Calendar, Users } from 'lucide-react';
import type { Job, Worker, JobStatus, JobType } from '../types';
import { useLanguage } from '../LanguageContext';
import { JOB_TYPE_COLORS, STATUS_OPTIONS } from '../constants';

interface Props {
  jobs: Job[];
  workers: Worker[];
  onJobClick: (job: Job) => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
}

export function JobsList({ jobs, workers, onJobClick, onStatusChange }: Props) {
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
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0F1A2A', margin: 0 }}>{t('allJobs')}</h2>
        <p style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>{jobs.length} {t('totalJobs')}</p>
      </div>

      <div style={{
        background: '#fff',
        borderRadius: 24,
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        overflow: 'hidden',
        border: '1px solid #F1F5F9',
      }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '120px 90px 1fr 160px 180px 160px 40px',
          padding: '16px 24px',
          background: '#F8FAFD',
          borderBottom: '1px solid #F1F5F9',
        }}>
          {[t('date'), t('time'), t('clientLocation'), t('type'), t('workers'), t('status'), ''].map((h, i) => (
            <div key={i} style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
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
                gridTemplateColumns: '120px 90px 1fr 160px 180px 160px 40px',
                padding: '20px 24px',
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
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>{job.client}</div>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '4px 10px', borderRadius: 8,
                  background: understaffed ? '#FEF2F2' : '#F1F5F9',
                  color: understaffed ? '#DC2626' : '#475569'
                }}>
                  {understaffed ? <AlertTriangle size={13} /> : <Users size={13} />}
                  <span style={{ fontSize: 13, fontWeight: 700 }}>
                    {job.assignedWorkers.length}/{job.workersNeeded}
                  </span>
                </div>
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
