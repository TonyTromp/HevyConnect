export interface HevyWorkoutRow {
  title: string;
  start_time: string;
  end_time: string;
  description: string;
  exercise_title: string;
  superset_id: string | null;
  exercise_notes: string;
  set_index: number;
  set_type: string;
  weight_kg: number | null;
  reps: number | null;
  distance_km: number | null;
  duration_seconds: number | null;
  rpe: number | null;
}

export interface HevyActivity {
  title: string;
  start_time: string;
  end_time: string;
  description: string;
  exercises: HevyExercise[];
}

export interface HevyExercise {
  exercise_title: string;
  superset_id: string | null;
  exercise_notes: string;
  sets: HevySet[];
}

export interface HevySet {
  set_index: number;
  set_type: string;
  weight_kg: number | null;
  reps: number | null;
  distance_km: number | null;
  duration_seconds: number | null;
  rpe: number | null;
}

