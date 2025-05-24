import React, { useState, useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

// Professional color palette - bright and dark colors for light theme
const COLORS = [
  "#1a365d", "#2d3748", "#744210", "#276749", "#1a202c",
  "#4a5568", "#553c9a", "#2c5282", "#9c4221", "#38a169",
  "#d69e2e", "#ed8936", "#e53e3e", "#dd6b20", "#319795",
  "#805ad5", "#3182ce", "#38b2ac", "#48bb78", "#ed64a6"
];

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, xKey, yKey, uniqueXLabels }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border-2 border-gray-800 rounded-lg p-4 shadow-2xl">
        <div className="space-y-2">
          <div className="border-b border-gray-200 pb-2">
            <p className="font-bold text-gray-800 text-sm uppercase tracking-wide">
              Data Point
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-700 font-semibold">
              <span className="text-gray-500 font-medium">{capitalize(xKey)}:</span>{' '}
              <span className="text-gray-800">{uniqueXLabels[data.__x__]}</span>
            </p>
            <p className="text-gray-700 font-semibold">
              <span className="text-gray-500 font-medium">{capitalize(yKey)}:</span>{' '}
              <span className="text-gray-800">{data.__y__.toFixed(2)}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Custom dot component with enhanced visuals
const CustomDot = ({ cx, cy, fill, index, payload }) => {
  return (
    <g>
      {/* Outer ring for emphasis */}
      <circle
        cx={cx}
        cy={cy}
        r={10}
        fill="none"
        stroke={fill}
        strokeWidth={2}
        opacity={0.3}
      />
      {/* Main dot */}
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={fill}
        stroke="#ffffff"
        strokeWidth={2}
        style={{
          filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
        }}
      />
      {/* Inner highlight */}
      <circle
        cx={cx - 1}
        cy={cy - 1}
        r={2}
        fill="rgba(255,255,255,0.6)"
      />
    </g>
  );
};

const ScatterPlot = ({ data, xKey, yKey }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  if (!Array.isArray(data) || data.length === 0 || !xKey || !yKey) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-600 font-medium">Please provide data and select both X and Y fields.</p>
        </div>
      </div>
    );
  }

  const uniqueXLabels = [...new Set(data.map(item => item[xKey]))];
  const xLabelMap = Object.fromEntries(uniqueXLabels.map((label, index) => [label, index]));

  const plotData = useMemo(() => {
    return data
      .map((d, index) => {
        const y = parseFloat(d[yKey]);
        const x = xLabelMap[d[xKey]];
        return !isNaN(y) && x !== undefined ? { ...d, __x__: x, __y__: y, __index__: index } : null;
      })
      .filter(Boolean);
  }, [data, xKey, yKey, xLabelMap]);

  const yStats = useMemo(() => {
    const values = plotData.map(d => d.__y__);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return { min, max, avg };
  }, [plotData]);

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 tracking-tight">
              {capitalize(yKey)} vs {capitalize(xKey)}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Interactive scatter plot visualization • {plotData.length} data points
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="bg-gray-100 px-3 py-1 rounded-full">
              <span className="text-gray-600 font-medium">Avg: </span>
              <span className="text-gray-800 font-bold">{yStats.avg.toFixed(2)}</span>
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded-full">
              <span className="text-gray-600 font-medium">Range: </span>
              <span className="text-gray-800 font-bold">{yStats.min.toFixed(1)} - {yStats.max.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="p-6">
        <ResponsiveContainer width="100%" height={520}>
          <ScatterChart 
            margin={{ top: 20, right: 40, bottom: 120, left: 100 }}
            onMouseMove={(e) => {
              if (e && e.activePayload && e.activePayload.length > 0) {
                setHoveredPoint(e.activePayload[0].payload.__index__);
              }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            {/* Enhanced grid */}
            <CartesianGrid 
              stroke="#e2e8f0" 
              strokeWidth={1}
              strokeDasharray="2 4"
              opacity={0.7}
            />

            {/* Average line */}
            <ReferenceLine 
              y={yStats.avg} 
              stroke="#4a5568" 
              strokeDasharray="6 6" 
              strokeWidth={2}
              opacity={0.6}
              label={{
                value: `Avg: ${yStats.avg.toFixed(2)}`,
                position: "topRight",
                fill: "#4a5568",
                fontSize: 12,
                fontWeight: "600"
              }}
            />

            {/* Enhanced X-Axis */}
            <XAxis
              type="number"
              dataKey="__x__"
              name={capitalize(xKey)}
              axisLine={{ stroke: '#2d3748', strokeWidth: 2 }}
              tickLine={{ stroke: '#4a5568', strokeWidth: 1.5 }}
              label={{
                value: capitalize(xKey),
                position: 'bottom',
                offset: 60,
                style: {
                  textAnchor: 'middle',
                  fill: '#1a202c',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px'
                }
              }}
              tickFormatter={(tick) => uniqueXLabels[tick] || ''}
              tick={{
                fill: '#2d3748',
                fontSize: 11,
                fontWeight: '600',
                angle: -35,
                textAnchor: 'end'
              }}
              domain={[0, uniqueXLabels.length - 1]}
              interval={0}
              height={100}
            />

            {/* Enhanced Y-Axis */}
            <YAxis
              type="number"
              dataKey="__y__"
              name={capitalize(yKey)}
              axisLine={{ stroke: '#2d3748', strokeWidth: 2 }}
              tickLine={{ stroke: '#4a5568', strokeWidth: 1.5 }}
              label={{
                value: capitalize(yKey),
                angle: -90,
                position: 'insideLeft',
                offset: 20,
                style: {
                  textAnchor: 'middle',
                  fill: '#1a202c',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px'
                }
              }}
              tick={{
                fill: '#2d3748',
                fontSize: 12,
                fontWeight: '600'
              }}
              tickFormatter={(value) => value.toFixed(1)}
            />

            {/* Custom Tooltip */}
            <Tooltip
              content={<CustomTooltip xKey={xKey} yKey={yKey} uniqueXLabels={uniqueXLabels} />}
              cursor={{
                stroke: '#4a5568',
                strokeWidth: 2,
                strokeDasharray: '4 4',
                opacity: 0.7
              }}
              wrapperStyle={{ zIndex: 1000 }}
            />

            {/* Enhanced Scatter with custom dots */}
            <Scatter 
              data={plotData} 
              shape={<CustomDot />}
            >
              {plotData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke={hoveredPoint === entry.__index__ ? '#1a202c' : 'transparent'}
                  strokeWidth={hoveredPoint === entry.__index__ ? 3 : 0}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Footer with legend and stats */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gray-600"></div>
              <span className="text-sm text-gray-600 font-medium">Data Points</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-0.5 bg-gray-600 opacity-60" style={{borderTop: '2px dashed #4a5568'}}></div>
              <span className="text-sm text-gray-600 font-medium">Average Line</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {/* Hover over points for detailed information */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScatterPlot;