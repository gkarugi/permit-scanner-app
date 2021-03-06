import { schema } from 'normalizr';

// Define a occupants schema
export const occupant = new schema.Entity('occupants');

// Define a vehicles schema
export const vehicle = new schema.Entity('vehicles');

// Define a permits schema
export const permit = new schema.Entity('permits');

// Define your scan
export const scan = new schema.Entity('scans', {
  vehicle: vehicle,
  permit: permit,
  occupants: [occupant]
});

export const scansArray = new schema.Array(scan);
