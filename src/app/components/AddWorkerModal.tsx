import { useState } from 'react';
import { X, UserPlus, Shield, Star, Globe, Briefcase, Plus, ArrowLeft, Phone, Mail, Flag, Car, Info } from 'lucide-react';
import type { Worker } from '../types';
import { BLUE, ORANGE } from '../constants';

interface Props {
  onSave: (worker: Omit<Worker, 'available'>) => void;
  onClose: () => void;
}

const ALL_SKILLS = ['general', 'window', 'snow', 'special', 'machine'];
const ALL_LANGUAGES = ['DE', 'EN', 'PL', 'RO', 'TR', 'AR', 'HR', 'SL', 'SV', 'IT'];

export function AddWorkerModal({ onSave, onClose }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('');
  const [canDrive, setCanDrive] = useState(false);
  const [isSupervisor, setIsSupervisor] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['general']);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['DE']);
  const [reliability, setReliability] = useState(5);
  const [pastCustomers, setPastCustomers] = useState('');

  const handleSave = () => {
    if (!name) return;
    onSave({
      id: 'w' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      nationality,
      canDrive,
      isSupervisor,
      skills: selectedSkills,
      languages: selectedLanguages,
      reliability,
      pastCustomers: pastCustomers.split(',').map(c => c.trim()).filter(c => c !== ''),
      baseAvailable: true,
      totalJobs: 0,
      rating: 5.0,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'default'}`
    });
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]);
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
              Add New Worker
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: 14, fontWeight: 600 }}>
              Create a new personnel profile in the system
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
                <Label>Email Address</Label>
                <div style={{ position: 'relative' }}>
                  <input 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="j.schmidt@liman.at"
                    style={inputStyle}
                  />
                  <Mail size={18} style={iconInputStyle} />
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

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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

          {/* Section 2: Skills & Expertise */}
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

            <Label>Past Customers / References</Label>
            <textarea 
              value={pastCustomers}
              onChange={e => setPastCustomers(e.target.value)}
              placeholder="e.g. Raiffeisen Bank, Billa, Hotel Wien"
              style={{ ...inputStyle, height: 100, resize: 'none', paddingTop: 12 }}
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

          <div style={{ background: '#EFF6FF', borderRadius: 24, padding: 24, border: '1px solid #DBEAFE' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800, color: BLUE, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Info size={18} /> Onboarding Tip
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: '#1E3A8A', fontWeight: 600, lineHeight: 1.5 }}>
              Workers with multiple skills and a driver's license are prioritized for complex jobs.
            </p>
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
      <span style={{ fontSize: 13, fontWeight: 800 }}>{value}</span>
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
};

const iconInputStyle: React.CSSProperties = {
  position: 'absolute',
  left: 16,
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#94A3B8'
};
