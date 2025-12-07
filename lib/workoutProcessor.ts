import { HevyWorkoutRow, HevyActivity, HevyExercise, HevySet } from './types';

export function groupRowsByActivity(rows: HevyWorkoutRow[]): HevyActivity[] {
  const activityMap = new Map<string, HevyWorkoutRow[]>();

  // Group rows by activity key (title + start_time + end_time)
  for (const row of rows) {
    const key = `${row.title}|${row.start_time}|${row.end_time}`;
    if (!activityMap.has(key)) {
      activityMap.set(key, []);
    }
    activityMap.get(key)!.push(row);
  }

  // Convert grouped rows to activities
  const activities: HevyActivity[] = [];
  for (const [key, activityRows] of activityMap.entries()) {
    const [title, start_time, end_time] = key.split('|');
    const description = activityRows[0]?.description || '';

    // Group rows by exercise
    const exerciseMap = new Map<string, HevySet[]>();
    for (const row of activityRows) {
      const exerciseKey = row.exercise_title;
      if (!exerciseMap.has(exerciseKey)) {
        exerciseMap.set(exerciseKey, []);
      }
      exerciseMap.get(exerciseKey)!.push({
        set_index: row.set_index,
        set_type: row.set_type,
        weight_kg: row.weight_kg,
        reps: row.reps,
        distance_km: row.distance_km,
        duration_seconds: row.duration_seconds,
        rpe: row.rpe,
      });
    }

    // Convert to exercise array
    const exercises: HevyExercise[] = [];
    for (const [exerciseTitle, sets] of exerciseMap.entries()) {
      const firstRow = activityRows.find(r => r.exercise_title === exerciseTitle);
      exercises.push({
        exercise_title: exerciseTitle,
        superset_id: firstRow?.superset_id || null,
        exercise_notes: firstRow?.exercise_notes || '',
        sets: sets.sort((a, b) => a.set_index - b.set_index),
      });
    }

    activities.push({
      title,
      start_time,
      end_time,
      description,
      exercises,
    });
  }

  return activities;
}

export function getLastActivity(activities: HevyActivity[]): HevyActivity | null {
  if (activities.length === 0) return null;

  // Sort by end_time descending, then by start_time descending
  const sorted = [...activities].sort((a, b) => {
    const aEnd = new Date(a.end_time).getTime();
    const bEnd = new Date(b.end_time).getTime();
    if (aEnd !== bEnd) {
      return bEnd - aEnd; // Descending
    }
    const aStart = new Date(a.start_time).getTime();
    const bStart = new Date(b.start_time).getTime();
    return bStart - aStart; // Descending
  });

  return sorted[0];
}

export function extractLastActivity(rows: HevyWorkoutRow[]): HevyActivity | null {
  const activities = groupRowsByActivity(rows);
  return getLastActivity(activities);
}

