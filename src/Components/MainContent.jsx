// // import React, { useState } from 'react';
// // import { FiLoader } from 'react-icons/fi';
// // import TabsContent from './TabsContent';
// // import QueryResults from './QueryResults';
// // import ExportResults from './ExportResults';
// // import  { useEffect } from 'react'; 

// // const tabsData = [
// //   { name: 'Schema Loader' },
// //   { name: 'Selector Agent' },
// //   { name: 'Decomposer Agent' },
// //   { name: 'Refiner Agent' },
// //   { name: 'Database Execution' },
// //   { name: 'Visualization Agent' },
// // ];

// // const MainContent = ({ query, setQuery, onSubmit, onClear, isSidebarOpen, setQueryHistory }) => {
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [loadedTabs, setLoadedTabs] = useState([]);
// //   const [activeTab, setActiveTab] = useState('');
// //   const [currentStep, setCurrentStep] = useState('');
// //   const [queryResult, setQueryResult] = useState([]);
// //   const [hasProcessed, setHasProcessed] = useState(false);

// //   const [totalExecutionTime, setTotalExecutionTime] = useState(null);

// //   const handleProcess = async () => {
// //     const startTime = performance.now();
// //     setIsLoading(true);
// //     setLoadedTabs([]);
// //     setActiveTab('');
// //     setCurrentStep('');
// //     setQueryResult([]);
// //     setHasProcessed(true);
// //     setTotalExecutionTime(null);

// //     let totalTime = 0;
// //     for (let i = 0; i < tabsData.length; i++) {
// //       const { name } = tabsData[i];
// //       setCurrentStep(name);

// //       const simulatedTime = Math.random() * (8 - 1) + 1; 

// //       const taskStartTime = performance.now(); 
// //       await new Promise((resolve) => setTimeout(resolve, simulatedTime * 1000)); 
// //       const taskEndTime = performance.now();
// //       const taskExecutionTime = ((taskEndTime - taskStartTime) / 1000).toFixed(2);

// //       totalTime += parseFloat(taskExecutionTime); 
// //       setLoadedTabs((prev) => [...prev, { name, executionTime: taskExecutionTime }]);

// //       if (i === 0) setActiveTab(name);
// //     }

// //     setCurrentStep('');

// //     const mockResult = [
// //       { year: '2015', gdp: 3120 },
// //       { year: '2016', gdp: 3243 },
// //       { year: '2017', gdp: 3358 },
// //       { year: '2018', gdp: 3472 },
// //       { year: '2019', gdp: 3589 },
// //       { year: '2020', gdp: 3328 },
// //       { year: '2021', gdp: 3561 },
// //       { year: '2022', gdp: 3782 },
// //       { year: '2023', gdp: 4023 },
// //     ];
// //     setQueryResult(mockResult);

// //     await onSubmit?.();
// //     setIsLoading(false);
// //     setTotalExecutionTime(totalTime.toFixed(4));
// //   };

// //   const isActive = query.trim() !== '';

// //   return (
// //     <div className="bg-white p-6 rounded-md shadow-md text-gray-800 border border-gray-200">
// //       <h1 className="text-3xl font-semibold mb-1">
// //         🔍 Natural Language to SQL
// //       </h1>
// //       <p className="text-sm text-gray-600 mb-4">
// //         Enter your question in natural language and get the SQL query.
// //       </p>

// //       <textarea
// //         className="w-full p-3 bg-gray-100 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
// //         value={query}
// //         onChange={(e) => setQuery(e.target.value)}
// //         placeholder="Example: What was the GDP contribution of Manufacturing in 2020?"
// //         rows={4}
// //       />

// //       <div className="flex items-center gap-4">
// //         <button
// //           onClick={handleProcess}
// //           disabled={isLoading}
// //           className={`px-4 py-2 rounded-md text-white flex items-center gap-2 transition 
// //             ${
// //               isLoading ? "bg-orange-300" : "bg-orange-500 hover:bg-orange-600"
// //             }`}
// //         >
// //           {isLoading && <FiLoader className="animate-spin" />}
// //           {isLoading ? "Processing..." : "Process Query"}
// //         </button>


// //         <button
// //           onClick={() => {
// //             if (hasProcessed && query.trim()) {
// //               const existingHistory = JSON.parse(
// //                 localStorage.getItem("queryHistory") || "[]"
// //               );
// //               const updatedHistory = [...existingHistory, query.trim()];
// //               localStorage.setItem(
// //                 "queryHistory",
// //                 JSON.stringify(updatedHistory)
// //               );
// //               setQueryHistory(updatedHistory);
// //             }

