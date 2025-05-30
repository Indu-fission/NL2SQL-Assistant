// import React, { useEffect, useState, useContext } from "react";
// import { Copy } from "lucide-react";
// import { FiCopy } from "react-icons/fi";
// import QueryResults from "./QueryResults";
// import ExportResults from "./ExportResults";
// import ResultTable from "./ResultTable";
// import { useTranslation } from "react-i18next";
// import { AppContext } from "./context/AppContext";

// const CollapsibleSection = ({ label, children, isOpen = true, onClick }) => (
//   <div className="pl-3 border-l border-gray-300">
//     <div
//       className="cursor-pointer text-xs text-gray-800 flex items-center gap-1 py-1 select-none"
//       onClick={onClick}
//     >
//       <span className="text-xs">
//         {isOpen ? "▼" : "▶"} {label}
//       </span>
//     </div>
//     {isOpen && <div className="pl-4">{children}</div>}
//   </div>
// );

// const JsonViewer = ({ data }) => {
//   const [collapsed, setCollapsed] = useState({});
//   const [copied, setCopied] = useState(false);

//   const toggleCollapse = (path) => {
//     setCollapsed((prev) => ({ ...prev, [path]: !prev[path] }));
//   };

//   const handleCopy = () => {
//     if (data === undefined || data === null) return; // Avoid error if data is not there
//     navigator.clipboard.writeText(JSON.stringify(data, null, 2));
//     setCopied(true);
//     setTimeout(() => setCopied(false), 1500);
//   };

//   const renderValue = (key, value, path = key) => {
//     const isObject = typeof value === "object" && value !== null;
//     const isArray = Array.isArray(value);

//     if (isArray) {
//       const isCollapsed = collapsed[path];
//       return (
//         <CollapsibleSection
//           label={`"${key}": [`}
//           isOpen={!isCollapsed}
//           onClick={() => toggleCollapse(path)}
//         >
//           {!isCollapsed &&
//             value.map((item, idx) => (
//               <div
//                 key={idx}
//                 className="pl-4 border-l border-gray-200 text-gray-700 text-sm"
//               >
//                 {renderValue(idx, item, `${path}[${idx}]`)}
//               </div>
//             ))}
//           <div className="text-xs text-gray-500">]</div>
//         </CollapsibleSection>
//       );
//     } else if (isObject) {
//       const isCollapsed = collapsed[path];
//       return (
//         <CollapsibleSection
//           label={`"${key}": {`}
//           isOpen={!isCollapsed}
//           onClick={() => toggleCollapse(path)}
//         >
//           {!isCollapsed &&
//             Object.entries(value).map(([subKey, subVal]) => (
//               <div
//                 key={subKey}
//                 className="pl-4 border-l border-gray-200 text-gray-700 text-sm"
//               >
//                 {renderValue(subKey, subVal, `${path}.${subKey}`)}
//               </div>
//             ))}
//           <div className="text-xs text-gray-500">{"}"}</div>
//         </CollapsibleSection>
//       );
//     } else {
//       return (
//         <div className="pl-4 text-sm text-gray-800">
//           <span className="text-gray-700">"{key}": </span>
//           <span>{JSON.stringify(value)}</span>
//         </div>
//       );
//     }
//   };

//   if (data === undefined || data === null) {
//     // Handle cases where data might not be provided
//     return (
//       <div className="p-4 font-mono text-sm mt-2 group">
//         No data to display.
//       </div>
//     );
//   }

//   return (
//     <div className="relative p-4 font-mono text-sm mt-2 group">
//       <div
//         className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center"
//         onClick={handleCopy}
//       >
//         <Copy size={14} className="text-gray-400 hover:text-black" />
//         {copied && <span className="ml-1 text-xs text-green-600">Copied!</span>}
//       </div>

//       <div>
//         <span
//           className="cursor-pointer select-none text-gray-800 text-sm"
//           onClick={() => toggleCollapse("__root")}
//         >
//           {collapsed["__root"] ? "▶ {" : "▼ {"}
//         </span>
//         {!collapsed["__root"] && (
//           <div className="pl-4">
//             {Object.entries(data).map(([key, val]) => (
//               <div key={key}>{renderValue(key, val, key)}</div>
//             ))}
//           </div>
//         )}
//         <div className="text-sm">{"}"}</div>
//       </div>
//     </div>
//   );
// };

// const TabsContent = ({
//   activeTab,
//   sqlQuery,
//   suggestedVisualization,
//   decomposerJson,
//   queryResult,
//   insights,
//   isAdmi,
//   insightsLoading,
//   rows,
//   hasProcessed,
//   columns,
//   language = "english",
// }) => {
//   const [tabData, setTabData] = useState(null);
//   const [copiedQuery, setCopiedQuery] = useState(false);
//   const { t } = useTranslation();
//   const { role } = useContext(AppContext);

//   useEffect(() => {
//     const fetchTabData = async () => {
//       if (!hasProcessed)  {
//         setTabData(null); // Clear any potentially stale tab specific data
//         return;
//       } 

//       setTabData(null);

//       let url = "";
//       let isDatabaseExecution = false;

//       if (role === 'user' && activeTab === "Visualization Agent") {
//         // For the user's view of this tab, data (queryResult, insights) comes from props.
//         // No separate fetch needed here for tabData. tabData will remain null.
//         return;
//       }
  

//       if (activeTab === "Schema Loader") url = "http://localhost:8000/schema";
//       else if (activeTab === "Selector Agent")
//         url = "http://localhost:8000/selector-agent";
//       else if (activeTab === "Decomposer Agent")
//         url = "http://localhost:8000/decomposer-agent";
//       else if (activeTab === "Refiner Agent")
//         url = "http://localhost:8000/refiner-agent";
//       else if (activeTab === "Database Execution") {
//         isDatabaseExecution = true;
//       } else if (activeTab === "Visualization Agent")
//         url = "http://localhost:8000/visualization-agent";

//       try {
//         if (isDatabaseExecution) {
//           const dataInsightsUrl =
//             language === "ar"
//               ? "http://127.0.0.1:8000/data-insights/arabic"
//               : "http://127.0.0.1:8000/data-insights/english";

//           const [execRes, insightsRes] = await Promise.all([
//             fetch("http://localhost:8000/database-execution"),
//             fetch(dataInsightsUrl),
//           ]);

//           if (!execRes.ok || !insightsRes.ok) {
//             console.error(
//               "Error fetching database execution or data insights data"
//             );
//             setTabData({
//               status: "Error loading data",
//               details: "Failed to fetch execution or insights data.",
//             });
//             return;
//           }

//           const execData = await execRes.json();
//           const insightsData = await insightsRes.json();

//           setTabData({
//             ...execData,
//             data_insights: insightsData.data_insights,
//           });
//         } else if (url) {
//           const response = await fetch(url);
//           if (!response.ok) {
//             console.error(
//               `Error fetching data for ${activeTab}: ${response.status}`
//             );
//             setTabData({
//               status: "Error loading data",
//               details: `Failed to fetch data for ${activeTab}. Status: ${response.status}`,
//             });
//             return;
//           }
//           const data = await response.json();
//           setTabData(data);
//         }
//       } catch (error) {
//         console.error(`Error fetching data for ${activeTab}:`, error);
//         setTabData({
//           status: "Error loading data",
//           details: `An error occurred: ${error.message}`,
//         });
//       }
//     };

//     // ✅ Call fetch only if tab is active and processing is complete
//     if (activeTab) {
//       fetchTabData();
//     }else {
//       // No active tab, so no specific tab data to load/show
//       setTabData(null);
//     }
    
//   }, [activeTab, language, hasProcessed,role]); // ✅ Include hasProcessed

//   // CopyButton component (can be defined once, outside TabsContent or at the top level of the file)
//   const CopyButton = ({ textToCopy, onCopied }) => {
//     const [copied, setCopied] = useState(false);

//     const handleCopy = () => {
//       if (textToCopy === undefined || textToCopy === null) return;
//       navigator.clipboard.writeText(
//         typeof textToCopy === "string"
//           ? textToCopy
//           : JSON.stringify(textToCopy, null, 2)
//       );
//       setCopied(true);
//       if (onCopied) onCopied(true); // For external state management if needed
//       setTimeout(() => {
//         setCopied(false);
//         if (onCopied) onCopied(false);
//       }, 1500);
//     };

//     return (
//       <button
//         onClick={handleCopy}
//         className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200 transition-colors"
//         title="Copy to clipboard"
//       >
//         <FiCopy size={14} />
//         {copied && (
//           <span className="ml-1 text-xs text-green-600 absolute -top-5 right-0 bg-white p-1 rounded shadow">
//             Copied!
//           </span>
//         )}
//       </button>
//     );
//   };

//   const MarkdownTable = ({ markdown }) => {
//     if (!markdown || typeof markdown !== "string")
//       return (
//         <p className="text-sm text-gray-600 mt-2">
//           No table data available or data is not in string format.
//         </p>
//       );
//     const lines = markdown.split("\n").filter((line) => line.includes("|"));
//     if (lines.length < 2)
//       return (
//         <p className="text-sm text-gray-600 mt-2">
//           No valid table data found in Markdown.
//         </p>
//       );

//     const headers = lines[0]
//       .split("|")
//       .map((cell) => cell.trim())
//       .filter(Boolean);
//     // Ensure the separator line is not processed as a data row
//     const dataLines = lines
//       .slice(1)
//       .filter((line) => !line.match(/^(\|\s*-+\s*)+\|?$/));
//     const rowsData = dataLines.map((line) =>
//       line
//         .split("|")
//         .map((cell) => cell.trim())
//         .filter(Boolean)
//     );
//     if (headers.length === 0 && rowsData.length === 0)
//       return (
//         <p className="text-sm text-gray-600 mt-2">
//           Table headers or rows are empty after parsing.
//         </p>
//       );

//     return (
//       <div className="overflow-x-auto mt-2">
//         <table className="table-auto border border-collapse border-gray-300 w-full text-sm">
//           <thead>
//             <tr className="bg-gray-100">
//               {headers.map((header, i) => (
//                 <th
//                   key={i}
//                   className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700"
//                 >
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {rowsData.map((row, idx) => (
//               <tr key={idx} className="hover:bg-gray-50">
//                 {row.map((cell, j) => (
//                   <td
//                     key={j}
//                     className="border border-gray-300 px-3 py-2 text-gray-700"
//                   >
//                     {cell}
//                   </td>
//                 ))}
//                 {/* Fill empty cells if row has fewer columns than headers */}
//                 {headers.length > row.length &&
//                   Array(headers.length - row.length)
//                     .fill(null)
//                     .map((_, k) => (
//                       <td
//                         key={`empty-${idx}-${k}`}
//                         className="border border-gray-300 px-3 py-2"
//                       ></td>
//                     ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   // Loading state for tabData
//   if (
//     !tabData &&
//     (activeTab !== "Visualization Agent" ||
//       (activeTab === "Visualization Agent" && !queryResult))
//   ) {
//     // For Visualization Agent, if tabData is null but queryResult is available, we might still want to show QueryResults.
//     // This condition ensures we show loading only if tabData is expected and not yet loaded.
//     // Or if Visualization Agent has no queryResult yet either.
//     if (activeTab && activeTab !== "Visualization Agent") {
//       // Only show loader if a tab that fetches its own data is active
//       return <div className="mt-6 text-gray-800 p-4">{t("loading")}...</div>;
//     }
//   }

//   return (
//     <div className="mt-6 text-gray-800">
//       {role === "admin" && activeTab === "Schema Loader" && tabData && (
//         <div>
//           <p>
//             <strong>{t("status")}:</strong>{" "}
//             <span className="text-green-600">{tabData.status}</span>
//           </p>
//           <p className="mt-2">
//             <strong>{t("details")}:</strong>{" "}
//             {typeof tabData.details === "object"
//               ? JSON.stringify(tabData.details)
//               : tabData.details}
//           </p>
//           {tabData.schema_content && (
//             <>
//               <div className="mt-4 font-semibold" style={{ color: "#b58932" }}>
//                 📜 {t("schemaContent")}
//               </div>
//               <div className="relative bg-gray-50 text-sm text-gray-900 rounded-md p-4 shadow mt-2">
//                 <pre
//                   className="whitespace-pre-wrap text-xs leading-relaxed overflow-auto"
//                   style={{ maxHeight: "300px" }}
//                 >
//                   {tabData.schema_content}
//                 </pre>
//                 <CopyButton textToCopy={tabData.schema_content} />
//               </div>
//             </>
//           )}
//         </div>
//       )}

//       {role === "admin" && activeTab === "Selector Agent" && tabData && (
//         <div>
//           <p>
//             <strong>{t("status")}:</strong>{" "}
//             <span className="text-green-600">{tabData.status}</span>
//           </p>
//           <div className="mt-2">
//             <strong className="font-medium">{t("details")}:</strong>{" "}
//             {(() => {
//               if (tabData.details) {
//                 if (
//                   typeof tabData.details.explanation === "string" &&
//                   tabData.details.explanation.trim() !== ""
//                 ) {
//                   return (
//                     <span className="text-gray-700">
//                       {tabData.details.explanation}
//                     </span>
//                   );
//                 }
//                 if (
//                   typeof tabData.details === "object" &&
//                   tabData.details !== null
//                 ) {
//                   return <JsonViewer data={tabData.details} />;
//                 }
//                 if (typeof tabData.details === "string") {
//                   return (
//                     <span className="text-gray-700">{tabData.details}</span>
//                   );
//                 }
//                 return <span className="text-gray-500 italic">{t("not")}</span>;
//               }
//               return (
//                 <span className="text-gray-500 italic">{t("nodata")}.</span>
//               );
//             })()}
//           </div>
//         </div>
//       )}

//       {role === "admin" && activeTab === "Decomposer Agent" && tabData && (
//         <div>
//           <p>
//             <strong>{t("status")}:</strong>{" "}
//             <span className="text-green-600">{tabData.status}</span>
//           </p>
//           <div className="mt-2">
//             <p className="font-semibold">{t("details")}:</p>
//             {typeof tabData.details === "string" ? (
//               <p className="ml-2 mt-1">{tabData.details}</p>
//             ) : (
//               <JsonViewer data={tabData.details} />
//             )}
//             {decomposerJson && (
//               <>
//                 <div className="mt-4 font-semibold">
//                   🧠{t("Decomposer JSON")}
//                 </div>
//                 <JsonViewer data={decomposerJson} />
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {role === "admin" && activeTab === "Refiner Agent" && tabData && (
//         <div>
//           <p>
//             <strong>{t("status")}:</strong>{" "}
//             <span className="text-green-600">{tabData.status}</span>
//           </p>
//           <div className="mt-2">
//             <p className="font-semibold mb-1">{t("details")}:</p>
//             <div className="relative bg-gray-100 p-4 rounded-lg border border-gray-300 font-mono text-sm whitespace-pre-wrap text-gray-800">
//               {typeof tabData.details === "string" ? (
//                 tabData.details
//               ) : (
//                 <pre>{JSON.stringify(tabData.details, null, 2)}</pre>
//               )}
//               <CopyButton
//                 textToCopy={tabData.details}
//                 onCopied={setCopiedQuery}
//               />
//               {/* copiedQuery state is managed by TabsContent for this specific button if needed, or CopyButton can manage its own internal 'copied' state display */}
//               {/* {copiedQuery && (
//                 <span className="absolute top-2 right-10 text-xs text-green-600">Copied!</span>
//               )} */}
//             </div>
//             {sqlQuery && (
//               <>
//                 <div
//                   className="mt-4 font-semibold"
//                   style={{ color: "#b58932" }}
//                 >
//                   🔍 {t("Generated SQL Query")}
//                 </div>
//                 <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow mt-2 overflow-auto w-full">
//                   <pre className="whitespace-pre-wrap text-base leading-relaxed">
//                     {sqlQuery}
//                   </pre>
//                   <CopyButton textToCopy={sqlQuery} />
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {role === "admin" && activeTab === "Database Execution" && tabData && (
//         <div>
//           <p>
//             <strong>{t("status")}:</strong>{" "}
//             <span className="text-green-600">{tabData.status}</span>
//           </p>
//           <p className="mt-2">
//             <strong>{t("details")}:</strong>{" "}
//             {typeof tabData.details === "object"
//               ? JSON.stringify(tabData.details)
//               : tabData.details}
//           </p>
//           {sqlQuery && (
//             <>
//               <div className="mt-4 font-semibold">Executed SQL:</div>
//               <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow mt-2 overflow-auto w-full">
//                 <pre className="whitespace-pre-wrap text-base leading-relaxed">
//                   {sqlQuery}
//                 </pre>
//                 <CopyButton textToCopy={sqlQuery} />
//               </div>
//             </>
//           )}
//           {tabData.data_insights && (
//             <>
//               <div className="mt-6 font-semibold">📊 {t("Data Insights")}</div>
//               <MarkdownTable markdown={tabData.data_insights} />
//             </>
//           )}
//           <div className="mt-4">
//             <p className="font-semibold mb-2">{t("Result")}:</p>
//             <ResultTable data={queryResult} />
//           </div>
//         </div>
//       )}

//       {activeTab === "Visualization Agent" && (
//         <>
//           {/* Admins get full visualization agent tab content */}
//           {tabData && (
//             <div>
//               <p>
//                 <strong>{t("status")}:</strong>{" "}
//                 <span className="text-green-600">{tabData.status}</span>
//               </p>
//               <div className="mt-2">
//                 <p className="font-semibold mr-2 inline-block">
//                   {t("details")}:
//                 </p>
//                 <span className="text-gray-700">
//                   {typeof tabData.details === "object"
//                     ? JSON.stringify(tabData.details)
//                     : tabData.details ||
//                       "Summary and Data Insights process initiated."}
//                 </span>
//               </div>
//               {suggestedVisualization && (
//                 <div className="mt-2">
//                   <p className="font-semibold mr-2 inline-block">
//                     {t("Suggested Visualization Type")}:
//                   </p>
//                   <span className="text-gray-700">
//                     {suggestedVisualization}
//                   </span>
//                 </div>
//               )}
//               {sqlQuery && (
//                 <>
//                   <div
//                     className="mt-4 font-semibold"
//                     style={{ color: "#b58932" }}
//                   >
//                     🔍{t("Generated SQL Query")}
//                   </div>
//                   <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow mt-2 overflow-auto w-full">
//                     <pre className="whitespace-pre-wrap text-base leading-relaxed">
//                       {sqlQuery}
//                     </pre>
//                     <CopyButton textToCopy={sqlQuery} />
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* QueryResults and ExportResults shown to all users if data exists */}
//           {(queryResult && queryResult.length > 0) || insights ? (
//             <>
//               <div className="mt-6">
//                 <QueryResults
//                   rows={rows}
//                   columns={columns}
//                   data={queryResult}
//                   insights={insights}
//                   insightsLoading={insightsLoading}
//                 />
//               </div>
//               <div className="mt-4">
//                 <ExportResults />
//               </div>
//             </>
//           ) : (
//             !isAdmi &&
//             !tabData && (
//               <p className="mt-4 text-gray-600">
//                 Processing visualization data...
//               </p>
//             )
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default TabsContent;



import React, { useEffect, useState, useContext } from "react";
import { Copy } from "lucide-react";
import { FiCopy } from "react-icons/fi";
import QueryResults from "./QueryResults";
import ExportResults from "./ExportResults";
import ResultTable from "./ResultTable";
import { useTranslation } from "react-i18next";
import { AppContext } from "./context/AppContext";
import { FaUsers } from 'react-icons/fa';
import './MainContent.css'; // Ensure this path is correct & custom-button is styled

// CollapsibleSection Component (no changes from your present code)
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

// JsonViewer Component (no changes from your present code)
const JsonViewer = ({ data }) => {
  const [collapsed, setCollapsed] = useState({});
  const [copied, setCopied] = useState(false);
  const toggleCollapse = (path) => setCollapsed((prev) => ({ ...prev, [path]: !prev[path] }));
  const handleCopy = () => {
    if (data === undefined || data === null) return;
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
        <CollapsibleSection label={`"${key}": [`} isOpen={!isCollapsed} onClick={() => toggleCollapse(path)}>
          {!isCollapsed && value.map((item, idx) => <div key={idx} className="pl-4 border-l border-gray-200 text-gray-700 text-sm">{renderValue(idx, item, `${path}[${idx}]`)}</div>)}
          <div className="text-xs text-gray-500">]</div>
        </CollapsibleSection>
      );
    } else if (isObject) {
      const isCollapsed = collapsed[path];
      return (
        <CollapsibleSection label={`"${key}": {`} isOpen={!isCollapsed} onClick={() => toggleCollapse(path)}>
          {!isCollapsed && Object.entries(value).map(([subKey, subVal]) => <div key={subKey} className="pl-4 border-l border-gray-200 text-gray-700 text-sm">{renderValue(subKey, subVal, `${path}.${subKey}`)}</div>)}
          <div className="text-xs text-gray-500">{"}"}</div>
        </CollapsibleSection>
      );
    } else {
      return <div className="pl-4 text-sm text-gray-800"><span className="text-gray-700">"{key}": </span><span>{JSON.stringify(value)}</span></div>;
    }
  };
  if (data === undefined || data === null) return <div className="p-4 font-mono text-sm mt-2 group">No data to display.</div>;
  return (
    <div className="relative p-4 font-mono text-sm mt-2 group">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center z-10" onClick={handleCopy}>
        <Copy size={14} className="text-gray-400 hover:text-black" />{copied && <span className="ml-1 text-xs text-green-600">Copied!</span>}
      </div>
      <div>
        <span className="cursor-pointer select-none text-gray-800 text-sm" onClick={() => toggleCollapse("__root")}>{collapsed["__root"] ? "▶ {" : "▼ {"}</span>
        {!collapsed["__root"] && <div className="pl-4">{Object.entries(data).map(([key, val]) => <div key={key}>{renderValue(key, val, key)}</div>)}</div>}
        <div className="text-sm">{"}"}</div>
      </div>
    </div>
  );
};


const TabsContent = ({
  adminDropdownActiveTab, // RENAMED from activeTab: UI state - which admin dropdown is targeted
  isAdminDropdownOpen,    // RENAMED from isOpen: UI state - is any admin dropdown open
  toggleAdminDropdown,    // RENAMED from toggleDropdown: Function from MainContent

  sqlQuery,
  queryResult,
  hasProcessed,
  language = "english",
  decomposerJson, // Prop from MainContent
  suggestedVisualization,
  insights,
  insightsLoading,
  rows,
  columns,
}) => {
  const [tabData, setTabData] = useState(null); // Agent-specific data fetched by this component
  const { t } = useTranslation();
  const { role } = useContext(AppContext);

  useEffect(() => {
    const fetchTabDataForAdmin = async () => {
      // Fetch only if an admin dropdown is targeted, processed, and user is admin
      if (!hasProcessed || role !== 'admin' || !adminDropdownActiveTab) {
        setTabData(null);
        return;
      }
      setTabData(null); // Clear previous agent data

      let url = "";
      let isDatabaseExecution = false;

      // Determine URL based on which admin dropdown is active (adminDropdownActiveTab)
      if (adminDropdownActiveTab === "Schema Loader") url = "http://localhost:8000/schema";
      else if (adminDropdownActiveTab === "Selector Agent") url = "http://localhost:8000/selector-agent";
      else if (adminDropdownActiveTab === "Decomposer Agent") url = "http://localhost:8000/decomposer-agent";
      else if (adminDropdownActiveTab === "Refiner Agent") url = "http://localhost:8000/refiner-agent";
      else if (adminDropdownActiveTab === "Database Execution") isDatabaseExecution = true;
      else if (adminDropdownActiveTab === "Visualization Agent") url = "http://localhost:8000/visualization-agent";

      if (!url && !isDatabaseExecution) {
        return; // No relevant admin tab selected for data fetching by TabsContent
      }

      try {
        if (isDatabaseExecution) {
          const dataInsightsUrl = language === "ar" ? "http://127.0.0.1:8000/data-insights/arabic" : "http://127.0.0.1:8000/data-insights/english";
          const [execRes, insightsRes] = await Promise.all([
            fetch("http://localhost:8000/database-execution"),
            fetch(dataInsightsUrl),
          ]);
          if (!execRes.ok || !insightsRes.ok) throw new Error("Failed to fetch DB execution or insights.");
          const execData = await execRes.json();
          const insightsData = await insightsRes.json();
          setTabData({ ...execData, data_insights: insightsData.data_insights, agent: adminDropdownActiveTab });
        } else if (url) {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`API Error for ${adminDropdownActiveTab}: ${response.status}`);
          const data = await response.json();
          setTabData({ ...data, agent: adminDropdownActiveTab });
        }
      } catch (error) {
        console.error(`Fetch error for ${adminDropdownActiveTab}:`, error);
        setTabData({ status: "Error", details: error.message, agent: adminDropdownActiveTab, time_taken: 0 });
      }
    };

    fetchTabDataForAdmin();
  }, [adminDropdownActiveTab, language, hasProcessed, role]); // Effect dependencies

  const CopyButton = ({ textToCopy }) => {
    const [copied, setCopiedState] = useState(false);
    const handleCopy = () => {
      if (textToCopy === undefined || textToCopy === null) return;
      navigator.clipboard.writeText(typeof textToCopy === "string" ? textToCopy : JSON.stringify(textToCopy, null, 2));
      setCopiedState(true); setTimeout(() => setCopiedState(false), 1500);
    };
    return (
      <button onClick={handleCopy} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-200 transition-colors z-10" title="Copy to clipboard">
        <FiCopy size={14} />{copied && <span className="ml-1 text-xs text-green-600 absolute -top-5 right-0 bg-white p-1 rounded shadow">Copied!</span>}
      </button>
    );
  };

  const MarkdownTable = ({ markdown }) => {
    if (!markdown || typeof markdown !== "string") return <p className="text-sm text-gray-600 mt-2">No table data.</p>;
    const lines = markdown.split("\n").filter(line => line.includes("|"));
    if (lines.length < 2) return <p className="text-sm text-gray-600 mt-2">No valid table data.</p>;
    const headers = lines[0].split("|").map(cell => cell.trim()).filter(Boolean);
    const dataLines = lines.slice(1).filter(line => !line.match(/^(\|\s*-+\s*)+\|?$/));
    const rowsData = dataLines.map(line => line.split("|").map(cell => cell.trim()).filter(Boolean));
    if (headers.length === 0 && rowsData.length === 0) return <p className="text-sm text-gray-600 mt-2">Empty table.</p>;
    return (
      <div className="overflow-x-auto mt-2 w-full"><table className="table-auto border border-collapse border-gray-300 w-full text-sm">
        <thead><tr className="bg-gray-100">{headers.map((h, i) => <th key={i} className="border border-gray-300 px-3 py-2 text-left font-medium text-gray-700">{h}</th>)}</tr></thead>
        <tbody>{rowsData.map((r, idx) => <tr key={idx} className="hover:bg-gray-50">{r.map((c, j) => <td key={j} className="border border-gray-300 px-3 py-2 text-gray-700">{c}</td>)}{Array(Math.max(0, headers.length - r.length)).fill(null).map((_, k) => <td key={`e-${idx}-${k}`} className="border border-gray-300 px-3 py-2"></td>)}</tr>)}</tbody>
      </table></div>
    );
  };

  const loadingMessage = (messageKey = "loading") => <div className="mt-6 text-gray-800 p-4">{t(messageKey)}...</div>;

  // Loading state for admin agent tabs (data fetched by THIS component)
  if (role === 'admin' && isAdminDropdownOpen && adminDropdownActiveTab && !tabData && hasProcessed) {
      if (adminDropdownActiveTab === "Visualization Agent") return loadingMessage("loadingVisualizationAgentData");
      return loadingMessage();
  }


  const lineColorAndMarker = '#E6E0D9'; const textColor = 'text-gray-800';

  const renderAdminAgentContent = (agentName, contentRenderer) => {
    // Display if its dropdown is open AND data for this agent has been fetched by TabsContent
    if (!(isAdminDropdownOpen && adminDropdownActiveTab === agentName && tabData && tabData.agent === agentName)) return null;
    
    const markerPositions = {"Schema Loader": '12.5%', "Selector Agent": '37.5%', "Decomposer Agent": '62.5%', "Refiner Agent": '87.5%', "Database Execution": '50%', "Visualization Agent": '50%' }; // For the timeline marker
    return (
      <div className="w-full mt-4">
        <div className="rounded-lg shadow-md p-6 relative w-full bg-white"> {/* Added bg-white for content box */}
          <div className="h-[2px] w-full absolute top-6 left-0" style={{ backgroundColor: lineColorAndMarker }} />
          <div className={`absolute transform -translate-x-1/2`} style={{ top: '17px', left: markerPositions[agentName] || '10%', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: `7px solid ${lineColorAndMarker}`}}/>
          {contentRenderer(tabData)}
        </div>
      </div>
    );
  };
  
  const adminPipelineButtonsTop = [
    { name: "Schema Loader", id: "Schema Loader" }, { name: "Selector Agent", id: "Selector Agent" },
    { name: "Decomposer Agent", id: "Decomposer Agent" }, { name: "Refiner Agent", id: "Refiner Agent" },
  ];
  const adminPipelineButtonBottom = { name: "DB Execution", id: "Database Execution" };

  const AdminSectionItem = ({ title, children, isVisible = true, titleColor, titleKey }) => {
    if (!isVisible) return null;
    const displayTitle = titleKey ? t(titleKey) : title;
    return (
        <div className="pt-3 mb-4"> 
            <div className="flex items-start">
                <span className={`mr-2 text-2xl ${textColor} leading-none ${!displayTitle ? 'invisible' : ''}`}>•</span>
                <div className="flex-1 min-w-0"> {/* min-w-0 helps flex children behave */}
                    {displayTitle && <h3 className={`text-base font-semibold ${textColor}`} style={titleColor ? {color: titleColor} : {}}>{displayTitle}</h3>}
                    <div className={displayTitle ? "mt-1" : ""}>{children}</div>
                </div>
            </div>
        </div>
    );
  };
  
  const IndentedContent = ({ children, className = "", requireScroll = false, maxHeight = "400px" }) => (
    // MODIFIED: Removed "overflow-hidden" when not requireScroll
    <div className={`ml-2 mt-1 ${className} w-full ${requireScroll ? `overflow-y-auto` : ""}`} 
         style={requireScroll ? {maxHeight: maxHeight} : {}}>
        {children}
    </div>
  );


  return (
    <div className="mt-6 text-gray-800">
      {/* Admin controls are only rendered if role is admin AND hasProcessed is true */}
      {role === "admin" && hasProcessed && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0' }}><FaUsers style={{ fontSize: '24px', color: '#d4cfc6' }} /><h2 style={{ margin: '0 10px', fontWeight: 'bold', color: '#333' }}>Processing Pipeline</h2><hr style={{ flex: 1, borderTop: '1px solid #333', margin: '0' }} /></div>
          {/* Row 1 of buttons */}
          <div className="flex flex-wrap gap-2 mb-1">
            {adminPipelineButtonsTop.map(btn => (
                <div key={btn.id} className="w-full sm:w-auto" style={{flexGrow: 1, flexBasis: '180px', minWidth: '170px' }}>
                    <button className="custom-button w-full" onClick={() => toggleAdminDropdown(btn.id)}>
                        {btn.name} {(tabData && tabData.agent === btn.id && isAdminDropdownOpen && adminDropdownActiveTab === btn.id) && <b>({Number(tabData.time_taken).toFixed(2)}s)</b>}
                    </button>
                </div>
            ))}
          </div>
          {/* Row 2 for DB Execution button */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="w-full sm:w-auto mt-2" style={{flexBasis: '180px', minWidth: '220px' }}>
                <button className="custom-button w-full" onClick={() => toggleAdminDropdown(adminPipelineButtonBottom.id)}>
                    {adminPipelineButtonBottom.name} {(tabData && tabData.agent === adminPipelineButtonBottom.id && isAdminDropdownOpen && adminDropdownActiveTab === adminPipelineButtonBottom.id) && <b>({Number(tabData.time_taken).toFixed(2)}s)</b>}
                </button>
            </div>
          </div>

          {renderAdminAgentContent("Schema Loader", (data) => (<>
              <AdminSectionItem titleKey="status"><span className={`text-base ${textColor}`}>{data.status}</span></AdminSectionItem>
              <AdminSectionItem titleKey="details"><span className={`text-base ${textColor}`}>{typeof data.details === "object" ? JSON.stringify(data.details) : data.details}</span></AdminSectionItem>
              <AdminSectionItem titleKey="schemaContent" titleColor="#b58932" isVisible={!!data.schema_content}>
                  <IndentedContent requireScroll maxHeight="300px">
                      {/* ADDED overflow-x-auto */}
                      <div className="relative bg-gray-50 text-sm text-gray-900 rounded-md p-4 shadow mt-0 overflow-x-auto"><pre className="whitespace-pre-wrap text-xs leading-relaxed">{data.schema_content}</pre><CopyButton textToCopy={data.schema_content} /></div>
                  </IndentedContent>
              </AdminSectionItem>
          </>))}
          {renderAdminAgentContent("Selector Agent", (data) => (<>
              <AdminSectionItem titleKey="status"><span className={`text-base ${textColor}`}>{data.status}</span></AdminSectionItem>
              <AdminSectionItem titleKey="details">
                  {/* This div ALREADY had overflow-auto via className, check if it's enough */}
                  <div className={`text-base ${textColor} flex-1 max-h-96 overflow-auto`}>{(() => { if (data.details) { if (typeof data.details.explanation === "string" && data.details.explanation.trim() !== "") return <span className="text-gray-700">{data.details.explanation}</span>; if (typeof data.details === "object" && data.details !== null) return <JsonViewer data={data.details} />; if (typeof data.details === "string") return <span className="text-gray-700">{data.details}</span>; return <span className="text-gray-500 italic">{t("notAvailable")}</span>; } return <span className="text-gray-500 italic">{t("noDetailsAvailable")}.</span>;})()}</div>
              </AdminSectionItem>
          </>))}
          {renderAdminAgentContent("Decomposer Agent", (data) => (<>
              <AdminSectionItem titleKey="status"><span className={`text-base ${textColor}`}>{data.status}</span></AdminSectionItem>
              <AdminSectionItem titleKey="details">
                  {/* MODIFIED to overflow-auto for potential JsonViewer width */}
                  <div className={`text-base ${textColor} flex-1 max-h-96 overflow-auto`}>
                      {(typeof data.details === "object" && data.details !== null) ? <JsonViewer data={data.details} /> : <p className="whitespace-pre-wrap">{typeof data.details === 'string' ? data.details : JSON.stringify(data.details)}</p>}
                      {/* Display decomposerJson prop if available */}
                      {decomposerJson && (<><div className="mt-4 font-semibold">🧠 {t("Decomposer JSON (Prop)")}</div><JsonViewer data={decomposerJson} /></>)}
                  </div>
              </AdminSectionItem>
          </>))}
          {renderAdminAgentContent("Refiner Agent", (data) => (<>
              <AdminSectionItem titleKey="status"><span className={`text-base ${textColor}`}>{data.status}</span></AdminSectionItem>
              <AdminSectionItem titleKey="details">
                  <IndentedContent> {/* IndentedContent no longer overflow-hidden by default */}
                      {/* ADDED overflow-x-auto */}
                      <div className="relative bg-gray-100 p-4 rounded-lg border border-gray-300 font-mono text-sm whitespace-pre-wrap text-gray-800 w-full overflow-x-auto">{typeof data.details === "string" ? data.details : <pre>{JSON.stringify(data.details, null, 2)}</pre>}<CopyButton textToCopy={data.details} /></div>
                  </IndentedContent>
              </AdminSectionItem>
              <AdminSectionItem titleKey="Generated SQL Query" titleColor="#b58932" isVisible={!!sqlQuery}>
                  <IndentedContent requireScroll>
                      {/* ADDED overflow-x-auto */}
                      <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow w-full overflow-x-auto"><pre className="whitespace-pre-wrap text-base leading-relaxed">{sqlQuery}</pre><CopyButton textToCopy={sqlQuery} /></div>
                  </IndentedContent>
              </AdminSectionItem>
          </>))}
          {renderAdminAgentContent("Database Execution", (data) => (<>
              <AdminSectionItem titleKey="status"><span className={`text-base ${textColor}`}>{data.status}</span></AdminSectionItem>
              <AdminSectionItem titleKey="details"><span className={`text-base ${textColor} mt-0.5 whitespace-pre-wrap`}>{typeof data.details === "object" ? JSON.stringify(data.details, null, 2) : data.details}</span></AdminSectionItem>
              <AdminSectionItem title="Executed SQL:" isVisible={!!sqlQuery}>
                  <IndentedContent requireScroll>
                      {/* ADDED overflow-x-auto */}
                      <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow w-full overflow-x-auto"><pre className="whitespace-pre-wrap text-base leading-relaxed">{sqlQuery}</pre><CopyButton textToCopy={sqlQuery} /></div>
                  </IndentedContent>
              </AdminSectionItem>
              <AdminSectionItem title={`📊 ${t("Data Insights")}`} isVisible={!!data.data_insights}><IndentedContent><MarkdownTable markdown={data.data_insights} /></IndentedContent></AdminSectionItem>
              <AdminSectionItem titleKey="Result" isVisible={!!(queryResult && queryResult.length > 0)}>
                  <IndentedContent requireScroll maxHeight="500px">
                      <ResultTable data={queryResult} />
                  </IndentedContent>
              </AdminSectionItem>
          </>))}
        </>
      )}

      {/* Visualization / Query Output Section */}
      <div className="pt-5 w-full">
        <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0' }}>
          <FaUsers style={{ fontSize: '24px', color: '#d4cfc6' }} />
          <h2 style={{ margin: '0 10px', fontWeight: 'bold', color: '#333' }}>
            {role === 'user' ? t("Query Output") : t("Visualization")}
          </h2>
          <hr style={{ flex: 1, borderTop: '1px solid #333', margin: '0' }} />
        </div>

        {/* Admin's button for Visualization Agent - only shown if processed */}
        {role === "admin" && hasProcessed && (
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="w-full sm:w-auto" style={{flexBasis: '180px', minWidth: '220px' }}>
              <button className="custom-button w-full" onClick={() => toggleAdminDropdown('Visualization Agent')}>
                Visualization Agent
                {(tabData && tabData.agent === 'Visualization Agent' && isAdminDropdownOpen && adminDropdownActiveTab === 'Visualization Agent') && <b>({Number(tabData.time_taken).toFixed(2)}s)</b>}
              </button>
            </div>
            {/* Content for Admin's "Visualization Agent" dropdown */}
            {isAdminDropdownOpen && adminDropdownActiveTab === "Visualization Agent" && (
              <div className="w-full mt-4">
                <div className="rounded-lg shadow-md p-6 relative w-full bg-white"> {/* Added bg-white */}
                  <div className="h-[2px] w-full absolute top-6 left-0" style={{ backgroundColor: lineColorAndMarker }} />
                  <div className="absolute left-[50%] transform -translate-x-1/2" style={{top: '17px', width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: `7px solid ${lineColorAndMarker}` }}/>
                  {tabData && tabData.agent === "Visualization Agent" && (<>
                      <AdminSectionItem titleKey="status"><span className={`text-base ${textColor}`}>{tabData.status}</span></AdminSectionItem>
                      <AdminSectionItem titleKey="details"><span className={`text-base ${textColor} whitespace-pre-wrap`}>{typeof tabData.details === "object" ? JSON.stringify(tabData.details, null, 2) : tabData.details || "Details unavailable."}</span></AdminSectionItem>
                  </>)}
                  <AdminSectionItem titleKey="Suggested Visualization Type" isVisible={!!suggestedVisualization}><IndentedContent><span className="text-gray-700">{suggestedVisualization}</span></IndentedContent></AdminSectionItem>
                  <AdminSectionItem titleKey="Generated SQL Query" titleColor="#b58932" isVisible={!!sqlQuery}>
                    <IndentedContent requireScroll>
                        {/* ADDED overflow-x-auto */}
                        <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow w-full overflow-x-auto"><pre className="whitespace-pre-wrap text-base leading-relaxed">{sqlQuery}</pre><CopyButton textToCopy={sqlQuery} /></div>
                    </IndentedContent>
                  </AdminSectionItem>
                  <AdminSectionItem titleKey="Query Results & Summary" isVisible={!!((queryResult && queryResult.length > 0) || insights)}>
                      <IndentedContent> 
                          <QueryResults rows={rows} columns={columns} data={queryResult} insights={insights} insightsLoading={insightsLoading}/>
                          <div className="mt-4"><ExportResults /></div>
                      </IndentedContent>
                  </AdminSectionItem>
                </div>
              </div>
            )}
          </div>
        )}

        {/* USER's view of Query Output - MODIFIED Condition */}
        {role === "user" && (
            hasProcessed ? (
                ((queryResult && queryResult.length > 0) || insights) ? (
                <div className="mt-6 w-full bg-white p-6 rounded-lg shadow-md"> {/* Added container for consistency */}
                    <QueryResults rows={rows} columns={columns} data={queryResult} insights={insights} insightsLoading={insightsLoading}/>
                    <div className="mt-4"><ExportResults /></div>
                </div>
                ) : ( 
                loadingMessage(insightsLoading ? "loadingInsights" : "noVisualizationDataAvailable")
                )
            ) : ( 
                // Show if query hasn't been processed yet for the user, but an attempt was made via hasProcessed in MainContent
                // Or if hasProcessed is false, this section won't show based on MainContent's conditional rendering of TabsContent.
                // This specific message might appear if hasProcessed is true, but result/insights are delayed.
                loadingMessage("processingQueryPleaseWait") 
            )
        )}

        {/* Admin's view of Query Output if their Viz Agent dropdown is closed (fallback) */}
        {/* This shows query results directly under "Visualization" title if admin is on VizAgent tab but dropdown is closed */}
        {role === "admin" && adminDropdownActiveTab === "Visualization Agent" && !(isAdminDropdownOpen && adminDropdownActiveTab === "Visualization Agent") && (
            hasProcessed ? (
            ((queryResult && queryResult.length > 0) || insights) ? (
              <div className="mt-6 w-full bg-white p-6 rounded-lg shadow-md"> {/* Added container */}
                <QueryResults rows={rows} columns={columns} data={queryResult} insights={insights} insightsLoading={insightsLoading}/>
                <div className="mt-4"><ExportResults /></div>
              </div>
            ) : (
                loadingMessage(insightsLoading ? "loadingInsights" : "noVisualizationDataAvailable")
            )
            ) : null // if not processed, show nothing here as main loading message handles it
        )}
      </div>
    </div>
  );
};

export default TabsContent;