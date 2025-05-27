import React from 'react';

const ResultTable = ({ data }) => {
  if (!data.length) return null;

  const columns = Object.keys(data[0]);

  return (
    <table className="w-full table-auto border-collapse border border-gray-300 mt-4">
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col}
              className="border border-gray-300 px-4 py-2 bg-gray-200"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index} className="hover:bg-gray-100">
            {columns.map((col) => (
              <td key={col} className="border border-gray-300 px-4 py-2">
                {row[col]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultTable;