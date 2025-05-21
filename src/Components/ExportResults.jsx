import React from 'react';

const ExportResults = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">💾 Export Results</h2>

      {/* Container aligned left with fixed width */}
      <div className="flex justify-between items-center w-[650px] px-4">
        {/* Button 1 at start */}
        <button
          className="border border-black text-black bg-white rounded px-4 py-2 hover:text-orange-500 hover:border-orange-500"
        >
          Download as CSV
        </button>

        {/* Button 2 at end */}
        <button
          className="border border-black text-black bg-white rounded px-4 py-2 hover:text-orange-500 hover:border-orange-500"
        >
          Download as Excel
        </button>
      </div>
    </div>
  );
};

export default ExportResults;
