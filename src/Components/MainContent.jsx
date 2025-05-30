
// import React, { useState, useEffect, useContext } from "react";
// import { FiLoader } from "react-icons/fi";
// import TabsContent from "./TabsContent";
// import { useTranslation } from "react-i18next";
// import axios from "axios";
// import { AppContext } from "./context/AppContext";
// import { CgSpinner } from "react-icons/cg";

// const initialRoleSpecificProcessingState = {
//   isLoading: false,
//   loadedTabs: [],
//   activeTab: "Schema Loader",
//   currentStep: "",
//   queryResult: [],
//   sqlQuery: "",
//   suggestedVisualization: "",
//   totalExecutionTime: null,
//   insights: "",
//   insightsLoading: false,
//   errorMessage: "",
// };

// const MainContent = ({
//   query,
//   setQuery,
//   hasProcessed,
//   setHasProcessed,
//   setQueryHistory,
//   autoRun,
//   setAutoRun,
//   language = "english",
// }) => {
//   const [queryResult, setQueryResult] = useState([]);
//   const [queriesByRole, setQueriesByRole] = useState({
//     admin: "",
//     user: "",
//   });

//   const { role } = useContext(AppContext);
//   const { t, i18n } = useTranslation();
//   const selectedLanguage = i18n.language;
//   const [allRolesData, setAllRolesData] = useState({
//     admin: {
//       ...initialRoleSpecificProcessingState,
//       activeTab: "Schema Loader",
//     },
//     user: {
//       ...initialRoleSpecificProcessingState,
//       activeTab: "Visualization Agent",
//     },
//   });

//   useEffect(() => {
//     setQuery(queriesByRole[role] || "");
//   }, [role]);

//   useEffect(() => {
//     if (autoRun && query.trim()) {
//       handleProcess();
//       setAutoRun(false);
//     }
//   }, [autoRun, query, setAutoRun, language, role]);

//   const handleSetActiveTab = (tabName) => {
//     const currentRole = role;
//     setAllRolesData((prev) => ({
//       ...prev,
//       [currentRole]: { ...prev[currentRole], activeTab: tabName },
//     }));
//   };

//   const handleProcess = async () => {
//     setAllRolesData((prev) => ({
//       ...prev,
//       [role]: {
//         ...initialRoleSpecificProcessingState,
//         isLoading: true,
//         insightsLoading: true,
//         activeTab: role === "user" ? "Visualization Agent" : "Schema Loader",
//         errorMessage: "",
//       },
//     }));
//     setHasProcessed(true);

//     if (query.trim()) {
//       const roleKey =
//         role === "admin" ? "adminQueryHistory" : "userQueryHistory";
//       const existingHistory = JSON.parse(localStorage.getItem(roleKey) || "[]");
//       if (!existingHistory.includes(query.trim())) {
//         const updatedHistory = [...existingHistory, query.trim()];
//         localStorage.setItem(roleKey, JSON.stringify(updatedHistory));
//         if (setQueryHistory && typeof setQueryHistory === "function") {
//           setQueryHistory(updatedHistory);
//         }
//       }
//     }

//     const headers = { "Content-Type": "application/json" };
//     const payload = { query: query.trim() };

//     try {
//       const response = await axios.post(
//         "http://localhost:8000/query-process/english",
//         payload,
//         { headers }
//       );

//       if (response.status === 200) {
//         const {
//           result_data,
//           total_time_seconds,
//           processing_steps,
//           sql_query,
//           suggested_visualization,
//           error: backendError,
//         } = response.data;

//         if (
//           backendError &&
//           backendError !== "null" &&
//           String(backendError).trim() !== ""
//         ) {
//           setAllRolesData((prev) => ({
//             ...prev,
//             [role]: {
//               ...prev[role],
//               errorMessage: t("warning"),
//               queryResult: [],
//               loadedTabs: [],
//               insights: "",
//               sqlQuery: "",
//               suggestedVisualization: "",
//               totalExecutionTime: null,
//               isLoading: false,
//               insightsLoading: false,
//             },
//           }));
//           return;
//         }

//         const newTabs = (processing_steps || []).map((step) => ({
//           name: step.agent,
//           executionTime: step.time_taken?.toFixed(2) || "N/A",
//         }));

//         setAllRolesData((prev) => ({
//           ...prev,
//           [role]: {
//             ...prev[role],
//             queryResult: result_data || [],
//             totalExecutionTime: total_time_seconds
//               ? total_time_seconds.toFixed(2)
//               : null,
//             sqlQuery: sql_query || "",
//             suggestedVisualization: suggested_visualization || "",
//             loadedTabs: newTabs,
//             activeTab:
//               newTabs.length > 0 ? newTabs[0].name : prev[role].activeTab,
//             errorMessage: "",
//           },
//         }));

