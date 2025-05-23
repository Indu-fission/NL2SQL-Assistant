// import React from "react";
// import logoRight from "../../public/NL2SALlogo.png";
// import logoLeft from "../../public/NL2SQLsublogo.png";

// export default function Header({ toggleSidebar }) {
//   return (
//     <header className="flex items-center justify-between p-4 border-b border-gray-300 bg-white fixed w-full top-0 left-0 z-20">
//       <div className="flex items-center space-x-4 md:space-x-6">
//         {/* Hamburger icon */}
//         <button onClick={toggleSidebar} aria-label="Toggle Sidebar" className="text-2xl focus:outline-none">
//           &#9776;
//         </button>

//         {/* Left Logo */}
//         <img
//           src={logoLeft}
//           alt="Left Logo"
//           className="max-h-12 md:max-h-16 lg:max-h-20 w-auto" // Adjusted max-height for different screen sizes
//         />

//         {/* Title */}
//         <h1 className="text-xl md:text-2xl font-semibold">NL2SQL Assistant</h1>
//       </div>

//       {/* Right Logo */}
//       <img
//         src={logoRight}
//         alt="Right Logo"
//         className="max-h-12 md:max-h-16 lg:max-h-20 w-auto" // Adjusted max-height for different screen sizes
//       />
//     </header>
//   );
// }

import React from "react";
import logoRight from "../../public/FCSCLogo.svg";
import logoLeft from "../../public/MOCA Eng Logo-01.svg";

export default function Header({ toggleSidebar }) {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-300 bg-white fixed w-full h-20 top-0 left-0 z-20">


      <div className="flex items-center space-x-4 md:space-x-6">

        <button onClick={toggleSidebar} aria-label="Toggle Sidebar" className="text-2xl focus:outline-none">
          &#9776;
        </button>

        <img
          src={logoLeft}
          alt="Left Logo"
          className="max-h-12 md:max-h-16 lg:max-h-24"
          style={{ maxWidth: '170px', width: '170px' }}
        />



        <h1
          className="text-xl md:text-2xl font-semibold whitespace-nowrap"
          style={{ color: '#b58932' }}
        >
          NL2SQL Assistant
        </h1>

      </div>


      <img
        src={logoRight}
        alt="Right Logo"
        className="max-h-12 md:max-h-16 lg:max-h-20"
        style={{ maxWidth: '170px', width: '170px' }}
      />

    </header>
  );
}