// //             setQuery("");
// //             setQueryResult([]);
// //             setLoadedTabs([]);
// //             setTotalExecutionTime(null);
// //             setActiveTab("");
// //             setHasProcessed(false); // 🔄 Reset flag
// //           }}
// //           className="px-4 py-2 border border-orange-500 text-orange-500 hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600 rounded-md transition"
// //         >
// //           Clear Results
// //         </button>
// //       </div>

// //       {isLoading && currentStep && (
// //         <div className="flex items-center gap-3 mt-6 text-sm text-gray-700">
// //           <FiLoader className="animate-spin text-orange-500 text-xl" />
// //           <span>{currentStep} (loading...)</span>
// //         </div>
// //       )}

// //       {loadedTabs.length > 0 && (
// //         <div className="mt-8">
// //           <h2 className="text-xl font-semibold mb-4">🔄 Processing Pipeline</h2>
// //           {totalExecutionTime && (
// //             <p className="text-sm text-gray-600 mb-4">
// //               Execution time: {totalExecutionTime} sec
// //             </p>
// //           )}

// //           <div className="relative border-b border-gray-300 flex space-x-6 pb-2">
// //             {loadedTabs.map((tab) => {
// //               return (
// //                 <button
// //                   key={tab.name}
// //                   onClick={() => setActiveTab(tab.name)}
// //                   disabled={!tab.executionTime}
// //                   className={`text-sm font-medium pb-2 transition border-b-2 ${
// //                     activeTab === tab.name
// //                       ? "border-orange-500 text-orange-600"
// //                       : "text-gray-600 hover:text-orange-500 border-transparent hover:border-orange-300"
// //                   }`}
// //                 >
// //                   {tab.name} ({tab.executionTime}s)
// //                 </button>
// //               );
// //             })}
// //           </div>

// //           <TabsContent activeTab={activeTab} />
// //           <QueryResults rows={10} columns={10} data={queryResult} />
// //           <ExportResults />
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default MainContent;

// import React, { useState,useEffect } from 'react';
// import { FiLoader } from 'react-icons/fi';
// import TabsContent from './TabsContent';
// import QueryResults from './QueryResults';
// import ExportResults from './ExportResults';
// import axios from 'axios';

// const tabsData = [
//   { name: 'Schema Loader' },
//   { name: 'Selector Agent' },
//   { name: 'Decomposer Agent' },
//   { name: 'Refiner Agent' },
//   { name: 'Database Execution' },
//   { name: 'Visualization Agent' },
// ];

// const MainContent = ({ query, setQuery, onSubmit, onClear, isSidebarOpen, setQueryHistory, autoRun, setAutoRun }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [loadedTabs, setLoadedTabs] = useState([]);
//   const [activeTab, setActiveTab] = useState('Schema Loader');
//   const [currentStep, setCurrentStep] = useState('');
//   const [queryResult, setQueryResult] = useState([]);
//   const [sqlQuery, setSqlQuery] = useState('');
//   const [suggestedVisualization, setSuggestedVisualization] = useState('');

//   const [hasProcessed, setHasProcessed] = useState(false);
//   const [totalExecutionTime, setTotalExecutionTime] = useState(null);

//   useEffect(() => {
//     if (autoRun && query.trim()) {
//       handleProcess();
//       setAutoRun(false); // Reset autoRun after processing
//     }
//   }, [autoRun, query, setAutoRun]);

//   const handleProcess = async () => {
//     setIsLoading(true);
//     setLoadedTabs([]);
//     setActiveTab('');
//     setCurrentStep('');
//     setQueryResult([]);
//     setHasProcessed(true);
//     setTotalExecutionTime(null);

//     const headers = { 'Content-Type': 'application/json' };
//     const payload = { query: query.trim() };
    
//     try {
//       const response = await axios.post('http://localhost:8000/query-process', payload, { headers });
//       const { result_data, total_time_seconds, processing_steps, sql_query, suggested_visualization } = response.data;

//       setQueryResult(result_data);
//       setTotalExecutionTime(total_time_seconds.toFixed(2));
//       setSqlQuery(sql_query);
//       setSuggestedVisualization(suggested_visualization);

