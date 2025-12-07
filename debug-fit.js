const fs = require('fs');
const { Decoder, Stream } = require('@garmin/fitsdk');

// Read the working FIT file
const fitBuffer = fs.readFileSync('./Activity.fit');
const stream = Stream.fromArrayBuffer(fitBuffer.buffer.slice(fitBuffer.byteOffset, fitBuffer.byteOffset + fitBuffer.byteLength));
const decoder = new Decoder(stream);

console.log('=== Analyzing Working Activity.fit ===\n');

// Check if valid
console.log('Is valid FIT:', decoder.isFIT());
console.log('Integrity check:', decoder.checkIntegrity());

// Decode all messages
const result = decoder.read({
  convertDateTimesToDates: true,
  convertTypesToStrings: true,
  expandSubFields: true,
  expandComponents: true,
  applyScaleAndOffset: true,
});

console.log('\n=== Message Counts ===');
console.log('File ID messages:', result.messages.fileIdMesgs?.length || 0);
console.log('Activity messages:', result.messages.activityMesgs?.length || 0);
console.log('Session messages:', result.messages.sessionMesgs?.length || 0);
console.log('Lap messages:', result.messages.lapMesgs?.length || 0);
console.log('Set messages:', result.messages.setMesgs?.length || 0);
console.log('Errors:', result.errors?.length || 0);

if (result.errors && result.errors.length > 0) {
  console.log('\nErrors:', result.errors);
}

// Show File ID details
if (result.messages.fileIdMesgs && result.messages.fileIdMesgs.length > 0) {
  console.log('\n=== File ID ===');
  const fileId = result.messages.fileIdMesgs[0];
  console.log(JSON.stringify(fileId, null, 2));
}

// Show Activity details
if (result.messages.activityMesgs && result.messages.activityMesgs.length > 0) {
  console.log('\n=== Activity Messages ===');
  result.messages.activityMesgs.forEach((activity, idx) => {
    console.log(`\nActivity ${idx + 1}:`);
    console.log(JSON.stringify(activity, null, 2));
  });
}

// Show Session details
if (result.messages.sessionMesgs && result.messages.sessionMesgs.length > 0) {
  console.log('\n=== Session Messages ===');
  result.messages.sessionMesgs.forEach((session, idx) => {
    console.log(`\nSession ${idx + 1}:`);
    console.log(JSON.stringify(session, null, 2));
  });
}

// Show Lap details
if (result.messages.lapMesgs && result.messages.lapMesgs.length > 0) {
  console.log('\n=== Lap Messages ===');
  result.messages.lapMesgs.forEach((lap, idx) => {
    console.log(`\nLap ${idx + 1}:`);
    console.log(JSON.stringify(lap, null, 2));
  });
}

// Show Set details (first few)
if (result.messages.setMesgs && result.messages.setMesgs.length > 0) {
  console.log('\n=== Set Messages (first 3) ===');
  result.messages.setMesgs.slice(0, 3).forEach((set, idx) => {
    console.log(`\nSet ${idx + 1}:`);
    console.log(JSON.stringify(set, null, 2));
  });
  console.log(`\n... and ${result.messages.setMesgs.length - 3} more sets`);
}

// Show all message types
console.log('\n=== All Message Types ===');
Object.keys(result.messages).forEach(key => {
  const count = Array.isArray(result.messages[key]) ? result.messages[key].length : 1;
  console.log(`${key}: ${count}`);
});

