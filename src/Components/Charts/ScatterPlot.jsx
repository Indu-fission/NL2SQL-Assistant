import React, { useState, useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell, // Still needed if we color each dot individually initially, but legend will be by category
  ResponsiveContainer,
  Legend,
  Label,
} from 'recharts';

// Refined Professional Color Palette
const COLORS = [
  '#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51',
  '#E57373', '#81C784', '#64B5F6', '#FFB74D', '#BA68C8',
  '#795548', '#A1887F', '#90A4AE', '#78909C', '#4DB6AC',
  '#AED581', '#DCE775', '#FFF176', '#FFD54F', '#FF8A65'
].filter((value, index, self) => self.indexOf(value) === index); // Ensure unique colors

const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, xKey, yKey, uniqueXLabels, xLabelToColorMap }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload; // This is an item from plotData
    const xCategoryName = dataPoint[xKey]; // Get the original xKey category name
    const yValue = dataPoint.__y__;
    const pointColor = xLabelToColorMap[xCategoryName] || payload[0].color; // Use category color

    return (
      <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-md p-3 border border-gray-300 text-xs font-sans min-w-[200px]">
        <p className="font-semibold text-slate-700 mb-1.5 text-[13px]">
          {capitalize(xKey)}: <span className="font-normal text-slate-600">{xCategoryName}</span>
        </p>
        <p className="font-semibold text-slate-700 text-[13px]">
          {capitalize(yKey)}: <span className="font-normal text-slate-600" style={{ color: pointColor }}>{yValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
        </p>
      </div>
    );
  }
  return null;
};

// Custom Dot with "hover" style as default
const CustomDot = ({ cx, cy, fill, payload, hoveredPoint }) => {
  const isHovered = hoveredPoint === payload.__index__; 
  const baseRadius = 7; 

  return (
    <g style={{ transformOrigin: `${cx}px ${cy}px`, transition: 'transform 0.1s ease-out', transform: isHovered ? 'scale(1.15)' : 'scale(1)' }}> {/* Slightly more scale on hover */}
      {/* Outer ring - always visible */}
      <circle
        cx={cx}
        cy={cy}
        r={baseRadius + 2.5} // Adjusted outer ring size
        fill="none"
        stroke={fill}
        strokeWidth={1.5}
        opacity={0.4} 
      />
      {/* Main dot - always visible */}
      <circle
        cx={cx}
        cy={cy}
        r={baseRadius}
        fill={fill}
        stroke={"#ffffff"} 
        strokeWidth={1.5}  
        style={{
          filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.25))', // Slightly stronger default shadow
        }}
      />
      {/* Inner highlight - always visible */}
      <circle
        cx={cx}
        cy={cy}
        r={baseRadius * 0.35} // Adjusted inner highlight size
        fill="rgba(255,255,255,0.65)"
      />
    </g>
  );
};

