import React from 'react';
import { Truck, AlertCircle, CheckCircle2, Plus, Fuel } from 'lucide-react';
import { Vehicle } from '../types';
import { BLUE } from '../constants';

interface Props {
  vehicles: Vehicle[];
  onAssignVehicle: (vehicleId: string) => void;
  onAddVehicle: () => void;
}

export function VehiclesList({ vehicles, onAssignVehicle, onAddVehicle }: Props) {
  return (
    <div style={{ padding: '0 0' }}>
      <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Fleet Management</h2>
          <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0 0', fontWeight: 600 }}>Monitor and manage company vehicles and assignments</p>
        </div>
        <button 
          onClick={onAddVehicle}
          style={{
            background: BLUE, color: '#fff', border: 'none', borderRadius: 14,
            padding: '12px 24px', fontSize: 14, fontWeight: 800, cursor: 'pointer',
            boxShadow: `0 10px 20px ${BLUE}33`, display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all 0.2s'
          }}
        >
          <Plus size={20} strokeWidth={2.5} /> Add Vehicle
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
        {vehicles.map(vehicle => (
          <div
            key={vehicle.id}
            style={{
              background: '#fff',
              borderRadius: 24,
              border: '1px solid #F1F5F9',
              boxShadow: '0 20px 50px rgba(0,0,0,0.02)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Vehicle Image Placeholder/Actual */}
            <div style={{ height: 180, background: '#F8FAFD', position: 'relative', overflow: 'hidden' }}>
              {vehicle.photo ? (
                <img src={vehicle.photo} alt={vehicle.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD5E1' }}>
                  <Truck size={64} strokeWidth={1} />
                </div>
              )}
              <div style={{
                position: 'absolute', top: 16, right: 16,
                padding: '6px 14px', borderRadius: 10, fontSize: 11, fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                background: vehicle.status === 'available' ? '#F0FDF4' : vehicle.status === 'assigned' ? '#EFF6FF' : '#FEF2F2',
                color: vehicle.status === 'available' ? '#16A34A' : vehicle.status === 'assigned' ? BLUE : '#EF4444',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backdropFilter: 'blur(4px)'
              }}>
                {vehicle.status}
              </div>
            </div>

            <div style={{ padding: 24 }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#1E293B', marginBottom: 4 }}>{vehicle.name}</div>
                <div style={{ fontSize: 13, color: '#64748B', fontWeight: 700 }}>{vehicle.makeModel || 'Standard Fleet'} · {vehicle.licensePlate}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <div style={{ background: '#F8FAFD', padding: '12px', borderRadius: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Fuel Type</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Fuel size={14} /> {vehicle.fuelType || 'Diesel'}
                  </div>
                </div>
                <div style={{ background: '#F8FAFD', padding: '12px', borderRadius: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 4 }}>Type</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{vehicle.type}</div>
                </div>
              </div>

              <div style={{ 
                padding: '12px 16px', borderRadius: 12, background: vehicle.status === 'maintenance' ? '#FEF2F2' : '#F8FAFD',
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20
              }}>
                {vehicle.status === 'available' ? (
                  <><CheckCircle2 size={16} color="#16A34A" /><span style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>Ready for deployment</span></>
                ) : vehicle.status === 'assigned' ? (
                  <><CheckCircle2 size={16} color={BLUE} /><span style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>Currently in service</span></>
                ) : (
                  <><AlertCircle size={16} color="#EF4444" /><span style={{ fontSize: 12, fontWeight: 700, color: '#EF4444' }}>Maintenance Required</span></>
                )}
              </div>

              {vehicle.status === 'available' && (
                <button 
                  onClick={() => onAssignVehicle(vehicle.id)}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 16, background: BLUE, color: '#fff',
                    border: 'none', fontWeight: 900, fontSize: 14, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'all 0.2s', boxShadow: `0 8px 16px ${BLUE}33`
                  }}
                >
                  Assign to Job
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
