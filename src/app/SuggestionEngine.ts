import { Worker, Job } from './types';

export interface SuggestionResult {
  recommendedTeam: { worker: Worker; reason: string }[];
  backupWorkers: { worker: Worker; reason: string }[];
  missingRoles: string[];
}

export const suggestTeam = (
  job: Job,
  allWorkers: Worker[],
  busyWorkerIds: Set<string>
): SuggestionResult => {
  const result: SuggestionResult = {
    recommendedTeam: [],
    backupWorkers: [],
    missingRoles: [],
  };

  // 1. Filter available workers
  const availableWorkers = allWorkers.filter(w => !busyWorkerIds.has(w.id) && w.baseAvailable);

  // 2. Identify potential candidates based on skills
  const candidates = availableWorkers.map(worker => {
    let score = 0;
    const reasons: string[] = [];

    // Skill match
    const matchingSkills = worker.skills.filter(s => job.requiredSkills.includes(s));
    if (matchingSkills.length > 0) {
      score += matchingSkills.length * 10;
      reasons.push(`Has required skills: ${matchingSkills.join(', ')}`);
    }

    // Language match
    if (job.needsGermanSpeaker && worker.languages.includes('DE')) {
      score += 5;
      reasons.push('German speaker');
    } else if (job.needsGermanSpeaker && !worker.languages.includes('DE')) {
      score -= 20; // Strong penalty
    }

    // Past experience with customer
    if (worker.pastCustomers.includes(job.client)) {
      score += 15;
      reasons.push(`Worked with ${job.client} before`);
    }

    // Reliability
    score += worker.reliability * 2;
    reasons.push(`Reliability: ${worker.reliability}/5`);

    // Supervisor bonus
    if (worker.isSupervisor) {
      score += 5;
    }

    return { worker, score, reasons };
  });

  // Sort candidates by score
  candidates.sort((a, b) => b.score - a.score);

  // 3. Select the team
  const selected: { worker: Worker; reason: string }[] = [];
  
  // Try to pick at least one supervisor if needed (for larger teams or special jobs)
  if (job.workersNeeded > 1) {
    const supervisor = candidates.find(c => c.worker.isSupervisor);
    if (supervisor) {
      selected.push({ worker: supervisor.worker, reason: supervisor.reasons[0] || 'Team Lead' });
      // Remove from candidates
      const index = candidates.indexOf(supervisor);
      candidates.splice(index, 1);
    } else {
      result.missingRoles.push('Supervisor');
    }
  }

  // Fill the rest
  while (selected.length < job.workersNeeded && candidates.length > 0) {
    const next = candidates.shift()!;
    selected.push({ worker: next.worker, reason: next.reasons[0] });
  }

  result.recommendedTeam = selected;

  // 4. Fill backups (next best available with same skill)
  candidates.forEach(c => {
    if (result.backupWorkers.length < 3) {
      result.backupWorkers.push({ worker: c.worker, reason: 'High skill match' });
    }
  });

  return result;
};
