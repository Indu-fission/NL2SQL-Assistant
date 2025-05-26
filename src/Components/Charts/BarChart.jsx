// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Label,
//   Legend,
//   Cell,
// } from "recharts";

// const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// // Professional vibrant color palette for light theme
// const COLORS = [
//   "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7",
//   "#dda0dd", "#98d8c8", "#f7dc6f", "#bb8fce", "#85c1e9",
// ];

// // Enhanced gradient definitions with vibrant colors
// const GRADIENTS = [
//   { id: "gradient0", start: "#ff6b6b", end: "#ee5a52", mid: "#ff8a80" },
//   { id: "gradient1", start: "#4ecdc4", end: "#26a69a", mid: "#80cbc4" },
//   { id: "gradient2", start: "#45b7d1", end: "#1976d2", mid: "#64b5f6" },
//   { id: "gradient3", start: "#96ceb4", end: "#4caf50", mid: "#a5d6a7" },
//   { id: "gradient4", start: "#ffeaa7", end: "#ffb300", mid: "#ffcc02" },
//   { id: "gradient5", start: "#dda0dd", start2: "#ba68c8", end: "#8e24aa" },
//   { id: "gradient6", start: "#98d8c8", end: "#00695c", mid: "#4db6ac" },
//   { id: "gradient7", start: "#f7dc6f", end: "#f57f17", mid: "#fff176" },
//   { id: "gradient8", start: "#bb8fce", end: "#7b1fa2", mid: "#ce93d8" },
//   { id: "gradient9", start: "#85c1e9", end: "#0d47a1", mid: "#90caf9" },
// ];

// // Sleek modern tooltip
// const CustomTooltip = ({ active, payload, label, xAxisKey, yKey }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div style={{
//         background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
//         border: '2px solid #e2e8f0',
//         borderRadius: '16px',
//         padding: '20px 24px',
//         color: '#1a202c',
//         fontSize: '14px',
//         fontWeight: '500',
//         minWidth: '200px',
//         backdropFilter: 'blur(10px)',
//         transform: 'translateY(-8px)',
//         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//       }}>
//         <div style={{ 
//           fontSize: '18px', 
//           fontWeight: '700', 
//           marginBottom: '12px',
//           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//           WebkitBackgroundClip: 'text',
//           WebkitTextFillColor: 'transparent',
//           backgroundClip: 'text',
//           letterSpacing: '-0.5px',
//         }}>
//           {capitalize(xAxisKey || 'Category')}: {label}
//         </div>
//         {payload.map((entry, index) => (
//           <div key={index} style={{ 
//             display: 'flex', 
//             alignItems: 'center', 
//             justifyContent: 'space-between',
//             marginTop: '8px',
//             padding: '6px 0',
//             borderTop: index > 0 ? '1px solid #e2e8f0' : 'none',
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center' }}>
//               <div style={{
//                 width: '14px',
//                 height: '14px',
//                 borderRadius: '50%',
//                 background: `linear-gradient(135deg, ${entry.color} 0%, ${entry.color}dd 100%)`,
//                 marginRight: '10px',
//                 border: '2px solid #ffffff',
//               }}></div>
//               <span style={{ color: '#4a5568', fontWeight: '600' }}>
//                 {capitalize(entry.name || entry.dataKey)}
//               </span>
//             </div>
//             <span style={{ 
//               fontWeight: '800',
//               color: '#2d3748',
//               marginLeft: '16px',
//               fontSize: '16px',
//             }}>
//               {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
//             </span>
//           </div>
//         ))}
//       </div>
//     );
//   }
//   return null;
// };

// // Enhanced modern legend
// const CustomLegend = ({ payload }) => {
//   return (
//     <div style={{
//       display: 'flex',
//       flexWrap: 'wrap',
//       gap: '12px',
//       justifyContent: 'center',
//       marginBottom: '24px',
//       padding: '20px',
//       background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
//       borderRadius: '16px',
//       border: '2px solid #e2e8f0',
//     }}>
//       {payload.map((entry, index) => (
//         <div key={index} style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '10px',
//           padding: '10px 16px',
//           background: '#ffffff',
//           borderRadius: '12px',
//           border: '2px solid #e2e8f0',
//           transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//           cursor: 'pointer',
//           transform: 'translateY(0)',
//         }} 
//         onMouseEnter={(e) => {
//           e.currentTarget.style.transform = 'translateY(-4px)';
//           e.currentTarget.style.borderColor = entry.color;
//           e.currentTarget.style.background = `linear-gradient(135deg, #ffffff 0%, ${entry.color}10 100%)`;
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.transform = 'translateY(0)';
//           e.currentTarget.style.borderColor = '#e2e8f0';
//           e.currentTarget.style.background = '#ffffff';
//         }}>
//           <div style={{
//             width: '14px',
//             height: '14px',
//             borderRadius: '50%',
//             background: `linear-gradient(135deg, ${entry.color} 0%, ${entry.color}dd 100%)`,
//             border: '2px solid #ffffff',
//           }}></div>
//           <span style={{ 
//             color: '#2d3748',
//             fontSize: '14px',
//             fontWeight: '700',
//             letterSpacing: '-0.25px',
//           }}>
//             {capitalize(entry.value)}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };

// const BarChartComponent = ({ data, xKey, yKey, yOptions }) => {
//   if (!data || data.length === 0) {
//     return (
//       <div style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: '400px',
//         background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
//         borderRadius: '24px',
//         border: '2px solid #e2e8f0',
//         color: '#4a5568',
//         fontSize: '20px',
//         fontWeight: '700',
//       }}>
//         <div style={{
//           fontSize: '48px',
//           marginBottom: '16px',
//           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//           WebkitBackgroundClip: 'text',
//           WebkitTextFillColor: 'transparent',
//           backgroundClip: 'text',
//         }}>
//           📊
//         </div>
//         No data available to display.
//       </div>
//     );
//   }
  
//   if ((!xKey && xKey !== "all") || (!yKey && yKey !== "all")) {
//     return (
//       <div style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: '400px',
//         background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
//         borderRadius: '24px',
//         border: '2px solid #e2e8f0',
//         color: '#4a5568',
//         fontSize: '20px',
//         fontWeight: '700',
//       }}>
//         <div style={{
//           fontSize: '48px',
//           marginBottom: '16px',
//           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//           WebkitBackgroundClip: 'text',
//           WebkitTextFillColor: 'transparent',
//           backgroundClip: 'text',
//         }}>
//           ⚙️
//         </div>
//         Please select both X and Y axes to display the chart.
//       </div>
//     );
//   }

//   // Determine X axis key
//   let xAxisKey = xKey;
//   let chartData = [...data];

//   if (xKey === "all") {
//     chartData = data.map((item, idx) => ({
//       ...item,
//       index: `Item ${idx + 1}`,
//     }));
//     xAxisKey = "index";
//   }

//   // Case 1: Multiple metrics ("all")
//   if (yKey === "all") {
//     const metricsToDisplay = yOptions;

//     return (
//       <div style={{
//         background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
//         borderRadius: '24px',
//         padding: '32px',
//         border: '3px solid #e2e8f0',
//         position: 'relative',
//         overflow: 'hidden',
//       }}>
//         {/* Decorative elements */}
//         <div style={{
//           position: 'absolute',
//           top: '-50px',
//           right: '-50px',
//           width: '200px',
//           height: '200px',
//           background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
//           borderRadius: '50%',
//           zIndex: 0,
//         }}></div>
//         <div style={{
//           position: 'absolute',
//           bottom: '-30px',
//           left: '-30px',
//           width: '150px',
//           height: '150px',
//           background: 'linear-gradient(135deg, #f093fb20 0%, #f5576c20 100%)',
//           borderRadius: '50%',
//           zIndex: 0,
//         }}></div>
        
//         <div style={{
//           textAlign: 'center',
//           marginBottom: '32px',
//           position: 'relative',
//           zIndex: 1,
//         }}>
//           <div style={{
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             WebkitBackgroundClip: 'text',
//             WebkitTextFillColor: 'transparent',
//             backgroundClip: 'text',
//             fontSize: '32px',
//             fontWeight: '900',
//             letterSpacing: '-1px',
//             marginBottom: '8px',
//           }}>
//             Multi-Metric Analysis
//           </div>
//           <div style={{
//             height: '4px',
//             width: '120px',
//             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//             borderRadius: '2px',
//             margin: '0 auto',
//           }}></div>
//         </div>
        
//         <div style={{ position: 'relative', zIndex: 1 }}>
//           <ResponsiveContainer width="100%" height={520}>
//             <BarChart data={chartData} margin={{ top: 20, right: 50, left: 70, bottom: 100 }}>
//               <defs>
//                 {GRADIENTS.map((gradient) => (
//                   <linearGradient key={gradient.id} id={gradient.id} x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor={gradient.start} stopOpacity={1}/>
//                     <stop offset="50%" stopColor={gradient.mid || gradient.start} stopOpacity={0.9}/>
//                     <stop offset="100%" stopColor={gradient.end} stopOpacity={0.8}/>
//                   </linearGradient>
//                 ))}
//               </defs>
              
//               <CartesianGrid 
//                 strokeDasharray="0" 
//                 stroke="#e2e8f0"
//                 strokeWidth={2}
//                 horizontal={true}
//                 vertical={false}
//               />
              
//               <XAxis
//                 dataKey={xAxisKey}
//                 interval={0}
//                 angle={-35}
//                 textAnchor="end"
//                 height={120}
//                 tick={{
//                   fill: '#4a5568',
//                   fontSize: 13,
//                   fontWeight: '700',
//                 }}
//                 axisLine={{ stroke: '#cbd5e0', strokeWidth: 3 }}
//                 tickLine={{ stroke: '#cbd5e0', strokeWidth: 2 }}
//               >
//                 <Label
//                   value={capitalize(xAxisKey)}
//                   position="bottom"
//                   offset={-10}
//                   style={{ 
//                     textAnchor: "middle", 
//                     fontSize: 18, 
//                     fill: "#2d3748",
//                     fontWeight: '800',
//                   }}
//                 />
//               </XAxis>
              
//               <YAxis
//                 tick={{
//                   fill: '#4a5568',
//                   fontSize: 13,
//                   fontWeight: '700',
//                 }}
//                 axisLine={{ stroke: '#cbd5e0', strokeWidth: 3 }}
//                 tickLine={{ stroke: '#cbd5e0', strokeWidth: 2 }}
//               >
//                 <Label
//                   value="Values"
//                   angle={-90}
//                   position="insideLeft"
//                   offset={15}
//                   style={{ 
//                     textAnchor: "middle", 
//                     fontSize: 18, 
//                     fill: "#2d3748",
//                     fontWeight: '800',
//                   }}
//                 />
//               </YAxis>
              
//               <Tooltip
//                 content={<CustomTooltip xAxisKey={xAxisKey} yKey={yKey} />}
//                 cursor={{
//                   fill: 'rgba(102, 126, 234, 0.1)',
//                   stroke: '#667eea',
//                   strokeWidth: 3,
//                 }}
//               />
              
//               <Legend content={<CustomLegend />} />
              
//               {metricsToDisplay.map((metric, idx) => (
//                 <Bar
//                   key={metric}
//                   dataKey={metric}
//                   name={capitalize(metric)}
//                   fill={`url(#gradient${idx % GRADIENTS.length})`}
//                   radius={[8, 8, 0, 0]}
//                   maxBarSize={55}
//                   stroke="#ffffff"
//                   strokeWidth={2}
//                 />
//               ))}
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     );
//   }

//   // Case 2: Single metric - each data item as separate bar with unique color
//   return (
//     <div style={{
//       background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
//       borderRadius: '24px',
//       padding: '32px',
//       border: '3px solid #e2e8f0',
//       position: 'relative',
//       overflow: 'hidden',
//     }}>
//       {/* Decorative elements */}
//       <div style={{
//         position: 'absolute',
//         top: '-50px',
//         right: '-50px',
//         width: '200px',
//         height: '200px',
//         background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
//         borderRadius: '50%',
//         zIndex: 0,
//       }}></div>
//       <div style={{
//         position: 'absolute',
//         bottom: '-30px',
//         left: '-30px',
//         width: '150px',
//         height: '150px',
//         background: 'linear-gradient(135deg, #f093fb20 0%, #f5576c20 100%)',
//         borderRadius: '50%',
//         zIndex: 0,
//       }}></div>
      
//       <div style={{
//         textAlign: 'center',
//         marginBottom: '32px',
//         position: 'relative',
//         zIndex: 1,
//       }}>
//         <div style={{
//           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//           WebkitBackgroundClip: 'text',
//           WebkitTextFillColor: 'transparent',
//           backgroundClip: 'text',
//           fontSize: '32px',
//           fontWeight: '900',
//           letterSpacing: '-1px',
//           marginBottom: '8px',
//         }}>
//           {capitalize(yKey)} Distribution
//         </div>
//         <div style={{
//           height: '4px',
//           width: '120px',
//           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//           borderRadius: '2px',
//           margin: '0 auto',
//         }}></div>
//       </div>
      
//       <div style={{ position: 'relative', zIndex: 1 }}>
//         <ResponsiveContainer width="100%" height={520}>
//           <BarChart data={chartData} margin={{ top: 20, right: 50, left: 70, bottom: 100 }}>
//             <defs>
//               {GRADIENTS.map((gradient) => (
//                 <linearGradient key={gradient.id} id={gradient.id} x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="0%" stopColor={gradient.start} stopOpacity={1}/>
//                   <stop offset="50%" stopColor={gradient.mid || gradient.start} stopOpacity={0.9}/>
//                   <stop offset="100%" stopColor={gradient.end} stopOpacity={0.8}/>
//                 </linearGradient>
//               ))}
//             </defs>
            
//             <CartesianGrid 
//               strokeDasharray="0" 
//               stroke="#e2e8f0"
//               strokeWidth={2}
//               horizontal={true}
//               vertical={false}
//             />
            
//             <XAxis
//               dataKey={xAxisKey}
//               interval={0}
//               angle={-35}
//               textAnchor="end"
//               height={120}
//               tick={{
//                 fill: '#4a5568',
//                 fontSize: 13,
//                 fontWeight: '700',
//               }}
//               axisLine={{ stroke: '#cbd5e0', strokeWidth: 3 }}
//               tickLine={{ stroke: '#cbd5e0', strokeWidth: 2 }}
//             >
//               <Label
//                 value={capitalize(xAxisKey)}
//                 position="bottom"
//                 offset={-10}
//                 style={{ 
//                   textAnchor: "middle", 
//                   fontSize: 18, 
//                   fill: "#2d3748",
//                   fontWeight: '800',
//                 }}
//               />
//             </XAxis>
            
//             <YAxis
//               tick={{
//                 fill: '#4a5568',
//                 fontSize: 13,
//                 fontWeight: '700',
//               }}
//               axisLine={{ stroke: '#cbd5e0', strokeWidth: 3 }}
//               tickLine={{ stroke: '#cbd5e0', strokeWidth: 2 }}
//             >
//               <Label
//                 value={capitalize(yKey)}
//                 angle={-90}
//                 position="insideLeft"
//                 offset={15}
//                 style={{ 
//                   textAnchor: "middle", 
//                   fontSize: 18, 
//                   fill: "#2d3748",
//                   fontWeight: '800',
//                 }}
//               />
//             </YAxis>
            
//             <Tooltip
//               content={<CustomTooltip xAxisKey={xAxisKey} yKey={yKey} />}
//               cursor={{
//                 fill: 'rgba(102, 126, 234, 0.1)',
//                 stroke: '#667eea',
//                 strokeWidth: 3,
//               }}
//             />
            
//             <Bar dataKey={yKey} name={capitalize(yKey)} radius={[10, 10, 0, 0]} maxBarSize={70} stroke="#ffffff" strokeWidth={3}>
//               {chartData.map((entry, index) => (
//                 <Cell 
//                   key={`cell-${index}`} 
//                   fill={`url(#gradient${index % GRADIENTS.length})`}
//                 />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default BarChartComponent;



import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Label,
} from "recharts";

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Professional vibrant color palette
const COLORS = [
  "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7",
  "#dda0dd", "#98d8c8", "#f7dc6f", "#bb8fce", "#85c1e9",
  "#ff9ff3", "#54a0ff", "#7bed9f", "#ffa502", "#ff3838",
  "#70a1ff", "#5f27cd", "#00d2d3", "#ff9f43", "#ee5a52"
];

// Enhanced gradient definitions with vibrant colors
const GRADIENTS = [
  { id: "gradient0", start: "#ff6b6b", end: "#ee5a52", mid: "#ff8a80" },
  { id: "gradient1", start: "#4ecdc4", end: "#26a69a", mid: "#80cbc4" },
  { id: "gradient2", start: "#45b7d1", end: "#1976d2", mid: "#64b5f6" },
  { id: "gradient3", start: "#96ceb4", end: "#4caf50", mid: "#a5d6a7" },
  { id: "gradient4", start: "#ffeaa7", end: "#ffb300", mid: "#ffcc02" },
  { id: "gradient5", start: "#dda0dd", start2: "#ba68c8", end: "#8e24aa" },
  { id: "gradient6", start: "#98d8c8", end: "#00695c", mid: "#4db6ac" },
  { id: "gradient7", start: "#f7dc6f", end: "#f57f17", mid: "#fff176" },
  { id: "gradient8", start: "#bb8fce", end: "#7b1fa2", mid: "#ce93d8" },
  { id: "gradient9", start: "#85c1e9", end: "#0d47a1", mid: "#90caf9" },
  { id: "gradient10", start: "#ff9ff3", end: "#e91e63", mid: "#f48fb1" },
  { id: "gradient11", start: "#54a0ff", end: "#2196f3", mid: "#90caf9" },
  { id: "gradient12", start: "#7bed9f", end: "#4caf50", mid: "#a5d6a7" },
  { id: "gradient13", start: "#ffa502", end: "#ff9800", mid: "#ffcc02" },
  { id: "gradient14", start: "#ff3838", end: "#f44336", mid: "#ef5350" },
  { id: "gradient15", start: "#70a1ff", end: "#3f51b5", mid: "#7986cb" },
  { id: "gradient16", start: "#5f27cd", end: "#673ab7", mid: "#9575cd" },
  { id: "gradient17", start: "#00d2d3", end: "#009688", mid: "#4db6ac" },
  { id: "gradient18", start: "#ff9f43", end: "#ff5722", mid: "#ff8a65" },
  { id: "gradient19", start: "#ee5a52", end: "#d32f2f", mid: "#ef5350" },
];

// Format numbers for display (convert thousands to k format)
const formatNumber = (value) => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'k';
  }
  return value.toString();
};

// Custom Y-axis tick formatter without AED (will be in label)
const formatYAxisTick = (value) => {
  return formatNumber(value);
};

// Sleek modern tooltip
const CustomTooltip = ({ active, payload, label, xAxisKey, yKey }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        padding: '16px 20px',
        color: '#1a202c',
        fontSize: '14px',
        fontWeight: '500',
        minWidth: '180px',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      }}>
        <div style={{ 
          fontSize: '16px', 
          fontWeight: '700', 
          marginBottom: '10px',
          color: '#2d3748',
        }}>
          {capitalize(xAxisKey || 'Category')}: {label}
        </div>
        {payload.map((entry, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginTop: '6px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: entry.color,
                marginRight: '8px',
              }}></div>
              <span style={{ color: '#4a5568', fontWeight: '600' }}>
                {capitalize(entry.name || entry.dataKey)}
              </span>
            </div>
            <span style={{ 
              fontWeight: '700',
              color: '#2d3748',
              marginLeft: '12px',
            }}>
              {typeof entry.value === 'number' ? `${entry.value.toLocaleString()} AED` : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Color legend component
const ColorLegend = ({ data, yKey, yOptions }) => {
  const isMultiMetric = yKey === "all" && yOptions;
  
  if (isMultiMetric) {
    return (
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '12px',
        padding: '16px',
        border: '2px solid #e2e8f0',
        backdropFilter: 'blur(10px)',
        maxWidth: '200px',
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '700',
          marginBottom: '12px',
          color: '#2d3748',
        }}>
          Metrics
        </div>
        {yOptions.map((metric, index) => (
          <div key={metric} style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px',
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '4px',
              background: `linear-gradient(135deg, ${GRADIENTS[index % GRADIENTS.length].start} 0%, ${GRADIENTS[index % GRADIENTS.length].end} 100%)`,
              marginRight: '10px',
            }}></div>
            <span style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#4a5568',
            }}>
              {capitalize(metric)}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '12px',
      padding: '16px',
      // border: '2px solid #e2e8f0',
      backdropFilter: 'blur(10px)',
      maxWidth: '200px',
    }}>
      <div style={{
        fontSize: '14px',
        fontWeight: '700',
        marginBottom: '12px',
        color: '#2d3748',
      }}>
        Categories
      </div>
      {data.slice(0, 10).map((item, index) => (
        <div key={index} style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '8px',
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            // borderRadius: '4px',
            background: `linear-gradient(135deg, ${GRADIENTS[index % GRADIENTS.length].start} 0%, ${GRADIENTS[index % GRADIENTS.length].end} 100%)`,
            marginRight: '10px',
          }}></div>
          <span style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#4a5568',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {item[Object.keys(item)[0]] || `Item ${index + 1}`}
          </span>
        </div>
      ))}
    </div>
  );
};

