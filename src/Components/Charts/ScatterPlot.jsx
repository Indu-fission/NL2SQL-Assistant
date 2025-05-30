// import React, { useState, useMemo } from 'react';
// import {
//   ScatterChart,
//   Scatter,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Cell,
//   ResponsiveContainer,
//   Legend,
//   Label,
// } from 'recharts';

// // Refined Professional Color Palette
// const COLORS = [
//   '#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51',
//   '#E57373', '#81C784', '#64B5F6', '#FFB74D', '#BA68C8',
//   '#795548', '#A1887F', '#90A4AE', '#78909C', '#4DB6AC',
//   '#AED581', '#DCE775', '#FFF176', '#FFD54F', '#FF8A65'
// ];

// const capitalize = (str) => {
//   if (!str || typeof str !== 'string') return '';
//   return str.charAt(0).toUpperCase() + str.slice(1);
// };

// // Custom Tooltip
// const CustomTooltip = ({ active, payload, xKey, yKey, xLabelToColorMap }) => {
//   if (active && payload && payload.length) {
//     const dataPoint = payload[0].payload;
//     const xCategoryName = dataPoint[xKey];
//     const yValue = dataPoint.__y__;
//     const pointColor = xLabelToColorMap[xCategoryName] || payload[0].color;

//     return (
//       <div className="bg-white/95 backdrop-blur-sm shadow-lg rounded-md p-3 border border-gray-300 text-xs font-sans min-w-[200px]">
//         <p className="font-semibold text-slate-700 mb-1.5 text-[13px]">
//           {capitalize(xKey)}: <span className="font-normal text-slate-600">{xCategoryName}</span>
//         </p>
//         <p className="font-semibold text-slate-700 text-[13px]">
//           {capitalize(yKey)}: <span className="font-normal text-slate-600" style={{ color: pointColor }}>{yValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
//         </p>
//       </div>
//     );
//   }
//   return null;
// };

// // Custom Dot
// const CustomDot = ({ cx, cy, fill, payload, hoveredPoint }) => {
//   const isHovered = hoveredPoint === payload.__index__;
//   const baseRadius = 7;
//   return (
//     <g style={{ transformOrigin: `${cx}px ${cy}px`, transition: 'transform 0.1s ease-out', transform: isHovered ? 'scale(1.15)' : 'scale(1)' }}>
//       <circle cx={cx} cy={cy} r={baseRadius + 2.5} fill="none" stroke={fill} strokeWidth={1.5} opacity={0.4} />
//       <circle cx={cx} cy={cy} r={baseRadius} fill={fill} stroke={"#ffffff"} strokeWidth={1.5} style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.25))' }} />
//       <circle cx={cx} cy={cy} r={baseRadius * 0.35} fill="rgba(255,255,255,0.65)" />
//     </g>
//   );
// };

// // Y-axis tick formatter
// const yAxisTickFormatter = (value) => {
//   if (value === null || value === undefined) return '';
//   if (Math.abs(value) >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
//   if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(value % 1000 === 0 && Math.abs(value) < 10000 ? 0 : 1)}k`;
//   return value.toString();
// };

// const ScatterPlot = ({ data, xKey, yKey }) => {
//   const [hoveredPoint, setHoveredPoint] = useState(null);

//   // Check 1: Are both xKey and yKey provided AND distinct?
//   if (!xKey || !yKey || xKey === yKey) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[480px] text-gray-500 font-sans p-4 text-center">
//         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-3 opacity-40">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
//         </svg>
//         <p className="text-gray-600 font-medium text-sm">Scatterplot requires at least 2 distinct columns (one for X-axis and one for Y-axis).</p>
//       </div>
//     );
//   }

//   // Check 2: Is data provided and valid?
//   if (!Array.isArray(data) || data.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[480px] text-gray-500 font-sans p-4 text-center">
//         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-3 opacity-40">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12A2.25 2.25 0 0 0 20.25 14.25V3M3.75 21h16.5M16.5 3.75h.008v.008H16.5V3.75Z" />
//         </svg>
//         <p className="text-gray-600 font-medium text-sm">No data provided or data is empty.</p>
//       </div>
//     );
//   }

