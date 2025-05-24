// // import React, { useState } from 'react';
// // import VisualizationPanel from './VisualizationPanel';

// // const QueryResults = ({ rows = 10, columns = 10, data }) => {
// //   const [selectedViz, setSelectedViz] = useState('table');

// //   const visualizationTypes = [
// //     { label: 'Table', value: 'table' },
// //     { label: 'Bar Chart', value: 'bar' },
// //     { label: 'Line Chart', value: 'line' },
// //     { label: 'Pie Chart', value: 'pie' },
// //     { label: 'Scatter Plot', value: 'scatterPlot' },
// //     { label: 'Heat Map', value: 'heatMap' },
// //   ];

// //   return (
// //     <div className="mt-8">
// //       <h2 className="text-xl font-semibold mb-4">📊 Query Results</h2>

// //       {/* Alignment block */}
// //       <div className="flex justify-between items-center gap-6 w-full mb-4">
// //         <div className="flex-1">
// //           <p className="font-bold mb-2">Rows</p>
// //           <p className="text-gray-800">{rows}</p>
// //         </div>

// //         <div className="flex-1">
// //           <p className="font-bold mb-2">Columns</p>
// //           <p className="text-gray-800">{columns}</p>
// //         </div>

// //         <div className="flex-1">
// //           <p className="font-bold mb-2">Visualization</p>
// //           <select
// //             value={selectedViz}
// //             onChange={(e) => setSelectedViz(e.target.value)}
// //             className="h-10 w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800"
// //           >
// //             {visualizationTypes.map(({ label, value }) => (
// //               <option key={value} value={value}>
// //                 {label}
// //               </option>
// //             ))}
// //           </select>
// //         </div>
// //       </div>

// //       <VisualizationPanel data={data} chartType={selectedViz} />

// //       <div
// //         className="mt-6"
// //         style={{
// //           fontFamily: '"Source Sans Pro", sans-serif',
// //           color: 'inherit',
// //         }}
// //       >
// //         <p
// //           style={{
// //             fontSize: '2rem',
// //             fontWeight: '600',
// //             marginBottom: '0.5rem',
// //             lineHeight: '1.6',
// //           }}
// //         >
// //           📊 Data Insights
// //         </p>

// //         <p
// //           style={{
// //             fontSize: '1.5rem',
// //             fontWeight: '500',
// //             padding: '0.5rem 0',
// //             lineHeight: '1.6',
// //           }}
// //         >
// //           Summary of Iris Dataset
// //         </p>

// //         <p
// //           style={{
// //             fontSize: '1rem',
// //             margin: '0.2em 0px 0.2em 1.2em',
// //             padding: '0px 0px 0px 0.6em',
// //             lineHeight: '2.5',
// //           }}
// //         >
// //           The dataset consists of <strong>{rows} rows</strong> of iris flower
// //           measurements across <strong>{columns} columns</strong>. Below are the key
// //           insights derived from the data:
// //         </p>

// //         <ul
// //           style={{
// //             listStyleType: 'disc',
// //             color: 'black',
// //             margin: '0.2em 0px 0.2em 1.2em',
// //             padding: '0px 0px 0px 0.6em',
// //             lineHeight: '2.5',
// //           }}
// //         >
// //           <li style={{ fontSize: '1rem' }}>
// //             <h3 className="text-sm">
// //               <b>Sepal Length:</b> The average sepal length is{' '}
// //               <strong>4.86 cm</strong>, with a minimum of{' '}
// //               <strong>4.4 cm</strong> and a maximum of <strong>5.4 cm</strong>.
// //               The standard deviation is <strong>0.29 cm</strong>, indicating
// //               moderate variability.
// //             </h3>
// //           </li>
// //           <li style={{ fontSize: '1rem' }}>
// //             <h3 className="text-sm">
// //               <b>Sepal Width:</b> The mean sepal width is{' '}
// //               <strong>3.31 cm</strong>, ranging from <strong>2.9 cm</strong> to{' '}
// //               <strong>3.9 cm</strong>. The standard deviation is{' '}
// //               <strong>0.31 cm</strong>, suggesting some spread in the data.
// //             </h3>
// //           </li>
// //           <li style={{ fontSize: '1rem' }}>
// //             <h3 className="text-sm">
// //               <b>Petal Length:</b> The average petal length is{' '}
// //               <strong>1.45 cm</strong>, with values between{' '}
// //               <strong>1.3 cm</strong> and <strong>1.7 cm</strong>. The standard
// //               deviation is <strong>0.11 cm</strong>, indicating low variability.
// //             </h3>
// //           </li>
// //           <li style={{ fontSize: '1rem' }}>
// //             <h3 className="text-sm">
// //               <b>Petal Width:</b> The mean petal width is{' '}
// //               <strong>0.22 cm</strong>, with a minimum of{' '}
// //               <strong>0.1 cm</strong> and a maximum of <strong>0.4 cm</strong>.
// //               The standard deviation is <strong>0.08 cm</strong>, reflecting low
// //               variability.
// //             </h3>
// //           </li>
// //         </ul>

