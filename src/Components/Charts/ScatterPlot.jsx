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
    <div style={{ width: '100%', height: '500px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
      
      {/* Chart Section */}
      <div style={{ width: '60%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey={xkey}
              name={xkey}
              label={{
                value: xkey.toUpperCase(),
                position: 'bottom',
                offset: 10,
                style: { fontWeight: 'bold' }
              }}
              tickMargin={10}
            />
            <YAxis
              type="number"
              dataKey={ykey}
              name={ykey}
              label={{
                value: ykey.toUpperCase(),
                angle: -90,
                position: 'insideLeft',
                offset: -5,
                style: { fontWeight: 'bold' }
              }}
              tickMargin={10}
            />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter data={plotData}>
              {plotData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Info Section */}
      <div style={{ width: '30%', padding: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>Chart Info</h3>
        <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px' }}>
          {plotData.map((item, index) => (
            <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{
                width: '14px',
                height: '14px',
                backgroundColor: COLORS[index % COLORS.length],
                display: 'inline-block',
                marginRight: '8px'
              }}></span>
              {xkey}: <strong style={{ marginLeft: '4px' }}>{item[xkey]}</strong>,
              &nbsp;{ykey}: <strong style={{ marginLeft: '4px' }}>{item[ykey]}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ScatterPlot;
