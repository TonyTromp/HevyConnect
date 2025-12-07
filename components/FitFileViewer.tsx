'use client';

import { DecodedFitFile } from '@/lib/fitDecoder';

interface FitFileViewerProps {
  data: DecodedFitFile;
}

export default function FitFileViewer({ data }: FitFileViewerProps) {
  const formatDuration = (seconds: number | undefined): string => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const formatWeight = (weight: number | undefined): string => {
    if (!weight) return 'N/A';
    // Weight is stored directly in kg (without scaling) as a workaround for Garmin Connect
    return `${weight.toFixed(2)} kg`;
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return 'N/A';
    return date.toLocaleString();
  };

  return (
    <div className="mt-4">
      {/* File Information */}
      {data.fileId && (
        <div className="card mb-3">
          <div className="card-header">
            <h5 className="mb-0">File Information</h5>
          </div>
          <div className="card-body">
            <table className="table table-sm table-borderless mb-0">
              <tbody>
                {data.fileId.manufacturer !== undefined && (
                  <tr>
                    <th style={{ width: '40%' }}>Manufacturer:</th>
                    <td>{data.fileId.manufacturer}</td>
                  </tr>
                )}
                {data.fileId.type !== undefined && (
                  <tr>
                    <th>File Type:</th>
                    <td>{data.fileId.type} {data.fileId.type === 4 ? '(Activity)' : ''}</td>
                  </tr>
                )}
                {data.fileId.timeCreated && (
                  <tr>
                    <th>Created:</th>
                    <td>{formatDate(data.fileId.timeCreated)}</td>
                  </tr>
                )}
                {data.fileId.serialNumber !== undefined && (
                  <tr>
                    <th>Serial Number:</th>
                    <td>{data.fileId.serialNumber}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity Information */}
      {data.activities && data.activities.length > 0 && (
        <div className="card mb-3">
          <div className="card-header">
            <h5 className="mb-0">Activity Information</h5>
          </div>
          <div className="card-body">
            {data.activities.map((activity, index) => (
              <div key={index} className={index > 0 ? 'mt-3 pt-3 border-top' : ''}>
                <table className="table table-sm table-borderless mb-0">
                  <tbody>
                    {activity.timestamp && (
                      <tr>
                        <th style={{ width: '40%' }}>Timestamp:</th>
                        <td>{formatDate(new Date(activity.timestamp))}</td>
                      </tr>
                    )}
                    {activity.totalTimerTime !== undefined && (
                      <tr>
                        <th>Total Timer Time:</th>
                        <td>{formatDuration(activity.totalTimerTime)}</td>
                      </tr>
                    )}
                    {activity.numSessions !== undefined && (
                      <tr>
                        <th>Number of Sessions:</th>
                        <td>{activity.numSessions}</td>
                      </tr>
                    )}
                    {activity.type !== undefined && (
                      <tr>
                        <th>Activity Type:</th>
                        <td>{activity.type}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Session Information */}
      {data.sessions && data.sessions.length > 0 && (
        <div className="card mb-3">
          <div className="card-header">
            <h5 className="mb-0">Session Information</h5>
          </div>
          <div className="card-body">
            {data.sessions.map((session, index) => (
              <div key={index} className={index > 0 ? 'mt-3 pt-3 border-top' : ''}>
                <table className="table table-sm table-borderless mb-0">
                  <tbody>
                    {session.startTime && (
                      <tr>
                        <th style={{ width: '40%' }}>Start Time:</th>
                        <td>{formatDate(new Date(session.startTime))}</td>
                      </tr>
                    )}
                    {session.timestamp && (
                      <tr>
                        <th>End Time:</th>
                        <td>{formatDate(new Date(session.timestamp))}</td>
                      </tr>
                    )}
                    {session.totalElapsedTime !== undefined && (
                      <tr>
                        <th>Total Elapsed Time:</th>
                        <td>{formatDuration(session.totalElapsedTime)}</td>
                      </tr>
                    )}
                    {session.sport !== undefined && (
                      <tr>
                        <th>Sport:</th>
                        <td>{session.sport} {session.sport === 20 ? '(Strength Training)' : ''}</td>
                      </tr>
                    )}
                    {session.totalCalories !== undefined && (
                      <tr>
                        <th>Total Calories:</th>
                        <td>{session.totalCalories}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sets/Strength Training Data */}
      {data.sets && data.sets.length > 0 && (
        <div className="card mb-3">
          <div className="card-header">
            <h5 className="mb-0">Sets ({data.sets.length})</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-sm table-striped">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Repetitions</th>
                    <th>Weight</th>
                    <th>Set Type</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sets.map((set, index) => (
                    <tr key={index}>
                      <td>{set.timestamp ? formatDate(new Date(set.timestamp)) : 'N/A'}</td>
                      <td>{set.repetitions ?? 'N/A'}</td>
                      <td>{formatWeight(set.weight)}</td>
                      <td>
                        {set.setType === 0 ? 'Rest' : set.setType === 1 ? 'Active' : set.setType ?? 'N/A'}
                      </td>
                      <td>{set.duration !== undefined ? formatDuration(set.duration / 1000) : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Errors */}
      {data.errors && data.errors.length > 0 && (
        <div className="alert alert-warning">
          <strong>Decoding Warnings:</strong>
          <ul className="mb-0 mt-2">
            {data.errors.map((error: any, index: number) => (
              <li key={index}>{error.toString()}</li>
            ))}
          </ul>
        </div>
      )}

      {/* No Data Message */}
      {!data.fileId && !data.activities && !data.sessions && !data.sets && (
        <div className="alert alert-info">
          No data found in FIT file.
        </div>
      )}
    </div>
  );
}

