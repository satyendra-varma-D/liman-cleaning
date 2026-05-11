import { useState, useMemo } from 'react';
import { format, eachDayOfInterval, parseISO } from 'date-fns';
import { DailyBoard } from './components/DailyBoard';
import { CreateJobModal } from './components/CreateJobModal';
import { WorkerPanel } from './components/WorkerPanel';
import { JobDetail } from './components/JobDetail';
import { WorkerDetail } from './components/WorkerDetail';
import { WhatsAppPreview } from './components/WhatsAppPreview';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { AssignJobPanel } from './components/AssignJobPanel';
import { AssignVehiclePanel } from './components/AssignVehiclePanel';
import { AddWorkerModal } from './components/AddWorkerModal';
import { LanguageProvider } from './LanguageContext';

import { JobType, JobStatus, Worker, Job, Vehicle, UserRole } from './types';

const today = format(new Date(), 'yyyy-MM-dd');

const BASE_WORKERS: Omit<Worker, 'available'>[] = [
  { id: 'w1', name: 'Maria Huber', baseAvailable: true, skills: ['window', 'general'], languages: ['DE', 'EN'], isSupervisor: true, reliability: 5, pastCustomers: ['Raiffeisen Bank AG', 'Schulgebäude BRG 6'], avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', totalJobs: 142, rating: 4.9, synergyWith: ['w3', 'w5', 'w9'], conflictsWith: ['w4', 'w8'], tags: ['early-bird', 'polite', 'bank-certified'] },
  { id: 'w2', name: 'Tomasz Kowalski', baseAvailable: true, skills: ['snow', 'general'], languages: ['PL', 'EN'], isSupervisor: false, reliability: 4, pastCustomers: ['Billa Markt Ottakring', 'Bürokomplex Euro Plaza'], avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', totalJobs: 89, rating: 4.7, synergyWith: ['w7', 'w11'], conflictsWith: ['w6'], tags: ['winter-pro', 'punctual'] },
  { id: 'w3', name: 'Ana Popescu', baseAvailable: true, skills: ['window', 'special'], languages: ['DE', 'RO'], isSupervisor: true, reliability: 5, pastCustomers: ['Raiffeisen Bank AG', 'Privat: Familie Berger'], avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop', totalJobs: 115, rating: 4.8, synergyWith: ['w1', 'w5'], conflictsWith: [], tags: ['high-reach', 'careful'] },
  { id: 'w4', name: 'Ibrahim Al-Hassan', baseAvailable: false, skills: ['general'], languages: ['AR', 'EN'], isSupervisor: false, reliability: 3, pastCustomers: [], avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop', totalJobs: 34, rating: 4.2, synergyWith: ['w7'], conflictsWith: ['w1'], tags: ['polite'] },
  { id: 'w5', name: 'Elena Müller', baseAvailable: true, skills: ['general', 'special'], languages: ['DE'], isSupervisor: false, reliability: 5, pastCustomers: ['Raiffeisen Bank AG', 'Bürokomplex Euro Plaza'], avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop', totalJobs: 67, rating: 4.6, synergyWith: ['w1', 'w3'], conflictsWith: [], tags: ['bank-certified', 'discreet'] },
  { id: 'w6', name: 'Bogdan Ionescu', baseAvailable: true, skills: ['window', 'snow'], languages: ['RO', 'IT'], isSupervisor: false, reliability: 4, pastCustomers: ['Hotel Erzherzog Johann'], avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop', totalJobs: 92, rating: 4.5, synergyWith: ['w8', 'w10'], conflictsWith: ['w2'], tags: ['industrial-spec', 'hard-working'] },
  { id: 'w7', name: 'Fatima Yilmaz', baseAvailable: true, skills: ['general', 'machine'], languages: ['TR', 'EN'], isSupervisor: false, reliability: 4, pastCustomers: ['Billa Markt Ottakring', 'Bürokomplex Euro Plaza'], avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop', totalJobs: 78, rating: 4.7, synergyWith: ['w2', 'w4'], conflictsWith: [], tags: ['machine-operator', 'fast-learner'] },
  { id: 'w8', name: 'Goran Petrić', baseAvailable: true, skills: ['snow', 'special'], languages: ['HR', 'DE'], isSupervisor: false, reliability: 3, pastCustomers: [], avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&h=150&fit=crop', totalJobs: 45, rating: 4.3, synergyWith: ['w6'], conflictsWith: ['w1'], tags: ['strong', 'winter-pro'] },
  { id: 'w9', name: 'Karl Weber', baseAvailable: true, skills: ['general', 'window'], languages: ['DE'], isSupervisor: true, reliability: 5, pastCustomers: ['Hotel Erzherzog Johann', 'Ärztezentrum Wien Mitte'], avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop', totalJobs: 156, rating: 4.9, synergyWith: ['w1', 'w12'], conflictsWith: [], tags: ['team-lead', 'punctual', 'bank-certified'] },
  { id: 'w10', name: 'Luka Novak', baseAvailable: true, skills: ['special', 'machine'], languages: ['SL', 'EN'], isSupervisor: false, reliability: 4, pastCustomers: ['Schulgebäude BRG 6'], avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop', totalJobs: 56, rating: 4.4, synergyWith: ['w6'], conflictsWith: [], tags: ['industrial-spec', 'reliable'] },
  { id: 'w11', name: 'Sven Larsson', baseAvailable: true, skills: ['general', 'snow'], languages: ['SV', 'EN'], isSupervisor: false, reliability: 5, pastCustomers: ['Bürokomplex Euro Plaza'], avatar: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=150&h=150&fit=crop', totalJobs: 82, rating: 4.8, synergyWith: ['w2'], conflictsWith: [], tags: ['winter-pro', 'punctual'] },
  { id: 'w12', name: 'Marek Nowak', baseAvailable: true, skills: ['window', 'general'], languages: ['DE', 'PL'], isSupervisor: false, reliability: 4, pastCustomers: ['Hotel Erzherzog Johann', 'Ärztezentrum Wien Mitte'], avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop', totalJobs: 94, rating: 4.6, synergyWith: ['w9'], conflictsWith: [], tags: ['punctual', 'reliable'] },
];

const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'v1', name: 'VW Transporter T6', type: 'Van', licensePlate: 'W-12345 AB', status: 'available' },
  { id: 'v2', name: 'Mercedes Sprinter', type: 'Large Van', licensePlate: 'W-67890 CD', status: 'available' },
  { id: 'v3', name: 'Toyota Proace', type: 'Van', licensePlate: 'W-11223 EF', status: 'available' },
  { id: 'v4', name: 'Ford Transit', type: 'Medium Van', licensePlate: 'W-44556 GH', status: 'available' },
];

const INITIAL_JOBS: Job[] = [
  {
    id: 'j1', client: 'Raiffeisen Bank AG', location: 'Mariahilfer Str. 77, 1060 Wien',
    date: today, time: '06:00', workersNeeded: 3, assignedWorkers: ['w1', 'w3', 'w5'],
    type: 'window', status: 'in-progress', notes: 'Außenfenster 4. Stock, Aufzug vorhanden',
    requiredSkills: ['window'], needsGermanSpeaker: true, assignedVehicleId: 'v1', 
    isWeatherDependent: false, isRecurring: false, priority: 'medium', estimatedDuration: '4h'
  },
  {
    id: 'j2', client: 'Billa Markt Ottakring', location: 'Thaliastraße 120, 1160 Wien',
    date: today, time: '07:30', workersNeeded: 2, assignedWorkers: ['w2', 'w7'],
    type: 'general', status: 'scheduled', notes: '',
    requiredSkills: ['general'], needsGermanSpeaker: false, assignedVehicleId: 'v2', 
    isWeatherDependent: false, isRecurring: true, priority: 'high', estimatedDuration: '2h'
  },
  {
    id: 'j3', client: 'Hotel Erzherzog Johann', location: 'Graben 25, 1010 Wien',
    date: today, time: '09:00', workersNeeded: 4, assignedWorkers: ['w6', 'w9', 'w12'],
    type: 'special', status: 'pending', notes: 'Lobby + Konferenzräume, Schlüssel beim Portier',
    requiredSkills: ['special'], needsGermanSpeaker: true, assignedVehicleId: 'v3', 
    isWeatherDependent: false, isRecurring: false, priority: 'low', estimatedDuration: '6h'
  },
  {
    id: 'j4', client: 'Schulgebäude BRG 6', location: 'Amerlingstraße 6, 1060 Wien',
    date: today, time: '13:00', workersNeeded: 2, assignedWorkers: [],
    type: 'general', status: 'unassigned', notes: '',
    requiredSkills: ['general'], needsGermanSpeaker: false, 
    isWeatherDependent: true, isRecurring: false, priority: 'medium', estimatedDuration: '3h',
    risk: { type: 'weather', description: 'Heavy Snow Fall Forecasted', level: 'high' }
  },
  {
    id: 'j5', client: 'Privat: Familie Berger', location: 'Sieveringer Str. 44, 1190 Wien',
    date: today, time: '14:30', workersNeeded: 1, assignedWorkers: ['w3'],
    type: 'special', status: 'incomplete', notes: 'Needs follow-up for hard water stains',
    requiredSkills: ['special'], needsGermanSpeaker: true, 
    isWeatherDependent: false, isRecurring: false, priority: 'medium', estimatedDuration: '2h',
    risk: { type: 'personnel', description: 'Assigned Worker (Mihai) called in sick', level: 'high' }
  },
  {
    id: 'u2', client: 'New Order', location: '',
    date: today, time: '10:00', workersNeeded: 2, assignedWorkers: [],
    type: 'general', status: 'unassigned', notes: '',
    requiredSkills: ['general'], needsGermanSpeaker: false, 
    isWeatherDependent: true, isRecurring: false, priority: 'high', estimatedDuration: '2h',
    risk: { type: 'weather', description: 'Light Rain (30% probability)', level: 'medium' }
  }
];

import { JobsList } from './components/JobsList';
import { WorkersList } from './components/WorkersList';
import { Schedule } from './components/Schedule';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { VehiclesList } from './components/VehiclesList';
import { Leaves } from './components/Leaves';
import { WallPlanner } from './components/WallPlanner';
import { AddVehicleModal } from './components/AddVehicleModal';
import { AddLeaveModal } from './components/AddLeaveModal';
import { AssignVehicleToJobModal } from './components/AssignVehicleToJobModal';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [workerPool, setWorkerPool] = useState<Omit<Worker, 'available'>[]>(BASE_WORKERS);
  const [view, setView] = useState<'board' | 'detail' | 'worker-detail' | 'create-job' | 'edit-job' | 'add-worker'>('board');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [defaultWorkerId, setDefaultWorkerId] = useState<string | null>(null);
  const [showWorkerPanel, setShowWorkerPanel] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeModule, setActiveModule] = useState('planner');
  const [modalInitialStep, setModalInitialStep] = useState<'details' | 'workers'>('details');
  const [showAssignJobPanel, setShowAssignJobPanel] = useState(false);
  const [selectedAssignWorkerId, setSelectedAssignWorkerId] = useState<string | null>(null);
  const [showAssignVehiclePanel, setShowAssignVehiclePanel] = useState(false);
  const [selectedAssignVehicleId, setSelectedAssignVehicleId] = useState<string | null>(null);
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showAssignVehicleToJobModal, setShowAssignVehicleToJobModal] = useState(false);

  const selectedJob = useMemo(() => jobs.find(j => j.id === selectedJobId) ?? null, [jobs, selectedJobId]);

  const filteredJobs = useMemo(() => {
    let list = jobs.filter(j => j.date === selectedDate);
    return list.sort((a, b) => a.time.localeCompare(b.time));
  }, [jobs, selectedDate]);

  const busyWorkerIds = useMemo(() => {
    const busy = new Set<string>();
    filteredJobs.forEach(j => j.assignedWorkers.forEach(id => busy.add(id)));
    return busy;
  }, [filteredJobs]);

  const allWorkers: Worker[] = useMemo(
    () => workerPool.map(w => ({ ...w, available: w.baseAvailable && !busyWorkerIds.has(w.id) })),
    [busyWorkerIds, workerPool],
  );

  const selectedWorker = useMemo(() => allWorkers.find(w => w.id === selectedWorkerId) ?? null, [allWorkers, selectedWorkerId]);


  const workersForPanel: Worker[] = useMemo(() => {
    if (!selectedJobId) return allWorkers;
    const otherBusy = new Set<string>();
    filteredJobs
      .filter(j => j.id !== selectedJobId)
      .forEach(j => j.assignedWorkers.forEach(id => otherBusy.add(id)));
    return workerPool.map(w => ({
      ...w,
      available: w.baseAvailable && !otherBusy.has(w.id),
    }));
  }, [filteredJobs, selectedJobId, workerPool]);

  const handleSaveJob = (data: Omit<Job, 'id'> & { id?: string }) => {
    if (data.id) {
      setJobs(prev => prev.map(j => j.id === data.id ? { ...data, id: data.id! } : j));
    } else {
      setJobs(prev => [...prev, { ...data, id: `j${Date.now()}` }]);
    }
    setView('board');
    setEditingJob(null);
    // Removed redirect to 'jobs' module to stay on planner
  };

  const handleSaveWorker = (newWorker: Omit<Worker, 'available'>) => {
    setWorkerPool(prev => [...prev, newWorker]);
    setView('board');
    setActiveModule('workers');
  };

  const handleAddLeave = (workerId: string, startDate: string, endDate: string, reason: string) => {
    const dates = eachDayOfInterval({ start: parseISO(startDate), end: parseISO(endDate) })
      .map(d => format(d, 'yyyy-MM-dd'));
      
    setWorkerPool(prev => prev.map(w => 
      w.id === workerId 
        ? { ...w, leaves: Array.from(new Set([...(w.leaves || []), ...dates])) } 
        : w
    ));
    setView('board');
    setActiveModule('leaves');
    setDefaultWorkerId(null);
  };

  const handleRemoveLeave = (workerId: string, date: string) => {
    setWorkerPool(prev => prev.map(w => 
      w.id === workerId 
        ? { ...w, leaves: (w.leaves || []).filter(d => d !== date) } 
        : w
    ));
  };

  const handleAddVehicle = (newVehicle: Omit<Vehicle, 'status'>) => {
    setVehicles(prev => [...prev, { ...newVehicle, status: 'available' }]);
  };

  const handleStatusChange = (jobId: string, status: JobStatus) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status } : j));
  };

  const handleUnassignWorker = (workerId: string, jobId: string) => {
    setJobs(prev => prev.map(j => 
      j.id === jobId 
        ? { ...j, assignedWorkers: j.assignedWorkers.filter(id => id !== workerId) } 
        : j
    ));
  };

  const handleAssignWorkerToNewJob = (workerId: string) => {
    setSelectedAssignWorkerId(workerId);
    setShowAssignJobPanel(true);
  };

  const handleAssignWorkerToJob = (jobId: string, workerId: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId && !j.assignedWorkers.includes(workerId)) {
        return { ...j, assignedWorkers: [...j.assignedWorkers, workerId] };
      }
      return j;
    }));
    setShowAssignJobPanel(false);
    setSelectedAssignWorkerId(null);
  };

  const handleAssignVehicleToJob = (jobId: string, vehicleId: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return { ...j, assignedVehicleId: vehicleId };
      }
      return j;
    }));
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        return { ...v, status: 'assigned' };
      }
      return v;
    }));
    setShowAssignVehiclePanel(false);
    setSelectedAssignVehicleId(null);
  };

  const handleAssignWorkers = (jobId: string, workerIds: string[]) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, assignedWorkers: workerIds } : j));
    setShowWorkerPanel(false);
  };

  const handleAssignVehicle = (jobId: string, vehicleId: string) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, assignedVehicleId: vehicleId || undefined } : j));
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) return { ...v, status: 'assigned' };
      const oldJob = jobs.find(j => j.id === jobId);
      if (oldJob?.assignedVehicleId === v.id && vehicleId !== v.id) return { ...v, status: 'available' };
      return v;
    }));
  };

  const handleJobClick = (job: Job) => {
    setSelectedJobId(job.id);
    setView('detail');
  };

  const handleBack = () => {
    setView('board');
    setSelectedJobId(null);
    setSelectedWorkerId(null);
    setDefaultWorkerId(null);
  };

  const handleModuleChange = (module: string) => {
    setActiveModule(module);
    setView('board');
    setSelectedJobId(null);
    setSelectedWorkerId(null);
  };

  const handleReassignJob = (jobId: string, oldWorkerId: string, newWorkerId: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          assignedWorkers: [...j.assignedWorkers.filter(id => id !== oldWorkerId), newWorkerId]
        };
      }
      return j;
    }));
  };

  const handleUnassignJob = (jobId: string, workerId: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          assignedWorkers: j.assignedWorkers.filter(id => id !== workerId)
        };
      }
      return j;
    }));
  };

  const handleJobDrop = (job: Job, newDate: string, newTime?: string) => {
    const updatedJob = {
      ...job,
      date: newDate,
      time: newTime || job.time,
      status: 'scheduled' as JobStatus
    };
    
    setSelectedJobId(null);
    setEditingJob(updatedJob);
    
    if (!updatedJob.client || !updatedJob.location) {
      setModalInitialStep('details');
    } else if (updatedJob.assignedWorkers.length < updatedJob.workersNeeded) {
      setModalInitialStep('workers');
    } else {
      setModalInitialStep('details');
    }
    
    setTimeout(() => {
      setView('edit-job');
    }, 50);
  };

  const handleWorkerClick = (worker: Worker) => {
    setSelectedWorkerId(worker.id);
    setView('worker-detail');
  };

  const handleReschedule = (job: Job) => {
    setView('edit-job');
  };

  const handleEditJob = () => {
    if (selectedJob) {
      setEditingJob(selectedJob);
      setView('edit-job');
    }
  };

  const renderContent = () => {
    if (view === 'detail' && selectedJob) {
      return (
        <JobDetail
          job={selectedJob}
          workers={allWorkers}
          vehicles={vehicles}
          onBack={handleBack}
          onEdit={handleEditJob}
          onAssignWorkers={() => setShowWorkerPanel(true)}
          onAssignVehicle={handleAssignVehicle}
          onWhatsApp={() => setShowWhatsApp(true)}
          onStatusChange={handleStatusChange}
          userRole={userRole}
        />
      );
    }

    if (view === 'create-job') {
      return (
        <div style={{ background: '#fff', borderRadius: 32, padding: '20px 0', minHeight: '80vh', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
          <CreateJobModal 
            job={null}
            defaultDate={selectedDate}
            workers={allWorkers}
            onSave={handleSaveJob}
            onClose={handleBack}
          />
        </div>
      );
    }

    if (view === 'worker-detail' && selectedWorker) {
      const assignedJobs = jobs.filter(j => j.assignedWorkers.includes(selectedWorker.id));
      return (
        <WorkerDetail 
          worker={selectedWorker} 
          assignedJobs={assignedJobs} 
          onBack={handleBack} 
          onJobClick={handleJobClick}
          onAddLeave={() => { setDefaultWorkerId(selectedWorker.id); setView('add-leave'); }}
          allWorkers={allWorkers}
        />
      );
    }
    if (view === 'add-worker') {
      return (
        <div style={{ background: '#fff', borderRadius: 32, padding: '20px 0', minHeight: '80vh', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
          <AddWorkerModal 
            onSave={handleSaveWorker} 
            onClose={handleBack} 
          />
        </div>
      );
    }
    if (view === 'add-vehicle') {
      return (
        <div style={{ background: '#fff', borderRadius: 32, padding: '20px 0', minHeight: '80vh', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
          <AddVehicleModal 
            onSave={(v) => { handleAddVehicle(v); setView('board'); }} 
            onClose={handleBack} 
          />
        </div>
      );
    }
    if (view === 'add-leave') {
      return (
        <div style={{ background: '#fff', borderRadius: 32, padding: '20px 0', minHeight: '80vh', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
          <AddLeaveModal 
            workers={allWorkers}
            jobs={jobs}
            onSave={handleAddLeave} 
            onReassignJob={handleReassignJob}
            onUnassignJob={handleUnassignJob}
            onClose={handleBack} 
            defaultWorkerId={defaultWorkerId}
          />
        </div>
      );
    }

    switch (activeModule) {
      case 'planner':
        return (
          <WallPlanner 
            jobs={filteredJobs}
            workers={allWorkers}
            vehicles={vehicles}
            currentDate={selectedDate}
            onDateChange={setSelectedDate}
            onAddLeave={() => { setDefaultWorkerId(null); setView('add-leave'); }}
            onJobClick={(job) => {
              setSelectedJobId(job.id);
              setEditingJob(job);
              setModalInitialStep('details');
              setView('edit-job');
            }}
            onAssignWorkers={(job) => {
              setSelectedJobId(job.id);
              setEditingJob(job);
              setModalInitialStep('workers');
              setView('edit-job');
            }}
            onAssignVehicle={(job) => {
              setSelectedJobId(job.id);
              setShowAssignVehicleToJobModal(true);
            }}
          onReschedule={(job) => {
              setSelectedJobId(job.id);
              setEditingJob(job);
              setModalInitialStep('details');
              setView('edit-job');
            }}
            onStatusChange={handleStatusChange}
            onJobDrop={handleJobDrop}
            onAddVehicle={() => setView('add-vehicle')}
            onCreateJob={() => { setEditingJob(null); setModalInitialStep('details'); setView('create-job'); }}
          />
        );
      case 'jobs':
        return (
          <JobsList 
            jobs={jobs} 
            workers={allWorkers} 
            vehicles={vehicles}
            onJobClick={handleJobClick} 
            onStatusChange={handleStatusChange} 
            onCreateJob={() => { setEditingJob(null); setView('create-job'); }}
          />
        );
      case 'workers':
        return <WorkersList 
          workers={allWorkers} 
          onWorkerClick={handleWorkerClick} 
          onAddWorker={() => setView('add-worker')} 
        />;
      case 'vehicles':
        return <VehiclesList 
          vehicles={vehicles} 
          onAssignVehicle={(id) => {
            setSelectedAssignVehicleId(id);
            setShowAssignVehiclePanel(true);
          }} 
          onAddVehicle={() => setView('add-vehicle')}
        />;
      case 'reports':
        return <Reports jobs={jobs} />;
      case 'leaves':
        return (
          <Leaves 
            workers={allWorkers} 
            jobs={jobs} 
            onAddLeave={() => { setDefaultWorkerId(null); setView('add-leave'); }}
            onRemoveLeave={handleRemoveLeave}
          />
        );
      case 'settings':
        return <Settings />;
      case 'dashboard':
      default:
        return (
          <DailyBoard 
            jobs={filteredJobs} 
            workers={allWorkers} 
            vehicles={vehicles}
            onJobClick={handleJobClick}
            onStatusChange={handleStatusChange}
            onUnassignWorker={handleUnassignWorker}
            onAssignWorker={handleAssignWorkerToNewJob}
            onWorkerClick={handleWorkerClick}
            onReschedule={handleReschedule}
            onCreateJob={() => { setEditingJob(null); setView('create-job'); }}
          />
        );
    }
  };

  return (
    <LanguageProvider>
      {!isLoggedIn ? (
        <Login onLogin={(r) => {
          setUserRole(r);
          setIsLoggedIn(true);
        }} />
      ) : (
        <div className="flex min-h-screen bg-[#F4F6F9] font-sans">
          <Sidebar 
            activeModule={activeModule} 
            onModuleChange={handleModuleChange} 
            userRole={userRole}
            onLogout={() => setIsLoggedIn(false)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />

          <div className={`flex-1 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} flex flex-col min-h-screen overflow-x-hidden transition-all duration-300`}>

            <main className="flex-1 p-3 md:p-4 lg:p-5">
              <div className="w-full">
                {renderContent()}
              </div>
            </main>
          </div>



          {showWorkerPanel && selectedJob && (
            <WorkerPanel
              job={selectedJob}
              workers={workersForPanel}
              onSave={handleAssignWorkers}
              onClose={() => setShowWorkerPanel(false)}
            />
          )}

          {showWhatsApp && selectedJob && (
            <WhatsAppPreview
              job={selectedJob}
              workers={allWorkers}
              onClose={() => setShowWhatsApp(false)}
            />
          )}

          {showAssignJobPanel && selectedAssignWorkerId && (
            <AssignJobPanel
              worker={allWorkers.find(w => w.id === selectedAssignWorkerId)!}
              jobs={jobs}
              onAssign={handleAssignWorkerToJob}
              onClose={() => {
                setShowAssignJobPanel(false);
                setSelectedAssignWorkerId(null);
              }}
            />
          )}

          {showAssignVehiclePanel && selectedAssignVehicleId && (
            <AssignVehiclePanel
              vehicle={vehicles.find(v => v.id === selectedAssignVehicleId)!}
              jobs={jobs}
              onAssign={handleAssignVehicleToJob}
              onClose={() => {
                setShowAssignVehiclePanel(false);
                setSelectedAssignVehicleId(null);
              }}
            />
          )}

          {(view === 'edit-job') && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)',
              zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px'
            }}>
              <div style={{ 
                width: '100%', maxWidth: '1440px', maxHeight: '95vh', 
                background: '#fff', borderRadius: '32px', 
                boxShadow: '0 40px 120px rgba(0,0,0,0.4)', overflowY: 'auto',
                position: 'relative'
              }}>
                <CreateJobModal
                  job={editingJob}
                  defaultDate={selectedDate}
                  workers={allWorkers}
                  defaultWorkerIds={defaultWorkerId ? [defaultWorkerId] : []}
                  initialStep={modalInitialStep}
                  onSave={handleSaveJob}
                  onClose={() => { 
                    setView('board'); 
                    setEditingJob(null);
                    setDefaultWorkerId(null);
                    setModalInitialStep('details');
                  }}
                />
              </div>
            </div>
          )}
          {showAssignVehicleToJobModal && selectedJob && (
            <AssignVehicleToJobModal
              job={selectedJob}
              vehicles={vehicles}
              onAssign={(jobId, vId) => {
                handleAssignVehicle(jobId, vId);
                setShowAssignVehicleToJobModal(false);
              }}
              onClose={() => setShowAssignVehicleToJobModal(false)}
            />
          )}

        </div>
      )}
    </LanguageProvider>
  );
}
