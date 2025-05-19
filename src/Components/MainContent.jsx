import React, { useState } from 'react';
import { FiLoader } from 'react-icons/fi';
import TabsContent from './TabsContent';

// Move tabsData here so MainContent and TabsContent both can use it
const tabsData = [
  { name: 'Schema Loader', time: 0.0 },
  { name: 'Selector Agent', time: 1.85 },
  { name: 'Decomposer Agent', time: 5.47 },
  { name: 'Refiner Agent', time: 2.13 },
  { name: 'Database Execution', time: 0.01 },
  { name: 'Visualization Agent', time: 1.77 },
];

const MainContent = ({ query, setQuery, onSubmit, onClear }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedTabs, setLoadedTabs] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [currentStep, setCurrentStep] = useState('');

  const handleProcess = async () => {
    setIsLoading(true);
    setLoadedTabs([]);
    setActiveTab('');
    setCurrentStep('');

    for (let i = 0; i < tabsData.length; i++) {
      const { name, time } = tabsData[i];
      setCurrentStep(name);
      await new Promise((resolve) => setTimeout(resolve, time * 1000));
      setLoadedTabs((prev) => [...prev, name]);
      if (i === 0) setActiveTab(name); // First tab is default
    }

    setCurrentStep('');
    await onSubmit?.(); // Optional callback
    setIsLoading(false);
  };

  const isActive = query.trim() !== '';

  return (
    <div className="bg-white p-6 rounded-md shadow-md text-gray-800 border border-gray-200">
      <h1 className="text-3xl font-semibold mb-1">🔍 Natural Language to SQL</h1>
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
          className={`px-4 py-2 rounded-md text-white flex items-center gap-2 transition 
            ${isLoading ? 'bg-orange-300' : 'bg-orange-500 hover:bg-orange-600'}`}
        >
          {isLoading && <FiLoader className="animate-spin" />}
          {isLoading ? 'Processing...' : 'Process Query'}
        </button>

        <button
          onClick={onClear}
          disabled={!isActive}
          className={`px-4 py-2 border rounded-md transition 
            ${isActive
              ? 'border-orange-500 text-orange-500 hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600'
              : 'border-transparent text-black cursor-not-allowed'}`}
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
          <h2 className="text-xl font-semibold mb-4">🔄 Processing Pipeline</h2>

          <div className="relative border-b border-gray-300 flex space-x-6 pb-2">
            {tabsData.map((tab) => {
              const isLoaded = loadedTabs.includes(tab.name);
              const isActiveTab = activeTab === tab.name;

              return (
                <button
                  key={tab.name}
                  onClick={() => isLoaded && setActiveTab(tab.name)}
                  disabled={!isLoaded}
                  className={`text-sm font-medium pb-2 transition border-b-2 ${
                    isActiveTab
                      ? 'border-orange-500 text-orange-600'
                      : isLoaded
                      ? 'text-gray-600 hover:text-orange-500 border-transparent hover:border-orange-300'
                      : 'text-gray-400 cursor-not-allowed border-transparent'
                  }`}
                >
                  {tab.name} ({tab.time.toFixed(2)}s)
                </button>
              );
            })}
          </div>

          <TabsContent activeTab={activeTab} />
        </div>
      )}
    </div>
  );
};

export default MainContent;
