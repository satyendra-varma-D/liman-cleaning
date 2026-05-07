import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Header } from './components/Header';
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
  { id: 'w1', name: 'Maria Huber', baseAvailable: true, skills: ['window', 'general'], languages: ['DE', 'EN'], isSupervisor: true, reliability: 5, pastCustomers: ['Raiffeisen Bank AG', 'Schulgebäude BRG 6'] },
  { id: 'w2', name: 'Tomasz Kowalski', baseAvailable: true, skills: ['snow', 'general'], languages: ['PL', 'EN'], isSupervisor: false, reliability: 4, pastCustomers: ['Billa Markt Ottakring', 'Bürokomplex Euro Plaza'] }, // No DE
  { id: 'w3', name: 'Ana Popescu', baseAvailable: true, skills: ['window', 'special'], languages: ['DE', 'RO'], isSupervisor: true, reliability: 5, pastCustomers: ['Raiffeisen Bank AG', 'Privat: Familie Berger'] },
  { id: 'w4', name: 'Ibrahim Al-Hassan', baseAvailable: false, skills: ['general'], languages: ['AR', 'EN'], isSupervisor: false, reliability: 3, pastCustomers: [] }, // No DE
  { id: 'w5', name: 'Elena Müller', baseAvailable: true, skills: ['general', 'special'], languages: ['DE'], isSupervisor: false, reliability: 5, pastCustomers: ['Raiffeisen Bank AG', 'Bürokomplex Euro Plaza'] },
  { id: 'w6', name: 'Bogdan Ionescu', baseAvailable: true, skills: ['window', 'snow'], languages: ['RO', 'IT'], isSupervisor: false, reliability: 4, pastCustomers: ['Hotel Erzherzog Johann'] }, // No DE
  { id: 'w7', name: 'Fatima Yilmaz', baseAvailable: true, skills: ['general', 'machine'], languages: ['TR', 'EN'], isSupervisor: false, reliability: 4, pastCustomers: ['Billa Markt Ottakring', 'Bürokomplex Euro Plaza'] }, // No DE
  { id: 'w8', name: 'Goran Petrić', baseAvailable: true, skills: ['snow', 'special'], languages: ['HR', 'DE'], isSupervisor: false, reliability: 3, pastCustomers: [] },
  { id: 'w9', name: 'Karl Weber', baseAvailable: true, skills: ['general', 'window'], languages: ['DE'], isSupervisor: true, reliability: 5, pastCustomers: ['Hotel Erzherzog Johann', 'Ärztezentrum Wien Mitte'] },
  { id: 'w10', name: 'Luka Novak', baseAvailable: true, skills: ['special', 'machine'], languages: ['SL', 'EN'], isSupervisor: false, reliability: 4, pastCustomers: ['Schulgebäude BRG 6'] }, // No DE
  { id: 'w11', name: 'Sven Larsson', baseAvailable: true, skills: ['general', 'snow'], languages: ['SV', 'EN'], isSupervisor: false, reliability: 5, pastCustomers: ['Bürokomplex Euro Plaza'] }, // No DE
  { id: 'w12', name: 'Marek Nowak', baseAvailable: true, skills: ['window', 'general'], languages: ['DE', 'PL'], isSupervisor: false, reliability: 4, pastCustomers: ['Hotel Erzherzog Johann', 'Ärztezentrum Wien Mitte'] },
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
    requiredSkills: ['window'], needsGermanSpeaker: true, assignedVehicleId: 'v1', isWeatherDependent: false
  },
  {
    id: 'j2', client: 'Billa Markt Ottakring', location: 'Thaliastraße 120, 1160 Wien',
    date: today, time: '07:30', workersNeeded: 2, assignedWorkers: ['w2', 'w7'],
    type: 'general', status: 'scheduled', notes: '',
    requiredSkills: ['general'], needsGermanSpeaker: false, assignedVehicleId: 'v2', isWeatherDependent: false
  },
  {
    id: 'j3', client: 'Hotel Erzherzog Johann', location: 'Graben 25, 1010 Wien',
    date: today, time: '09:00', workersNeeded: 4, assignedWorkers: ['w6', 'w9', 'w12'],
    type: 'special', status: 'pending', notes: 'Lobby + Konferenzräume, Schlüssel beim Portier',
    requiredSkills: ['special'], needsGermanSpeaker: true, assignedVehicleId: 'v3', isWeatherDependent: false
  },
  {
    id: 'j4', client: 'Schulgebäude BRG 6', location: 'Amerlingstraße 6, 1060 Wien',
    date: today, time: '13:00', workersNeeded: 2, assignedWorkers: ['w1', 'w10'],
    type: 'general', status: 'scheduled', notes: '',
    requiredSkills: ['general'], needsGermanSpeaker: false, isWeatherDependent: false
  },
];

