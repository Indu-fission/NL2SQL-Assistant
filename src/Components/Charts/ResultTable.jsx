// import React from 'react';

// const ResultTable = ({ data }) => {
//   if (!data || data.length === 0) return <div className="p-4">No data available</div>;

//   const columns = Object.keys(data[0]);

//   return (
//     <div className="p-4 max-w-full overflow-x-auto">
//       <div className="min-w-[600px]">
//         <table className="min-w-full border-collapse border border-gray-300 text-sm rounded shadow">
//           <thead className="bg-gray-200 sticky top-0 z-10">
//             <tr>
//               {columns.map((col) => (
//                 <th
//                   key={col}
//                   className="px-4 py-2 text-left border border-gray-300 font-semibold"
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
//                     className="px-4 py-2 border border-gray-300"
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

import React from 'react';

const ResultTable = ({ data }) => {
  if (!data || data.length === 0) return <div className="p-4">No data available</div>;

  const columns = Object.keys(data[0]);

  return (
    <div className="p-4 w-full overflow-x-auto"> {/* This container handles scrolling */}
      {/* Removed w-[1200px] from this div */}
      <div className="border border-gray-300"> {/* Table container, now flexible */}
        <table className="w-full rounded-lg border-collapse text-sm">
          <thead className="bg-blue-100 text-gray-800">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-6 py-3 text-left font-bold border-b border-gray-300"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                {columns.map((col) => (
                  <td
                    key={col}
                    className="px-6 py-2 border-b border-gray-200"
                  >
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultTable;