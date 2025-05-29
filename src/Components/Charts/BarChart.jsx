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

// In BarChartComponent.jsx

// ... (after formatYAxisTick)

const MAX_X_AXIS_TICK_LABEL_LENGTH = 10; // Max characters before truncating

const formatXAxisTickLabel = (value) => {
  const stringValue = String(value); // Ensure value is a string
  if (stringValue.length > MAX_X_AXIS_TICK_LABEL_LENGTH) {
    return `${stringValue.substring(0, MAX_X_AXIS_TICK_LABEL_LENGTH - 3)}...`;
  }
  return stringValue;
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
        textAlign: 'center'
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
        textAlign: 'center'
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

  // ✅ ADD: Common X-Axis configuration
const xAxisHeight = 80; // Allocate enough height for angled labels and title
const commonXAxisProps = {
  dataKey: xAxisKey, // Use the determined dataKey
  height: xAxisHeight,
  interval: "preserveStartEnd", // Allow Recharts to skip ticks to prevent overlap
  angle: -30,                // Angle labels for more space
  textAnchor: "end",
  minTickGap: 10,           // Suggest minimum pixel gap between ticks
  tick: {
    fill: '#4A5568',        // Slightly softer tick color
    fontSize: 10,           // Smaller font for ticks can help
    fontWeight: '500',
    dy: 10,                   // Shift angled text down a bit
  },
  axisLine: { stroke: '#cbd5e0', strokeWidth: 1.5 }, // Adjusted strokeWidth
  tickLine: { stroke: '#cbd5e0', strokeWidth: 1 },
};
const xAxisLabelOffset = -40; // Adjust offset for the main label below ticks

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
              tickFormatter={formatXAxisTickLabel}
              tick={{
                fill: '#000',
                fontSize: 11,
                fontWeight: '700',
              }}
              axisLine={{ stroke: '#cbd5e0', strokeWidth: 2 }}
              tickLine={{ stroke: '#cbd5e0', strokeWidth: 1 }}
            >
              <Label
                value={capitalize(xAxisKey)}
                position="insideBottom"
                offset={xAxisLabelOffset}
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
                fill: '#000',
                fontSize: 11,
                fontWeight: '700',
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
          margin={{ top: 20, right: 200, left: 70, bottom: xAxisHeight - 10  }}
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
            tickFormatter={formatXAxisTickLabel}
            tick={{
              fill: '#000',
              fontSize: 11,
              fontWeight: '700',
            }}
            axisLine={{ stroke: '#cbd5e0', strokeWidth: 2 }}
            tickLine={{ stroke: '#cbd5e0', strokeWidth: 1 }}
          >
            <Label
              value={capitalize(xAxisKey)}
              position="insideBottom"
              offset={xAxisLabelOffset}
              style={{ 
                textAnchor: "middle", 
                fontSize: 14, 
                fill: "#2d3748",
                fontWeight: '700',
              }}
            />
          </XAxis>
          
          <YAxis
            tickFormatter={formatYAxisTick}
            tick={{
              fill: '#000',
              fontSize: 11,
              fontWeight: '700',
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