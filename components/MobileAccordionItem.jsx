import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import Link from "next/link";

const MobileAccordionItem = ({ title, items, isDarkMode, toggleMenu }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`border-b ${isDarkMode ? "border-gray-800/50" : "border-gray-200/50"}`}
    >
      <button
        className={`flex items-center justify-between w-full py-4 ${isDarkMode ? "border-gray-300" : "text-gray-700"}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-expanded={isOpen}
      >
        <span className="flex items-center space-x-2">
          <FiChevronDown
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
          />
          <span>{title}</span>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96" : "max-h-0"}`}
      >
        <div className="pl-6 pb-2 space-y-2">
          {items.map((item, index) => (
            <Link
              href={item.href}
              key={index + Math.random()}
              target="_blank"
              className={`flex items-center space-x-2 py-3 ${isDarkMode ? "text-gray-400 hover:text-fuchsia-500" : "text-gray-600 hover:text-teal-600"} transition-colors`}
              onClick={() => {
                toggleMenu();
                setIsOpen(!isOpen);
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
export default MobileAccordionItem;
