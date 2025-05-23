import React, { useEffect, useState } from 'react';
import { Copy } from 'lucide-react';
import { FiCopy } from 'react-icons/fi';

const CollapsibleSection = ({ label, children, isOpen = true, onClick }) => (
  <div className="pl-3 border-l border-gray-300">
    <div
      className="cursor-pointer text-xs text-gray-800 flex items-center gap-1 py-1 select-none"
      onClick={onClick}
    >
      <span className="text-xs">{isOpen ? '▼' : '▶'} {label}</span>
    </div>
    {isOpen && <div className="pl-4">{children}</div>}
  </div>
);

const JsonViewer = ({ data }) => {
  const [collapsed, setCollapsed] = useState({});
  const [copied, setCopied] = useState(false);

  const toggleCollapse = (path) => {
    setCollapsed((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const renderValue = (key, value, path = key) => {
    const isObject = typeof value === 'object' && value !== null;
    const isArray = Array.isArray(value);

    if (isArray) {
      const isCollapsed = collapsed[path];
      return (
        <CollapsibleSection label={`"${key}": [`} isOpen={!isCollapsed} onClick={() => toggleCollapse(path)}>
          {!isCollapsed && value.map((item, idx) => (
            <div key={idx} className="pl-4 border-l border-gray-200 text-gray-700 text-sm">
              {renderValue(idx, item, `${path}[${idx}]`)}
            </div>
          ))}
          <div className="text-xs text-gray-500">]</div>
        </CollapsibleSection>
      );
    } else if (isObject) {
      const isCollapsed = collapsed[path];
      return (
        <CollapsibleSection label={`"${key}": {`} isOpen={!isCollapsed} onClick={() => toggleCollapse(path)}>
          {!isCollapsed && Object.entries(value).map(([subKey, subVal]) => (
            <div key={subKey} className="pl-4 border-l border-gray-200 text-gray-700 text-sm">
              {renderValue(subKey, subVal, `${path}.${subKey}`)}
            </div>
          ))}
          <div className="text-xs text-gray-500">{'}'}</div>
        </CollapsibleSection>
      );
    } else {
      return (
        <div className="pl-4 text-sm text-gray-800">
          <span className="text-gray-700">"{key}": </span>
          <span>{JSON.stringify(value)}</span>
        </div>
      );
    }
  };

  return (
    <div className="relative p-4 font-mono text-sm mt-2 group">
      <div
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center"
        onClick={handleCopy}
      >
        <Copy size={14} className="text-gray-400 hover:text-black" />
        {copied && <span className="ml-1 text-xs text-green-600">Copied!</span>}
      </div>

      <div>
        <span
          className="cursor-pointer select-none text-gray-800 text-sm"
          onClick={() => toggleCollapse('__root')}
        >
          {collapsed['__root'] ? '▶ {' : '▼ {'}
        </span>
        {!collapsed['__root'] && (
          <div className="pl-4">
            {Object.entries(data).map(([key, val]) => (
              <div key={key}>{renderValue(key, val, key)}</div>
            ))}
          </div>
        )}
        <div className="text-sm">{'}'}</div>
      </div>
    </div>
  );
};

const TabsContent = ({ activeTab, sqlQuery, suggestedVisualization, decomposerJson }) => {
    const [tabData, setTabData] = useState(null);
  const [copiedQuery, setCopiedQuery] = useState(false);

  

  useEffect(() => {
    const fetchTabData = async () => {
      let url = '';
      if (activeTab === 'Schema Loader') url = 'http://localhost:8000/schema';
      else if (activeTab === 'Selector Agent') url = 'http://localhost:8000/selector-agent';
      else if (activeTab === 'Decomposer Agent') url = 'http://localhost:8000/decomposer-agent';
      else if (activeTab === 'Refiner Agent') url = 'http://localhost:8000/refiner-agent';
      else if (activeTab === 'Database Execution') url = 'http://localhost:8000/database-execution';
      else if (activeTab === 'Visualization Agent') url = 'http://localhost:8000/visualization-agent';

      if (!url) return;

      try {
        const response = await fetch(url);
        const data = await response.json();
        setTabData(data);
      } catch (error) {
        console.error(`Error fetching data for ${activeTab}:`, error);
      }
    };

    if (activeTab) fetchTabData();
  }, [activeTab]);

  const handleCopyQuery = (query) => {
    navigator.clipboard.writeText(query);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 1500);
  };

  if (!tabData) return null;

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(typeof text === "string" ? text : JSON.stringify(text, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 text-blue-600 hover:text-blue-800"
      title="Copy to clipboard"
    >
      <FiCopy size={16} />
      {copied && <span className="ml-2 text-green-600 text-sm">Copied!</span>}
    </button>
  );
};

  return (
    <div className="mt-6 text-gray-800">
      {activeTab === "Schema Loader" && (
        <div>
          <p><strong>Status:</strong> <span className="text-green-600">{tabData.status}</span></p>
          <p className="mt-2"><strong>Details:</strong> {tabData.details}</p>
          {sqlQuery && (
            <>
              <div className="mt-4 font-semibold">🔍 Generated SQL Query</div>
              <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow mt-2 overflow-auto w-full">
                <pre className="whitespace-pre-wrap text-base leading-relaxed">{sqlQuery}</pre>
                <CopyButton text={sqlQuery} />
              </div>
            </>
          )}
        </div>
      )}
     {activeTab === "Selector Agent" && (
        <div>
          <p><strong>Status:</strong> <span className="text-green-600">{tabData.status}</span></p>
          <p className="mt-2"><strong>Details:</strong> {tabData.details?.explanation || tabData.details}</p>
          {sqlQuery && (
            <>
              <div className="mt-4 font-semibold">🔍 Generated SQL Query</div>
              <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow mt-2 overflow-auto w-full">
                <pre className="whitespace-pre-wrap text-base leading-relaxed">{sqlQuery}</pre>
                <CopyButton text={sqlQuery} />
              </div>
            </>
          )}
        </div>
      )}
      {activeTab === "Decomposer Agent" && (
        <div>
          <p>
            <strong>Status:</strong>{" "}
            <span className="text-green-600">{tabData.status}</span>
          </p>
          <div className="mt-2">
            <p className="font-semibold">Details:</p>
            {typeof tabData.details === "string" ? (
              <p className="ml-2 mt-1">{tabData.details}</p>
            ) : (
              <JsonViewer data={tabData.details} />
            )}
             {decomposerJson && <><div className="mt-4 font-semibold">🧠 Decomposer JSON</div><JsonViewer data={decomposerJson} /></>}
          {sqlQuery && (
            <>
              <div className="mt-4 font-semibold">🔍 Generated SQL Query</div>
              <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow mt-2 overflow-auto w-full">
                <pre className="whitespace-pre-wrap text-base leading-relaxed">{sqlQuery}</pre>
                <CopyButton text={sqlQuery} />
              </div>
            </>
          )}
          </div>
        </div>
      )}
      {activeTab === "Refiner Agent" && (
        <div>
          <p>
            <strong>Status:</strong>{" "}
            <span className="text-green-600">{tabData.status}</span>
          </p>

          <div className="mt-2">
            <p className="font-semibold mb-1">Details:</p>

            <div className="relative bg-gray-100 p-4 rounded-lg  border-gray-300 font-mono text-sm whitespace-pre-wrap text-blue-700">
              {typeof tabData.details === "string" ? (
                tabData.details
              ) : (
                <pre>{JSON.stringify(tabData.details, null, 2)}</pre>
              )}

              <div
                className="absolute top-2 right-2 cursor-pointer text-gray-400 hover:text-black"
                onClick={() => {
                  const textToCopy =
                    typeof tabData.details === "string"
                      ? tabData.details
                      : JSON.stringify(tabData.details, null, 2);
                  navigator.clipboard.writeText(textToCopy);
                  setCopiedQuery(true);
                  setTimeout(() => setCopiedQuery(false), 1500);
                }}
              >
                <Copy size={16} />
              </div>

              {copiedQuery && (
                <span className="absolute top-2 right-8 text-xs text-green-600">
                  Copied!
                </span>
              )}
            </div>
            {sqlQuery && (
            <>
              <div className="mt-4 font-semibold">🔍 Generated SQL Query</div>
              <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow mt-2 overflow-auto w-full">
                <pre className="whitespace-pre-wrap text-base leading-relaxed">{sqlQuery}</pre>
                <CopyButton text={sqlQuery} />
              </div>
            </>
          )}
          </div>
        </div>
      )}
     {activeTab === "Database Execution" && (
        <div>
          <p><strong>Status:</strong> <span className="text-green-600">{tabData.status}</span></p>
          <p className="mt-2"><strong>Details:</strong> {tabData.details}</p>
          {sqlQuery && (
            <>
              <div className="mt-4 font-semibold">🔍 Generated SQL Query</div>
              <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow mt-2 overflow-auto w-full">
                <pre className="whitespace-pre-wrap text-base leading-relaxed">{sqlQuery}</pre>
                <CopyButton text={sqlQuery} />
              </div>
            </>
          )}
        </div>
      )}
      {activeTab === "Visualization Agent" && (
        <div>
          <p>
            <strong>Status:</strong>{" "}
            <span className="text-green-600">{tabData.status}</span>
          </p>

          <div className="mt-2 flex">
            <p className="font-semibold mr-2">Details:</p>
            <p>Summary and Data Insights Generated Successfully.</p>
          </div>

          <div className="mt-2 flex">
            <p className="font-semibold">Suggested Visualization:</p>
            <p>{tabData.details}</p>
          </div>

          <div className="mt-4">
            <p className="font-semibold text-lg mb-2">💡 Summary Insights</p>
            {tabData.insights && (
              <ul className="list-disc pl-6 text-gray-800 leading-relaxed space-y-1">
                {tabData.insights
                  .split("\n")
                  .map((line) =>
                    line
                      .replace(/[*_-]+/g, "") // Remove *, -, _
                      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold markdown
                      .replace(/[{}]/g, "") // Remove {}
                      .trim()
                  )
                  .filter((line) => line) // Remove empty lines
                  .map((cleanedLine, index) => (
                    <li key={index}>{cleanedLine}</li>
                  ))}
              </ul>
            )}
          </div>
          {sqlQuery && (
            <>
              <div className="mt-4 font-semibold">🔍 Generated SQL Query</div>
              <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow mt-2 overflow-auto w-full">
                <pre className="whitespace-pre-wrap text-base leading-relaxed">{sqlQuery}</pre>
                <CopyButton text={sqlQuery} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TabsContent;