//       const newTabs = processing_steps.map((step) => ({
//         name: step.agent,
//         executionTime: step.time_taken?.toFixed(2) || 'N/A',
//       }));

//       setLoadedTabs(newTabs);
//       if (newTabs.length > 0) {
//         setActiveTab(newTabs[0].name);
//       }

//     } catch (error) {
//       console.error('Error sending query to backend:', error);
//     }

//     setIsLoading(false);
//   };

//   const isActive = query.trim() !== '';

//   return (
//     <div className="bg-white p-6 rounded-md shadow-md text-gray-800 border border-gray-200">
//       <h1 className="text-3xl font-semibold mb-1">
//         🔍 Natural Language to SQL
//       </h1>
//       <p className="text-sm text-gray-600 mb-4">
//         Enter your question in natural language and get the SQL query.
//       </p>

//       <textarea
//         className="w-full p-3 bg-gray-100 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Example: What was the GDP contribution of Manufacturing in 2020?"
//         rows={4}
//       />

//       <div className="flex items-center gap-4">
//         <button
//           onClick={handleProcess}
//           disabled={isLoading}
//           className={`px-4 py-2 rounded-md text-white flex items-center gap-2 transition 
//             ${
//               isLoading ? "bg-orange-300" : "bg-orange-500 hover:bg-orange-600"
//             }`}
//         >
//           {isLoading && <FiLoader className="animate-spin" />}
//           {isLoading ? "Processing..." : "Process Query"}
//         </button>

//         <button
//           onClick={() => {
//             if (hasProcessed && query.trim()) {
//               const existingHistory = JSON.parse(
//                 localStorage.getItem("queryHistory") || "[]"
//               );
//               const updatedHistory = [...existingHistory, query.trim()];
//               localStorage.setItem(
//                 "queryHistory",
//                 JSON.stringify(updatedHistory)
//               );
//               setQueryHistory(updatedHistory);
//             }

//             setQuery("");
//             setQueryResult([]);
//             setLoadedTabs([]);
//             setActiveTab("Schema Loader");
//             setTotalExecutionTime(null);
//             setHasProcessed(false);
//           }}
//           className="px-4 py-2 border border-orange-500 text-orange-500 hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600 rounded-md transition"
//         >
//           Clear Results
//         </button>
//       </div>

//       {isLoading && currentStep && (
//         <div className="flex items-center gap-3 mt-6 text-sm text-gray-700">
//           <FiLoader className="animate-spin text-orange-500 text-xl" />
//           <span>{currentStep} (loading...)</span>
//         </div>
//       )}

//       {loadedTabs.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-xl font-semibold mb-4">🔄 Processing Pipeline</h2>
//           {totalExecutionTime && (
//             <p className="text-sm text-gray-600 mb-4">
//               Execution time: {totalExecutionTime} sec
//             </p>
//           )}
//           <div className="relative border-b border-gray-300 flex space-x-6 pb-2">
//             {loadedTabs.map((tab) => (
//               <button
//                 key={tab.name}
//                 onClick={() => setActiveTab(tab.name)}
//                 disabled={!tab.executionTime}
//                 className={`text-sm font-medium pb-2 transition border-b-2 
//                   ${
//                     activeTab === tab.name
//                       ? "border-orange-500 text-orange-600"
//                       : "text-gray-600 hover:text-orange-500 border-transparent hover:border-orange-300"
//                   }
//                   ${
//                     !tab.executionTime ? "text-gray-400 cursor-not-allowed" : ""
//                   }`}
//               >
//                 {tab.name} ({tab.executionTime}s)
//               </button>
//             ))}
//           </div>
//           <TabsContent
//             activeTab={activeTab}
//             sqlQuery={sqlQuery}
//             suggestedVisualization={suggestedVisualization}
//           />
//           <QueryResults
//             rows={queryResult?.length || 0}
//             columns={queryResult && queryResult[0] ? Object.keys(queryResult[0]).length : 0}
//             data={queryResult}
//             insights={insights}
//             insightsLoading={insightsLoading}
//           />
//           <ExportResults />
//         </div>
//       )}
//     </div>
//   );
// };

// export default MainContent;



// import React, { useState, useEffect } from 'react';
// import { FiLoader } from 'react-icons/fi';
// import TabsContent from './TabsContent';
// import QueryResults from './QueryResults';
// import ExportResults from './ExportResults';
// import axios from 'axios';

