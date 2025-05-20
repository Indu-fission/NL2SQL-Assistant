import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ data, xKey, yKey }) => {
  if (!xKey || !yKey) return <div>Please select both X and Y axes.</div>;

  const backgroundColors = [
    '#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#f472b6', '#2dd4bf'
  ];

  const chartData = {
    labels: data.map(row => row[xKey]),
    datasets: [
      {
        data: data.map(row => row[yKey]),
        backgroundColor: backgroundColors.slice(0, data.length),
      },
    ],
  };

  return (
    <div className="flex gap-6">
      <div className="w-1/2">
        <Pie data={chartData} />
      </div>
      <div className="text-sm">
        {data.map((row, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <div
              className="w-4 h-4"
              style={{ backgroundColor: chartData.datasets[0].backgroundColor[i] }}
            />
            <span>{row[xKey]}: {row[yKey]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;
