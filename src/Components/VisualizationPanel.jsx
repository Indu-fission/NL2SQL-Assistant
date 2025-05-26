// import React, { useState, useEffect } from 'react';
// import LineChartComponent from './Charts/LineChart';
// import BarChartComponent from './Charts/BarChart';
// import PieChartComponent from './Charts/PieChart';
// import ResultTable from './Charts/ResultTable';
// import ScatterPlot from './Charts/ScatterPlot';
// import HeatMap from './Charts/HeatMap';

// const VisualizationPanel = ({ data, chartType }) => {
//   const [xOptions, setXOptions] = useState([]);
//   const [yOptions, setYOptions] = useState([]);
//   const [selectedX, setSelectedX] = useState('');
//   const [selectedY, setSelectedY] = useState('');
//   const [showAxisSelectors, setShowAxisSelectors] = useState(true);

//   useEffect(() => {
//     if (!data || data.length === 0) return;

//     const sampleRow = data[0];
//     const allKeys = Object.keys(sampleRow);

//     const xCategorical = [];
//     const yNumerical = [];

//     allKeys.forEach(key => {
//       const values = data.map(row => row[key]);
//       const isNumeric = values.every(val => !isNaN(parseFloat(val)) && isFinite(val));
//       if (isNumeric) {
//         yNumerical.push(key);
//       } else {
//         xCategorical.push(key);
//       }
//     });

//     setXOptions(xCategorical);
//     setYOptions(yNumerical);

//     // Automatically select first options if available
//     if (xCategorical.length > 0) setSelectedX(xCategorical[0]);
//     if (yNumerical.length > 0) setSelectedY(yNumerical[0]);
//   }, [data]);

//   // Decide when to show selectors (hide for table)
//   useEffect(() => {
//     setShowAxisSelectors(chartType !== 'table' && data?.length > 0);
//   }, [chartType, data]);

//   return (
//     <div className="space-y-4">
//       {showAxisSelectors && (
//         <>
//           <div>
//             <label className="font-semibold text-sm mb-1 block">
//               Select X-axis (categorical):
//             </label>
//             <select
//               value={selectedX}
//               onChange={(e) => setSelectedX(e.target.value)}
//               className="w-full p-2 border rounded"
//             >
//               <option value="">-- Select X --</option>
//               {xOptions.map((option) => (
//                 <option key={option} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="font-semibold text-sm mb-1 block">
//               Select Y-axis (numeric):
//             </label>
//             <select
//               value={selectedY}
//               onChange={(e) => setSelectedY(e.target.value)}
//               className="w-full p-2 border rounded"
//             >
//               <option value="">-- Select Y --</option>
//               {yOptions
//                 .filter((opt) => opt !== selectedX) 
//                 .map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//             </select>
//           </div>
//         </>
//       )}

//       <div className="rounded p-2">
//         {chartType === "line" && (
//           <LineChartComponent data={data} xKey={selectedX} yKey={selectedY} />
//         )}
//         {chartType === "bar" && (
//           <BarChartComponent data={data} xKey={selectedX} yKey={selectedY} />
//         )}
//         {chartType === "pie" && (
//           <PieChartComponent data={data} xKey={selectedX} yKey={selectedY} />
//         )}
//         {chartType === "scatterPlot" && (
//           <ScatterPlot data={data} xKey={selectedX} yKey={selectedY} />
//         )}
//         {chartType === "heatMap" && (
//           <HeatMap data={data} xKey={selectedX} yKey={selectedY} />
//         )}
//         {chartType === "table" && <ResultTable data={data} />}
//       </div>
//     </div>
//   );
// };

// export default VisualizationPanel;



"use client"

import { useState, useEffect } from "react"
import LineChartComponent from "./Charts/LineChart"
import BarChartComponent from "./Charts/BarChart"
import PieChartComponent from "./Charts/PieChart"
import ResultTable from "./Charts/ResultTable"
import ScatterPlot from "./Charts/ScatterPlot"
import HeatMap from "./Charts/HeatMap"
import 'primereact/resources/themes/saga-blue/theme.css';     
import 'primereact/resources/primereact.min.css';             
import 'primeicons/primeicons.css';                          
import { MultiSelect } from 'primereact/multiselect';


const VisualizationPanel = ({ data, chartType }) => {
  const [xOptions, setXOptions] = useState([])
  const [yOptions, setYOptions] = useState([])
  // const [selectedX, setSelectedX] = useState([]);
  // const [selectedY, setSelectedY] = useState([]);

  const [selectedX, setSelectedX] = useState("")
  const [selectedY, setSelectedY] = useState("")
  const [showAxisSelectors, setShowAxisSelectors] = useState(true)
  const [filterValue, setFilterValue] = useState("")
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    if (!data || data.length === 0) return

    const sampleRow = data[0]
    const allKeys = Object.keys(sampleRow)

    const xCategorical = []
    const yNumerical = []

    allKeys.forEach((key) => {
      const values = data.map((row) => row[key])
      const isNumeric = values.every((val) => !isNaN(Number.parseFloat(val)) && isFinite(val))
      if (isNumeric) {
        yNumerical.push(key)
      } else {
        xCategorical.push(key)
      }
    })

    setXOptions(xCategorical)
    setYOptions(yNumerical)

    // Automatically select first options if available
    if (xCategorical.length > 0) setSelectedX(xCategorical[0])
    if (yNumerical.length > 0) setSelectedY("all") // Default to 'all' for Y-axis
  }, [data])

  // Filter data based on selections
  useEffect(() => {
    if (!data || data.length === 0) return

    let filtered = [...data]

    if (filterValue && selectedX && selectedX !== "all") {
      filtered = filtered.filter((item) => String(item[selectedX]).toLowerCase().includes(filterValue.toLowerCase()))
    }

    setFilteredData(filtered)
  }, [data, selectedX, filterValue])

  // Decide when to show selectors (hide for table)
  useEffect(() => {
    setShowAxisSelectors(chartType !== "table" && data?.length > 0)
  }, [chartType, data])

  return (
    <div className="space-y-4">
      {showAxisSelectors && (
        <>
          <div>
            <label className="font-semibold text-sm mb-1 block">
              Select X-axis (categorical):
            </label>
            <select
              value={selectedX}
              onChange={(e) => setSelectedX(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">-- Select X --</option>
              <option value="all">All Categories</option>
              {xOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-sm mb-1 block">
              Select Y-axis (numeric):
            </label>
            <select
              value={selectedY}
              onChange={(e) => setSelectedY(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">-- Select Y --</option>
              <option value="all">All Metrics</option>
              {yOptions
                .filter((opt) => opt !== selectedX || selectedX === "all")
                .map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          </div>
        </>
      )}
      <div className="rounded p-2">
        {chartType === "line" && (
          <LineChartComponent
            data={filteredData}
            xKey={selectedX}
            yKey={selectedY}
            yOptions={yOptions}
          />
        )}
        {chartType === "bar" && (
          <BarChartComponent
            data={filteredData}
            xKey={selectedX}
            yKey={selectedY}
            yOptions={yOptions}
          />
        )}
        {chartType === "pie" && (
          <PieChartComponent
            data={filteredData}
            xKey={selectedX}
            yKey={selectedY}
          />
        )}
        {chartType === "scatterPlot" && (
          <ScatterPlot data={filteredData} xKey={selectedX} yKey={selectedY} />
        )}
        {chartType === "heatMap" && (
          <HeatMap data={filteredData} xKey={selectedX} yKey={selectedY} />
        )}
        {chartType === "table" && <ResultTable data={filteredData} />}
      </div>
    </div>
  );
}

export default VisualizationPanel