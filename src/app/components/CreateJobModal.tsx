import { useState, useEffect, useMemo } from 'react';
import { X, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, MapPin, User } from 'lucide-react';
import type { Job, JobType, Worker } from '../types';
import { useLanguage } from '../LanguageContext';
import { BLUE, ORANGE } from '../constants';

interface Props {
  job: Job | null;
  defaultDate: string;
  workers: Worker[];
  defaultWorkerIds?: string[];
  initialStep?: 'details' | 'workers';
  onSave: (data: Omit<Job, 'id'> & { id?: string }) => void;
  onClose: () => void;
}

const CUSTOMERS = [
  { name: 'Raiffeisen Bank AG', location: 'Mariahilfer Str. 77, 1060 Wien' },
  { name: 'Billa Markt Ottakring', location: 'Thaliastraße 120, 1160 Wien' },
  { name: 'Hotel Erzherzog Johann', location: 'Graben 23, 1010 Wien' },
  { name: 'Vienna State Opera', location: 'Opernring 2, 1010 Wien' },
  { name: 'Schoenbrunn Palace', location: 'Schönbrunner Schloßstraße 47, 1130 Wien' },
  { name: 'Belvedere Museum', location: 'Prinz-Eugen-Straße 27, 1030 Wien' },
  { name: 'Spar Supermarket', location: 'Landstraßer Hauptstraße 1b, 1030 Wien' },
  { name: 'OMV Headquarters', location: 'Trabrennstraße 6, 1020 Wien' },
  { name: 'Erste Bank Campus', location: 'Am Belvedere 1, 1100 Wien' },
  { name: 'Siemens City', location: 'Siemensstraße 90, 1210 Wien' },
  { name: 'Allianz Elementar', location: 'Hietzinger Kai 101, 1130 Wien' },
];

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

