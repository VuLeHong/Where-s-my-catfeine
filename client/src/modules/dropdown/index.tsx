"use client";

import { useState } from "react";

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    console.log("Logout");
  };

  const handleFavorites = () => {
    console.log("Favorites");
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="bg-gray-100 p-2 rounded-full shadow-md flex flex-col justify-center items-center space-y-1"
      >
        <div className="w-6 h-1 bg-gray-700"></div>
        <div className="w-6 h-1 bg-gray-700"></div>
        <div className="w-6 h-1 bg-gray-700"></div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-2">
            <button
              onClick={handleFavorites}
              className="w-full text-left p-2 text-gray-700 hover:bg-gray-100"
            >
              Favorites
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left p-2 text-red-500 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
