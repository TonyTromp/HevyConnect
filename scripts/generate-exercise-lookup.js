const fs = require('fs');
const path = require('path');

// Read the profile.js file
const profilePath = path.join(__dirname, '../node_modules/@garmin/fitsdk/src/profile.js');
const profileContent = fs.readFileSync(profilePath, 'utf8');

// Map category IDs to category names and exercise name enum names
const categoryMap = {
  0: { name: 'benchPress', enum: 'benchPressExerciseName' },
  1: { name: 'calfRaise', enum: 'calfRaiseExerciseName' },
  2: { name: 'cardio', enum: 'cardioExerciseName' },
  3: { name: 'carry', enum: 'carryExerciseName' },
  4: { name: 'chop', enum: 'chopExerciseName' },
  5: { name: 'core', enum: 'coreExerciseName' },
  6: { name: 'crunch', enum: 'crunchExerciseName' },
  7: { name: 'curl', enum: 'curlExerciseName' },
  8: { name: 'deadlift', enum: 'deadliftExerciseName' },
  9: { name: 'flye', enum: 'flyeExerciseName' },
  10: { name: 'hipRaise', enum: 'hipRaiseExerciseName' },
  11: { name: 'hipStability', enum: 'hipStabilityExerciseName' },
  12: { name: 'hipSwing', enum: 'hipSwingExerciseName' },
  13: { name: 'hyperextension', enum: 'hyperextensionExerciseName' },
  14: { name: 'lateralRaise', enum: 'lateralRaiseExerciseName' },
  15: { name: 'legCurl', enum: 'legCurlExerciseName' },
  16: { name: 'legRaise', enum: 'legRaiseExerciseName' },
  17: { name: 'lunge', enum: 'lungeExerciseName' },
  18: { name: 'olympicLift', enum: 'olympicLiftExerciseName' },
  19: { name: 'plank', enum: 'plankExerciseName' },
  20: { name: 'plyo', enum: 'plyoExerciseName' },
  21: { name: 'pullUp', enum: 'pullUpExerciseName' },
  22: { name: 'pushUp', enum: 'pushUpExerciseName' },
  23: { name: 'row', enum: 'rowExerciseName' },
  24: { name: 'shoulderPress', enum: 'shoulderPressExerciseName' },
  25: { name: 'shoulderStability', enum: 'shoulderStabilityExerciseName' },
  26: { name: 'shrug', enum: 'shrugExerciseName' },
  27: { name: 'sitUp', enum: 'sitUpExerciseName' },
  28: { name: 'squat', enum: 'squatExerciseName' },
  29: { name: 'totalBody', enum: 'totalBodyExerciseName' },
  30: { name: 'tricepsExtension', enum: 'tricepsExtensionExerciseName' },
  31: { name: 'warmUp', enum: 'warmUpExerciseName' },
  32: { name: 'run', enum: 'runExerciseName' },
  33: { name: 'bike', enum: 'bikeExerciseName' },
  35: { name: 'move', enum: 'moveExerciseName' },
  36: { name: 'pose', enum: 'poseExerciseName' },
  37: { name: 'bandedExercises', enum: 'bandedExercisesExerciseName' },
  38: { name: 'battleRope', enum: 'battleRopeExerciseName' },
  39: { name: 'elliptical', enum: 'ellipticalExerciseName' },
  40: { name: 'floorClimb', enum: 'floorClimbExerciseName' },
  41: { name: 'indoorBike', enum: 'indoorBikeExerciseName' },
  42: { name: 'indoorRow', enum: 'indoorRowExerciseName' },
  43: { name: 'ladder', enum: 'ladderExerciseName' },
  44: { name: 'sandbag', enum: 'sandbagExerciseName' },
  45: { name: 'sled', enum: 'sledExerciseName' },
  46: { name: 'sledgeHammer', enum: 'sledgeHammerExerciseName' },
  47: { name: 'stairStepper', enum: 'stairStepperExerciseName' },
  49: { name: 'suspension', enum: 'suspensionExerciseName' },
  50: { name: 'tire', enum: 'tireExerciseName' },
};

// Function to extract exercise names from an enum block
function extractExerciseNames(enumName, content) {
  const regex = new RegExp(`${enumName}:\\s*\\{([^}]+)\\}`, 's');
  const match = content.match(regex);
  if (!match) return [];
  
  const enumContent = match[1];
  const exercises = [];
  
  // Parse lines like: 0: "exerciseName",
  const lines = enumContent.split('\n').map(l => l.trim()).filter(l => l);
  
  for (const line of lines) {
    // Match: number: "string",
    const exerciseMatch = line.match(/(\d+):\s*"([^"]+)"/);
    if (exerciseMatch) {
      const id = parseInt(exerciseMatch[1]);
      const name = exerciseMatch[2];
      exercises.push({ id, name });
    }
  }
  
  return exercises.sort((a, b) => a.id - b.id);
}

// Build lookup table
const lookupTable = [];

for (const [categoryIdStr, categoryInfo] of Object.entries(categoryMap)) {
  const categoryId = parseInt(categoryIdStr);
  const exercises = extractExerciseNames(categoryInfo.enum, profileContent);
  
  for (const exercise of exercises) {
    lookupTable.push({
      garmin: {
        categoryId: categoryId,
        categoryName: categoryInfo.name,
        exerciseId: exercise.id,
        exerciseName: exercise.name
      },
      hevy: {
        exerciseTitle: null // To be populated with common HEVY exercise name variations
      }
    });
  }
}

// Write to JSON file
const outputPath = path.join(__dirname, '../exercise-lookup-table.json');
fs.writeFileSync(outputPath, JSON.stringify(lookupTable, null, 2));
console.log(`Created ${outputPath} with ${lookupTable.length} entries`);

// Also create a summary
console.log('\nSummary by category:');
const categoryCounts = {};
for (const entry of lookupTable) {
  const catName = entry.garmin.categoryName;
  categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
}
for (const [cat, count] of Object.entries(categoryCounts).sort()) {
  console.log(`  ${cat}: ${count} exercises`);
}

