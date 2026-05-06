import { JobType, JobStatus } from './types';

export const JOB_TYPE_COLORS: Record<JobType, { bg: string; color: string }> = {
  window: { bg: '#EFF6FF', color: '#1E40AF' },
  special: { bg: '#FAF5FF', color: '#6B21A8' },
  snow: { bg: '#F0F9FF', color: '#075985' },
  general: { bg: '#F0FDF4', color: '#166534' },
};

export const STATUS_OPTIONS: JobStatus[] = ['pending', 'scheduled', 'in-progress', 'completed'];

export const BLUE = '#2563EB'; // Premium Bright Blue
export const ORANGE = '#F59E0B'; // Premium Amber/Orange
