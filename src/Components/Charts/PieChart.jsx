import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useState } from "react"

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

// Professional color palette with bright and dark colors for light theme
const COLORS = [
  "#1a1a2e", // Deep Navy
  "#16213e", // Dark Blue
  "#0f3460", // Royal Blue
  "#533483", // Deep Purple
  "#7209b7", // Bright Purple
  "#2d1b69", // Dark Indigo
  "#f72585", // Bright Pink
  "#b5179e", // Magenta
  "#7209b7", // Purple
  "#560bad", // Dark Purple
  "#480ca8", // Blue Purple
  "#3a0ca3", // Deep Blue
  "#3f37c9", // Indigo
  "#4361ee", // Bright Blue
  "#4895ef", // Light Blue
  "#4cc9f0"  // Cyan
];

const PieChartComponent = ({ data, xKey, yKey }) => {
  const [activeIndex, setActiveIndex] = useState(null)
  const [hoveredSlice, setHoveredSlice] = useState(null)

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <div className="text-xl font-semibold text-gray-700">No Data Available</div>
          <div className="text-gray-500 mt-2">Please upload data to display the chart</div>
        </div>
      </div>
    )
  }

  if (!xKey || !yKey) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-6xl mb-4">⚙️</div>
          <div className="text-xl font-semibold text-gray-700">Configuration Required</div>
          <div className="text-gray-500 mt-2">Please select both X and Y axes to display the chart</div>
        </div>
      </div>
    )
  }

  // Process data with better aggregation
  const processedData = data.map((item, index) => ({
    name: String(item[xKey]) || `Item ${index + 1}`,
    value: Number.parseFloat(item[yKey]) || 0,
    originalIndex: index
  })).filter(item => item.value > 0) // Remove zero values

  // Calculate total for percentages
  const total = processedData.reduce((sum, item) => sum + item.value, 0)

  // Enhanced tooltip with better styling
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = ((data.value / total) * 100).toFixed(1)
      return (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 backdrop-blur-sm">
          <div className="font-bold text-lg text-gray-800 mb-2">{data.name}</div>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">{capitalize(yKey)}:</span>
              <span className="font-bold text-gray-900">{data.value.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Percentage:</span>
              <span className="font-bold text-blue-600">{percentage}%</span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  // Custom label function for better readability
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    if (percent < 0.05) return null // Hide labels for slices smaller than 5%
    
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 1.15
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="#1f2937" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  // Mouse event handlers for interactivity
  const onPieEnter = (_, index) => {
    setActiveIndex(index)
    setHoveredSlice(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
    setHoveredSlice(null)
  }

  // Custom legend with enhanced styling
  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-6 px-4">
        {payload.map((entry, index) => {
          const isHovered = hoveredSlice === index
          return (
            <div 
              key={`legend-${index}`}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 cursor-pointer ${
                isHovered 
                  ? 'bg-gray-100 border-gray-300 transform scale-105' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
              onMouseEnter={() => setHoveredSlice(index)}
              onMouseLeave={() => setHoveredSlice(null)}
            >
              <div 
                className="w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-medium text-gray-700 text-sm">
                {entry.value}
              </span>
              <span className="text-gray-500 text-xs">
                ({((processedData[index]?.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="w-full bg-white rounded-2xl p-6">
      {/* Header with statistics */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Data Distribution</h3>
            <p className="text-gray-600 mt-1">{capitalize(xKey)} by {capitalize(yKey)}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{processedData.length}</div>
            <div className="text-sm text-gray-500">Categories</div>
          </div>
        </div>
        
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="text-2xl font-bold text-blue-600">{total.toLocaleString()}</div>
            <div className="text-sm text-blue-700 font-medium">Total Value</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
            <div className="text-2xl font-bold text-purple-600">
              {(total / processedData.length).toLocaleString(undefined, { maximumFractionDigits: 1 })}
            </div>
            <div className="text-sm text-purple-700 font-medium">Average</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <div className="text-2xl font-bold text-green-600">
              {Math.max(...processedData.map(d => d.value)).toLocaleString()}
            </div>
            <div className="text-sm text-green-700 font-medium">Highest</div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={500}>
          <PieChart>
            <Pie
              data={processedData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={180}
              innerRadius={60}
              paddingAngle={2}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {processedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke={activeIndex === index ? "#ffffff" : "transparent"}
                  strokeWidth={activeIndex === index ? 3 : 0}
                  style={{
                    filter: activeIndex === index ? "brightness(1.1)" : "brightness(1)",
                    transform: activeIndex === index ? "scale(1.02)" : "scale(1)",
                    transformOrigin: "center",
                    transition: "all 0.3s ease"
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center bg-white rounded-full p-4 border-4 border-gray-100">
            <div className="text-2xl font-bold text-gray-800">{processedData.length}</div>
            <div className="text-xs text-gray-500 font-medium">SEGMENTS</div>
          </div>
        </div>
      </div>

      {/* Footer insights */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            <span className="font-medium">Largest segment:</span>{" "}
            {processedData.reduce((max, item) => item.value > max.value ? item : max, processedData[0])?.name}
          </div>
          <div>
            <span className="font-medium">Data points:</span> {data.length}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PieChartComponent