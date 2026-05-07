import { X, Sparkles, MapPin, Clock, Truck, ChevronRight } from 'lucide-react';
import type { Job, Vehicle } from '../types';
import { BLUE, ORANGE } from '../constants';

interface Props {
  vehicle: Vehicle;
  jobs: Job[];
  onAssign: (jobId: string, vehicleId: string) => void;
  onClose: () => void;
}

export function AssignVehiclePanel({ vehicle, jobs, onAssign, onClose }: Props) {
  // Only show jobs that don't have a vehicle yet and are for today
  const availableJobs = jobs.filter(j => !j.assignedVehicleId && j.status !== 'completed');

  const scoredJobs = availableJobs.map(job => {
    let score = 0;
    
    // Logic for vehicle matching based on work type
    if (job.type === 'snow' && vehicle.type.includes('Large')) score += 20;
    if (job.type === 'special' && vehicle.type.includes('Van')) score += 10;
    if (job.workersNeeded > 3 && vehicle.type.includes('Large')) score += 15;
    
    return { ...job, score };
  }).sort((a, b) => b.score - a.score);

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 440,
      background: 'rgba(255, 255, 255, 0.98)', 
      backdropFilter: 'blur(10px)',
      boxShadow: '-10px 0 40px rgba(0,0,0,0.15)',
      zIndex: 1000, display: 'flex', flexDirection: 'column',
      borderLeft: '1px solid #F1F5F9',
      animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{ 
        padding: '32px 24px', 
        background: `linear-gradient(135deg, ${BLUE} 0%, #1E40AF 100%)`, 
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
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
              <div style={{ fontSize: 13, opacity: 0.9, fontWeight: 600 }}>{vehicle.name} ({vehicle.licensePlate})</div>
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

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <Sparkles size={16} color={ORANGE} />
          <span style={{ fontSize: 12, fontWeight: 900, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Recommended Orders
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {scoredJobs.map((job, idx) => (
            <div 
              key={job.id}
              onClick={() => onAssign(job.id, vehicle.id)}
              style={{
                padding: '20px', borderRadius: 24, border: '1.5px solid #F1F5F9',
                background: '#fff',
                cursor: 'pointer', transition: 'all 0.3s',
                position: 'relative'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = BLUE;
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(37, 99, 235, 0.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#F1F5F9';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1E293B' }}>{job.client}</div>
                <div style={{ 
                  fontSize: 10, fontWeight: 800, color: BLUE, background: '#EFF6FF', 
                  padding: '4px 10px', borderRadius: 10, textTransform: 'uppercase'
                }}>
                  {job.type}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                   <MapPin size={14} /> {job.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                   <Clock size={14} /> {job.time}
                </div>
              </div>

              <div style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: 16, borderTop: '1px solid #F8FAFD'
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>
                  {job.assignedWorkers.length} Workers assigned
                </div>
                <div style={{ color: BLUE, display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 800 }}>
                  Assign <ChevronRight size={16} />
                </div>
              </div>
            </div>
          ))}

          {scoredJobs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ color: '#94A3B8', fontSize: 14, fontWeight: 600 }}>No orders pending vehicle assignment</div>
            </div>
          )}
        </div>
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
