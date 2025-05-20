import React from 'react';
import { Scatter } from 'react-chartjs-2';

const ScatterPlot = ({ data, xKey, yKey }) => {
  if (!xKey || !yKey) return <div>Please select both X and Y axes.</div>;

  const chartData = {
    datasets: [
      {
        label: `${xKey} vs ${yKey}`,
        data: data.map(row => ({ x: row[xKey], y: row[yKey] })),
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
      },
    ],
  };

  return <Scatter data={chartData} />;
};

export default ScatterPlot;