//   const { plotData, uniqueXValues, xValueToColorMap, legendPayload } = useMemo(() => {
//     if (!xKey || !yKey || !Array.isArray(data) || data.length === 0) {
//         return { plotData: [], uniqueXValues: [], xValueToColorMap: {}, legendPayload: [] };
//     }
//     const uniqueXVals = [...new Set(data.map(item => item && typeof item === 'object' ? item[xKey] : undefined))]
//                          .filter(val => val !== null && val !== undefined)
//                          .sort((a, b) => String(a).localeCompare(String(b)));
//     const xValMap = Object.fromEntries(uniqueXVals.map((label, index) => [label, index]));
//     const xColorMap = {};
//     uniqueXVals.forEach((val, index) => { xColorMap[val] = COLORS[index % COLORS.length]; });

//     const pData = data
//       .map((d, index) => {
//         if (!d || typeof d !== 'object') return null;
//         const yValRaw = d[yKey];
//         const yVal = (yValRaw === null || yValRaw === undefined || String(yValRaw).trim() === '') ? NaN : parseFloat(String(yValRaw));
//         const xCategory = d[xKey];
//         if (xCategory === null || xCategory === undefined) return null;
//         const xNum = xValMap[xCategory];
//         return !isNaN(yVal) && xNum !== undefined
//           ? { ...d, __x__: xNum, __y__: yVal, __color__: xColorMap[xCategory], __index__: index }
//           : null;
//       })
//       .filter(Boolean);

//     const lPayload = uniqueXVals.map(name => ({
//       value: capitalize(String(name)), type: 'circle', id: name, color: xColorMap[name]
//     }));
//     return { plotData: pData, uniqueXValues: uniqueXVals, xValueToColorMap: xColorMap, legendPayload: lPayload };
//   }, [data, xKey, yKey]);

//   // Check 3: After processing, is plotData empty? (e.g., Y-values not numeric or no matching X categories)
//   if (plotData.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[480px] text-gray-500 font-sans p-4 text-center">
//         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-3 opacity-40">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
//         </svg>
//         <p className="text-gray-600 font-medium text-sm">Scatter Plot requires atleast 2 numerical columns to display
//         </p>
//       </div>
//     );
//   }

//   // Check 4: NEW - Data Diversity Check (at least 2 unique X and 2 unique Y values)
//   const numUniqueYValues = new Set(plotData.map(p => p.__y__)).size;
//   if (uniqueXValues.length < 2 || numUniqueYValues < 2) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[480px] text-gray-500 font-sans p-4 text-center">
//         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-3 opacity-40">
//           {/* Using the same icon as the first "distinct columns" check for consistency in "not enough" type messages */}
//           <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
//         </svg>
//         {/* Message as requested by the user */}
//         <p className="text-gray-600 font-medium text-sm">At least 2 columns are required to display the graph.</p>
//       </div>
//     );
//   }

//   const yAxisLabelValue = `${capitalize(yKey)} (AED)`;
//   const chartTitle = `${capitalize(yKey)} vs ${capitalize(xKey)}`;

