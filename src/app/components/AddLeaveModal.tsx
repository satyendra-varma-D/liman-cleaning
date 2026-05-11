import { useState, useMemo } from 'react';
import { 
  X, Calendar, User, ArrowLeft, Info, AlertTriangle, 
  CheckCircle2, Plane, Briefcase, ChevronRight, Search, 
  UserPlus, UserMinus, Calendar as CalendarIcon, Clock, MapPin
} from 'lucide-react';
import { format, isWithinInterval, parseISO, eachDayOfInterval, isSameDay } from 'date-fns';
import type { Worker, Job } from '../types';
import { BLUE, ORANGE } from '../constants';

interface Props {
  workers: Worker[];
  jobs: Job[];
  onSave: (workerId: string, startDate: string, endDate: string, reason: string) => void;
  onReassignJob?: (jobId: string, oldWorkerId: string, newWorkerId: string) => void;
  onUnassignJob?: (jobId: string, workerId: string) => void;
  onClose: () => void;
  defaultWorkerId?: string | null;
}

export function AddLeaveModal({ 
  workers, jobs, onSave, onReassignJob, onUnassignJob, onClose, defaultWorkerId 
}: Props) {
  const [selectedWorkerId, setSelectedWorkerId] = useState(defaultWorkerId || '');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reason, setReason] = useState('');
  const [bulkReassignId, setBulkReassignId] = useState('');

  // Find conflicting jobs within the selected range
  const conflicts = useMemo(() => {
    if (!selectedWorkerId || !startDate || !endDate) return [];
    
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    return jobs.filter(j => {
      const jobDate = parseISO(j.date || '');
      const isAssigned = (j.assignedWorkers || []).includes(selectedWorkerId);
      const isInRange = isSameDay(jobDate, start) || isSameDay(jobDate, end) || 
                        (jobDate >= start && jobDate <= end);
      return isAssigned && isInRange;
    });
  }, [selectedWorkerId, startDate, endDate, jobs]);

  const selectedWorker = useMemo(() => 
    workers.find(w => w.id === selectedWorkerId),
    [selectedWorkerId, workers]
  );

  const availableReplacementWorkers = useMemo(() => {
    return workers.filter(w => w.id !== selectedWorkerId && w.available);
  }, [workers, selectedWorkerId]);

  const isDateError = useMemo(() => {
    if (!startDate || !endDate) return false;
    return parseISO(endDate) < parseISO(startDate);
  }, [startDate, endDate]);

  const canSave = selectedWorkerId && startDate && endDate && reason && conflicts.length === 0 && !isDateError;

  const handleSave = () => {
    if (!canSave) return;
    onSave(selectedWorkerId, startDate, endDate, reason);
  };

  const handleBulkReassign = () => {
    if (!bulkReassignId) return;
    conflicts.forEach(job => {
      onReassignJob?.(job.id, selectedWorkerId, bulkReassignId);
    });
    setBulkReassignId('');
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
    fontSize: 12,
    fontWeight: 700,
    color: '#1E293B',
    marginBottom: 8,
  };

  return (
    <div style={{ width: '100%', maxWidth: 1000, margin: '0 auto', padding: '32px' }}>
      {/* Modal Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#0F172A' }}>Add leave</h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: 15, fontWeight: 500 }}>
            Add time off and manage conflicts
          </p>
        </div>
        <button 
          onClick={onClose}
          style={{ 
            width: 40, height: 40, borderRadius: '50%', background: 'none', border: 'none', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94A3B8' 
          }}
        >
          <X size={24} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Form Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Worker Selection */}
          {!defaultWorkerId && (
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Worker *</label>
              <select 
                value={selectedWorkerId}
                onChange={e => setSelectedWorkerId(e.target.value)}
                style={inputStyle}
              >
                <option value="">Choose worker...</option>
                {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
          )}

          {defaultWorkerId && (
            <div style={{ gridColumn: '1 / -1', background: '#F8FAFD', padding: '16px 20px', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #E2E8F0' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: BLUE, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                {selectedWorker?.name?.[0] || '?'}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#64748B' }}>Applying leave for:</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B' }}>{selectedWorker?.name}</div>
              </div>
            </div>
          )}

          <div>
            <label style={labelStyle}>Start date *</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                style={{ ...inputStyle, borderColor: isDateError ? '#EF4444' : '#E2E8F0' }}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>End date *</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                style={{ ...inputStyle, borderColor: isDateError ? '#EF4444' : '#E2E8F0' }}
              />
            </div>
          </div>

          {isDateError && (
            <div style={{ gridColumn: '1 / -1', color: '#EF4444', fontSize: 13, fontWeight: 600, marginTop: -12 }}>
              End date cannot be earlier than start date.
            </div>
          )}

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Reason *</label>
            <textarea 
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g., Personal leave, Medical leave, Vacation"
              style={{ ...inputStyle, height: 100, resize: 'none', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {/* Conflict Management Section */}
        {selectedWorkerId && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {conflicts.length > 0 ? (
              <>
                {/* Conflict Alert */}
                <div style={{ background: '#FFFBEB', border: '1px solid #FEF3C7', borderRadius: 8, padding: '16px 24px', display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
                  <div style={{ marginTop: 2, color: '#D97706', background: '#fff', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #FEF3C7' }}>
                    <Info size={14} />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#92400E' }}>{conflicts.length} conflicting orders found</div>
                    <div style={{ fontSize: 13, color: '#B45309', fontWeight: 600, marginTop: 4 }}>
                      The following orders are scheduled during your leave. Reassign or cancel them.
                    </div>
                  </div>
                </div>

                {/* Bulk Action */}
                <div style={{ background: '#E0F2FE', border: '1px solid #BAE6FD', borderRadius: 12, padding: '24px', marginBottom: 32 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, color: '#0369A1' }}>
                    <UserPlus size={18} />
                    <span style={{ fontSize: 15, fontWeight: 700 }}>Assign all to one worker</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ ...labelStyle, fontSize: 13, color: '#1E293B' }}>Select worker</label>
                      <select 
                        style={{ ...inputStyle, background: '#fff' }}
                        value={bulkReassignId}
                        onChange={e => setBulkReassignId(e.target.value)}
                      >
                        <option value="">Select worker</option>
                        {availableReplacementWorkers.map(w => (
                          <option key={w.id} value={w.id}>{w.name}</option>
                        ))}
                      </select>
                    </div>
                    <button 
                      onClick={handleBulkReassign}
                      disabled={!bulkReassignId}
                      style={{ 
                        height: 48, padding: '0 24px', borderRadius: 10, 
                        background: '#0369A1', color: '#fff', border: 'none', fontWeight: 700, cursor: bulkReassignId ? 'pointer' : 'not-allowed',
                        opacity: bulkReassignId ? 1 : 0.6, fontSize: 15
                      }}
                    >
                      Assign to all
                    </button>
                  </div>
                </div>

                {/* Individual Actions */}
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>Or assign individually</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {conflicts.map((job, idx) => (
                      <ConflictCard 
                        key={job.id} 
                        job={job} 
                        oldWorkerId={selectedWorkerId}
                        workers={availableReplacementWorkers}
                        onReassign={(newWorkerId) => onReassignJob?.(job.id, selectedWorkerId, newWorkerId)}
                        onCancel={() => onUnassignJob?.(job.id, selectedWorkerId)}
                        workload={idx === 0 ? "10/12" : idx === 1 ? "3/12" : null}
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: 12, padding: '20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle2 size={20} color="#16A34A" />
                <div style={{ fontSize: 15, fontWeight: 700, color: '#15803D' }}>Zero conflicts detected for the selected period.</div>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, paddingTop: 32, borderTop: '1px solid #F1F5F9' }}>
           <button 
            onClick={onClose}
            style={{ padding: '12px 24px', borderRadius: 12, background: '#fff', border: '1px solid #E2E8F0', fontWeight: 700, color: '#64748B', cursor: 'pointer' }}
           >Cancel</button>
           <button 
            onClick={handleSave}
            disabled={!canSave}
            style={{ 
              padding: '12px 32px', borderRadius: 12, background: BLUE, color: '#fff', border: 'none', 
              fontWeight: 800, cursor: canSave ? 'pointer' : 'not-allowed', 
              opacity: canSave ? 1 : 0.5,
              boxShadow: canSave ? `0 10px 20px ${BLUE}33` : 'none'
            }}
           >
            Save Leave
           </button>
        </div>
      </div>
    </div>
  );
}

function ConflictCard({ job, oldWorkerId, workers, onReassign, onCancel, workload }: { 
  job: Job; 
  oldWorkerId: string; 
  workers: Worker[]; 
  onReassign: (newWorkerId: string) => void;
  onCancel: () => void;
  workload?: string | null;
}) {
  const [selectedWorker, setSelectedWorker] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [reassignedTo, setReassignedTo] = useState<string | null>(null);

  const handleReassign = () => {
    if (!selectedWorker) return;
    onReassign(selectedWorker);
    const worker = workers.find(w => w.id === selectedWorker);
    setReassignedTo(worker?.name || '');
    setIsDone(true);
  };

  const handleCancel = () => {
    onCancel();
    setIsDone(true);
    setReassignedTo('Unassigned');
  };

  return (
    <div style={{ 
      background: '#fff', border: '1px solid #F1F5F9', borderRadius: 12, padding: '24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.02)', position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: 24, flex: 1 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 4 }}>Client name</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1E293B' }}>{job.client}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 4 }}>Date & time</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1E293B' }}>{job.date ? format(parseISO(job.date), 'MMM dd, yyyy') : 'N/A'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1E293B' }}>{job.type} Cleaning</div>
            {workload && (
              <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', marginTop: 4 }}>
                {workload} jobs assigned
              </div>
            )}
          </div>
        </div>
      </div>

      {isDone && (
        <div style={{ 
          background: '#DCFCE7', padding: '10px 16px', borderRadius: 10, 
          display: 'inline-flex', alignItems: 'center', gap: 8, color: '#16A34A', 
          fontSize: 14, fontWeight: 800, border: '1.5px solid #BBF7D0',
          marginBottom: 16
        }}>
          <User size={16} /> Reassigned to {reassignedTo}
        </div>
      )}

      {!isDone && (
        <>
          <div style={{ height: 1.5, background: '#F1F5F9', marginBottom: 20 }} />
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', display: 'block', marginBottom: 8 }}>Reassign to</label>
              <select 
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #E2E8F0', fontWeight: 600, outline: 'none', background: '#F8FAFD' }}
                value={selectedWorker}
                onChange={e => setSelectedWorker(e.target.value)}
              >
                <option value="">Select worker</option>
                {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={handleReassign}
                disabled={!selectedWorker}
                style={{ padding: '12px 24px', borderRadius: 10, background: '#0369A1', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', opacity: selectedWorker ? 1 : 0.6, fontSize: 14 }}
              >
                Reassign
              </button>
              <button 
                onClick={handleCancel}
                style={{ padding: '12px 24px', borderRadius: 10, background: '#fff', color: '#EF4444', border: '1.5px solid #FEE2E2', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