//         await new Promise((resolve) => setTimeout(resolve, 500));
//         try {
//           const insightsResponse = await axios.get(
//             "http://127.0.0.1:8000/summary-insights/english"
//           );
//           setAllRolesData((prev) => ({
//             ...prev,
//             [role]: {
//               ...prev[role],
//               insights:
//                 insightsResponse.status === 200 &&
//                 insightsResponse.data.summary_insights
//                   ? insightsResponse.data.summary_insights
//                   : t("noInsightsReturned", "⚠️ No insights returned."),
//             },
//           }));
//         } catch (insightsErr) {
//           console.error("Error fetching insights:", insightsErr);
//           setAllRolesData((prev) => ({
//             ...prev,
//             [role]: {
//               ...prev[role],
//               insights: t("errorLoadingInsights", "Error loading insights."),
//             },
//           }));
//         }
//       } else {
//         console.error("Non-200 response from backend:", response.status);
//         setAllRolesData((prev) => ({
//           ...prev,
//           [role]: {
//             ...initialRoleSpecificProcessingState,
//             activeTab:
//               role === "user" ? "Visualization Agent" : "Schema Loader",
//             isLoading: false,
//             insightsLoading: false,
//             errorMessage: t(
//               "serverErrorWithStatus",
//               `Server error: ${response.status}. Please try again.`,
//               { status: response.status }
//             ),
//           },
//         }));
//         setHasProcessed(false);
//       }
//     } catch (networkError) {
//       console.error(
//         "Network or Axios error during query processing:",
//         networkError
//       );
//       const status = networkError.response?.status;
//       let userMessage = t(
//         "networkError.default",
//         "A network error occurred. Please try again."
//       );
//       if (status) {
//         userMessage = t(
//           "networkError.withStatus",
//           `The server responded with an error (Status: {{status}}). Please try again.`,
//           { status }
//         );
//       }

//       setAllRolesData((prev) => ({
//         ...prev,
//         [role]: {
//           ...initialRoleSpecificProcessingState,
//           activeTab: role === "user" ? "Visualization Agent" : "Schema Loader",
//           isLoading: false,
//           insightsLoading: false,
//           errorMessage: userMessage,
//         },
//       }));
//       setHasProcessed(false);
//     } finally {
//       setAllRolesData((prev) => {
//         const currentRoleState =
//           prev[role] || initialRoleSpecificProcessingState;
//         let finalActiveTab = currentRoleState.activeTab;
//         if (role === "user") {
//           finalActiveTab = "Visualization Agent";
//         }

//         return {
//           ...prev,
//           [role]: {
//             ...currentRoleState,
//             isLoading: false,
//             insightsLoading: false,
//             activeTab: finalActiveTab,
//           },
//         };
//       });
//     }
//   };

//   const userTabs = (allRolesData[role]?.loadedTabs || []).filter(
//     (tab) => tab?.name === "Visualization Agent"
//   );

//   return (
//     <div className="w-full max-h-screen overflow-y-auto scrollbar-none px-4 ">
//       <div className="flex flex-col items-center justify-center text-white py-12 backdrop-blur-sm  text-center">
//         <h1 className="text-4xl font-bold mb-2">Data for a Better Future</h1>
//         <h2 className="text-xl">THE BEST COUNTRY IN THE WORLD BY 2071</h2>
//       </div>

//       <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl text-gray-800 border border-gray-200/50 max-w-5xl mx-auto ">
//         {/* Header section */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold mb-2" style={{ color: "#b58932" }}>
//             {t("title")}
//           </h1>
//           <p className="text-lg text-gray-600">{t("subtitle")}</p>
//         </div>

//         {/* Query input */}
//         <div className="w-full px-4 mt-8">
//           <textarea
//             className="w-full p-4 bg-gray-50/80 text-gray-900 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200"
//             value={query}
//             onChange={(e) => {
//               const newQuery = e.target.value;
//               setQuery(newQuery);
//               setQueriesByRole((prev) => ({
//                 ...prev,
//                 [role]: newQuery,
//               }));
//             }}
//             placeholder={t("placeholder")}
//             rows={4}
//           />
//         </div>

//         {/* Buttons */}
//         <div className="flex items-center justify-center gap-4 mb-6">
//           <button
//             onClick={handleProcess}
//             disabled={allRolesData[role].isLoading || query.trim() === ""}
//             className={`px-6 py-3 rounded-xl text-white font-medium flex items-center gap-2 transition-all duration-200 ${
//               allRolesData[role].isLoading || query.trim() === ""
//                 ? "bg-orange-300 cursor-not-allowed"
//                 : "bg-orange-500 hover:bg-orange-600 hover:shadow-lg transform hover:-translate-y-0.5"
//             }`}
//           >
//             {allRolesData[role].isLoading && (
//               <FiLoader className="animate-spin" />
//             )}
//             {allRolesData[role].isLoading
//               ? t("processing")
//               : t("processButton")}
//           </button>

//           <button
//             onClick={() => {
//               setQuery("");
//               setAllRolesData((prev) => ({
//                 ...prev,
//                 [role]: {
//                   ...initialRoleSpecificProcessingState,
//                   activeTab:
//                     role === "user"
//                       ? "Visualization Agent"
//                       : t("Schema Loader"),
//                 },
//               }));
//               setHasProcessed(false);
//             }}
//             className="px-6 py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600 rounded-xl font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
//           >
//             {t("clearButton")}
//           </button>
//         </div>

//         {allRolesData[role].isLoading && (
//           <div className="text-center mb-6 text-orange-600 font-semibold flex justify-center items-center gap-2">
//             {t("fetching")}...
//             <CgSpinner className="animate-spin text-xl" />
//           </div>
//         )}

//         {allRolesData[role].errorMessage && (
//           <div className="text-center mb-6">
//             <div
//               className="inline-block px-4 py-2 rounded-lg font-medium"
//               style={{ color: "#b58932", backgroundColor: "#fef7ed" }}
//             >
//               {allRolesData[role].errorMessage}
//             </div>
//           </div>
//         )}

//         {allRolesData[role].isLoading && allRolesData[role].currentStep && (
//           <div className="flex items-center justify-center gap-3 mb-6 text-sm text-gray-700">
//             <FiLoader className="animate-spin text-orange-500 text-xl" />
//             <span>{allRolesData[role].currentStep} (loading...)</span>
//           </div>
//         )}

//         {(allRolesData[role]?.loadedTabs || []).length > 0 && (
//           <div className="mt-8">
//             {role === "admin" && (
//               <h2
//                 className="text-2xl font-semibold mb-6 text-center"
//                 style={{ color: "#b58932" }}
//               >
//                 {t("pipelineTitle")}
//               </h2>
//             )}

//             {role === "admin" && allRolesData[role].totalExecutionTime && (
//               <p className="text-sm text-gray-600 mb-6 text-center">
//                 {t("executionTime")}: {allRolesData[role].totalExecutionTime}{" "}
//                 sec
//               </p>
//             )}

//             <div className="relative border-b border-gray-300 flex justify-center space-x-8 pb-2 mb-6">
//               {(role === "admin"
//                 ? allRolesData[role]?.loadedTabs || []
//                 : userTabs
//               ).map((tab) => {
//                 const translatedTabName =
//                   role === "user" && tab.name === "Visualization Agent"
//                     ? t("output")
//                     : t(`tabs.${tab.name}`);

//                 return (
//                   <button
//                     key={tab.name}
//                     onClick={() => handleSetActiveTab(tab.name)}
//                     disabled={role === "admin" ? !tab.executionTime : false}
//                     className={`text-sm font-medium pb-2 transition-all duration-200 border-b-2 ${
//                       allRolesData[role].activeTab === tab.name
//                         ? "border-orange-500 text-orange-600"
//                         : "text-gray-600 hover:text-orange-500 border-transparent hover:border-orange-300"
//                     } ${
//                       role === "admin" && !tab.executionTime
//                         ? "text-gray-400 cursor-not-allowed"
//                         : ""
//                     }`}
//                   >
//                     {translatedTabName}
//                     {role === "admin" &&
//                       tab.executionTime &&
//                       ` (${tab.executionTime}s)`}
//                   </button>
//                 );
//               })}
//             </div>

//             <TabsContent
//               activeTab={allRolesData[role].activeTab}
//               sqlQuery={allRolesData[role].sqlQuery}
//               language={selectedLanguage}
//               suggestedVisualization={allRolesData[role].suggestedVisualization}
//               queryResult={allRolesData[role].queryResult}
//               insights={allRolesData[role].insights}
//               insightsLoading={allRolesData[role].insightsLoading}
//               rows={(allRolesData[role].queryResult || []).length}
//               columns={
//                 allRolesData[role].queryResult &&
//                 allRolesData[role].queryResult[0]
//                   ? Object.keys(allRolesData[role].queryResult[0]).length
//                   : 0
//               }
//               hasProcessed={hasProcessed}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MainContent;







// import React, { useState, useEffect, useContext } from "react";
// import { FiLoader } from "react-icons/fi";
// import TabsContent from "./TabsContent"; // Assuming this is your TabsContent component with dropdown buttons
// import { useTranslation } from "react-i18next";
// import axios from "axios";
// import { AppContext } from "./context/AppContext";
// import { CgSpinner } from "react-icons/cg";

// const initialRoleSpecificProcessingState = {
//   isLoading: false,
//   loadedTabs: [],
//   activeTab: "Schema Loader", // This is the main data activeTab
//   currentStep: "",
//   queryResult: [],
//   sqlQuery: "",
//   suggestedVisualization: "",
//   totalExecutionTime: null,
//   insights: "",
//   insightsLoading: false,
//   errorMessage: "",
// };

// // Define your accent color here for easy reuse and modification
// const ACCENT_BROWN_COLOR = "#8D6E63"; // A muted, sophisticated brown
// const ACCENT_BROWN_HOVER_COLOR = "#795548"; // Darker for hover
// const ACCENT_BROWN_DISABLED_COLOR = "#BCAAA4"; // Lighter for disabled
// const ACCENT_BROWN_LIGHT_BG_COLOR = "#f5f0eb"; // Very light for clear button hover
// const ERROR_MESSAGE_BG_COLOR = "#fdf8f2"; // Light background for error message

// const MainContent = ({
//   query,
//   setQuery,
//   hasProcessed,
//   setHasProcessed,
//   setQueryHistory,
//   autoRun,
//   setAutoRun,
//   language = "english",
// }) => {
//   const [queryResult, setQueryResult] = useState([]); // This was in your original code
//   const [queriesByRole, setQueriesByRole] = useState({
//     admin: "",
//     user: "",
//   });

//   const { role } = useContext(AppContext);
//   const { t, i18n } = useTranslation();
//   const selectedLanguage = i18n.language;
//   const [allRolesData, setAllRolesData] = useState({
//     admin: {
//       ...initialRoleSpecificProcessingState,
//       activeTab: "Schema Loader",
//     },
//     user: {
//       ...initialRoleSpecificProcessingState,
//       activeTab: "Visualization Agent",
//     },
//   });

//   useEffect(() => {
//     setQuery(queriesByRole[role] || "");
//   }, [role, queriesByRole, setQuery]);

//   useEffect(() => {
//     if (autoRun && query.trim()) {
//       handleProcess();
//       setAutoRun(false);
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [autoRun, query, setAutoRun, language, role]);

//   // This function updates the main activeTab for data purposes
//   const handleSetActiveTab = (tabName) => {
//     const currentRole = role;
//     setAllRolesData((prev) => ({
//       ...prev,
//       [currentRole]: { ...prev[currentRole], activeTab: tabName },
//     }));
//   };

//   const [isOpen, setIsOpen] = useState(false); // User's original state for dropdown UI
//   const [selectedTab, setSelectedTab] = useState(null); // User's original state for UI selected tab