// const MainContent = ({ query, setQuery, onSubmit, onClear, isSidebarOpen, setQueryHistory, autoRun, setAutoRun }) => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [loadedTabs, setLoadedTabs] = useState([]);
//   const [activeTab, setActiveTab] = useState('Schema Loader');
//   const [currentStep, setCurrentStep] = useState('');
//   const [queryResult, setQueryResult] = useState([]);
//   const [sqlQuery, setSqlQuery] = useState('');
//   const [suggestedVisualization, setSuggestedVisualization] = useState('');
//   const [hasProcessed, setHasProcessed] = useState(false);
//   const [totalExecutionTime, setTotalExecutionTime] = useState(null);

//   // NEW: Insights state
//   const [insights, setInsights] = useState('');
//   const [insightsLoading, setInsightsLoading] = useState(false);

//   useEffect(() => {
//     if (autoRun && query.trim()) {
//       handleProcess();
//       setAutoRun(false);
//     }
//   }, [autoRun, query, setAutoRun]);

//   const handleProcess = async () => {
//     setIsLoading(true);
//     setLoadedTabs([]);
//     setActiveTab('');
//     setCurrentStep('');
//     setQueryResult([]);
//     setHasProcessed(true);
//     setTotalExecutionTime(null);
//     setInsights('');
//     setInsightsLoading(true);

//     const headers = { 'Content-Type': 'application/json' };
//     const payload = { query: query.trim() };

//     try {
//       const response = await axios.post('http://localhost:8000/query-process', payload, { headers });
//       const {
//         result_data,
//         total_time_seconds,
//         processing_steps,
//         sql_query,
//         suggested_visualization,
//       } = response.data;

//       setQueryResult(result_data);
//       setTotalExecutionTime(total_time_seconds.toFixed(2));
//       setSqlQuery(sql_query);
//       setSuggestedVisualization(suggested_visualization);

//       const newTabs = processing_steps.map((step) => ({
//         name: step.agent,
//         executionTime: step.time_taken?.toFixed(2) || 'N/A',
//       }));

//       setLoadedTabs(newTabs);
//       if (newTabs.length > 0) {
//         setActiveTab(newTabs[0].name);
//       }

//       // Fetch insights AFTER successful query-process
//       try {
//         const insightsResponse = await axios.get('http://127.0.0.1:8000/summary-insights');
//         if (insightsResponse.status === 200 && insightsResponse.data.summary_insights) {
//           setInsights(insightsResponse.data.summary_insights);
//         } else {
//           setInsights('⚠️ No insights returned.');
//         }
//       } catch (err) {
//         console.error('Error fetching insights:', err);
//         setInsights('❌ Error loading insights.');
//       }

//     } catch (error) {
//       console.error('Error sending query to backend:', error);
//     } finally {
//       setInsightsLoading(false);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-md shadow-md text-gray-800 border border-gray-200">
//       <h1 className="text-3xl font-semibold mb-1"  style={{ color: '#b58932' }} >🔍 Natural Language to SQL</h1>
//       <p className="text-sm text-gray-600 mb-4">
//         Enter your question in natural language and get the SQL query.
//       </p>

//       <textarea
//         className="w-full p-3 bg-gray-100 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Example: What was the GDP contribution of Manufacturing in 2020?"
//         rows={4}
//       />

//       <div className="flex items-center gap-4">
//         <button
//           onClick={handleProcess}
//           disabled={isLoading}
//           className={`px-4 py-2 rounded-md text-white flex items-center gap-2 transition ${
//             isLoading ? 'bg-orange-300' : 'bg-orange-500 hover:bg-orange-600'
//           }`}
//         >
//           {isLoading && <FiLoader className="animate-spin" />}
//           {isLoading ? 'Processing...' : 'Process Query'}
//         </button>

//         <button
//           onClick={() => {
//             if (hasProcessed && query.trim()) {
//               const existingHistory = JSON.parse(localStorage.getItem('queryHistory') || '[]');
//               const updatedHistory = [...existingHistory, query.trim()];
//               localStorage.setItem('queryHistory', JSON.stringify(updatedHistory));
//               setQueryHistory(updatedHistory);
//             }

//             setQuery('');
//             setQueryResult([]);
//             setLoadedTabs([]);
//             setActiveTab('Schema Loader');
//             setTotalExecutionTime(null);
//             setHasProcessed(false);
//             setInsights('');
//             setInsightsLoading(false);
//           }}
//           className="px-4 py-2 border border-orange-500 text-orange-500 hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600 rounded-md transition"
//         >
//           Clear Results
//         </button>
//       </div>

//       {isLoading && currentStep && (
//         <div className="flex items-center gap-3 mt-6 text-sm text-gray-700">
//           <FiLoader className="animate-spin text-orange-500 text-xl" />
//           <span>{currentStep} (loading...)</span>
//         </div>
//       )}

//       {loadedTabs.length > 0 && (
//         <div className="mt-8">
//           <h2 className="text-xl font-semibold mb-4"  style={{ color: '#b58932' }}>🔄 Processing Pipeline</h2>
//           {totalExecutionTime && (
//             <p className="text-sm text-gray-600 mb-4">
//               Execution time: {totalExecutionTime} sec
//             </p>
//           )}
//           <div className="relative border-b border-gray-300 flex space-x-6 pb-2">
//             {loadedTabs.map((tab) => (
//               <button
//                 key={tab.name}
//                 onClick={() => setActiveTab(tab.name)}
//                 disabled={!tab.executionTime}
//                 className={`text-sm font-medium pb-2 transition border-b-2 ${
//                   activeTab === tab.name
//                     ? 'border-orange-500 text-orange-600'
//                     : 'text-gray-600 hover:text-orange-500 border-transparent hover:border-orange-300'
//                 } ${!tab.executionTime ? 'text-gray-400 cursor-not-allowed' : ''}`}
//               >
//                 {tab.name} ({tab.executionTime}s)
//               </button>
//             ))}
//           </div>

//           <TabsContent
//             activeTab={activeTab}
//             sqlQuery={sqlQuery}
//             suggestedVisualization={suggestedVisualization}
//           />

//           <QueryResults
//             rows={queryResult?.length || 0}
//             columns={queryResult && queryResult[0] ? Object.keys(queryResult[0]).length : 0}
//             data={queryResult}
//             insights={insights}
//             insightsLoading={insightsLoading}
//           />

//           <ExportResults />
//         </div>
//       )}
//     </div>
//   );
// };

// export default MainContent;


// MainContent.js
import React, { useState, useEffect } from 'react';
import { FiLoader } from 'react-icons/fi';
import TabsContent from './TabsContent';
// QueryResults and ExportResults will be rendered by TabsContent
// import QueryResults from './QueryResults'; // No longer directly used here
// import ExportResults from './ExportResults'; // No longer directly used here
import axios from 'axios';

