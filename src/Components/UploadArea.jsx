import React, { useState } from 'react';
import UploadedFileCard from './UploadedFileCard';

const UploadArea = ({ onFileUpload, onFileRemove, file }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file) => {
    if (file && file.type === 'text/csv') {
      onFileUpload(file);
    } else {
      alert('Please upload a valid CSV file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragover');
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFile(selectedFile);
  };

  return (
    <div
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed p-4 rounded-md text-center transition-colors ${
        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      <p className="text-lg font-semibold">📁 Upload Files</p>
      <p className="text-sm text-gray-500">Drag and drop CSV files here</p>
      <p className="text-sm text-gray-400">Limit 200MB per file • CSV</p>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileInputChange}
        className="hidden"
        id="csvFileInput"
      />
      <label
        htmlFor="csvFileInput"
        className="cursor-pointer inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Browse files
      </label>

      {file && (
        <div className="mt-4">
          <UploadedFileCard file={file} onRemove={onFileRemove} />
        </div>
      )}
    </div>
  );
};

export default UploadArea;
