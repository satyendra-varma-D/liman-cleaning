export type JobType = 'window' | 'special' | 'snow' | 'general';
export type JobStatus = 'scheduled' | 'in-progress' | 'completed' | 'pending';

export interface Worker {
  id: string;
  name: string;
  baseAvailable: boolean;
  available: boolean;
  skills: string[];
  languages: string[];
  reliability: number;
}

export interface Job {
  id: string;
  client: string;
  location: string;
  date: string;
  time: string;
  workersNeeded: number;
  assignedWorkers: string[];
  type: JobType;
  status: JobStatus;
  notes: string;
}
