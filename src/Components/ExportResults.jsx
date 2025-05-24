// import React from 'react';

// const ExportResults = () => {
//   return (
//     <div className="p-4">
//       <h2 className="text-lg font-semibold mb-4">💾 Export Results</h2>

//       {/* Container aligned left with fixed width */}
//       <div className="flex justify-between items-center w-[650px] px-4">
//         {/* Button 1 at start */}
//         <button
//           className="border border-black text-black bg-white rounded px-4 py-2 hover:text-orange-500 hover:border-orange-500"
//         >
//           Download as CSV
//         </button>

//         {/* Button 2 at end */}
//         <button
//           className="border border-black text-black bg-white rounded px-4 py-2 hover:text-orange-500 hover:border-orange-500"
//         >
//           Download as Excel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ExportResults;


import React, { useState } from 'react';
import axios from 'axios';

const ExportResults = () => {
  const [csvLoading, setCsvLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);

  const handleDownload = async (type) => {
    const isCSV = type === 'csv';
    const setLoading = isCSV ? setCsvLoading : setExcelLoading;
    const endpoint = isCSV
      ? 'http://localhost:8000/download/csv'
      : 'http://localhost:8000/download/excel';

    setLoading(true);
    try {
      const response = await axios.get(endpoint, {
        responseType: 'blob',
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.status === 200) {
        const contentDisposition = response.headers['content-disposition'];
        const fileNameMatch = contentDisposition?.match(/filename="?(.+)"?/);
        const fileName = fileNameMatch ? fileNameMatch[1] : 'download';

        const blob = new Blob([response.data]);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      } else {
        console.error(`Failed to download ${type.toUpperCase()} file`);
      }
    } catch (error) {
      console.error(`Error downloading ${type.toUpperCase()} file:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-semibold mb-2"  style={{ color: '#b58932' }}>💾 Export Results</h2>

      <div className="flex justify-between items-center w-[650px] px-4">
      
        <button
          onClick={() => handleDownload('csv')}
          className="border border-black text-black bg-white rounded px-4 py-2 hover:text-orange-500 hover:border-orange-500 flex items-center gap-2"
        >
          {csvLoading ? (
            <>
              <span className="animate-spin">🔄</span> Downloading CSV...
            </>
          ) : (
            'Download as CSV'
          )}
        </button>


        <button
          onClick={() => handleDownload('excel')}
          className="border border-black text-black bg-white rounded px-4 py-2 hover:text-orange-500 hover:border-orange-500 flex items-center gap-2"
        >
          {excelLoading ? (
            <>
              <span className="animate-spin">🔄</span> Downloading Excel...
            </>
          ) : (
            'Download as Excel'
          )}
        </button>
      </div>
    </div>
  );
};

export default ExportResults;