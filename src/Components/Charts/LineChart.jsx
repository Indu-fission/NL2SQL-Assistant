// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, Legend } from "recharts"
// import { useState } from "react"

// const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

// // Enhanced color palette with vibrant and dark professional colors
// const COLORS = [
//   "#FF6B35", // Vibrant Orange
//   "#2E86AB", // Deep Blue
//   "#A23B72", // Rich Magenta
//   "#F18F01", // Golden Yellow
//   "#C73E1D", // Deep Red
//   "#4ECDC4", // Turquoise
//   "#45B7D1", // Sky Blue
//   "#96CEB4", // Mint Green
//   "#FFEAA7", // Light Yellow
//   "#DDA0DD", // Plum
//   "#20B2AA", // Light Sea Green
//   "#FF7F50", // Coral
// ]

// // Custom dot component for enhanced interactivity
// const CustomDot = ({ cx, cy, stroke, payload, dataKey, isActive }) => {
//   if (!isActive) return null
  
//   return (
//     <circle
//       cx={cx}
//       cy={cy}
//       r={6}
//       fill={stroke}
//       stroke="#ffffff"
//       strokeWidth={2}
//       style={{
//         filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
//         transition: "all 0.3s ease"
//       }}
//     />
//   )
// }

// // Enhanced custom tooltip
// const CustomTooltip = ({ active, payload, label, xAxisKey }) => {
//   if (!active || !payload || !payload.length) return null

//   return (
//     <div style={{
//       background: "rgba(255, 255, 255, 0.95)",
//       border: "1px solid #e0e0e0",
//       borderRadius: "12px",
//       padding: "16px",
//       backdropFilter: "blur(10px)",
//       boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
//       minWidth: "200px"
//     }}>
//       <p style={{
//         margin: "0 0 12px 0",
//         fontWeight: "600",
//         fontSize: "14px",
//         color: "#2c3e50",
//         borderBottom: "2px solid #ecf0f1",
//         paddingBottom: "8px"
//       }}>
//         {capitalize(xAxisKey)}: <span style={{ color: "#3498db" }}>{label}</span>
//       </p>
//       {payload.map((entry, index) => (
//         <div key={index} style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           margin: "8px 0",
//           padding: "4px 0"
//         }}>
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <div style={{
//               width: "12px",
//               height: "12px",
//               borderRadius: "50%",
//               backgroundColor: entry.color,
//               border: "2px solid #fff",
//               boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
//             }} />
//             <span style={{ fontSize: "13px", color: "#34495e", fontWeight: "500" }}>
//               {capitalize(entry.name)}
//             </span>
//           </div>
//           <span style={{
//             fontSize: "14px",
//             fontWeight: "700",
//             color: entry.color,
//             backgroundColor: `${entry.color}15`,
//             padding: "4px 8px",
//             borderRadius: "6px"
//           }}>
//             {Number.parseFloat(entry.value).toFixed(2)}
//           </span>
//         </div>
//       ))}
//     </div>
//   )
// }

// // Enhanced legend component
// const CustomLegend = ({ payload }) => {
//   return (
//     <div style={{
//       display: "flex",
//       flexWrap: "wrap",
//       justifyContent: "center",
//       gap: "20px",
//       marginBottom: "20px",
//       padding: "15px"
//     }}>
//       {payload.map((entry, index) => (
//         <div key={index} style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "8px",
//           padding: "8px 16px",
//           borderRadius: "25px",
//           backgroundColor: `${entry.color}10`,
//           border: `2px solid ${entry.color}`,
//           transition: "all 0.3s ease",
//           cursor: "pointer"
//         }}
//         onMouseEnter={(e) => {
//           e.target.style.backgroundColor = `${entry.color}20`
//           e.target.style.transform = "translateY(-2px)"
//         }}
//         onMouseLeave={(e) => {
//           e.target.style.backgroundColor = `${entry.color}10`
//           e.target.style.transform = "translateY(0px)"
//         }}>
//           <div style={{
//             width: "16px",
//             height: "16px",
//             borderRadius: "50%",
//             backgroundColor: entry.color,
//             border: "2px solid #fff",
//             boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
//           }} />
//           <span style={{
//             fontSize: "13px",
//             fontWeight: "600",
//             color: "#2c3e50"
//           }}>
//             {capitalize(entry.value)}
//           </span>
//         </div>
//       ))}
//     </div>
//   )
// }

// const LineChartComponent = ({ data, xKey, yKey, yOptions }) => {
//   const [hoveredLine, setHoveredLine] = useState(null)
//   const [activeLines, setActiveLines] = useState({})

//   if (!data || data.length === 0) {
//     return (
//       <div style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         height: "400px",
//         color: "#7f8c8d",
//         fontSize: "16px"
//       }}>
//         <div style={{
//           fontSize: "48px",
//           marginBottom: "16px",
//           opacity: 0.3
//         }}>📊</div>
//         <div style={{ fontWeight: "600" }}>No data available to display</div>
//         <div style={{ fontSize: "14px", marginTop: "8px", opacity: 0.7 }}>
//           Please provide data to generate the chart
//         </div>
//       </div>
//     )
//   }

//   if ((!xKey && xKey !== "all") || (!yKey && yKey !== "all")) {
//     return (
//       <div style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         height: "400px",
//         color: "#e74c3c",
//         fontSize: "16px"
//       }}>
//         <div style={{
//           fontSize: "48px",
//           marginBottom: "16px",
//           opacity: 0.5
//         }}>⚠️</div>
//         <div style={{ fontWeight: "600" }}>Configuration Required</div>
//         <div style={{ fontSize: "14px", marginTop: "8px", opacity: 0.8 }}>
//           Please select both X and Y axes to display the chart
//         </div>
//       </div>
//     )
//   }

//   // Handle the "All" case for X-axis
//   const xAxisKey =
//     xKey === "all" ? (data[0] && Object.keys(data[0]).find((key) => !yOptions.includes(key))) || "index" : xKey

//   // Prepare data for rendering
//   let chartData = [...data]

//   // If x-axis is "all", we need to create a special index
//   if (xKey === "all") {
//     chartData = data.map((item, index) => ({
//       ...item,
//       index: `Item ${index + 1}`,
//     }))
//   }

//   // Determine which Y metrics to display
//   const metricsToDisplay = yKey === "all" ? yOptions : [yKey]

//   return (
//     <div style={{
//       background: "transparent",
//       padding: "0",
//       borderRadius: "0",
//       width: "100%"
//     }}>
//       <ResponsiveContainer width="100%" height={480}>
//         <LineChart 
//           data={chartData} 
//           margin={{ top: 40, right: 50, left: 70, bottom: 80 }}
//           style={{ background: "transparent" }}
//         >
//           <defs>
//             <linearGradient id="gridGradient" x1="0" y1="0" x2="1" y2="1">
//               <stop offset="0%" stopColor="#bdc3c7" stopOpacity="0.4"/>
//               <stop offset="100%" stopColor="#ecf0f1" stopOpacity="0.1"/>
//             </linearGradient>
//           </defs>

//           <CartesianGrid 
//             strokeDasharray="2 4" 
//             stroke="url(#gridGradient)"
//             strokeWidth={1}
//             opacity={0.6}
//           />

//           <XAxis 
//             dataKey={xAxisKey} 
//             interval={0} 
//             angle={-35}
//             textAnchor="end" 
//             height={90}
//             tick={{
//               fontSize: 12,
//               fontWeight: "500",
//               fill: "#2c3e50"
//             }}
//             axisLine={{
//               stroke: "#34495e",
//               strokeWidth: 2
//             }}
//             tickLine={{
//               stroke: "#34495e",
//               strokeWidth: 1
//             }}
//           >
//             <Label
//               value={capitalize(xAxisKey)}
//               position="insideBottom"
//               offset={-15}
//               style={{ 
//                 textAnchor: "middle", 
//                 fontSize: 16, 
//                 fill: "#2c3e50",
//                 fontWeight: "700"
//               }}
//             />
//           </XAxis>

//           <YAxis
//             tick={{
//               fontSize: 12,
//               fontWeight: "500",
//               fill: "#2c3e50"
//             }}
//             axisLine={{
//               stroke: "#34495e",
//               strokeWidth: 2
//             }}
//             tickLine={{
//               stroke: "#34495e",
//               strokeWidth: 1
//             }}
//           >
//             <Label
//               value={yKey === "all" ? "Values" : capitalize(yKey)}
//               angle={-90}
//               position="insideLeft"
//               offset={10}
//               style={{ 
//                 textAnchor: "middle", 
//                 fontSize: 16, 
//                 fill: "#2c3e50",
//                 fontWeight: "700"
//               }}
//             />
//           </YAxis>

//           <Tooltip 
//             content={<CustomTooltip xAxisKey={xAxisKey} />}
//             cursor={{
//               stroke: "#3498db",
//               strokeWidth: 2,
//               strokeDasharray: "5 5"
//             }}
//           />

//           <Legend 
//             content={<CustomLegend />}
//           />

//           {metricsToDisplay.map((metric, index) => (
//             <Line
//               key={metric}
//               type="monotone"
//               dataKey={metric}
//               name={capitalize(metric)}
//               stroke={COLORS[index % COLORS.length]}
//               strokeWidth={hoveredLine === metric ? 4 : 3}
//               dot={false}
//               activeDot={{
//                 r: 8,
//                 stroke: COLORS[index % COLORS.length],
//                 strokeWidth: 3,
//                 fill: "#ffffff",
//                 style: {
//                   filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.25))",
//                   transition: "all 0.3s ease"
//                 }
//               }}
//               onMouseEnter={() => setHoveredLine(metric)}
//               onMouseLeave={() => setHoveredLine(null)}
//               style={{
//                 filter: hoveredLine && hoveredLine !== metric ? "opacity(0.4)" : "opacity(1)",
//                 transition: "all 0.3s ease"
//               }}
//               animationDuration={1500}
//               animationBegin={index * 200}
//             />
//           ))}
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   )
// }

// export default LineChartComponent

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  Legend,
} from "recharts";

const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Provided color palette
const COLORS = [
  "#FF6B35", "#2E86AB", "#A23B72", "#F18F01", "#C73E1D",
  "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD",
  "#20B2AA", "#FF7F50",
];

// Custom Tooltip (using your well-styled version)
const CustomTooltip = ({ active, payload, label, xAxisKey }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.98)",
      border: "1px solid #dfe6e9",
      borderRadius: "10px",
      padding: "12px 15px",
      backdropFilter: "blur(8px)",
      boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
      minWidth: "180px",
      fontFamily: "'Inter', sans-serif",
    }}>
      <p style={{
        margin: "0 0 10px 0",
        fontWeight: "600",
        fontSize: "14px",
        color: "#2d3436",
        borderBottom: "1px solid #ecf0f1",
        paddingBottom: "8px",
      }}>
        {capitalize(xAxisKey)}: <span style={{ color: "#0984e3" }}>{label}</span>
      </p>
      {payload.map((entry, index) => (
        <div key={index} style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "6px 0",
          padding: "3px 0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: entry.color,
              border: "1px solid #fff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }} />
            <span style={{ fontSize: "13px", color: "#34495e", fontWeight: "500" }}>
              {capitalize(entry.name)}
            </span>
          </div>
          <span style={{
            fontSize: "13px",
            fontWeight: "600",
            color: entry.color,
            backgroundColor: `${entry.color}20`,
            padding: "3px 6px",
            borderRadius: "4px",
          }}>
            {Number.parseFloat(entry.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      ))}
    </div>
  );
};

// Y-axis tick formatter (e.g., 10000 -> 10k)
const yAxisTickFormatter = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  }
  return value.toString();
};

