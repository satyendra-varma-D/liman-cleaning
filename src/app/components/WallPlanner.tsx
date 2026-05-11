import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Search, Filter, Sparkles, Save, Send, 
  Clock, MapPin, Users, Truck, Info, AlertTriangle, CheckCircle2, 
  MoreHorizontal, Phone, MessageSquare, ChevronDown, Plus, ExternalLink,
  Calendar as CalendarIcon, Briefcase, FileText, AlertCircle, List, CloudSnow
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
  onAssignWorkers?: (job: Job) => void;
  onAssignVehicle?: (job: Job) => void;
  onAddVehicle?: () => void;
  onReschedule?: (job: Job) => void;
  onAddLeave?: () => void;
}

export function WallPlanner({ 
  jobs, workers, vehicles, currentDate: propDate, 
  onDateChange, onJobClick, onStatusChange, onJobDrop, 
  onCreateJob, onAssignWorkers, onAssignVehicle, onAddVehicle, onReschedule, onAddLeave 
}: Props) {
  const [viewMode, setViewMode] = useState<'month' | 'day'>('day');
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

  const toggleBtn: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  const navBtn: React.CSSProperties = {
    background: 'none',
    border: 'none',
    padding: 6,
    cursor: 'pointer',
    color: '#64748B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const searchInput: React.CSSProperties = {
    width: '100%',
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 12,
    padding: '10px 12px 10px 38px',
    fontSize: 13,
    fontWeight: 600,
    outline: 'none',
    color: '#1E293B'
  };

  const actionBtnDetail: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    borderRadius: 14,
    fontSize: 14,
    fontWeight: 800,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  const infoItem: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 13,
    color: '#475569',
    fontWeight: 700
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

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button 
            onClick={onAddLeave}
            style={{ ...toggleBtn, background: '#FEF2F2', color: '#DC2626', border: '1.5px solid #FEE2E2', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={14} /> Add Leave
          </button>
          <div style={{ position: 'relative', width: 260 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              placeholder="Search orders..." 
              style={searchInput} 
              value={activeFilters.search}
              onChange={e => setActiveFilters({...activeFilters, search: e.target.value})}
            />
          </div>
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
                    padding: '16px 18px', borderRadius: 20, background: '#fff', 
                    border: '1.5px solid #E2E8F0',
                    borderLeft: `5px solid ${job.type === 'general' ? '#10B981' : BLUE}`,
                    cursor: 'grab', transition: 'all 0.2s', position: 'relative',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = BLUE;
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#1E293B', marginBottom: 6 }}>{job.client || 'New Order'}</div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                      <MapPin size={12} color="#94A3B8" /> {job.location || 'Location missing'}
                    </div>
                    <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                      <Clock size={12} color="#94A3B8" /> {job.estimatedDuration}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ 
                      fontSize: 9, fontWeight: 900, color: '#EF4444', 
                      background: '#FEF2F2', padding: '2px 8px', borderRadius: 6,
                      textTransform: 'uppercase', letterSpacing: '0.03em'
                    }}>
                      {job.type}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: BLUE, display: 'flex', alignItems: 'center', gap: 4 }}>
                      Drag to schedule <Plus size={10} />
                    </div>
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
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%', 
              overflowX: 'auto', 
              overflowY: 'hidden',
              background: '#fff'
            }}>
              <div style={{ minWidth: 1620, display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Board Header (Time Blocks) */}
                <div style={{ display: 'flex', background: '#F8FAFD', borderBottom: '1px solid #E2E8F0' }}>
                  {[
                    '06:00 - 08:00', '08:00 - 10:00', '10:00 - 12:00', 
                    '12:00 - 14:00', '14:00 - 16:00', '16:00 - 18:00',
                    '18:00 - 20:00', '20:00 - 22:00', '22:00 - 24:00'
                  ].map(block => (
                    <div key={block} style={{ flex: 1, padding: '12px', textAlign: 'center', fontSize: 11, fontWeight: 900, color: '#94A3B8', letterSpacing: '0.05em', borderRight: '1px solid #E2E8F0', minWidth: 180 }}>
                      {block}
                    </div>
                  ))}
                </div>

                {/* Board Body */}
                <div style={{ 
                  flex: 1, 
                  position: 'relative', 
                  overflowY: 'auto', 
                  background: '#fff'
                }}>
                  {/* Background Grid Layer */}
                  <div style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                    backgroundImage: `
                      linear-gradient(90deg, #F1F5F9 1.5px, transparent 1.5px), 
                      linear-gradient(0deg, #F1F5F9 1.5px, transparent 1.5px)
                    `, 
                    backgroundSize: '11.111% 100%, 100% 200px', // 9 columns, 200px rows
                    minWidth: 1620,
                    minHeight: '100%'
                  }} />

                  {/* Zebra Stripes Layer */}
                  <div style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                    background: 'repeating-linear-gradient(transparent, transparent 200px, #F8FAFD 200px, #F8FAFD 400px)',
                    minWidth: 1620,
                    minHeight: '100%',
                    zIndex: 0
                  }} />

                  <div style={{ minWidth: 1620, position: 'relative', padding: '20px 0', minHeight: '100%' }}>
                    {/* Current Time Indicator Line */}
                    {isSameDay(currentDate, new Date()) && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: ((new Date().getHours() + new Date().getMinutes()/60 - 6) / 18) * 1620,
                        width: 2,
                        background: '#EF4444',
                        zIndex: 30,
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

                    {/* Render Jobs with Track Logic */}
                    {(() => {
                      const dayJobs = filteredJobs.filter(j => isSameDay(parseISO(j.date), currentDate));
                      const sortedJobs = [...dayJobs].sort((a, b) => {
                        const [ha, ma] = a.time.split(':').map(Number);
                        const [hb, mb] = b.time.split(':').map(Number);
                        return (ha + ma/60) - (hb + mb/60);
                      });

                      const trackEndTimes: number[] = [];
                      const hourWidth = 1620 / 18; // 90px per hour

                      return sortedJobs.map(job => {
                        const [h, m] = job.time.split(':').map(Number);
                        const start = h + m/60;
                        const duration = parseFloat(job.estimatedDuration) || 2;
                        const end = start + duration;

                        const fixedWidth = 300; // Uniform card length
                        const fixedHeight = 160; 
                        const widthInHours = fixedWidth / hourWidth;
                        const cardEnd = start + widthInHours;

                        let trackIndex = trackEndTimes.findIndex(tEnd => tEnd <= start);
                        if (trackIndex === -1) {
                          trackIndex = trackEndTimes.length;
                          trackEndTimes.push(cardEnd);
                        } else {
                          trackEndTimes[trackIndex] = cardEnd;
                        }

                        const jobColor = job.type === 'general' ? '#10B981' : 
                                        job.type === 'deep' ? BLUE : 
                                        job.type === 'industrial' ? '#8B5CF6' : ORANGE;
   
                        const assignedWorkers = workers.filter(w => job.assignedWorkers.includes(w.id));
                        const workerNames = assignedWorkers.map(w => w.name + (w.isSupervisor ? ' ⭐' : '')).join(', ');
                        const vehicle = vehicles.find(v => v.id === job.assignedVehicleId);
                        
                        const endH = Math.floor(start + duration);
                        const endM = Math.round(((start + duration) - endH) * 60);
                        const endTimeStr = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
                        const hasRisk = !!job.risk;
                        const riskColor = job.risk?.level === 'high' ? '#EF4444' : '#F59E0B';

                        return (
                          <div 
                            key={job.id}
                            onClick={() => setSelectedJobId(job.id)}
                            style={{
                              position: 'absolute',
                              left: (start - 6) * hourWidth + 8,
                              width: 300 - 16,
                              height: 160,
                              top: trackIndex * 200 + 20, 
                              padding: '16px 18px',
                              borderRadius: 20,
                              background: hasRisk ? '#FFFBEB' : '#fff',
                              border: `1.5px solid ${hasRisk ? riskColor : '#E2E8F0'}`,
                              borderLeft: `6px solid ${jobColor}`,
                              cursor: 'pointer',
                              boxShadow: hasRisk ? `0 4px 12px ${riskColor}15` : '0 4px 12px rgba(0, 0, 0, 0.05)',
                              transition: 'all 0.2s',
                              display: 'flex', 
                              flexDirection: 'column', 
                              justifyContent: 'space-between',
                              zIndex: 20,
                              overflow: 'hidden'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                          >
                            {/* Absolute positioned Worker Badge (Top Right) */}
                            <div title={workerNames} style={{ 
                              position: 'absolute', 
                              top: 12, 
                              right: 12, 
                              display: 'flex', 
                              alignItems: 'center', 
                              cursor: 'help',
                              zIndex: 30
                            }}>
                              <div style={{ 
                                width: 32, 
                                height: 32, 
                                borderRadius: '50%', 
                                background: '#EFF6FF', display: 'flex', 
                                alignItems: 'center', justifyContent: 'center',
                                border: '1.5px solid #DBEAFE',
                                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.1)'
                              }}>
                                <Users size={16} color={BLUE} />
                              </div>
                              {job.assignedWorkers.length > 0 && (
                                <div style={{ 
                                  position: 'absolute', top: -4, right: -4, 
                                  background: BLUE, color: '#fff', 
                                  fontSize: 9, fontWeight: 900, 
                                  width: 18, height: 18, borderRadius: '50%', 
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                  border: '2px solid #fff',
                                  boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
                                }}>
                                  {job.assignedWorkers.length}
                                </div>
                              )}
                            </div>

                            {/* Content Container */}
                            <div style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              height: '100%', 
                              justifyContent: 'space-between',
                              paddingRight: 40 
                            }}>
                              {/* Top Section: Type + Client + Time */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <span style={{ 
                                    fontSize: 10, fontWeight: 900, color: jobColor, 
                                    background: `${jobColor}15`, padding: '2px 8px', 
                                    borderRadius: 4, textTransform: 'uppercase',
                                    letterSpacing: '0.02em'
                                  }}>
                                    {job.type}
                                  </span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                  <div style={{ 
                                    fontSize: 14, fontWeight: 900, color: '#1E293B',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                  }}>
                                    {job.client || 'New Order'}
                                  </div>
                                  <div style={{ 
                                    fontSize: 11, color: '#64748B', fontWeight: 700,
                                    display: 'flex', alignItems: 'center', gap: 4
                                  }}>
                                    <Clock size={10} color="#94A3B8" /> {job.time} – {endTimeStr}
                                  </div>
                                </div>
                              </div>

                              {/* Bottom Section: Vehicle + Location */}
                              <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: 8, 
                                alignItems: 'flex-start',
                                borderTop: `1px solid ${hasRisk ? `${riskColor}20` : '#F1F5F9'}`,
                                paddingTop: 12
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: vehicle ? '#475569' : '#94A3B8', fontWeight: 700 }}>
                                  <Truck size={12} color={vehicle ? BLUE : '#94A3B8'} />
                                  <span style={{ whiteSpace: 'nowrap' }}>
                                    {vehicle ? vehicle.name : 'No Vehicle assigned'}
                                  </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#475569', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  <MapPin size={12} color={ORANGE} />
                                  <span>{job.location || 'Ad hoc'}</span>
                                </div>
                              </div>

                              {hasRisk && (
                                <div style={{ 
                                  position: 'absolute', bottom: 12, right: 12, 
                                  color: riskColor, animation: 'pulse 2s infinite',
                                  background: '#fff', borderRadius: '50%', padding: 4,
                                  boxShadow: `0 0 10px ${riskColor}30`,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  zIndex: 40
                                }}>
                                  <AlertTriangle size={18} fill={riskColor} color="#fff" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      });
                    })()}

                    {/* Drop Targets (Grid Columns) */}
                    <div style={{ display: 'flex', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
                      {[6, 8, 10, 12, 14, 16, 18, 20, 22].map(startHour => (
                        <div 
                          key={startHour} 
                          onDragOver={(e) => { e.preventDefault(); setDragOverDate(format(currentDate, 'yyyy-MM-dd')); setDragOverTime(`${startHour.toString().padStart(2, '0')}:00`); }}
                          onDrop={(e) => handleDrop(e, format(currentDate, 'yyyy-MM-dd'), `${startHour.toString().padStart(2, '0')}:00`)}
                          style={{ 
                            flex: 1, 
                            minWidth: 180,
                            pointerEvents: 'auto',
                            background: (dragOverDate === format(currentDate, 'yyyy-MM-dd') && dragOverTime === `${startHour.toString().padStart(2, '0')}:00`) ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Intelligence Detail Panel (Right) */}
        {selectedJobId && (
          <div style={{ width: 340, background: '#fff', borderRadius: 24, border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
            <div style={{ padding: 24, borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#1E293B' }}>Order Details</h3>
              <button 
                onClick={() => setSelectedJobId(null)}
                style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <MoreHorizontal size={20} />
              </button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
              {selectedJob ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                   <div style={{ 
                     background: selectedJob.risk ? '#FFFBEB' : '#F8FAFD', 
                     padding: 24, 
                     borderRadius: 24, 
                     border: `1px solid ${selectedJob.risk ? '#FEF3C7' : '#E2E8F0'}`,
                     position: 'relative',
                     overflow: 'hidden'
                   }}>
                      {/* Status Accent */}
                      <div style={{ 
                        position: 'absolute', top: 0, left: 0, width: 6, bottom: 0, 
                        background: selectedJob.risk ? (selectedJob.risk.level === 'high' ? '#EF4444' : '#F59E0B') : 
                                   (selectedJob.type === 'general' ? '#10B981' : 
                                   selectedJob.type === 'deep' ? BLUE : 
                                   selectedJob.type === 'industrial' ? '#8B5CF6' : ORANGE) 
                      }} />

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                         <div style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', lineHeight: 1.2 }}>{selectedJob.client || 'New Order'}</div>
                         <div style={{ 
                           background: selectedJob.assignedWorkers.length > 0 ? '#ECFDF5' : '#F1F5F9',
                           color: selectedJob.assignedWorkers.length > 0 ? '#059669' : '#64748B',
                           padding: '4px 10px', borderRadius: 8, fontSize: 10, fontWeight: 900, textTransform: 'uppercase'
                         }}>
                           {selectedJob.assignedWorkers.length > 0 ? 'Assigned' : 'Personnel Pending'}
                         </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={infoItem}><CalendarIcon size={14} color={BLUE} /> {format(parseISO(selectedJob.date), 'EEEE, dd MMM yyyy')}</div>
                        <div style={infoItem}><Clock size={14} color={BLUE} /> {selectedJob.time} ({selectedJob.estimatedDuration} hrs)</div>
                        <div style={infoItem}><MapPin size={14} color={ORANGE} /> {selectedJob.location || 'Ad hoc'}</div>
                        <div style={infoItem}>
                          <Briefcase size={14} color={BLUE} /> 
                          <span style={{ textTransform: 'capitalize' }}>{selectedJob.type} Cleaning</span>
                        </div>
                      </div>
                   </div>

                   {selectedJob.risk && (
                     <div style={{ 
                       padding: '16px 20px', 
                       borderRadius: 20, 
                       background: selectedJob.risk.level === 'high' ? '#FEF2F2' : '#FFFBEB', 
                       border: `1.5px solid ${selectedJob.risk.level === 'high' ? '#FEE2E2' : '#FEF3C7'}`, 
                       display: 'flex', 
                       flexDirection: 'column',
                       gap: 12,
                       boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                     }}>
                       <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                         <div style={{ 
                           width: 40, height: 40, borderRadius: 12, 
                           background: '#fff', display: 'flex', 
                           alignItems: 'center', justifyContent: 'center', 
                           boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                           flexShrink: 0 
                         }}>
                           {selectedJob.risk.type === 'weather' ? <CloudSnow size={22} color={selectedJob.risk.level === 'high' ? '#EF4444' : '#F59E0B'} /> : <AlertCircle size={22} color="#EF4444" />}
                         </div>
                         <div>
                           <div style={{ fontSize: 14, fontWeight: 900, color: selectedJob.risk.level === 'high' ? '#991B1B' : '#92400E' }}>
                             {selectedJob.risk.type === 'weather' ? 'Weather Alert' : 'Operational Risk'}
                           </div>
                           <div style={{ fontSize: 11, color: selectedJob.risk.level === 'high' ? '#B91C1C' : '#B45309', fontWeight: 600 }}>
                             {selectedJob.risk.description}
                           </div>
                         </div>
                       </div>
                       
                       <div style={{ display: 'flex', gap: 8 }}>
                         {selectedJob.risk.type === 'personnel' ? (
                           <>
                             <button 
                               onClick={() => onReschedule?.(selectedJob)}
                               style={{ 
                               flex: 1, padding: '10px', borderRadius: 12, 
                               background: '#fff', border: `1.5px solid #FEE2E2`,
                               color: '#EF4444', fontSize: 12, fontWeight: 900, cursor: 'pointer'
                             }}>
                               Reschedule
                             </button>
                             <button 
                               onClick={() => onAssignWorkers?.(selectedJob)}
                               style={{ 
                               flex: 1, padding: '10px', borderRadius: 12, 
                               background: '#EF4444', color: '#fff', 
                               fontSize: 12, fontWeight: 900, border: 'none', cursor: 'pointer'
                             }}>
                               Assign New Worker
                             </button>
                           </>
                         ) : (
                           <button 
                             onClick={() => onReschedule?.(selectedJob)}
                             style={{ 
                             width: '100%', padding: '10px', borderRadius: 12, 
                             background: selectedJob.risk.level === 'high' ? '#EF4444' : '#F59E0B', 
                             color: '#fff', fontSize: 12, fontWeight: 900, border: 'none', cursor: 'pointer'
                           }}>
                             Reschedule Order
                           </button>
                         )}
                       </div>
                     </div>
                   )}

                   <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                       {(!selectedJob.assignedWorkers.length || !selectedJob.assignedVehicleId) ? (
                         <>
                           {!selectedJob.assignedWorkers.length && (
                             <button 
                               onClick={() => onAssignWorkers?.(selectedJob)}
                               style={{ ...actionBtnDetail, background: BLUE, color: '#fff', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}
                             >
                               Assign Workers
                             </button>
                           )}
                           {!selectedJob.assignedVehicleId && (
                             <button 
                               onClick={() => onAssignVehicle?.(selectedJob)}
                               style={{ ...actionBtnDetail, width: '100%', background: ORANGE, color: '#fff', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)' }}
                             >
                               Assign Vehicle
                             </button>
                           )}
                           <button 
                             onClick={() => onJobClick(selectedJob)}
                             style={{ ...actionBtnDetail, background: '#fff', color: '#1E293B', border: '1px solid #E2E8F0' }}
                           >
                             View Order Details
                           </button>
                         </>
                       ) : (
                         <button 
                           onClick={() => onJobClick(selectedJob)}
                           style={{ ...actionBtnDetail, background: BLUE, color: '#fff', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}
                         >
                           View Details & Audit
                         </button>
                       )}
                    </div>
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
        )}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', padding: '6px 12px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>{label}</span>
      <select 
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ border: 'none', background: 'none', fontSize: 13, fontWeight: 800, color: '#1E293B', outline: 'none', cursor: 'pointer' }}
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