function WorkerCard({ worker, isSelected, isSuggested, matchingSkills, onToggle }: { 
  worker: Worker; isSelected: boolean; isSuggested: boolean; matchingSkills: string[]; onToggle: () => void 
}) {
  return (
    <div 
      onClick={onToggle}
      style={{
        padding: '12px 16px', borderRadius: 16, border: '1.5px solid',
        borderColor: isSelected ? BLUE : '#F1F5F9',
        background: isSelected ? '#EFF6FF' : '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', gap: 16,
        boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.1)' : 'none'
      }}
    >
      <div style={{ 
        width: 40, height: 40, borderRadius: 12, 
        background: worker.isSupervisor ? '#16A34A' : BLUE, 
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800
      }}>
        {worker.name[0]}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#1E293B' }}>{worker.name}</div>
          {isSuggested && matchingSkills.length > 0 && (
            <div style={{ fontSize: 10, color: '#16A34A', fontWeight: 800, background: '#F0FDF4', padding: '2px 6px', borderRadius: 6 }}>
              Best Fit
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
          {worker.skills.map(s => (
            <span key={s} style={{ 
              fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
              background: matchingSkills.includes(s) ? '#DBEAFE' : '#F1F5F9',
              color: matchingSkills.includes(s) ? BLUE : '#64748B'
            }}>
              {s}
            </span>
          ))}
        </div>
      </div>
      <div style={{ 
        width: 20, height: 20, borderRadius: '50%', border: '2px solid',
        borderColor: isSelected ? BLUE : '#CBD5E1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isSelected ? BLUE : 'transparent'
      }}>
        {isSelected && <CheckCircle2 size={14} color="#fff" />}
      </div>
    </div>
  );
}

export function CreateJobModal({ job, defaultDate, workers, defaultWorkerIds = [], initialStep, onSave, onClose }: Props) {
  const { t } = useLanguage();
  const [step, setStep]                   = useState<'details' | 'workers'>(initialStep || 'details');
  const [client, setClient]               = useState(job?.client ?? '');
  const [location, setLocation]           = useState(job?.location ?? '');
  const [date, setDate]                   = useState(job?.date ?? defaultDate);
  const [time, setTime]                   = useState(job?.time ?? '');
  const [type, setType]                   = useState<JobType>(job?.type ?? 'general');
  const [workersNeeded, setWorkersNeeded] = useState(job?.workersNeeded ?? 2);
  const [assignedWorkers, setAssignedWorkers] = useState<string[]>(job?.assignedWorkers ?? defaultWorkerIds);
  const [notes, setNotes]                 = useState(job?.notes ?? '');
  const [requiredSkills, setRequiredSkills] = useState<string[]>(job?.requiredSkills ?? [job?.type ?? 'general']);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Auto-select best fit workers when moving to worker selection step
  useEffect(() => {
    if (step === 'workers' && assignedWorkers.length === 0) {
      const bestFitIds = scoredWorkers.slice(0, workersNeeded).map(w => w.id);
      setAssignedWorkers(bestFitIds);
    }
  }, [step]);

  useEffect(() => {
    if (!job && type) {
      setRequiredSkills([type]);
    }
  }, [type, job]);

  const isEdit = !!job;

  const jobTypes: { value: JobType; label: string; icon: string }[] = [
    { value: 'general', label: 'General Cleaning', icon: '🧹' },
    { value: 'window',  label: 'Window & Glass',    icon: '🪟' },
    { value: 'special', label: 'Specialist Work',   icon: '⭐' },
    { value: 'office',  label: 'Office Cleaning',   icon: '🏢' },
    { value: 'facade',  label: 'Façade Cleaning',   icon: '🏗️' },
    { value: 'industrial', label: 'Industrial/Machine', icon: '⚙️' },
    { value: 'snow',    label: 'Snow Removal',      icon: '❄️' },
    { value: 'grass',   label: 'Garden & Grass',    icon: '🌱' },
  ];

  const allSkills = ['window', 'special', 'snow', 'grass', 'machine', 'general'];

  const toggleSkill = (skill: string) => {
    setRequiredSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const filteredCustomers = useMemo(() => {
    if (!client || client.trim().length === 0) return CUSTOMERS;
    return CUSTOMERS.filter(c => c.name.toLowerCase().includes(client.toLowerCase()));
  }, [client]);

  const scoredWorkers = useMemo(() => {
    const hasGermanSpeakerAssigned = assignedWorkers.some(id => 
      workers.find(w => w.id === id)?.languages.includes('DE')
    );

    return workers.map(w => {
      let score = 0;
      // Skill match
      const matchingSkills = w.skills.filter(s => requiredSkills.includes(s));
      score += matchingSkills.length * 10;
      
      // Role boost
      if (w.isSupervisor) score += 5;
      
      // Availability check (basic)
      if (w.available) score += 20;

      // German language boost if none assigned
      if (!hasGermanSpeakerAssigned && w.languages.includes('DE')) {
        score += 50; // High priority for at least one German speaker
      }

      return { ...w, score };
    }).sort((a, b) => b.score - a.score);
  }, [workers, requiredSkills, assignedWorkers]);

  const handleSuggestFromPast = () => {
    const c = client.toLowerCase();
    if (c.includes('bank')) {
      setRequiredSkills(['window', 'general']);
      setNotes('High security - ID required at entrance.');
      setWorkersNeeded(3);
    } else if (c.includes('hotel')) {
      setRequiredSkills(['special', 'general']);
      setWorkersNeeded(4);
      setNotes('Start with lobby, then move to conference rooms.');
    } else if (c.includes('residential')) {
      setType('general');
      setWorkersNeeded(2);
      setRequiredSkills(['general']);
      setNotes('Contact building manager on arrival.');
    } else if (c.includes('hospital')) {
      setRequiredSkills(['special', 'machine']);
      setWorkersNeeded(5);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'details') {
      if (!client.trim() || !location.trim()) return;
      setStep('workers');
      return;
    }
    
    onSave({
      id: job?.id,
      client: client.trim(),
      location: location.trim(),
      date,
      time,
      workersNeeded,
      assignedWorkers,
      type,
      status: job?.status ?? 'scheduled',
      notes: notes.trim(),
      requiredSkills,
      needsGermanSpeaker: true, // Mandatory
      isWeatherDependent: false,
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
          padding: '20px 32px',
          background: BLUE,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {step === 'workers' && (
              <button 
                onClick={() => setStep('details')}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, padding: 6, color: '#fff', cursor: 'pointer' }}
              >
                <ChevronLeft size={18} />
              </button>
            )}
            <div>
              <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>
                {step === 'details' ? (isEdit ? t('edit') : t('createJob')) : 'Assign Workers'}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: '2px 0 0 0', fontWeight: 600 }}>
                {step === 'details' ? 'Order details & requirements' : `Assign ${workersNeeded} workers to this order`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: 10, padding: 8, color: '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
            }}
          >
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
          {step === 'details' ? (
            <div style={{ display: 'grid', gap: 20 }}>
              {/* Client with Autocomplete */}
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={labelStyle}>{t('client')} *</label>
                  {!isEdit && (
                    <button 
                      type="button"
                      onClick={handleSuggestFromPast}
                      style={{ background: 'none', border: 'none', color: BLUE, fontSize: 10, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      <Sparkles size={12} /> Smart Fill
                    </button>
                  )}
                </div>
                <input
                  style={inputStyle}
                  value={client}
                  onChange={e => {
                    setClient(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="e.g. Raiffeisen Bank AG"
                  required
                />
                {showSuggestions && filteredCustomers.length > 0 && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    background: '#fff', borderRadius: 14, marginTop: 8,
                    boxShadow: '0 15px 40px rgba(15, 23, 42, 0.15)', border: '1px solid #E2E8F0',
                    zIndex: 100, overflowY: 'auto', maxHeight: 300,
                    animation: 'fadeInUp 0.2s ease-out'
                  }}>
                    <style>{`
                      @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                      }
                    `}</style>
                    <div style={{ padding: '10px 16px', background: '#F8FAFD', borderBottom: '1px solid #F1F5F9', fontSize: 10, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Suggested Customers
                    </div>
                    {filteredCustomers.map(c => (
                      <div 
                        key={c.name}
                        onClick={() => {
                          setClient(c.name);
                          setLocation(c.location);
                          setShowSuggestions(false);
                        }}
                        style={{ padding: '14px 16px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 12 }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = '#F0F9FF';
                          e.currentTarget.style.paddingLeft = '20px';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = '#fff';
                          e.currentTarget.style.paddingLeft = '16px';
                        }}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EFF6FF', color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <User size={14} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                            <MapPin size={10} /> {c.location}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                  <label style={labelStyle}>Required Workers *</label>
                  <input
                    type="number" min={1} max={20}
                    style={inputStyle}
                    value={workersNeeded}
                    onChange={e => setWorkersNeeded(Number(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Type of work *</label>
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
                        padding: '6px 10px', borderRadius: 10, fontSize: 11, fontWeight: 700,
                        border: '1.5px solid',
                        borderColor: requiredSkills.includes(skill) ? BLUE : '#E2E8F0',
                        background: requiredSkills.includes(skill) ? '#EFF6FF' : '#fff',
                        color: requiredSkills.includes(skill) ? BLUE : '#64748B',
                        cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', gap: 6
                      }}
                    >
                      {requiredSkills.includes(skill) && <CheckCircle2 size={12} />}
                      {skill.charAt(0).toUpperCase() + skill.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={labelStyle}>{t('notes')} (optional)</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 100, resize: 'none' }}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Additional instructions or details..."
                />
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* System Suggested Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 4 }}>
                  <Sparkles size={16} color={ORANGE} />
                  <span style={{ fontSize: 13, fontWeight: 900, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    System Suggested Workers ({assignedWorkers.length})
                  </span>
                </div>
                <div style={{ display: 'grid', gap: 10 }}>
                  {scoredWorkers.slice(0, workersNeeded).map(worker => {
                    const isSelected = assignedWorkers.includes(worker.id);
                    const matchingSkills = worker.skills.filter(s => requiredSkills.includes(s));
                    
                    return (
                      <WorkerCard 
                        key={worker.id}
                        worker={worker}
                        isSelected={isSelected}
                        isSuggested={true}
                        matchingSkills={matchingSkills}
                        onToggle={() => {
                          if (isSelected) setAssignedWorkers(prev => prev.filter(id => id !== worker.id));
                          else setAssignedWorkers(prev => [...prev, worker.id]);
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Other Available Workers Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 4, borderTop: '1px solid #F1F5F9', paddingTop: 16 }}>
                  <User size={16} color="#64748B" />
                  <span style={{ fontSize: 13, fontWeight: 900, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Other Available Workers
                  </span>
                </div>
                <div style={{ display: 'grid', gap: 10 }}>
                  {scoredWorkers.slice(workersNeeded).map(worker => {
                    const isSelected = assignedWorkers.includes(worker.id);
                    const matchingSkills = worker.skills.filter(s => requiredSkills.includes(s));
                    
                    return (
                      <WorkerCard 
                        key={worker.id}
                        worker={worker}
                        isSelected={isSelected}
                        isSuggested={false}
                        matchingSkills={matchingSkills}
                        onToggle={() => {
                          if (isSelected) setAssignedWorkers(prev => prev.filter(id => id !== worker.id));
                          else setAssignedWorkers(prev => [...prev, worker.id]);
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ 
          padding: '20px 32px', 
          borderTop: '1px solid #F1F5F9', 
          display: 'flex', gap: 12,
          background: '#F8FAFD'
        }}>
          {step === 'details' ? (
            <>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1, padding: '12px',
                  border: '1.5px solid #CBD5E1', borderRadius: 12,
                  background: '#fff', cursor: 'pointer',
                  fontSize: 14, fontWeight: 700, color: '#475569',
                }}
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!client.trim() || !location.trim()}
                style={{
                  flex: 2, padding: '12px',
                  border: 'none', borderRadius: 12,
                  background: ORANGE, color: '#fff',
                  cursor: 'pointer', fontSize: 14, fontWeight: 900,
                  boxShadow: '0 10px 20px rgba(245, 158, 11, 0.2)',
                  opacity: (!client.trim() || !location.trim()) ? 0.6 : 1
                }}
              >
                Create order & Select Workers <ChevronRight size={18} style={{ verticalAlign: 'middle', marginLeft: 4 }} />
              </button>
            </>
          ) : (
            <>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
                  Selected: <span style={{ color: BLUE }}>{assignedWorkers.length}</span> / {workersNeeded}
                </div>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={assignedWorkers.length < 1}
                style={{
                  flex: 2, padding: '12px',
                  border: 'none', borderRadius: 12,
                  background: '#16A34A', color: '#fff',
                  cursor: 'pointer', fontSize: 14, fontWeight: 900,
                  boxShadow: '0 10px 20px rgba(22, 163, 74, 0.2)',
                  opacity: assignedWorkers.length < 1 ? 0.6 : 1
                }}
              >
                Confirm & Schedule Order
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
