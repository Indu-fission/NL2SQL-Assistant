import React, { useState, useRef } from "react";
import { FiCopy, FiX } from "react-icons/fi";
import { HiChevronRight, HiChevronDown } from "react-icons/hi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Sidebar({ isOpen, queryHistory = [], handleProcess }) {
  const [showSchema, setShowSchema] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false); 
  const fileInputRef = useRef(null);

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

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files);
    const validFiles = [];
    let duplicateFound = false;
    let invalidTypeFound = false;

    newFiles.forEach((file) => {
      const isDuplicate = uploadedFiles.some((f) => f.name === file.name);
      const isCsv = file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv");

      if (isDuplicate) {
        duplicateFound = true;
        toast.error(`File "${file.name}" already uploaded`, {
          position: "bottom-center",
          autoClose: 3000,
        });
        return;
      }

      if (!isCsv) {
        invalidTypeFound = true;
        toast.error(`Invalid file type: ${file.name}`, {
          position: "bottom-center",
          autoClose: 3000,
        });
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles]);
      toast.success("File(s) uploaded successfully", {
        position: "bottom-center",
        autoClose: 3000,
      });
      setUploadSuccess(true); // Set upload success to true
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    if (uploadedFiles.length === 1) {
      setUploadSuccess(false); // reset on file removal
    }
  };

  return (
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-300 px-6 py-6 z-30 transition-transform duration-300 ease-in-out transform ${
        isOpen ? "translate-x-0 w-80" : "-translate-x-full w-80"
      } font-sans text-gray-800 text-[15px] leading-relaxed overflow-y-auto`}
    >
      {/* About Section */}
      <div className="mb-6">
        <h2 className="text-[18px] font-semibold mb-2">📝 About</h2>
        <p>
          This app converts natural language into SQL queries for a SQLite
          database (<code>data/my_database.db</code>) using AI agents:
        </p>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>
            <strong>Schema Loader:</strong> Extracts DB structure.
          </li>
          <li>
            <strong>Selector Agent:</strong> Validates query feasibility.
          </li>
          <li>
            <strong>Decomposer Agent:</strong> Breaks query into parts.
          </li>
          <li>
            <strong>Refiner Agent:</strong> Generates clean SQLite SQL.
          </li>
          <li>
            <strong>Visualization Agent:</strong> Suggests charts.
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-[18px] font-semibold mb-2">📁 Upload Files</h2>
        <p className="text-sm mb-2 text-gray-600">Upload CSV files</p>

        <ToastContainer />

        {/* File upload UI */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current.click()}
          className="p-4 rounded-md text-center text-sm mb-2 transition-all duration-300 ease-in-out border border-gray-400 text-gray-700 bg-gray-50 shadow-sm cursor-pointer hover:bg-gray-100"
        >
          Drag and drop files here or click to browse
          <br />
          <span className="text-xs text-gray-400">
            Limit 200MB per file • CSV only
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Button to browse files */}
        <div className="text-center">
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-full mt-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Browse Files
          </button>
        </div>

        {/* Show uploaded files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-3 space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex  justify-between cursor items-center bg-blue-50 border border-blue-200 p-2 rounded shadow-sm text-sm"
              >
                <span className="truncate max-w-[180px]">{file.name}</span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveFile(index)}
                  title="Remove file"
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Button to create tables and insert data */}
        {uploadSuccess && (
          <div className="p-4 max-w-xs mt-4">
            <button
              className="border border-black text-black bg-white rounded px-3 py-1.5
                         hover:text-orange-500 hover:border-orange-500 transition-colors duration-200"
            >
              Create Tables and Insert Data
            </button>
          </div>
        )}
      </div>

      {/* Schema Section */}
      <div className="mb-6 p-4 bg-gray-50 border border-gray-300 rounded shadow-sm">
        <div
          className="flex justify-between items-center cursor-pointer group"
          onClick={() => setShowSchema(!showSchema)}
        >
          <span className="font-light text-gray-700 group-hover:text-orange-500 transition-colors">
            View Schema
          </span>
          <span className="group-hover:text-orange-500 transition-colors">
            {showSchema ? <HiChevronDown /> : <HiChevronRight />}
          </span>
        </div>

        {showSchema && (
          <div className="mt-2 relative bg-white border border-gray-200 p-2 rounded text-sm max-h-48 overflow-y-auto">
            <pre className="text-gray-800 whitespace-pre-wrap">
              {schemaText}
            </pre>
            <div className="absolute top-2 right-2 flex items-center">
              {copied ? (
                <span className="text-green-600 text-xs font-semibold">
                  Copied!
                </span>
              ) : (
                <button
                  onClick={handleCopy}
                  className="text-blue-500 hover:text-orange-500"
                  title="Copy"
                >
                  <FiCopy className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Query History */}
{queryHistory.length > 0 && (
  <div className="mb-6">
    <h2 className="text-[18px] font-semibold mb-2">🕘 Query History</h2>

    <div className="mt-3 space-y-2">
      {queryHistory.slice().reverse().map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-blue-50 border border-blue-200 p-2 rounded shadow-sm text-sm"
        >
          <span
            className="truncate max-w-[180px] cursor-pointer" 
            onClick={() => handleProcess(item)}
          >
            {item}
          </span>

          <button className="text-red-500 hover:text-red-700">

          </button>
        </div>
      ))}
    </div>
  </div>
)}

    </div>
  );
}