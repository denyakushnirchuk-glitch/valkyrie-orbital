export const CAREER_PHASES = [
  { value: 'Proving Grounds',  label: 'Proving Grounds',  desc: 'First rockets, atmospheric tests' },
  { value: 'Orbital Dawn',     label: 'Orbital Dawn',     desc: 'First orbit, early satellites' },
  { value: 'Kerbin Dominance', label: 'Kerbin Dominance', desc: 'Mun, Minmus, full satellite networks' },
  { value: 'Deep Frontier',    label: 'Deep Frontier',    desc: 'Duna, Eve, interplanetary' },
  { value: 'Outer Reaches',    label: 'Outer Reaches',    desc: 'Jool system, Eeloo, extreme range' },
  { value: 'Legacy Era',       label: 'Legacy Era',       desc: 'Permanent infrastructure, colonies' },
  { value: 'Other',            label: 'Other',            desc: 'Unclassified operations' },
]

export const MISSION_TAGS = [
  'Suborbital', 'Orbital', 'Atmospheric',
  'LKO', 'HKO', 'Mun', 'Minmus',
  'Interplanetary', 'Duna', 'Eve', 'Jool', 'Eeloo',
  'Crewed', 'Uncrewed', 'Rescue',
  'Station', 'Docking', 'Reusable',
  'SSTO', 'Nuclear', 'Relay', 'Deep Space', 'Probe',
]

export const OUTCOMES = [
  { value: 'success',  label: 'Success',          color: '#3a9e6a' },
  { value: 'partial',  label: 'Partial success',  color: '#c9a84c' },
  { value: 'rescue',   label: 'Rescue operation', color: '#7a9ec9' },
  { value: 'failed',   label: 'Failed',           color: '#9e3a3a' },
]

export const VEHICLE_TYPES = [
  'Launch Vehicle', 'Lander', 'Station',
  'Transfer Stage', 'SSTO', 'Probe', 'Spaceplane', 'Tug', 'Other',
]

export const VEHICLE_STATUSES = [
  { value: 'active',   label: 'Active',   color: '#3a9e6a' },
  { value: 'retired',  label: 'Retired',  color: '#8a8a9a' },
  { value: 'lost',     label: 'Lost',     color: '#9e3a3a' },
]