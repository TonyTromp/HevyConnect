'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface FitFileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export default function FitFileUpload({ onFileSelect, isProcessing }: FitFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const fitFile = files.find(file => file.name.endsWith('.fit'));
    
    if (fitFile) {
      onFileSelect(fitFile);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.fit')) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`border border-2 border-dashed rounded p-3 text-center ${
        isDragging
          ? 'border-primary bg-primary bg-opacity-10'
          : 'border-secondary'
      } ${isProcessing ? 'opacity-50' : ''}`}
      style={{ cursor: isProcessing ? 'not-allowed' : 'pointer' }}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".fit"
        onChange={handleFileInputChange}
        className="d-none"
        disabled={isProcessing}
      />
      <div>
        <svg
          className="mx-auto mb-2"
          style={{ width: '32px', height: '32px' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <div className="small text-muted">
          <span className="text-primary fw-semibold">Click to upload</span> or drag and drop
        </div>
        <p className="small text-muted mb-0 mt-1">FIT files only</p>
      </div>
    </div>
  );
}

