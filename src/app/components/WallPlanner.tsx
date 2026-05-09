import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Search, Filter, Sparkles, Save, Send, 
  Clock, MapPin, Users, Truck, Info, AlertTriangle, CheckCircle2, 
  MoreHorizontal, Phone, MessageSquare, ChevronDown, Plus, ExternalLink,
  Calendar as CalendarIcon, Briefcase, FileText, AlertCircle, List
} from 'lucide-react';
import type { Job, Worker, Vehicle, JobStatus } from '../types';
import { BLUE, ORANGE } from '../constants';
import { 
  format, addHours, parseISO, startOfMonth, endOfMonth, 
  eachDayOfInterval, isSameDay, startOfWeek, endOfWeek,
  addMonths, subMonths, addDays, subDays
} from 'date-fns';

interface Props {
  jobs: Job[];
  workers: Worker[];
  vehicles: Vehicle[];
  currentDate: string;
  onDateChange: (date: string) => void;
  onJobClick: (job: Job) => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
  onJobDrop: (job: Job, newDate: string, newTime?: string) => void;
  onCreateJob?: () => void;
}

export function WallPlanner({ jobs, workers, vehicles, currentDate: propDate, onDateChange, onJobClick, onStatusChange, onJobDrop, onCreateJob }: Props) {
  const [viewMode, setViewMode] = useState<'month' | 'day'>('month');
  const currentDate = useMemo(() => parseISO(propDate), [propDate]);

  const setCurrentDate = (date: Date) => {
    onDateChange(format(date, 'yyyy-MM-dd'));
  };
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    type: 'All Types',
    client: 'All Clients',
    search: ''
  });
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);
  const [dragOverTime, setDragOverTime] = useState<string | null>(null);
  const [activeDraggedJobId, setActiveDraggedJobId] = useState<string | null>(null);

  const selectedJob = useMemo(() => jobs.find(j => j.id === selectedJobId), [jobs, selectedJobId]);

  const unassignedJobs = useMemo(() => jobs.filter(j => j.status === 'unassigned'), [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.client.toLowerCase().includes(activeFilters.search.toLowerCase()) || 
                           job.location.toLowerCase().includes(activeFilters.search.toLowerCase());
      const matchesType = activeFilters.type === 'All Types' || job.type === activeFilters.type.toLowerCase();
      const matchesClient = activeFilters.client === 'All Clients' || job.client === activeFilters.client;
      return matchesSearch && matchesType && matchesClient;
    });
  }, [jobs, activeFilters]);

  // Calendar logic
  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const dayHours = Array.from({ length: 15 }, (_, i) => i + 6); // 06:00 - 20:00

  const handlePrev = () => {
    if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const handleNext = () => {
    if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const handleDragStart = (e: React.DragEvent, jobId: string) => {
    setActiveDraggedJobId(jobId);
    e.dataTransfer.setData('text/plain', jobId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setActiveDraggedJobId(null);
  };

  const handleDrop = (e: React.DragEvent, date: string, time?: string) => {
    e.preventDefault();
    setDragOverDate(null);
    setDragOverTime(null);
    
    const jobId = activeDraggedJobId || e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('jobId');
    const job = jobs.find(j => j.id === jobId);
    
    if (job && onJobDrop) {
      onJobDrop(job, date, time);
    }
    
    setActiveDraggedJobId(null);
  };

  const handleDragOver = (e: React.DragEvent, date: string, time?: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDate(date);
    if (time) setDragOverTime(time);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 40px)', gap: 0, background: '#F8FAFD', padding: 20 }}>
      {/* Header Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', margin: 0 }}>Liman Planner</h1>
          
          <div style={{ display: 'flex', background: '#fff', borderRadius: 12, border: '1px solid #E2E8F0', padding: 2, gap: 2 }}>
            <button 
              onClick={() => setViewMode('month')}
              style={{ ...toggleBtn, background: viewMode === 'month' ? BLUE : 'transparent', color: viewMode === 'month' ? '#fff' : '#64748B' }}
            >Month</button>
            <button 
              onClick={() => setViewMode('day')}
              style={{ ...toggleBtn, background: viewMode === 'day' ? BLUE : 'transparent', color: viewMode === 'day' ? '#fff' : '#64748B' }}
            >Day</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', padding: '6px 12px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
            <button onClick={handlePrev} style={navBtn}><ChevronLeft size={16} /></button>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#1E293B', minWidth: 140, textAlign: 'center' }}>
              {viewMode === 'month' ? format(currentDate, 'MMMM yyyy') : format(currentDate, 'EEEE, dd MMM')}
            </span>
            <button onClick={handleNext} style={navBtn}><ChevronRight size={16} /></button>
          </div>

          <FilterSelect 
            label="Types" 
            value={activeFilters.type}
            options={['All Types', ...Array.from(new Set(jobs.map(j => j.type)))]}
            onChange={(val) => setActiveFilters({...activeFilters, type: val})}
          />
        </div>

        <div style={{ display: 'flex', gap: 12, position: 'relative', width: 300 }}>
           <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
           <input 
              placeholder="Search orders..." 
              style={searchInput} 
              value={activeFilters.search}
              onChange={e => setActiveFilters({...activeFilters, search: e.target.value})}
           />
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, gap: 20, overflow: 'hidden' }}>
        
        {/* Unassigned Orders (Left) */}
        <div style={{ width: 280, background: '#fff', borderRadius: 24, border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Info size={20} color="#EF4444" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#1E293B' }}>Unassigned</h3>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>{unassignedJobs.length} orders pending</div>
                </div>
              </div>
              <button 
                onClick={onCreateJob}
                style={{ 
                  width: 32, height: 32, borderRadius: 8, background: BLUE, color: '#fff', 
                  border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)'
                }}
              >
                <Plus size={18} strokeWidth={3} />
              </button>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {unassignedJobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
                <CheckCircle2 size={32} style={{ marginBottom: 12, opacity: 0.2, margin: '0 auto' }} />
                <div style={{ fontSize: 13, fontWeight: 700 }}>All Clear!</div>
                <div style={{ fontSize: 11, fontWeight: 600 }}>No unassigned orders</div>
              </div>
            ) : (
              unassignedJobs.map(job => (
                <div 
                  key={job.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, job.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => setSelectedJobId(job.id)}
                  style={{
                    padding: 16, borderRadius: 16, background: '#fff', border: '1px solid #E2E8F0',
                    cursor: 'grab', transition: 'all 0.2s', position: 'relative'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#EF4444'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
                >
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#1E293B', marginBottom: 4 }}>{job.client || 'New Order'}</div>
                  <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}><MapPin size={12} /> {job.location || 'No location'}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#EF4444', background: '#FEF2F2', padding: '2px 6px', borderRadius: 4 }}>{job.type.toUpperCase()}</div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8' }}>{job.estimatedDuration}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Calendar Area */}
        <div style={{ flex: 1, background: '#fff', borderRadius: 24, border: '1px solid #F1F5F9', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          
          {viewMode === 'month' ? (
            /* MONTH VIEW */
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#F8FAFD', borderBottom: '1px solid #F1F5F9' }}>
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                  <div key={day} style={{ padding: '12px', textAlign: 'center', fontSize: 11, fontWeight: 900, color: '#94A3B8', letterSpacing: '0.05em' }}>{day}</div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', flex: 1, overflowY: 'auto' }}>
                {monthDays.map((day, i) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const dayJobs = filteredJobs.filter(j => j.date === dateStr);
                  const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                  return (
                    <div 
                      key={i} 
                      onDragOver={(e) => handleDragOver(e, dateStr)}
                      onDragLeave={() => setDragOverDate(null)}
                      onDrop={(e) => handleDrop(e, dateStr)}
                      style={{ 
                        minHeight: 100, borderRight: '1px solid #F8FAFD', borderBottom: '1px solid #F8FAFD', padding: 8, 
                        background: dragOverDate === dateStr ? '#FEF2F2' : (isCurrentMonth ? '#fff' : '#FBFCFE'),
                        transition: 'background 0.2s'
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 800, color: isCurrentMonth ? '#1E293B' : '#CBD5E1', marginBottom: 8 }}>{format(day, 'd')}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {dayJobs.map(job => (
                          <div 
                            key={job.id} 
                            onClick={() => setSelectedJobId(job.id)}
                            style={{ 
                              fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 6,
                              background: job.status === 'unassigned' ? '#FEF2F2' : '#EFF6FF',
                              color: job.status === 'unassigned' ? '#EF4444' : BLUE,
                              border: `1px solid ${job.status === 'unassigned' ? '#FEE2E2' : '#DBEAFE'}`,
                              cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                            }}
                          >
                            {job.client || 'New Order'}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* DAY VIEW */
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              {/* Board Header (Time Blocks) */}
              <div style={{ display: 'flex', background: '#F8FAFD', borderBottom: '1px solid #E2E8F0' }}>
                {[
                  '06:00 - 09:00', '09:00 - 12:00', '12:00 - 15:00', 
                  '15:00 - 18:00', '18:00 - 21:00', '21:00 - 24:00'
                ].map(block => (
                  <div key={block} style={{ flex: 1, padding: '12px', textAlign: 'center', fontSize: 10, fontWeight: 900, color: '#94A3B8', letterSpacing: '0.05em', borderRight: '1px solid #E2E8F0' }}>
                    {block}
                  </div>
                ))}
              </div>

              {/* Board Body */}
              <div style={{ flex: 1, display: 'flex', position: 'relative', overflowX: 'auto', overflowY: 'hidden', background: '#fff', backgroundImage: 'linear-gradient(#F1F5F9 1px, transparent 1px), linear-gradient(90deg, #F1F5F9 1px, transparent 1px)', backgroundSize: '100% 60px, 16.666% 100%' }}>
                {/* Current Time Indicator Line */}
                {isSameDay(currentDate, new Date()) && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: `${((new Date().getHours() + new Date().getMinutes()/60 - 6) / 18) * 100}%`,
                    width: 2,
                    background: '#EF4444',
                    zIndex: 20,
                    pointerEvents: 'none'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: -15,
                      width: 30,
                      height: 8,
                      background: '#EF4444',
                      borderRadius: '0 0 10px 10px'
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: 10,
                      left: -20,
                      background: '#EF4444',
                      color: '#fff',
                      fontSize: 9,
                      fontWeight: 900,
                      padding: '1px 6px',
                      borderRadius: 6,
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                    }}>
                      {format(new Date(), 'HH:mm')}
                    </div>
                  </div>
                )}

                {[6, 9, 12, 15, 18, 21].map(startHour => {
                  const endHour = startHour + 3;
                  const blockJobs = filteredJobs.filter(j => {
                    const jobHour = parseInt(j.time.split(':')[0]);
                    return isSameDay(parseISO(j.date), currentDate) && jobHour >= startHour && jobHour < endHour;
                  });

                  return (
                    <div 
                      key={startHour} 
                      onDragOver={(e) => handleDragOver(e, format(currentDate, 'yyyy-MM-dd'), `${startHour.toString().padStart(2, '0')}:00`)}
                      onDragLeave={() => { setDragOverDate(null); setDragOverTime(null); }}
                      onDrop={(e) => handleDrop(e, format(currentDate, 'yyyy-MM-dd'), `${startHour.toString().padStart(2, '0')}:00`)}
                      style={{ 
                        flex: 1, 
                        minWidth: 180,
                        borderRight: '1px solid #F1F5F9',
                        background: (dragOverDate === format(currentDate, 'yyyy-MM-dd') && dragOverTime === `${startHour.toString().padStart(2, '0')}:00`) ? '#FEF2F2' : 'transparent',
                        padding: '12px 8px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        overflowY: 'auto'
                      }}
                    >
                      {blockJobs.map(job => {
                        const jobColor = job.type === 'general' ? '#10B981' : 
                                        job.type === 'deep' ? BLUE : 
                                        job.type === 'industrial' ? '#8B5CF6' : ORANGE;
                        return (
                          <div 
                            key={job.id}
                            onClick={() => setSelectedJobId(job.id)}
                            style={{
                              padding: '10px 12px',
                              borderRadius: 12,
                              background: job.status === 'unassigned' ? '#FFFBEB' : '#fff',
                              border: `1px solid ${job.status === 'unassigned' ? '#F59E0B' : '#E2E8F0'}`,
                              borderLeft: `3px solid ${jobColor}`,
                              cursor: 'pointer',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
                              transition: 'all 0.2s',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: 12, fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{job.client || 'New Order'}</span>
                              <span style={{ fontSize: 10, fontWeight: 700, color: '#64748B', marginLeft: 8 }}>{job.time}</span>
                            </div>
                            <div style={{ fontSize: 10, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              <MapPin size={10} color={jobColor} /> {job.location || 'Location missing'}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                              <div style={{ 
                                fontSize: 8, fontWeight: 900, textTransform: 'uppercase', 
                                color: jobColor, background: `${jobColor}10`, 
                                padding: '1px 6px', borderRadius: 4 
                              }}>
                                {job.type}
                              </div>
                              {job.status === 'unassigned' && (
                                <div style={{ fontSize: 8, fontWeight: 900, color: '#F59E0B', background: '#FFF7ED', padding: '1px 6px', borderRadius: 4 }}>UNASSIGNED</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Intelligence Detail Panel (Right) */}
        <div style={{ width: 340, background: '#fff', borderRadius: 24, border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          <div style={{ padding: 24, borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#1E293B' }}>Order Intelligence</h3>
            <button style={{ color: '#94A3B8', background: 'none', border: 'none' }}><MoreHorizontal size={20} /></button>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
            {selectedJob ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ background: selectedJob.status === 'unassigned' ? '#FEF2F2' : '#F8FAFD', padding: 20, borderRadius: 20, border: `1px solid ${selectedJob.status === 'unassigned' ? '#FEE2E2' : '#E2E8F0'}` }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div style={{ fontSize: 20, fontWeight: 900, color: '#1E293B' }}>{selectedJob.client || 'New Order'}</div>
                      {selectedJob.status === 'unassigned' && <AlertTriangle size={18} color="#EF4444" />}
                   </div>
                   <div style={infoItem}><CalendarIcon size={14} /> {selectedJob.date}</div>
                   <div style={infoItem}><Clock size={14} /> {selectedJob.time} ({selectedJob.estimatedDuration})</div>
                   <div style={infoItem}><MapPin size={14} /> {selectedJob.location || 'Assign Location'}</div>
                   <div style={infoItem}><Briefcase size={14} /> {selectedJob.type} Cleaning</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                   <button style={{ ...actionBtnDetail, background: BLUE, color: '#fff' }}>Assign Personnel</button>
                   <button style={{ ...actionBtnDetail, background: '#fff', color: '#1E293B', border: '1px solid #E2E8F0' }}>Edit Order File</button>
                   <button 
                    onClick={() => onJobClick(selectedJob)}
                    style={{ ...actionBtnDetail, background: '#fff', color: '#64748B', border: '1px solid #E2E8F0', fontSize: 12 }}
                   >Full Details View</button>
                </div>

                {selectedJob.status === 'unassigned' && (
                  <div style={{ padding: 16, borderRadius: 16, background: '#FEF2F2', border: '1px solid #FEE2E2', display: 'flex', gap: 12 }}>
                    <Info size={16} color="#EF4444" style={{ flexShrink: 0 }} />
                    <div style={{ fontSize: 12, color: '#991B1B', fontWeight: 600 }}>This order has not been assigned yet. Please block a time slot and allocate a team.</div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', paddingTop: 60, color: '#94A3B8' }}>
                <List size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
                <div style={{ fontSize: 14, fontWeight: 800 }}>No Order Selected</div>
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>Select a calendar entry to view details</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ background: '#fff', border: '1px solid #E2E8F0', padding: '8px 12px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#1E293B', cursor: 'pointer' }}
      >
        {value || label} <ChevronDown size={14} color="#94A3B8" />
      </div>
      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #E2E8F0', borderRadius: 10, marginTop: 4, zIndex: 100, minWidth: 160, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {options.map(opt => (
            <div key={opt} onClick={() => { onChange(opt); setIsOpen(false); }} style={{ padding: '10px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: value === opt ? '#F1F5F9' : '#fff' }}>{opt}</div>
          ))}
        </div>
      )}
    </div>
  );
}

const toggleBtn: React.CSSProperties = { padding: '6px 16px', borderRadius: 10, border: 'none', fontSize: 12, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' };
const navBtn: React.CSSProperties = { background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center' };
const searchInput: React.CSSProperties = { width: '100%', padding: '10px 12px 10px 36px', borderRadius: 12, border: '1px solid #E2E8F0', fontSize: 13, fontWeight: 600, outline: 'none' };
const infoItem: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569', fontWeight: 600, marginBottom: 8 };
const actionBtnDetail: React.CSSProperties = { width: '100%', padding: '12px', borderRadius: 14, border: 'none', fontSize: 13, fontWeight: 900, cursor: 'pointer' };
