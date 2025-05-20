import React, { useState } from 'react';
import LineChartComponent from './Charts/LineChart';
import BarChartComponent from './Charts/BarChart';
import PieChartComponent from './Charts/PieChart';
import ResultTable from './Charts/ResultTable';

const VisualizationPanel = ({ data, chartType }) => {
  const [xKey, setXKey] = useState('');
  const [yKey, setYKey] = useState('');

  const keys = data && data.length > 0 ? Object.keys(data[0]) : [];

  const showAxisSelectors = chartType !== 'table' && keys.length > 0;

  return (
    <div className="space-y-4">
      {showAxisSelectors && (
        <>
          <div>
            <label className="font-semibold text-sm mb-1 block">Select X-axis (categorical):</label>
            <select
              value={xKey}
              onChange={(e) => setXKey(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select X-axis</option>
              {keys.map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-sm mb-1 block">Select Y-axis (numeric):</label>
            <select
              value={yKey}
              onChange={(e) => setYKey(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Y-axis</option>
              {keys.map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>
        </>
      )}

      <div className="rounded p-2">
        {chartType === 'line' && xKey && yKey && <LineChartComponent data={data} xKey={xKey} yKey={yKey} />}
        {chartType === 'bar' && xKey && yKey && <BarChartComponent data={data} xKey={xKey} yKey={yKey} />}
        {chartType === 'pie' && xKey && yKey && <PieChartComponent data={data} xKey={xKey} yKey={yKey} />}
        {chartType === 'table' && <ResultTable data={data} />}
      </div>
    </div>
  );
};

export default VisualizationPanel;
