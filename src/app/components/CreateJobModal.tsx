import { useState } from 'react';
import { X } from 'lucide-react';
import type { Job, JobType } from '../types';
import { useLanguage } from '../LanguageContext';
import { BLUE, ORANGE } from '../constants';

interface Props {
  job: Job | null;
  defaultDate: string;
  onSave: (data: Omit<Job, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1.5px solid #E2E8F0',
  borderRadius: 12,
  padding: '12px 16px',
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
  background: '#F8FAFD',
  color: '#1E293B',
  transition: 'all 0.2s ease',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 800,
  color: '#64748B',
  marginBottom: 8,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
};

export function CreateJobModal({ job, defaultDate, onSave, onClose }: Props) {
  const { t } = useLanguage();
  const [client, setClient]           = useState(job?.client ?? '');
  const [location, setLocation]       = useState(job?.location ?? '');
  const [date, setDate]               = useState(job?.date ?? defaultDate);
  const [time, setTime]               = useState(job?.time ?? '08:00');
  const [workersNeeded, setWorkers]   = useState(job?.workersNeeded ?? 2);
  const [type, setType]               = useState<JobType>(job?.type ?? 'general');
  const [notes, setNotes]             = useState(job?.notes ?? '');

  const isEdit = !!job;

  const jobTypes: { value: JobType; label: string; icon: string }[] = [
    { value: 'window',  label: t('windowCleaning'),    icon: '🪟' },
    { value: 'special', label: t('specialCleaning'),      icon: '⭐' },
    { value: 'snow',    label: t('snowRemoval'),        icon: '❄️' },
    { value: 'general', label: t('generalCleaning'), icon: '🧹' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.trim() || !location.trim()) return;
    onSave({
      id: job?.id,
      client: client.trim(),
      location: location.trim(),
      date,
      time,
      workersNeeded,
      assignedWorkers: job?.assignedWorkers ?? [],
      type,
      status: job?.status ?? 'scheduled',
      notes: notes.trim(),
    });
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
          background: BLUE,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
              {isEdit ? t('edit') : t('createJob')}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: '4px 0 0 0', fontWeight: 600 }}>
              {isEdit ? 'Update order details' : 'Fill in the information to schedule a new order'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: 12, padding: 10, color: '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          <div style={{ display: 'grid', gap: 24 }}>
            {/* Client */}
            <div>
              <label style={labelStyle}>{t('client')} *</label>
              <input
                style={inputStyle}
                value={client}
                onChange={e => setClient(e.target.value)}
                placeholder="e.g. Raiffeisen Bank AG"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label style={labelStyle}>{t('location')} *</label>
              <input
                style={inputStyle}
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Mariahilfer Str. 77, Vienna"
                required
              />
            </div>

            {/* Date + Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>{t('date')}</label>
                <input type="date" style={inputStyle} value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <div>
                <label style={labelStyle}>{t('time')}</label>
                <input type="time" style={inputStyle} value={time} onChange={e => setTime(e.target.value)} required />
              </div>
            </div>

            {/* Workers + Type */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>{t('neededWorkers')}</label>
                <input
                  type="number" min={1} max={20}
                  style={inputStyle}
                  value={workersNeeded}
                  onChange={e => setWorkers(Number(e.target.value))}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>{t('type')}</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={type}
                  onChange={e => setType(e.target.value as JobType)}
                >
                  {jobTypes.map(t => (
                    <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label style={labelStyle}>{t('notes')} (optional)</label>
              <textarea
                style={{ ...inputStyle, minHeight: 120, resize: 'none' }}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Additional instructions or details..."
              />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div style={{ 
          padding: '24px 32px', 
          borderTop: '1px solid #F1F5F9', 
          display: 'flex', gap: 12,
          background: '#F8FAFD'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1, padding: '14px',
              border: '1.5px solid #CBD5E1', borderRadius: 12,
              background: '#fff', cursor: 'pointer',
              fontSize: 15, fontWeight: 700, color: '#475569',
            }}
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            style={{
              flex: 2, padding: '14px',
              border: 'none', borderRadius: 12,
              background: ORANGE, color: '#fff',
              cursor: 'pointer', fontSize: 15, fontWeight: 900,
              boxShadow: '0 10px 20px rgba(245, 158, 11, 0.2)',
            }}
          >
            {isEdit ? t('save') : t('createJob')}
          </button>
        </div>
      </div>
    </div>
  );
}
