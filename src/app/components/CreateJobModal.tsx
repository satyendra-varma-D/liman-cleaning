import { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';
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

function Toggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        width: 40, height: 22, borderRadius: 20,
        background: active ? '#16A34A' : '#CBD5E1',
        border: 'none', position: 'relative', cursor: 'pointer', transition: 'all 0.3s'
      }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 3, left: active ? 21 : 3,
        transition: 'all 0.3s'
      }} />
    </button>
  );
}

export function CreateJobModal({ job, defaultDate, onSave, onClose }: Props) {
  const { t } = useLanguage();
  const [client, setClient]           = useState(job?.client ?? '');
  const [location, setLocation]       = useState(job?.location ?? '');
  const [date, setDate]               = useState(job?.date ?? defaultDate);
  const [time, setTime]               = useState(job?.time ?? '08:00');
  const [workersNeeded, setWorkers]   = useState(job?.workersNeeded ?? 2);
  const [type, setType]               = useState<JobType>(job?.type ?? 'general');
  const [notes, setNotes]             = useState(job?.notes ?? '');
  const [requiredSkills, setRequiredSkills] = useState<string[]>(job?.requiredSkills ?? [job?.type ?? 'general']);
  const [needsGermanSpeaker, setNeedsGermanSpeaker] = useState(job?.needsGermanSpeaker ?? false);
  const [isWeatherDependent, setIsWeatherDependent] = useState(job?.isWeatherDependent ?? false);

  useEffect(() => {
    if (!job && type) {
      setRequiredSkills([type]);
      if (type === 'snow' || type === 'window') setIsWeatherDependent(true);
    }
  }, [type, job]);

  const isEdit = !!job;

  const jobTypes: { value: JobType; label: string; icon: string }[] = [
    { value: 'window',  label: t('windowCleaning'),    icon: '🪟' },
    { value: 'special', label: t('specialCleaning'),      icon: '⭐' },
    { value: 'snow',    label: t('snowRemoval'),        icon: '❄️' },
    { value: 'grass',   label: 'Grass Cutting',        icon: '🌱' },
    { value: 'machine', label: 'Machine Cleaning',     icon: '⚙️' },
    { value: 'general', label: t('generalCleaning'), icon: '🧹' },
  ];

  const allSkills = ['window', 'special', 'snow', 'grass', 'machine', 'general'];

  const toggleSkill = (skill: string) => {
    setRequiredSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleSuggestFromPast = () => {
    // Mocking a lookup for the client
    const c = client.toLowerCase();
    if (c.includes('bank')) {
      setRequiredSkills(['window', 'general']);
      setNeedsGermanSpeaker(true);
      setNotes('High security - ID required at entrance.');
      setWorkers(3);
    } else if (c.includes('hotel')) {
      setRequiredSkills(['special', 'general']);
      setNeedsGermanSpeaker(true);
      setWorkers(4);
      setNotes('Start with lobby, then move to conference rooms.');
    } else if (c.includes('residential')) {
      setType('general');
      setWorkers(2);
      setRequiredSkills(['general']);
      setNotes('Contact building manager on arrival.');
    } else if (c.includes('hospital')) {
      setRequiredSkills(['special', 'machine']);
      setNeedsGermanSpeaker(true);
      setWorkers(5);
    }
  };

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
      requiredSkills,
      needsGermanSpeaker,
      isWeatherDependent,
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
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          <div style={{ display: 'grid', gap: 24 }}>
            {/* Client */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={labelStyle}>{t('client')} *</label>
                {!isEdit && client.length > 3 && (
                  <button 
                    type="button"
                    onClick={handleSuggestFromPast}
                    style={{ background: 'none', border: 'none', color: BLUE, fontSize: 11, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Sparkles size={12} /> Suggest from past jobs
                  </button>
                )}
              </div>
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

            {/* Skills Requirement */}
            <div>
              <label style={labelStyle}>Required Skills</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {allSkills.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    style={{
                      padding: '8px 12px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                      border: '1.5px solid',
                      borderColor: requiredSkills.includes(skill) ? BLUE : '#E2E8F0',
                      background: requiredSkills.includes(skill) ? '#EFF6FF' : '#fff',
                      color: requiredSkills.includes(skill) ? BLUE : '#64748B',
                      cursor: 'pointer', transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', gap: 6
                    }}
                  >
                    {requiredSkills.includes(skill) && <CheckCircle2 size={14} />}
                    {skill.charAt(0).toUpperCase() + skill.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Language & Weather Requirement */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ 
                background: '#F8FAFD', padding: 16, borderRadius: 12, border: '1px solid #E2E8F0',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#1E293B' }}>German?</div>
                  <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>Needs DE speaker</div>
                </div>
                <Toggle active={needsGermanSpeaker} onToggle={() => setNeedsGermanSpeaker(!needsGermanSpeaker)} />
              </div>

              <div style={{ 
                background: '#F8FAFD', padding: 16, borderRadius: 12, border: '1px solid #E2E8F0',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#1E293B' }}>Weather?</div>
                  <div style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>Cancel if rain/snow</div>
                </div>
                <Toggle active={isWeatherDependent} onToggle={() => setIsWeatherDependent(!isWeatherDependent)} />
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
