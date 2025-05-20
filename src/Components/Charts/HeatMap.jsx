import React from 'react';

const HeatMap = ({ data, keyName }) => {
  const values = data.map(d => d[keyName]);
  const max = Math.max(...values);
  const min = Math.min(...values);

  return (
    <div className="grid grid-cols-5 gap-1">
      {values.map((value, idx) => {
        const intensity = (value - min) / (max - min + 1e-5); // normalize
        return (
          <div
            key={idx}
            className="w-10 h-10"
            style={{ backgroundColor: `rgba(59,130,246,${intensity})` }}
          />
        );
      })}
    </div>
  );
};

export default HeatMap;
