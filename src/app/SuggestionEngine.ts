import { Worker, Job } from './types';

export interface SuggestionResult {
  recommendedTeam: { worker: Worker; reasons: string[] }[];
  backupWorkers: { worker: Worker; reasons: string[] }[];
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

  // 2. Identify potential candidates based on multiple parameters
  const candidates = availableWorkers.map(worker => {
    let score = 0;
    const reasons: string[] = [];

    // Skill match (Primary factor)
    const matchingSkills = worker.skills.filter(s => job.requiredSkills.includes(s));
    if (matchingSkills.length > 0) {
      score += matchingSkills.length * 20;
      reasons.push(`Matched skills: ${matchingSkills.join(', ')}`);
    }

    // Recurring Job Logic: High priority for consistency
    if (job.isRecurring && worker.pastCustomers.includes(job.client)) {
      score += 50; // Very high weight for recurring consistency
      reasons.push('High consistency: Worked for this client previously');
    } else if (worker.pastCustomers.includes(job.client)) {
      score += 15;
      reasons.push('Experience with this client');
    }

    // Language match (Critical for some jobs)
    if (job.needsGermanSpeaker && worker.languages.includes('DE')) {
      score += 10;
      reasons.push('German speaker');
    } else if (job.needsGermanSpeaker && !worker.languages.includes('DE')) {
      score -= 30; // Strong penalty if German is needed but not spoken
    }

    // Reliability & Rating
    if (worker.reliability >= 4) {
      score += worker.reliability * 5;
      reasons.push(`High reliability: ${worker.reliability}/5`);
    }
      if (worker.rating && worker.rating >= 4.5) {
        score += 10;
        reasons.push(`Top rated: ${worker.rating}★`);
      }
  
      // Tag matches (New optimization layer)
      if (worker.tags && worker.tags.length > 0) {
        const jobKeywords = `${job.client} ${job.type} ${job.notes}`.toLowerCase();
        const matchingTags = worker.tags.filter(tag => {
          const t = tag.toLowerCase();
          // Match full tag or any significant part (e.g. "bank" in "bank-certified")
          return jobKeywords.includes(t) || t.split('-').some(part => part.length > 3 && jobKeywords.includes(part));
        });
        if (matchingTags.length > 0) {
          score += matchingTags.length * 15;
          reasons.push(`Tag match: ${matchingTags.map(t => `#${t}`).join(', ')}`);
        }
      }
  
      // Total Experience

    // Supervisor bonus
    if (worker.isSupervisor) {
      score += 5;
    }

    return { worker, score, reasons };
  });

  // Sort candidates by total score
  candidates.sort((a, b) => b.score - a.score);

  // 3. Select the team
  const selected: { worker: Worker; reasons: string[] }[] = [];
  
  // A. Ensure at least one German speaker if required
  if (job.needsGermanSpeaker) {
    const germanSpeaker = candidates.find(c => c.worker.languages.includes('DE'));
    if (germanSpeaker) {
      selected.push({ worker: germanSpeaker.worker, reasons: germanSpeaker.reasons });
      const index = candidates.indexOf(germanSpeaker);
      candidates.splice(index, 1);
    } else {
      result.missingRoles.push('German Speaker');
    }
  }

  // B. Ensure at least one supervisor for larger teams
  if (job.workersNeeded > 1 && !selected.some(s => s.worker.isSupervisor)) {
    const supervisor = candidates.find(c => c.worker.isSupervisor);
    if (supervisor) {
      selected.push({ worker: supervisor.worker, reasons: supervisor.reasons });
      const index = candidates.indexOf(supervisor);
      candidates.splice(index, 1);
    } else {
      result.missingRoles.push('Supervisor');
    }
  }

  // C. Fill remaining spots with top scoring candidates
  while (selected.length < job.workersNeeded && candidates.length > 0) {
    const next = candidates.shift()!;
    selected.push({ worker: next.worker, reasons: next.reasons });
  }

  result.recommendedTeam = selected;

  // 4. backups (top 3 remaining)
  result.backupWorkers = candidates.slice(0, 3).map(c => ({
    worker: c.worker,
    reasons: c.reasons
  }));

  return result;
};
