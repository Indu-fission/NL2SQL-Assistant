import React from 'react';
import {
  LineChart as LineChartLib,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const LineChartComponent = ({ data, xKey, yKey }) => {
  const xkey = xKey || 'gdp';
  const ykey = yKey || 'year';

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChartLib
        width={500}
        height={300}
        data={data}
        margin={{ top: 20, right: 50, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xkey} />
        <YAxis  />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={xkey} strokeWidth={3} stroke="#8884d8" />
        <Line type="monotone" dataKey={ykey}  strokeWidth={3} stroke="#8884d8" />
      </LineChartLib>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;