import { useState, useMemo, useEffect } from 'react';
import { X, Check, Users, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';
import type { Job, Worker } from '../types';
import { useLanguage } from '../LanguageContext';
import { BLUE, ORANGE } from '../constants';
import { suggestTeam } from '../SuggestionEngine';

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
  jobs: Job[];
  onSave: (jobId: string, workerIds: string[]) => void;
  onClose: () => void;
}

// Time calculation helpers for conflict checking
function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hrs, mins] = timeStr.split(':').map(Number);
  return (hrs || 0) * 60 + (mins || 0);
}

function parseDurationToMinutes(durationStr: string): number {
  if (!durationStr) return 120; // default 2 hours
  const hours = parseFloat(durationStr) || 2;
  return Math.round(hours * 60);
}

function checkTimeOverlap(time1: string, duration1: string, time2: string, duration2: string): boolean {
  const t1Start = parseTimeToMinutes(time1);
  const t1End = t1Start + parseDurationToMinutes(duration1);
  const t2Start = parseTimeToMinutes(time2);
  const t2End = t2Start + parseDurationToMinutes(duration2);
  return t1Start < t2End && t2Start < t1End;
}

function isJobInsideAvailableSlot(jobTime: string, jobDuration: string, slotStart: string, slotEnd: string): boolean {
  const jobStartMin = parseTimeToMinutes(jobTime);
  const jobEndMin = jobStartMin + parseDurationToMinutes(jobDuration);
  const slotStartMin = parseTimeToMinutes(slotStart);
  const slotEndMin = parseTimeToMinutes(slotEnd);
  return jobStartMin >= slotStartMin && jobEndMin <= slotEndMin;
}

function getEndTime(timeStr: string, durationStr: string): string {
  const startMin = parseTimeToMinutes(timeStr);
  const endMin = startMin + parseDurationToMinutes(durationStr);
  const hrs = Math.floor(endMin / 60) % 24;
  const mins = endMin % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

function getDayOfWeek(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dateObj.getDay()];
}

