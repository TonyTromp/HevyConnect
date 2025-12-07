'use client';

import { useState } from 'react';
import Link from 'next/link';
import FileUpload from '@/components/FileUpload';

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [includeSets, setIncludeSets] = useState(true);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('includeSets', includeSets.toString());

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Conversion failed' }));
        throw new Error(errorData.error || 'Conversion failed');
      }

      // Get the FIT file as a blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace('.csv', '.fit');
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setStatus({ type: 'success', message: 'FIT file downloaded successfully!' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred during conversion',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="text-center flex-grow-1">
                  <h1 className="card-title h3 mb-2">
                    HevyConnect
                  </h1>
                  <p className="text-muted small mb-0">
                    Convert your Hevy workouts to Garmin FIT format
                  </p>
                </div>
                <Link href="/load_fit" className="btn btn-outline-primary btn-sm ms-3">
                  View FIT Files
                </Link>
              </div>

              <div className="mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="includeSets"
                    checked={includeSets}
                    onChange={(e) => setIncludeSets(e.target.checked)}
                    disabled={isProcessing}
                  />
                  <label className="form-check-label" htmlFor="includeSets">
                    Include sets in FIT file
                  </label>
                </div>
              </div>

              <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />

              {isProcessing && (
                <div className="text-center mt-3">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted small">Processing your file...</p>
                </div>
              )}

              {status && (
                <div className={`alert alert-${status.type === 'success' ? 'success' : 'danger'} mt-3 mb-0`}>
                  {status.message}
                </div>
              )}

              <div className="text-center mt-4">
                <small className="text-muted">
                  <p className="mb-1">By default, only the last activity from your CSV will be converted.</p>
                  <p className="mb-0">Activities are identified by matching title, start time, and end time.</p>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

