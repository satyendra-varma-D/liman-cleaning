export type JobType = 'window' | 'special' | 'snow' | 'grass' | 'machine' | 'general' | 'office' | 'facade' | 'industrial';
export type JobStatus = 'scheduled' | 'in-progress' | 'completed' | 'pending' | 'unassigned' | 'incomplete';

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  licensePlate: string;
  status: 'available' | 'assigned' | 'maintenance';
  makeModel?: string;
  fuelType?: 'Diesel' | 'Electric' | 'Petrol' | 'Hybrid';
  photo?: string;
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
  avatar?: string;
  totalJobs?: number;
  rating?: number;
  phone?: string;
  email?: string;
  nationality?: string;
  canDrive?: boolean;
  leaves?: string[]; // Array of ISO dates
  synergyWith?: string[]; // IDs of workers they work well with
  conflictsWith?: string[]; // IDs of workers they have conflicts with
  tags?: string[]; // Custom tags for AI suggestions (e.g. "early-bird", "industrial-specialist")
}

export type JobPriority = 'high' | 'medium' | 'low';

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
  isRecurring: boolean;
  priority: JobPriority;
  estimatedDuration: string;
  notes: string;
  risk?: {
    type: 'weather' | 'personnel' | 'other';
    description: string;
    level: 'high' | 'medium';
  };
}

export type UserRole = 'admin' | 'secretary' | 'supervisor';
