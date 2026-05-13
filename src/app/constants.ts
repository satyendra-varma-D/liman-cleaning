import { JobType, JobStatus } from './types';

export const JOB_TYPE_COLORS: Record<JobType, { bg: string; color: string }> = {
  window: { bg: '#EFF6FF', color: '#1E40AF' },
  special: { bg: '#FAF5FF', color: '#6B21A8' },
  snow: { bg: '#F0F9FF', color: '#075985' },
  grass: { bg: '#F0FDF4', color: '#15803D' },
  machine: { bg: '#FFF7ED', color: '#C2410C' },
  general: { bg: '#F8FAFC', color: '#475569' },
  office: { bg: '#F0F9FF', color: '#0369A1' },
  facade: { bg: '#FEF2F2', color: '#991B1B' },
  industrial: { bg: '#FDF2F8', color: '#9D174D' },
};

export const STATUS_OPTIONS: JobStatus[] = ['pending', 'scheduled', 'in-progress', 'completed', 'unassigned', 'incomplete'];

export const BLUE = '#2563EB'; // Premium Bright Blue
export const ORANGE = '#F59E0B'; // Premium Amber/Orange
