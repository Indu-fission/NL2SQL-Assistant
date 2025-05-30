import React, { useEffect, useState, useContext } from "react";
import { Copy } from "lucide-react";
import { FiCopy } from "react-icons/fi";
import QueryResults from "./QueryResults";
import ExportResults from "./ExportResults";
import ResultTable from "./ResultTable";
import { useTranslation } from "react-i18next";
import { AppContext } from "./context/AppContext";
import { FaBrain, FaChartArea, FaChartBar, FaDatabase, FaProjectDiagram, FaSitemap, FaUser, FaUserCog, FaUsers, FaUserTie } from 'react-icons/fa';
import './MainContent.css';

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

const TabsContent = ({
  adminDropdownActiveTab,
  isAdminDropdownOpen,
  toggleAdminDropdown,
  sqlQuery,
  queryResult,
  hasProcessed,
  hasSuccessfulResponse,
  language = "english",
  decomposerJson,
  suggestedVisualization,
  insights,
  insightsLoading,
  rows,
  columns,
}) => {
  const [tabData, setTabData] = useState(null);
  const { t } = useTranslation();
  const { role } = useContext(AppContext);

  // Define loadingMessage inside the component to access t
  const loadingMessage = (messageKey = "loading") => (
    <div className="mt-6 text-gray-800 p-4">{t(messageKey)}...</div>
  );

  useEffect(() => {
    const fetchTabDataForAdmin = async () => {
      if (!hasProcessed || !hasSuccessfulResponse || role !== 'admin' || !adminDropdownActiveTab) {
        setTabData(null);
        return;
      }
      setTabData(null);

      let url = "";
      let isDatabaseExecution = false;

      if (adminDropdownActiveTab === "Schema Loader") url = "http://localhost:8000/schema";
      else if (adminDropdownActiveTab === "Selector Agent") url = "http://localhost:8000/selector-agent";
      else if (adminDropdownActiveTab === "Decomposer Agent") url = "http://localhost:8000/decomposer-agent";
      else if (adminDropdownActiveTab === "Refiner Agent") url = "http://localhost:8000/refiner-agent";
      else if (adminDropdownActiveTab === "Database Execution") isDatabaseExecution = true;
      else if (adminDropdownActiveTab === "Visualization Agent") url = "http://localhost:8000/visualization-agent";

      if (!url && !isDatabaseExecution) {
        return;
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
  }, [adminDropdownActiveTab, language, hasProcessed, hasSuccessfulResponse, role]);

  const lineColorAndMarker = '#8D6E63';
  const textColor = 'text-gray-800';

  const renderAdminAgentContent = (agentName, contentRenderer) => {
    if (!(isAdminDropdownOpen && adminDropdownActiveTab === agentName && tabData && tabData.agent === agentName)) return null;

    const markerPositions = {
      "Schema Loader": '12.5%',
      "Selector Agent": '37.5%',
      "Decomposer Agent": '62.5%',
      "Refiner Agent": '87.5%',
      "Database Execution": '15%',
      "Visualization Agent": '20%'
    };
    return (
      <div className="w-full mt-4">
        <div
          className="rounded-lg shadow-md p-6 relative w-full"
          style={{ backgroundColor: '#f5f5f5' }}>
          <div
            className="h-[2px] w-full absolute top-0 left-0"
            style={{ backgroundColor: lineColorAndMarker }}
          />
          <div
            className="absolute transform -translate-x-1/2"
            style={{
              top: '-6px',
              left: markerPositions[agentName] || '10%',
              width: 0,
              height: 0,
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderBottom: `7px solid ${lineColorAndMarker}`,
            }}
          />
          {contentRenderer(tabData)}
        </div>
      </div>
    );
  };

  const adminPipelineButtonsTop = [
    { name: "Schema Loader", id: "Schema Loader" },
    { name: "Selector Agent", id: "Selector Agent" },
    { name: "Decomposer Agent", id: "Decomposer Agent" },
    { name: "Refiner Agent", id: "Refiner Agent" },
  ];
  const adminPipelineButtonBottom = { name: "DB Execution", id: "Database Execution" };

  const AdminSectionItem = ({ title, children, isVisible = true, titleColor, titleKey }) => {
    if (!isVisible) return null;
    const displayTitle = titleKey ? t(titleKey) : title;
    return (
      <div className="pt-3 mb-4">
        <div className="flex items-start">
          <span className={`mr-2 text-2xl ${textColor} leading-none ${!displayTitle ? 'invisible' : ''}`}>•</span>
          <div className="flex-1 min-w-0">
            {displayTitle && <h3 className={`text-base font-semibold ${textColor}`} style={titleColor ? { color: titleColor } : {}}>{displayTitle}</h3>}
            <div className={displayTitle ? "mt-1" : ""}>{children}</div>
          </div>
        </div>
      </div>
    );
  };

  const IndentedContent = ({ children, className = "", requireScroll = false, maxHeight = "400px" }) => (
    <div className={`ml-2 mt-1 ${className} w-full ${requireScroll ? `overflow-y-auto` : ""}`}
      style={requireScroll ? { maxHeight: maxHeight } : {}}>
      {children}
    </div>
  );

  return (
    <div className="mt-6 text-gray-800">
      {role === "admin" && hasSuccessfulResponse && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0' }}>
            <FaProjectDiagram style={{ fontSize: '40px', color: '#8D6E63' }} />
            <h2 style={{ margin: '0 10px', fontWeight: 'bold', color: '#333', fontSize: '20px' }}>{t('pipelineTitle')}</h2>
            <hr style={{ flex: 1, borderTop: '1px solid #333', margin: '0' }} />
          </div>
          <div className="flex flex-wrap gap-2 mb-1 pt-2">
            {adminPipelineButtonsTop.map(btn => (
              <div
                key={btn.id}
                className="w-full sm:w-auto"
                style={{ flexGrow: 1, flexBasis: '180px', minWidth: '170px' }}
              >
                <button
                  className={`custom-button w-full ${tabData &&
                      tabData.agent === btn.id &&
                      isAdminDropdownOpen &&
                      adminDropdownActiveTab === btn.id
                      ? 'active-dropdown-button'
                      : ''
                    }`}
                  onClick={() => toggleAdminDropdown(btn.id)}
                >
                  {btn.name === 'Schema Loader' && (
                    <FaSitemap className="inline ml-1 align-text-bottom custom-icon" />
                  )}
                  {btn.name === 'Selector Agent' && (
                    <FaUserTie className="inline ml-1 align-text-bottom custom-icon" />
                  )}
                  {btn.name === 'Decomposer Agent' && (
                    <FaBrain className="inline ml-1 align-text-bottom custom-icon" />
                  )}
                  {btn.name === 'Refiner Agent' && (
                    <FaUserCog className="inline ml-1 align-text-bottom custom-icon" />
                  )}
                  {t(`tabs.${btn.name}`)}
                  {tabData &&
                    tabData.agent === btn.id &&
                    isAdminDropdownOpen &&
                    adminDropdownActiveTab === btn.id && (
                      <b>({Number(tabData.time_taken).toFixed(2)}s)</b>
                    )}
                </button>
              </div>
            ))}
          </div>
          {renderAdminAgentContent("Schema Loader", (data) => (
            <>
              <AdminSectionItem titleKey="status"><span className={`text-base ${textColor}`}>{data.status}</span></AdminSectionItem>
              <AdminSectionItem titleKey="details"><span className={`text-base ${textColor}`}>{typeof data.details === "object" ? JSON.stringify(data.details) : data.details}</span></AdminSectionItem>
              <AdminSectionItem titleKey="schemaContent" titleColor="#b58932" isVisible={!!data.schema_content}>
                <IndentedContent requireScroll maxHeight="300px">
                  <div className="relative bg-gray-50 text-sm text-gray-900 rounded-md p-4 shadow mt-0 overflow-x-auto"><pre className="whitespace-pre-wrap text-xs leading-relaxed">{data.schema_content}</pre><CopyButton textToCopy={data.schema_content} /></div>
                </IndentedContent>
              </AdminSectionItem>
            </>
          ))}
          {renderAdminAgentContent("Selector Agent", (data) => (
            <>
              <AdminSectionItem titleKey="status"><span className={`text-base ${textColor}`}>{data.status}</span></AdminSectionItem>
              <AdminSectionItem titleKey="details">
                <div className={`text-base ${textColor} flex-1 max-h-96 overflow-auto`}>
                  {(() => {
                    if (data.details) {
                      if (typeof data.details.explanation === "string" && data.details.explanation.trim() !== "") return <span className="text-gray-700">{data.details.explanation}</span>;
                      if (typeof data.details === "object" && data.details !== null) return <JsonViewer data={data.details} />;
                      if (typeof data.details === "string") return <span className="text-gray-700">{data.details}</span>;
                      return <span className="text-gray-500 italic">{t("notAvailable")}</span>;
                    }
                    return <span className="text-gray-500 italic">{t("noDetailsAvailable")}.</span>;
                  })()}
                </div>
              </AdminSectionItem>
            </>
          ))}
          {renderAdminAgentContent("Decomposer Agent", (data) => (
            <>
              <AdminSectionItem titleKey="status"><span className={`text-base ${textColor}`}>{data.status}</span></AdminSectionItem>
              <AdminSectionItem titleKey="details">
                <div className={`text-base ${textColor} flex-1 max-h-96 overflow-auto`}>
                  {(typeof data.details === "object" && data.details !== null) ? <JsonViewer data={data.details} /> : <p className="whitespace-pre-wrap">{typeof data.details === 'string' ? data.details : JSON.stringify(data.details)}</p>}
                  {decomposerJson && (<><div className="mt-4 font-semibold">🧠 {t("Decomposer JSON (Prop)")}</div><JsonViewer data={decomposerJson} /></>)}
                </div>
              </AdminSectionItem>
            </>
          ))}
          {renderAdminAgentContent("Refiner Agent", (data) => (
            <>
              <AdminSectionItem titleKey="status"><span className={`text-base ${textColor}`}>{data.status}</span></AdminSectionItem>
              <AdminSectionItem titleKey="details">
                <IndentedContent>
                  <div className="relative bg-gray-100 p-4 rounded-lg border border-gray-300 font-mono text-sm whitespace-pre-wrap text-gray-800 w-full overflow-x-auto">{typeof data.details === "string" ? data.details : <pre>{JSON.stringify(data.details, null, 2)}</pre>}<CopyButton textToCopy={data.details} /></div>
                </IndentedContent>
              </AdminSectionItem>
              <AdminSectionItem titleKey="Generated SQL Query" titleColor="#b58932" isVisible={!!sqlQuery}>
                <IndentedContent requireScroll>
                  <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow w-full overflow-x-auto"><pre className="whitespace-pre-wrap text-base leading-relaxed">{sqlQuery}</pre><CopyButton textToCopy={sqlQuery} /></div>
                </IndentedContent>
              </AdminSectionItem>
            </>
          ))}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="w-full sm:w-auto mt-2" style={{ flexBasis: '180px', minWidth: '240px' }}>
              <button
                className={`custom-button w-full ${tabData && tabData.agent === 'Database Execution' ? 'active-dropdown-button' : ''}`}
                onClick={() => toggleAdminDropdown('Database Execution')}
              >
                <FaDatabase className="inline ml-1 align-text-bottom custom-icon" />
                {t(`tabs.Database Execution`)}
                {tabData &&
                  tabData.agent === 'Database Execution' &&
                  isAdminDropdownOpen &&
                  adminDropdownActiveTab === 'Database Execution' && (
                    <b>({Number(tabData.time_taken).toFixed(2)}s)</b>
                  )}
              </button>
            </div>
          </div>
          {renderAdminAgentContent("Database Execution", (data) => (
            <>
              <AdminSectionItem titleKey="status"><span className={`text-base ${textColor}`}>{data.status}</span></AdminSectionItem>
              <AdminSectionItem titleKey="details"><span className={`text-base ${textColor} mt-0.5 whitespace-pre-wrap`}>{typeof data.details === "object" ? JSON.stringify(data.details, null, 2) : data.details}</span></AdminSectionItem>
              <AdminSectionItem title="Executed SQL:" isVisible={!!sqlQuery}>
                <IndentedContent requireScroll>
                  <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow w-full overflow-x-auto"><pre className="whitespace-pre-wrap text-base leading-relaxed">{sqlQuery}</pre><CopyButton textToCopy={sqlQuery} /></div>
                </IndentedContent>
              </AdminSectionItem>
              <AdminSectionItem title={`📊 ${t("Data Insights")}`} isVisible={!!data.data_insights}><IndentedContent><MarkdownTable markdown={data.data_insights} /></IndentedContent></AdminSectionItem>
              <AdminSectionItem titleKey="Result" isVisible={!!(queryResult && queryResult.length > 0)}>
                <IndentedContent requireScroll maxHeight="500px">
                  <ResultTable data={queryResult} />
                </IndentedContent>
              </AdminSectionItem>
            </>
          ))}
        </>
      )}
      <div className="pt-5 w-full">
        {hasSuccessfulResponse && (
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px 0' }}>
            <FaChartBar style={{ fontSize: '40px', color: '#8D6E63' }} />
            <h2 style={{ margin: '0 10px', fontWeight: 'bold', color: '#333', fontSize: '20px' }}>
              {role === 'user' ? t("output") : t("Visualization")}
            </h2>
            <hr style={{ flex: 1, borderTop: '1px solid #333', margin: '0' }} />
          </div>
        )}
        {role === "admin" && hasSuccessfulResponse && (
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="w-full sm:w-auto" style={{ flexBasis: '180px', minWidth: '240px' }}>
              <button
                className={`custom-button w-full ${tabData && tabData.agent === 'Visualization Agent' ? 'active-dropdown-button' : ''}`}
                onClick={() => toggleAdminDropdown('Visualization Agent')}
              >
                <FaChartArea className="inline ml-1 align-text-bottom custom-icon" />
                {t('tabs.Visualization Agent')}
                {tabData &&
                  tabData.agent === 'Visualization Agent' &&
                  isAdminDropdownOpen &&
                  adminDropdownActiveTab === 'Visualization Agent' && (
                    <b>({Number(tabData.time_taken).toFixed(2)}s)</b>
                  )}
              </button>
            </div>
            {isAdminDropdownOpen && adminDropdownActiveTab === "Visualization Agent" && (
              <div className="w-full mt-4 relative" style={{ backgroundColor: '#f5f5f5', paddingRight: '20px', paddingLeft: '15px' }}>
                <div
                  className="h-[2px] w-full absolute top-0 left-0"
                  style={{ backgroundColor: lineColorAndMarker }}
                />
                <div
                  className="absolute left-[15%] transform -translate-x-1/2"
                  style={{
                    top: '-6px',
                    width: 0,
                    height: 0,
                    borderLeft: '7px solid transparent',
                    borderRight: '7px solid transparent',
                    borderBottom: `7px solid ${lineColorAndMarker}`,
                  }}
                />
                <div className="p-3">
                  {tabData && tabData.agent === "Visualization Agent" && (
                    <>
                      <AdminSectionItem titleKey="status"><span className={`text-base ${textColor}`}>{tabData.status}</span></AdminSectionItem>
                      <AdminSectionItem titleKey="details"><span className={`text-base ${textColor} whitespace-pre-wrap`}>{typeof tabData.details === "object" ? JSON.stringify(tabData.details, null, 2) : tabData.details || "Details unavailable."}</span></AdminSectionItem>
                    </>
                  )}
                  <AdminSectionItem titleKey="Suggested Visualization Type" isVisible={!!suggestedVisualization}><IndentedContent><span className="text-gray-700">{suggestedVisualization}</span></IndentedContent></AdminSectionItem>
                  <AdminSectionItem titleKey="Generated SQL Query" titleColor="#b58932" isVisible={!!sqlQuery}>
                    <IndentedContent requireScroll>
                      <div className="relative bg-blue-50 text-sm text-gray-900 rounded-md p-4 shadow w-full overflow-x-auto"><pre className="whitespace-pre-wrap text-base leading-relaxed">{sqlQuery}</pre><CopyButton textToCopy={sqlQuery} /></div>
                    </IndentedContent>
                  </AdminSectionItem>
                  <AdminSectionItem titleKey="Query Results & Summary" isVisible={!!((queryResult && queryResult.length > 0) || insights)}>
                    <IndentedContent>
                      <QueryResults rows={rows} columns={columns} data={queryResult} insights={insights} insightsLoading={insightsLoading} />
                      <div className="mt-4"><ExportResults /></div>
                    </IndentedContent>
                  </AdminSectionItem>
                </div>
              </div>
            )}
          </div>
        )}
        {role === "user" && (
          hasSuccessfulResponse ? (
            ((queryResult && queryResult.length > 0) || insights) ? (
              <div className="mt-6 w-full bg-white p-6 rounded-lg shadow-md">
                <QueryResults rows={rows} columns={columns} data={queryResult} insights={insights} insightsLoading={insightsLoading} />
                <div className="mt-4"><ExportResults /></div>
              </div>
            ) : (
              loadingMessage(insightsLoading ? "loadingInsights" : "noVisualizationDataAvailable")
            )
          ) : (
            hasProcessed ? loadingMessage("processingQueryPleaseWait") : null
          )
        )}
        {role === "admin" && adminDropdownActiveTab === "Visualization Agent" && !(isAdminDropdownOpen && adminDropdownActiveTab === "Visualization Agent") && (
          hasSuccessfulResponse ? (
            ((queryResult && queryResult.length > 0) || insights) ? (
              <div className="mt-6 w-full bg-white p-6 rounded-lg shadow-md">
                <QueryResults rows={rows} columns={columns} data={queryResult} insights={insights} insightsLoading={insightsLoading} />
                <div className="mt-4"><ExportResults /></div>
              </div>
            ) : (
              loadingMessage(insightsLoading ? "loadingInsights" : "noVisualizationDataAvailable")
            )
          ) : null
        )}
      </div>
    </div>
  );
};

export default TabsContent;