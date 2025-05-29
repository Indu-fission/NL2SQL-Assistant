import React, { useState } from 'react';

const ResultTable = ({ data }) => {
  const rowsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  if (!data || data.length === 0) return <div className="p-4">No data available</div>;

  const columns = Object.keys(data[0]);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const isPaginationNeeded = data.length > rowsPerPage;

  const displayedData = isPaginationNeeded
    ? data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : data;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full overflow-x-auto mt-4">
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="border border-gray-300 px-4 py-2 bg-gray-200 text-left"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayedData.map((row, index) => (
            <tr key={index} className="hover:bg-gray-100 hover:text-black">
              {columns.map((col) => (
                <td key={col} className="border border-gray-300 px-4 py-2">
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {isPaginationNeeded && (
        <div className="flex justify-end mt-3 space-x-2 text-sm">
          {/* Prev Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-7 h-7 rounded-full flex items-center justify-center border border-gray-400 transition
              ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#b58932] hover:text-white'}`}
          >
            &lt;
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded border text-xs ${
                currentPage === i + 1
                  ? 'bg-blue-100 font-semibold'
                  : 'hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-7 h-7 rounded-full flex items-center justify-center border border-gray-400 transition
              ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#b58932] hover:text-white'}`}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultTable;