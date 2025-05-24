import React, { useState } from 'react';

// Sophisticated dark color palette for professional look
const COLORS = [
  "#1a1a2e", "#16213e", "#0f3460", "#533483", "#7209b7",
  "#2d4a77", "#046865", "#1b4d3e", "#2c5282", "#553c9a",
  "#744c9e", "#1e40af", "#059669", "#dc2626", "#ea580c",
  "#d97706", "#65a30d", "#0891b2", "#7c3aed", "#be185d"
];

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const getColorByIndex = (index) => COLORS[index % COLORS.length];

const HeatMap = ({ data = [], xKey = 'year', yKey = 'gdp' }) => {
  const [hoveredCell, setHoveredCell] = useState(null);
  
  // Sample data for demonstration if no data provided
  const sampleData = data.length > 0 ? data : [
    { [xKey]: '2020', [yKey]: 45000 },
    { [xKey]: '2021', [yKey]: 47000 },
    { [xKey]: '2022', [yKey]: 49000 },
    { [xKey]: '2023', [yKey]: 51000 },
    { [xKey]: '2024', [yKey]: 53000 },
    { [xKey]: '2020', [yKey]: 42000 },
    { [xKey]: '2021', [yKey]: 44000 },
    { [xKey]: '2022', [yKey]: 46000 },
    { [xKey]: '2023', [yKey]: 48000 },
    { [xKey]: '2024', [yKey]: 50000 },
  ];

  const xLabels = [...new Set(sampleData.map(item => item[xKey]))];
  const yLabelsSet = new Set(sampleData.map(item => item[yKey]));
  const yLabels = Array.from(yLabelsSet).sort((a, b) => b - a);

  const dataMap = {};
  sampleData.forEach(({ [xKey]: xVal, [yKey]: yVal }, idx) => {
    if (!dataMap[yVal]) dataMap[yVal] = {};
    dataMap[yVal][xVal] = { value: yVal, index: idx };
  });

  // Enhanced cell dimensions for better visual impact
  const cellWidth = 100;
  const cellHeight = 70;
  const yAxisLabelWidth = 160;

  return (
    <div style={{ 
      padding: '50px 40px', 
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      minHeight: '100vh',
      color: '#1e293b'
    }}>
      {/* Header Section */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '60px',
        borderBottom: '3px solid #e2e8f0',
        paddingBottom: '30px'
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#0f172a',
          margin: '0 0 15px 0',
          letterSpacing: '-0.5px',
          textTransform: 'uppercase'
        }}>
          Data Visualization Matrix
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#64748b',
          fontWeight: '500',
          margin: 0,
          letterSpacing: '0.5px'
        }}>
          Interactive {capitalize(yKey)} Analysis by {capitalize(xKey)}
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: '30px'
      }}>
        {/* Y-axis labels with enhanced styling */}
        <div
          style={{
            marginRight: 15,
            height: yLabels.length * cellHeight,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minWidth: yAxisLabelWidth,
          }}
        >
          {yLabels.map((label, i) => (
            <div
              key={i}
              style={{
                height: cellHeight,
                textAlign: 'right',
                color: '#334155',
                fontSize: '15px',
                fontWeight: '700',
                lineHeight: `${cellHeight}px`,
                userSelect: 'none',
                paddingRight: 20,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                background: 'linear-gradient(90deg, transparent 0%, #f8fafc 100%)',
                borderRadius: '8px 0 0 8px',
                transition: 'all 0.3s ease',
              }}
              title={`${capitalize(yKey)}: ${label.toLocaleString()}`}
            >
              {typeof label === 'number' ? label.toLocaleString() : label}
            </div>
          ))}
        </div>

        {/* Main heatmap container */}
        <div style={{ position: 'relative' }}>
          {/* Y-axis Label with modern styling */}
          <div
            style={{
              position: 'absolute',
              left: -yAxisLabelWidth - 60,
              top: '50%',
              transform: 'translateY(-50%) rotate(-90deg)',
              fontWeight: '800',
              fontSize: '20px',
              color: '#1e293b',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              width: 200,
              textAlign: 'center',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            {capitalize(yKey)}
          </div>

          {/* Enhanced heatmap grid */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            border: '3px solid #334155',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#ffffff'
          }}>
            {yLabels.map((yVal, rowIndex) => (
              <div key={rowIndex} style={{ display: 'flex' }}>
                {xLabels.map((xVal, colIndex) => {
                  const cell = dataMap[yVal]?.[xVal];
                  const baseColor = cell ? getColorByIndex(cell.index) : '#f8fafc';
                  const isHovered = hoveredCell === `${rowIndex}-${colIndex}`;
                  
                  return (
                    <div
                      key={colIndex}
                      title={cell ? `${capitalize(xKey)}: ${xVal}\n${capitalize(yKey)}: ${typeof cell.value === 'number' ? cell.value.toLocaleString() : cell.value}` : 'No data'}
                      onMouseEnter={() => setHoveredCell(`${rowIndex}-${colIndex}`)}
                      onMouseLeave={() => setHoveredCell(null)}
                      style={{
                        width: cellWidth,
                        height: cellHeight,
                        backgroundColor: baseColor,
                        borderRight: colIndex === xLabels.length - 1 ? 'none' : '2px solid #e2e8f0',
                        borderBottom: rowIndex === yLabels.length - 1 ? 'none' : '2px solid #e2e8f0',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: cell ? '#ffffff' : '#94a3b8',
                        cursor: cell ? 'pointer' : 'default',
                        userSelect: 'none',
                        overflow: 'hidden',
                        fontWeight: '700',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                        zIndex: isHovered ? 10 : 1,
                        position: 'relative',
                        textShadow: cell ? '0 1px 2px rgba(0,0,0,0.5)' : 'none',
                        border: isHovered && cell ? '3px solid #fbbf24' : 'none',
                      }}
                    >
                      {cell ? (typeof cell.value === 'number' ? cell.value.toLocaleString() : cell.value) : '—'}
                      
                      {/* Hover overlay effect */}
                      {isHovered && cell && (
                        <div style={{
                          position: 'absolute',
                          top: '-45px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: '#1e293b',
                          color: '#ffffff',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          zIndex: 1000,
                          border: '2px solid #fbbf24',
                        }}>
                          {`${capitalize(xKey)}: ${xVal}`}
                          <div style={{
                            fontSize: '11px',
                            color: '#cbd5e1',
                            marginTop: '2px'
                          }}>
                            {`${capitalize(yKey)}: ${typeof cell.value === 'number' ? cell.value.toLocaleString() : cell.value}`}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Enhanced X-axis labels */}
          <div
            style={{
              display: 'flex',
              borderTop: '4px solid #334155',
              marginTop: 25,
              minWidth: xLabels.length * cellWidth,
              justifyContent: 'flex-start',
              paddingTop: 20,
              background: 'linear-gradient(180deg, #f1f5f9 0%, transparent 100%)',
              borderRadius: '0 0 12px 12px',
            }}
          >
            {xLabels.map((label, i) => (
              <div
                key={i}
                style={{
                  width: cellWidth,
                  textAlign: 'center',
                  fontSize: '16px',
                  fontWeight: '800',
                  color: '#1e293b',
                  userSelect: 'none',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  lineHeight: '1.3em',
                  padding: '0 8px',
                  boxSizing: 'border-box',
                  letterSpacing: '0.5px',
                  transition: 'all 0.3s ease',
                }}
                title={`${capitalize(xKey)}: ${label}`}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Enhanced X-axis Label */}
          <div
            style={{
              textAlign: 'center',
              marginTop: 40,
              fontWeight: '800',
              fontSize: '20px',
              color: '#1e293b',
              userSelect: 'none',
              width: '100%',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            {capitalize(xKey)}
          </div>
        </div>

        {/* Legend/Info Panel */}
        <div style={{
          marginLeft: '30px',
          padding: '25px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '2px solid #e2e8f0',
          borderRadius: '12px',
          minWidth: '200px',
          maxWidth: '250px'
        }}>
          <h4 style={{
            margin: '0 0 20px 0',
            fontSize: '16px',
            fontWeight: '800',
            color: '#1e293b',
            borderBottom: '2px solid #e2e8f0',
            paddingBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Chart Info
          </h4>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '13px', 
              color: '#64748b', 
              fontWeight: '600',
              marginBottom: '5px'
            }}>
              Data Points
            </div>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: '800', 
              color: '#1e293b' 
            }}>
              {sampleData.length}
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontSize: '13px', 
              color: '#64748b', 
              fontWeight: '600',
              marginBottom: '5px'
            }}>
              Categories
            </div>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: '800', 
              color: '#1e293b' 
            }}>
              {yLabels.length}
            </div>
          </div>

          <div>
            <div style={{ 
              fontSize: '13px', 
              color: '#64748b', 
              fontWeight: '600',
              marginBottom: '5px'
            }}>
              Time Periods
            </div>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: '800', 
              color: '#1e293b' 
            }}>
              {xLabels.length}
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: '#f1f5f9',
            borderRadius: '8px',
            border: '1px solid #cbd5e1'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#475569',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              💡 Hover over cells for detailed information
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatMap;