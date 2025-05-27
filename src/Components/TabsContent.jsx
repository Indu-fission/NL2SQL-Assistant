import React, { useEffect, useState, useContext } from "react";
import { Copy } from "lucide-react";
import { FiCopy } from "react-icons/fi";
import QueryResults from "./QueryResults";
import ExportResults from "./ExportResults";
import ResultTable from "./ResultTable";
import { useTranslation } from "react-i18next";
import { AppContext } from "./context/AppContext";

const CollapsibleSection = ({ label, children, isOpen = true, onClick }) => (
  <div className="pl-3 border-l border-gray-300">
    <div
      className="cursor-pointer text-xs text-gray-800 flex items-center gap-1 py-1 select-none"
      onClick={onClick}
    >
      <span className="text-xs">
        {isOpen ? "▼" : "▶"} {label}
      </span>
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
    if (data === undefined || data === null) return; // Avoid error if data is not there
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const renderValue = (key, value, path = key) => {
    const isObject = typeof value === "object" && value !== null;
    const isArray = Array.isArray(value);

    if (isArray) {
      const isCollapsed = collapsed[path];
      return (
        <CollapsibleSection
          label={`"${key}": [`}
          isOpen={!isCollapsed}
          onClick={() => toggleCollapse(path)}
        >
          {!isCollapsed &&
            value.map((item, idx) => (
              <div
                key={idx}
                className="pl-4 border-l border-gray-200 text-gray-700 text-sm"
              >
                {renderValue(idx, item, `${path}[${idx}]`)}
              </div>
            ))}
          <div className="text-xs text-gray-500">]</div>
        </CollapsibleSection>
      );
    } else if (isObject) {
      const isCollapsed = collapsed[path];
      return (
        <CollapsibleSection
          label={`"${key}": {`}
          isOpen={!isCollapsed}
          onClick={() => toggleCollapse(path)}
        >
          {!isCollapsed &&
            Object.entries(value).map(([subKey, subVal]) => (
              <div
                key={subKey}
                className="pl-4 border-l border-gray-200 text-gray-700 text-sm"
              >
                {renderValue(subKey, subVal, `${path}.${subKey}`)}
              </div>
            ))}
          <div className="text-xs text-gray-500">{"}"}</div>
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

  if (data === undefined || data === null) {
    // Handle cases where data might not be provided
    return (
      <div className="p-4 font-mono text-sm mt-2 group">
        No data to display.
      </div>
    );
  }

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
          onClick={() => toggleCollapse("__root")}
        >
          {collapsed["__root"] ? "▶ {" : "▼ {"}
        </span>
        {!collapsed["__root"] && (
          <div className="pl-4">
            {Object.entries(data).map(([key, val]) => (
              <div key={key}>{renderValue(key, val, key)}</div>
            ))}
          </div>
        )}
        <div className="text-sm">{"}"}</div>
      </div>
    </div>
  );
};

const TabsContent = ({
  activeTab,
  sqlQuery,
  suggestedVisualization,
  decomposerJson,
  queryResult,
  insights,
  isAdmi,
  insightsLoading,
  rows,
  hasProcessed,
  columns,
  language = "english",
}) => {
  const [tabData, setTabData] = useState(null);
  const [copiedQuery, setCopiedQuery] = useState(false);
  const { t } = useTranslation();
  const { role } = useContext(AppContext);

  useEffect(() => {
    const fetchTabData = async () => {
      if (!hasProcessed) return; // ⛔️ Skip fetching until processed

      let url = "";
      let isDatabaseExecution = false;
      setTabData(null);

      if (activeTab === "Schema Loader") url = "http://localhost:8000/schema";
      else if (activeTab === "Selector Agent")
        url = "http://localhost:8000/selector-agent";
      else if (activeTab === "Decomposer Agent")
        url = "http://localhost:8000/decomposer-agent";
      else if (activeTab === "Refiner Agent")
        url = "http://localhost:8000/refiner-agent";
      else if (activeTab === "Database Execution") {
        isDatabaseExecution = true;
      } else if (activeTab === "Visualization Agent")
        url = "http://localhost:8000/visualization-agent";

      try {
        if (isDatabaseExecution) {
          const dataInsightsUrl =
            language === "ar"
              ? "http://127.0.0.1:8000/data-insights/arabic"
              : "http://127.0.0.1:8000/data-insights/english";

          const [execRes, insightsRes] = await Promise.all([
            fetch("http://localhost:8000/database-execution"),
            fetch(dataInsightsUrl),
          ]);

          if (!execRes.ok || !insightsRes.ok) {
            console.error(
              "Error fetching database execution or data insights data"
            );
            setTabData({
              status: "Error loading data",
              details: "Failed to fetch execution or insights data.",
            });
            return;
          }

          const execData = await execRes.json();
          const insightsData = await insightsRes.json();

          setTabData({
            ...execData,
            data_insights: insightsData.data_insights,
          });
        } else if (url) {
          const response = await fetch(url);
          if (!response.ok) {
            console.error(
              `Error fetching data for ${activeTab}: ${response.status}`
            );
            setTabData({
              status: "Error loading data",
              details: `Failed to fetch data for ${activeTab}. Status: ${response.status}`,
            });
            return;
          }
          const data = await response.json();
          setTabData(data);
        }
      } catch (error) {
        console.error(`Error fetching data for ${activeTab}:`, error);
        setTabData({
          status: "Error loading data",
          details: `An error occurred: ${error.message}`,
        });
      }
    };

    // ✅ Call fetch only if tab is active and processing is complete
    if (activeTab && hasProcessed) {
      fetchTabData();
    }
  }, [activeTab, language, hasProcessed]); // ✅ Include hasProcessed

  // CopyButton component (can be defined once, outside TabsContent or at the top level of the file)
  const CopyButton = ({ textToCopy, onCopied }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      if (textToCopy === undefined || textToCopy === null) return;
      navigator.clipboard.writeText(
        typeof textToCopy === "string"
          ? textToCopy
          : JSON.stringify(textToCopy, null, 2)
      );
      setCopied(true);
      if (onCopied) onCopied(true); // For external state management if needed
      setTimeout(() => {
        setCopied(false);
        if (onCopied) onCopied(false);
      }, 1500);
    };

    return (
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200 transition-colors"
        title="Copy to clipboard"
      >
        <FiCopy size={14} />
        {copied && (
          <span className="ml-1 text-xs text-green-600 absolute -top-5 right-0 bg-white p-1 rounded shadow">
            Copied!
          </span>
        )}
      </button>
    );
  };

  const MarkdownTable = ({ markdown }) => {
    if (!markdown || typeof markdown !== "string")
      return (
        <p className="text-sm text-gray-600 mt-2">
          No table data available or data is not in string format.
        </p>
      );
    const lines = markdown.split("\n").filter((line) => line.includes("|"));
    if (lines.length < 2)
      return (
        <p className="text-sm text-gray-600 mt-2">
          No valid table data found in Markdown.
        </p>
      );

    const headers = lines[0]
      .split("|")
      .map((cell) => cell.trim())
      .filter(Boolean);
    // Ensure the separator line is not processed as a data row
    const dataLines = lines
      .slice(1)
      .filter((line) => !line.match(/^(\|\s*-+\s*)+\|?$/));
    const rowsData = dataLines.map((line) =>
      line
        .split("|")
        .map((cell) => cell.trim())
        .filter(Boolean)
    );
    if (headers.length === 0 && rowsData.length === 0)
      return (
        <p className="text-sm text-gray-600 mt-2">
          Table headers or rows are empty after parsing.
        </p>
      );

    return (
      <div className="overflow-x-auto mt-2">
        <table className="table-auto border border-collapse border-gray-300 w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((header, i) => (
                <th
                  key={i}
                  className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowsData.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="border border-gray-300 px-3 py-2 text-gray-700"
                  >
                    {cell}
                  </td>
                ))}
                {/* Fill empty cells if row has fewer columns than headers */}
                {headers.length > row.length &&
                  Array(headers.length - row.length)
                    .fill(null)
                    .map((_, k) => (
                      <td
                        key={`empty-${idx}-${k}`}
                        className="border border-gray-300 px-3 py-2"
                      ></td>
                    ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Loading state for tabData
  if (
    !tabData &&
    (activeTab !== "Visualization Agent" ||
      (activeTab === "Visualization Agent" && !queryResult))
  ) {
    // For Visualization Agent, if tabData is null but queryResult is available, we might still want to show QueryResults.
    // This condition ensures we show loading only if tabData is expected and not yet loaded.
    // Or if Visualization Agent has no queryResult yet either.
    if (activeTab && activeTab !== "Visualization Agent") {
      // Only show loader if a tab that fetches its own data is active
      return <div className="mt-6 text-gray-800 p-4">{t("loading")}...</div>;
    }
  }

  return (
    <div className="mt-6 text-gray-800">
      {role === "admin" && activeTab === "Schema Loader" && tabData && (
        <div>
          <p>
            <strong>{t("status")}:</strong>{" "}
            <span className="text-green-600">{tabData.status}</span>
          </p>
          <p className="mt-2">
            <strong>{t("details")}:</strong>{" "}
            {typeof tabData.details === "object"
              ? JSON.stringify(tabData.details)
              : tabData.details}
          </p>
          {tabData.schema_content && (
            <>
              <div className="mt-4 font-semibold" style={{ color: "#b58932" }}>
                📜 {t("schemaContent")}
              </div>
              <div className="relative bg-gray-50 text-sm text-gray-900 rounded-md p-4 shadow mt-2">
                <pre
                  className="whitespace-pre-wrap text-xs leading-relaxed overflow-auto"
                  style={{ maxHeight: "300px" }}
                >
                  {tabData.schema_content}
                </pre>
                <CopyButton textToCopy={tabData.schema_content} />
              </div>
            </>
          )}
        </div>
      )}

      {role === "admin" && activeTab === "Selector Agent" && tabData && (
        <div>
          <p>
            <strong>{t("status")}:</strong>{" "}
            <span className="text-green-600">{tabData.status}</span>
          </p>
          <div className="mt-2">
            <strong className="font-medium">{t("details")}:</strong>{" "}
            {(() => {
              if (tabData.details) {
                if (
                  typeof tabData.details.explanation === "string" &&
                  tabData.details.explanation.trim() !== ""
                ) {
                  return (
                    <span className="text-gray-700">
                      {tabData.details.explanation}
                    </span>
                  );
                }
                if (
                  typeof tabData.details === "object" &&
                  tabData.details !== null
                ) {
                  return <JsonViewer data={tabData.details} />;
                }
                if (typeof tabData.details === "string") {
                  return (
                    <span className="text-gray-700">{tabData.details}</span>
                  );
                }
                return <span className="text-gray-500 italic">{t("not")}</span>;
              }
              return (
                <span className="text-gray-500 italic">{t("nodata")}.</span>
              );
            })()}
          </div>
        </div>
      )}

      {role === "admin" && activeTab === "Decomposer Agent" && tabData && (
        <div>
          <p>
            <strong>{t("status")}:</strong>{" "}
            <span className="text-green-600">{tabData.status}</span>
          </p>
          <div className="mt-2">
            <p className="font-semibold">{t("details")}:</p>
            {typeof tabData.details === "string" ? (
              <p className="ml-2 mt-1">{tabData.details}</p>
            ) : (
              <JsonViewer data={tabData.details} />
            )}
            {decomposerJson && (
              <>
                <div className="mt-4 font-semibold">
                  🧠{t("Decomposer JSON")}
                </div>
                <JsonViewer data={decomposerJson} />
              </>
            )}
          </div>
        </div>
      )}

      {role === "admin" && activeTab === "Refiner Agent" && tabData && (
        <div>
          <p>
            <strong>{t("status")}:</strong>{" "}
            <span className="text-green-600">{tabData.status}</span>
          </p>
          <div className="mt-2">
            <p className="font-semibold mb-1">{t("details")}:</p>
            <div className="relative bg-gray-100 p-4 rounded-lg border border-gray-300 font-mono text-sm whitespace-pre-wrap text-gray-800">
              {typeof tabData.details === "string" ? (
                tabData.details
              ) : (
                <pre>{JSON.stringify(tabData.details, null, 2)}</pre>
              )}
              <CopyButton
                textToCopy={tabData.details}
                onCopied={setCopiedQuery}
              />
              {/* copiedQuery state is managed by TabsContent for this specific button if needed, or CopyButton can manage its own internal 'copied' state display */}
              {/* {copiedQuery && (
                <span className="absolute top-2 right-10 text-xs text-green-600">Copied!</span>
              )} */}
            </div>
            {sqlQuery && (
              <>
                <div
                  className="mt-4 font-semibold"
                  style={{ color: "#b58932" }}
                >
                  🔍 {t("Generated SQL Query")}
                </div>
                <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow mt-2 overflow-auto w-full">
                  <pre className="whitespace-pre-wrap text-base leading-relaxed">
                    {sqlQuery}
                  </pre>
                  <CopyButton textToCopy={sqlQuery} />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {role === "admin" && activeTab === "Database Execution" && tabData && (
        <div>
          <p>
            <strong>{t("status")}:</strong>{" "}
            <span className="text-green-600">{tabData.status}</span>
          </p>
          <p className="mt-2">
            <strong>{t("details")}:</strong>{" "}
            {typeof tabData.details === "object"
              ? JSON.stringify(tabData.details)
              : tabData.details}
          </p>
          {sqlQuery && (
            <>
              <div className="mt-4 font-semibold">Executed SQL:</div>
              <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow mt-2 overflow-auto w-full">
                <pre className="whitespace-pre-wrap text-base leading-relaxed">
                  {sqlQuery}
                </pre>
                <CopyButton textToCopy={sqlQuery} />
              </div>
            </>
          )}
          {tabData.data_insights && (
            <>
              <div className="mt-6 font-semibold">📊 {t("Data Insights")}</div>
              <MarkdownTable markdown={tabData.data_insights} />
            </>
          )}
          <div className="mt-4">
            <p className="font-semibold mb-2">{t("Result")}:</p>
            <ResultTable data={queryResult} />
          </div>
        </div>
      )}

      {activeTab === "Visualization Agent" && (
        <>
          {/* Admins get full visualization agent tab content */}
          {tabData && (
            <div>
              <p>
                <strong>{t("status")}:</strong>{" "}
                <span className="text-green-600">{tabData.status}</span>
              </p>
              <div className="mt-2">
                <p className="font-semibold mr-2 inline-block">
                  {t("details")}:
                </p>
                <span className="text-gray-700">
                  {typeof tabData.details === "object"
                    ? JSON.stringify(tabData.details)
                    : tabData.details ||
                      "Summary and Data Insights process initiated."}
                </span>
              </div>
              {suggestedVisualization && (
                <div className="mt-2">
                  <p className="font-semibold mr-2 inline-block">
                    {t("Suggested Visualization Type")}:
                  </p>
                  <span className="text-gray-700">
                    {suggestedVisualization}
                  </span>
                </div>
              )}
              {sqlQuery && (
                <>
                  <div
                    className="mt-4 font-semibold"
                    style={{ color: "#b58932" }}
                  >
                    🔍{t("Generated SQL Query")}
                  </div>
                  <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow mt-2 overflow-auto w-full">
                    <pre className="whitespace-pre-wrap text-base leading-relaxed">
                      {sqlQuery}
                    </pre>
                    <CopyButton textToCopy={sqlQuery} />
                  </div>
                </>
              )}
            </div>
          )}

          {/* QueryResults and ExportResults shown to all users if data exists */}
          {(queryResult && queryResult.length > 0) || insights ? (
            <>
              <div className="mt-6">
                <QueryResults
                  rows={rows}
                  columns={columns}
                  data={queryResult}
                  insights={insights}
                  insightsLoading={insightsLoading}
                />
              </div>
              <div className="mt-4">
                <ExportResults />
              </div>
            </>
          ) : (
            !isAdmi &&
            !tabData && (
              <p className="mt-4 text-gray-600">
                Processing visualization data or no results to display yet...
              </p>
            )
          )}
        </>
      )}
    </div>
  );
};

export default TabsContent;