const MainContent = ({ query, setQuery, onSubmit, onClear, isSidebarOpen, setQueryHistory, autoRun, setAutoRun }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedTabs, setLoadedTabs] = useState([]);
  const [activeTab, setActiveTab] = useState('Schema Loader');
  const [currentStep, setCurrentStep] = useState('');
  const [queryResult, setQueryResult] = useState([]);
  const [sqlQuery, setSqlQuery] = useState('');
  const [suggestedVisualization, setSuggestedVisualization] = useState('');
  const [hasProcessed, setHasProcessed] = useState(false);
  const [totalExecutionTime, setTotalExecutionTime] = useState(null);

  // NEW: Insights state
  const [insights, setInsights] = useState('');
  const [insightsLoading, setInsightsLoading] = useState(false);

  useEffect(() => {
    if (autoRun && query.trim()) {
      handleProcess();
      setAutoRun(false);
    }
  }, [autoRun, query, setAutoRun]);

  const handleProcess = async () => {
    setIsLoading(true);
    setLoadedTabs([]);
    setActiveTab('');
    setCurrentStep('');
    setQueryResult([]);
    setHasProcessed(true);
    setTotalExecutionTime(null);
    setInsights('');
    setInsightsLoading(true);

    const headers = { 'Content-Type': 'application/json' };
    const payload = { query: query.trim() };

    try {
      const response = await axios.post('http://localhost:8000/query-process', payload, { headers });
      const {
        result_data,
        total_time_seconds,
        processing_steps,
        sql_query,
        suggested_visualization,
      } = response.data;

      setQueryResult(result_data);
      setTotalExecutionTime(total_time_seconds.toFixed(2));
      setSqlQuery(sql_query);
      setSuggestedVisualization(suggested_visualization);

      const newTabs = processing_steps.map((step) => ({
        name: step.agent,
        executionTime: step.time_taken?.toFixed(2) || 'N/A',
      }));

      setLoadedTabs(newTabs);
      if (newTabs.length > 0) {
        setActiveTab(newTabs[0].name);
      }

      // Fetch insights AFTER successful query-process
      try {
        const insightsResponse = await axios.get('http://127.0.0.1:8000/summary-insights');
        if (insightsResponse.status === 200 && insightsResponse.data.summary_insights) {
          setInsights(insightsResponse.data.summary_insights);
        } else {
          setInsights('⚠️ No insights returned.');
        }
      } catch (err) {
        console.error('Error fetching insights:', err);
        setInsights('❌ Error loading insights.');
      }

    } catch (error) {
      console.error('Error sending query to backend:', error);
    } finally {
      setInsightsLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md text-gray-800 border border-gray-200">
      <h1 className="text-3xl font-semibold mb-1"  style={{ color: '#b58932' }} >🔍 Natural Language to SQL</h1>
      <p className="text-sm text-gray-600 mb-4">
        Enter your question in natural language and get the SQL query.
      </p>

      <textarea
        className="w-full p-3 bg-gray-100 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Example: What was the GDP contribution of Manufacturing in 2020?"
        rows={4}
      />

      <div className="flex items-center gap-4">
        <button
          onClick={handleProcess}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-white flex items-center gap-2 transition ${
            isLoading ? 'bg-orange-300' : 'bg-orange-500 hover:bg-orange-600'
          }`}
        >
          {isLoading && <FiLoader className="animate-spin" />}
          {isLoading ? 'Processing...' : 'Process Query'}
        </button>

        <button
          onClick={() => {
            if (hasProcessed && query.trim()) {
              const existingHistory = JSON.parse(localStorage.getItem('queryHistory') || '[]');
              const updatedHistory = [...existingHistory, query.trim()];
              localStorage.setItem('queryHistory', JSON.stringify(updatedHistory));
              setQueryHistory(updatedHistory);
            }

            setQuery('');
            setQueryResult([]);
            setLoadedTabs([]);
            setActiveTab('Schema Loader');
            setTotalExecutionTime(null);
            setHasProcessed(false);
            setInsights('');
            setInsightsLoading(false);
          }}
          className="px-4 py-2 border border-orange-500 text-orange-500 hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600 rounded-md transition"
        >
          Clear Results
        </button>
      </div>

      {isLoading && currentStep && (
        <div className="flex items-center gap-3 mt-6 text-sm text-gray-700">
          <FiLoader className="animate-spin text-orange-500 text-xl" />
          <span>{currentStep} (loading...)</span>
        </div>
      )}

      {loadedTabs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4"  style={{ color: '#b58932' }}>🔄 Processing Pipeline</h2>
          {totalExecutionTime && (
            <p className="text-sm text-gray-600 mb-4">
              Execution time: {totalExecutionTime} sec
            </p>
          )}
          <div className="relative border-b border-gray-300 flex space-x-6 pb-2">
            {loadedTabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                disabled={!tab.executionTime}
                className={`text-sm font-medium pb-2 transition border-b-2 ${
                  activeTab === tab.name
                    ? 'border-orange-500 text-orange-600'
                    : 'text-gray-600 hover:text-orange-500 border-transparent hover:border-orange-300'
                } ${!tab.executionTime ? 'text-gray-400 cursor-not-allowed' : ''}`}
              >
                {tab.name} ({tab.executionTime}s)
              </button>
            ))}
          </div>

          <TabsContent
            activeTab={activeTab}
            sqlQuery={sqlQuery}
            suggestedVisualization={suggestedVisualization}
            // Pass the necessary props for QueryResults and ExportResults
            queryResult={queryResult}
            insights={insights}
            insightsLoading={insightsLoading}
            // You can also pass pre-calculated rows and columns if you prefer
            // Or calculate them within TabsContent where QueryResults is used
            rows={queryResult?.length || 0}
            columns={queryResult && queryResult[0] ? Object.keys(queryResult[0]).length : 0}
          />

          {/*
            QueryResults and ExportResults are now moved into TabsContent
            and will be conditionally rendered there based on activeTab.
          */}
          {/*
          <QueryResults
            rows={queryResult?.length || 0}
            columns={queryResult && queryResult[0] ? Object.keys(queryResult[0]).length : 0}
            data={queryResult}
            insights={insights}
            insightsLoading={insightsLoading}
          />

          <ExportResults />
          */}
        </div>
      )}
    </div>
  );
};

export default MainContent;