//   return (
//     <div className="w-full font-sans">
//       <div className="text-center mb-6">
//         <h3 className="text-xl sm:text-2xl font-bold text-slate-800 m-0">{chartTitle}</h3>
//         <p className="text-sm text-slate-600 mt-1.5">Scatter plot visualization</p>
//       </div>
//       <div>
//         <ResponsiveContainer width="100%" height={520}>
//           <ScatterChart
//             margin={{ top: 20, right: 170, bottom: 165, left: 125 }}
//             onMouseMove={(e) => {
//               if (e && e.activePayload && e.activePayload.length > 0) {
//                 setHoveredPoint(e.activePayload[0].payload.__index__);
//               } else { setHoveredPoint(null); }
//             }}
//             onMouseLeave={() => setHoveredPoint(null)}
//           >
//             <CartesianGrid stroke="#f1f5f9" strokeWidth={0.7} strokeDasharray="4 4" />
//             <XAxis
//               type="number"
//               dataKey="__x__"
//               name={capitalize(xKey)}
//               axisLine={{ stroke: '#cbd5e1', strokeWidth: 1.2 }}
//               tickLine={{ stroke: '#cbd5e1', strokeWidth: 0.8 }}
//               tickFormatter={(tickIndex) => {
//                 const val = uniqueXValues[tickIndex];
//                 return val === null || val === undefined ? '' : String(val);
//               }}
//               tick={{ fill: '#000', fontSize: 11, fontWeight: 700, angle: -45, textAnchor: 'end', dy: 5 }}
//               domain={[0, uniqueXValues.length > 0 ? uniqueXValues.length - 1 : 0]}
//               interval={uniqueXValues.length > 10 ? Math.floor(uniqueXValues.length / Math.min(8, uniqueXValues.length > 0 ? uniqueXValues.length : 1 )) : 0}
//               height={110}
//             >
//               <Label value={capitalize(xKey)} position='outsideBottom' offset={50} style={{ textAnchor: 'middle', fill: '#000', fontSize: '13px', fontWeight: '800' }} />
//             </XAxis>
//             <YAxis
//               type="number"
//               dataKey="__y__"
//               name={capitalize(yKey)}
//               axisLine={{ stroke: '#cbd5e1', strokeWidth: 1.2 }}
//               tickLine={{ stroke: '#cbd5e1', strokeWidth: 0.8 }}
//               tick={{ fill: '#000', fontSize: 11, fontWeight: 700, dx: -5 }}
//               tickFormatter={yAxisTickFormatter}
//               width={130}
//             >
//               <Label value={yAxisLabelValue} angle={-90} position='outsideLeft' offset={-70} style={{ textAnchor: 'middle', fill: '#334155', fontSize: '13px', fontWeight: '600' }} />
//             </YAxis>
//             <Tooltip content={<CustomTooltip xKey={xKey} yKey={yKey} xLabelToColorMap={xValueToColorMap} />} cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '3 3' }} wrapperStyle={{ zIndex: 1000 }} />
//             <Legend layout="vertical" verticalAlign="top" align="right" iconSize={9} iconType="circle" wrapperStyle={{ paddingLeft: '10px', fontSize: '11px', color: '#334155', right: 25, maxHeight: '380px', overflowY: 'auto' }} payload={legendPayload} />
//             <Scatter data={plotData} shape={<CustomDot hoveredPoint={hoveredPoint} />}>
//               {plotData.map((entry) => (<Cell key={`cell-${entry.__index__}`} fill={entry.__color__} />))}
//             </Scatter>
//           </ScatterChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default ScatterPlot;



// import React, { useState, useMemo } from 'react';
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
  Legend,
  Label,
} from 'recharts';

const COLORS = [
  '#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51',
  '#E57373', '#81C784', '#64B5F6', '#FFB74D', '#BA68C8',
  '#795548', '#A1887F', '#90A4AE', '#78909C', '#4DB6AC',
  '#AED581', '#DCE775', '#FFF176', '#FFD54F', '#FF8A65'
];

const MAX_LENGTH_X_AXIS_TITLE = 15;
const MAX_LENGTH_LEGEND_ITEMS = 12;

const truncateText = (text, maxLength) => {
  if (text === null || text === undefined) return '';
  const stringText = String(text);
  if (stringText.length > maxLength) {
    if (maxLength <= 3) return stringText.substring(0, maxLength);
    return stringText.substring(0, maxLength - 3) + '...';
  }
  return stringText;
};

