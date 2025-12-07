const fs = require('fs');
const { Decoder, Stream } = require('@garmin/fitsdk');

function analyzeFitFile(filePath, label) {
  console.log(`\n=== ${label} ===`);
  try {
    const fitBuffer = fs.readFileSync(filePath);
    const stream = Stream.fromArrayBuffer(fitBuffer.buffer.slice(fitBuffer.byteOffset, fitBuffer.byteOffset + fitBuffer.byteLength));
    const decoder = new Decoder(stream);

    console.log('Is valid FIT:', decoder.isFIT());
    console.log('Integrity check:', decoder.checkIntegrity());

    const result = decoder.read({
      convertDateTimesToDates: true,
      convertTypesToStrings: true,
      expandSubFields: true,
      expandComponents: true,
      applyScaleAndOffset: true,
    });

    console.log('\nMessage counts:');
    Object.keys(result.messages).forEach(key => {
      const count = Array.isArray(result.messages[key]) ? result.messages[key].length : 1;
      if (count > 0) {
        console.log(`  ${key}: ${count}`);
      }
    });

    if (result.errors && result.errors.length > 0) {
      console.log('\nErrors:', result.errors.length);
      result.errors.forEach(err => console.log('  -', err));
    }

    // Show key message details
    if (result.messages.fileIdMesgs && result.messages.fileIdMesgs[0]) {
      const fid = result.messages.fileIdMesgs[0];
      console.log('\nFile ID:', {
        type: fid.type,
        manufacturer: fid.manufacturer,
        timeCreated: fid.timeCreated,
      });
    }

    if (result.messages.activityMesgs && result.messages.activityMesgs[0]) {
      const act = result.messages.activityMesgs[0];
      console.log('\nActivity:', {
        timestamp: act.timestamp,
        numSessions: act.numSessions,
        totalTimerTime: act.totalTimerTime,
        hasLocalTimestamp: act.localTimestamp !== undefined,
      });
    }

    if (result.messages.sessionMesgs && result.messages.sessionMesgs[0]) {
      const sess = result.messages.sessionMesgs[0];
      console.log('\nSession:', {
        sport: sess.sport,
        subSport: sess.subSport,
        totalElapsedTime: sess.totalElapsedTime,
        totalTimerTime: sess.totalTimerTime,
      });
    }

    if (result.messages.setMesgs) {
      console.log('\nSets:', result.messages.setMesgs.length);
      if (result.messages.setMesgs.length > 0) {
        const firstSet = result.messages.setMesgs[0];
        console.log('  First set:', {
          timestamp: firstSet.timestamp,
          repetitions: firstSet.repetitions,
          weight: firstSet.weight,
          duration: firstSet.duration,
        });
      }
    }

    return true;
  } catch (error) {
    console.error('Error analyzing file:', error.message);
    return false;
  }
}

// Analyze working file
analyzeFitFile('./Activity.fit', 'Working Activity.fit');

// Note: To test generated file, convert a CSV first and save it, then analyze it here
// analyzeFitFile('./generated.fit', 'Generated FIT');

