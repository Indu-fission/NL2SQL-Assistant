import React, { useState } from 'react';
import VisualizationPanel from './VisualizationPanel';

const QueryResults = ({ rows = 10, columns = 10, data }) => {
  const [selectedViz, setSelectedViz] = useState('table'); // default to table

  const visualizationTypes = [
    { label: 'Table', value: 'table' },
    { label: 'Bar Chart', value: 'bar' },
    { label: 'Line Chart', value: 'line' },
    { label: 'Pie Chart', value: 'pie' }
  ];

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">📊 Query Results</h2>

      <div className="flex justify-between items-start gap-6 w-full mb-4">
        <div className="flex-1">
          <p className="font-bold">Rows</p>
          <p className="mt-1">{rows}</p>
        </div>

        <div className="flex-1">
          <p className="font-bold">Columns</p>
          <p className="mt-1">{columns}</p>
        </div>

        <div className="flex-1">
        <p className="font-bold">Visualization</p>
          <select
            value={selectedViz}
            onChange={(e) => setSelectedViz(e.target.value)}
            className="mt-6 w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800"
          >
            {visualizationTypes.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <VisualizationPanel data={data} chartType={selectedViz} />
    </div>
  );
};

export default QueryResults;
