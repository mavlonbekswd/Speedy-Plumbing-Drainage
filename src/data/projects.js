import { projectImages } from './images'

// Generated comparison imagery is always disclosed as illustrative. Replace
// each entry with consented project photography before presenting real jobs.
export const projectsAreIllustrative = true

export const projects = [
  {
    slug: 'external-drain-clearance',
    title: 'External Drain Clearance',
    service: 'Blocked Drains',
    before: projectImages.externalDrainClearance.before,
    after: projectImages.externalDrainClearance.after,
    isIllustrative: true,
    workCompleted: [
      'Locate the obstruction in the external gully',
      'Remove leaves, mud and small debris',
      'Flow-test the drain after clearance',
      'Clean the surrounding paving',
    ],
  },
  {
    slug: 'bathroom-pipework-refresh',
    title: 'Bathroom Pipework Refresh',
    service: 'Bathroom Plumbing',
    before: projectImages.bathroomPipeworkRefresh.before,
    after: projectImages.bathroomPipeworkRefresh.after,
    isIllustrative: true,
    workCompleted: [
      'Remove ageing supply pipework',
      'Route and clip new hot and cold supplies',
      'Fit and align the new basin waste',
      'Pressure-test and leave the cabinet dry',
    ],
  },
  {
    slug: 'hidden-leak-trace-repair',
    title: 'Hidden Leak Trace & Repair',
    service: 'Leak Repairs',
    before: projectImages.hiddenLeakTraceRepair.before,
    after: projectImages.hiddenLeakTraceRepair.after,
    isIllustrative: true,
    workCompleted: [
      'Trace the leak to the defective joint',
      'Reseal or replace the failed fitting',
      'Retest the pipework under pressure',
      'Confirm the joint and cabinet are dry',
    ],
  },
]
