import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const ScatterPlot = ({ data, xKey, yKey }) => {
  const defaultData = [
    { year: 2018, gdp: 2400 },
    { year: 2019, gdp: 2500 },
    { year: 2020, gdp: 2200 },
    { year: 2021, gdp: 2700 },
  ];

  const plotData = data && data.length > 0 ? data : defaultData;
  const xkey = xKey || 'year';
  const ykey = yKey || 'gdp';

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00c49f', '#ff69b4'];

  return (
    <div style={{ width: '100%', height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <ResponsiveContainer width={600} height={400}>
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid />
          <XAxis type="number" dataKey={xkey} name={xkey} label={{ value: xkey.toUpperCase(), position: 'bottom', offset: 10, style:{fontWeight:'bold'} }} tickMargin={10} />
          <YAxis type="number" dataKey={ykey} name={ykey} label={{ value: ykey.toUpperCase(), angle: -90, position: 'insideLeft',offset:-5,style:{fontWeight:'bold'} }} tickMargin={10} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend/>
          <Scatter  data={plotData}>
            {plotData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterPlot;
