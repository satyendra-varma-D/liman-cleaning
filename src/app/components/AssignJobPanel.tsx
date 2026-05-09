import { X, Sparkles, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import type { Job, Worker } from '../types';
import { BLUE, ORANGE } from '../constants';

interface Props {
  worker: Worker;
  jobs: Job[];
  onAssign: (jobId: string, workerId: string) => void;
  onClose: () => void;
}

export function AssignJobPanel({ worker, jobs, onAssign, onClose }: Props) {
  const availableJobs = jobs.filter(j => j.status !== 'completed');

  const scoredJobs = availableJobs.map(job => {
    let score = 0;
    const matchingSkills = job.requiredSkills?.filter(s => worker.skills.includes(s)) || [];
    score += matchingSkills.length * 10;
    
    if (worker.pastCustomers?.includes(job.client)) {
      score += 15;
    }

    let matchingTags: string[] = [];
    const jobKeywords = `${job.client} ${job.type} ${job.notes}`.toLowerCase();
    if (worker.tags && worker.tags.length > 0) {
      const foundTags = worker.tags.filter(tag => {
        const t = tag.toLowerCase();
        return jobKeywords.includes(t) || t.split('-').some(part => part.length > 3 && jobKeywords.includes(part));
      });
      if (foundTags.length > 0) {
        score += foundTags.length * 15;
        matchingTags = foundTags;
      }
    }

    const vacancy = job.workersNeeded - job.assignedWorkers.length;
    score += vacancy * 5;

    return { ...job, score, matchingSkills, matchingTags };
  }).sort((a, b) => b.score - a.score);

  const recommendations = scoredJobs.filter(j => j.score > 5);
  const otherOrders = scoredJobs.filter(j => j.score <= 5);

  const JobCard = ({ job, isBest }: { job: typeof scoredJobs[0], isBest?: boolean }) => (
    <div 
      onClick={() => onAssign(job.id, worker.id)}
      style={{
        padding: '20px', borderRadius: 24, border: '1.5px solid',
        borderColor: isBest ? BLUE : '#F1F5F9',
        background: '#fff',
        boxShadow: isBest ? '0 10px 30px rgba(37, 99, 235, 0.12)' : '0 4px 6px rgba(0,0,0,0.02)',
        cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative', overflow: 'hidden',
        outline: isBest ? `1px solid ${BLUE}` : 'none'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = isBest ? '0 10px 30px rgba(37, 99, 235, 0.12)' : '0 4px 6px rgba(0,0,0,0.02)';
      }}
    >
      {isBest && (
        <div style={{ 
          position: 'absolute', top: 0, right: 0, background: BLUE, color: '#fff', 
          fontSize: 10, fontWeight: 900, padding: '6px 14px', borderBottomLeftRadius: 16,
          textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 4
        }}>
          <CheckCircle2 size={10} /> Best Match
        </div>
      )}

      <div style={{ fontSize: 17, fontWeight: 800, color: '#1E293B', marginBottom: 12, paddingRight: isBest ? 80 : 0 }}>{job.client}</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#475569', fontWeight: 600 }}>
          <div style={{ width: 24, height: 24, borderRadius: 8, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={14} color={BLUE} />
          </div>
          {job.location}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#475569', fontWeight: 600 }}>
          <div style={{ width: 24, height: 24, borderRadius: 8, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={14} color={BLUE} />
          </div>
          {job.time}
        </div>
      </div>

      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 16, borderTop: '1px solid #F1F5F9'
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {job.matchingSkills.length > 0 ? job.matchingSkills.map(s => (
            <span key={s} style={{ 
              fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 10,
              background: '#DBEAFE', color: BLUE, border: '1px solid #BFDBFE'
            }}>
              {s}
            </span>
          )) : null}
          {job.matchingTags.map(t => (
            <span key={t} style={{ 
              fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 10,
              background: '#F0FDF4', color: '#16A34A', border: '1px solid #DCFCE7'
            }}>
              #{t}
            </span>
          ))}
          {job.matchingSkills.length === 0 && job.matchingTags.length === 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', padding: '4px 0' }}>No match</span>
          )}
        </div>
        <div style={{ 
          fontSize: 11, fontWeight: 800, color: job.workersNeeded - job.assignedWorkers.length > 0 ? '#16A34A' : '#94A3B8', 
          background: job.workersNeeded - job.assignedWorkers.length > 0 ? '#F0FDF4' : '#F1F5F9', 
          padding: '4px 10px', borderRadius: 10,
          display: 'flex', alignItems: 'center', gap: 4
        }}>
          {job.workersNeeded - job.assignedWorkers.length > 0 ? (
            <>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#16A34A' }} />
              {job.workersNeeded - job.assignedWorkers.length} Vacancy
            </>
          ) : (
            'Full'
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div style={{
        background: '#fff',
        width: '100%', maxWidth: 500, 
        height: 'auto', maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        borderRadius: 24,
        overflow: 'hidden',
        animation: 'modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        <style>{`
          @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      <div style={{ 
        padding: '32px 24px', 
        background: `linear-gradient(135deg, ${BLUE} 0%, #1D4ED8 100%)`, 
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ 
              width: 48, height: 48, borderRadius: 16, 
              background: 'rgba(255,255,255,0.2)', 
              backdropFilter: 'blur(5px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: 20, fontWeight: 800,
              border: '1px solid rgba(255,255,255,0.3)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              {worker.name[0]}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.02em' }}>Assign Order</div>
              <div style={{ fontSize: 13, opacity: 0.9, fontWeight: 500 }}>Selection for {worker.name}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '8px', borderRadius: 12, cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        {/* Recommendations */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Sparkles size={16} color={ORANGE} />
          <span style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            AI Recommendations
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
          {recommendations.map((job, idx) => (
            <JobCard key={job.id} job={job} isBest={idx === 0} />
          ))}
          {recommendations.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#94A3B8', fontSize: 13, fontWeight: 600 }}>
              No perfect matches found.
            </div>
          )}
        </div>

        {/* Other Orders */}
        {otherOrders.length > 0 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Clock size={16} color="#94A3B8" />
              <span style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Other Available Orders
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {otherOrders.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </>
        )}
      </div>
      
      </div>
    </div>
  );
}
