import React, { useState } from 'react';
import Sidebar from './Components/Sidebar';
import MainContent from './Components/MainContent';
import ResultTable from './Components/ResultTable';
import VisualizationPanel from './Components/VisualizationPanel';
import Header from './Components/Header';

function App() {
  const [query, setQuery] = useState('');
  const [resultData, setResultData] = useState([]);
  const [visualizationType, setVisualizationType] = useState('Table');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleQuerySubmit = async () => {
    await new Promise((r) => setTimeout(r, 1500));
    setResultData([
      { Name: 'Alice', Age: 28 },
      { Name: 'Bob', Age: 34 },
    ]);
  };

  const handleClearResults = () => {
    setQuery('');
    setResultData([]);
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 relative">
        <Header toggleSidebar={toggleSidebar} />
        <main
          className={`transition-all duration-300 ease-in-out min-h-screen pt-24 px-6 ${
            sidebarOpen ? 'ml-80' : 'ml-0'
          }`}
        >
          <MainContent
            query={query}
            setQuery={setQuery}
            onSubmit={handleQuerySubmit}
            onClear={handleClearResults}
            isSidebarOpen={sidebarOpen}
          />
          {/* <VisualizationPanel
            data={resultData}
            type={visualizationType}
            setType={setVisualizationType}
          /> */}
          {/* <ResultTable data={resultData} /> */}
        </main>
      </div>
    </div>
  );
}

export default App;
