// import React, { useState, useRef, useEffect } from "react";
// import logoRight from "../../public/FCSCLogo.svg";
// import logoLeft from "../../public/MOCA Eng Logo-01.svg";
// import languageIcon from "../../public/language icon.png";

// export default function Header({ toggleSidebar }) {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const dropdownRef = useRef(null);

//   const handleLanguageClick = () => {
//     setShowDropdown((prev) => !prev);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <header className="flex items-center justify-between p-4 border-b border-gray-300 bg-white fixed w-full h-20 top-0 left-0 z-20">
//       <div className="flex items-center space-x-4 md:space-x-6">
//         <button
//           onClick={toggleSidebar}
//           aria-label="Toggle Sidebar"
//           className="text-2xl focus:outline-none"
//         >
//           &#9776;
//         </button>

//         <img
//           src={logoLeft}
//           alt="Left Logo"
//           className="max-h-12 md:max-h-16 lg:max-h-24"
//           style={{ maxWidth: "170px", width: "170px" }}
//         />

//         <h1
//           className="text-xl md:text-2xl font-semibold whitespace-nowrap"
//           style={{ color: "#b58932" }}
//         >
//           NL2SQL Assistant
//         </h1>
//       </div>

//       <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
//         {/* Language icon with dropdown below */}
//         <div className="relative">
//           <img
//             src={languageIcon}
//             alt="Language"
//             onClick={handleLanguageClick}
//             className="cursor-pointer w-6 h-6"
//           />
//           {showDropdown && (
//             <div className="absolute left-1/2 top-full mt-2 transform -translate-x-1/2 bg-white border border-gray-300 shadow-md rounded-md z-10">
//               <ul className="text-sm">
//                 <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">English</li>
//                 <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Arabic</li>
//               </ul>
//             </div>
//           )}
//         </div>

//         <img
//           src={logoRight}
//           alt="Right Logo"
//           className="max-h-12 md:max-h-16 lg:max-h-20"
//           style={{ maxWidth: "170px", width: "170px" }}
//         />
//       </div>
//     </header>
//   );
// }


import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import logoRight from "../../public/FCSCLogo.svg";
import logoLeft from "../../public/MOCA Eng Logo-01.svg";
import languageIcon from "../../public/language icon.png";

export default function Header({ toggleSidebar }) {
  const { i18n } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLanguageClick = () => setShowDropdown((prev) => !prev);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setShowDropdown(false);
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