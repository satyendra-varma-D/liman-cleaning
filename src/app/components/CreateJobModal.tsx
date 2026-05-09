import { useState, useEffect, useMemo } from 'react';
import { X, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, MapPin, User, Users, ArrowLeft, Calendar, Clock, Briefcase, AlertTriangle, RefreshCw, Timer, CloudSun } from 'lucide-react';
import type { Job, JobType, Worker } from '../types';
import { useLanguage } from '../LanguageContext';
import { BLUE, ORANGE } from '../constants';
import { suggestTeam } from '../SuggestionEngine';

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

function WorkerCard({ worker, isSelected, isSuggested, matchingSkills, reasons = [], onToggle }: { 
  worker: Worker; isSelected: boolean; isSuggested: boolean; matchingSkills: string[]; reasons?: string[]; onToggle: () => void 
}) {
  const [showAI, setShowAI] = useState(false);

  return (
    <div 
      style={{
        padding: '16px', borderRadius: 20, border: '1.5px solid',
        borderColor: isSelected ? BLUE : '#F1F5F9',
        background: isSelected ? '#EFF6FF' : '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex', flexDirection: 'column', gap: 12,
        boxShadow: isSelected ? '0 10px 20px rgba(59, 130, 246, 0.08)' : '0 4px 6px rgba(0,0,0,0.02)',
        position: 'relative'
      }}
      onClick={(e) => {
        // Only toggle if not clicking the AI badge
        onToggle();
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative' }}>
          {worker.avatar ? (
            <img 
              src={worker.avatar} 
              alt={worker.name} 
              style={{ width: 56, height: 56, borderRadius: 18, objectFit: 'cover' }} 
            />
          ) : (
            <div style={{ 
              width: 56, height: 56, borderRadius: 18, 
              background: worker.isSupervisor ? '#16A34A' : BLUE, 
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20
            }}>
              {worker.name[0]}
            </div>
          )}
          {worker.isSupervisor && (
            <div style={{ 
              position: 'absolute', bottom: -4, right: -4, background: '#16A34A', color: '#fff', 
              width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #fff', fontSize: 10, fontWeight: 900
            }}>
              S
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1E293B' }}>{worker.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#F59E0B' }}>★</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>{worker.rating || '4.5'}</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{worker.totalJobs || 0} jobs</div>
            <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#CBD5E1' }} />
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{worker.reliability}/5 rel.</div>
          </div>
        </div>

        <div style={{ 
          width: 22, height: 22, borderRadius: '50%', border: '2.5px solid',
          borderColor: isSelected ? BLUE : '#E2E8F0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: isSelected ? BLUE : 'transparent'
        }}>
          {isSelected && <CheckCircle2 size={14} color="#fff" strokeWidth={3} />}
        </div>
      </div>

      {/* AI Reasoning Section */}
      {isSuggested && reasons.length > 0 && (
        <div 
          onClick={(e) => {
            e.stopPropagation();
            setShowAI(!showAI);
          }}
          style={{ 
            marginTop: 4, 
            background: '#F0FDF4', 
            borderRadius: 12, 
            padding: showAI ? '12px' : '6px 12px',
            border: '1px solid #DCFCE7',
            transition: 'all 0.3s'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={12} color="#16A34A" />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#15803D' }}>AI INSIGHT</span>
            </div>
            {!showAI && (
              <div style={{ fontSize: 10, color: '#16A34A', fontWeight: 800 }}>
                {reasons[0]}
              </div>
            )}
          </div>
          
          {showAI && (
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {reasons.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <div style={{ marginTop: 5, width: 4, height: 4, borderRadius: '50%', background: '#16A34A' }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#166534', lineHeight: 1.4 }}>{r}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!isSuggested && (
        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
          {worker.skills.map(s => (
            <span key={s} style={{ 
              fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 6,
              background: matchingSkills.includes(s) ? '#DBEAFE' : '#F8FAFC',
              color: matchingSkills.includes(s) ? BLUE : '#94A3B8',
              textTransform: 'uppercase'
            }}>
              {s}
            </span>
          ))}
        </div>
      )}
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
  const [isRecurring, setIsRecurring]     = useState(job?.isRecurring ?? false);
  const [priority, setPriority]           = useState<'high' | 'medium' | 'low'>(job?.priority ?? 'medium');
  const [estimatedDuration, setEstimatedDuration] = useState(job?.estimatedDuration ?? '');
  const [isWeatherDependent, setIsWeatherDependent] = useState(job?.isWeatherDependent ?? false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const isEdit = !!job;

  const suggestionResults = useMemo(() => {
    const dummyJob: Job = {
      id: job?.id || 'temp',
      client,
      location,
      date,
      time,
      workersNeeded,
      assignedWorkers,
      type,
      status: 'pending',
      requiredSkills,
      needsGermanSpeaker: true,
      isWeatherDependent,
      isRecurring,
      priority,
      estimatedDuration,
      notes,
    };

    return suggestTeam(dummyJob, workers, new Set());
  }, [workers, client, requiredSkills, workersNeeded, isRecurring, priority]);

  const recommendedIds = useMemo(() => suggestionResults.recommendedTeam.map(t => t.worker.id), [suggestionResults]);

  useEffect(() => {
    if (initialStep) {
      setStep(initialStep);
    }
  }, [initialStep]);

  useEffect(() => {
    if (step === 'workers' && assignedWorkers.length === 0) {
      setAssignedWorkers(recommendedIds);
    }
  }, [step, recommendedIds]);

  useEffect(() => {
    if (!job && type) {
      setRequiredSkills([type]);
    }
  }, [type, job]);

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
      isWeatherDependent,
      isRecurring,
      priority,
      estimatedDuration,
    });
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
              {isEdit ? t('edit') : t('createJob')}
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: 14, fontWeight: 600 }}>
              {step === 'details' ? 'Step 1: Order details & requirements' : 'Step 2: Assign workers'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {step === 'workers' && (
            <button
              onClick={() => setStep('details')}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#fff', border: '1.5px solid #E2E8F0',
                borderRadius: 14, padding: '12px 24px',
                cursor: 'pointer', fontSize: 15, fontWeight: 700, color: '#1E293B',
              }}
            >
              <ChevronLeft size={18} /> Back to Details
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={step === 'details' ? (!client.trim() || !location.trim()) : assignedWorkers.length < 1}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: step === 'details' ? BLUE : '#16A34A',
              color: '#fff', border: 'none',
              borderRadius: 14, padding: '12px 24px',
              cursor: 'pointer', fontSize: 15, fontWeight: 700,
              boxShadow: `0 10px 20px ${step === 'details' ? 'rgba(37, 99, 235, 0.2)' : 'rgba(22, 163, 74, 0.2)'}`,
              opacity: (step === 'details' ? (!client.trim() || !location.trim()) : assignedWorkers.length < 1) ? 0.6 : 1
            }}
          >
            {step === 'details' ? 'Next: Select Workers' : 'Confirm & Schedule Order'} 
            {step === 'details' && <ChevronRight size={18} />}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: step === 'details' ? '1fr 380px' : '1fr', gap: 24, alignItems: 'start' }}>
        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {step === 'details' ? (
            <div style={{ 
              background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #F1F5F9',
              boxShadow: '0 20px 50px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EFF6FF', color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={18} />
                </div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1E293B' }}>Core Information</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                {/* Client */}
                <div style={{ position: 'relative' }}>
                  <label style={labelStyle}>{t('client')} *</label>
                  <input
                    style={{
                      ...inputStyle,
                      borderColor: (!client.trim()) ? '#EF4444' : '#E2E8F0',
                      background: (!client.trim()) ? '#FEF2F2' : '#F8FAFD'
                    }}
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
                  {!client.trim() && (
                    <div style={{ position: 'absolute', right: 12, top: 38, color: '#EF4444' }}>
                      <AlertTriangle size={16} />
                    </div>
                  )}
                  {showSuggestions && filteredCustomers.length > 0 && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0,
                      background: '#fff', borderRadius: 14, marginTop: 8,
                      boxShadow: '0 15px 40px rgba(15, 23, 42, 0.15)', border: '1px solid #E2E8F0',
                      zIndex: 100, overflowY: 'auto', maxHeight: 300
                    }}>
                      {filteredCustomers.map(c => (
                        <div 
                          key={c.name}
                          onClick={() => {
                            setClient(c.name);
                            setLocation(c.location);
                            setShowSuggestions(false);
                          }}
                          style={{ padding: '14px 16px', cursor: 'pointer', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 12 }}
                        >
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>{c.name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label style={labelStyle}>{t('location')} *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      style={{
                        ...inputStyle,
                        borderColor: (!location.trim()) ? '#EF4444' : '#E2E8F0',
                        background: (!location.trim()) ? '#FEF2F2' : '#F8FAFD'
                      }}
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="e.g. Mariahilfer Str. 77, Vienna"
                      required
                    />
                    {!location.trim() && (
                      <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#EF4444' }}>
                        <AlertTriangle size={16} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label style={labelStyle}>{t('date')}</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input type="date" style={{ ...inputStyle, paddingLeft: 44 }} value={date} onChange={e => setDate(e.target.value)} required />
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label style={labelStyle}>{t('time')}</label>
                  <div style={{ position: 'relative' }}>
                    <Clock size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input type="time" style={{ ...inputStyle, paddingLeft: 44 }} value={time} onChange={e => setTime(e.target.value)} required />
                  </div>
                </div>

                {/* Workers Needed */}
                <div>
                  <label style={labelStyle}>Workers Needed *</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input type="number" min={1} style={{ ...inputStyle, paddingLeft: 44 }} value={workersNeeded} onChange={e => setWorkersNeeded(Number(e.target.value))} required />
                  </div>
                </div>

                {/* Job Type */}
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

                {/* Estimated Duration */}
                <div>
                  <label style={labelStyle}>Estimated Duration *</label>
                  <div style={{ position: 'relative' }}>
                    <Timer size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                    <input 
                      type="text" 
                      style={{ ...inputStyle, paddingLeft: 44 }} 
                      value={estimatedDuration} 
                      onChange={e => setEstimatedDuration(e.target.value)} 
                      placeholder="e.g. 4 hours"
                      required 
                    />
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label style={labelStyle}>Priority</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {(['low', 'medium', 'high'] as const).map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        style={{
                          flex: 1, padding: '10px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                          border: '1.5px solid',
                          borderColor: priority === p ? (p === 'high' ? '#EF4444' : p === 'medium' ? ORANGE : BLUE) : '#E2E8F0',
                          background: priority === p ? (p === 'high' ? '#FEF2F2' : p === 'medium' ? '#FFF7ED' : '#EFF6FF') : '#fff',
                          color: priority === p ? (p === 'high' ? '#DC2626' : p === 'medium' ? '#C2410C' : BLUE) : '#64748B',
                          cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize'
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Switches Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 40, paddingTop: 32, borderTop: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Toggle active={isRecurring} onToggle={() => setIsRecurring(!isRecurring)} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <RefreshCw size={14} color="#64748B" /> Recurring Work
                    </div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Scheduled periodically</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Toggle active={isWeatherDependent} onToggle={() => setIsWeatherDependent(!isWeatherDependent)} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CloudSun size={14} color="#64748B" /> Weather Dependent
                    </div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Affected by conditions</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 22, borderRadius: 20, background: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', marginLeft: 18 }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#1E293B' }}>German Required</div>
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>Mandatory for this team</div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid #F1F5F9' }}>
                <label style={labelStyle}>Required Skills</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {allSkills.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      style={{
                        padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700,
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

              {/* Notes */}
              <div style={{ marginTop: 40 }}>
                <label style={labelStyle}>{t('notes')} (optional)</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 120, resize: 'none', background: '#F8FAFD' }}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Additional instructions or details..."
                />
              </div>
            </div>
          ) : (
            <div style={{ 
              background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #F1F5F9',
              boxShadow: '0 20px 50px rgba(0,0,0,0.02)'
            }}>
              {/* Personnel Selection Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {/* System Suggested Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FFF7ED', color: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Sparkles size={18} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1E293B' }}>
                      System Suggested Workers
                    </h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
                    {suggestionResults.recommendedTeam.map(({ worker, reasons }) => (
                      <WorkerCard 
                        key={worker.id}
                        worker={worker}
                        isSelected={assignedWorkers.includes(worker.id)}
                        isSuggested={true}
                        reasons={reasons}
                        matchingSkills={worker.skills.filter(s => requiredSkills.includes(s))}
                        onToggle={() => {
                          if (assignedWorkers.includes(worker.id)) setAssignedWorkers(prev => prev.filter(id => id !== worker.id));
                          else setAssignedWorkers(prev => [...prev, worker.id]);
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Other Available Workers Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F8FAFD', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={18} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1E293B' }}>
                      Other Available Workers
                    </h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
                    {workers
                      .filter(w => !recommendedIds.includes(w.id))
                      .map(worker => (
                      <WorkerCard 
                        key={worker.id}
                        worker={worker}
                        isSelected={assignedWorkers.includes(worker.id)}
                        isSuggested={false}
                        matchingSkills={worker.skills.filter(s => requiredSkills.includes(s))}
                        onToggle={() => {
                          if (assignedWorkers.includes(worker.id)) setAssignedWorkers(prev => prev.filter(id => id !== worker.id));
                          else setAssignedWorkers(prev => [...prev, worker.id]);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info Card (Only in Details step) */}
        {step === 'details' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ 
              background: BLUE, borderRadius: 24, padding: 24, color: '#fff',
              boxShadow: '0 20px 40px rgba(37, 99, 235, 0.15)'
            }}>
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Live Summary</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <SummaryItem label="Personnel" value={`${workersNeeded} Workers`} />
                <SummaryItem label="Language" value="German Mandatory" />
                <SummaryItem label="Priority" value={priority.toUpperCase()} />
                <SummaryItem label="Recurring" value={isRecurring ? 'Yes' : 'No'} />
              </div>
            </div>

            <div style={{ 
              background: '#FEF2F2', borderRadius: 24, padding: 24, border: '1px solid #FEE2E2',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <AlertTriangle size={18} color="#DC2626" />
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#991B1B' }}>Important</h4>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#991B1B', lineHeight: 1.5, fontWeight: 600 }}>
                Ensure all required skills are selected to get the best worker matches in the next step.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 8 }}>
      <span style={{ fontSize: 12, opacity: 0.8, fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 800 }}>{value}</span>
    </div>
  );
}
