import React, { useState } from "react";
import { FiCopy, FiX } from "react-icons/fi";
import { HiChevronRight, HiChevronDown } from "react-icons/hi";

export default function Sidebar({ isOpen, uploadedFile, onFileUpload, onFileRemove }) {
  const [showSchema, setShowSchema] = useState(false);
  const [copied, setCopied] = useState(false);

  const schemaText = `Table: national_accounts_isic (
  sector TEXT,
  2015 INTEGER,
  2016 INTEGER,
  2017 INTEGER,
  2018 INTEGER,
  2019 INTEGER,
  2020 INTEGER,
  2021 INTEGER,
  2022 INTEGER,
  2023 INTEGER
);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(schemaText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      onFileUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      onFileUpload(file);
    }
  };

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-300 px-6 py-6 z-30 transition-transform duration-300 ease-in-out transform
        ${isOpen ? "translate-x-0 w-80" : "-translate-x-full w-80"} 
        font-sans text-gray-800 text-[15px] leading-relaxed overflow-y-auto`}
    >
      {/* Upload Section */}
      <div className="mb-6">
        <h2 className="text-[18px] font-semibold mb-2">📁 Upload Files</h2>
        <p className="text-sm mb-2 text-gray-600">Upload CSV files</p>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border border-dashed border-gray-400 p-4 rounded-md text-center text-sm text-gray-500 bg-gray-50 mb-2"
        >
          Drag and drop files here
          <br />
          <span className="text-xs text-gray-400">Limit 200MB per file • CSV</span>
        </div>

        <label className="block w-full text-center text-sm cursor-pointer bg-blue-500 text-white py-1 rounded hover:bg-blue-600">
          Browse files
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Uploaded file display */}
        {uploadedFile && (
          <div className="mt-3 flex justify-between items-center bg-blue-100 border border-blue-200 p-2 rounded shadow-sm text-sm">
            <span className="truncate">{uploadedFile.name}</span>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={onFileRemove}
              title="Remove file"
            >
              <FiX />
            </button>
          </div>
        )}
      </div>

      {/* About Section */}
      <div className="mb-6">
        <h2 className="text-[18px] font-semibold mb-2">📝 About</h2>
        <p>
          This app converts natural language into SQL queries for a SQLite database
          (<code>data/my_database.db</code>) using AI agents:
        </p>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li><strong>Schema Loader:</strong> Extracts DB structure.</li>
          <li><strong>Selector Agent:</strong> Validates query feasibility.</li>
          <li><strong>Decomposer Agent:</strong> Breaks query into parts.</li>
          <li><strong>Refiner Agent:</strong> Generates clean SQLite SQL.</li>
          <li><strong>Visualization Agent:</strong> Suggests charts.</li>
        </ul>
      </div>

      {/* Database Status */}
      <div className="mb-2">
        <h3 className="text-[15px] font-semibold text-gray-700 mb-1">Database Status</h3>
      </div>
      <div className="mb-6 p-4 bg-blue-100 border border-blue-200 rounded shadow-sm">
        <p className="text-green-600 font-bold">Database schema loaded.</p>
      </div>

      {/* Schema Viewer */}
      <div className="mb-6 p-4 bg-gray-50 border border-gray-300 rounded shadow-sm">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowSchema(!showSchema)}
        >
          <span className="font-semibold text-gray-700">View Schema</span>
          {showSchema ? <HiChevronDown /> : <HiChevronRight />}
        </div>

        {showSchema && (
          <div className="mt-2 text-gray-800 bg-white border border-gray-200 p-2 rounded text-sm">
            <pre>{schemaText}</pre>
            <button
              onClick={handleCopy}
              className="mt-2 text-blue-500 hover:text-blue-700 text-sm"
            >
              {copied ? "Copied!" : <FiCopy />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
