import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Header } from './components/Header';
import { DailyBoard } from './components/DailyBoard';
import { CreateJobModal } from './components/CreateJobModal';
import { WorkerPanel } from './components/WorkerPanel';
import { JobDetail } from './components/JobDetail';
import { EmployeeDetail } from './components/EmployeeDetail';
import { WhatsAppPreview } from './components/WhatsAppPreview';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { LanguageProvider } from './LanguageContext';

import { JobType, JobStatus, Worker, Job } from './types';

const today = format(new Date(), 'yyyy-MM-dd');

const BASE_WORKERS: Omit<Worker, 'available'>[] = [
  { id: 'w1', name: 'Maria Huber', baseAvailable: true, skills: ['Fenster', 'Büro'], languages: ['DE', 'EN'], reliability: 5 },
  { id: 'w2', name: 'Tomasz Kowalski', baseAvailable: true, skills: ['Schnee', 'Allgemein'], languages: ['DE', 'PL'], reliability: 4 },
  { id: 'w3', name: 'Ana Popescu', baseAvailable: true, skills: ['Fenster', 'Sonder'], languages: ['DE', 'RO'], reliability: 5 },
  { id: 'w4', name: 'Ibrahim Al-Hassan', baseAvailable: false, skills: ['Allgemein'], languages: ['DE', 'AR'], reliability: 3 },
  { id: 'w5', name: 'Elena Müller', baseAvailable: true, skills: ['Büro', 'Sonder'], languages: ['DE'], reliability: 5 },
  { id: 'w6', name: 'Bogdan Ionescu', baseAvailable: true, skills: ['Fenster', 'Schnee'], languages: ['DE', 'RO'], reliability: 4 },
  { id: 'w7', name: 'Fatima Yilmaz', baseAvailable: true, skills: ['Allgemein', 'Büro'], languages: ['DE', 'TR'], reliability: 4 },
  { id: 'w8', name: 'Goran Petrić', baseAvailable: true, skills: ['Schnee', 'Sonder'], languages: ['DE', 'HR'], reliability: 3 },
  { id: 'w9', name: 'Karl Weber', baseAvailable: true, skills: ['Allgemein', 'Fenster'], languages: ['DE'], reliability: 5 },
  { id: 'w10', name: 'Luka Novak', baseAvailable: true, skills: ['Sonder', 'Büro'], languages: ['DE', 'SL'], reliability: 4 },
  { id: 'w11', name: 'Sven Larsson', baseAvailable: true, skills: ['Allgemein', 'Schnee'], languages: ['DE', 'SV'], reliability: 5 },
  { id: 'w12', name: 'Marek Nowak', baseAvailable: true, skills: ['Fenster', 'Allgemein'], languages: ['DE', 'PL'], reliability: 4 },
];

const INITIAL_JOBS: Job[] = [
  {
    id: 'j1', client: 'Raiffeisen Bank AG', location: 'Mariahilfer Str. 77, 1060 Wien',
    date: today, time: '06:00', workersNeeded: 3, assignedWorkers: ['w1', 'w3', 'w5'],
    type: 'window', status: 'in-progress', notes: 'Außenfenster 4. Stock, Aufzug vorhanden',
  },
  {
    id: 'j2', client: 'Billa Markt Ottakring', location: 'Thaliastraße 120, 1160 Wien',
    date: today, time: '07:30', workersNeeded: 2, assignedWorkers: ['w2', 'w7'],
    type: 'general', status: 'scheduled', notes: '',
  },
  {
    id: 'j3', client: 'Hotel Erzherzog Johann', location: 'Graben 25, 1010 Wien',
    date: today, time: '09:00', workersNeeded: 4, assignedWorkers: ['w6', 'w9', 'w12'],
    type: 'special', status: 'pending', notes: 'Lobby + Konferenzräume, Schlüssel beim Portier',
  },
  {
    id: 'j4', client: 'Schulgebäude BRG 6', location: 'Amerlingstraße 6, 1060 Wien',
    date: today, time: '13:00', workersNeeded: 2, assignedWorkers: ['w1', 'w10'],
    type: 'general', status: 'scheduled', notes: '',
  },
  {
    id: 'j5', client: 'Privat: Familie Berger', location: 'Hütteldorfer Str. 200, 1140 Wien',
    date: today, time: '15:30', workersNeeded: 1, assignedWorkers: ['w3'],
    type: 'special', status: 'scheduled', notes: 'Erstbesuch, freundlich auftreten',
  },
  {
    id: 'j6', client: 'Bürokomplex Euro Plaza', location: 'Am Euro Platz 2, 1120 Wien',
    date: today, time: '18:00', workersNeeded: 5, assignedWorkers: ['w2', 'w5', 'w7', 'w11'],
    type: 'general', status: 'pending', notes: 'Nachtreinigung, Code: 4452',
  },
  {
    id: 'j7', client: 'Ärztezentrum Wien Mitte', location: 'Landstraßer Hauptstraße 1, 1030 Wien',
    date: today, time: '05:30', workersNeeded: 2, assignedWorkers: ['w9', 'w12'],
    type: 'special', status: 'completed', notes: 'Desinfektionsreinigung erforderlich',
  }
];

import { JobsList } from './components/JobsList';
import { WorkersList } from './components/WorkersList';
import { Schedule } from './components/Schedule';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [view, setView] = useState<'board' | 'detail' | 'worker-detail'>('board');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showWorkerPanel, setShowWorkerPanel] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeModule, setActiveModule] = useState('dashboard');


  const filteredJobs = useMemo(
    () => jobs.filter(j => j.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time)),
    [jobs, selectedDate],
  );

  const busyWorkerIds = useMemo(() => {
    const busy = new Set<string>();
    filteredJobs.forEach(j => j.assignedWorkers.forEach(id => busy.add(id)));
    return busy;
  }, [filteredJobs]);

  const allWorkers: Worker[] = useMemo(
    () => BASE_WORKERS.map(w => ({ ...w, available: w.baseAvailable && !busyWorkerIds.has(w.id) })),
    [busyWorkerIds],
  );

  const selectedJob = jobs.find(j => j.id === selectedJobId) ?? null;
  const selectedWorker = allWorkers.find(w => w.id === selectedWorkerId) ?? null;

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
  };

  const handleStatusChange = (jobId: string, status: JobStatus) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status } : j));
  };

  const handleAssignWorkers = (jobId: string, workerIds: string[]) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, assignedWorkers: workerIds } : j));
    setShowWorkerPanel(false);
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
          onBack={handleBack}
          onEdit={handleEditJob}
          onAssignWorkers={() => setShowWorkerPanel(true)}
          onWhatsApp={() => setShowWhatsApp(true)}
          onStatusChange={handleStatusChange}
        />
      );
    }

    if (view === 'worker-detail' && selectedWorker) {
      const assignedJobs = jobs.filter(j => j.assignedWorkers.includes(selectedWorker.id));
      return (
        <EmployeeDetail 
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
        return <WorkersList workers={allWorkers} onWorkerClick={handleWorkerClick} />;
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
            onJobClick={handleJobClick}
            onStatusChange={handleStatusChange}
          />
        );
    }
  };

  return (
    <LanguageProvider>
      {!isLoggedIn ? (
        <Login onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <div className="flex min-h-screen bg-[#F4F6F9] font-sans">
          <Sidebar 
            onLogout={() => setIsLoggedIn(false)} 
            activeModule={activeModule}
            onModuleChange={(m) => {
              setActiveModule(m);
              setView('board'); // Reset to list view when switching modules
            }}
          />

          <div className="flex-1 ml-64 flex flex-col min-h-screen overflow-x-hidden">
            <Header
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onAddJob={() => { setEditingJob(null); setShowCreateModal(true); }}
              jobCount={filteredJobs.length}
              workerCount={busyWorkerIds.size}
            />

            <main className="flex-1 p-6 md:p-8">
              <div className="w-full">
                {renderContent()}
              </div>
            </main>
          </div>

          {showCreateModal && (
            <CreateJobModal
              job={editingJob}
              defaultDate={selectedDate}
              onSave={handleSaveJob}
              onClose={() => { setShowCreateModal(false); setEditingJob(null); }}
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
        </div>
      )}
    </LanguageProvider>
  );
}

