import React, { useState } from 'react';
import { X, Truck, CheckCircle2, ChevronRight, Search, Info } from 'lucide-react';
import type { Job, Vehicle } from '../types';
import { BLUE, ORANGE } from '../constants';

interface Props {
  job: Job;
  vehicles: Vehicle[];
  onAssign: (jobId: string, vehicleId: string) => void;
  onClose: () => void;
}

export function AssignVehicleToJobModal({ job, vehicles, onAssign, onClose }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const availableVehicles = vehicles.filter(v => v.status === 'available');
  
  const filteredVehicles = availableVehicles.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 10000,
      padding: '20px',
    }}>
      <div style={{
        background: '#fff',
        width: '100%', maxWidth: 500, 
        height: 'auto', maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        borderRadius: 32,
        overflow: 'hidden',
      }}>
        <div style={{ 
          padding: '32px 24px', 
          background: `linear-gradient(135deg, ${ORANGE} 0%, #D97706 100%)`, 
          color: '#fff',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ 
                width: 48, height: 48, borderRadius: 16, 
                background: 'rgba(255,255,255,0.2)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(255,255,255,0.3)'
              }}>
                <Truck size={24} color="#fff" />
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900 }}>Assign Vehicle</div>
                <div style={{ fontSize: 13, opacity: 0.9, fontWeight: 600 }}>for {job.client}</div>
              </div>
            </div>
            <button 
              onClick={onClose} 
              style={{ 
                background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', 
                padding: '8px', borderRadius: 12, cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ padding: 24, borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              placeholder="Search vehicles..." 
              style={{
                width: '100%', padding: '12px 12px 12px 40px', borderRadius: 14,
                border: '1.5px solid #E2E8F0', fontSize: 14, fontWeight: 600, outline: 'none'
              }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map(vehicle => (
              <div 
                key={vehicle.id}
                onClick={() => onAssign(job.id, vehicle.id)}
                style={{
                  padding: '16px 20px', borderRadius: 20, border: '1.5px solid #F1F5F9',
                  background: '#fff', cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = ORANGE;
                  e.currentTarget.style.background = '#FFFBEB';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#F1F5F9';
                  e.currentTarget.style.background = '#fff';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Truck size={20} color={ORANGE} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#1E293B' }}>{vehicle.name}</div>
                    <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>{vehicle.licensePlate} • {vehicle.type}</div>
                  </div>
                </div>
                <ChevronRight size={18} color="#94A3B8" />
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Info size={32} color="#94A3B8" style={{ marginBottom: 12, opacity: 0.5 }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: '#64748B' }}>No available vehicles found</div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Try a different search term or check status</div>
            </div>
          )}
        </div>

        <div style={{ padding: 24, background: '#F8FAFD', borderTop: '1px solid #F1F5F9' }}>
          <button 
            onClick={onClose}
            style={{ 
              width: '100%', padding: '14px', borderRadius: 14, 
              background: '#fff', border: '1.5px solid #E2E8F0',
              color: '#475569', fontSize: 14, fontWeight: 800, cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
