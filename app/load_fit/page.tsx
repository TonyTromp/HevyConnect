'use client';

import { useState } from 'react';
import FitFileUpload from '@/components/FitFileUpload';
import FitFileViewer from '@/components/FitFileViewer';
import { decodeFitFile, DecodedFitFile } from '@/lib/fitDecoder';
import Link from 'next/link';

export default function LoadFitPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [fitData, setFitData] = useState<DecodedFitFile | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setStatus(null);
    setFitData(null);

    try {
      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Decode FIT file
      const decoded = decodeFitFile(arrayBuffer);

      setFitData(decoded);
      setStatus({ type: 'success', message: 'FIT file loaded successfully!' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'An error occurred while loading the FIT file',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="container">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h1 className="card-title h3 mb-2">
                    FIT File Viewer
                  </h1>
                  <p className="text-muted small mb-0">
                    Upload a FIT file to view its contents
                  </p>
                </div>
                <Link href="/" className="btn btn-outline-secondary btn-sm">
                  ← Back to Converter
                </Link>
              </div>

              <FitFileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />

              {isProcessing && (
                <div className="text-center mt-3">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted small">Processing FIT file...</p>
                </div>
              )}

              {status && (
                <div className={`alert alert-${status.type === 'success' ? 'success' : 'danger'} mt-3 mb-0`}>
                  {status.message}
                </div>
              )}

              {fitData && <FitFileViewer data={fitData} />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

