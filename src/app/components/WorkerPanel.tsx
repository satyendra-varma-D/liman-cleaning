import { useState } from 'react';
import { X, Check, Users } from 'lucide-react';
import type { Job, Worker } from '../types';
import { useLanguage } from '../LanguageContext';
import { BLUE, ORANGE } from '../constants';

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
  onSave: (jobId: string, workerIds: string[]) => void;
  onClose: () => void;
}

export function WorkerPanel({ job, workers, onSave, onClose }: Props) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string[]>([...job.assignedWorkers]);

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const available = workers.filter(w => w.available || job.assignedWorkers.includes(w.id));
  const unavailable = workers.filter(w => !w.available && !job.assignedWorkers.includes(w.id));

  const isFull = selected.length >= job.workersNeeded;

  const WorkerRow = ({ worker, disabled = false }: { worker: Worker; disabled?: boolean }) => {
    const isSelected = selected.includes(worker.id);
    return (
      <div
        onClick={() => !disabled && toggle(worker.id)}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '16px', borderRadius: 16,
          border: `2px solid ${isSelected ? BLUE : '#F1F5F9'}`,
          background: isSelected ? '#EFF6FF' : disabled ? '#F8FAFD' : '#fff',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          marginBottom: 12,
          transition: 'all 0.2s ease',
          boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.08)' : 'none',
        }}
      >
        {/* Checkbox */}
        <div style={{
          width: 24, height: 24, borderRadius: 8, flexShrink: 0,
          border: `2px solid ${isSelected ? BLUE : '#CBD5E1'}`,
          background: isSelected ? BLUE : '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isSelected && <Check size={14} color="#fff" strokeWidth={4} />}
        </div>

        {/* Avatar */}
        <div style={{
          width: 42, height: 42, borderRadius: 12, flexShrink: 0,
          background: isSelected ? BLUE : '#F1F5F9',
          color: isSelected ? '#fff' : '#64748B',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 900,
          border: `1px solid ${isSelected ? BLUE : '#E2E8F0'}`
        }}>
          {worker.name[0]}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#1E293B' }}>{worker.name}</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4, alignItems: 'center' }}>
            <ReliabilityDots value={worker.reliability} />
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#CBD5E1' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>
              {worker.languages.join(', ')}
            </span>
          </div>
        </div>

        {/* Badge */}
        <div style={{ flexShrink: 0 }}>
          {disabled ? (
            <span style={{ fontSize: 10, color: '#DC2626', background: '#FEF2F2', borderRadius: 6, padding: '3px 8px', fontWeight: 800, textTransform: 'uppercase' }}>
              {t('elsewhere')}
            </span>
          ) : isSelected ? (
            <span style={{ fontSize: 10, color: BLUE, background: '#DBEAFE', borderRadius: 6, padding: '3px 8px', fontWeight: 800, textTransform: 'uppercase' }}>
              Selected
            </span>
          ) : (
            <span style={{ fontSize: 10, color: '#16A34A', background: '#F0FDF4', borderRadius: 6, padding: '3px 8px', fontWeight: 800, textTransform: 'uppercase' }}>
              {t('available')}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'flex-end',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#fff',
        width: '100%', maxWidth: 520, height: '100%',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.15)',
        animation: 'slideIn 0.3s ease-out forwards',
      }}>
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
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
          background: isFull ? '#F0FDF4' : '#F8FAFD',
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
          <div>
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
        </div>

        {/* Worker list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          {available.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <div style={{
                fontSize: 11, fontWeight: 900, color: '#94A3B8',
                textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 8
              }}>
                <Users size={12} /> {t('available')} ({available.length})
              </div>
              {available.map(w => <WorkerRow key={w.id} worker={w} />)}
            </div>
          )}

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
