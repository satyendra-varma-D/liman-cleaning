import { Truck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Vehicle } from '../types';
import { BLUE } from '../constants';

interface Props {
  vehicles: Vehicle[];
}

export function VehiclesList({ vehicles }: Props) {
  return (
    <div style={{ padding: '0 0' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#1E293B', margin: 0 }}>Vehicles</h2>
          <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0 0', fontWeight: 600 }}>Manage fleet and assignments</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {vehicles.map(vehicle => (
          <div
            key={vehicle.id}
            style={{
              background: '#fff',
              borderRadius: 20,
              padding: 24,
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: vehicle.status === 'maintenance' ? '#FEF2F2' : '#F1F5F9',
                color: vehicle.status === 'maintenance' ? '#EF4444' : BLUE,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Truck size={24} />
              </div>
              <div style={{
                padding: '4px 12px', borderRadius: 10, fontSize: 11, fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                background: vehicle.status === 'available' ? '#F0FDF4' : vehicle.status === 'assigned' ? '#EFF6FF' : '#FEF2F2',
                color: vehicle.status === 'available' ? '#16A34A' : vehicle.status === 'assigned' ? BLUE : '#EF4444'
              }}>
                {vehicle.status}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#1E293B' }}>{vehicle.name}</div>
              <div style={{ fontSize: 13, color: '#64748B', fontWeight: 700, marginTop: 2 }}>{vehicle.type} · {vehicle.licensePlate}</div>
            </div>

            <div style={{ 
              marginTop: 8, padding: '12px 16px', borderRadius: 12, background: '#F8FAFD',
              display: 'flex', alignItems: 'center', gap: 10
            }}>
              {vehicle.status === 'available' ? (
                <>
                  <CheckCircle2 size={16} color="#16A34A" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>Ready for assignment</span>
                </>
              ) : vehicle.status === 'assigned' ? (
                <>
                  <CheckCircle2 size={16} color={BLUE} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>In use today</span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} color="#EF4444" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#EF4444' }}>Under maintenance</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
