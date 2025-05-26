import React, { useState, useMemo } from 'react';

// Sophisticated dark color palette for professional look
const COLORS = [
  "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
  "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf",
  "#aec7e8", "#ffbb78", "#98df8a", "#ff9896", "#c5b0d5",
  "#c49c94", "#f7b6d2", "#c7c7c7", "#dbdb8d", "#9edae5"
].filter((value, index, self) => self.indexOf(value) === index); // Ensure unique colors


const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function to format Y-axis values (e.g., 10000 -> 10k)
const formatYAxisValue = (value) => {
  if (typeof value !== 'number') return value;
  if (Math.abs(value) >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1000) {
    return `${(value / 1000).toFixed(value % 1000 === 0 && Math.abs(value) < 10000 ? 0 : 1)}k`;
  }
  return value.toLocaleString(); // Keep full number for smaller values, with locale string for commas
};


const HeatMap = ({ data = [], xKey = 'year', yKey = 'gdp' }) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  
  const processedData = useMemo(() => {
    const currentData = data.length > 0 ? data : [
      { [xKey]: '2020', [yKey]: 45000, category: 'Alpha' }, { [xKey]: '2021', [yKey]: 47000, category: 'Alpha' }, { [xKey]: '2022', [yKey]: 49000, category: 'Alpha' }, { [xKey]: '2023', [yKey]: 49000, category: 'Alpha' },
      { [xKey]: '2020', [yKey]: 35000, category: 'Beta' }, { [xKey]: '2021', [yKey]: 37000, category: 'Beta' }, { [xKey]: '2022', [yKey]: 33000, category: 'Beta' }, { [xKey]: '2023', [yKey]: 33000, category: 'Beta' },
      { [xKey]: '2020', [yKey]: 25000, category: 'Gamma' }, { [xKey]: '2021', [yKey]: 28000, category: 'Gamma' }, { [xKey]: '2022', [yKey]: 30000, category: 'Gamma' }, { [xKey]: '2023', [yKey]: 30000, category: 'Gamma' },
    ];

    const xLabels = [...new Set(currentData.map(item => String(item[xKey])))].sort();
    
    const yValues = [...new Set(currentData.map(item => Number(item[yKey])))].filter(v => !isNaN(v));
    const yLabels = yValues.sort((a, b) => b - a); 

    const dataMap = {};
    currentData.forEach((item) => {
      const xVal = String(item[xKey]);
      const yVal = Number(item[yKey]);
      if (isNaN(yVal)) return;

      if (!dataMap[yVal]) dataMap[yVal] = {};
      dataMap[yVal][xVal] = { value: yVal, originalItem: item }; 
    });
    
    const xLabelColors = {};
    xLabels.forEach((label, index) => {
      xLabelColors[label] = COLORS[index % COLORS.length];
    });

    return { xLabels, yLabels, dataMap, xLabelColors, currentData };
  }, [data, xKey, yKey]);

  const { xLabels, yLabels, dataMap, xLabelColors, currentData } = processedData;

  if (currentData.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center', fontFamily: '"Inter", sans-serif', color: '#4b5563'}}>No data provided to render the heatmap.</div>;
  }

  const cellWidth = Math.max(60, 500 / xLabels.length); 
  const cellHeight = 50; 
  const yAxisTickLabelWidth = 70; 
  const yAxisTitleWidth = 35; 
  const legendWidth = 150; 
  const xAxisSlantedLabelAreaHeight = 60; 
  const xAxisTitleAreaHeight = 55;    // INCREASED height for the main X-axis title to give it more space

  const yAxisLabelText = `${capitalize(yKey)} (AED)`;

  return (
    <div style={{ 
      padding: '15px', 
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#1e293b',
      display: 'flex',
      flexDirection: 'column', 
      alignItems: 'center' 
    }}>
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '25px', 
      }}>
        <h2 style={{
          fontSize: '20px', 
          fontWeight: '700', 
          color: '#1e293b', 
          margin: '0 0 5px 0',
        }}>
          {capitalize(yKey)} by {capitalize(xKey)} Heatmap
        </h2>
        <p style={{
          fontSize: '13px', 
          color: '#64748b',
          margin: 0,
        }}>
          Interactive Data Visualization
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        width: '100%', 
        maxWidth: `${yAxisTickLabelWidth + yAxisTitleWidth + (xLabels.length * cellWidth) + legendWidth + 40}px`, 
        justifyContent: 'center' 
      }}>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: yAxisTitleWidth, 
            marginRight: '5px', 
        }}>
            <div style={{
                transform: 'rotate(-90deg)',
                whiteSpace: 'nowrap',
                fontSize: '12px', 
                fontWeight: '600',
                color: '#334155',
            }}>
                {yAxisLabelText}
            </div>
        </div>

        <div style={{
            marginRight: '8px', 
            width: yAxisTickLabelWidth, 
            display: 'flex',
            flexDirection: 'column',
            height: yLabels.length * cellHeight + (xLabels.length > 0 ? (xAxisSlantedLabelAreaHeight + xAxisTitleAreaHeight) : 0), 
            paddingTop: '2px', 
        }}>
          {yLabels.map((label, i) => (
            <div
              key={`y-label-${i}`}
              style={{
                height: cellHeight,
                textAlign: 'right',
                color: '#475569', 
                fontSize: '10px', 
                fontWeight: '500',
                lineHeight: `${cellHeight}px`,
                paddingRight: '8px', 
                boxSizing: 'border-box',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={`${capitalize(yKey)}: ${label.toLocaleString()}`}
            >
              {formatYAxisValue(label)}
            </div>
          ))}
          {xLabels.length > 0 && <div style={{ height: xAxisSlantedLabelAreaHeight + xAxisTitleAreaHeight }}></div>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: `repeat(${xLabels.length}, ${cellWidth}px)`,
            border: '1px solid #e2e8f0', 
            borderRadius: '6px', 
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)' 
          }}>
            {yLabels.map((yVal, rowIndex) => (
              xLabels.map((xVal, colIndex) => {
                const cellData = dataMap[yVal]?.[xVal];
                const cellColor = cellData ? xLabelColors[xVal] : '#f8fafc'; 
                const isHovered = hoveredCell === `${rowIndex}-${colIndex}`;
                
                return (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    title={cellData ? `${capitalize(xKey)}: ${xVal}\n${capitalize(yKey)}: ${cellData.originalItem[yKey].toLocaleString()}` : `No data for ${xVal}, ${formatYAxisValue(yVal)}`}
                    onMouseEnter={() => setHoveredCell(cellData ? `${rowIndex}-${colIndex}` : null)}
                    onMouseLeave={() => setHoveredCell(null)}
                    style={{
                      width: cellWidth,
                      height: cellHeight,
                      backgroundColor: cellColor,
                      borderRight: colIndex === xLabels.length - 1 ? 'none' : '1px solid #e2e8f0',
                      borderBottom: rowIndex === yLabels.length - 1 ? 'none' : '1px solid #e2e8f0',
                      fontSize: '11px', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: cellData ? '#ffffff' : '#a0aec0', 
                      cursor: cellData ? 'pointer' : 'default',
                      fontWeight: '500',
                      transition: 'all 0.2s ease-in-out',
                      transform: isHovered && cellData ? 'scale(1.03)' : 'scale(1)',
                      zIndex: isHovered && cellData ? 10 : 1,
                      position: 'relative',
                      opacity: cellData ? 1 : 0.7, 
                      boxShadow: isHovered && cellData ? `0 0 8px ${cellColor}88` : 'none', 
                    }}
                  >
                    {cellData ? formatYAxisValue(cellData.value) : '-'}
                  </div>
                );
              })
            ))}
          </div>

          {/* X-axis Tick Labels - SLANTED */}
          <div style={{
            display: 'flex',
            marginTop: '5px', 
            width: xLabels.length * cellWidth,
            height: xAxisSlantedLabelAreaHeight, 
            position: 'relative', 
          }}>
            {xLabels.map((label, i) => (
              <div
                key={`x-label-${i}`}
                style={{
                  width: cellWidth,
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  alignItems: 'flex-start', 
                  height: '100%', 
                }}
                title={`${capitalize(xKey)}: ${label}`}
              >
                <div style={{
                  fontSize: '10px', 
                  fontWeight: '500',
                  color: '#475569',
                  paddingTop: '5px',
                  transform: 'rotate(-45deg)', 
                  transformOrigin: 'calc(100% - 5px) 0', 
                  whiteSpace: 'nowrap', 
                  textAlign: 'right', 
                }}>
                   {label}
                </div>
              </div>
            ))}
          </div>
           {/* X-axis Main Label */}
          <div style={{
            textAlign: 'center',
            marginTop: '35px', // INCREASED marginTop significantly to push the label further down
            paddingTop: '5px', 
            width: xLabels.length * cellWidth, 
            height: xAxisTitleAreaHeight, 
          }}>
            <span style={{
              fontSize: '12px', 
              fontWeight: '600',
              color: '#334155',
            }}>
              {capitalize(xKey)}
            </span>
          </div>
        </div>

        {/* Legend (Chart Info) Panel on the Right */}
        <div style={{
          marginLeft: '25px', 
          width: legendWidth,
          padding: '10px', 
          borderRadius: '6px', 
          maxHeight: yLabels.length * cellHeight + xAxisSlantedLabelAreaHeight + xAxisTitleAreaHeight, 
          overflowY: 'auto'
        }}>
          <h4 style={{
            margin: '0 0 10px 0', 
            fontSize: '13px', 
            fontWeight: '600',
            color: '#334155',
            paddingBottom: '6px', 
          }}>
            Sector 
          </h4>
          {xLabels.map((label, index) => (
            <div 
              key={`legend-${index}`} 
              style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}
              title={capitalize(label)} 
            > 
              <div style={{
                width: '10px', 
                height: '10px',
                backgroundColor: xLabelColors[label],
                borderRadius: '2px', 
                marginRight: '6px', 
                border: '1px solid rgba(0,0,0,0.05)' 
              }} />
              <span style={{ fontSize: '11px', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}> 
                {capitalize(label)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeatMap;
