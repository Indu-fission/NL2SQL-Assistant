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
  activeTab: "Schema Loader", // Default active tab
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
  setHasProcessed, // ✅ coming from App
  setQueryHistory,
  autoRun,
  setAutoRun,
  language = "english",
}) => {
  // const [loadedTabs, setLoadedTabs] = useState([]);
  // const [activeTab, setActiveTab] = useState("Schema Loader");
  // const [currentStep, setCurrentStep] = useState("");
  // const [queryResult, setQueryResult] = useState([]);
  // const [sqlQuery, setSqlQuery] = useState("");
  // const [suggestedVisualization, setSuggestedVisualization] = useState("");
  const { role } = useContext(AppContext);

  // const [totalExecutionTime, setTotalExecutionTime] = useState(null);

  const { t, i18n } = useTranslation();
  const selectedLanguage = i18n.language;

  // const [insights, setInsights] = useState("");
  // const [insightsLoading, setInsightsLoading] = useState(false);

  const [allRolesData, setAllRolesData] = useState({
    admin: {
      ...initialRoleSpecificProcessingState,
      activeTab: "Schema Loader",
    },
    user: {
      ...initialRoleSpecificProcessingState,
      activeTab: "Visualization Agent" /* Or keep Schema Loader if preferred */,
    },
  });

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

  // const handleProcess = async () => {
  //   // setHasProcessed(true);
  //   // setIsLoading(true);
  //   // setLoadedTabs([]);
  //   // setActiveTab("");
  //   // setCurrentStep("");
  //   // setQueryResult([]);
  //   setHasProcessed(true);
  //   // setTotalExecutionTime(null);
  //   // setInsights("");
  //   // setInsightsLoading(true);

  //   setAllRolesData(prev => ({
  //     ...prev,
  //     [role]: {
  //       ...initialRoleSpecificProcessingState,
  //       queryResult: result_data,
  //       totalExecutionTime: total_time_seconds.toFixed(2),
  //       sqlQuery: sql_query,
  //       suggestedVisualization: suggested_visualization,
  //       loadedTabs: newTabs,
  //       activeTab: newTabs.length > 0 ? newTabs[0].name :prev[role].activeTab,
  //       // isLoading and insightsLoading will be handled in finally or after insights fetch
  //       isLoading: false,
  //       insightsLoading: false,

  //     }
  //   }));

  //   const headers = { "Content-Type": "application/json" };
  //   const payload = { query: query.trim() };

  //   try {
  //     // Send main query process request
  //     const response = await axios.post(
  //       "http://localhost:8000/query-process/english",
  //       payload,
  //       { headers }
  //     );
  //     const {
  //       result_data,
  //       total_time_seconds,
  //       processing_steps,
  //       sql_query,
  //       suggested_visualization,
  //     } = response.data;

  //     setQueryResult(result_data);
  //     setTotalExecutionTime(total_time_seconds.toFixed(2));
  //     // setSqlQuery(sql_query);
  //     // setSuggestedVisualization(suggested_visualization);

  //     const newTabs = processing_steps.map((step) => ({
  //       name: step.agent,
  //       executionTime: step.time_taken?.toFixed(2) || "N/A",
  //     }));

  //     setLoadedTabs(newTabs);
  //     if (newTabs.length > 0) {
  //       setActiveTab(newTabs[0].name);
  //     }

  //     if (query.trim()) {
  //       const roleKey =
  //         role === "admin" ? "adminQueryHistory" : "userQueryHistory";
  //       const existingHistory = JSON.parse(
  //         localStorage.getItem(roleKey) || "[]"
  //       );

  //       // Optional: Avoid duplicates
  //       if (!existingHistory.includes(query.trim())) {
  //         const updatedHistory = [...existingHistory, query.trim()];
  //         localStorage.setItem(roleKey, JSON.stringify(updatedHistory));
  //         setQueryHistory(updatedHistory); // This should update the UI based on role
  //       }
  //     }

  //     // Add a small delay before fetching insights
  //     await new Promise((resolve) => setTimeout(resolve, 500));

  //     // Fetch insights AFTER successful query-process
  //     try {
  //       const insightsResponse = await axios.get(
  //         "http://127.0.0.1:8000/summary-insights/english"
  //       );

  //       if (
  //         insightsResponse.status === 200 &&
  //         insightsResponse.data.summary_insights
  //       ) {
  //         setInsights(insightsResponse.data.summary_insights);
  //       } else {
  //         setInsights("⚠️ No insights returned.");
  //       }
  //     } catch (err) {
  //       console.error(
  //         "Error fetching insights:",
  //         err.response?.data || err.message
  //       );
  //       setInsights("Error loading insights.");
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Error sending query to backend:",
  //       error.response?.data || error.message
  //     );
  //   } finally {
  //     setInsightsLoading(false);
  //     setIsLoading(false);
  //   }
  // };

  const handleProcess = async () => {
    // 1. Set initial "loading" state and clear any previous error message
    setAllRolesData((prev) => ({
      ...prev,
      [role]: {
        ...initialRoleSpecificProcessingState, // Reset to base state for this role
        isLoading: true,
        insightsLoading: true, // Assume insights will be fetched initially
        activeTab: role === "user" ? "Visualization Agent" : "Schema Loader",
        errorMessage: "", // Clear previous error message for this role
      },
    }));
    setHasProcessed(true); // Signal that processing has been attempted

    const headers = { "Content-Type": "application/json" };
    const payload = { query: query.trim() };

    try {
      // 2. Make the main API call
      const response = await axios.post(
        "http://localhost:8000/query-process/english", // Adjust URL if necessary
        payload,
        { headers }
      );

      // 3. Check response status
      if (response.status === 200) {
        const {
          result_data,
          total_time_seconds,
          processing_steps,
          sql_query,
          suggested_visualization,
          error: backendError, // Destructure the 'error' field from response.data
        } = response.data;

        // 3a. Handle if the backend explicitly reports an error
        if (
          backendError &&
          backendError !== "null" &&
          String(backendError).trim() !== ""
        ) {
          // Backend indicated an error. Display the translated 'warning' message.
          setAllRolesData((prev) => ({
            ...prev,
            [role]: {
              ...prev[role], // Keep some state like activeTab
              errorMessage: t("warning"), // Use your translated "warning" message
              queryResult: [], // Clear potentially partial results
              loadedTabs: [],
              insights: "",
              sqlQuery: "",
              suggestedVisualization: "",
              totalExecutionTime: null,
              isLoading: false, // Stop loading, as we've processed the error
              insightsLoading: false,
            },
          }));
          // setHasProcessed(false); // Optional: if a backend error means not truly "processed"
          return; // Stop further processing (like fetching insights)
        }

        // 3b. No backend-reported error, proceed with processing successful data
        const newTabs = (processing_steps || []).map((step) => ({
          name: step.agent,
          executionTime: step.time_taken?.toFixed(2) || "N/A",
        }));

        setAllRolesData((prev) => ({
          ...prev,
          [role]: {
            ...prev[role], // Preserve current role's state (like isLoading, insightsLoading, initial activeTab)
            queryResult: result_data || [],
            totalExecutionTime: total_time_seconds
              ? total_time_seconds.toFixed(2)
              : null,
            sqlQuery: sql_query || "",
            suggestedVisualization: suggested_visualization || "",
            loadedTabs: newTabs,
            activeTab:
              newTabs.length > 0 ? newTabs[0].name : prev[role].activeTab,
            errorMessage: "", // Clear any error message on success
          },
        }));

        // Query History Logic
        if (query.trim()) {
          const roleKey =
            role === "admin" ? "adminQueryHistory" : "userQueryHistory";
          const existingHistory = JSON.parse(
            localStorage.getItem(roleKey) || "[]"
          );
          if (!existingHistory.includes(query.trim())) {
            const updatedHistory = [...existingHistory, query.trim()];
            localStorage.setItem(roleKey, JSON.stringify(updatedHistory));
            if (setQueryHistory && typeof setQueryHistory === "function") {
              setQueryHistory(updatedHistory);
            }
          }
        }

        // 4. Fetch insights ONLY if the main process was successful and had no backend-reported error
        await new Promise((resolve) => setTimeout(resolve, 500)); // Optional delay
        try {
          const insightsResponse = await axios.get(
            "http://127.0.0.1:8000/summary-insights/english" // Adjust URL if necessary
          );
          setAllRolesData((prev) => ({
            ...prev,
            [role]: {
              ...prev[role],
              insights:
                insightsResponse.status === 200 &&
                insightsResponse.data.summary_insights
                  ? insightsResponse.data.summary_insights
                  : t("noInsightsReturned", "⚠️ No insights returned."), // Use a translatable key
            },
          }));
        } catch (insightsErr) {
          console.error(
            "Error fetching insights:",
            insightsErr.response?.data || insightsErr.message
          );
          setAllRolesData((prev) => ({
            ...prev,
            [role]: {
              ...prev[role],
              insights: t("errorLoadingInsights", "Error loading insights."),
            }, // Use a translatable key
          }));
        }
      } else {
        // Handle cases where response.status is not 200 (e.g., 400, 404 from main API)
        // Axios usually throws an error for non-2xx statuses, which would be caught by the outer catch block.
        console.error(
          "Non-200 response from backend:",
          response.status,
          response.data
        );
        setAllRolesData((prev) => ({
          ...prev,
          [role]: {
            ...initialRoleSpecificProcessingState, // Reset state
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
        setHasProcessed(false); // Query did not process successfully
      }
    } catch (networkError) {
      // Handle network errors or errors thrown by axios (e.g., server unreachable, 5xx status)
      console.error(
        "Network or Axios error during query processing:",
        networkError.response?.data || networkError.message
      );
      const status = networkError.response?.status;
      let userMessage = t(
        "networkError.default",
        "A network error occurred. Please try again."
      ); // Default network error
      if (status) {
        // Provide a more specific message if status is available
        userMessage = t(
          "networkError.withStatus",
          `The server responded with an error (Status: {{status}}). Please try again.`,
          { status }
        );
      }

      setAllRolesData((prev) => ({
        ...prev,
        [role]: {
          ...initialRoleSpecificProcessingState, // Reset state
          activeTab: role === "user" ? "Visualization Agent" : "Schema Loader",
          isLoading: false,
          insightsLoading: false,
          errorMessage: userMessage,
        },
      }));
      setHasProcessed(false); // Query did not process successfully
    } finally {
      // 6. Final cleanup for loading states and ensuring user's active tab (always runs)
      setAllRolesData((prev) => {
        const currentRoleState =
          prev[role] || initialRoleSpecificProcessingState;
        let finalActiveTab = currentRoleState.activeTab;

        if (role === "user") {
          // If processing was successful (no error message set) or if it's just loading, stick to VA.
          // If there was an error, it might have reset activeTab, so this ensures VA is the default.
          finalActiveTab = "Visualization Agent";
        }

        return {
          ...prev,
          [role]: {
            ...currentRoleState, // Preserve all data obtained (queryResult, insights, errorMessage etc.)
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
      {allRolesData[role].errorMessage && (
        <div className="p-3 my-4 text-red-700 bg-red-100 border border-red-400 rounded-md">
          {allRolesData[role].errorMessage}
        </div>
      )}
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
          disabled={allRolesData[role].isLoading || query.trim() === ""} // Disable if loading or input is empty
          className={`px-4 py-2 rounded-md text-white flex items-center gap-2 transition ${
            allRolesData[role].isLoading || query.trim() === ""
              ? "bg-orange-300 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {allRolesData[role].isLoading && (
            <FiLoader className="animate-spin" />
          )}
          {allRolesData[role].isLoading ? t("processing") : t("processButton")}
        </button>
        <button
          onClick={() => {
            setQuery("");
            // setQueryResult([]);
            // setLoadedTabs([]);
            // setActiveTab(t("Schema Loader"));

            // setTotalExecutionTime(null);
            // setHasProcessed(false);
            // setInsights("");
            // setInsightsLoading(false);
            setAllRolesData((prev) => ({
              ...prev,
              [role]: {
                ...initialRoleSpecificProcessingState,
                // Explicitly set activeTab if it differs from initialRoleSpecificProcessingState.activeTab on clear for a role
                activeTab:
                  role === "user" ? "Visualization Agent" : t("Schema Loader"),
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
          <div
            style={{ color: "#b58932", marginTop: "1rem", fontWeight: "bold" }}
          >
            ⚠️ {allRolesData[role].errorMessage}
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
          {role === "admin" && allRolesData[role].totalExecutionTime && (
            <p className="text-sm text-gray-600 mb-4">
              {t("executionTime")}: {allRolesData[role].totalExecutionTime} sec
            </p>
          )}
          <div className="relative border-b border-gray-300 flex space-x-6 pb-2">
            {(role === "admin" ? loadedTabs : userTabs).map((tab) => {
              // Conditionally override tab name for user role
              const translatedTabName =
                role === "user" && tab.name === "Visualization Agent"
                  ? t("Query Output") // Custom label for user
                  : t(`tabs.${tab.name}`);

              return (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  disabled={role === "admin" ? !tab.executionTime : false}
                  className={`text-sm font-medium pb-2 transition border-b-2 ${
                    activeTab === tab.name
                      ? "border-orange-500 text-orange-600"
                      : "text-gray-600 hover:text-orange-500 border-transparent hover:border-orange-300"
                  } ${
                    role === "admin" && !tab.executionTime
                      ? "text-gray-400 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {translatedTabName}
                  {role === "admin" &&
                    tab.executionTime &&
                    `(${tab.executionTime}s)`}
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
            hasProcessed={hasProcessed} // ✅ Add this line
          />
        </div>
      )}
    </div>
  );
};

export default MainContent;
