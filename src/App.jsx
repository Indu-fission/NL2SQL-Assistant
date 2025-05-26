// import React, { useState, useEffect } from 'react';
// import Sidebar from './Components/Sidebar';
// import MainContent from './Components/MainContent';
// import ResultTable from './Components/ResultTable';
// import VisualizationPanel from './Components/VisualizationPanel';
// import Header from './Components/Header';

// function App() {
//   const [query, setQuery] = useState('');
//   const [resultData, setResultData] = useState([]);
//   const [visualizationType, setVisualizationType] = useState('Table');
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [queryHistory, setQueryHistory] = useState(() => {
//     return JSON.parse(localStorage.getItem('queryHistory') || '[]');
//   });

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem('queryHistory') || '[]');
//     setQueryHistory(stored);
//   }, []);

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   const handleQuerySubmit = async () => {
//     await new Promise((r) => setTimeout(r, 1500));
//     setResultData([
//       { Name: 'Alice', Age: 28 },
//       { Name: 'Bob', Age: 34 },
//     ]);
//   };

//   const handleClearResults = () => {
//     if (query.trim()) {
//       const updated = [...queryHistory, query.trim()];
//       setQueryHistory(updated);
//       localStorage.setItem('queryHistory', JSON.stringify(updated));
//     }

//     setQuery('');
//     setResultData([]);
//   };

//   const handleProcessFromSidebar = (selectedQuery) => {
//     setQuery(selectedQuery);
//   };

//   return (
//     <div className="flex h-screen bg-white">
//       <Sidebar
//         isOpen={sidebarOpen}
//         queryHistory={queryHistory}
//         setQueryHistory={setQueryHistory}
//         handleProcess={handleProcessFromSidebar}
//       />

//       <div className="flex-1 relative">
//         <Header toggleSidebar={toggleSidebar} />
//         <main
//           className={`transition-all duration-300 ease-in-out min-h-screen pt-24 px-6 ${
//             sidebarOpen ? 'ml-80' : 'ml-0'
//           }`}
//         >
//           <MainContent
//             query={query}
//             setQuery={setQuery}
//             onSubmit={handleQuerySubmit}
//             onClear={handleClearResults}
//             isSidebarOpen={sidebarOpen}
//             setQueryHistory={setQueryHistory}
//           />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default App;

// import React, { useState, useEffect } from 'react';
// import Sidebar from './Components/Sidebar';
// import MainContent from './Components/MainContent';
// import ResultTable from './Components/ResultTable';
// import VisualizationPanel from './Components/VisualizationPanel';
// import Header from './Components/Header';

// function App() {
//   const [query, setQuery] = useState('');
//   const [resultData, setResultData] = useState([]);
//   const [visualizationType, setVisualizationType] = useState('Table');
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [queryHistory, setQueryHistory] = useState(() => {
//     return JSON.parse(localStorage.getItem('queryHistory') || '[]');
//   });
//   const [autoRun, setAutoRun] = useState(false); // new state

// const handleProcessFromSidebar = (selectedQuery) => {
//   setQuery(selectedQuery);
//   setAutoRun(true); // flag to run processQuery automatically
// };

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem('queryHistory') || '[]');
//     setQueryHistory(stored);
//   }, []);

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

//   const handleQuerySubmit = async () => {
//     await new Promise((r) => setTimeout(r, 1500));
//     setResultData([
//       { Name: 'Alice', Age: 28 },
//       { Name: 'Bob', Age: 34 },
//     ]);
//   };

//   const handleClearResults = () => {
//     if (query.trim()) {
//       const updated = [...queryHistory, query.trim()];
//       setQueryHistory(updated);
//       localStorage.setItem('queryHistory', JSON.stringify(updated));
//     }

//     setQuery('');
//     setResultData([]);
//   };

//   // const handleProcessFromSidebar = (selectedQuery) => {
//   //   setQuery(selectedQuery);
//   // };

//   return (
//     <div className="flex h-screen bg-white">
//       <Sidebar
//         isOpen={sidebarOpen}
//         queryHistory={queryHistory}
//         setQueryHistory={setQueryHistory}
//         handleProcess={handleProcessFromSidebar}
//       />

//       <div className="flex-1 relative">
//         <Header toggleSidebar={toggleSidebar} />
//         <main
//           className={`transition-all duration-300 ease-in-out min-h-screen pt-24 px-6 ${
//             sidebarOpen ? "ml-80" : "ml-0"
//           }`}
//         >
//           <MainContent
//             query={query}
//             setQuery={setQuery}
//             onSubmit={handleQuerySubmit}
//             onClear={handleClearResults}
//             isSidebarOpen={sidebarOpen}
//             setQueryHistory={setQueryHistory}
//             autoRun={autoRun}
//             setAutoRun={setAutoRun}
//           />
//         </main>
//       </div>
//     </div>
//   );
// }

// export default App;
import React, { useState, useEffect } from 'react';
import Sidebar from './Components/Sidebar';
import MainContent from './Components/MainContent';
import ResultTable from './Components/ResultTable';
import VisualizationPanel from './Components/VisualizationPanel';
import Header from './Components/Header';
import './i18n';

function App() {
  const [query, setQuery] = useState('');
  const [resultData, setResultData] = useState([]);
  const [visualizationType, setVisualizationType] = useState('Table');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [queryHistory, setQueryHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('queryHistory') || '[]');
  });
  const [autoRun, setAutoRun] = useState(false); // new state

const handleProcessFromSidebar = (selectedQuery) => {
  setQuery(selectedQuery);
  setAutoRun(true); // flag to run processQuery automatically
};

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('queryHistory') || '[]');
    setQueryHistory(stored);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleQuerySubmit = async () => {
    await new Promise((r) => setTimeout(r, 1500));
    setResultData([
      { Name: 'Alice', Age: 28 },
      { Name: 'Bob', Age: 34 },
    ]);
  };

  const handleClearResults = () => {
    if (query.trim()) {
      const updated = [...queryHistory, query.trim()];
      setQueryHistory(updated);
      localStorage.setItem('queryHistory', JSON.stringify(updated));
    }

    setQuery('');
    setResultData([]);
  };

  // const handleProcessFromSidebar = (selectedQuery) => {
  //   setQuery(selectedQuery);
  // };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        isOpen={sidebarOpen}
        queryHistory={queryHistory}
        setQueryHistory={setQueryHistory}
        handleProcess={handleProcessFromSidebar}
      />

      <div className="flex-1 relative">
        <Header toggleSidebar={toggleSidebar} />
        <main
          className={`transition-all duration-300 ease-in-out min-h-screen pt-24 px-6 ${
            sidebarOpen ? "ml-80" : "ml-0"
          }`}
        >
          <MainContent
            query={query}
            setQuery={setQuery}
            onSubmit={handleQuerySubmit}
            onClear={handleClearResults}
            isSidebarOpen={sidebarOpen}
            setQueryHistory={setQueryHistory}
            autoRun={autoRun}
            setAutoRun={setAutoRun}
          />
        </main>
      </div>
    </div>
  );
}

export default App;