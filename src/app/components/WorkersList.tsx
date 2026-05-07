import React from 'react';
import { Star, Languages, Briefcase, ChevronRight, User, ShieldCheck } from 'lucide-react';
import type { Worker } from '../types';
import { useLanguage } from '../LanguageContext';
import { BLUE, ORANGE } from '../constants';

interface Props {
  workers: Worker[];
  onWorkerClick: (worker: Worker) => void;
}

export function WorkersList({ workers, onWorkerClick }: Props) {
  const { t } = useLanguage();

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0F1A2A', margin: 0 }}>{t('allWorkers')}</h2>
          <p style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>{workers.length} {t('totalWorkers')}</p>
        </div>
        <button style={{
          background: BLUE, color: '#fff', border: 'none', borderRadius: 12,
          padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 10px 20px rgba(37, 99, 235, 0.15)'
        }}>
          + {t('viewDetail')}
        </button>
      </div>

      <div style={{
        background: '#fff',
        borderRadius: 24,
        border: '1px solid #F1F5F9',
        boxShadow: '0 20px 50px rgba(0,0,0,0.02)',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '80px 250px 1fr 1fr 140px 140px 40px',
          padding: '18px 24px',
          background: '#F8FAFD',
          borderBottom: '1px solid #F1F5F9',
        }}>
          {['ID', t('assignedWorkers'), t('skills'), t('languages'), t('reliability'), t('status'), ''].map((h, i) => (
            <div key={i} style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {workers.map((worker, idx) => {
          const isLast = idx === workers.length - 1;
          return (
            <div
              key={worker.id}
              onClick={() => onWorkerClick(worker)}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 250px 1fr 1fr 140px 140px 40px',
                padding: '16px 24px',
                alignItems: 'center',
                borderBottom: isLast ? 'none' : '1px solid #F8FAFD',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
              onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
            >
              {/* ID */}
              <div style={{ fontSize: 13, fontWeight: 700, color: '#94A3B8' }}>
                #{worker.id}
              </div>

              {/* Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 12,
                  background: BLUE, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, position: 'relative'
                }}>
                  {worker.name[0]}
                  {worker.isSupervisor && (
                    <div title="Supervisor" style={{ position: 'absolute', bottom: -4, right: -4, background: '#16A34A', borderRadius: '50%', border: '2px solid #fff', padding: 2 }}>
                      <ShieldCheck size={10} color="#fff" />
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1E293B' }}>{worker.name}</div>
              </div>

              {/* Skills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {worker.skills.map(s => (
                  <span key={s} style={{
                    fontSize: 10, fontWeight: 700, color: '#475569',
                    background: '#F1F5F9', padding: '3px 8px', borderRadius: 6,
                    textTransform: 'capitalize'
                  }}>{s}</span>
                ))}
              </div>

              {/* Languages */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {worker.languages.map(l => (
                  <span key={l} style={{
                    fontSize: 10, fontWeight: 700, color: BLUE,
                    background: '#EFF6FF', padding: '3px 8px', borderRadius: 6
                  }}>{l}</span>
                ))}
              </div>

              {/* Reliability */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Star 
                    key={i} 
                    size={10} 
                    fill={i <= worker.reliability ? '#F59E0B' : 'transparent'} 
                    color={i <= worker.reliability ? '#F59E0B' : '#E2E8F0'} 
                    strokeWidth={i <= worker.reliability ? 0 : 2.5}
                  />
                ))}
              </div>

              {/* Status */}
              <div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', borderRadius: 10,
                  background: !worker.baseAvailable ? '#FEF2F2' : !worker.available ? '#FFF7ED' : '#F0FDF4',
                  color: !worker.baseAvailable ? '#DC2626' : !worker.available ? '#C2410C' : '#16A34A',
                  fontSize: 11, fontWeight: 800, border: '1px solid currentColor',
                  textTransform: 'uppercase'
                }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
                  {!worker.baseAvailable ? 'Not Available' : !worker.available ? 'Busy' : 'Available'}
                </div>
              </div>

              {/* Arrow */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ChevronRight size={18} style={{ color: '#CBD5E1' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