//   // MODIFIED: The implementation of toggleDropdown
//   // This function will be called by buttons inside TabsContent
//   const toggleDropdown = (agentTabName) => {
//     if (selectedTab === agentTabName && isOpen) {
//       // If the clicked agent's dropdown is already open, close it
//       setIsOpen(false);
//       setSelectedTab(null); // Clear the selected tab for UI purposes
//       // Do not necessarily change allRolesData[role].activeTab here,
//       // as the data context might still be relevant or TabsContent handles its default view.
//     } else {
//       // If a new agent's dropdown is clicked or a closed one is clicked:
//       setSelectedTab(agentTabName); // Set this as the UI selected tab
//       setIsOpen(true); // Open the dropdown UI
//       handleSetActiveTab(agentTabName); // IMPORTANT: Also set it as the main active tab for data
//     }
//     // The original 'return tabName;' is not strictly needed by the caller if it's just a handler
//   };

//   const handleProcess = async () => {
//     // ADDED: Reset dropdown UI state before processing
//     setIsOpen(false);
//     setSelectedTab(null);

//     // --- START OF ORIGINAL handleProcess logic (UNCHANGED) ---
//     setAllRolesData((prev) => ({
//       ...prev,
//       [role]: {
//         ...initialRoleSpecificProcessingState,
//         isLoading: true,
//         insightsLoading: true,
//         activeTab: role === "user" ? "Visualization Agent" : "Schema Loader",
//         errorMessage: "",
//       },
//     }));
//     setHasProcessed(true);

//     if (query.trim()) {
//       const roleKey =
//         role === "admin" ? "adminQueryHistory" : "userQueryHistory";
//       const existingHistory = JSON.parse(localStorage.getItem(roleKey) || "[]");
//       if (!existingHistory.includes(query.trim())) {
//         const updatedHistory = [...existingHistory, query.trim()];
//         localStorage.setItem(roleKey, JSON.stringify(updatedHistory));
//         if (setQueryHistory && typeof setQueryHistory === "function") {
//           setQueryHistory(updatedHistory);
//         }
//       }
//     }

//     const headers = { "Content-Type": "application/json" };
//     const payload = { query: query.trim() };

//     try {
//       const response = await axios.post(
//         "http://localhost:8000/query-process/english",
//         payload,
//         { headers }
//       );

//       if (response.status === 200) {
//         const {
//           result_data,
//           total_time_seconds,
//           processing_steps,
//           sql_query,
//           suggested_visualization,
//           error: backendError,
//         } = response.data;

//         if (
//           backendError &&
//           backendError !== "null" &&
//           String(backendError).trim() !== ""
//         ) {
//           setAllRolesData((prev) => ({
//             ...prev,
//             [role]: {
//               ...prev[role], // Keep current isLoading, insightsLoading
//               errorMessage: t("warning"),
//               queryResult: [], loadedTabs: [], insights: "", sqlQuery: "",
//               suggestedVisualization: "", totalExecutionTime: null,
//               isLoading: false, // Explicitly set loading to false here
//               insightsLoading: false, // Explicitly set loading to false here
//               currentStep: "",
//             },
//           }));
//           return;
//         }

//         const newTabs = (processing_steps || []).map((step) => ({
//           name: step.agent,
//           executionTime: step.time_taken?.toFixed(2) || "N/A",
//         }));

//         setAllRolesData((prev) => ({
//           ...prev,
//           [role]: {
//             ...prev[role], // Keep current isLoading, insightsLoading
//             queryResult: result_data || [],
//             totalExecutionTime: total_time_seconds ? total_time_seconds.toFixed(2) : null,
//             sqlQuery: sql_query || "",
//             suggestedVisualization: suggested_visualization || "",
//             loadedTabs: newTabs,
//             activeTab: newTabs.length > 0 ? newTabs[0].name : (role === "user" ? "Visualization Agent" : "Schema Loader"),
//             errorMessage: "",
//             // isLoading, insightsLoading will be set in finally
//           },
//         }));

//         if (result_data && result_data.length > 0) {
//             try {
//             const insightsResponse = await axios.get(
//               "http://127.0.0.1:8000/summary-insights/english"
//             );
//             setAllRolesData((prev) => ({
//               ...prev,
//               [role]: {
//                 ...prev[role],
//                 insights:
//                   insightsResponse.status === 200 &&
//                   insightsResponse.data.summary_insights
//                     ? insightsResponse.data.summary_insights
//                     : t("noInsightsReturned", "⚠️ No insights returned."),
//               },
//             }));
//             } catch (insightsErr) {
//             console.error("Error fetching insights:", insightsErr);
//             setAllRolesData((prev) => ({
//               ...prev,
//               [role]: { ...prev[role], insights: t("errorLoadingInsights", "Error loading insights.") },
//             }));
//             }
//         } else {
//             setAllRolesData((prev) => ({
//               ...prev,
//               [role]: { ...prev[role], insights: "" },
//             }));
//         }

//       } else {
//         console.error("Non-200 response from backend:", response.status);
//         setAllRolesData((prev) => ({
//           ...prev,
//           [role]: {
//             ...initialRoleSpecificProcessingState, // Reset to initial
//             activeTab: role === "user" ? "Visualization Agent" : "Schema Loader",
//             isLoading: false, insightsLoading: false, currentStep: "", // Ensure loading is false
//             errorMessage: t("serverErrorWithStatus", `Server error: ${response.status}. Please try again.`, { status: response.status }),
//           },
//         }));
//         setHasProcessed(false); // Indicate processing did not complete successfully
//       }
//     } catch (networkError) {
//       console.error("Network or Axios error during query processing:", networkError);
//       const status = networkError.response?.status;
//       let userMessage = t("networkError.default", "A network error occurred. Please try again.");
//       if (status) {
//         userMessage = t("networkError.withStatus", `The server responded with an error (Status: {{status}}). Please try again.`, { status });
//       }
//       setAllRolesData((prev) => ({
//         ...prev,
//         [role]: {
//           ...initialRoleSpecificProcessingState, // Reset to initial
//           activeTab: role === "user" ? "Visualization Agent" : "Schema Loader",
//           isLoading: false, insightsLoading: false, currentStep: "", // Ensure loading is false
//           errorMessage: userMessage,
//         },
//       }));
//       setHasProcessed(false); // Indicate processing did not complete successfully
//     } finally {
//       setAllRolesData((prev) => {
//         const currentRoleState = prev[role] || initialRoleSpecificProcessingState;
//         let finalActiveTab = currentRoleState.activeTab;
//         // This logic from your original code for determining finalActiveTab is preserved
//         if (role === "user" && (!currentRoleState.loadedTabs || currentRoleState.loadedTabs.length === 0)) {
//           finalActiveTab = "Visualization Agent";
//         } else if (role === "admin" && (!currentRoleState.loadedTabs || currentRoleState.loadedTabs.length === 0)) {
//             finalActiveTab = "Schema Loader";
//         }

//         return {
//           ...prev,
//           [role]: {
//             ...currentRoleState,
//             isLoading: false, // Ensure loading is false
//             insightsLoading: false, // Ensure loading is false
//             currentStep: "",
//             activeTab: finalActiveTab,
//           },
//         };
//       });
//     }
//     // --- END OF ORIGINAL handleProcess logic (UNCHANGED) ---
//   };

//   // ORIGINAL userTabs variable: Commented out as it's only used by the removed tab display section.
  
//   const userTabs = (allRolesData[role]?.loadedTabs || []).filter(
//     (tab) => tab?.name === "Visualization Agent"
//   );
  

//   return (
//     <div className="w-full overflow-y-auto scrollbar-none px-2 sm:px-4 pt-2 pb-6">
//       <div className="bg-slate-50 rounded-2xl shadow-xl max-w-5xl mx-auto border border-gray-200/80">
//         <div style={{ backgroundColor: ACCENT_BROWN_COLOR }} className="h-2.5 rounded-t-xl"></div>
        
//         <div className="p-6 md:p-8">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: ACCENT_BROWN_COLOR }}>
//               {t("title")}
//             </h1>
//             <p className="text-md md:text-lg text-gray-600">{t("subtitle")}</p>
//           </div>

//           <div className="w-full px-0 md:px-4 mt-8 mb-6">
//             <textarea
//               className="w-full p-4 bg-white text-gray-800 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all duration-200"
//               style={{'--tw-ring-color': ACCENT_BROWN_COLOR, borderColor: allRolesData[role]?.errorMessage ? 'red' : undefined }}
//               value={query}
//               onChange={(e) => {
//                 const newQuery = e.target.value;
//                 setQuery(newQuery);
//                 setQueriesByRole((prev) => ({ ...prev, [role]: newQuery }));
//                 if (allRolesData[role]?.errorMessage) { // Optional chaining for safety, though original didn't have it
//                     setAllRolesData(prev => ({...prev, [role]: {...prev[role], errorMessage: ""}}));
//                 }
//               }}
//               placeholder={t("placeholder")}
//               rows={4}
//             />
//           </div>

//           <div className="w-full px-0 md:px-4 mb-8 flex items-center justify-between">
//             <div className="min-h-[2rem] text-left flex items-center">
//               {allRolesData[role]?.isLoading ? ( // Using optional chaining here for robustness, original didn't
//                 allRolesData[role]?.currentStep ? ( 
//                   <div className="flex items-center gap-2.5 text-sm" style={{color: ACCENT_BROWN_COLOR}}>
//                     <FiLoader className="animate-spin text-lg" />
//                     <span>{allRolesData[role]?.currentStep} ({t("loading")}...)</span>
//                   </div>
//                 ) : ( 
//                   <div className="font-semibold flex items-center gap-2 text-sm" style={{color: ACCENT_BROWN_COLOR}}>
//                     {t("fetching")}...
//                     <CgSpinner className="animate-spin text-xl" />
//                   </div>
//                 )
//               ) : allRolesData[role]?.errorMessage ? ( 
//                 <div
//                   className="px-3 py-1.5 rounded-md font-medium text-sm shadow-sm inline-block"
//                   style={{ color: ACCENT_BROWN_COLOR, backgroundColor: ERROR_MESSAGE_BG_COLOR, border: `1px solid ${ACCENT_BROWN_COLOR}20` }}
//                 >
//                   {allRolesData[role]?.errorMessage}
//                 </div>
//               ) : role === "admin" && allRolesData[role]?.totalExecutionTime ? ( 
//                 <p className="text-sm" style={{ color: ACCENT_BROWN_COLOR }}>
//                   {t("executionTime")}: {allRolesData[role]?.totalExecutionTime} sec
//                 </p>
//               ) : null }
//             </div>

//             <div className="flex items-center gap-4">
//               <button
//                 onClick={handleProcess}
//                 disabled={allRolesData[role]?.isLoading || query.trim() === ""}
//                 style={{
//                   backgroundColor: (allRolesData[role]?.isLoading || query.trim() === "") ? ACCENT_BROWN_DISABLED_COLOR : ACCENT_BROWN_COLOR,
//                 }}
//                 className={`px-6 py-2.5 rounded-lg text-white font-medium flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-px`}
//                 onMouseOver={(e) => { if (!(allRolesData[role]?.isLoading || query.trim() === "")) e.currentTarget.style.backgroundColor = ACCENT_BROWN_HOVER_COLOR; }}
//                 onMouseOut={(e) => { if (!(allRolesData[role]?.isLoading || query.trim() === "")) e.currentTarget.style.backgroundColor = ACCENT_BROWN_COLOR; }}
//               >
//                 {allRolesData[role]?.isLoading ? (
//                   <FiLoader className="animate-spin" />
//                 ) : (
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
//                       <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
//                     </svg>
//                 )}
//                 {allRolesData[role]?.isLoading ? t("processing") : t("processButton")}
//               </button>

