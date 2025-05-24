import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, Legend } from "recharts"
import { useState } from "react"

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

// Enhanced color palette with vibrant and dark professional colors
const COLORS = [
  "#FF6B35", // Vibrant Orange
  "#2E86AB", // Deep Blue
  "#A23B72", // Rich Magenta
  "#F18F01", // Golden Yellow
  "#C73E1D", // Deep Red
  "#4ECDC4", // Turquoise
  "#45B7D1", // Sky Blue
  "#96CEB4", // Mint Green
  "#FFEAA7", // Light Yellow
  "#DDA0DD", // Plum
  "#20B2AA", // Light Sea Green
  "#FF7F50", // Coral
]

// Custom dot component for enhanced interactivity
const CustomDot = ({ cx, cy, stroke, payload, dataKey, isActive }) => {
  if (!isActive) return null
  
  return (
    <circle
      cx={cx}
      cy={cy}
      r={6}
      fill={stroke}
      stroke="#ffffff"
      strokeWidth={2}
      style={{
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
        transition: "all 0.3s ease"
      }}
    />
  )
}

// Enhanced custom tooltip
const CustomTooltip = ({ active, payload, label, xAxisKey }) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.95)",
      border: "1px solid #e0e0e0",
      borderRadius: "12px",
      padding: "16px",
      backdropFilter: "blur(10px)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
      minWidth: "200px"
    }}>
      <p style={{
        margin: "0 0 12px 0",
        fontWeight: "600",
        fontSize: "14px",
        color: "#2c3e50",
        borderBottom: "2px solid #ecf0f1",
        paddingBottom: "8px"
      }}>
        {capitalize(xAxisKey)}: <span style={{ color: "#3498db" }}>{label}</span>
      </p>
      {payload.map((entry, index) => (
        <div key={index} style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "8px 0",
          padding: "4px 0"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: entry.color,
              border: "2px solid #fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }} />
            <span style={{ fontSize: "13px", color: "#34495e", fontWeight: "500" }}>
              {capitalize(entry.name)}
            </span>
          </div>
          <span style={{
            fontSize: "14px",
            fontWeight: "700",
            color: entry.color,
            backgroundColor: `${entry.color}15`,
            padding: "4px 8px",
            borderRadius: "6px"
          }}>
            {Number.parseFloat(entry.value).toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  )
}

// Enhanced legend component
const CustomLegend = ({ payload }) => {
  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "20px",
      marginBottom: "20px",
      padding: "15px"
    }}>
      {payload.map((entry, index) => (
        <div key={index} style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 16px",
          borderRadius: "25px",
          backgroundColor: `${entry.color}10`,
          border: `2px solid ${entry.color}`,
          transition: "all 0.3s ease",
          cursor: "pointer"
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = `${entry.color}20`
          e.target.style.transform = "translateY(-2px)"
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = `${entry.color}10`
          e.target.style.transform = "translateY(0px)"
        }}>
          <div style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            backgroundColor: entry.color,
            border: "2px solid #fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
          }} />
          <span style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "#2c3e50"
          }}>
            {capitalize(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

const LineChartComponent = ({ data, xKey, yKey, yOptions }) => {
  const [hoveredLine, setHoveredLine] = useState(null)
  const [activeLines, setActiveLines] = useState({})

  if (!data || data.length === 0) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "400px",
        color: "#7f8c8d",
        fontSize: "16px"
      }}>
        <div style={{
          fontSize: "48px",
          marginBottom: "16px",
          opacity: 0.3
        }}>📊</div>
        <div style={{ fontWeight: "600" }}>No data available to display</div>
        <div style={{ fontSize: "14px", marginTop: "8px", opacity: 0.7 }}>
          Please provide data to generate the chart
        </div>
      </div>
    )
  }

  if ((!xKey && xKey !== "all") || (!yKey && yKey !== "all")) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "400px",
        color: "#e74c3c",
        fontSize: "16px"
      }}>
        <div style={{
          fontSize: "48px",
          marginBottom: "16px",
          opacity: 0.5
        }}>⚠️</div>
        <div style={{ fontWeight: "600" }}>Configuration Required</div>
        <div style={{ fontSize: "14px", marginTop: "8px", opacity: 0.8 }}>
          Please select both X and Y axes to display the chart
        </div>
      </div>
    )
  }

  // Handle the "All" case for X-axis
  const xAxisKey =
    xKey === "all" ? (data[0] && Object.keys(data[0]).find((key) => !yOptions.includes(key))) || "index" : xKey

  // Prepare data for rendering
  let chartData = [...data]

  // If x-axis is "all", we need to create a special index
  if (xKey === "all") {
    chartData = data.map((item, index) => ({
      ...item,
      index: `Item ${index + 1}`,
    }))
  }

  // Determine which Y metrics to display
  const metricsToDisplay = yKey === "all" ? yOptions : [yKey]

  return (
    <div style={{
      background: "transparent",
      padding: "0",
      borderRadius: "0",
      width: "100%"
    }}>
      <ResponsiveContainer width="100%" height={480}>
        <LineChart 
          data={chartData} 
          margin={{ top: 40, right: 50, left: 70, bottom: 80 }}
          style={{ background: "transparent" }}
        >
          <defs>
            <linearGradient id="gridGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#bdc3c7" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#ecf0f1" stopOpacity="0.1"/>
            </linearGradient>
          </defs>

          <CartesianGrid 
            strokeDasharray="2 4" 
            stroke="url(#gridGradient)"
            strokeWidth={1}
            opacity={0.6}
          />

          <XAxis 
            dataKey={xAxisKey} 
            interval={0} 
            angle={-35}
            textAnchor="end" 
            height={90}
            tick={{
              fontSize: 12,
              fontWeight: "500",
              fill: "#2c3e50"
            }}
            axisLine={{
              stroke: "#34495e",
              strokeWidth: 2
            }}
            tickLine={{
              stroke: "#34495e",
              strokeWidth: 1
            }}
          >
            <Label
              value={capitalize(xAxisKey)}
              position="insideBottom"
              offset={-15}
              style={{ 
                textAnchor: "middle", 
                fontSize: 16, 
                fill: "#2c3e50",
                fontWeight: "700"
              }}
            />
          </XAxis>

          <YAxis
            tick={{
              fontSize: 12,
              fontWeight: "500",
              fill: "#2c3e50"
            }}
            axisLine={{
              stroke: "#34495e",
              strokeWidth: 2
            }}
            tickLine={{
              stroke: "#34495e",
              strokeWidth: 1
            }}
          >
            <Label
              value={yKey === "all" ? "Values" : capitalize(yKey)}
              angle={-90}
              position="insideLeft"
              offset={10}
              style={{ 
                textAnchor: "middle", 
                fontSize: 16, 
                fill: "#2c3e50",
                fontWeight: "700"
              }}
            />
          </YAxis>

          <Tooltip 
            content={<CustomTooltip xAxisKey={xAxisKey} />}
            cursor={{
              stroke: "#3498db",
              strokeWidth: 2,
              strokeDasharray: "5 5"
            }}
          />

          <Legend 
            content={<CustomLegend />}
          />

          {metricsToDisplay.map((metric, index) => (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              name={capitalize(metric)}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={hoveredLine === metric ? 4 : 3}
              dot={false}
              activeDot={{
                r: 8,
                stroke: COLORS[index % COLORS.length],
                strokeWidth: 3,
                fill: "#ffffff",
                style: {
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.25))",
                  transition: "all 0.3s ease"
                }
              }}
              onMouseEnter={() => setHoveredLine(metric)}
              onMouseLeave={() => setHoveredLine(null)}
              style={{
                filter: hoveredLine && hoveredLine !== metric ? "opacity(0.4)" : "opacity(1)",
                transition: "all 0.3s ease"
              }}
              animationDuration={1500}
              animationBegin={index * 200}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LineChartComponent