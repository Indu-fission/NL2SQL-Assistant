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
  return value.toLocaleString();
};


const HeatMap = ({ data = [], xKey = 'year', yKey = 'gdp' }) => {
  const [hoveredCell, setHoveredCell] = useState(null);

  const processedData = useMemo(() => {
    const effectiveData = data && data.length > 0 ? data : [
      // Default data (for testing if no data is passed)
      { [xKey]: '2020', [yKey]: 45000, category: 'Alpha' }, { [xKey]: '2021', [yKey]: 47000, category: 'Alpha' }, { [xKey]: '2022', [yKey]: 49000, category: 'Alpha' }, { [xKey]: '2023', [yKey]: 49000, category: 'Alpha' },
      { [xKey]: '2020', [yKey]: 35000, category: 'Beta' }, { [xKey]: '2021', [yKey]: 37000, category: 'Beta' }, { [xKey]: '2022', [yKey]: 33000, category: 'Beta' }, { [xKey]: '2023', [yKey]: 33000, category: 'Beta' },
      { [xKey]: '2020', [yKey]: 25000, category: 'Gamma' }, { [xKey]: '2021', [yKey]: 28000, category: 'Gamma' }, { [xKey]: '2022', [yKey]: 30000, category: 'Gamma' }, { [xKey]: '2023', [yKey]: 30000, category: 'Gamma' },
    ];

    // Ensure xKey and yKey exist before trying to access them
    if (!xKey || !yKey) {
        return { xLabels: [], yLabels: [], dataMap: {}, xLabelColors: {}, currentData: effectiveData, hasError: true, errorMessage: "X-key or Y-key is missing." };
    }

    const xLabels = [...new Set(effectiveData.map(item => String(item[xKey])))].sort();
    const yValues = [...new Set(effectiveData.map(item => Number(item[yKey])))].filter(v => !isNaN(v));
    const yLabels = yValues.sort((a, b) => b - a); // Sort Y-labels numerically descending

    const dataMap = {};
    effectiveData.forEach((item) => {
      const xVal = String(item[xKey]);
      const yVal = Number(item[yKey]);
      if (isNaN(yVal)) return; // Skip if yVal is not a number

      if (!dataMap[yVal]) dataMap[yVal] = {};
      dataMap[yVal][xVal] = { value: yVal, originalItem: item };
    });

    const xLabelColors = {};
    xLabels.forEach((label, index) => {
      xLabelColors[label] = COLORS[index % COLORS.length];
    });

    return { xLabels, yLabels, dataMap, xLabelColors, currentData: effectiveData, hasError: false };
  }, [data, xKey, yKey]);

  const { xLabels, yLabels, dataMap, xLabelColors, currentData, hasError, errorMessage } = processedData;

  if (hasError) {
    return <div style={{ padding: '20px', textAlign: 'center', fontFamily: '"Inter", sans-serif', color: '#ef4444', fontWeight: '500' }}>Error: {errorMessage}</div>;
  }
  
  if (!currentData || currentData.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center', fontFamily: '"Inter", sans-serif', color: '#4b5563'}}>No data provided to render the heatmap.</div>;
  }

  // **NEW**: Check for minimum unique values on X and Y axes
  if (xLabels.length < 2 || yLabels.length < 2) {
    return (
        <div style={{ padding: '20px', textAlign: 'center', fontFamily: '"Inter", sans-serif', color: '#4b5563', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{width: '50px', height: '50px', marginBottom: '10px', opacity: 0.6}}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
            </svg>
            Heatmap requires at least 2  columns to display.
        </div>
    );
  }


  const cellWidth = Math.max(60, Math.min(150, 700 / (xLabels.length || 1))); // Adjusted cell width
  const cellHeight = 50;
  const yAxisTickLabelWidth = 70;
  const yAxisTitleWidth = 40; // Slightly increased for potentially longer Y labels
  const legendWidth = 150;
  const xAxisSlantedLabelAreaHeight = 60;
  const xAxisTitleAreaHeight = 45; // Height for X-axis title container

  const yAxisLabelText = `${capitalize(yKey)}`; // Removed (AED) for generality, can be added back if specific

  const heatmapGridWidth = xLabels.length * cellWidth;
  const totalChartWidth = yAxisTickLabelWidth + yAxisTitleWidth + heatmapGridWidth + legendWidth + 40;


  return (
    <div style={{
      padding: '15px',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#1e293b',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%', // Allow component to take available width
    }}>
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', margin: '0 0 5px 0' }}>
          {capitalize(yKey)} by {capitalize(xKey)} Heatmap
        </h2>
        <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
          Interactive Data Visualization
        </p>
      </div>

      <div style={{ display: 'flex', width: 'auto', maxWidth: `${totalChartWidth}px`, justifyContent: 'center' }}>
        {/* Y-axis Title */}
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: yAxisTitleWidth,
            marginRight: '5px',
            minHeight: yLabels.length * cellHeight, // Ensure it aligns with cell rows
        }}>
          <div style={{
              transform: 'rotate(-90deg)',
              whiteSpace: 'nowrap',
              fontSize: '12px',
              fontWeight: '700',
              color: '#000',
              // Added overflow handling for Y-axis title
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: yLabels.length * cellHeight * 0.8, // Limit width to prevent extreme overflow
          }}>
            {yAxisLabelText}
          </div>
        </div>

        {/* Y-axis Tick Labels */}
        <div style={{
            marginRight: '8px',
            width: yAxisTickLabelWidth,
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '2px', // Align with grid cells top
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
          {/* Spacer for X-axis labels below */}
          {xLabels.length > 0 && <div style={{ height: xAxisSlantedLabelAreaHeight + xAxisTitleAreaHeight }}></div>}
        </div>

        {/* Heatmap Grid and X-axis Labels/Title Area */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: heatmapGridWidth }}>
          {/* Heatmap Grid */}
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
            width: '100%', // Use full width of its container (heatmapGridWidth)
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
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#000',
                  paddingTop: '5px',
                  transform: 'rotate(-45deg)',
                  transformOrigin: 'calc(100% - 5px) 0', // Adjust origin for better alignment
                  whiteSpace: 'nowrap',
                  textAlign: 'right',
                  // Added overflow handling for individual slanted labels
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: cellWidth * 1.41, // Approx diagonal length if needed
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* X-axis Main Label */}
          <div style={{
            textAlign: 'center',
            // **MODIFIED** marginTop to bring title closer to slanted labels
            marginTop: '10px',
            paddingTop: '5px',
            width: '100%', // Use full width of its container
            height: xAxisTitleAreaHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{
              fontSize: '12px',
              fontWeight: '800',
              color: '#000',
              // **NEW** Added overflow handling for the X-axis title
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%', // Constrain to its container's width
            }}>
              {capitalize(xKey)}
            </span>
          </div>
        </div>

        {/* Legend Panel */}
        <div style={{
          marginLeft: '25px',
          width: legendWidth,
          padding: '10px',
          borderRadius: '6px',
          maxHeight: (yLabels.length * cellHeight) + xAxisSlantedLabelAreaHeight + xAxisTitleAreaHeight,
          overflowY: 'auto',
          alignSelf: 'flex-start', // Align legend to the top of the flex row
        }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '600', color: '#334155', paddingBottom: '6px' }}>
            Sector {/* Consider making this legend title dynamic if 'category' is not always the legend key */}
          </h4>
          {xLabels.map((label, index) => (
            <div
              key={`legend-${index}`}
              style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}
              title={capitalize(label)}
            >
              <div style={{
                width: '10px', height: '10px', backgroundColor: xLabelColors[label],
                borderRadius: '2px', marginRight: '6px', border: '1px solid rgba(0,0,0,0.05)'
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