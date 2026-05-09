import { useState, useMemo } from 'react';
import { X, Calendar, User, ArrowLeft, Info, AlertTriangle, CheckCircle2, Plane, Briefcase } from 'lucide-react';
import { format } from 'date-fns';
import type { Worker, Job } from '../types';
import { BLUE, ORANGE } from '../constants';

interface Props {
  workers: Worker[];
  jobs: Job[];
  onSave: (workerId: string, date: string) => void;
  onClose: () => void;
}

export function AddLeaveModal({ workers, jobs, onSave, onClose }: Props) {
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [leaveDate, setLeaveDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const conflicts = useMemo(() => {
    if (!selectedWorkerId || !leaveDate) return [];
    return jobs.filter(j => 
      j.assignedWorkers.includes(selectedWorkerId) && j.date === leaveDate
    );
  }, [selectedWorkerId, leaveDate, jobs]);

  const selectedWorker = useMemo(() => 
    workers.find(w => w.id === selectedWorkerId),
    [selectedWorkerId, workers]
  );

  const handleSave = () => {
    if (!selectedWorkerId || !leaveDate) return;
    onSave(selectedWorkerId, leaveDate);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 14,
    border: '1.5px solid #E2E8F0',
    outline: 'none',
    fontSize: 15,
    fontWeight: 600,
    background: '#fff',
    transition: 'all 0.2s'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 800,
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: '0.05em'
  };

  return (
    <div style={{ width: '100%', maxWidth: 1400, margin: '0 auto', padding: '16px 24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button
            onClick={onClose}
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
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.03em' }}>
              Register Personnel Leave
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: 14, fontWeight: 600 }}>
              Schedule worker absence and vacation time
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px', borderRadius: 14,
              background: '#fff', border: '1.5px solid #E2E8F0',
              fontSize: 15, fontWeight: 700, color: '#64748B', cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedWorkerId}
            style={{
              padding: '12px 32px', borderRadius: 14,
              background: conflicts.length > 0 ? ORANGE : BLUE, 
              color: '#fff', border: 'none',
              fontSize: 15, fontWeight: 800, cursor: 'pointer',
              boxShadow: `0 10px 20px ${conflicts.length > 0 ? ORANGE : BLUE}33`,
              opacity: !selectedWorkerId ? 0.6 : 1
            }}
          >
            {conflicts.length > 0 ? 'Register & Handle Conflicts' : 'Register Leave'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 32 }}>
        {/* Main Form */}
        <div style={{ 
          background: '#fff', borderRadius: 32, padding: 40, border: '1px solid #F1F5F9',
          boxShadow: '0 20px 50px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#EFF6FF', color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1E293B' }}>Personnel Selection</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <label style={labelStyle}>Select Worker *</label>
                  <select 
                    value={selectedWorkerId}
                    onChange={e => setSelectedWorkerId(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="">Choose worker...</option>
                    {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Absence Date *</label>
                  <input 
                    type="date"
                    value={leaveDate}
                    onChange={e => setLeaveDate(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            </section>

            <section style={{ paddingTop: 32, borderTop: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#FEF2F2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1E293B' }}>Conflict Analysis</h3>
              </div>

              {conflicts.length > 0 ? (
                <div style={{ background: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: 24, padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#C2410C', fontWeight: 900, fontSize: 14, marginBottom: 16 }}>
                    <AlertTriangle size={20} /> ACTION REQUIRED: {conflicts.length} SCHEDULE CONFLICTS
                  </div>
                  <p style={{ margin: '0 0 20px 0', fontSize: 14, color: '#9A3412', fontWeight: 600, lineHeight: 1.6 }}>
                    This worker is already assigned to the following jobs on this day. You must reassign these jobs if you register this leave.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {conflicts.map(j => (
                      <div key={j.id} style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', padding: '16px', borderRadius: 16, border: '1px solid #FFEDD5', boxShadow: '0 4px 12px rgba(194, 65, 12, 0.05)' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Briefcase size={18} color={ORANGE} />
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: '#1E293B' }}>{j.client}</div>
                          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>{j.time} · {j.location}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : selectedWorkerId ? (
                <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: 24, padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <CheckCircle2 size={24} color="#16A34A" />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#15803D' }}>Zero Conflicts Detected</div>
                    <div style={{ fontSize: 13, color: '#166534', fontWeight: 600, marginTop: 2 }}>Worker is fully available for this date.</div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', border: '2px dashed #F1F5F9', borderRadius: 24 }}>
                  <User size={32} style={{ color: '#CBD5E1', marginBottom: 12, opacity: 0.5 }} />
                  <div style={{ fontSize: 14, color: '#94A3B8', fontWeight: 600 }}>Select a worker and date to analyze conflicts</div>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Live Summary Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ 
            background: BLUE, borderRadius: 32, padding: 32, color: '#fff',
            boxShadow: '0 20px 40px rgba(37, 99, 235, 0.15)'
          }}>
            <h4 style={{ margin: 0, fontSize: 18, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Info size={20} /> Leave Summary
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900 }}>
                  {selectedWorker?.name[0] || '?'}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{selectedWorker?.name || 'Unselected'}</div>
                  <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 700 }}>ID: {selectedWorker?.id || '—'}</div>
                </div>
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.1)' }} />
              <SummaryRow label="Date" value={leaveDate} />
              <SummaryRow label="Conflicts" value={conflicts.length.toString()} highlight={conflicts.length > 0} />
              <SummaryRow label="Type" value="VACATION" />
            </div>

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Plane size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>Absence Registered</div>
                  <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 600 }}>Auto-updates planner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 13, opacity: 0.7, fontWeight: 600 }}>{label}</span>
      <span style={{ 
        fontSize: 14, fontWeight: 800, 
        color: highlight ? '#fff' : '#fff',
        background: highlight ? '#EF4444' : 'transparent',
        padding: highlight ? '4px 8px' : '0',
        borderRadius: highlight ? '6px' : '0'
      }}>{value}</span>
    </div>
  );
}
