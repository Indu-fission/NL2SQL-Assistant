import React, { useState, useRef, useEffect,useContext } from "react";
import { useTranslation } from 'react-i18next';
import logoRight from "../../public/FCSCLogo.svg";
import logoLeft from "../../public/MOCA Eng Logo-01.svg";
import languageIcon from "../../public/language icon.png";
import { AppContext } from "./context/AppContext";



export default function Header({ toggleSidebar, isAdmin, setIsAdmin }) {
  const { i18n } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const {setRole}=useContext(AppContext)

  const dropdownRef = useRef(null);

  const handleLanguageClick = () => setShowDropdown((prev) => !prev);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setShowDropdown(false);
  };
const handleToggle = () => {
  const newMode = !isAdmin;
  setIsAdmin(newMode);  // calls the handler from App that updates both role and isAdmin
};


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-300 bg-white fixed w-full h-20 top-0 left-0 z-20">
      <div className="flex items-center space-x-4 md:space-x-6">
        <button onClick={toggleSidebar} aria-label="Toggle Sidebar" className="text-2xl focus:outline-none">
          &#9776;
        </button>

        <img src={logoLeft} alt="Left Logo" className="max-h-12 md:max-h-16 lg:max-h-24" style={{ maxWidth: "170px", width: "170px" }} />
        <h1 className="text-xl md:text-2xl font-semibold whitespace-nowrap" style={{ color: "#b58932" }}>
          NL2SQL Assistant
        </h1>
      </div>

      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        {/* Admin/User Toggle */}
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${!isAdmin ? 'text-gray-900' : 'text-gray-400'}`}>User</span>

          <button
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${isAdmin
                ? 'bg-[#b58932] focus:ring-[#b58932]'
                : 'bg-[#b58932] focus:ring-[#b58932]' // vibrant blue for user
              }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAdmin ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
          </button>

          <span className={`text-sm font-medium ${isAdmin ? 'text-gray-900' : 'text-gray-400'}`}>Admin</span>
        </div>

        {/* Language Selector */}
        <div className="relative">
          <img src={languageIcon} alt="Language" onClick={handleLanguageClick} className="cursor-pointer w-6 h-6" />
          {showDropdown && (
            <div className="absolute left-1/2 top-full mt-2 transform -translate-x-1/2 bg-white border border-gray-300 shadow-md rounded-md z-10">
              <ul className="text-sm">
                <li onClick={() => handleLanguageChange('en')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">English</li>
                <li onClick={() => handleLanguageChange('ar')} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Arabic</li>
              </ul>
            </div>
          )}
        </div>

        <img src={logoRight} alt="Right Logo" className="max-h-12 md:max-h-16 lg:max-h-20" style={{ maxWidth: "170px", width: "170px" }} />
      </div>
    </header>
  );
}