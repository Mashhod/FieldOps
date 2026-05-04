export const mockUsers = [
  { id: 'u1', name: 'Ayesha Khan', email: 'admin@fieldops.com', role: 'admin' },
  { id: 'u2', name: 'Ali Raza', email: 'tech@fieldops.com', role: 'technician' },
  { id: 'u3', name: 'Acme Logistics', email: 'client@fieldops.com', role: 'client', company: 'Acme Logistics' },
]

export const mockTechnicians = ['Ali Raza', 'Sara Ahmed', 'Hassan Malik', 'Zara Noor']

export const mockJobs = [
  {
    id: 'j1',
    title: 'HVAC Inspection - Tower A',
    status: 'pending',
    technician: 'Ali Raza',
    date: '2026-04-22',
    client: 'Acme Logistics',
    description: 'Quarterly HVAC inspection including filters, belts, and refrigerant checks.',
    notes: 'Need rooftop access approval from building management.',
    timeline: [
      { at: 'Apr 18, 9:12a', label: 'Job created', detail: 'Submitted by Acme Logistics' },
      { at: 'Apr 18, 9:40a', label: 'Technician assigned', detail: 'Ali Raza' },
    ],
  },
  {
    id: 'j2',
    title: 'Generator Repair - Site 14',
    status: 'in-progress',
    technician: 'Sara Ahmed',
    date: '2026-04-20',
    client: 'Metro Build',
    description: 'Diagnose intermittent shutdowns and replace faulty components.',
    notes: 'Awaiting replacement fuse shipment (ETA tomorrow).',
    timeline: [
      { at: 'Apr 17, 2:05p', label: 'Reported by client', detail: 'Generator tripped twice during peak load' },
      { at: 'Apr 18, 10:22a', label: 'Parts ordered', detail: 'Fuse kit + breaker inspection kit' },
    ],
  },
  {
    id: 'j3',
    title: 'Elevator Safety Audit',
    status: 'completed',
    technician: 'Ali Raza',
    date: '2026-04-15',
    client: 'Acme Logistics',
    description: 'Annual safety audit and documentation sign-off.',
    notes: 'Completed and signed off. Report uploaded to compliance portal.',
    timeline: [
      { at: 'Apr 14, 8:30a', label: 'Checklist completed', detail: 'All safety items passed' },
      { at: 'Apr 15, 4:10p', label: 'Client confirmation', detail: 'Acme Logistics approved closure' },
    ],
  },
  {
    id: 'j4',
    title: 'Access Control Upgrade',
    status: 'pending',
    technician: 'Hassan Malik',
    date: '2026-04-25',
    client: 'Metro Build',
    description: 'Install new readers and migrate access groups.',
    notes: 'Client requested after-hours installation window.',
    timeline: [{ at: 'Apr 19, 11:02a', label: 'Job created', detail: 'Scheduled for late-night window' }],
  },
]

export const mockNotifications = [
  { id: 'n1', text: 'New job assigned: HVAC Inspection - Tower A', read: false, at: '2m ago' },
  { id: 'n2', text: 'Client added note on Generator Repair', read: false, at: '12m ago' },
  { id: 'n3', text: 'Elevator Safety Audit marked completed', read: true, at: '1h ago' },
]
