import { useState } from 'react';
import { X, UserPlus, Shield, Star, Globe, Briefcase, Plus } from 'lucide-react';
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
      isSupervisor,
      skills: selectedSkills,
      languages: selectedLanguages,
      reliability,
      pastCustomers: pastCustomers.split(',').map(c => c.trim()).filter(c => c !== ''),
      baseAvailable: true
    });
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 480,
      background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(12px)',
      boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
      zIndex: 1000, display: 'flex', flexDirection: 'column',
      borderLeft: '1px solid #F1F5F9',
      animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{ 
        padding: '32px 24px', background: `linear-gradient(135deg, ${BLUE} 0%, #1E3A8A 100%)`, color: '#fff',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserPlus size={24} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900 }}>Add New Worker</div>
              <div style={{ fontSize: 13, opacity: 0.9, fontWeight: 600 }}>Register personnel to the system</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: 12, cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Basic Info */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Full Name</label>
            <input 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Johann Schmidt"
              style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E2E8F0', outline: 'none', fontSize: 15, fontWeight: 600 }}
            />
          </div>

          {/* Supervisor Toggle */}
          <div 
            onClick={() => setIsSupervisor(!isSupervisor)}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', 
              borderRadius: 16, background: isSupervisor ? '#EFF6FF' : '#F8FAFD', border: '1.5px solid',
              borderColor: isSupervisor ? BLUE : '#E2E8F0', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Shield size={20} color={isSupervisor ? BLUE : '#64748B'} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: isSupervisor ? BLUE : '#1E293B' }}>Supervisor Access</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>Can manage teams and view reports</div>
              </div>
            </div>
            <div style={{ width: 44, height: 24, borderRadius: 12, background: isSupervisor ? BLUE : '#CBD5E1', position: 'relative', transition: 'all 0.3s' }}>
              <div style={{ position: 'absolute', top: 4, left: isSupervisor ? 24 : 4, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'all 0.3s' }} />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              <Briefcase size={12} /> Qualifications
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ALL_SKILLS.map(skill => (
                <button 
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  style={{ 
                    padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 800, border: '1.5px solid',
                    background: selectedSkills.includes(skill) ? BLUE : '#fff',
                    color: selectedSkills.includes(skill) ? '#fff' : '#64748B',
                    borderColor: selectedSkills.includes(skill) ? BLUE : '#E2E8F0',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
              <Globe size={12} /> Languages
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ALL_LANGUAGES.map(lang => (
                <button 
                  key={lang}
                  onClick={() => toggleLanguage(lang)}
                  style={{ 
                    padding: '8px 12px', borderRadius: 10, fontSize: 12, fontWeight: 800, border: '1.5px solid',
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
          </div>

          {/* Reliability */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Reliability Score</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star}
                  onClick={() => setReliability(star)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <Star size={24} fill={star <= reliability ? ORANGE : 'none'} color={star <= reliability ? ORANGE : '#CBD5E1'} />
                </button>
              ))}
            </div>
          </div>

          {/* Past Customers */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Past Customers (comma separated)</label>
            <textarea 
              value={pastCustomers}
              onChange={e => setPastCustomers(e.target.value)}
              placeholder="e.g. Raiffeisen Bank, Billa, Hotel Wien"
              style={{ width: '100%', height: 80, padding: '12px 16px', borderRadius: 12, border: '1.5px solid #E2E8F0', outline: 'none', fontSize: 14, fontWeight: 600, resize: 'none' }}
            />
          </div>
        </div>
      </div>

      <div style={{ padding: '24px', background: '#F8FAFD', borderTop: '1px solid #F1F5F9' }}>
        <button 
          onClick={handleSave}
          style={{ 
            width: '100%', padding: '16px', borderRadius: 16, background: BLUE, color: '#fff', 
            border: 'none', fontWeight: 900, fontSize: 15, cursor: 'pointer', boxShadow: `0 8px 20px ${BLUE}33`
          }}
        >
          Confirm & Add Worker
        </button>
      </div>
      
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
