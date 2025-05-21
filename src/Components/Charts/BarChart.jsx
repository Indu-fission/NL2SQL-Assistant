import React from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend, ResponsiveContainer } from 'recharts';

const BarGraph = ({ data, xKey, yKey }) => {
  let xkey = xKey ? xKey : "gdp";
  let ykey = yKey ? yKey : "year";

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <ResponsiveContainer width={600} height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 10, // reduced right margin
            left: 10,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xkey}/>
          <YAxis  />
          <Tooltip />
          <Legend />
          <Bar dataKey={xkey} stackId="a" fill="#007bff" barSize={30} />  
          <Bar dataKey={ykey} stackId="a" fill="#fdd835" barSize={30} />  
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarGraph;
