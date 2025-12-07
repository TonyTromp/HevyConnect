declare module '@garmin/fitsdk' {
  export class Encoder {
    constructor(options?: { fieldDescriptions?: any });
    writeMesg(mesg: { mesgNum: number; [key: string]: any }): this;
    close(): Uint8Array;
  }

  export class Stream {
    static fromArrayBuffer(arrayBuffer: ArrayBuffer): Stream;
    static fromByteArray(data: number[]): Stream;
    static fromBuffer(buffer: Buffer): Stream;
  }

  export class Decoder {
    constructor(stream: Stream);
    static isFIT(stream: Stream): boolean;
    isFIT(): boolean;
    checkIntegrity(): boolean;
    read(options?: {
      mesgListener?: (mesgNum: number, message: any) => void;
      expandSubFields?: boolean;
      expandComponents?: boolean;
      applyScaleAndOffset?: boolean;
      convertTypesToStrings?: boolean;
      convertDateTimesToDates?: boolean;
      includeUnknownData?: boolean;
      mergeHeartRates?: boolean;
      decodeMemoGlobs?: boolean;
    }): { messages: any; errors: any[] };
  }

  export const Profile: {
    mesgNum: {
      [key: string]: number;
      fileId: number;
      activity: number;
      session: number;
      lap: number;
      set: number;
    };
    enums: {
      file: {
        [key: string]: number;
        activity: number;
      };
      sport: {
        [key: string]: number;
        strengthTraining: number;
      };
      event: {
        [key: string]: number;
        timer: number;
        lap: number;
      };
      eventType: {
        [key: string]: number;
        start: number;
        stop: number;
      };
      activityType: {
        [key: string]: number;
        generic: number;
      };
      setType: {
        [key: string]: number;
        rest: number;
        active: number;
      };
      exerciseCategory: {
        [key: string]: number;
        totalBody: number;
      };
    };
  };
}

