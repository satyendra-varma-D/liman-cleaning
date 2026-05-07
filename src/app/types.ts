export type JobType = 'window' | 'special' | 'snow' | 'grass' | 'machine' | 'general';
export type JobStatus = 'scheduled' | 'in-progress' | 'completed' | 'pending';

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  licensePlate: string;
  status: 'available' | 'assigned' | 'maintenance';
}

export interface Worker {
  id: string;
  name: string;
  baseAvailable: boolean;
  available: boolean;
  skills: string[];
  languages: string[]; // 'DE', 'EN', etc.
  isSupervisor: boolean;
  reliability: number; // 1-5
  pastCustomers: string[]; // IDs or names of customers they worked for
}

export interface Job {
  id: string;
  client: string;
  location: string;
  date: string;
  time: string;
  workersNeeded: number;
  assignedWorkers: string[];
  assignedVehicleId?: string;
  type: JobType;
  status: JobStatus;
  requiredSkills: string[];
  needsGermanSpeaker: boolean;
  isWeatherDependent: boolean;
  notes: string;
}

export type UserRole = 'admin' | 'secretary' | 'supervisor';