// Y-axis tick formatter
const yAxisTickFormatter = (value) => {
  if (Math.abs(value) >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(value % 1000 === 0 && Math.abs(value) < 10000 ? 0 : 1)}k`;
  return value.toString();
};


const ScatterPlot = ({ data, xKey, yKey }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null); 
  
  if (!Array.isArray(data) || data.length === 0 || !xKey || !yKey) {
    return (
      <div className="flex items-center justify-center h-[480px] text-gray-500 font-sans p-4 text-center">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-3 opacity-40">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12A2.25 2.25 0 0 0 20.25 14.25V3M3.75 21h16.5M16.5 3.75h.008v.008H16.5V3.75Z" />
        </svg>
        <p className="text-gray-600 font-medium text-sm">Please provide data and select both X and Y fields.</p>
      </div>
    );
  }

  const { plotData, uniqueXValues, xValueToColorMap, legendPayload } = useMemo(() => {
    const uniqueXVals = [...new Set(data.map(item => item[xKey]))].sort((a, b) => String(a).localeCompare(String(b)));
    const xValMap = Object.fromEntries(uniqueXVals.map((label, index) => [label, index]));
    
    const xColorMap = {};
    uniqueXVals.forEach((val, index) => {
      xColorMap[val] = COLORS[index % COLORS.length];
    });

    const pData = data
      .map((d, index) => {
        const yVal = parseFloat(d[yKey]);
        const xCategory = d[xKey]; 
        const xNum = xValMap[xCategory]; 
        
        return !isNaN(yVal) && xNum !== undefined 
          ? { ...d, __x__: xNum, __y__: yVal, __color__: xColorMap[xCategory], __index__: index } 
          : null;
      })
      .filter(Boolean);

    const lPayload = uniqueXVals.map(name => ({
      value: capitalize(String(name)), 
      type: 'circle',        
      id: name,
      color: xColorMap[name]  
    }));

    return { plotData: pData, uniqueXValues: uniqueXVals, xValueToColorMap: xColorMap, legendPayload: lPayload };
  }, [data, xKey, yKey]);


  if (plotData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[480px] text-gray-500 font-sans p-4 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-3 opacity-40">
           <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
        </svg>
        <p className="text-gray-600 font-medium text-sm">No valid data points to display for the selected fields.</p>
      </div>
    );
  }
  
  const yAxisLabelValue = `${capitalize(yKey)} (AED)`;
  const chartTitle = `${capitalize(yKey)} vs ${capitalize(xKey)}`;

  return (
    <div className="w-full font-sans">
      {/* Heading Section - Styling Adjusted */}
      <div className="text-center mb-6"> {/* Increased margin below heading */}
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 m-0"> {/* Made title larger and bolder */}
          {chartTitle}
        </h3>
        <p className="text-sm text-slate-600 mt-1.5"> {/* Made subtitle slightly larger and more space */}
          Scatter plot visualization
        </p>
      </div>

      <div> 
        <ResponsiveContainer width="100%" height={520}> 
          <ScatterChart 
            margin={{ top: 20, right: 170, bottom: 110, left: 125 }} // Maintained margins
            onMouseMove={(e) => {
              if (e && e.activePayload && e.activePayload.length > 0) {
                setHoveredPoint(e.activePayload[0].payload.__index__);
              } else {
                setHoveredPoint(null);
              }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <CartesianGrid 
              stroke="#f1f5f9" 
              strokeWidth={0.7}
              strokeDasharray="4 4" 
            />

            <XAxis
              type="number" 
              dataKey="__x__"
              name={capitalize(xKey)}
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 1.2 }} 
              tickLine={{ stroke: '#cbd5e1', strokeWidth: 0.8 }}
              tickFormatter={(tickIndex) => uniqueXValues[tickIndex] || ''} 
              tick={{ fill: '#475569', fontSize: 10, fontWeight: 500, angle: -45, textAnchor: 'end', dy: 10 }} 
              domain={[0, uniqueXValues.length > 0 ? uniqueXValues.length -1 : 0]}
              interval={uniqueXValues.length > 10 ? Math.floor(uniqueXValues.length / 8) : 0} 
              height={90} 
            >
              <Label
                value={capitalize(xKey)}
                position='outsideBottom' 
                offset={45} 
                style={{ textAnchor: 'middle', fill: '#334155', fontSize: '13px', fontWeight: '600' }}
              />
            </XAxis>

            <YAxis
              type="number"
              dataKey="__y__"
              name={capitalize(yKey)}
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 1.2 }}
              tickLine={{ stroke: '#cbd5e1', strokeWidth: 0.8 }}
              tick={{ fill: '#475569', fontSize: 10, fontWeight: 500, dx: -5 }} 
              tickFormatter={yAxisTickFormatter} 
              width={130} 
            >
              <Label
                value={yAxisLabelValue} 
                angle={-90}
                position='outsideLeft' 
                offset={-70} 
                style={{ textAnchor: 'middle', fill: '#334155', fontSize: '13px', fontWeight: '600' }}
              />
            </YAxis>

            <Tooltip
              content={<CustomTooltip xKey={xKey} yKey={yKey} uniqueXLabels={uniqueXValues} xLabelToColorMap={xValueToColorMap} />}
              cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '3 3' }}
              wrapperStyle={{ zIndex: 1000 }}
            />
            
            <Legend 
              layout="vertical" 
              verticalAlign="top" 
              align="right"
              iconSize={9}
              iconType="circle"
              wrapperStyle={{ 
                paddingLeft: '10px', 
                fontSize: '11px',
                color: '#334155',
                right: 25, 
                maxHeight: '380px', 
                overflowY: 'auto'
              }}
              payload={legendPayload} 
            />

            <Scatter 
              data={plotData} 
              shape={<CustomDot hoveredPoint={hoveredPoint} />}
            >
              {plotData.map((entry) => ( 
                <Cell 
                  key={`cell-${entry.__index__}`} 
                  fill={entry.__color__} 
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScatterPlot;

