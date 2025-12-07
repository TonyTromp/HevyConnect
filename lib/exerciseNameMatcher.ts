// Exercise name matcher for mapping HEVY exercise names to Garmin FIT exercise categories and subtypes

interface ExerciseMatch {
  category: number;
  categorySubtype: number;
  confidence: number;
}

interface LookupTableEntry {
  garmin: {
    categoryId: number;
    categoryName: string;
    exerciseId: number;
    exerciseName: string;
  };
  hevy: {
    exerciseTitle: string | null;
  };
}

// Cache for the lookup table
let lookupTableCache: LookupTableEntry[] | null = null;
let lookupTablePromise: Promise<LookupTableEntry[]> | null = null;

/**
 * Load the exercise lookup table from file system (server-side) or HTTP (client-side)
 */
async function loadLookupTable(): Promise<LookupTableEntry[]> {
  // Return cached value if available
  if (lookupTableCache) {
    return lookupTableCache;
  }

  // Return existing promise if already loading
  if (lookupTablePromise) {
    return lookupTablePromise;
  }

  // Start loading the lookup table
  lookupTablePromise = (async () => {
    try {
      // Server-side: read directly from file system (faster)
      if (typeof window === 'undefined') {
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.join(process.cwd(), 'public', 'exercise-lookup-table.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        lookupTableCache = data as LookupTableEntry[];
        return lookupTableCache;
      }

      // Client-side: fetch from HTTP API route
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/exercise-lookup`);
      
      if (!response.ok) {
        throw new Error(`Failed to load exercise lookup table: ${response.statusText}`);
      }

      const data = await response.json();
      lookupTableCache = data as LookupTableEntry[];
      return lookupTableCache;
    } catch (error) {
      console.error('Error loading exercise lookup table:', error);
      // Return empty array as fallback
      return [];
    } finally {
      lookupTablePromise = null;
    }
  })();

  return lookupTablePromise;
}

// Normalize exercise name for matching
function normalizeExerciseName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

// Calculate similarity between two strings (simple Levenshtein-like scoring)
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeExerciseName(str1);
  const s2 = normalizeExerciseName(str2);
  
  // Exact match
  if (s1 === s2) return 1.0;
  
  // Check if one contains the other
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Check word-by-word matching
  const words1 = s1.split(' ');
  const words2 = s2.split(' ');
  const commonWords = words1.filter(w => words2.includes(w));
  if (commonWords.length > 0) {
    return 0.5 + (commonWords.length / Math.max(words1.length, words2.length)) * 0.3;
  }
  
  // Check character similarity
  let matches = 0;
  const minLen = Math.min(s1.length, s2.length);
  for (let i = 0; i < minLen; i++) {
    if (s1[i] === s2[i]) matches++;
  }
  
  return matches / Math.max(s1.length, s2.length) * 0.5;
}

// Exercise name mappings - common HEVY exercise names to FIT categories and subtypes
const exerciseMappings: Array<{
  keywords: string[];
  category: number;
  categorySubtype: number;
  exerciseName: string;
}> = [
  // Bench Press
  { keywords: ['bench press', 'chest press'], category: 0, categorySubtype: 1, exerciseName: 'barbellBenchPress' },
  { keywords: ['dumbbell bench', 'db bench'], category: 0, categorySubtype: 6, exerciseName: 'dumbbellBenchPress' },
  { keywords: ['incline bench'], category: 0, categorySubtype: 8, exerciseName: 'inclineBarbellBenchPress' },
  { keywords: ['incline dumbbell'], category: 0, categorySubtype: 9, exerciseName: 'inclineDumbbellBenchPress' },
  
  // Squat
  { keywords: ['squat'], category: 28, categorySubtype: 61, exerciseName: 'squat' },
  { keywords: ['back squat', 'barbell squat'], category: 28, categorySubtype: 6, exerciseName: 'barbellBackSquat' },
  { keywords: ['front squat'], category: 28, categorySubtype: 8, exerciseName: 'barbellFrontSquat' },
  { keywords: ['goblet squat'], category: 28, categorySubtype: 37, exerciseName: 'gobletSquat' },
  { keywords: ['leg press'], category: 28, categorySubtype: 0, exerciseName: 'legPress' },
  
  // Deadlift
  { keywords: ['deadlift'], category: 8, categorySubtype: 0, exerciseName: 'barbellDeadlift' },
  { keywords: ['romanian deadlift', 'rdl'], category: 8, categorySubtype: 23, exerciseName: 'romanianDeadlift' },
  { keywords: ['sumo deadlift'], category: 8, categorySubtype: 15, exerciseName: 'sumoDeadlift' },
  { keywords: ['trap bar deadlift'], category: 8, categorySubtype: 17, exerciseName: 'trapBarDeadlift' },
  
  // Pull Up / Chin Up
  { keywords: ['pull up', 'pullup'], category: 21, categorySubtype: 38, exerciseName: 'pullUp' },
  { keywords: ['chin up', 'chinup'], category: 21, categorySubtype: 39, exerciseName: 'chinUp' },
  { keywords: ['lat pulldown', 'lat pull'], category: 21, categorySubtype: 13, exerciseName: 'latPulldown' },
  { keywords: ['wide grip pull'], category: 21, categorySubtype: 26, exerciseName: 'wideGripPullUp' },
  
  // Row
  { keywords: ['barbell row', 'bent over row'], category: 23, categorySubtype: 0, exerciseName: 'barbellRow' },
  { keywords: ['dumbbell row', 'db row'], category: 23, categorySubtype: 1, exerciseName: 'dumbbellRow' },
  { keywords: ['cable row'], category: 23, categorySubtype: 2, exerciseName: 'cableRow' },
  { keywords: ['t-bar row'], category: 23, categorySubtype: 3, exerciseName: 'tBarRow' },
  { keywords: ['seated row'], category: 23, categorySubtype: 4, exerciseName: 'seatedCableRow' },
  
  // Shoulder Press
  { keywords: ['shoulder press', 'overhead press'], category: 24, categorySubtype: 0, exerciseName: 'arnoldPress' },
  { keywords: ['dumbbell shoulder', 'db shoulder'], category: 24, categorySubtype: 1, exerciseName: 'dumbbellShoulderPress' },
  { keywords: ['military press'], category: 24, categorySubtype: 2, exerciseName: 'militaryPress' },
  { keywords: ['barbell shoulder'], category: 24, categorySubtype: 3, exerciseName: 'barbellShoulderPress' },
  
  // Curl
  { keywords: ['bicep curl', 'biceps curl'], category: 7, categorySubtype: 0, exerciseName: 'alternatingDumbbellCurl' },
  { keywords: ['barbell curl'], category: 7, categorySubtype: 1, exerciseName: 'barbellCurl' },
  { keywords: ['dumbbell curl', 'db curl'], category: 7, categorySubtype: 2, exerciseName: 'dumbbellCurl' },
  { keywords: ['hammer curl'], category: 7, categorySubtype: 3, exerciseName: 'hammerCurl' },
  { keywords: ['cable curl'], category: 7, categorySubtype: 4, exerciseName: 'cableCurl' },
  
  // Triceps Extension
  { keywords: ['tricep extension', 'triceps extension'], category: 30, categorySubtype: 0, exerciseName: 'benchDip' },
  { keywords: ['tricep pushdown', 'triceps pushdown'], category: 30, categorySubtype: 1, exerciseName: 'cableTricepsPushdown' },
  { keywords: ['overhead tricep', 'overhead triceps'], category: 30, categorySubtype: 2, exerciseName: 'overheadTricepsExtension' },
  { keywords: ['close grip bench'], category: 30, categorySubtype: 3, exerciseName: 'closeGripBarbellBenchPress' },
  
  // Push Up
  { keywords: ['push up', 'pushup'], category: 22, categorySubtype: 0, exerciseName: 'chestPressWithBand' },
  { keywords: ['incline push'], category: 22, categorySubtype: 1, exerciseName: 'inclinePushUp' },
  { keywords: ['decline push'], category: 22, categorySubtype: 2, exerciseName: 'declinePushUp' },
  
  // Lunge
  { keywords: ['lunge'], category: 17, categorySubtype: 0, exerciseName: 'overheadLunge' },
  { keywords: ['walking lunge'], category: 17, categorySubtype: 1, exerciseName: 'walkingLunge' },
  { keywords: ['reverse lunge'], category: 17, categorySubtype: 2, exerciseName: 'reverseLunge' },
  { keywords: ['split squat'], category: 17, categorySubtype: 3, exerciseName: 'splitSquat' },
  
  // Leg Curl
  { keywords: ['leg curl'], category: 15, categorySubtype: 0, exerciseName: 'legCurl' },
  { keywords: ['lying leg curl'], category: 15, categorySubtype: 1, exerciseName: 'lyingLegCurl' },
  { keywords: ['seated leg curl'], category: 15, categorySubtype: 2, exerciseName: 'seatedLegCurl' },
  
  // Calf Raise
  { keywords: ['calf raise'], category: 1, categorySubtype: 18, exerciseName: 'standingCalfRaise' },
  { keywords: ['seated calf'], category: 1, categorySubtype: 6, exerciseName: 'seatedCalfRaise' },
  
  // Core
  { keywords: ['plank'], category: 19, categorySubtype: 0, exerciseName: '45DegreePlank' },
  { keywords: ['sit up'], category: 27, categorySubtype: 0, exerciseName: 'alternatingSitUp' },
  { keywords: ['crunch'], category: 6, categorySubtype: 0, exerciseName: 'bicycleCrunch' },
  { keywords: ['russian twist'], category: 5, categorySubtype: 46, exerciseName: 'russianTwist' },
  
  // Hip Raise
  { keywords: ['hip raise', 'hip thrust'], category: 10, categorySubtype: 0, exerciseName: 'barbellHipThrustOnFloor' },
  { keywords: ['glute bridge'], category: 10, categorySubtype: 11, exerciseName: 'hipRaise' },
  
  // Shrug
  { keywords: ['shrug'], category: 26, categorySubtype: 0, exerciseName: 'barbellShrug' },
  { keywords: ['dumbbell shrug'], category: 26, categorySubtype: 1, exerciseName: 'dumbbellShrug' },
  
  // Lateral Raise
  { keywords: ['lateral raise'], category: 14, categorySubtype: 0, exerciseName: '45DegreeCableExternalRotation' },
  { keywords: ['side raise'], category: 14, categorySubtype: 1, exerciseName: 'alternatingLateralRaiseWithStaticHold' },
  
  // Flye
  { keywords: ['fly', 'flye'], category: 9, categorySubtype: 2, exerciseName: 'dumbbellFlye' },
  { keywords: ['pec fly'], category: 9, categorySubtype: 0, exerciseName: 'cableCrossover' },
  
  // Burpee
  { keywords: ['burpee'], category: 29, categorySubtype: 0, exerciseName: 'burpee' },
];

/**
 * Find the best matching FIT exercise for a given HEVY exercise name
 * First checks the lookup table for exact matches, then falls back to fuzzy matching
 */
export async function findExerciseMatch(hevyExerciseName: string): Promise<ExerciseMatch> {
  const normalized = normalizeExerciseName(hevyExerciseName);
  const lookupTable = await loadLookupTable();
  
  // Step 1: Check lookup table for exact matches (where hevy.exerciseTitle is populated)
  for (const entry of lookupTable) {
    if (entry.hevy.exerciseTitle) {
      const hevyTitleNormalized = normalizeExerciseName(entry.hevy.exerciseTitle);
      if (hevyTitleNormalized === normalized) {
        // Exact match found in lookup table
        return {
          category: entry.garmin.categoryId,
          categorySubtype: entry.garmin.exerciseId,
          confidence: 1.0,
        };
      }
    }
  }
  
  // Step 2: If no exact match in lookup table, try fuzzy matching against lookup table entries
  let bestLookupMatch: ExerciseMatch | null = null;
  let bestLookupScore = 0;
  
  for (const entry of lookupTable) {
    if (entry.hevy.exerciseTitle) {
      const score = calculateSimilarity(normalized, entry.hevy.exerciseTitle);
      if (score > bestLookupScore && score > 0.7) {
        bestLookupScore = score;
        bestLookupMatch = {
          category: entry.garmin.categoryId,
          categorySubtype: entry.garmin.exerciseId,
          confidence: score,
        };
      }
    }
  }
  
  // If we found a good fuzzy match in lookup table, return it
  if (bestLookupMatch && bestLookupScore > 0.7) {
    return bestLookupMatch;
  }
  
  // Step 3: Fallback to keyword-based fuzzy matching (original method)
  let bestMatch: ExerciseMatch | null = null;
  let bestScore = 0;
  
  for (const mapping of exerciseMappings) {
    for (const keyword of mapping.keywords) {
      const score = calculateSimilarity(normalized, keyword);
      if (score > bestScore && score > 0.5) {
        bestScore = score;
        bestMatch = {
          category: mapping.category,
          categorySubtype: mapping.categorySubtype,
          confidence: score,
        };
      }
    }
  }
  
  // If we found a good keyword match, return it
  if (bestMatch && bestScore > 0.6) {
    return bestMatch;
  }
  
  // Step 4: Try fuzzy matching against Garmin exercise names in lookup table
  for (const entry of lookupTable) {
    const garminNameNormalized = normalizeExerciseName(entry.garmin.exerciseName);
    const score = calculateSimilarity(normalized, garminNameNormalized);
    if (score > bestScore && score > 0.5) {
      bestScore = score;
      bestMatch = {
        category: entry.garmin.categoryId,
        categorySubtype: entry.garmin.exerciseId,
        confidence: score,
      };
    }
  }
  
  // If still no good match, return default (totalBody)
  if (!bestMatch || bestScore < 0.5) {
    return {
      category: 29, // totalBody
      categorySubtype: 0,
      confidence: 0.3,
    };
  }
  
  return bestMatch;
}

