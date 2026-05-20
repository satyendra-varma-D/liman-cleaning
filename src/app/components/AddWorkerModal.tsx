import { useState } from 'react';
import { X, UserPlus, Shield, Plus, ArrowLeft, Phone, Flag, Car, Check, Briefcase } from 'lucide-react';
import type { Worker, Client } from '../types';
import { BLUE, ORANGE } from '../constants';

interface Props {
  worker?: Worker | null;
  clients: Client[];
  onSave: (worker: Omit<Worker, 'available'>) => void;
  onClose: () => void;
}

const ALL_SKILLS = ['general', 'window', 'snow', 'special', 'machine'];
const ALL_LANGUAGES = ['DE', 'EN', 'PL', 'RO', 'TR', 'AR', 'HR', 'SL', 'SV', 'IT'];

export function AddWorkerModal({ worker, clients, onSave, onClose }: Props) {
  const [name, setName] = useState(worker ? worker.name : '');
  const [phone, setPhone] = useState(worker ? worker.phone || '' : '');
  const [nationality, setNationality] = useState(worker ? worker.nationality || '' : '');
  const [canDrive, setCanDrive] = useState(worker ? worker.canDrive || false : false);
  const [isSupervisor, setIsSupervisor] = useState(worker ? worker.isSupervisor || false : false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(worker ? worker.skills : ['general']);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(worker ? worker.languages : ['DE']);
  const [reliability, setReliability] = useState(worker ? worker.reliability : 5);
  const [pastCustomers, setPastCustomers] = useState<string[]>(worker ? worker.pastCustomers || [] : []);
  const [tags, setTags] = useState(worker ? (worker.tags || []).join(', ') : '');

  // New Fields
  const [employeeType, setEmployeeType] = useState<'permanent' | 'temporary'>(worker ? worker.employeeType || 'permanent' : 'permanent');
  const [availabilityStart, setAvailabilityStart] = useState(worker ? worker.availabilityStart || '' : '');
  const [availabilityEnd, setAvailabilityEnd] = useState(worker ? worker.availabilityEnd || '' : '');
  const [workType, setWorkType] = useState<'recurring' | 'adhoc'>(worker ? worker.workType || 'adhoc' : 'adhoc');
  const [recurringDays, setRecurringDays] = useState<string[]>(worker ? worker.recurringDays || [] : []);
  const [recurringStart, setRecurringStart] = useState(() => {
    if (worker && worker.recurringTimeSlot && worker.recurringTimeSlot.includes(' - ')) {
      return worker.recurringTimeSlot.split(' - ')[0];
    }
    return '08:00';
  });
  const [recurringEnd, setRecurringEnd] = useState(() => {
    if (worker && worker.recurringTimeSlot && worker.recurringTimeSlot.includes(' - ')) {
      return worker.recurringTimeSlot.split(' - ')[1];
    }
    return '16:00';
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState('');

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const togglePastCustomer = (clientName: string) => {
    setPastCustomers(prev => 
      prev.includes(clientName) 
        ? prev.filter(c => c !== clientName) 
        : [...prev, clientName]
    );
  };

  const handleSave = () => {
    if (!name) return;
    onSave({
      id: worker ? worker.id : 'w' + Math.random().toString(36).substr(2, 9),
      name,
      phone,
      nationality,
      canDrive,
      isSupervisor,
      skills: selectedSkills,
      languages: selectedLanguages,
      reliability,
      pastCustomers,
      tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      baseAvailable: worker ? worker.baseAvailable : true,
      totalJobs: worker ? worker.totalJobs || 0 : 0,
      rating: worker ? worker.rating || 5.0 : 5.0,
      avatar: worker ? worker.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'default'}`,
      employeeType,
      availabilityStart: employeeType === 'temporary' ? availabilityStart : undefined,
      availabilityEnd: employeeType === 'temporary' ? availabilityEnd : undefined,
      workType,
      recurringDays: workType === 'recurring' ? recurringDays : undefined,
      recurringTimeSlot: workType === 'recurring' ? `${recurringStart} - ${recurringEnd}` : undefined,
    });
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]);
  };

  return (
    <div style={{ width: '100%', maxWidth: 1400, margin: '0 auto', padding: '16px 24px', boxSizing: 'border-box' }}>
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
              {worker ? 'Edit Worker Profile' : 'Add New Worker'}
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: 14, fontWeight: 600 }}>
              {worker ? `Modify details for ${worker.name}` : 'Create a new personnel profile in the system'}
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
            style={{
              padding: '12px 32px', borderRadius: 14,
              background: BLUE, color: '#fff', border: 'none',
              fontSize: 15, fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)'
            }}
          >
            Save Worker Profile
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>
        
        {/* Left Column: Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Section 1: Basic Identity */}
          <div style={{ background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: 18, fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 10 }}>
              <UserPlus size={20} color={BLUE} /> Identity & Contact
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <Label>Full Name</Label>
                <div style={{ position: 'relative' }}>
                  <input 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Johann Schmidt"
                    style={inputStyle}
                  />
                  <UserPlus size={18} style={iconInputStyle} />
                </div>
              </div>

              <div>
                <Label>Phone Number</Label>
                <div style={{ position: 'relative' }}>
                  <input 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+43 664 1234567"
                    style={inputStyle}
                  />
                  <Phone size={18} style={iconInputStyle} />
                </div>
              </div>

              <div>
                <Label>Nationality</Label>
                <div style={{ position: 'relative' }}>
                  <input 
                    value={nationality}
                    onChange={e => setNationality(e.target.value)}
                    placeholder="e.g. Austrian"
                    style={inputStyle}
                  />
                  <Flag size={18} style={iconInputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, gridColumn: 'span 2' }}>
                <div 
                  onClick={() => setCanDrive(!canDrive)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                    padding: '12px 20px', borderRadius: 12, border: '1.5px solid',
                    borderColor: canDrive ? BLUE : '#E2E8F0',
                    background: canDrive ? '#EFF6FF' : '#fff', transition: 'all 0.2s',
                    width: '100%'
                  }}
                >
                  <Car size={18} color={canDrive ? BLUE : '#64748B'} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: canDrive ? BLUE : '#475569' }}>Can Drive</span>
                  <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: 6, border: '2px solid', borderColor: canDrive ? BLUE : '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: canDrive ? BLUE : 'transparent' }}>
                    {canDrive && <Plus size={14} color="#fff" strokeWidth={4} />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Employment Details */}
          <div style={{ background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: 18, fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Briefcase size={20} color={BLUE} /> Employment & Availability
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              {/* Permanent vs Temporary */}
              <div>
                <Label>Employee Type</Label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => setEmployeeType('permanent')}
                    style={{
                      flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid',
                      borderColor: employeeType === 'permanent' ? BLUE : '#E2E8F0',
                      background: employeeType === 'permanent' ? '#EFF6FF' : '#fff',
                      color: employeeType === 'permanent' ? BLUE : '#64748B',
                      fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    Permanent
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmployeeType('temporary')}
                    style={{
                      flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid',
                      borderColor: employeeType === 'temporary' ? BLUE : '#E2E8F0',
                      background: employeeType === 'temporary' ? '#EFF6FF' : '#fff',
                      color: employeeType === 'temporary' ? BLUE : '#64748B',
                      fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    Temporary
                  </button>
                </div>
              </div>

              {/* Recurring vs Adhoc */}
              <div>
                <Label>Work Preference</Label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => setWorkType('adhoc')}
                    style={{
                      flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid',
                      borderColor: workType === 'adhoc' ? BLUE : '#E2E8F0',
                      background: workType === 'adhoc' ? '#EFF6FF' : '#fff',
                      color: workType === 'adhoc' ? BLUE : '#64748B',
                      fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    Adhoc Work
                  </button>
                  <button
                    type="button"
                    onClick={() => setWorkType('recurring')}
                    style={{
                      flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid',
                      borderColor: workType === 'recurring' ? BLUE : '#E2E8F0',
                      background: workType === 'recurring' ? '#EFF6FF' : '#fff',
                      color: workType === 'recurring' ? BLUE : '#64748B',
                      fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    Recurring Work
                  </button>
                </div>
              </div>
            </div>

            {/* If Temporary: Start & End Dates */}
            {employeeType === 'temporary' && (
              <div style={{ 
                background: '#F8FAFD', borderRadius: 16, padding: 20, 
                border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '1fr 1fr', 
                gap: 16, marginBottom: 24
              }}>
                <div>
                  <Label>Availability Start Date</Label>
                  <input 
                    type="date"
                    value={availabilityStart}
                    onChange={e => setAvailabilityStart(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 16 }}
                  />
                </div>
                <div>
                  <Label>Availability End Date</Label>
                  <input 
                    type="date"
                    value={availabilityEnd}
                    onChange={e => setAvailabilityEnd(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 16 }}
                  />
                </div>
              </div>
            )}

            {/* If Recurring: Days and Slots */}
            {workType === 'recurring' && (
              <div style={{ 
                background: '#F8FAFD', borderRadius: 16, padding: 20, 
                border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', 
                gap: 16, marginBottom: 24
              }}>
                <div>
                  <Label>Recurring Days (Monday to Friday)</Label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                      const isSelected = recurringDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            setRecurringDays(prev => 
                              prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
                            );
                          }}
                          style={{
                            padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 800,
                            border: '1.5px solid',
                            borderColor: isSelected ? BLUE : '#CBD5E1',
                            background: isSelected ? BLUE : '#fff',
                            color: isSelected ? '#fff' : '#475569',
                            cursor: 'pointer', transition: 'all 0.15s'
                          }}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label>Preferred Time Range</Label>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <input 
                        type="time"
                        value={recurringStart}
                        onChange={e => setRecurringStart(e.target.value)}
                        style={{ 
                          width: '100%', padding: '12px 14px', borderRadius: 12,
                          border: '1.5px solid #CBD5E1', fontSize: 14, fontWeight: 700,
                          color: '#1E293B', outline: 'none', boxSizing: 'border-box'
                        }}
                      />
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', position: 'absolute', top: -8, left: 10, background: '#F8FAFD', padding: '0 4px' }}>START TIME</span>
                    </div>
                    <span style={{ fontWeight: 800, color: '#64748B' }}>to</span>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <input 
                        type="time"
                        value={recurringEnd}
                        onChange={e => setRecurringEnd(e.target.value)}
                        style={{ 
                          width: '100%', padding: '12px 14px', borderRadius: 12,
                          border: '1.5px solid #CBD5E1', fontSize: 14, fontWeight: 700,
                          color: '#1E293B', outline: 'none', boxSizing: 'border-box'
                        }}
                      />
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', position: 'absolute', top: -8, left: 10, background: '#F8FAFD', padding: '0 4px' }}>END TIME</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Skills & Expertise */}
          <div style={{ background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: 18, fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Briefcase size={20} color={BLUE} /> Skills & Experience
            </h2>

            <Label>Worker Skills (Select all that apply)</Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 24 }}>
              {ALL_SKILLS.map(skill => (
                <button 
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  style={{ 
                    padding: '10px 20px', borderRadius: 12, fontSize: 13, fontWeight: 800, border: '1.5px solid',
                    background: selectedSkills.includes(skill) ? BLUE : '#fff',
                    color: selectedSkills.includes(skill) ? '#fff' : '#64748B',
                    borderColor: selectedSkills.includes(skill) ? BLUE : '#E2E8F0',
                    cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize'
                  }}
                >
                  {skill}
                </button>
              ))}
            </div>

            <Label>Languages</Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {ALL_LANGUAGES.map(lang => (
                <button 
                  key={lang}
                  onClick={() => toggleLanguage(lang)}
                  style={{ 
                    padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 800, border: '1.5px solid',
                    background: selectedLanguages.includes(lang) ? '#1E293B' : '#fff',
                    color: selectedLanguages.includes(lang) ? '#fff' : '#64748B',
                    borderColor: selectedLanguages.includes(lang) ? '#1E293B' : '#E2E8F0',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Multiselection dropdown for pastWorkedWith / pastCustomers */}
            <Label>Past Worked With (Clients)</Label>
            <div style={{ position: 'relative', marginBottom: 24 }}>
              {/* Selected Chips */}
              <div style={{ 
                display: 'flex', flexWrap: 'wrap', gap: 8, padding: '10px 14px', 
                border: '1.5px solid #E2E8F0', borderRadius: 14, minHeight: 48,
                background: '#fff', cursor: 'pointer', alignItems: 'center'
              }} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                {pastCustomers.length === 0 ? (
                  <span style={{ color: '#94A3B8', fontSize: 14, fontWeight: 600 }}>Select clients...</span>
                ) : (
                  pastCustomers.map(clientName => (
                    <span key={clientName} style={{ 
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: '#EFF6FF', color: BLUE, padding: '4px 10px', 
                      borderRadius: 8, fontSize: 12, fontWeight: 700, border: '1px solid #DBEAFE'
                    }}>
                      {clientName}
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); togglePastCustomer(clientName); }}
                        style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', color: BLUE, display: 'flex', alignItems: 'center' }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))
                )}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', color: '#94A3B8' }}>
                  <Briefcase size={16} />
                </div>
              </div>

              {/* Dropdown List */}
              {isDropdownOpen && (
                <>
                  <div 
                    style={{ position: 'fixed', inset: 0, zIndex: 998 }} 
                    onClick={() => setIsDropdownOpen(false)} 
                  />
                  <div style={{ 
                    position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8,
                    background: '#fff', border: '1px solid #E2E8F0', borderRadius: 16,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)', zIndex: 999, maxHeight: 250,
                    overflowY: 'auto', padding: 8
                  }}>
                    <input 
                      type="text"
                      value={clientSearch}
                      onChange={e => setClientSearch(e.target.value)}
                      placeholder="Search clients..."
                      onClick={e => e.stopPropagation()}
                      style={{ 
                        width: '100%', padding: '10px 14px', borderRadius: 10,
                        border: '1.5px solid #F1F5F9', outline: 'none', fontSize: 13,
                        fontWeight: 600, color: '#1E293B', marginBottom: 8, boxSizing: 'border-box'
                      }}
                    />
                    {filteredClients.length === 0 ? (
                      <div style={{ padding: '12px', fontSize: 13, color: '#94A3B8', textAlign: 'center', fontWeight: 600 }}>
                        No clients found
                      </div>
                    ) : (
                      filteredClients.map(c => {
                        const isSelected = pastCustomers.includes(c.name);
                        return (
                          <div 
                            key={c.id}
                            onClick={() => togglePastCustomer(c.name)}
                            style={{ 
                              padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                              color: isSelected ? BLUE : '#475569',
                              background: isSelected ? '#EFF6FF' : 'transparent',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              transition: 'all 0.15s'
                            }}
                            onMouseEnter={e => {
                              if (!isSelected) e.currentTarget.style.background = '#F8FAFD';
                            }}
                            onMouseLeave={e => {
                              if (!isSelected) e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <span>{c.name}</span>
                            {isSelected && <Check size={14} strokeWidth={3} />}
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              )}
            </div>

            <Label>AI Optimization Tags (Comma separated)</Label>
            <textarea 
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="e.g. early-bird, heavy-lifting, industrial-specialist, polite"
              style={{ ...inputStyle, height: 80, resize: 'none', paddingTop: 12, paddingLeft: 16 }}
            />
          </div>
        </div>

        {/* Right Column: Live Summary & Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Live Profile Summary */}
          <div style={{ 
            background: BLUE, borderRadius: 24, padding: 24, color: '#fff',
            boxShadow: '0 20px 40px rgba(37, 99, 235, 0.15)'
          }}>
            <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Live Profile Summary</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, background: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: '#fff', color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                {name ? name[0] : '?'}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800 }}>{name || 'Worker Name'}</div>
                <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 600 }}>{isSupervisor ? 'Supervisor' : 'Standard Staff'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SummaryItem label="Skills" value={`${selectedSkills.length} assigned`} />
              <SummaryItem label="Languages" value={`${selectedLanguages.length} spoken`} />
              <SummaryItem label="Driver" value={canDrive ? 'Yes' : 'No'} />
              <SummaryItem label="Employee Type" value={employeeType} />
              <SummaryItem label="Work Preference" value={workType} />
              <SummaryItem label="Reliability" value={`${reliability}/5 Rating`} />
            </div>
          </div>

          {/* Role Section */}
          <div style={{ background: '#fff', borderRadius: 24, padding: 32, border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
            <h2 style={{ margin: '0 0 24px 0', fontSize: 16, fontWeight: 800, color: '#1E293B' }}>Role & Access</h2>
            
            <div 
              onClick={() => setIsSupervisor(!isSupervisor)}
              style={{ 
                padding: '20px', borderRadius: 20, 
                background: isSupervisor ? '#F0FDF4' : '#F8FAFD', 
                border: '2px solid', borderColor: isSupervisor ? '#16A34A' : '#E2E8F0',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: isSupervisor ? '#16A34A' : '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Shield size={20} />
                </div>
                <div style={{ width: 44, height: 24, borderRadius: 12, background: isSupervisor ? '#16A34A' : '#CBD5E1', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 3, left: isSupervisor ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'all 0.3s' }} />
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 900, color: isSupervisor ? '#166534' : '#1E293B' }}>Supervisor Access</div>
              <p style={{ margin: '6px 0 0 0', fontSize: 12, color: isSupervisor ? '#166534' : '#64748B', fontWeight: 600, lineHeight: 1.4 }}>
                Can lead teams and manage onsite operations.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 8 }}>
      <span style={{ fontSize: 12, opacity: 0.8, fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 800, textTransform: 'capitalize' }}>{value}</span>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', fontSize: 12, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px 14px 44px',
  borderRadius: 14,
  border: '1.5px solid #E2E8F0',
  outline: 'none',
  fontSize: 15,
  fontWeight: 600,
  color: '#1E293B',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box'
};

const iconInputStyle: React.CSSProperties = {
  position: 'absolute',
  left: 16,
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#94A3B8'
};
