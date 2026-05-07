import React, { useState } from 'react';
import { MapPin, Users, CloudRain, Sun, Wind, Thermometer, ShieldCheck, AlertTriangle } from 'lucide-react';
import type { Job, Worker } from '../types';
import { JOB_TYPE_COLORS } from '../constants';

interface Props {
  jobs: Job[];
  workers: Worker[];
  onJobClick: (job: Job) => void;
}

// Simulated map coordinates for Vienna districts
const MAP_BOUNDS = { minX: 0, minY: 0, maxX: 1000, maxY: 600 };

export const MapPlanningView: React.FC<Props> = ({ jobs, workers, onJobClick }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Generate deterministic pseudo-random coordinates for jobs based on their ID
  const getCoords = (id: string) => {
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      x: 100 + (hash * 13) % 800,
      y: 100 + (hash * 7) % 400
    };
  };

  return (
    <div style={{ background: '#fff', borderRadius: 32, border: '1px solid #F1F5F9', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      {/* Map Control Bar */}
      <div style={{ padding: '20px 32px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#2563EB' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Active Jobs</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={14} color="#64748B" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Staff Locations</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CloudRain size={14} color="#0EA5E9" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>Weather Risk Zones</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
           <div style={{ padding: '6px 12px', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: 8, color: '#DC2626', fontSize: 11, fontWeight: 800 }}>
             HEAVY RAIN WARNING: DISTRICT 10, 11
           </div>
        </div>
      </div>

      <div style={{ position: 'relative', height: 600, background: '#F1F5F9' }}>
        {/* SVG Base Map (Stylized Vienna) */}
        <svg viewBox="0 0 1000 600" style={{ width: '100%', height: '100%' }}>
          {/* Mock District Outlines */}
          <path d="M100,100 L300,50 L500,80 L700,40 L900,120 L850,300 L950,500 L700,550 L400,500 L150,550 L50,400 Z" fill="#fff" stroke="#E2E8F0" strokeWidth="2" />
          <path d="M300,50 L350,200 L500,250 L550,80 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
          <path d="M500,250 L700,300 L750,40 L550,80 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
          
          {/* Weather Overlay - Rain Zone */}
          <defs>
            <radialGradient id="rainGradient">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="750" cy="350" r="150" fill="url(#rainGradient)" />
          <g transform="translate(720, 320)">
             <CloudRain size={48} color="#0EA5E9" opacity={0.4} />
          </g>

          {/* Connection Lines (Worker to Job) */}
          {jobs.map(job => {
            const coords = getCoords(job.id);
            return job.assignedWorkers.slice(0, 1).map(workerId => {
              // Mock worker starting point
              const wx = coords.x - 40;
              const wy = coords.y + 30;
              return (
                <line 
                  key={`${job.id}-${workerId}`}
                  x1={wx} y1={wy} x2={coords.x} y2={coords.y} 
                  stroke="#94A3B8" strokeWidth="1" strokeDasharray="4 4" 
                />
              );
            });
          })}
        </svg>

        {/* Interactive Overlays (HTML for better hover/click) */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {jobs.map(job => {
            const coords = getCoords(job.id);
            const isHovered = hoveredId === job.id;
            const typeStyle = JOB_TYPE_COLORS[job.type] || JOB_TYPE_COLORS.general;

            return (
              <div 
                key={job.id}
                style={{
                  position: 'absolute',
                  left: coords.x,
                  top: coords.y,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  zIndex: isHovered ? 100 : 10
                }}
                onMouseEnter={() => setHoveredId(job.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onJobClick(job)}
              >
                {/* Job Marker */}
                <div style={{ 
                  width: isHovered ? 24 : 16, 
                  height: isHovered ? 24 : 16, 
                  background: typeStyle.bar, 
                  borderRadius: '50%',
                  border: '3px solid #fff',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s'
                }} />
                
                {/* Job Label */}
                {isHovered && (
                  <div style={{
                    position: 'absolute',
                    top: -60,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#fff',
                    padding: '8px 12px',
                    borderRadius: 12,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    whiteSpace: 'nowrap',
                    border: '1px solid #F1F5F9',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#1E293B' }}>{job.customerName}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                       <Clock size={10} /> {job.time} • {job.assignedWorkers.length} Workers
                    </div>
                  </div>
                )}
                
                {/* Pulsing Alert for Weather Risk */}
                {job.isWeatherDependent && coords.x > 600 && coords.y > 200 && (
                   <div style={{
                     position: 'absolute',
                     top: -10,
                     right: -10,
                     width: 12,
                     height: 12,
                     background: '#EA580C',
                     borderRadius: '50%',
                     border: '2px solid #fff',
                     animation: 'pulse 1.5s infinite'
                   }} />
                )}
              </div>
            );
          })}

          {/* Worker Icons */}
          {workers.slice(0, 5).map((worker, i) => {
            // Static mock positions for workers
            const wx = 200 + (i * 150);
            const wy = 450 - (i * 30);
            return (
              <div 
                key={worker.id}
                style={{
                  position: 'absolute',
                  left: wx,
                  top: wy,
                  transform: 'translate(-50%, -50%)',
                  background: '#fff',
                  padding: '4px 8px',
                  borderRadius: 20,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  pointerEvents: 'auto'
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: worker.available ? '#22C55E' : '#EF4444' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#475569' }}>{worker.name.split(' ')[0]}</span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
