import Papa from 'papaparse';
import { HevyWorkoutRow } from './types';

export function parseHevyCSV(csvContent: string): HevyWorkoutRow[] {
  const result = Papa.parse<HevyWorkoutRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => {
      // Normalize header names to match our type
      return header.trim().replace(/"/g, '');
    },
    transform: (value, field) => {
      // Handle empty values and convert types
      if (value === '' || value === null || value === undefined) {
        if (field === 'set_index') return 0;
        if (field === 'weight_kg' || field === 'reps' || field === 'distance_km' || 
            field === 'duration_seconds' || field === 'rpe') {
          return null;
        }
        if (field === 'superset_id') return null;
        return '';
      }
      
      // Convert numeric fields
      if (field === 'set_index') {
        return parseInt(value, 10) || 0;
      }
      if (field === 'weight_kg' || field === 'reps' || field === 'distance_km' || 
          field === 'duration_seconds' || field === 'rpe') {
        const num = parseFloat(value);
        return isNaN(num) ? null : num;
      }
      
      return value.trim();
    },
  });

  if (result.errors.length > 0) {
    console.warn('CSV parsing errors:', result.errors);
  }

  return result.data;
}

