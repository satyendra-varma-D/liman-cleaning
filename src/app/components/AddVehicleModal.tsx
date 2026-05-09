import { useState } from 'react';
import { X, Truck, Camera, Fuel, ArrowLeft, Info, Shield, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { Vehicle } from '../types';
import { BLUE, ORANGE } from '../constants';

interface Props {
  onSave: (vehicle: Omit<Vehicle, 'status'>) => void;
  onClose: () => void;
}

export function AddVehicleModal({ onSave, onClose }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState('Van');
  const [licensePlate, setLicensePlate] = useState('');
  const [makeModel, setMakeModel] = useState('');
  const [fuelType, setFuelType] = useState<'Diesel' | 'Electric' | 'Petrol' | 'Hybrid'>('Diesel');
  const [photo, setPhoto] = useState('');

  const handleSave = () => {
    if (!name || !licensePlate) return;
    onSave({
      id: `v${Date.now()}`,
      name,
      type,
      licensePlate,
      makeModel,
      fuelType,
      photo
    });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 14,
    border: '1.5px solid #E2E8F0',
    outline: 'none',
    fontSize: 15,
    fontWeight: 600,
    background: '#fff',
    transition: 'all 0.2s'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 800,
    color: '#94A3B8',
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: '0.05em'
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
              Register New Vehicle
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: 14, fontWeight: 600 }}>
              Add a new asset to your fleet management system
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
            disabled={!name || !licensePlate}
            style={{
              padding: '12px 32px', borderRadius: 14,
              background: BLUE, color: '#fff', border: 'none',
              fontSize: 15, fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(37, 99, 235, 0.2)',
              opacity: (!name || !licensePlate) ? 0.6 : 1
            }}
          >
            Save Vehicle
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32 }}>
        {/* Main Form */}
        <div style={{ 
          background: '#fff', borderRadius: 32, padding: 40, border: '1px solid #F1F5F9',
          boxShadow: '0 20px 50px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#EFF6FF', color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Truck size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1E293B' }}>Identity & Specs</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <label style={labelStyle}>Display Name *</label>
                  <input 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Van 01"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>License Plate *</label>
                  <input 
                    value={licensePlate}
                    onChange={e => setLicensePlate(e.target.value)}
                    placeholder="e.g. W-12345 AB"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Make and Model</label>
                  <input 
                    value={makeModel}
                    onChange={e => setMakeModel(e.target.value)}
                    placeholder="e.g. VW Transporter T6"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Vehicle Type</label>
                  <select 
                    value={type}
                    onChange={e => setType(e.target.value)}
                    style={inputStyle}
                  >
                    <option>Van</option>
                    <option>Large Van</option>
                    <option>Pickup</option>
                    <option>Electric Van</option>
                    <option>Standard Car</option>
                  </select>
                </div>
              </div>
            </section>

            <section style={{ paddingTop: 32, borderTop: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#FFF7ED', color: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Fuel size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1E293B' }}>Operational Data</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <label style={labelStyle}>Fuel Type</label>
                  <select 
                    value={fuelType}
                    onChange={e => setFuelType(e.target.value as any)}
                    style={inputStyle}
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Maintenance Cycle (Months)</label>
                  <select style={inputStyle}>
                    <option>6 Months</option>
                    <option>12 Months</option>
                    <option>24 Months</option>
                  </select>
                </div>
              </div>
            </section>

            <section style={{ paddingTop: 32, borderTop: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#F8FAFD', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Camera size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#1E293B' }}>Vehicle Appearance</h3>
              </div>

              <div>
                <label style={labelStyle}>Photo URL (optional)</label>
                <input 
                  value={photo}
                  onChange={e => setPhoto(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  style={inputStyle}
                />
              </div>
            </section>
          </div>
        </div>

        {/* Live Preview Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ 
            background: BLUE, borderRadius: 32, padding: 32, color: '#fff',
            boxShadow: '0 20px 40px rgba(37, 99, 235, 0.15)'
          }}>
            <h4 style={{ margin: 0, fontSize: 18, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Info size={20} /> Live Summary
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <SummaryRow label="Name" value={name || '—'} />
              <SummaryRow label="Plate" value={licensePlate || '—'} />
              <SummaryRow label="Type" value={type} />
              <SummaryRow label="Fuel" value={fuelType} />
              <SummaryRow label="Status" value="AVAILABLE" highlight />
            </div>

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>Fleet Security</div>
                  <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 600 }}>Active Asset Monitoring</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ 
            background: '#F0FDF4', borderRadius: 32, padding: 24, border: '1px solid #DCFCE7'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <CheckCircle2 size={20} color="#16A34A" />
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#15803D' }}>Deployment Ready</h4>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#15803D', lineHeight: 1.5, fontWeight: 600 }}>
              This vehicle will be immediately available for scheduling upon registration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 13, opacity: 0.7, fontWeight: 600 }}>{label}</span>
      <span style={{ 
        fontSize: 14, fontWeight: 800, 
        background: highlight ? 'rgba(255,255,255,0.2)' : 'transparent',
        padding: highlight ? '4px 8px' : '0',
        borderRadius: highlight ? '6px' : '0'
      }}>{value}</span>
    </div>
  );
}