const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const CustomTooltip = ({ active, payload, xKey, yKey, xLabelToColorMap }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    const xCategoryName = dataPoint[xKey];
    const yValue = dataPoint.__y__;
    const pointColor = xLabelToColorMap[xCategoryName] || payload[0].color;

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

const CustomDot = ({ cx, cy, fill, payload, hoveredPoint }) => {
  const isHovered = hoveredPoint === payload.__index__;
  const baseRadius = 7;
  return (
    <g style={{ transformOrigin: `${cx}px ${cy}px`, transition: 'transform 0.1s ease-out', transform: isHovered ? 'scale(1.15)' : 'scale(1)' }}>
      <circle cx={cx} cy={cy} r={baseRadius + 2.5} fill="none" stroke={fill} strokeWidth={1.5} opacity={0.4} />
      <circle cx={cx} cy={cy} r={baseRadius} fill={fill} stroke={"#ffffff"} strokeWidth={1.5} style={{ filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.25))' }} />
      <circle cx={cx} cy={cy} r={baseRadius * 0.35} fill="rgba(255,255,255,0.65)" />
    </g>
  );
};

const yAxisTickFormatter = (value) => {
  if (value === null || value === undefined) return '';
  if (Math.abs(value) >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(value % 1000 === 0 && Math.abs(value) < 10000 ? 0 : 1)}k`;
  return value.toString();
};

const ScatterPlot = ({ data, xKey, yKey }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Handle the case where yKey is "all" by selecting a default numeric column
  const effectiveYKey = yKey === "all" && Array.isArray(data) && data.length > 0
    ? Object.keys(data[0]).find(key => {
        const values = data.map(row => row[key]);
        return values.every(val => !isNaN(Number.parseFloat(val)) && isFinite(val));
      }) || yKey
    : yKey;

  const { plotData, uniqueXValues, xValueToColorMap, legendPayload } = useMemo(() => {
    if (!xKey || !effectiveYKey || xKey === effectiveYKey || !Array.isArray(data) || data.length === 0) {
      return { plotData: [], uniqueXValues: [], xValueToColorMap: {}, legendPayload: [] };
    }

    const uniqueXVals = [...new Set(data.map(item => item && typeof item === 'object' ? item[xKey] : undefined))]
      .filter(val => val !== null && val !== undefined)
      .sort((a, b) => String(a).localeCompare(String(b)));
    const xValMap = Object.fromEntries(uniqueXVals.map((label, index) => [label, index]));
    const xColorMap = {};
    uniqueXVals.forEach((val, index) => { xColorMap[val] = COLORS[index % COLORS.length]; });

    const pData = data
      .map((d, index) => {
        if (!d || typeof d !== 'object') return null;
        const yValRaw = d[effectiveYKey];
        const yVal = (yValRaw === null || yValRaw === undefined || String(yValRaw).trim() === '') ? NaN : parseFloat(String(yValRaw));
        const xCategoryValue = d[xKey];
        if (xCategoryValue === null || xCategoryValue === undefined) return null;
        const xNum = xValMap[xCategoryValue];
        return !isNaN(yVal) && xNum !== undefined
          ? { ...d, __x__: xNum, __y__: yVal, __color__: xColorMap[xCategoryValue], __index__: index, [xKey]: xCategoryValue }
          : null;
      })
      .filter(Boolean);

    const lPayload = uniqueXVals.map(name => ({
      value: truncateText(capitalize(String(name)), MAX_LENGTH_LEGEND_ITEMS),
      type: 'circle', id: name, color: xColorMap[name]
    }));
    return { plotData: pData, uniqueXValues: uniqueXVals, xValueToColorMap: xColorMap, legendPayload: lPayload };
  }, [data, xKey, effectiveYKey]);

  // Early returns moved AFTER hooks
  if (!xKey || !effectiveYKey || xKey === effectiveYKey) {
    return <div className="text-center p-4 text-red-500 font-semibold">Error: X-axis key and Y-axis key must be provided and distinct.</div>;
  }
  if (!Array.isArray(data) || data.length === 0) {
    return <div className="text-center p-4 text-gray-500">No data provided to render the chart.</div>;
  }
  if (plotData.length === 0) {
    return <div className="text-center p-4 text-gray-500">No valid data points to plot. Please check your Y-axis column for numeric values.</div>;
  }
  const numUniqueYValues = new Set(plotData.map(p => p.__y__)).size;
  if (uniqueXValues.length < 1 || numUniqueYValues < 1) {
    if (uniqueXValues.length === 0 || numUniqueYValues === 0) {
      return <div className="text-center p-4 text-gray-500">Not enough distinct data points for X and Y axes to render a meaningful scatter plot.</div>;
    }
  }

  const yAxisLabelValue = `${capitalize(effectiveYKey)} (M AED)`;
  const xAxisTitleFull = capitalize(xKey);
  const xAxisLabelValue = truncateText(xAxisTitleFull, MAX_LENGTH_X_AXIS_TITLE);
  const chartTitle = `${truncateText(capitalize(effectiveYKey), 15)} vs ${truncateText(capitalize(xKey), 15)}`;

  const yAxisLabelWidth = 100;
  const yAxisTicksWidth = 60;
  const labelTicksGap = 10;
  const edgePadding = 10;
  const chartMarginLeft = yAxisLabelWidth + labelTicksGap + yAxisTicksWidth + edgePadding;

  return (
    <div className="w-full font-sans" style={{ minWidth: '800px' }}>
      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 m-0">{chartTitle}</h3>
        <p className="text-sm text-slate-600 mt-1.5">Scatter plot visualization</p>
      </div>
      <div>
        <ResponsiveContainer width="100%" height={520}>
          <ScatterChart
            margin={{ 
              top: 20, 
              right: 80, 
              bottom: 70, 
              left: chartMarginLeft - 20
            }}
            onMouseMove={(e) => {
              if (e && e.activePayload && e.activePayload.length > 0) {
                setHoveredPoint(e.activePayload[0].payload.__index__);
              } else { setHoveredPoint(null); }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <CartesianGrid stroke="#f1f5f9" strokeWidth={0.7} strokeDasharray="4 4" />
            <XAxis
              type="number"
              dataKey="__x__"
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 1.2 }}
              tickLine={{ stroke: '#cbd5e1', strokeWidth: 0.8 }}
              tickFormatter={() => ''}
              tick={{ fill: '#000', fontSize: 1 }}
              domain={[0, uniqueXValues.length > 0 ? uniqueXValues.length - 1 : 0]}
              interval={uniqueXValues.length > 10 ? Math.floor(uniqueXValues.length / 10) : 0}
              height={60}
            >
              <Label
                value={xAxisLabelValue}
                position='outsideBottom'
                offset={45}
                style={{ textAnchor: 'middle', fill: '#000', fontSize: '14px', fontWeight: '600' }}
              />
            </XAxis>
            <YAxis
              type="number"
              dataKey="__y__"
              axisLine={{ stroke: '#cbd5e1', strokeWidth: 1.2 }}
              tickLine={{ stroke: '#cbd5e1', strokeWidth: 0.8 }}
              tick={{ fill: '#000', fontSize: 11, fontWeight: '500', dx: 0 }}
              tickFormatter={yAxisTickFormatter}
              width={yAxisTicksWidth}
            >
              <Label
                value={yAxisLabelValue}
                angle={-90}
                position="left"
                offset={30}
                style={{
                  textAnchor: 'middle',
                  fill: '#000',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              />
            </YAxis>
            <Tooltip content={<CustomTooltip xKey={xKey} yKey={effectiveYKey} xLabelToColorMap={xValueToColorMap} />} 
              cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '3 3' }} 
              wrapperStyle={{ zIndex: 1000 }} 
            />
            <Legend
              layout="vertical"
              verticalAlign="top"
              align="right"
              iconSize={10}
              iconType="circle"
              wrapperStyle={{
                paddingLeft: '15px',
                fontSize: '12px',
                color: '#334155',
                top: 20,
                right: 0,
              }}
              payload={legendPayload}
            />
            <Scatter data={plotData} shape={<CustomDot hoveredPoint={hoveredPoint} />}>
              {plotData.map((entry) => (<Cell key={`cell-${entry.__index__}`} fill={entry.__color__} />))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScatterPlot;