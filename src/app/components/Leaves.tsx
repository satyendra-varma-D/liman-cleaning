import React, { useState, useMemo } from 'react';
import { Plane, Plus, Search, Calendar, Trash2 } from 'lucide-react';
import type { Worker, Job } from '../types';
import { BLUE } from '../constants';

interface Props {
  workers: Worker[];
  jobs: Job[];
  onAddLeave: () => void;
  onRemoveLeave: (workerId: string, date: string) => void;
}

export function Leaves({ workers, jobs, onAddLeave, onRemoveLeave }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  // Flat list of all leaves
  const allLeaves = useMemo(() => {
    const list: { worker: Worker; date: string }[] = [];
    workers.forEach(w => {
      (w.leaves || []).forEach(date => {
        list.push({ worker: w, date });
      });
    });
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }, [workers]);

  const filteredLeaves = allLeaves.filter(l => 
    l.worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.date.includes(searchTerm)
  );

  return (
    <div style={{ padding: '10px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Personnel Leaves</h2>
          <p style={{ fontSize: 14, color: '#64748B', marginTop: 4, fontWeight: 600 }}>Manage worker absences and vacation schedules</p>
        </div>
        <button 
          onClick={onAddLeave}
          style={{
            background: BLUE, color: '#fff', border: 'none', borderRadius: 14,
            padding: '12px 24px', fontSize: 14, fontWeight: 800, cursor: 'pointer',
            boxShadow: `0 10px 20px ${BLUE}33`, display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all 0.2s'
          }}
        >
          <Plus size={20} strokeWidth={2.5} /> Register Leave
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by worker name or date..."
            style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: 16, border: '1.5px solid #E2E8F0', outline: 'none', fontSize: 15, fontWeight: 600 }}
          />
        </div>
      </div>

      {/* Table Content */}
      <div style={{ background: '#fff', borderRadius: 24, border: '1px solid #F1F5F9', boxShadow: '0 20px 50px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 100px', padding: '18px 32px', background: '#F8FAFD', borderBottom: '1px solid #F1F5F9' }}>
          {['Worker', 'Date', 'Type', ''].map((h, i) => (
            <div key={i} style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</div>
          ))}
        </div>

        {filteredLeaves.length === 0 ? (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Plane size={32} color="#94A3B8" />
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1E293B' }}>No leaves registered</h3>
            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontWeight: 600 }}>Try adjusting your search or add a new leave.</p>
          </div>
        ) : (
          filteredLeaves.map((l, idx) => (
            <div key={idx} style={{ 
              display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 100px', padding: '16px 32px', alignItems: 'center',
              borderBottom: idx === filteredLeaves.length - 1 ? 'none' : '1px solid #F8FAFD'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: BLUE, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800 }}>
                  {l.worker.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#1E293B' }}>{l.worker.name}</div>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>ID: {l.worker.id}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 700, color: '#475569' }}>
                <Calendar size={16} color="#94A3B8" />
                {l.date}
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#DC2626', background: '#FEF2F2', padding: '4px 10px', borderRadius: 8, textTransform: 'uppercase' }}>Vacation / Sick</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <button 
                  onClick={() => onRemoveLeave(l.worker.id, l.date)}
                  style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 8 }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
