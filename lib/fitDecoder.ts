import { Decoder, Stream, Profile } from '@garmin/fitsdk';

// FIT epoch: UTC 00:00 Dec 31 1989
const FIT_EPOCH = new Date('1989-12-31T00:00:00Z').getTime();

export interface DecodedFitFile {
  fileId?: {
    manufacturer?: number;
    type?: number;
    timeCreated?: Date;
    serialNumber?: number;
  };
  activities?: any[];
  sessions?: any[];
  laps?: any[];
  sets?: any[];
  errors?: any[];
}

export function fitTimestampToDate(timestamp: number): Date {
  // FIT timestamps are seconds since FIT epoch
  return new Date(FIT_EPOCH + timestamp * 1000);
}

export function decodeFitFile(arrayBuffer: ArrayBuffer): DecodedFitFile {
  const stream = Stream.fromArrayBuffer(arrayBuffer);
  const decoder = new Decoder(stream);

  // Check if it's a valid FIT file
  if (!decoder.isFIT()) {
    throw new Error('Invalid FIT file format');
  }

  // Read all messages
  const result = decoder.read({
    convertDateTimesToDates: true,
    convertTypesToStrings: true,
    expandSubFields: true,
    expandComponents: true,
    applyScaleAndOffset: true,
  });

  const decoded: DecodedFitFile = {
    errors: result.errors || [],
  };

  // Extract file ID
  if (result.messages.fileIdMesgs && result.messages.fileIdMesgs.length > 0) {
    const fileId = result.messages.fileIdMesgs[0];
    decoded.fileId = {
      manufacturer: fileId.manufacturer,
      type: fileId.type,
      timeCreated: fileId.timeCreated ? new Date(fileId.timeCreated) : undefined,
      serialNumber: fileId.serialNumber,
    };
  }

  // Extract activities
  if (result.messages.activityMesgs) {
    decoded.activities = result.messages.activityMesgs;
  }

  // Extract sessions
  if (result.messages.sessionMesgs) {
    decoded.sessions = result.messages.sessionMesgs;
  }

  // Extract laps
  if (result.messages.lapMesgs) {
    decoded.laps = result.messages.lapMesgs;
  }

  // Extract sets (strength training)
  if (result.messages.setMesgs) {
    decoded.sets = result.messages.setMesgs;
  }

  return decoded;
}

