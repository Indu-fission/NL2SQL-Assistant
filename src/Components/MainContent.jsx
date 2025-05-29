import React, { useState, useEffect, useContext } from "react"; 
import { FiLoader } from "react-icons/fi";
import TabsContent from "./TabsContent";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { AppContext } from "./context/AppContext";
import { CgSpinner } from "react-icons/cg";

const initialRoleSpecificProcessingState = {
  isLoading: false,
  loadedTabs: [],
  activeTab: "Schema Loader",
  currentStep: "",
  queryResult: [],
  sqlQuery: "",
  suggestedVisualization: "",
  totalExecutionTime: null,
  insights: "",
  insightsLoading: false,
  errorMessage: "",
  
};

const MainContent = ({
  query,
  setQuery,
  hasProcessed,
  setHasProcessed,
  setQueryHistory,
  autoRun,
  setAutoRun,
  language = "english",
}) => {
  const [queryResult, setQueryResult] = useState([]);
  const [queriesByRole, setQueriesByRole] = useState({
  admin: "",
  user: "",
});

  const { role } = useContext(AppContext);
  const { t, i18n } = useTranslation();
  const selectedLanguage = i18n.language;
 const [allRolesData, setAllRolesData] = useState({
    admin: {
      ...initialRoleSpecificProcessingState,
      activeTab: "Schema Loader",
    },
    user: {
      ...initialRoleSpecificProcessingState,
      activeTab: "Visualization Agent",
    },
  });
useEffect(() => {
  setQuery(queriesByRole[role] || "");
}, [role]);

  useEffect(() => {
    if (autoRun && query.trim()) {
      handleProcess();
      setAutoRun(false);
    }
  }, [autoRun, query, setAutoRun, language, role]);

  const handleSetActiveTab = (tabName) => {
    const currentRole = role;
    setAllRolesData((prev) => ({
      ...prev,
      [currentRole]: { ...prev[currentRole], activeTab: tabName },
    }));
  };

  // Save every query input to localStorage (valid or not)
  const handleProcess = async () => {
    setAllRolesData((prev) => ({
      ...prev,
      [role]: {
        ...initialRoleSpecificProcessingState,
        isLoading: true,
        insightsLoading: true,
        activeTab: role === "user" ? "Visualization Agent" : "Schema Loader",
        errorMessage: "", // Clear previous error message for this role
      },
    }));
    setHasProcessed(true); // Signal that processing has been attempted

    // Save the query regardless of validation/result here
    if (query.trim()) {
      const roleKey = role === "admin" ? "adminQueryHistory" : "userQueryHistory";
      const existingHistory = JSON.parse(localStorage.getItem(roleKey) || "[]");
      if (!existingHistory.includes(query.trim())) {
        const updatedHistory = [...existingHistory, query.trim()];
        localStorage.setItem(roleKey, JSON.stringify(updatedHistory));
        if (setQueryHistory && typeof setQueryHistory === "function") {
          setQueryHistory(updatedHistory);
        }
      }
    }

    const headers = { "Content-Type": "application/json" };
    const payload = { query: query.trim() };

    try {
      // Make the main API call
      const response = await axios.post(
        "http://localhost:8000/query-process/english", // Adjust URL if necessary
        payload,
        { headers }
      );

      if (response.status === 200) {
        const {
          result_data,
          total_time_seconds,
          processing_steps,
          sql_query,
          suggested_visualization,
          error: backendError,
        } = response.data;

        if (
          backendError &&
          backendError !== "null" &&
          String(backendError).trim() !== ""
        ) {
          setAllRolesData((prev) => ({
            ...prev,
            [role]: {
              ...prev[role],
              errorMessage: t("warning"),
              queryResult: [],
              loadedTabs: [],
              insights: "",
              sqlQuery: "",
              suggestedVisualization: "",
              totalExecutionTime: null,
              isLoading: false,
              insightsLoading: false,
            },
          }));
          return;
        }

        const newTabs = (processing_steps || []).map((step) => ({
          name: step.agent,
          executionTime: step.time_taken?.toFixed(2) || "N/A",
        }));

        setAllRolesData((prev) => ({
          ...prev,
          [role]: {
            ...prev[role],
            queryResult: result_data || [],
            totalExecutionTime: total_time_seconds
              ? total_time_seconds.toFixed(2)
              : null,
            sqlQuery: sql_query || "",
            suggestedVisualization: suggested_visualization || "",
            loadedTabs: newTabs,
            activeTab:
              newTabs.length > 0 ? newTabs[0].name : prev[role].activeTab,
            errorMessage: "",
          },
        }));

        // Fetch insights ONLY if the main process was successful
        await new Promise((resolve) => setTimeout(resolve, 500)); // Optional delay
        try {
          const insightsResponse = await axios.get(
            "http://127.0.0.1:8000/summary-insights/english"
          );
          setAllRolesData((prev) => ({
            ...prev,
            [role]: {
              ...prev[role],
              insights:
                insightsResponse.status === 200 &&
                insightsResponse.data.summary_insights
                  ? insightsResponse.data.summary_insights
                  : t("noInsightsReturned", "⚠️ No insights returned."),
            },
          }));
        } catch (insightsErr) {
          console.error("Error fetching insights:", insightsErr);
          setAllRolesData((prev) => ({
            ...prev,
            [role]: {
              ...prev[role],
              insights: t("errorLoadingInsights", "Error loading insights."),
            },
          }));
        }
      } else {
        console.error("Non-200 response from backend:", response.status);
        setAllRolesData((prev) => ({
          ...prev,
          [role]: {
            ...initialRoleSpecificProcessingState,
            activeTab:
              role === "user" ? "Visualization Agent" : "Schema Loader",
            isLoading: false,
            insightsLoading: false,
            errorMessage: t(
              "serverErrorWithStatus",
              `Server error: ${response.status}. Please try again.`,
              { status: response.status }
            ),
          },
        }));
        setHasProcessed(false);
      }
    } catch (networkError) {
      console.error("Network or Axios error during query processing:", networkError);
      const status = networkError.response?.status;
      let userMessage = t(
        "networkError.default",
        "A network error occurred. Please try again."
      );
      if (status) {
        userMessage = t(
          "networkError.withStatus",
          `The server responded with an error (Status: {{status}}). Please try again.`,
          { status }
        );
      }

      setAllRolesData((prev) => ({
        ...prev,
        [role]: {
          ...initialRoleSpecificProcessingState,
          activeTab:
            role === "user" ? "Visualization Agent" : "Schema Loader",
          isLoading: false,
          insightsLoading: false,
          errorMessage: userMessage,
        },
      }));
      setHasProcessed(false);
    } finally {
      setAllRolesData((prev) => {
        const currentRoleState =
          prev[role] || initialRoleSpecificProcessingState;
        let finalActiveTab = currentRoleState.activeTab;

        if (role === "user") {
          finalActiveTab = "Visualization Agent";
        }

        return {
          ...prev,
          [role]: {
            ...currentRoleState,
            isLoading: false,
            insightsLoading: false,
            activeTab: finalActiveTab,
          },
        };
      });
    }
  };

  const userTabs = (allRolesData[role]?.loadedTabs || []).filter(
    (tab) => tab?.name === "Visualization Agent"
  );

  return (
    <div className="bg-white p-6 rounded-md shadow-md text-gray-800 border border-gray-200">
      <h1 className="text-3xl font-semibold mb-1" style={{ color: "#b58932" }}>
        {t("title")}
      </h1>
      <p className="text-sm text-gray-600 mb-4">{t("subtitle")}</p>

      {/* <textarea
        className="w-full p-3 bg-gray-100 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("placeholder")}
        rows={4}
      /> */}

      <textarea
  className="w-full p-3 bg-gray-100 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
  value={query}
  onChange={(e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setQueriesByRole(prev => ({
      ...prev,
      [role]: newQuery,
    }));
  }}
  placeholder={t("placeholder")}
  rows={4}
/>

      <div className="flex items-center gap-4">
        <button
          onClick={handleProcess}
          disabled={allRolesData[role].isLoading || query.trim() === ""}
          className={`px-4 py-2 rounded-md text-white flex items-center gap-2 transition ${
            allRolesData[role].isLoading || query.trim() === ""
              ? "bg-orange-300 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {allRolesData[role].isLoading && <FiLoader className="animate-spin" />}
          {allRolesData[role].isLoading ? t("processing") : t("processButton")}
        </button>

        <button
          onClick={() => {
            setQuery("");
            setAllRolesData((prev) => ({
              ...prev,
              [role]: {
                ...initialRoleSpecificProcessingState,
                activeTab: role === "user" ? "Visualization Agent" : t("Schema Loader"),
              },
            }));
            setHasProcessed(false);
          }}
          className="px-4 py-2 border border-orange-500 text-orange-500 hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600 rounded-md transition"
        >
          {t("clearButton")}
        </button>
      </div>

      {allRolesData[role].isLoading && (
        <div
          style={{
            color: "#b58932",
            marginTop: "1rem",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {t("fetching")}...
          <CgSpinner className="animate-spin" style={{ fontSize: "1.2rem" }} />
        </div>
      )}

      <div>
        {allRolesData[role].errorMessage && (
          <div style={{ color: "#b58932", marginTop: "1rem", fontWeight: "bold" }}>
             {allRolesData[role].errorMessage}
          </div>
        )}
      </div>

      {allRolesData[role].isLoading && allRolesData[role].currentStep && (
        <div className="flex items-center gap-3 mt-6 text-sm text-gray-700">
          <FiLoader className="animate-spin text-orange-500 text-xl" />
          <span>{allRolesData[role].currentStep} (loading...)</span>
        </div>
      )}

      {(allRolesData[role]?.loadedTabs || []).length > 0 && (
        <div className="mt-8">
          {role === "admin" && (
            <h2 className="text-xl font-semibold mb-4" style={{ color: "#b58932" }}>
              {t("pipelineTitle")}
            </h2>
          )}

          {role === "admin" && allRolesData[role].totalExecutionTime && (
            <p className="text-sm text-gray-600 mb-4">
              {t("executionTime")}: {allRolesData[role].totalExecutionTime} sec
            </p>
          )}

          <div className="relative border-b border-gray-300 flex space-x-6 pb-2">
            {(role === "admin"
              ? allRolesData[role]?.loadedTabs || []
              : userTabs
            ).map((tab) => {
              const translatedTabName =
                role === "user" && tab.name === "Visualization Agent"
                  ? t("output")
                  : t(`tabs.${tab.name}`);

              return (
                <button
                  key={tab.name}
                  onClick={() => handleSetActiveTab(tab.name)}
                  disabled={role === "admin" ? !tab.executionTime : false}
                  className={`text-sm font-medium pb-2 transition border-b-2 ${
                    allRolesData[role].activeTab === tab.name
                      ? "border-orange-500 text-orange-600"
                      : "text-gray-600 hover:text-orange-500 border-transparent hover:border-orange-300"
                  } ${
                    role === "admin" && !tab.executionTime
                      ? "text-gray-400 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {translatedTabName}
                  {role === "admin" && tab.executionTime && `(${tab.executionTime}s)`}
                </button>
              );
            })}
          </div>

          <TabsContent
            activeTab={allRolesData[role].activeTab}
            sqlQuery={allRolesData[role].sqlQuery}
            language={selectedLanguage}
            suggestedVisualization={allRolesData[role].suggestedVisualization}
            queryResult={allRolesData[role].queryResult}
            insights={allRolesData[role].insights}
            insightsLoading={allRolesData[role].insightsLoading}
            rows={(allRolesData[role].queryResult || []).length}
            columns={
              allRolesData[role].queryResult &&
              allRolesData[role].queryResult[0]
                ? Object.keys(allRolesData[role].queryResult[0]).length
                : 0
            }
            hasProcessed={hasProcessed}
          />
        </div>
      )}
    </div>
  );
};

export default MainContent;