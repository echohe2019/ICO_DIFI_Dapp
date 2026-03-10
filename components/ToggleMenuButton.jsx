import React from "react";
import {FiMenu, FiX} from "react-icons/fi";

const ToggleMenuButton = ({
                              isDarkMode,
                              isOpen,
                              toggleMenu,
                          }) => {
    return (

        <button
            onClick={toggleMenu}
            className={`focus:outline-none ${isDarkMode ? "text-fuchsia-500" : "text-indigo-500"}`}
            aria-label="Toggle menu"
        >
            {isOpen ? <FiX size={24}/> : <FiMenu size={24}/>}
        </button>
    );
};
export default ToggleMenuButton;
