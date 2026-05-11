import React from 'react';
import { ArrowLeft, Edit2, Users, MessageCircle, MapPin, Clock, FileText, AlertTriangle, ShieldCheck, Calendar, Truck, CheckCircle2, Globe, CloudSun } from 'lucide-react';
import type { Job, Worker, JobStatus, JobType, Vehicle, UserRole } from '../types';
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
  vehicles: Vehicle[];
  onBack: () => void;
  onEdit: () => void;
  onAssignWorkers: () => void;
  onAssignVehicle: (jobId: string, vehicleId: string) => void;
  onWhatsApp: () => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
  userRole: UserRole;
}

export function JobDetail({ job, workers, vehicles, onBack, onEdit, onAssignWorkers, onAssignVehicle, onWhatsApp, onStatusChange, userRole }: Props) {
  const { t } = useLanguage();

  const typeStyle = JOB_TYPE_COLORS[job.type] || JOB_TYPE_COLORS.general;
  const assignedWorkers = workers.filter(w => job.assignedWorkers.includes(w.id));
  const isUnderstaffed = job.assignedWorkers.length < job.workersNeeded;
  const assignedVehicle = vehicles.find(v => v.id === job.assignedVehicleId);

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
    unassigned:   { label: 'Unassigned',           bg: '#FEF2F2', color: '#EF4444', bar: '#EF4444' },
    incomplete:   { label: 'Incomplete',           bg: '#FFF1F2', color: '#E11D48', bar: '#E11D48' },
  };

  const statusConf = statusConfig[job.status];

  const hasGermanSpeaker = assignedWorkers.some(w => w.languages.includes('DE'));
  const missingSkills = job.requiredSkills.filter(skill => !assignedWorkers.some(w => w.skills.includes(skill)));

  return (
    <div style={{ width: '100%', maxWidth: 1400, margin: '0 auto', padding: '16px 24px' }}>
      {/* Top Header */}
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        {/* Left Column: Details & Workers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Order Details Grid */}
          <div style={{ 
            background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #F1F5F9',
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
                <DetailItem icon={<Globe size={18} />} label="Language" value={job.needsGermanSpeaker ? 'German Required' : 'No Preference'} />
              </div>
              <div>
                <DetailItem icon={<Clock size={18} />} label={t('time')} value={job.time + ' Uhr'} />
                <DetailItem icon={<Users size={18} />} label={t('staff')} value={`${job.assignedWorkers.length} / ${job.workersNeeded} ${t('assignedWorkers')}`} />
                <DetailItem 
                  icon={<Truck size={18} />} 
                  label="Vehicle" 
                  value={assignedVehicle ? assignedVehicle.name : 'No vehicle assigned'} 
                />
              </div>
            </div>

            {job.isWeatherDependent && (
              <div style={{ 
                marginTop: 24, padding: '12px 16px', borderRadius: 12, background: '#EFF6FF', 
                border: '1px solid #DBEAFE', display: 'inline-flex', alignItems: 'center', gap: 10
              }}>
                <CloudSun size={18} color={BLUE} />
                <span style={{ fontSize: 13, fontWeight: 700, color: BLUE }}>Weather Dependent - Subject to cancellation</span>
              </div>
            )}

            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {job.requiredSkills.map(skill => (
                <span key={skill} style={{ 
                  fontSize: 10, fontWeight: 800, textTransform: 'uppercase', 
                  padding: '4px 10px', borderRadius: 8, 
                  background: assignedWorkers.some(w => w.skills.includes(skill)) ? '#F0FDF4' : '#FFF7ED',
                  color: assignedWorkers.some(w => w.skills.includes(skill)) ? '#16A34A' : '#C2410C',
                  border: '1px solid currentColor'
                }}>
                  {skill} {assignedWorkers.some(w => w.skills.includes(skill)) ? '✓' : '!'}
                </span>
              ))}
              {job.needsGermanSpeaker && (
                <span style={{ 
                  fontSize: 10, fontWeight: 800, textTransform: 'uppercase', 
                  padding: '4px 10px', borderRadius: 8, 
                  background: hasGermanSpeaker ? '#F0FDF4' : '#FEF2F2',
                  color: hasGermanSpeaker ? '#16A34A' : '#DC2626',
                  border: '1px solid currentColor'
                }}>
                  German {hasGermanSpeaker ? '✓' : '!'}
                </span>
              )}
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
            background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #F1F5F9',
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
              {userRole === 'admin' && (
                <button
                  onClick={onAssignWorkers}
                  style={{
                    background: BLUE, color: '#fff', border: 'none',
                    borderRadius: 12, padding: '10px 20px', fontSize: 13, fontWeight: 800,
                    cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)'
                  }}
                >
                  + {t('assignWorkers')}
                </button>
              )}
            </div>

            {(isUnderstaffed || missingSkills.length > 0 || (job.needsGermanSpeaker && !hasGermanSpeaker)) && (
               <div style={{ 
                 background: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: 16, padding: 16, 
                 display: 'flex', gap: 12, marginBottom: 24
                }}>
                 <AlertTriangle color="#F97316" size={20} />
                 <div>
                   <div style={{ fontSize: 14, fontWeight: 800, color: '#9A3412' }}>Planning Alert</div>
                   <ul style={{ margin: '4px 0 0 0', paddingLeft: 20, fontSize: 13, color: '#9A3412', fontWeight: 600 }}>
                     {isUnderstaffed && <li>Need {job.workersNeeded - assignedWorkers.length} more workers.</li>}
                     {missingSkills.map(s => <li key={s}>Missing worker with skill: {s}</li>)}
                     {job.needsGermanSpeaker && !hasGermanSpeaker && <li>Team needs at least one German speaker.</li>}
                     {!assignedWorkers.some(w => w.isSupervisor) && job.workersNeeded > 1 && <li>No supervisor assigned to this team.</li>}
                   </ul>
                 </div>
               </div>
            )}

            {assignedWorkers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', background: '#F8FAFD', borderRadius: 20, border: '1px dashed #CBD5E1' }}>
                <Users size={32} color="#94A3B8" style={{ marginBottom: 12 }} />
                <div style={{ fontWeight: 800, color: '#64748B' }}>No staff assigned yet</div>
                <p style={{ color: '#64748B', fontSize: 13, marginTop: 4 }}>Click "Assign Workers" to see intelligent suggestions.</p>
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
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900,
                      position: 'relative'
                    }}>
                      {worker.name[0]}
                      {worker.isSupervisor && (
                        <div title="Supervisor" style={{ position: 'absolute', bottom: -4, right: -4, background: '#16A34A', borderRadius: '50%', border: '2px solid #fff', padding: 2 }}>
                          <ShieldCheck size={10} color="#fff" />
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#1E293B' }}>{worker.name}</div>
                        {worker.pastCustomers.includes(job.client) && (
                           <CheckCircle2 size={12} color="#16A34A" />
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <ReliabilityDots value={worker.reliability} />
                        <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{worker.languages.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Status & Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Status Card */}
          <div style={{ 
            background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #F1F5F9',
            boxShadow: '0 20px 50px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>{t('status')}</div>
            <select
              value={job.status}
              onChange={e => onStatusChange(job.id, e.target.value as JobStatus)}
              style={{
                width: '100%', padding: '16px', borderRadius: 16, border: 'none',
                background: statusConf.bg, color: statusConf.color,
                fontSize: 16, fontWeight: 700, cursor: 'pointer',
                appearance: 'none', textAlign: 'center', boxShadow: 'inset 0 0 0 1.5px rgba(0,0,0,0.02)',
                opacity: 1
              }}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{statusConfig[s].label}</option>
              ))}
            </select>
          </div>

          {/* Vehicle Assignment */}
          <div style={{ 
            background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #F1F5F9',
            boxShadow: '0 20px 50px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Vehicle Assignment</div>
            <select
              value={job.assignedVehicleId ?? ''}
              onChange={e => onAssignVehicle(job.id, e.target.value)}
              style={{
                width: '100%', padding: '14px', borderRadius: 14, border: '1.5px solid #E2E8F0',
                background: '#fff', color: '#1E293B',
                fontSize: 14, fontWeight: 700, cursor: 'pointer'
              }}
            >
              <option value="">No vehicle</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id} disabled={v.status === 'maintenance' || (v.status === 'assigned' && v.id !== job.assignedVehicleId)}>
                  {v.name} ({v.licensePlate}) {v.status === 'assigned' && v.id !== job.assignedVehicleId ? ' - Occupied' : ''}
                </option>
              ))}
            </select>
            {assignedVehicle && (
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, color: BLUE }}>
                <Truck size={18} />
                <span style={{ fontSize: 13, fontWeight: 700 }}>{assignedVehicle.type} ready</span>
              </div>
            )}
          </div>

          {/* Verification / Alert Card */}
          {!hasGermanSpeaker && job.needsGermanSpeaker && (
            <div style={{ 
              background: '#FEF2F2', borderRadius: 24, padding: 32, border: '1px solid #FEE2E2',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <AlertTriangle size={20} color="#DC2626" />
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#991B1B' }}>Warning</h4>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#991B1B', lineHeight: 1.5, fontWeight: 600 }}>This job requires a German speaker, but none are assigned.</p>
            </div>
          )}
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
