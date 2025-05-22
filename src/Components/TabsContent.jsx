import React, { useState } from 'react';
import { FiCopy } from 'react-icons/fi';

const sqlQuery = `SELECT sector, 
       "2015", "2016", "2017", "2018", "2019", 
       "2020", "2021", "2022", "2023"
        FROM national_accounts_isic
        ORDER BY sector ASC
        LIMIT 10;`;

const jsonData = {
  tables_needed: ["national_accounts_isic"],
  columns_needed: ["sector", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
  aggregations: [],
  filters_conditions: [],
  joins: [],
  grouping: [],
  ordering: [{ column: "sector", direction: "ASC" }],
  explanation: "The query requests the top 10 rows from the 'national_accounts_isic' table. Since no specific ordering criteria or filters are provided, we will select the first 10 rows based on the default order (which is typically the order of insertion unless specified otherwise). The query will retrieve all columns from the table."
};

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

const JsonViewer = ({ data }) => {
  const [collapsedKeys, setCollapsedKeys] = useState({});

  const toggle = (path) => {
    setCollapsedKeys((prev) => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const renderValue = (key, value, path = key) => {
    const isObject = typeof value === 'object' && value !== null;
    const isArray = Array.isArray(value);

    if (isArray) {
      return (
        <div className="ml-4">
          <span className="cursor-pointer text-gray-700" onClick={() => toggle(path)}>
            {collapsedKeys[path] ? '▶' : '▼'} "{key}"
          </span>
          {collapsedKeys[path] ? (
            <div className="ml-6 text-gray-600">[ ... ]</div>
          ) : (
            <div className="ml-6 text-gray-800">
              [
              {value.map((item, idx) => (
                <div key={idx} className="ml-4">- {JSON.stringify(item)}</div>
              ))}
              ]
            </div>
          )}
        </div>
      );
    } else if (isObject) {
      return (
        <div className="ml-4">
          <span className="cursor-pointer text-gray-700" onClick={() => toggle(path)}>
            {collapsedKeys[path] ? '▶' : '▼'} "{key}"
          </span>
          {collapsedKeys[path] ? (
            <div className="ml-6 text-gray-600">{'{ ... }'}</div>
          ) : (
            <div className="ml-6">
              {'{'}
              {Object.entries(value).map(([subKey, subValue]) => (
                <div key={subKey}>{renderValue(subKey, subValue, `${path}.${subKey}`)}</div>
              ))}
              {'}'}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="ml-4">
          <span className="text-gray-700">"{key}": </span>
          <span className="text-gray-800">{JSON.stringify(value)}</span>
        </div>
      );
    }
  };

  return (
    <div className="relative bg-gray-50 p-4 rounded-md shadow-md text-sm mt-2 mb-4 w-full overflow-auto">
      <CopyButton text={data} />
      <div className="font-mono text-[13px] text-gray-900">
        <span className="cursor-pointer text-gray-700" onClick={() => toggle('__root')}>
          {collapsedKeys['__root'] ? '▶' : '▼'} {'{'}
        </span>
        {collapsedKeys['__root'] ? (
          <div className="ml-6 text-gray-600">{'...'} {'}'}</div>
        ) : (
          <div className="ml-6">
            {Object.entries(data).map(([key, value]) => (
              <div key={key}>{renderValue(key, value, key)}</div>
            ))}
            {'}'}
          </div>
        )}
      </div>
    </div>
  );
};

const TabsContent = ({ activeTab }) => {
  if (!activeTab) return null;

  return (
    <div className="mt-6 text-gray-800">
      {activeTab === "Schema Loader" && (
        <div>
          <p>
            <strong>Status:</strong>{" "}
            <span className="text-green-600">
              ✅ Schema already loaded from database
            </span>
          </p>
          <div className="mt-2 flex">
            <p className="font-semibold mr-2">Details:</p>
            <p>Database schema is available.</p>
          </div>
          <div className="mt-4 font-semibold">🔍 Generated SQL Query</div>
          <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow mt-2 overflow-auto w-full">
            <pre className="whitespace-pre-wrap text-base leading-relaxed">
              {sqlQuery}
            </pre>
            <CopyButton text={sqlQuery} />
          </div>
        </div>
      )}

      {activeTab === "Selector Agent" && (
        <div className="mt-6">
          <p>
            <strong>Status:</strong>{" "}
            <span className="text-green-600">✅ Query is answerable</span>
          </p>
          <div className="mt-2 flex">
            <p className="font-semibold mr-2">Details:</p>
            <p>
              Yes. The schema contains the necessary table and columns to
              retrieve rows.
            </p>
          </div>
          <div className="mt-4 font-semibold">🔍 Generated SQL Query</div>
          <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow mt-2 overflow-auto w-full">
            <pre className="whitespace-pre-wrap text-base leading-relaxed">
              {sqlQuery}
            </pre>
            <CopyButton text={sqlQuery} />
          </div>
        </div>
      )}

      {activeTab === "Decomposer Agent" && (
        <div className="mt-6">
          <p>
            <strong>Status:</strong>{" "}
            <span className="text-green-600">
              ✅ Query decomposed successfully
            </span>
          </p>
          <div className="mt-2 flex">
            <p className="font-semibold mr-2">Details:</p>
            <p>JSON decomposition structure is available.</p>
          </div>
          <div className="mt-4 font-semibold">🧠 Decomposer JSON</div>
          <JsonViewer data={jsonData} />
          <div className="mt-4 font-semibold">🔍 Generated SQL Query</div>
          <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 mt-2 shadow overflow-auto w-full">
            <pre className="whitespace-pre-wrap text-base leading-relaxed">
              {sqlQuery}
            </pre>
            <CopyButton text={sqlQuery} />
          </div>
        </div>
      )}

      {activeTab === "Refiner Agent" && (
        <div className="mt-6">
          <p>
            <strong>Status:</strong>{" "}
            <span className="text-green-600">✅ SQL generated</span>
          </p>
          <div className="mt-2">
            <p className="font-semibold">Details:</p>
            <div className="relative bg-gray-100 p-3 rounded-md mt-1 whitespace-pre-wrap text-base leading-relaxed">
              <pre className="m-0">{sqlQuery}</pre>
              <CopyButton text={sqlQuery} />
            </div>
          </div>

          <div className="mt-4 font-semibold">🔍 Generated SQL Query</div>
          <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow mt-2 overflow-auto w-full">
            <pre className="whitespace-pre-wrap text-base leading-relaxed">
              {sqlQuery}
            </pre>
            <CopyButton text={sqlQuery} />
          </div>
        </div>
      )}

      {activeTab === "Database Execution" && (
        <div className="mt-6">
          <p>
            <strong>Status:</strong>{" "}
            <span className="text-green-600">
              ✅ Query executed successfully
            </span>
          </p>
          <div className="mt-2 mb-4 flex">
            <p className="font-semibold mr-2">Details:</p>
            <p>Query returned 10 rows and 10 columns.</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold mr-2">Executed SQL:</p>
            <div className="relative bg-gray-100 p-3 rounded-md mt-1 whitespace-pre-wrap text-base leading-relaxed">
              <pre className="m-0">{sqlQuery}</pre>
              <CopyButton text={sqlQuery} />
            </div>
          </div>
          <div className="mt-4 font-semibold">🔍 Generated SQL Query</div>
          <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow mt-2 overflow-auto w-full">
            <pre className="whitespace-pre-wrap text-base leading-relaxed">
              {sqlQuery}
            </pre>
            <CopyButton text={sqlQuery} />
          </div>
        </div>
      )}

{/* Visualization Table */}
      {activeTab === "Visualization Agent" && (
        <div>
          <p>
            <strong>Status:</strong>{" "}
            <span className="text-green-600">✅ Visualization suggested</span>
          </p>
          
          <div className="mt-2 flex">
            {/* <p className="font-semibold mr-2">Details:</p> */}
            {/* <p>Suggested visualization: Bar Chart</p> */}

 <p>
            <strong>Details:</strong>{" "}
          </p>
          </div>

            <p>
            <strong>Suggested visualization:</strong>{" "}
            <span className="text-green-600">Table</span>
          </p>

          <p>
            <b>Insights:</b>
          </p>


          <div className="mt-4 font-semibold">🔍 Generated SQL Query</div>
          <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow mt-2 overflow-auto w-full">
            <pre className="whitespace-pre-wrap text-base leading-relaxed">
              {sqlQuery}
            </pre>

            <CopyButton text={sqlQuery} />
          </div>

          {/*  */}




          {/*  */}
        </div>

        
      )}
    </div>
  );
};

export default TabsContent;