// Custom Legend Content Renderer (for right-side legend)
const renderLegend = (props) => {
  const { payload } = props;
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '380px', overflowY: 'auto', textAlign: 'left' }}>
      {payload.map((entry, index) => (
        <li
          key={`item-${index}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px', 
            fontSize: '13px', 
            color: '#2d3436', 
            cursor: 'pointer',
            opacity: entry.inactive ? 0.4 : 1, 
          }}
        >
          <div style={{
            width: '14px', 
            height: '14px',
            backgroundColor: entry.color,
            marginRight: '10px', 
            borderRadius: '3px',
          }} />
          <span>{capitalize(entry.value)}</span>
        </li>
      ))}
    </ul>
  );
};


const LineChartComponent = ({ data, xKey, yKey, yOptions }) => {
  const [hoveredLine, setHoveredLine] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "450px", color: "#7f8c8d", fontSize: "16px", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.3 }}>📊</div>
        <div style={{ fontWeight: "600" }}>No data available</div>
        <div style={{ fontSize: "14px", marginTop: "8px", opacity: 0.7 }}>Please provide data to generate the chart.</div>
      </div>
    );
  }

  if ((!xKey && xKey !== "all") || (!yKey && yKey !== "all")) {
    return (
       <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "450px", color: "#e74c3c", fontSize: "16px", fontFamily: "'Inter', sans-serif" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }}>⚠️</div>
        <div style={{ fontWeight: "600" }}>Configuration Required</div>
        <div style={{ fontSize: "14px", marginTop: "8px", opacity: 0.8 }}>Please select X and Y axes to display the chart.</div>
      </div>
    );
  }

  const xAxisKey = xKey === "all" ? (data[0] && Object.keys(data[0]).find((key) => !(yOptions || []).includes(key))) || "index" : xKey;
  let chartData = xKey === "all" ? data.map((item, index) => ({ ...item, index: `Item ${index + 1}` })) : [...data];
  const metricsToDisplay = yKey === "all" ? (yOptions || []) : [yKey].filter(Boolean);


  const yAxisLabelValue = yKey === "all" ? "Values" : capitalize(yKey);
  const yAxisUnit = "(AED)";
  const chartTitle = yKey === "all" ? `Trend of Selected Metrics over ${capitalize(xAxisKey)}` : `${capitalize(yKey)} Trend over ${capitalize(xAxisKey)}`;


  return (
    // Outer div to control max-width and centering
    <div style={{ 
        width: "100%", 
        fontFamily: "'Inter', sans-serif", 
        padding: "10px 0",
        display: 'flex', 
        justifyContent: 'center' 
    }}>
      {/* Inner div for chart content with max-width - INCREASED maxWidth */}
      <div style={{ width: '100%', maxWidth: '1050px' }}> 
        {/* Title Section */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2c3e50', margin: 0 }}>
            {chartTitle}
          </h3>
        </div>

        <ResponsiveContainer width="100%" height={480}>
          <LineChart
            data={chartData}
            margin={{
              top: 5,      
              right: 180,   
              left: 35,    
              bottom: 80,   
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e0e0e0" 
              strokeWidth={0.7} 
            />
            <XAxis
              dataKey={xAxisKey}
              interval="preserveStartEnd"
              angle={-40}
              textAnchor="end"
              dy={10}
              height={85} 
              tick={{ fontSize: 11, fill: "#4a4a4a", fontWeight: 500 }} 
              axisLine={{ stroke: "#cccccc", strokeWidth: 1 }} 
              tickLine={{ stroke: "#cccccc", strokeWidth: 0.8 }} 
            >
              <Label
                value={capitalize(xAxisKey)}
                position="insideBottom"
                offset={-65} 
                style={{ textAnchor: "middle", fontSize: 14, fill: "#2c3e50", fontWeight: "600" }}
              />
            </XAxis>
            <YAxis
              tickFormatter={yAxisTickFormatter}
              tick={{ fontSize: 11, fill: "#4a4a4a", fontWeight: 500 }}
              axisLine={{ stroke: "#cccccc", strokeWidth: 1 }}
              tickLine={{ stroke: "#cccccc", strokeWidth: 0.8 }}
              width={85} 
            >
              <Label
                value={`${yAxisLabelValue} ${yAxisUnit}`}
                angle={-90}
                position="insideLeft"
                offset={-20} 
                style={{ textAnchor: "middle", fontSize: 14, fill: "#2c3e50", fontWeight: "600" }}
              />
            </YAxis>
            <Tooltip
              content={<CustomTooltip xAxisKey={xAxisKey} />}
              cursor={{ stroke: "#0984e3", strokeWidth: 1.5, strokeDasharray: "4 4" }} 
            />
            <Legend
              layout="vertical"
              verticalAlign="top" 
              align="right"
              iconSize={12} 
              iconType="rect" 
              wrapperStyle={{
                paddingLeft: "30px", 
                paddingTop: "20px", 
                maxHeight: '400px',
                overflowY: 'auto'
              }}
              content={renderLegend}
            />
            {metricsToDisplay.map((metric, index) => (
              <Line
                key={metric}
                type="monotone" 
                dataKey={metric}
                name={capitalize(metric)}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={hoveredLine === metric ? 3.5 : 2.5} 
                dot={false} 
                activeDot={{ 
                  r: 7,
                  stroke: COLORS[index % COLORS.length],
                  strokeWidth: 2.5, 
                  fill: "#ffffff",
                  style: { filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.2))" } 
                }}
                onMouseEnter={() => setHoveredLine(metric)}
                onMouseLeave={() => setHoveredLine(null)}
                style={{
                  opacity: hoveredLine && hoveredLine !== metric ? 0.6 : 1, 
                  transition: "opacity 0.25s ease-in-out, stroke-width 0.25s ease-in-out",
                }}
                animationDuration={1000} 
                animationBegin={index * 100}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartComponent;

