import React, { useState, useEffect, useContext } from "react";
import { FiLoader } from "react-icons/fi";
import TabsContent from "./TabsContent";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { AppContext } from "./context/AppContext";

const MainContent = ({
  query,
  setQuery,
  hasProcessed,
  setHasProcessed, // ✅ coming from App
  setQueryHistory,
  autoRun,
  setAutoRun,
  language = "english",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadedTabs, setLoadedTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("Schema Loader");
  const [currentStep, setCurrentStep] = useState("");
  const [queryResult, setQueryResult] = useState([]);
  const [sqlQuery, setSqlQuery] = useState("");
  const [suggestedVisualization, setSuggestedVisualization] = useState("");
  const { role } = useContext(AppContext);

  const [totalExecutionTime, setTotalExecutionTime] = useState(null);

  const { t, i18n } = useTranslation();
  const selectedLanguage = i18n.language;

  const [insights, setInsights] = useState("");
  const [insightsLoading, setInsightsLoading] = useState(false);

  useEffect(() => {
    if (autoRun && query.trim()) {
      handleProcess();

      setAutoRun(false);
    }
  }, [autoRun, query, setAutoRun, language, role]);

  const handleProcess = async () => {
    setHasProcessed(true);
    setIsLoading(true);
    setLoadedTabs([]);
    setActiveTab("");
    setCurrentStep("");
    setQueryResult([]);
    setHasProcessed(true);
    setTotalExecutionTime(null);
    setInsights("");
    setInsightsLoading(true);

    const headers = { "Content-Type": "application/json" };
    const payload = { query: query.trim() };

    try {
      // Send main query process request
      const response = await axios.post(
        "http://localhost:8000/query-process/english",
        payload,
        { headers }
      );
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
        executionTime: step.time_taken?.toFixed(2) || "N/A",
      }));

      setLoadedTabs(newTabs);
      if (newTabs.length > 0) {
        setActiveTab(newTabs[0].name);
      }

      // Add a small delay before fetching insights
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Fetch insights AFTER successful query-process
      try {
        const insightsResponse = await axios.get(
          "http://127.0.0.1:8000/summary-insights/english"
        );

        if (
          insightsResponse.status === 200 &&
          insightsResponse.data.summary_insights
        ) {
          setInsights(insightsResponse.data.summary_insights);
        } else {
          setInsights("⚠️ No insights returned.");
        }
      } catch (err) {
        console.error(
          "Error fetching insights:",
          err.response?.data || err.message
        );
        setInsights("Error loading insights.");
      }
    } catch (error) {
      console.error(
        "Error sending query to backend:",
        error.response?.data || error.message
      );
    } finally {
      setInsightsLoading(false);
      setIsLoading(false);
    }
  };

  const userTabs = loadedTabs.filter(
    (tab) => tab?.name === "Visualization Agent"
  );

  return (
    <div className="bg-white p-6 rounded-md shadow-md text-gray-800 border border-gray-200">
      <h1 className="text-3xl font-semibold mb-1" style={{ color: "#b58932" }}>
        {t("title")}
      </h1>
      <p className="text-sm text-gray-600 mb-4">{t("subtitle")}</p>

      <textarea
        className="w-full p-3 bg-gray-100 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("placeholder")}
        rows={4}
      />

      <div className="flex items-center gap-4">
        {/* <button
          onClick={handleProcess}
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-white flex items-center gap-2 transition ${
            isLoading ? 'bg-orange-300' : 'bg-orange-500 hover:bg-orange-600'
          }`}
        >
          {isLoading && <FiLoader className="animate-spin" />}
          {isLoading ? t('processing') : t('processButton')}
        </button> */}
        <button
          onClick={handleProcess}
          disabled={isLoading || query.trim() === ""} // Disable if loading or input is empty
          className={`px-4 py-2 rounded-md text-white flex items-center gap-2 transition ${
            isLoading || query.trim() === ""
              ? "bg-orange-300 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {isLoading && <FiLoader className="animate-spin" />}
          {isLoading ? t("processing") : t("processButton")}
        </button>
        <button
          onClick={() => {
            if (hasProcessed && query.trim()) {
              const existingHistory = JSON.parse(
                localStorage.getItem("queryHistory") || "[]"
              );
              const updatedHistory = [...existingHistory, query.trim()];
              localStorage.setItem(
                "queryHistory",
                JSON.stringify(updatedHistory)
              );
              setQueryHistory(updatedHistory);
            }

            setQuery("");
            setQueryResult([]);
            setLoadedTabs([]);
            setActiveTab(t("Schema Loader"));

            setTotalExecutionTime(null);
            setHasProcessed(false);
            setInsights("");
            setInsightsLoading(false);
          }}
          className="px-4 py-2 border border-orange-500 text-orange-500 hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600 rounded-md transition"
        >
          {t("clearButton")}
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
          {/* <h2 className="text-xl font-semibold mb-4" style={{ color: '#b58932' }}>
            {t('pipelineTitle')}
          </h2> */}

          {role === "admin" && (
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: "#b58932" }}
            >
              {t("pipelineTitle")}
            </h2>
          )}
          {role === "admin" && totalExecutionTime && (
            <p className="text-sm text-gray-600 mb-4">
              {t("executionTime")}: {totalExecutionTime} sec
            </p>
          )}
          <div className="relative border-b border-gray-300 flex space-x-6 pb-2">
            {role === "admin" &&
              loadedTabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  disabled={!tab.executionTime}
                  className={`text-sm font-medium pb-2 transition border-b-2 ${
                    activeTab === tab.name
                      ? "border-orange-500 text-orange-600"
                      : "text-gray-600 hover:text-orange-500 border-transparent hover:border-orange-300"
                  } ${
                    !tab.executionTime ? "text-gray-400 cursor-not-allowed" : ""
                  }`}
                >
                  {tab.name} ({tab.executionTime}s)
                </button>
              ))}
            {role === "user" &&
              userTabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  disabled={!tab.executionTime}
                  className={`text-sm font-medium pb-2 transition border-b-2 ${
                    activeTab === tab.name
                      ? "border-orange-500 text-orange-600"
                      : "text-gray-600 hover:text-orange-500 border-transparent hover:border-orange-300"
                  } ${
                    !tab.executionTime ? "text-gray-400 cursor-not-allowed" : ""
                  }`}
                >
                  {tab.name} ({tab.executionTime}s)
                </button>
              ))}
          </div>

          <TabsContent
            activeTab={activeTab}
            sqlQuery={sqlQuery}
            language={selectedLanguage}
            suggestedVisualization={suggestedVisualization}
            queryResult={queryResult}
            insights={insights}
            insightsLoading={insightsLoading}
            rows={queryResult?.length || 0}
            columns={
              queryResult && queryResult[0]
                ? Object.keys(queryResult[0]).length
                : 0
            }
            hasProcessed={hasProcessed} // ✅ Add this line
          />
        </div>
      )}
    </div>
  );
};

export default MainContent;
