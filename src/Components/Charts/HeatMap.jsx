import React from 'react';

const HeatMap = ({ data = [], xKey = 'year', yKey = 'gdp' }) => {

  // X-axis values (e.g. years)
  const xLabels = [...new Set(data.map(item => item[xKey]))];

  // Y-axis tick values
  const yValues = data.map(item => item[yKey]);
  const minY = Math.floor(Math.min(...yValues) / 100) * 100;
  const maxY = Math.ceil(Math.max(...yValues) / 100) * 100;
  const step = 200;

  const yTicks = [];
  for (let y = maxY; y >= minY; y -= step) {
    yTicks.push(y);
  }

  // Strongly different colors for 4 ranges
  const getColor = (value) => {
    if (value <= 3100) return '#00A100';   // Green
    if (value <= 3200) return '#128FD9';   // Blue
    if (value <= 3300) return '#FFB200';   // Yellow
    if (value <= 3400) return '#9C27B0';   // Purple
    if (value <= 3500) return '#00BCD4';   // Cyan
    if (value <= 3600) return '#8BC34A';   // Light Green
    if (value <= 3700) return '#E91E63';   // Pink
    if (value <= 3800) return '#3F51B5';   // Indigo
    if (value <= 3900) return '#795548';   // Brown
    if (value <= 4000) return '#607D8B';   // Blue Grey
    return '#F44336';    
    };

  // Map color to range label
  const colorLegend = [
    { color: '#00A100', label: '<= 3100' },   // Green
    { color: '#128FD9', label: '<= 3200' },   // Blue
    { color: '#FFB200', label: '<= 3300' },   // Yellow
    { color: '#9C27B0', label: '<= 3400' },   // Purple
    { color: '#00BCD4', label: '<= 3500' },   // Cyan
    { color: '#8BC34A', label: '<= 3600' },   // Light Green
    { color: '#E91E63', label: '<= 3700' },   // Pink
    { color: '#3F51B5', label: '<= 3800' },   // Indigo
    { color: '#795548', label: '<= 3900' },   // Brown
    { color: '#607D8B', label: '<= 4000' },   // Blue Grey
    { color: '#F44336', label: '> 4000' }     // Red
  ];
  

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '30px',  }}>
      {/* Y-axis */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginRight: '10px' }}>
        {yTicks.map((tick, i) => (
          <div key={i} style={{ height: '40px', fontSize: '12px', textAlign: 'right' }}>{tick}</div>
        ))}
        <div style={{ height: '20px' }}></div>
      </div>

      {/* Heatmap and axis */}
      <div style={{ position: 'relative' }}>
        {/* Y-axis Label */}
        <div
          style={{
            position: 'absolute',
            left: '-60px',
            top: '28%',
            transform: 'rotate(-90deg) translateY(-50%)',
            fontWeight: 'bold',
            fontSize: '14px'
          }}
        >
          {yKey}
        </div>

        {/* Grid */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {yTicks.map((tick, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex' }}>
              {xLabels.map((xVal, colIndex) => {
                const item = data.find(d => d[xKey] === xVal);
                const val = item ? item[yKey] : 0;
                const showValue = val >= tick - step && val < tick;
                const fill = showValue ? getColor(val) : '#f0f0f0';

                return (
                  <div
                    key={colIndex}
                    title={showValue ? `X: ${xVal}, ${yKey}: ${val}` : ''}
                    style={{
                      width: '50px',
                      height: '40px',
                      backgroundColor: fill,
                      border: '1px solid #ccc',
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: showValue ? 'white' : 'transparent',
                      cursor: showValue ? 'pointer' : 'default'
                    }}
                  >
                    {showValue ? val : ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* X-axis Ticks */}
        <div style={{ display: 'flex', borderTop: '2px solid black' }}>
          {xLabels.map((label, i) => (
            <div key={i} style={{ width: '50px', textAlign: 'center', fontSize: '12px', paddingTop: '5px' }}>
              {label}
            </div>
          ))}
        </div>

        {/* X-axis Label */}
        <div style={{ textAlign: 'center', marginTop: '5px', fontWeight: 'bold' }}>{xKey}</div>
      </div>

      {/* Legend */}
      <div style={{ marginLeft: '20px', fontSize: '13px' }}>
        {colorLegend.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{
              width: '18px',
              height: '18px',
              backgroundColor: item.color,
              border: '1px solid #ccc',
              marginRight: '8px'
            }}></div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeatMap;