//               <button
//                 onClick={() => {
//                   setQuery("");
//                   setQueriesByRole(prev => ({...prev, [role]: ""}));
//                   // ADDED: Reset dropdown UI state on clear
//                   setIsOpen(false);
//                   setSelectedTab(null);
//                   setAllRolesData((prev) => ({
//                     ...prev,
//                     [role]: {
//                       ...initialRoleSpecificProcessingState,
//                       activeTab: role === "user" ? "Visualization Agent" : "Schema Loader",
//                     },
//                   }));
//                   setHasProcessed(false);
//                 }}
//                 style={{ borderColor: ACCENT_BROWN_COLOR, color: ACCENT_BROWN_COLOR }}
//                 className="px-6 py-2.5 border-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-px"
//                 onMouseOver={(e) => e.currentTarget.style.backgroundColor = ACCENT_BROWN_LIGHT_BG_COLOR }
//                 onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//               >
//                 {t("clearButton")}
//               </button>
//             </div>
//           </div>
          
//           {/* OLD TAB NAMES DISPLAYING THING - Section entirely commented out */}
//           {/*
//           {(allRolesData[role]?.loadedTabs || []).length > 0 && (
//             <div className="mt-8">
//               {role === "admin" && (
//                 <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: ACCENT_BROWN_COLOR }}>
//                   {t("pipelineTitle")}
//                 </h2>
//               )}
//               <div className="relative border-b border-gray-300 flex justify-center space-x-6 md:space-x-8 pb-0 mb-6">
//                 {(role === "admin" ? allRolesData[role]?.loadedTabs || [] : userTabs) 
//                 .map((tab) => {
//                   const translatedTabName = role === "user" && tab.name === "Visualization Agent" ? t("output") : t(`tabs.${tab.name}`);
//                   return (
//                     <button
//                       key={tab.name}
//                       onClick={() => handleSetActiveTab(tab.name)}
//                       disabled={role === "admin" ? !tab.executionTime : false}
//                       className={`text-sm font-medium pb-2.5 transition-all duration-200 border-b-2 ${
//                         allRolesData[role].activeTab === tab.name
//                           // Note: Dynamic Tailwind classes with interpolation (like border-[${ACCENT_BROWN_COLOR}]) 
//                           // might require specific setup or won't be processed by JIT if not full class names.
//                           // Keeping as original for minimal changes.
//                           ? `border-[${ACCENT_BROWN_COLOR}] text-[${ACCENT_BROWN_COLOR}]` 
//                           : `text-gray-500 hover:text-[${ACCENT_BROWN_HOVER_COLOR}] border-transparent hover:border-[${ACCENT_BROWN_COLOR}]/50`
//                       } ${ role === "admin" && !tab.executionTime ? "text-gray-400 cursor-not-allowed" : "" }`}
//                     >
//                       {translatedTabName}
//                       {role === "admin" && tab.executionTime && ` (${tab.executionTime}s)`}
//                     </button>
//                   );
//                 })}
//               </div>
//               // Original TabsContent call was inside this conditional block
//             </div>
//           )}
//           */}
          
//           {/* Conditionally render TabsContent. It's assumed TabsContent now has its own agent buttons that trigger dropdowns. */}
//           {/* The condition `(allRolesData[role]?.loadedTabs || []).length > 0` from original can be used, or simply `hasProcessed` */}
//           {hasProcessed && ( 
//             <div className="mt-8">
//               <TabsContent
//                 // Props for TabsContent to control its internal dropdowns
//                 activeTab={selectedTab} // Tells TabsContent which of its sections is "selected" for dropdown display
//                 isOpen={isOpen}         // Tells TabsContent if the selected section should be open
//                 toggleDropdown={toggleDropdown} // The modified function from MainContent

//                 // Data props (these are based on allRolesData[role].activeTab, which is synced by toggleDropdown via handleSetActiveTab)
//                 sqlQuery={allRolesData[role]?.sqlQuery}
//                 language={selectedLanguage}
//                 suggestedVisualization={allRolesData[role]?.suggestedVisualization}
//                 queryResult={allRolesData[role]?.queryResult || []} // ensure array
//                 insights={allRolesData[role]?.insights}
//                 insightsLoading={allRolesData[role]?.insightsLoading}
//                 rows={(allRolesData[role]?.queryResult || []).length}
//                 columns={allRolesData[role]?.queryResult?.[0] ? Object.keys(allRolesData[role].queryResult[0]).length : 0}
//                 hasProcessed={hasProcessed}
//                 // If your TabsContent component requires other props like 'decomposerJson',
//                 // ensure they are available in MainContent and passed down.
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainContent;



import React, { useState, useEffect, useContext } from "react";
import TabsContent from "./TabsContent";
import { FiLoader } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { AppContext } from "./context/AppContext";
import { CgSpinner } from "react-icons/cg";

const initialRoleSpecificProcessingState = {
  isLoading: false,
  loadedTabs: [],
  activeTab: "Schema Loader", // This is the main data activeTab
  currentStep: "",
  queryResult: [],
  sqlQuery: "",
  suggestedVisualization: "",
  totalExecutionTime: null,
  insights: "",
  insightsLoading: false,
  decomposerJson: null, // ADDED: For the decomposerJson prop if sourced from here
  errorMessage: "",
};

