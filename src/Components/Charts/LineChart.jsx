import React from 'react';
import { Line } from 'react-chartjs-2';

const LineChart = ({ data, xKey, yKey }) => {
  if (!xKey || !yKey) return <div>Please select both X and Y axes.</div>;

  const chartData = {
    labels: data.map(row => row[xKey]),
    datasets: [
      {
        label: `${yKey} by ${xKey}`,
        data: data.map(row => row[yKey]),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default LineChart;