const BarChartComponent = ({ data, xKey, yKey, yOptions }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        color: '#4a5568',
        fontSize: '18px',
        fontWeight: '600',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        No data available to display.
      </div>
    );
  }
  
  if ((!xKey && xKey !== "all") || (!yKey && yKey !== "all")) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '400px',
        color: '#4a5568',
        fontSize: '18px',
        fontWeight: '600',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚙️</div>
        Please select both X and Y axes to display the chart.
      </div>
    );
  }

  // Determine X axis key
  let xAxisKey = xKey;
  let chartData = [...data];

  if (xKey === "all") {
    chartData = data.map((item, idx) => ({
      ...item,
      index: `Item ${idx + 1}`,
    }));
    xAxisKey = "index";
  }

  // Case 1: Multiple metrics ("all")
  if (yKey === "all") {
    const metricsToDisplay = yOptions;

    return (
      <div style={{
        width: '100%',
        height: '600px',
        position: 'relative',
        padding: '20px',
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: '800',
            color: '#2d3748',
            marginBottom: '8px',
          }}>
            Multi-Metric Analysis
          </div>
        </div>
        
        <ColorLegend data={chartData} yKey={yKey} yOptions={yOptions} />
        
        <ResponsiveContainer width="100%" height="85%">
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 250, left: 120, bottom: 100 }}
            barGap={5}
            barCategoryGap={10}
          >
            <defs>
              {GRADIENTS.map((gradient) => (
                <linearGradient key={gradient.id} id={gradient.id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={gradient.start} stopOpacity={1}/>
                  <stop offset="50%" stopColor={gradient.mid || gradient.start} stopOpacity={0.9}/>
                  <stop offset="100%" stopColor={gradient.end} stopOpacity={0.8}/>
                </linearGradient>
              ))}
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e2e8f0"
              strokeWidth={1}
              horizontal={true}
              vertical={false}
            />
            
            <XAxis
              dataKey={xAxisKey}
              interval={0}
              angle={-10}
              textAnchor="end"
              height={70}
              tick={{
                fill: '#4a5568',
                fontSize: 11,
                fontWeight: '600',
              }}
              axisLine={{ stroke: '#cbd5e0', strokeWidth: 2 }}
              tickLine={{ stroke: '#cbd5e0', strokeWidth: 1 }}
            >
              <Label
                value={capitalize(xAxisKey)}
                position="insideBottom"
                offset={-25}
                style={{ 
                  textAnchor: "middle", 
                  fontSize: 16, 
                  fill: "#2d3748",
                  fontWeight: '700',
                }}
              />
            </XAxis>
            
            <YAxis
              tickFormatter={formatYAxisTick}
              tick={{
                fill: '#4a5568',
                fontSize: 11,
                fontWeight: '600',
              }}
              axisLine={{ stroke: '#cbd5e0', strokeWidth: 2 }}
              tickLine={{ stroke: '#cbd5e0', strokeWidth: 1 }}
              width={100}
            >
              <Label
                value="Values (AED)"
                angle={-90}
                position="insideLeft"
                offset={-5}
                style={{ 
                  textAnchor: "middle", 
                  fontSize: 16, 
                  fill: "#2d3748",
                  fontWeight: '700',
                }}
              />
            </YAxis>
            
            <Tooltip
              content={<CustomTooltip xAxisKey={xAxisKey} yKey={yKey} />}
              cursor={{
                fill: 'rgba(102, 126, 234, 0.1)',
              }}
            />
            
            {metricsToDisplay.map((metric, idx) => (
              <Bar
                key={metric}
                dataKey={metric}
                name={capitalize(metric)}
                fill={`url(#gradient${idx % GRADIENTS.length})`}
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Case 2: Single metric - each data item as separate bar with unique color
  return (
    <div style={{
      width: '100%',
      height: '600px',
      position: 'relative',
      padding: '20px',
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '20px',
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: '800',
          color: '#2d3748',
          marginBottom: '8px',
        }}>
          {capitalize(yKey)} Distribution
        </div>
      </div>
      
      <ColorLegend data={chartData} yKey={yKey} />
      
      <ResponsiveContainer width="100%" height="85%">
        <BarChart 
          data={chartData} 
          margin={{ top: 20, right: 250, left: 120, bottom: 100 }}
          barGap={5}
        >
          <defs>
            {GRADIENTS.map((gradient) => (
              <linearGradient key={gradient.id} id={gradient.id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradient.start} stopOpacity={1}/>
                <stop offset="50%" stopColor={gradient.mid || gradient.start} stopOpacity={0.9}/>
                <stop offset="100%" stopColor={gradient.end} stopOpacity={0.8}/>
              </linearGradient>
            ))}
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e2e8f0"
            strokeWidth={1}
            horizontal={true}
            vertical={false}
          />
          
          <XAxis
            dataKey={xAxisKey}
            interval={0}
            angle={-25}
            textAnchor="end"
            height={70}
            tick={{
              fill: '#4a5568',
              fontSize: 11,
              fontWeight: '600',
            }}
            axisLine={{ stroke: '#cbd5e0', strokeWidth: 2 }}
            tickLine={{ stroke: '#cbd5e0', strokeWidth: 1 }}
          >
            <Label
              value={capitalize(xAxisKey)}
              position="insideBottom"
              offset={-25}
              style={{ 
                textAnchor: "middle", 
                fontSize: 16, 
                fill: "#2d3748",
                fontWeight: '700',
              }}
            />
          </XAxis>
          
          <YAxis
            tickFormatter={formatYAxisTick}
            tick={{
              fill: '#4a5568',
              fontSize: 11,
              fontWeight: '600',
            }}
            axisLine={{ stroke: '#cbd5e0', strokeWidth: 2 }}
            tickLine={{ stroke: '#cbd5e0', strokeWidth: 1 }}
            width={100}
          >
            <Label
              value={`${capitalize(yKey)} (AED)`}
              angle={-90}
              position="insideLeft"
              offset={-5}
              style={{ 
                textAnchor: "middle", 
                fontSize: 16, 
                fill: "#2d3748",
                fontWeight: '700',
              }}
            />
          </YAxis>
          
          <Tooltip
            content={<CustomTooltip xAxisKey={xAxisKey} yKey={yKey} />}
            cursor={{
              fill: 'rgba(102, 126, 234, 0.1)',
            }}
          />
          
          <Bar 
            dataKey={yKey} 
            name={capitalize(yKey)} 
            radius={[6, 6, 0, 0]} 
            maxBarSize={60}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#gradient${index % GRADIENTS.length})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;