// //         <h3
// //           style={{
// //             fontSize: '1rem',
// //             marginTop: '1.5rem',
// //             marginLeft: '1.2em',
// //             paddingLeft: '0.6em',
// //             lineHeight: '1.6',
// //           }}
// //         >
// //           Overall, the dataset showcases the characteristics of the{' '}
// //           <strong>setosa</strong> species of iris flowers, with relatively
// //           consistent measurements across the samples.
// //         </h3>
// //       </div>

// //       <div className="p-4 max-w-xs">
// //         <button
// //           className="border border-black text-black bg-white rounded px-3 py-1.5 mb-2
// //                    hover:text-orange-500 hover:border-orange-500 transition-colors duration-200"
// //         >
// //           Generate PDF Report
// //         </button>

// //         <a
// //           href="#"
// //           className="flex items-center text-sm text-black hover:text-orange-500 transition-colors duration-200 cursor-pointer"
// //         >
// //           <span className="mr-1">📥</span> Download Report
// //         </a>
// //       </div>
// //     </div>
// //   );
// // };

// // export default QueryResults;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import VisualizationPanel from './VisualizationPanel';
// import ReactMarkdown from 'react-markdown'; // You need to install this: npm install react-markdown

// const QueryResults = ({ rows , columns, data }) => {
//   const [selectedViz, setSelectedViz] = useState('table');
//   const [isDownloading, setIsDownloading] = useState(false);
//   const [insights, setInsights] = useState('');
//   const [insightsLoading, setInsightsLoading] = useState(true);

//   const visualizationTypes = [
//     { label: 'Table', value: 'table' },
//     { label: 'Bar Chart', value: 'bar' },
//     { label: 'Line Chart', value: 'line' },
//     { label: 'Pie Chart', value: 'pie' },
//     { label: 'Scatter Plot', value: 'scatterPlot' },
//     { label: 'Heat Map', value: 'heatMap' },
//   ];

//   useEffect(() => {
//     const fetchInsights = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:8000/insights', {
//           headers: {
//             Accept: 'application/json',
//           },
//         });
//         if (response.status === 200 && response.data.insights) {
//           setInsights(response.data.insights);
//         } else {
//           setInsights('⚠️ Failed to load insights.');
//         }
//       } catch (error) {
//         console.error('Error fetching insights:', error);
//         setInsights('❌ Error loading insights.');
//       } finally {
//         setInsightsLoading(false);
//       }
//     };

//     fetchInsights();
//   }, []);

//   const handleGeneratePDF = async () => {
//     setIsDownloading(true);
//     try {
//       const response = await axios.get('http://localhost:8000/generate-pdf', {
//         responseType: 'blob',
//         headers: {
//           Accept: 'application/json',
//         },
//       });

//       if (response.status === 200) {
//         const blob = new Blob([response.data], { type: 'application/pdf' });
//         const link = document.createElement('a');
//         link.href = URL.createObjectURL(blob);
//         link.download = 'NL2SQL_Report.pdf';
//         link.click();
//       } else {
//         console.error('Failed to generate PDF');
//       }
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   return (
//     <div className="mt-8">
//       <h2 className="text-xl font-semibold mb-4">📊 Query Results</h2>

//       <div className="flex justify-between items-center gap-6 w-full mb-4">
//         <div className="flex-1">
//           <p className="font-bold mb-2">Rows</p>
//           <p className="text-gray-800">{rows}</p>
//         </div>

//         <div className="flex-1">
//           <p className="font-bold mb-2">Columns</p>
//           <p className="text-gray-800">{columns}</p>
//         </div>

//         <div className="flex-1">
//           <p className="font-bold mb-2">Visualization</p>
//           <select
//             value={selectedViz}
//             onChange={(e) => setSelectedViz(e.target.value)}
//             className="h-10 w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800"
//           >
//             {visualizationTypes.map(({ label, value }) => (
//               <option key={value} value={value}>
//                 {label}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <VisualizationPanel data={data} chartType={selectedViz} />

//       <div className="mt-6" style={{ fontFamily: '"Source Sans Pro", sans-serif', color: 'inherit' }}>
//         <p style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem', lineHeight: '1.6' }}>
//           📊 Data Insights
//         </p>

//         {insightsLoading ? (
//           <p className="text-gray-600 text-lg">🔄 Loading insights...</p>
//         ) : (
//           <div className="prose max-w-full text-black">
//             <ReactMarkdown>{insights}</ReactMarkdown>
//           </div>
//         )}
//       </div>

//       <div className="p-4 max-w-xs">
//         <button
//           onClick={handleGeneratePDF}
//           className="border border-black text-black bg-white rounded px-3 py-1.5 mb-2 hover:text-orange-500 hover:border-orange-500 transition-colors duration-200"
//         >
//           {isDownloading ? (
//             <span className="flex items-center gap-2">
//               <span className="animate-spin">🔄</span> Generating...
//             </span>
//           ) : (
//             'Generate PDF Report'
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default QueryResults;

import React, { useState } from 'react';
import VisualizationPanel from './VisualizationPanel';
import ReactMarkdown from 'react-markdown';
import axios from 'axios'; // Make sure axios is installed and imported

const QueryResults = ({ rows, columns, data, insights, insightsLoading }) => {
  const [selectedViz, setSelectedViz] = useState('table');
  const [isDownloading, setIsDownloading] = useState(false); 

  const visualizationTypes = [
    { label: 'Table', value: 'table' },
    { label: 'Bar Chart', value: 'bar' },
    { label: 'Line Chart', value: 'line' },
    { label: 'Pie Chart', value: 'pie' },
    { label: 'Scatter Plot', value: 'scatterPlot' },
    { label: 'Heat Map', value: 'heatMap' },
  ];

  const handleGeneratePDF = async () => {
    setIsDownloading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/generate-pdf', {
        responseType: 'blob',
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'NL2SQL_Report.pdf';
        link.click();
      } else {
        console.error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4" style={{ color: "#b58932" }}>
        📊 Query Results
      </h2>

      <div className="flex justify-between items-center gap-6 w-full mb-4">
        <div className="flex-1">
          <p className="font-bold mb-2">Rows</p>
          <p className="text-gray-800">{rows}</p>
        </div>

        <div className="flex-1">
          <p className="font-bold mb-2">Columns</p>
          <p className="text-gray-800">{columns}</p>
        </div>

        <div className="flex-1">
          <p className="font-bold mb-2">Visualization</p>
          <select
            value={selectedViz}
            onChange={(e) => setSelectedViz(e.target.value)}
            className="h-10 w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800"
          >
            {visualizationTypes.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <VisualizationPanel data={data} chartType={selectedViz} />

      <div className="mt-6">
        <p className="text-2xl font-semibold mb-2" style={{ color: "#b58932" }}>
          📊 Summary
        </p>
        {insightsLoading ? (
          <p className="text-gray-600 text-lg">🔄 Loading insights...</p>
        ) : (
          <div className="text-gray-800 list-disc pl-5">
            <ReactMarkdown
              components={{
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-5" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-5" {...props} />
                ),
              }}
            >
              {insights}
            </ReactMarkdown>
          </div>
        )}
      </div>

      <div className="p-4 max-w-xs">
        <button
          onClick={handleGeneratePDF}
          className="border border-black text-black bg-white rounded px-3 py-1.5 mb-2 hover:text-orange-500 hover:border-orange-500 transition-colors duration-200"
        >
          {isDownloading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">🔄</span> Generating...
            </span>
          ) : (
            "Generate PDF Report"
          )}
        </button>
      </div>
    </div>
  );
};

export default QueryResults;