import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const VisualizationPanel = ({ data, type, setType }) => {
  const numericKeys = data.length ? Object.keys(data[0]).filter(k => typeof data[0][k] === 'number') : [];
  const categoricalKeys = data.length ? Object.keys(data[0]).filter(k => typeof data[0][k] === 'string') : [];

  const generateChartData = () => {
    if (!data.length || !numericKeys.length) return null;
    return {
      labels: data.map(row => row[categoricalKeys[0]]),
      datasets: [
        {
          label: numericKeys[0],
          data: data.map(row => row[numericKeys[0]]),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
        },
      ],
    };
  };

  const chartData = generateChartData();

  return (
    <div className="my-4">
      <div className="mb-2">
        <label className="font-semibold mr-2">Visualization Type:</label>
        <select
          className="p-2 border rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="Table">Table</option>
          <option value="Bar Chart">Bar Chart</option>
          <option value="Line Chart">Line Chart</option>
          <option value="Pie Chart">Pie Chart</option>
        </select>
      </div>
      {type === 'Bar Chart' && chartData && <Bar data={chartData} />}
      {type === 'Line Chart' && chartData && <Line data={chartData} />} 
      {type === 'Pie Chart' && chartData && <Pie data={chartData} />}
    </div>
  );
};

export default VisualizationPanel;