export function WorkerPanel({ job, workers, jobs, onSave, onClose }: Props) {
  const { t } = useLanguage();

  const busyWorkerIds = useMemo(() => {
    const busy = new Set<string>();
    if (!job.date || !job.time || !job.estimatedDuration) return busy;
    
    // 1. Overlapping jobs on the same day
    jobs.forEach(j => {
      if (job && j.id === job.id) return;
      if (j.date === job.date && checkTimeOverlap(j.time, j.estimatedDuration, job.time, job.estimatedDuration)) {
        (j.assignedWorkers || []).forEach(id => busy.add(id));
      }
    });

    // 2. Recurring workers who are outside their availability slot
    workers.forEach(w => {
      if (w.workType === 'recurring') {
        const jobDayOfWeek = getDayOfWeek(job.date);
        if (w.recurringDays?.includes(jobDayOfWeek)) {
          const slot = w.recurringTimeSlot || '';
          if (slot.includes(' - ')) {
            const [slotStart, slotEnd] = slot.split(' - ');
            if (!isJobInsideAvailableSlot(job.time, job.estimatedDuration, slotStart, slotEnd)) {
              busy.add(w.id);
            }
          }
        }
      }
    });

    return busy;
  }, [jobs, job.date, job.time, job.estimatedDuration, job.id, workers]);

  const getWorkerConflict = (workerId: string) => {
    if (!job.date || !job.time || !job.estimatedDuration) return null;

    // 1. Overlapping assigned jobs
    const overlappingJob = jobs.find(j => {
      if (job && j.id === job.id) return false;
      if (j.date === job.date && (j.assignedWorkers || []).includes(workerId)) {
        return checkTimeOverlap(j.time, j.estimatedDuration, job.time, job.estimatedDuration);
      }
      return false;
    });

    if (overlappingJob) {
      return `Already assigned: ${overlappingJob.client} (${overlappingJob.time} - ${getEndTime(overlappingJob.time, overlappingJob.estimatedDuration)})`;
    }

    // 2. Outside availability slot
    const workerObj = workers.find(w => w.id === workerId);
    if (workerObj && workerObj.workType === 'recurring') {
      const jobDayOfWeek = getDayOfWeek(job.date);
      if (workerObj.recurringDays?.includes(jobDayOfWeek)) {
        const slot = workerObj.recurringTimeSlot || '';
        if (slot.includes(' - ')) {
          const [slotStart, slotEnd] = slot.split(' - ');
          if (!isJobInsideAvailableSlot(job.time, job.estimatedDuration, slotStart, slotEnd)) {
            return `Outside availability: Available only ${slotStart} to ${slotEnd}`;
          }
        }
      }
    }

    return null;
  };

  const suggestionResults = useMemo(() => {
    return suggestTeam(job, workers, busyWorkerIds);
  }, [job, workers, busyWorkerIds]);

  const systemSuggestedIds = useMemo(() => {
    return suggestionResults.recommendedTeam.map(t => t.worker.id);
  }, [suggestionResults]);

  const [selected, setSelected] = useState<string[]>(() => {
    if (job.assignedWorkers && job.assignedWorkers.length > 0) {
      return [...job.assignedWorkers];
    }
    return [];
  });

  const [isWorkerSelectionInitialized, setIsWorkerSelectionInitialized] = useState(false);

  useEffect(() => {
    if (!isWorkerSelectionInitialized && systemSuggestedIds.length > 0) {
      if (selected.length === 0) {
        setSelected(systemSuggestedIds);
      }
      setIsWorkerSelectionInitialized(true);
    }
  }, [systemSuggestedIds, isWorkerSelectionInitialized, selected]);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const available = useMemo(() => {
    return workers.filter(w => w.available || job.assignedWorkers.includes(w.id));
  }, [workers, job]);

  const unavailable = useMemo(() => {
    return workers.filter(w => !w.available && !job.assignedWorkers.includes(w.id));
  }, [workers, job]);

  const isSystemSuggestedActive = useMemo(() => {
    return selected.length > 0 &&
      selected.length === systemSuggestedIds.length &&
      selected.every(id => systemSuggestedIds.includes(id));
  }, [selected, systemSuggestedIds]);

  const selectedWorkers = useMemo(() => {
    return available.filter(w => selected.includes(w.id));
  }, [available, selected]);

  const suggestionReasonsMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    suggestionResults.recommendedTeam.forEach(item => {
      map[item.worker.id] = item.reasons;
    });
    return map;
  }, [suggestionResults]);

  const bestPairingWorkers = useMemo(() => {
    if (isSystemSuggestedActive || selected.length === 0) {
      return [];
    }
    return available.filter(w => {
      if (selected.includes(w.id)) return false;
      if (systemSuggestedIds.includes(w.id)) return false; // always go to Other Available if deselected
      
      return selectedWorkers.some(sw => 
        sw.synergyWith?.includes(w.id) || w.synergyWith?.includes(sw.id)
      );
    });
  }, [isSystemSuggestedActive, selected, available, selectedWorkers, systemSuggestedIds]);

  const otherAvailableWorkers = useMemo(() => {
    return available.filter(w => {
      if (selected.includes(w.id)) return false;
      if (bestPairingWorkers.some(bp => bp.id === w.id)) return false;
      return true;
    });
  }, [available, selected, bestPairingWorkers]);

  const showBestPairingSection = !isSystemSuggestedActive && selected.length > 0;
  const isFull = selected.length >= job.workersNeeded;

  const WorkerRow = ({ worker, disabled = false, suggestionReasons, isRecommendedBadge, isBestRecommendation }: { worker: Worker; disabled?: boolean; suggestionReasons?: string[]; isRecommendedBadge?: boolean; isBestRecommendation?: boolean }) => {
    const isSelected = selected.includes(worker.id);
    const [showAI, setShowAI] = useState(false);
    const conflict = getWorkerConflict(worker.id);

    return (
      <div
        onClick={() => !disabled && toggle(worker.id)}
        style={{
          display: 'flex', flexDirection: 'column',
          padding: '16px', borderRadius: 20,
          border: `2px solid ${conflict ? '#FCA5A5' : isSelected ? BLUE : suggestionReasons ? '#E0E7FF' : '#F1F5F9'}`,
          background: isSelected ? '#EFF6FF' : conflict ? '#FFF5F5' : disabled ? '#F8FAFD' : '#fff',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.7 : 1,
          marginBottom: 12,
          transition: 'all 0.2s ease',
          boxShadow: isSelected ? '0 8px 16px rgba(37, 99, 235, 0.08)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Checkbox */}
          <div style={{
            width: 22, height: 22, borderRadius: 7, flexShrink: 0,
            border: `2px solid ${isSelected ? BLUE : '#CBD5E1'}`,
            background: isSelected ? BLUE : '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isSelected && <Check size={14} color="#fff" strokeWidth={4} />}
          </div>

          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {worker.avatar ? (
              <img 
                src={worker.avatar} 
                alt={worker.name} 
                style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover', border: '1px solid rgba(0,0,0,0.05)' }} 
              />
            ) : (
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: isSelected ? BLUE : '#F1F5F9',
                color: isSelected ? '#fff' : '#64748B',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 900,
              }}>
                {worker.name[0]}
              </div>
            )}
            {worker.isSupervisor && (
              <div title="Supervisor" style={{ position: 'absolute', bottom: -4, right: -4, background: '#16A34A', borderRadius: '50%', border: '2px solid #fff', padding: 2 }}>
                <ShieldCheck size={10} color="#fff" />
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#1E293B' }}>{worker.name}</div>
                {isBestRecommendation && (
                  <span style={{ 
                    fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 6,
                    background: '#FFF7ED', color: ORANGE, border: `1px solid #FFEDD5`,
                    textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 2
                  }}>
                    <Sparkles size={8} /> Best Recommendation
                  </span>
                )}
                {isRecommendedBadge && (
                  <span style={{ 
                    fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 6,
                    background: '#FFF7ED', color: ORANGE, border: `1px solid #FFEDD5`,
                    textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: 2
                  }}>
                    <Sparkles size={8} /> Recommended
                  </span>
                )}
                {worker.pastCustomers.includes(job.client) && (
                  <span style={{ fontSize: 9, background: '#F0F9FF', color: '#0369A1', padding: '1px 6px', borderRadius: 6, fontWeight: 800, textTransform: 'uppercase' }}>Consistently Assigned</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#F59E0B' }}>★</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#1E293B' }}>{worker.rating || '4.5'}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4, alignItems: 'center' }}>
              <ReliabilityDots value={worker.reliability} />
              <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#CBD5E1' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>
                {worker.languages.join(', ')}
              </span>
              <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#CBD5E1' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>
                {worker.totalJobs || 0} jobs
              </span>
            </div>
          </div>
        </div>

        {conflict && (
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#FEF2F2', border: '1px solid #FEE2E2',
            borderRadius: 12, padding: '8px 12px', marginTop: 12
          }}>
            <AlertCircle size={14} color="#DC2626" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#DC2626' }}>{conflict}</span>
          </div>
        )}

        {/* Insight Row */}
        {suggestionReasons && suggestionReasons.length > 0 && (
          <div 
            onClick={(e) => { e.stopPropagation(); setShowAI(!showAI); }}
            style={{ 
              marginTop: 12, 
              background: '#F0FDF4', 
              borderRadius: 12, 
              padding: showAI ? '12px' : '8px 12px',
              border: '1px solid #DCFCE7',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={12} color="#16A34A" />
                <span style={{ fontSize: 11, fontWeight: 800, color: '#15803D' }}>SYSTEM INSIGHT</span>
              </div>
              <div style={{ fontSize: 10, color: '#16A34A', fontWeight: 800 }}>
                {showAI ? 'Close' : suggestionReasons[0]}
              </div>
            </div>
            {showAI && (
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {suggestionReasons.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                    <div style={{ marginTop: 5, width: 4, height: 4, borderRadius: '50%', background: '#16A34A' }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#166534', lineHeight: 1.4 }}>{r}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 9999,
      padding: '20px',
    }}>
      <div style={{
        background: '#fff',
        width: '100%', maxWidth: 700, 
        height: 'auto', maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        borderRadius: 24,
        overflow: 'hidden',
        animation: 'modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <style>{`
          @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>

        {/* Header */}
        <div style={{
          padding: '24px 32px',
          background: BLUE, color: '#fff',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, lineHeight: 1.2, letterSpacing: '-0.02em' }}>{t('assignStaff')}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 6, lineHeight: 1.4, fontWeight: 600 }}>
              {job.client} · {job.time}<br />
              {t('neededWorkers')}: {job.workersNeeded}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: 12, padding: 10, color: '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
            }}
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Progress indicator */}
        <div style={{
          padding: '16px 32px',
          background: isFull ? '#F0FDF4' : '#fff',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: isFull ? '#16A34A' : BLUE,
            color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, fontWeight: 900,
            boxShadow: isFull ? '0 4px 12px rgba(22, 163, 74, 0.2)' : '0 4px 12px rgba(37, 99, 235, 0.2)',
          }}>
            {selected.length}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1E293B' }}>
              {selected.length} / {job.workersNeeded} {t('selected')}
              {isFull && ' ✓'}
            </div>
            {!isFull && (
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2, fontWeight: 600 }}>
                {job.workersNeeded - selected.length} more needed
              </div>
            )}
          </div>
          {suggestionResults?.missingRoles.length ? (
            <div style={{ background: '#FFF7ED', color: '#C2410C', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertCircle size={14} /> Missing Supervisor
            </div>
          ) : null}
        </div>

        {/* Worker list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          {/* Section 1: Selected / System Suggested Workers */}
          <div style={{ marginBottom: 32 }}>
            <div style={{
              fontSize: 11, fontWeight: 900, color: isSystemSuggestedActive ? '#F59E0B' : BLUE,
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              {isSystemSuggestedActive ? <Sparkles size={12} /> : <Users size={12} />}
              {isSystemSuggestedActive ? 'System Suggested Workers' : `Selected Workers (${selectedWorkers.length})`}
            </div>
            {selectedWorkers.length === 0 ? (
              <div style={{ padding: '16px', borderRadius: 16, border: '1.5px dashed #CBD5E1', textAlign: 'center', color: '#64748B', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                No workers selected. Choose from available lists below.
              </div>
            ) : (
              selectedWorkers.map(worker => (
                <WorkerRow 
                  key={worker.id} 
                  worker={worker} 
                  suggestionReasons={suggestionReasonsMap[worker.id]} 
                  isBestRecommendation={systemSuggestedIds[0] === worker.id}
                />
              ))
            )}
          </div>

          {/* Section 2: Best Pairing Workers */}
          {showBestPairingSection && (
            <div style={{ marginBottom: 32 }}>
              <div style={{
                fontSize: 11, fontWeight: 900, color: '#16A34A',
                textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                <Sparkles size={12} /> Best Pairing Workers
              </div>
              {bestPairingWorkers.length === 0 ? (
                <div style={{ padding: '16px', borderRadius: 16, border: '1.5px dashed #E2E8F0', textAlign: 'center', color: '#94A3B8', fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
                  No specific pairing recommendations.
                </div>
              ) : (
                bestPairingWorkers.map(worker => (
                  <WorkerRow key={worker.id} worker={worker} />
                ))
              )}
            </div>
          )}

          {/* Section 3: Other Available Workers */}
          <div style={{ marginBottom: 32 }}>
            <div style={{
              fontSize: 11, fontWeight: 900, color: '#64748B',
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 8
            }}>
              <Users size={12} /> Other Available Workers ({otherAvailableWorkers.length})
            </div>
            {otherAvailableWorkers.length === 0 ? (
              <div style={{ padding: '16px', borderRadius: 16, border: '1.5px dashed #E2E8F0', textAlign: 'center', color: '#94A3B8', fontSize: 12, fontWeight: 600, marginBottom: 12 }}>
                No other available workers.
              </div>
            ) : (
              otherAvailableWorkers.map(worker => (
                <WorkerRow 
                  key={worker.id} 
                  worker={worker} 
                  isRecommendedBadge={systemSuggestedIds.includes(worker.id)} 
                />
              ))
            )}
          </div>

          {/* Section 4: Unavailable Workers */}
          {unavailable.length > 0 && (
            <div>
              <div style={{
                fontSize: 11, fontWeight: 900, color: '#94A3B8',
                textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16,
              }}>
                {t('unavailable')} ({unavailable.length})
              </div>
              {unavailable.map(w => <WorkerRow key={w.id} worker={w} disabled />)}
            </div>
          )}
        </div>

        {/* Save */}
        <div style={{ padding: '24px 32px', borderTop: '1px solid #F1F5F9', background: '#F8FAFD' }}>
          <button
            onClick={() => onSave(job.id, selected)}
            style={{
              width: '100%', padding: '16px',
              border: 'none', borderRadius: 14,
              background: ORANGE, color: '#fff',
              fontSize: 16, fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(245, 158, 11, 0.2)',
              letterSpacing: 0.1,
            }}
          >
            {t('applyAssignment')}
          </button>
        </div>
      </div>
    </div>
  );
}
