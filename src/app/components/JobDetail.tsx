import React from 'react';
import { ArrowLeft, Edit2, Users, MessageCircle, MapPin, Clock, FileText, AlertTriangle, ShieldCheck, Calendar } from 'lucide-react';
import type { Job, Worker, JobStatus, JobType } from '../types';
import { JOB_TYPE_COLORS, STATUS_OPTIONS, BLUE, ORANGE } from '../constants';
import { useLanguage } from '../LanguageContext';

function ReliabilityDots({ value }: { value: number }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          style={{
            width: 7, height: 7, borderRadius: '50%',
            background: i <= value ? (value >= 4 ? '#16A34A' : '#F59E0B') : '#E5E7EB',
          }}
        />
      ))}
    </div>
  );
}

interface Props {
  job: Job;
  workers: Worker[];
  onBack: () => void;
  onEdit: () => void;
  onAssignWorkers: () => void;
  onWhatsApp: () => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
}

export function JobDetail({ job, workers, onBack, onEdit, onAssignWorkers, onWhatsApp, onStatusChange }: Props) {
  const { t } = useLanguage();

  const typeStyle = JOB_TYPE_COLORS[job.type];
  const assignedWorkers = workers.filter(w => job.assignedWorkers.includes(w.id));
  const isUnderstaffed = job.assignedWorkers.length < job.workersNeeded;

  const jobTypeLabels: Record<JobType, string> = {
    window: t('windowCleaning'),
    special: t('specialCleaning'),
    snow: t('snowRemoval'),
    general: t('generalCleaning'),
  };

  const statusConfig: Record<JobStatus, { label: string; bg: string; color: string; bar: string }> = {
    pending:      { label: t('statusPending'), bg: '#FEFCE8', color: '#854D0E', bar: '#FDE047' },
    scheduled:    { label: t('statusScheduled'),    bg: '#EFF6FF', color: '#1E40AF', bar: '#3B82F6' },
    'in-progress':{ label: t('statusInProgress'),  bg: '#FFF7ED', color: '#9A3412', bar: '#F97316' },
    completed:    { label: t('statusCompleted'),   bg: '#F0FDF4', color: '#166534', bar: '#22C55E' },
  };

  const statusConf = statusConfig[job.status];

  return (
    <div style={{ width: '100%', maxWidth: 1400, margin: '0 auto', padding: '24px 40px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
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
            onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFD')}
            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.03em' }}>{job.client}</h1>
              <span style={{ 
                background: typeStyle.bg, color: typeStyle.color, 
                padding: '4px 12px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                border: `1px solid ${typeStyle.color}15`
              }}>
                {jobTypeLabels[job.type]}
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: 14, fontWeight: 600 }}>{t('jobDetails')} ID: #{job.id.slice(0, 8)}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onEdit}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#fff', border: '1.5px solid #E2E8F0',
              borderRadius: 14, padding: '12px 24px',
              cursor: 'pointer', fontSize: 15, fontWeight: 700, color: '#1E293B',
              transition: 'all 0.2s'
            }}
          >
            <Edit2 size={18} /> {t('edit')}
          </button>
          <button
            onClick={onWhatsApp}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#22C55E', color: '#fff', border: 'none',
              borderRadius: 14, padding: '12px 24px',
              cursor: 'pointer', fontSize: 15, fontWeight: 700,
              boxShadow: '0 10px 20px rgba(34, 197, 94, 0.2)'
            }}
          >
            <MessageCircle size={18} strokeWidth={3} /> {t('sendWhatsApp')}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 32, alignItems: 'start' }}>
        {/* Left Column: Details & Workers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          {/* Order Details Grid */}
          <div style={{ 
            background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #F1F5F9',
            boxShadow: '0 20px 50px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EFF6FF', color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} />
              </div>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1E293B' }}>{t('jobDetails')}</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
              <div>
                <DetailItem icon={<MapPin size={18} />} label={t('location')} value={job.location} />
                <DetailItem icon={<Calendar size={18} />} label={t('date')} value={job.date} />
              </div>
              <div>
                <DetailItem icon={<Clock size={18} />} label={t('time')} value={job.time + ' Uhr'} />
                <DetailItem icon={<Users size={18} />} label={t('staff')} value={`${job.assignedWorkers.length} / ${job.workersNeeded} ${t('assignedWorkers')}`} />
              </div>
            </div>

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{t('notes')}</div>
              <div style={{ 
                background: '#F8FAFD', borderRadius: 16, padding: 20, 
                fontSize: 15, color: '#475569', lineHeight: 1.6, border: '1px solid #F1F5F9'
              }}>
                {job.notes || 'No additional notes provided for this order.'}
              </div>
            </div>
          </div>

          {/* Assigned Employees */}
          <div style={{ 
            background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #F1F5F9',
            boxShadow: '0 20px 50px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1E293B' }}>{t('assignedWorkers')}</h3>
                  <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontWeight: 600 }}>{assignedWorkers.length} {t('people')} {t('statusScheduled')}</p>
                </div>
              </div>
              <button
                onClick={onAssignWorkers}
                style={{
                  background: '#F1F5F9', color: '#475569', border: 'none',
                  borderRadius: 12, padding: '10px 20px', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                + {t('assignWorkers')}
              </button>
            </div>

            {assignedWorkers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', background: '#FEFCE8', borderRadius: 20, border: '1px dashed #FDE047' }}>
                <AlertTriangle size={32} color="#F59E0B" style={{ marginBottom: 12 }} />
                <div style={{ fontWeight: 800, color: '#854D0E' }}>No staff assigned yet</div>
                <p style={{ color: '#854D0E', fontSize: 13, marginTop: 4 }}>This order is currently understaffed and requires manual assignment.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                {assignedWorkers.map(worker => (
                  <div key={worker.id} style={{ 
                    padding: 20, borderRadius: 20, border: '1px solid #F1F5F9', background: '#F9FAFB',
                    display: 'flex', alignItems: 'center', gap: 16
                  }}>
                    <div style={{ 
                      width: 48, height: 48, borderRadius: 14, background: BLUE, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900
                    }}>
                      {worker.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#1E293B' }}>{worker.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <ReliabilityDots value={worker.reliability} />
                        <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{worker.languages[0]}</span>
                      </div>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A' }} title="Active" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Status & Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Status Card */}
          <div style={{ 
            background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #F1F5F9',
            boxShadow: '0 20px 50px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>{t('status')}</div>
            <select
              value={job.status}
              onChange={e => onStatusChange(job.id, e.target.value as JobStatus)}
              style={{
                width: '100%', padding: '16px', borderRadius: 16, border: 'none',
                background: statusConf.bg, color: statusConf.color,
                fontSize: 16, fontWeight: 700, cursor: 'pointer', appearance: 'none',
                textAlign: 'center', boxShadow: 'inset 0 0 0 1.5px rgba(0,0,0,0.02)'
              }}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{statusConfig[s].label}</option>
              ))}
            </select>
            
            <div style={{ marginTop: 32 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Timeline</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#1E293B' }}>{job.time}</div>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginTop: 4 }}>{t('time')}</div>
                </div>
                <div style={{ width: 1, height: 40, background: '#F1F5F9' }} />
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#1E293B' }}>{t('today')}</div>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginTop: 4 }}>{t('statusScheduled')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Logistics Quick Actions */}
          <div style={{ 
            background: '#F8FAFD', borderRadius: 24, padding: 32, border: '1px solid #E2E8F0',
          }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <ShieldCheck size={20} color={ORANGE} />
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#1E293B' }}>Verification</h4>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>This order is pending final supervisor verification for tomorrow's deployment.</p>
            <button style={{
              width: '100%', marginTop: 20, padding: '14px', borderRadius: 14,
              background: '#fff', border: '1.5px solid #E2E8F0', color: '#1E293B',
              fontSize: 14, fontWeight: 800, cursor: 'pointer'
            }}>
              Mark as Verified
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
      <div style={{ color: BLUE, marginTop: 2 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', lineHeight: 1.4 }}>{value}</div>
      </div>
    </div>
  );
}
