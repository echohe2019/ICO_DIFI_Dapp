import {useState, useEffect, useRef} from "react";
import Link from "next/link";
import {FiChevronDown, FiX} from "react-icons/fi";
import {RiWallet3Line} from "react-icons/ri";
import CustomConnectButton from "@/components/Global/CustomConnectButton";
import ToggleThemButton from "@/components/ToggleThemButton";

const TOKEN_NAME = process.env.NEXT_PUBLIC_TOKEN_NAME;
const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL;
const EXPLORER_ADDRESS_URL = process.env.NEXT_PUBLIC_EXPLORER_ADDRESS_URL;
const LINKTUM_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_LINKTUM_ADDRESS;
import {homePageData, linkData, menuItems} from "@/components/homePageData";
import {HEADER_1} from "@/components/Global/SVG";
import MobileAccordionItem from "@/components/MobileAccordionItem";
import ToggleMenuButton from "@/components/ToggleMenuButton";

const Header = ({isDarkMode, toggleDarkMode}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isHeaderSticky, setIsHeaderSticky] = useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);

    const timeoutRef = useRef(null);
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMegaMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMenuLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveMegaMenu(null);
        }, 300);
    };
    const handleMenuHover = (title) => {
        clearTimeout(timeoutRef.current);
        setActiveMegaMenu(title);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.pageYOffset > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const headerClasses = `w-full transition-all duration-500 ease-in-out ${
        isDarkMode
            ? "bg-[#0e0b12]/95 backdrop-blur-md"
            : "bg-white/95 backdrop-blur-md"
    } ${
        isHeaderSticky
            ? "fixed top-0 left-0 z-50 w-full shadow-lg animate-slowSlideDown border-b"
            : "relative border-b"
    } ${isDarkMode ? "border-gray-800/50" : "border-gray-200/50"}`;

    // Mega menu content

    return (
        <>
            {isHeaderSticky && <div className="h-[90px] md:h-[98px]">Header</div>}
            <header
                className={`transition-all duration-500 ease-out fixed top-0 left-0 z-50 shadow-lg w-full animate-slowSlideDown ${isDarkMode ? "bg-[#oe0b12]/95 backdrop-blur-md border-gray-800/50 " : "bg-white/95 backdrop-blur-md border-gray-200/50"}`}
                ref={menuRef}
            >
                {!isScrolled && (
                    <div className="relative py-3 overflow-hidden whitespace-nowrap">
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white z-0"/>
                        <div
                            className="absolute inset-0 z-0 opacity-20"
                            style={{
                                backgroundImage:
                                    "radial-gradient(circle,rgba(255, 255, 255, 0.15) 1px,transparent 1px),radial-gradient(circle,rgba(255, 255, 255, 0.1) 1px,transparent 1px)",
                                backgroundSize: "20px 20px 30px 30px",
                                backgroundPosition: "0 0, 15px 15px",
                            }}
                        />
                        <div className="animate-marquee inline-block whitespace-nowrap text-white relative z-10">
              <span className="mx-4 text-sm md:text-base">
                {TOKEN_NAME}({TOKEN_SYMBOL}) PreSale is NOW LIVE! Be part of the
                future-claim your discounted tokens and exclusive access to AI
                blockchain technology.
                <span className="mx-1">🌍</span>
                Don&apos;t wait,join the innovation wave today!
                <span className="ml-1">🔥</span>
              </span>
                        </div>
                    </div>
                )}
                <div className="container max-w-full w-full px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center group">
                            <div className="relative w-10 h-10 mr-3 overflow-hidden">
                                <div className="absolute inset-0"></div>
                                <div className="absolute inset-1 flex items-center justify-center">
                                    <img
                                        src="/logo.png"
                                        alt="Logo"
                                        className="w-8 h-8 object-contain"
                                    />
                                </div>
                            </div>
                            <span
                                className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-600 animate-gradient-x">
                {TOKEN_NAME}
              </span>
                        </Link>
                    </div>
                    <nav className="hidden lg:flex items-center space-x-6">
                        {homePageData(isDarkMode).map((menu, menuIndex) => (
                            <div
                                key={menuIndex + Math.random()}
                                className="relative group"
                                onMouseEnter={() => handleMenuHover(menu.title)}
                                onMouseLeave={handleMenuLeave}
                            >
                                <button
                                    className={`flex items-center space-x-1 py-2 px-1 transition-colors ${isDarkMode ? "text-gray-300 hover:text-fuchsia-500" : "text-gray-700 hover:text-teal-600"} ${activeMegaMenu === menu.title ? "text-fuchsia-500" : ""}`}
                                    onClick={() =>
                                        setActiveMegaMenu(
                                            activeMegaMenu === menu.title ? null : menu.title,
                                        )
                                    }
                                >
                                    <span>{menu.title}</span>
                                    <FiChevronDown
                                        className={`transition-transform duration-300 ${activeMegaMenu === menu.title ? "rotate-180" : ""}`}
                                    />
                                </button>
                            </div>
                        ))}
                        {linkData.map((link, linkIndex) => (
                            <Link href={link.href} key={linkIndex + Math.random()} target='_blank'
                                  className={`py-2 px-1 transition-colors ${isDarkMode ? "text-gray-300 hover:text-fuchsia-500" : "text-gray-700 hover:text-teal-600"}`}>{link.label}</Link>
                        ))}
                    </nav>
                    <div className="hidden lg:flex items-center space-x-4">
                        <ToggleThemButton
                            isDarkMode={isDarkMode}
                            toggleDarkMode={toggleDarkMode}
                        />
                        <a href="/dashboard" className="group">
                            <div
                                className="w-10 h-10 bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105">
                                <span className="text-white">{HEADER_1}</span>
                            </div>
                        </a>
                        <CustomConnectButton active={true}/>
                    </div>
                    <div className="flex lg:hidden justify-center items-center space-x-4">
                        <ToggleThemButton
                            isDarkMode={isDarkMode}
                            toggleDarkMode={toggleDarkMode}
                            isOpen={isOpen}
                            toggleMenu={toggleMenu}
                        />
                        <ToggleMenuButton toggleMenu={toggleMenu} isOpen={isOpen} isDarkMode={isDarkMode}/>
                    </div>
                </div>


                {homePageData(isDarkMode).map((menu, menuKey) => {
                    return (
                        <div
                            key={menuKey}
                            className={`absolute left-0 w-full transition-all duration-300 transform ${
                                activeMegaMenu === menu.title
                                    ? "opacity-100 translate-y-0 pointer-events-auto"
                                    : "opacity-0 -translate-y-2 pointer-events-none"
                            } ${
                                isDarkMode
                                    ? "bg-[#14101a]/95 backdrop-blur-md"
                                    : "bg-white/95 backdrop-blur-md border-gray-200/50"
                            }`}
                            onMouseEnter={() => handleMenuHover(menu.title)}
                            onMouseLeave={handleMenuLeave}
                        >
                            <div className="container max-auto py-8 px-4">
                                <div
                                    className="grid grid-cols-1 sm:grid-cols-2
                     md:grid-cols-3 lg:grid-cols-4 gap-6"
                                >
                                    {menu.columns.map((column, idx) => (
                                        <div key={idx} className="space-x-4">
                                            <h3
                                                className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                                            >
                                                {column.title}
                                            </h3>
                                            <ul className="space-y-2">
                                                {column.links.map((link, linkIdx) => (
                                                    <li key={linkIdx}>
                                                        <Link
                                                            href={link.href}
                                                            target="_blank"
                                                            className={`flex items-center space-x-2 py-1 transition-colors duration-200 ${
                                                                isDarkMode
                                                                    ? "text-gray-300 hover:text-fuchsia-500"
                                                                    : "text-gray-700 hover:text-teal-600"
                                                            }`}
                                                            onClick={() => setActiveMegaMenu(null)}
                                                        >
                                                            <span className="text-lg">{link.icon}</span>
                                                            <span>{link.label}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                    <div className={`rounded-xl p-6 ${menu.featuredBox.bgClass}`}>
                                        <h3
                                            className={`text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-600`}
                                        >
                                            {menu.featuredBox.title}
                                        </h3>
                                        <p
                                            className={`text-sm mb-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                                        >
                                            {menu.featuredBox.description}
                                        </p>
                                        <Link
                                            href={menu.featuredBox.linkUrl}
                                            target="_blank"
                                            className="inline-block items-center space-x-1 font-medium bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-600"
                                            onClick={() => setActiveMegaMenu(null)}
                                        >
                                            <span>{menu.featuredBox.linkText}</span>
                                            <span>→</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div className={`lg:hidden fixed inset-y-0 z-50 left-0 w4/5 max-w-xs transition-transform duration-300 ease-in-out ${
                        isOpen ? "translate-x-0" : "-translate-x-full"
                    } ${
                        isDarkMode
                            ? "bg-[#14101a] border-r border-gray-800/50"
                            : "bg-white border-r border-gray200/50"
                    }`}
                    style={{
                        height: "100vh",
                        overflow: "auto",
                    }}
                >
                    <div
                        className={`p-5 border-b ${isDarkMode ? "border-gray-800/50" : "border-gray-200/50"} flex justify-between items-center space-x-4`}
                    >
                        <Link
                            href="/"
                            className="flex items-center"
                            onClick={() => setIsOpen(false)}
                        >
                            <div className="relative w-10 h-10 mr-3 overflow-hidden">
                                <div className="absolute inset-0"></div>
                                <div className="absolute inset-1 flex items-center justify-center">
                                    <img
                                        src="/logo.png"
                                        alt="logo"
                                        className="w-6 h-6 object-contain"
                                    />
                                </div>
                            </div>
                            <span
                                className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-purple-600 animate-gradient-x'>{TOKEN_NAME}</span>
                        </Link>
                        <button onClick={toggleMenu}
                                className={`focus:outline-none ${isDarkMode ? "text-fuchsia-500" : "to-purple-600"}`}
                                aria-label='Close menu'>
                            <FiX size={24}/>
                        </button>
                    </div>
                    <div className='p-5'>
                        <nav className='flex flex-col'>
                            {menuItems.map((menuItem, idx) => (
                                <MobileAccordionItem key={idx + Math.random()} title={menuItem.title}
                                                     isDarkMode={isDarkMode} items={menuItem.items}
                                                     toggleMenu={toggleMenu}/>
                            ))}
                            {linkData.map((link, idx) => (
                                <Link key={idx + Math.random()} href={link.href} target="_blank"
                                      className={`flex items-center space-x-2 py-4 border-b ${isDarkMode ? "border-gray-800/50 text-gray-300 hover:text-fuchsia-500" : "border-gray-200/50 text-gray-700 hover:text-fuchsia-600"}`}>
                                    <span className="text-lg">{link.icon}</span>
                                    <span>{link.title}</span>
                                </Link>
                            ))}
                            <div className='mt-8'>
                                <CustomConnectButton/>
                            </div>
                        </nav>
                    </div>
                </div>
                {isOpen && (
                    <div
                        className='md:hidden fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300'
                        onClick={toggleMenu}></div>
                )}
            </header>

            <style jsx>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(100%);
                    }
                    100% {
                        transform: translateX(-100%);
                    }

                .animate-marquee {
                    animation: marquee 20s linear infinite;
                    display: inline-block;
                }

                }
            `}</style>
        </>
    );
};

export default Header;
