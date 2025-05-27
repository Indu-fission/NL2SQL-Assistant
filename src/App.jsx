import { useState, useEffect } from "react";
import Sidebar from "./Components/Sidebar";
import MainContent from "./Components/MainContent";
import Header from "./Components/Header";
import "./i18n";
import { useTranslation } from "react-i18next";
import { AppContext } from "./Components/context/AppContext";

function App() {
  const [query, setQuery] = useState("");
  const [resultData, setResultData] = useState([]);
  const [visualizationType, setVisualizationType] = useState("Table");
  const [role, setRole] = useState("admin");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true); // ✅ Define here
  const [hasProcessed, setHasProcessed] = useState(false);

  const [queryHistory, setQueryHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("queryHistory") || "[]");
  });
  const [autoRun, setAutoRun] = useState(false);

  const { i18n } = useTranslation();
  const selectedLanguage = i18n.language;

  const handleProcessFromSidebar = (selectedQuery) => {
    setQuery(selectedQuery);
    setTimeout(() => {
      setAutoRun(true);
    }, 0);
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("queryHistory") || "[]");
    setQueryHistory(stored);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleAdminToggle = (newMode) => {
    setRole(newMode ? "admin" : "user");
    setIsAdmin(newMode);
    setHasProcessed(false); // Reset when switching roles
  };
  const handleQuerySubmit = async () => {
    await new Promise((r) => setTimeout(r, 1500));
    setResultData([
      { Name: "Alice", Age: 28 },
      { Name: "Bob", Age: 34 },
    ]);
  };

  const handleClearResults = () => {
    if (query.trim()) {
      const updated = [...queryHistory, query.trim()];
      setQueryHistory(updated);
      localStorage.setItem("queryHistory", JSON.stringify(updated));
    }

    setQuery("");
    setResultData([]);
  };

  return (
    <AppContext.Provider value={{ role, setRole }}>
      <div className="flex h-screen bg-white">
        <Sidebar
          isOpen={sidebarOpen}
          queryHistory={queryHistory}
          setQueryHistory={setQueryHistory}
          handleProcess={handleProcessFromSidebar}
        />

        <div className="flex-1 relative">
          <Header
            toggleSidebar={toggleSidebar}
            isAdmin={isAdmin}
            setIsAdmin={handleAdminToggle}
          />

          <main
            className={`transition-all duration-300 ease-in-out min-h-screen pt-24 px-6 ${
              sidebarOpen ? "ml-80" : "ml-0"
            }`}
          >
            <MainContent
              query={query}
              setQuery={setQuery}
              onSubmit={handleQuerySubmit}
              onClear={handleClearResults}
              isSidebarOpen={sidebarOpen}
              setQueryHistory={setQueryHistory}
              autoRun={autoRun}
              setAutoRun={setAutoRun}
              language={selectedLanguage}
              isAdmin={isAdmin}
              hasProcessed={hasProcessed} // ✅ pass down
              setHasProcessed={setHasProcessed}
            />
          </main>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
