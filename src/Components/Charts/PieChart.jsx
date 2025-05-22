import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const PieChartComponent = ({ data, xKey, yKey }) => {
  const xkey = xKey || (data && data.length > 0 ? Object.keys(data[0])[0] : 'gdp');
  const ykey = yKey || (data && data.length > 0 ? Object.keys(data[0])[1] : 'year');

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28'];

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const info = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'black',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '5px',
          fontSize: '14px',
        }}>
          <p style={{ margin: 0 }}>{`${xkey}: ${info[xkey]}`}</p>
          <p style={{ margin: 0 }}>{`${ykey}: ${info[ykey]}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: '500px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
      {/* Pie Chart */}
      <div style={{ width: '60%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Pie
              data={data}
              dataKey={ykey}
              nameKey={xkey}
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={140}
              fill="#8884d8"
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Info on Right */}
      <div style={{ width: '30%', padding: '20px' }}>
        <h3 className="text-lg font-semibold mb-4">Chart Info</h3>
        <ul className="space-y-2">
          {data.map((item, index) => (
            <li key={index} style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
              <span style={{
                width: '14px',
                height: '14px',
                backgroundColor: COLORS[index % COLORS.length],
                display: 'inline-block',
                marginRight: '8px'
              }}></span>
              {item[xkey]}: <strong style={{ marginLeft: '6px' }}>{item[ykey]}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PieChartComponent;
