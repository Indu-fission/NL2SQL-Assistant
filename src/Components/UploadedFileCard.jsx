import React from 'react';
import { X } from 'lucide-react'; // Or use any icon lib like react-icons

const UploadedFileCard = ({ file, onRemove }) => {
  const sizeKB = (file.size / 1024).toFixed(1);

  return (
    <div className="flex items-center justify-between bg-gray-100 p-3 rounded shadow">
      <div>
        <p className="font-medium text-gray-800">{file.name}</p>
        <p className="text-sm text-gray-500">{sizeKB} KB</p>
      </div>
      <button
        onClick={onRemove}
        className="text-red-500 hover:text-red-700 ml-4"
        title="Remove file"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default UploadedFileCard;
