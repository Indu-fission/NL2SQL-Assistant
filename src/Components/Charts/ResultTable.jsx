
// import React from 'react';

// const ResultTable = ({ data }) => {
//   if (!data || data.length === 0) return <div className="p-4">No data available</div>;

//   const columns = Object.keys(data[0]);

//   return (
//     <div className="p-4 w-full overflow-x-auto"> {/* This container handles scrolling */}
//       {/* Removed w-[1200px] from this div */}
//       <div className="border border-gray-300"> {/* Table container, now flexible */}
//         <table className="w-full rounded-lg border-collapse text-sm">
//           <thead className="bg-blue-100 text-gray-800">
//             <tr>
//               {columns.map((col) => (
//                 <th
//                   key={col}
//                   className="px-6 py-3 text-left font-bold border-b border-gray-300"
//                 >
//                   {col}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((row, rowIndex) => (
//               <tr
//                 key={rowIndex}
//                 className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
//               >
//                 {columns.map((col) => (
//                   <td
//                     key={col}
//                     className="px-6 py-2 border-b border-gray-200"
//                   >
//                     {row[col]}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ResultTable;


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
    <div className="p-4 w-full overflow-x-auto">
      <div className="border border-gray-300">
        <table className="w-full rounded-lg border-collapse text-sm">
          <thead className="bg-blue-100 text-gray-800">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-6 py-3 text-left font-bold border-b border-gray-300">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedData.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {columns.map((col) => (
                  <td key={col} className="px-6 py-2 border-b border-gray-200">
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isPaginationNeeded && (
        <div className="flex justify-end mt-4 space-x-2 text-sm">
          {/* Prev Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-6 h-6 rounded-full flex justify-center items-center border border-gray-400 transition-colors
              ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#b58932] hover:text-white'}`}
            aria-label="Previous Page"
            style={{ fontSize: '0.75rem', lineHeight: 1 }}
          >
            &lt;
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-2 py-0.5 border rounded text-xs ${
                currentPage === i + 1 ? 'bg-blue-100 font-semibold' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-6 h-6 rounded-full flex justify-center items-center border border-gray-400 transition-colors
              ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#b58932] hover:text-white'}`}
            aria-label="Next Page"
            style={{ fontSize: '0.75rem', lineHeight: 1 }}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultTable;