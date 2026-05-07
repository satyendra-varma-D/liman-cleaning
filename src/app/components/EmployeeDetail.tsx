import React from 'react';
import { ArrowLeft, Edit2, Mail, Phone, Calendar, Briefcase, Star, MapPin, Clock, ChevronRight } from 'lucide-react';
import type { Worker, Job } from '../types';
import { useLanguage } from '../LanguageContext';
import { BLUE, ORANGE, JOB_TYPE_COLORS } from '../constants';

interface Props {
  worker: Worker;
  assignedJobs: Job[];
  onBack: () => void;
  onJobClick: (job: Job) => void;
}

export function EmployeeDetail({ worker, assignedJobs, onBack, onJobClick }: Props) {
  const { t } = useLanguage();

  return (
    <div style={{ width: '100%', maxWidth: 1400, margin: '0 auto', padding: '16px 24px' }}>
      {/* Navigation Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button
            onClick={onBack}
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
            <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.03em' }}>{worker.name}</h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: 14, fontWeight: 600 }}>{t('workerDetails')} ID: {worker.id}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#fff', border: '1.5px solid #E2E8F0',
              borderRadius: 14, padding: '12px 24px',
              cursor: 'pointer', fontSize: 15, fontWeight: 700, color: '#1E293B'
            }}
          >
            <Edit2 size={18} /> {t('edit')}
          </button>
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: BLUE, color: '#fff', border: 'none',
              borderRadius: 14, padding: '12px 24px',
              cursor: 'pointer', fontSize: 15, fontWeight: 700,
              boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)'
            }}
          >
            <Phone size={18} /> {t('contactInfo')}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Left Column: Profile Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ 
            background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #F1F5F9',
            boxShadow: '0 20px 50px rgba(0,0,0,0.02)', textAlign: 'center'
          }}>
            <div style={{ 
              width: 100, height: 100, borderRadius: 32, background: BLUE, color: '#fff',
              margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, fontWeight: 700, position: 'relative'
            }}>
              {worker.name[0]}
              {worker.isSupervisor && (
                <div title="Supervisor" style={{ position: 'absolute', bottom: -10, right: -10, background: '#16A34A', borderRadius: '50%', border: '4px solid #fff', padding: 4 }}>
                  <Star size={16} color="#fff" fill="#fff" />
                </div>
              )}
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>{worker.name}</h2>
            {worker.isSupervisor && (
               <div style={{ fontSize: 12, fontWeight: 800, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Supervisor</div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginBottom: 24 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={16} fill={i <= worker.reliability ? '#F59E0B' : 'transparent'} color={i <= worker.reliability ? '#F59E0B' : '#E2E8F0'} strokeWidth={i <= worker.reliability ? 0 : 2} />
              ))}
              <span style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8', marginLeft: 4 }}>{worker.reliability}.0</span>
            </div>

            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 24, textAlign: 'left' }}>
              <ProfileInfo icon={<Mail size={16} />} label="Email" value={worker.name.toLowerCase().replace(' ', '.') + '@liman-services.at'} />
              <ProfileInfo icon={<Phone size={16} />} label={t('contactInfo')} value="+43 664 123 45 67" />
              <ProfileInfo icon={<MapPin size={16} />} label={t('location')} value="Vienna, Austria" />
            </div>
          </div>

          <div style={{ 
            background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #F1F5F9',
            boxShadow: '0 20px 50px rgba(0,0,0,0.02)'
          }}>
             <h3 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 700, color: '#1E293B' }}>{t('qualifications')}</h3>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {worker.skills.map(s => (
                   <span key={s} style={{ background: '#F1F5F9', color: '#475569', padding: '6px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}>{s}</span>
                ))}
             </div>
             <h3 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 700, color: '#1E293B' }}>Client History</h3>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {worker.pastCustomers.map(c => (
                   <span key={c} style={{ background: '#F0FDF4', color: '#166534', padding: '6px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}>{c}</span>
                ))}
             </div>
             <h3 style={{ margin: '0 0 20px 0', fontSize: 18, fontWeight: 700, color: '#1E293B' }}>{t('languages')}</h3>
             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {worker.languages.map(l => (
                   <span key={l} style={{ background: '#FFF7ED', color: '#C2410C', padding: '6px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700, border: '1px solid #FFEDD5' }}>{l}</span>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column: Deployment History / Upcoming Jobs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ 
            background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #F1F5F9',
            boxShadow: '0 20px 50px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1E293B' }}>{t('orderHistory')}</h3>
                <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontWeight: 600 }}>{t('active')} deployments</p>
              </div>
              <div style={{ 
                background: '#F0FDF4', color: '#16A34A', padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700
              }}>
                {assignedJobs.length} {t('jobsCount')}
              </div>
            </div>

            {assignedJobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', background: '#F8FAFD', borderRadius: 20 }}>
                <Briefcase size={32} color="#94A3B8" style={{ marginBottom: 12 }} />
                <div style={{ fontWeight: 700, color: '#64748B' }}>{t('noJobsToday')}</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {assignedJobs.map(job => {
                  const typeStyle = JOB_TYPE_COLORS[job.type];
                  return (
                    <div 
                      key={job.id} 
                      onClick={() => onJobClick(job)}
                      style={{ 
                        padding: '20px 24px', borderRadius: 20, border: '1px solid #F1F5F9', background: '#F9FAFB',
                        display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer', transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = BLUE)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = '#F1F5F9')}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 16, fontWeight: 700, color: '#1E293B' }}>{job.client}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: typeStyle.color, background: typeStyle.bg, padding: '2px 8px', borderRadius: 6 }}>
                            {job.type.toUpperCase()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#64748B' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={13} /> {job.date}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} /> {job.time}</span>
                        </div>
                      </div>
                      <ChevronRight size={18} color="#CBD5E1" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Performance Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <StatCard label={t('totalJobs')} value="142" color={BLUE} />
            <StatCard label={t('reliability')} value="98%" color="#16A34A" />
            <StatCard label={t('skills')} value="2.4y" color={ORANGE} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileInfo({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <div style={{ color: '#94A3B8' }}>{icon}</div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{value}</div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ 
      background: '#fff', borderRadius: 24, padding: 24, border: '1px solid #F1F5F9',
      boxShadow: '0 10px 30px rgba(0,0,0,0.02)', textAlign: 'center'
    }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  );
}
