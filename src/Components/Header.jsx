import React from "react";

export default function Header({ toggleSidebar }) {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-300 bg-white fixed w-full top-0 left-0 z-20">
      <div className="flex items-center space-x-3">
        {/* Hamburger icon */}
        <button onClick={toggleSidebar} aria-label="Toggle Sidebar" className="text-2xl focus:outline-none">
          &#9776;
        </button>

        {/* Left Logo */}
        <img src="/NL2SQLsublogo.png" alt="Left Logo" className="h-8 w-auto" />

        {/* Title */}
        <h1 className="text-xl font-semibold">NL2SQL Assistant</h1>
      </div>

      {/* Right Logo */}
      <img src="/NL2SALlogo.png" alt="Right Logo" className="h-8 w-auto" />
    </header>
  );
}