import { JobsList } from './components/JobsList';
import { WorkersList } from './components/WorkersList';
import { Schedule } from './components/Schedule';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { VehiclesList } from './components/VehiclesList';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [view, setView] = useState<'board' | 'detail' | 'worker-detail'>('board');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [defaultWorkerId, setDefaultWorkerId] = useState<string | null>(null);
  const [showWorkerPanel, setShowWorkerPanel] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [modalInitialStep, setModalInitialStep] = useState<'details' | 'workers'>('details');
  const [showAssignJobPanel, setShowAssignJobPanel] = useState(false);
  const [selectedAssignWorkerId, setSelectedAssignWorkerId] = useState<string | null>(null);
  const [showAssignVehiclePanel, setShowAssignVehiclePanel] = useState(false);
  const [selectedAssignVehicleId, setSelectedAssignVehicleId] = useState<string | null>(null);
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);

  const selectedJob = useMemo(() => jobs.find(j => j.id === selectedJobId) ?? null, [jobs, selectedJobId]);

  const filteredJobs = useMemo(() => {
    let list = jobs.filter(j => j.date === selectedDate);
    if (userRole === 'supervisor') {
      // Prototype: Maria Huber (w1) is the logged-in supervisor
      list = list.filter(j => j.assignedWorkers.includes('w1'));
    }
    return list.sort((a, b) => a.time.localeCompare(b.time));
  }, [jobs, selectedDate, userRole]);

  const busyWorkerIds = useMemo(() => {
    const busy = new Set<string>();
    filteredJobs.forEach(j => j.assignedWorkers.forEach(id => busy.add(id)));
    return busy;
  }, [filteredJobs]);

  const allWorkers: Worker[] = useMemo(
    () => BASE_WORKERS.map(w => ({ ...w, available: w.baseAvailable && !busyWorkerIds.has(w.id) })),
    [busyWorkerIds],
  );

  const selectedWorker = useMemo(() => allWorkers.find(w => w.id === selectedWorkerId) ?? null, [allWorkers, selectedWorkerId]);


  const workersForPanel: Worker[] = useMemo(() => {
    if (!selectedJobId) return allWorkers;
    const otherBusy = new Set<string>();
    filteredJobs
      .filter(j => j.id !== selectedJobId)
      .forEach(j => j.assignedWorkers.forEach(id => otherBusy.add(id)));
    return BASE_WORKERS.map(w => ({
      ...w,
      available: w.baseAvailable && !otherBusy.has(w.id),
    }));
  }, [filteredJobs, selectedJobId, allWorkers]);

  const handleSaveJob = (data: Omit<Job, 'id'> & { id?: string }) => {
    if (data.id) {
      setJobs(prev => prev.map(j => j.id === data.id ? { ...data, id: data.id! } : j));
    } else {
      setJobs(prev => [...prev, { ...data, id: `j${Date.now()}` }]);
    }
    setShowCreateModal(false);
    setEditingJob(null);
    setActiveModule('jobs'); // Redirect to orders listing
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

  const handleAddWorker = (newWorker: Omit<Worker, 'available'>) => {
    // In this prototype, we'll just close it
    setShowAddWorkerModal(false);
  };

  const handleAssignWorkers = (jobId: string, workerIds: string[]) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, assignedWorkers: workerIds } : j));
    setShowWorkerPanel(false);
  };

  const handleAssignVehicle = (jobId: string, vehicleId: string) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, assignedVehicleId: vehicleId || undefined } : j));
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) return { ...v, status: 'assigned' };
      // If it was assigned to this job, free it
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
  };

  const handleWorkerClick = (worker: Worker) => {
    setSelectedWorkerId(worker.id);
    setView('worker-detail');
  };

  const handleReschedule = (job: Job) => {
    setEditingJob(job);
    setModalInitialStep('workers');
    setShowCreateModal(true);
  };

  const handleEditJob = () => {
    if (selectedJob) {
      setEditingJob(selectedJob);
      setShowCreateModal(true);
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

    if (view === 'worker-detail' && selectedWorker) {
      const assignedJobs = jobs.filter(j => j.assignedWorkers.includes(selectedWorker.id));
      return (
        <WorkerDetail 
          worker={selectedWorker} 
          assignedJobs={assignedJobs} 
          onBack={handleBack} 
          onJobClick={handleJobClick}
        />
      );
    }

    switch (activeModule) {
      case 'jobs':
        return (
          <JobsList 
            jobs={jobs} 
            workers={allWorkers} 
            onJobClick={handleJobClick} 
            onStatusChange={handleStatusChange} 
          />
        );
      case 'workers':
        return <WorkersList 
          workers={allWorkers} 
          onWorkerClick={handleWorkerClick} 
          onAddWorker={() => setShowAddWorkerModal(true)} 
        />;
      case 'vehicles':
        return <VehiclesList vehicles={vehicles} onAssignVehicle={(id) => {
          setSelectedAssignVehicleId(id);
          setShowAssignVehiclePanel(true);
        }} />;
      case 'schedule':
        return <Schedule jobs={jobs} />;
      case 'reports':
        return <Reports jobs={jobs} />;
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
            userRole={userRole}
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
            onLogout={() => setIsLoggedIn(false)} 
            activeModule={activeModule}
            userRole={userRole}
            onModuleChange={(m) => {
              setActiveModule(m);
              setView('board'); 
            }}
          />

          <div className="flex-1 ml-64 flex flex-col min-h-screen overflow-x-hidden">
            <Header
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onAddJob={() => { setEditingJob(null); setShowCreateModal(true); }}
              jobCount={filteredJobs.length}
              workerCount={busyWorkerIds.size}
              userRole={userRole}
            />

            <main className="flex-1 p-3 md:p-4 lg:p-5">
              <div className="w-full">
                {renderContent()}
              </div>
            </main>
          </div>

          {showCreateModal && (
            <CreateJobModal
              job={editingJob}
              defaultDate={selectedDate}
              workers={allWorkers}
              defaultWorkerIds={defaultWorkerId ? [defaultWorkerId] : []}
              initialStep={modalInitialStep}
              onSave={handleSaveJob}
              onClose={() => { 
                setShowCreateModal(false); 
                setEditingJob(null);
                setDefaultWorkerId(null);
                setModalInitialStep('details');
              }}
            />
          )}

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

          {showAddWorkerModal && (
            <AddWorkerModal
              onSave={(newWorker) => {
                // Prepend to jobs is not needed, we update worker pool
                // Since 'allWorkers' is derived from a hardcoded list + state in real apps
                // We will just close it for now as the user requested the "side panel for the same"
                setShowAddWorkerModal(false);
              }}
              onClose={() => setShowAddWorkerModal(false)}
            />
          )}
        </div>
      )}
    </LanguageProvider>
  );
}

