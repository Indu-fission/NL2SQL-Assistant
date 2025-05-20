// File: Components/Charts/ResultTable.jsx
import React from 'react';

const ResultTable = ({ data }) => {
  if (!data || data.length === 0) return <div className="p-4">No data available</div>;

  const columns = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col} className="px-4 py-2 border-b text-left bg-gray-100">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map(col => (
                <td key={col} className="px-4 py-2 border-b">{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;