// Define your accent color here for easy reuse and modification
const ACCENT_BROWN_COLOR = "#8D6E63"; // A muted, sophisticated brown
const ACCENT_BROWN_HOVER_COLOR = "#795548"; // Darker for hover
const ACCENT_BROWN_DISABLED_COLOR = "#BCAAA4"; // Lighter for disabled
const ACCENT_BROWN_LIGHT_BG_COLOR = "#f5f0eb"; // Very light for clear button hover
const ERROR_MESSAGE_BG_COLOR = "#fdf8f2"; // Light background for error message

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
  }, [role, queriesByRole, setQuery]);

  useEffect(() => {
    if (autoRun && query.trim()) {
      handleProcess();
      setAutoRun(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRun, query, setAutoRun, language, role]);

  const handleSetActiveTab = (tabName) => {
    const currentRole = role;
    setAllRolesData((prev) => ({
      ...prev,
      [currentRole]: { ...prev[currentRole], activeTab: tabName },
    }));
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(null); // This is for UI: which admin dropdown is open

  const toggleDropdown = (agentTabName) => {
    if (selectedTab === agentTabName && isOpen) {
      setIsOpen(false);
      setSelectedTab(null);
    } else {
      setSelectedTab(agentTabName);
      setIsOpen(true);
      if (role === 'admin') { // Only admin uses these dropdowns to change data context
        handleSetActiveTab(agentTabName); // Set it as the main active tab for data fetching in TabsContent
      }
    }
  };

  const handleProcess = async () => {
    setIsOpen(false); // Reset dropdown UI
    setSelectedTab(null); // Reset dropdown UI

    setAllRolesData((prev) => ({
      ...prev,
      [role]: {
        ...initialRoleSpecificProcessingState, // Resets decomposerJson to null too
        isLoading: true,
        insightsLoading: true,
        activeTab: role === "user" ? "Visualization Agent" : "Schema Loader", // Default active tab post-reset
        errorMessage: "",
      },
    }));
    setHasProcessed(true);

    if (query.trim()) {
      const roleKey =
        role === "admin" ? "adminQueryHistory" : "userQueryHistory";
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
      const response = await axios.post(
        "http://localhost:8000/query-process/english", // Assuming language might be dynamic here in future
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
          decomposer_json, // EXPECTING this from backend if it's to be populated here
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
              queryResult: [], loadedTabs: [], insights: "", sqlQuery: "",
              suggestedVisualization: "", totalExecutionTime: null, decomposerJson: null,
              isLoading: false,
              insightsLoading: false,
              currentStep: "",
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
            totalExecutionTime: total_time_seconds ? total_time_seconds.toFixed(2) : null,
            sqlQuery: sql_query || "",
            suggestedVisualization: suggested_visualization || "",
            decomposerJson: decomposer_json || null, // Set decomposerJson from response
            loadedTabs: newTabs,
            activeTab: role === 'admin' && newTabs.length > 0 ? newTabs[0].name : prev[role].activeTab,
            errorMessage: "",
          },
        }));

        if (result_data && result_data.length > 0) {
          try {
            const insightsResponse = await axios.get(
              "http://127.0.0.1:8000/summary-insights/english" // Assuming language
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
              [role]: { ...prev[role], insights: t("errorLoadingInsights", "Error loading insights.") },
            }));
          }
        } else {
          setAllRolesData((prev) => ({
            ...prev,
            [role]: { ...prev[role], insights: "" },
          }));
        }

      } else {
        console.error("Non-200 response from backend:", response.status);
        setAllRolesData((prev) => ({
          ...prev,
          [role]: {
            ...initialRoleSpecificProcessingState,
            activeTab: role === "user" ? "Visualization Agent" : "Schema Loader",
            isLoading: false, insightsLoading: false, currentStep: "",
            errorMessage: t("serverErrorWithStatus", `Server error: ${response.status}. Please try again.`, { status: response.status }),
          },
        }));
        setHasProcessed(false);
      }
    } catch (networkError) {
      console.error("Network or Axios error during query processing:", networkError);
      const status = networkError.response?.status;
      let userMessage = t("networkError.default", "A network error occurred. Please try again.");
      if (status) {
        userMessage = t("networkError.withStatus", `The server responded with an error (Status: {{status}}). Please try again.`, { status });
      }
      setAllRolesData((prev) => ({
        ...prev,
        [role]: {
          ...initialRoleSpecificProcessingState,
          activeTab: role === "user" ? "Visualization Agent" : "Schema Loader",
          isLoading: false, insightsLoading: false, currentStep: "",
          errorMessage: userMessage,
        },
      }));
      setHasProcessed(false);
    } finally {
      setAllRolesData((prev) => {
        const currentRoleState = prev[role] || initialRoleSpecificProcessingState;
        let finalActiveTabForDataContext = currentRoleState.activeTab;
        if (role === "user") {
          finalActiveTabForDataContext = "Visualization Agent";
        } else if (role === "admin" && (!currentRoleState.loadedTabs || currentRoleState.loadedTabs.length === 0)) {
          finalActiveTabForDataContext = "Schema Loader";
        }

        return {
          ...prev,
          [role]: {
            ...currentRoleState,
            isLoading: false,
            insightsLoading: false,
            currentStep: "",
            activeTab: finalActiveTabForDataContext,
          },
        };
      });
    }
  };

  return (
    <div className="w-full overflow-y-auto scrollbar-none px-2 sm:px-4 pt-2 pb-6">
      <div className="bg-slate-50 rounded-2xl shadow-xl max-w-5xl mx-auto border border-gray-200/80">
        <div style={{ backgroundColor: ACCENT_BROWN_COLOR }} className="h-2.5 rounded-t-xl"></div>

        {/* Container for query text area, buttons, load message, title, subtitle */}
        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: ACCENT_BROWN_COLOR }}>
              {t("title")}
            </h1>
            <p className="text-md md:text-lg text-gray-600">{t("subtitle")}</p>
          </div>

          <div className="w-full px-0 md:px-4 mt-8 mb-6">
            <textarea
              className="w-full p-4 bg-white text-gray-800 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 transition-all duration-200"
              style={{'--tw-ring-color': ACCENT_BROWN_COLOR, borderColor: allRolesData[role]?.errorMessage ? 'red' : undefined }}
              value={query}
              onChange={(e) => {
                const newQuery = e.target.value;
                setQuery(newQuery);
                setQueriesByRole((prev) => ({ ...prev, [role]: newQuery }));
                if (allRolesData[role]?.errorMessage) {
                  setAllRolesData(prev => ({...prev, [role]: {...prev[role], errorMessage: ""}}));
                }
              }}
              placeholder={t("placeholder")}
              rows={4}
            />
          </div>

          <div className="w-full px-0 md:px-4 mb-8 flex items-center justify-between">
            <div className="min-h-[2rem] text-left flex items-center">
              {allRolesData[role]?.isLoading ? (
                allRolesData[role]?.currentStep ? (
                  <div className="flex items-center gap-2.5 text-sm" style={{color: ACCENT_BROWN_COLOR}}>
                    <FiLoader className="animate-spin text-lg" />
                    <span>{allRolesData[role]?.currentStep} ({t("loading")}...)</span>
                  </div>
                ) : (
                  <div className="font-semibold flex items-center gap-2 text-sm" style={{color: ACCENT_BROWN_COLOR}}>
                    {t("fetching")}...
                    <CgSpinner className="animate-spin text-xl" />
                  </div>
                )
              ) : allRolesData[role]?.errorMessage ? (
                <div
                  className="px-3 py-1.5 rounded-md font-medium text-sm shadow-sm inline-block"
                  style={{ color: ACCENT_BROWN_COLOR, backgroundColor: ERROR_MESSAGE_BG_COLOR, border: `1px solid ${ACCENT_BROWN_COLOR}20` }}
                >
                  {allRolesData[role]?.errorMessage}
                </div>
              ) : role === "admin" && hasProcessed && allRolesData[role]?.totalExecutionTime ? (
                <p className="text-sm" style={{ color: ACCENT_BROWN_COLOR }}>
                  {t("executionTime")}: {allRolesData[role]?.totalExecutionTime} sec
                </p>
              ) : null }
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleProcess}
                disabled={allRolesData[role]?.isLoading || query.trim() === ""}
                style={{
                  backgroundColor: (allRolesData[role]?.isLoading || query.trim() === "") ? ACCENT_BROWN_DISABLED_COLOR : ACCENT_BROWN_COLOR,
                }}
                className={`px-6 py-2.5 rounded-lg text-white font-medium flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-px`}
                onMouseOver={(e) => { if (!(allRolesData[role]?.isLoading || query.trim() === "")) e.currentTarget.style.backgroundColor = ACCENT_BROWN_HOVER_COLOR; }}
                onMouseOut={(e) => { if (!(allRolesData[role]?.isLoading || query.trim() === "")) e.currentTarget.style.backgroundColor = ACCENT_BROWN_COLOR; }}
              >
                {allRolesData[role]?.isLoading ? (
                  <FiLoader className="animate-spin" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z" clipRule="evenodd" />
                  </svg>
                )}
                {allRolesData[role]?.isLoading ? t("processing") : t("processButton")}
              </button>

              <button
                onClick={() => {
                  setQuery("");
                  setQueriesByRole(prev => ({...prev, [role]: ""}));
                  setIsOpen(false);
                  setSelectedTab(null);
                  setAllRolesData((prev) => ({
                    ...prev,
                    [role]: {
                      ...initialRoleSpecificProcessingState,
                      activeTab: role === "user" ? "Visualization Agent" : "Schema Loader",
                    },
                  }));
                  setHasProcessed(false);
                }}
                style={{ borderColor: ACCENT_BROWN_COLOR, color: ACCENT_BROWN_COLOR }}
                className="px-6 py-2.5 border-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-px"
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = ACCENT_BROWN_LIGHT_BG_COLOR }
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {t("clearButton")}
              </button>
            </div>
          </div>
        </div>
        {/* End of the container for query, buttons, etc. */}

        {/* TabsContent is now a direct child of the main card, sibling to the container above */}
      
      </div>
      <div>
          {/* It has its own padding and margin for layout within the card */}
          {hasProcessed && (
          <div className="mt-8 px-6 md:px-8 pb-6 md:pb-8">
            <TabsContent
              // UI props for admin dropdowns in TabsContent
              adminDropdownActiveTab={selectedTab} // Which admin agent dropdown is targeted
              isAdminDropdownOpen={isOpen}      // Is any admin dropdown open
              toggleAdminDropdown={toggleDropdown} // Function to call when admin agent button is clicked

              // Data props derived from MainContent's state (allRolesData[role])
              sqlQuery={allRolesData[role]?.sqlQuery}
              language={selectedLanguage}
              suggestedVisualization={allRolesData[role]?.suggestedVisualization}
              queryResult={allRolesData[role]?.queryResult || []}
              insights={allRolesData[role]?.insights}
              insightsLoading={allRolesData[role]?.insightsLoading}
              rows={(allRolesData[role]?.queryResult || []).length}
              columns={allRolesData[role]?.queryResult?.[0] ? Object.keys(allRolesData[role].queryResult[0]).length : 0}
              hasProcessed={hasProcessed} // Main flag indicating a query has been processed
              decomposerJson={allRolesData[role]?.decomposerJson} // Pass this down
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;