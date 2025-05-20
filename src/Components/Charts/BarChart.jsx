import React from 'react';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ data, xKey, yKey }) => {
  if (!xKey || !yKey) return <div>Please select both X and Y axes.</div>;

  const chartData = {
    labels: data.map(row => row[xKey]),
    datasets: [
      {
        label: `${yKey} by ${xKey}`,
        data: data.map(row => row[yKey]),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default BarChart;
