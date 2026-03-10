import React from "react";
import { FiMoon, FiSun} from "react-icons/fi";

const ToggleThemButton = ({
  isDarkMode,
  toggleDarkMode,
}) => {
  return (
      <button
        onClick={toggleDarkMode}
        className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white" : "bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white"}`}
        aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>

  );
};
export default ToggleThemButton;
