import React, { useEffect, useState } from "react";
import Head from "next/head";
import { Header, HeroSection } from "@/components/HomePage";

const TOKEN_NAME = process.env.NEXT_PUBLIC_TOKEN_NAME;
const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // 初始化主题
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // 从本地存储获取保存的主题设置
      const savedMode = localStorage.getItem("darkMode");

      // 检测系统主题偏好
      let systemPrefersDark = false;
      try {
        systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
      } catch (error) {
        console.warn("Error detecting system theme:", error);
        systemPrefersDark = false;
      }

      // 确定最终主题：本地存储优先，其次系统偏好，默认深色
      const shouldUseDarkMode =
        savedMode === "false"
          ? false
          : savedMode === "true"
            ? true
            : systemPrefersDark;

      // 应用主题
      setIsDarkMode(shouldUseDarkMode);
      applyTheme(shouldUseDarkMode);

      // 监听系统主题变化
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => {
        if (!localStorage.getItem("darkMode")) {
          // 只有在没有本地存储设置时才响应系统变化
          setIsDarkMode(e.matches);
          applyTheme(e.matches);
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } catch (error) {
      console.error("Error initializing theme:", error);
      // 出错时默认使用深色主题
      setIsDarkMode(true);
      applyTheme(true);
    }
  }, []);

  // 应用主题的函数
  const applyTheme = (dark) => {
    if (typeof window === "undefined") return;

    if (dark) {
      document.documentElement.classList.add("dark");
      document.documentElement.style.backgroundColor = "#000";
      document.documentElement.style.color = "#fff";
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.backgroundColor = "#fff";
      document.documentElement.style.color = "#000";
    }
  };

  // 切换主题的函数
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (typeof window !== "undefined") {
      // 保存到本地存储
      localStorage.setItem("darkMode", newMode.toString());
      // 应用主题
      applyTheme(newMode);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-black text-white" : "bg-white text-gray-800"}`}
    >
      <Head>
        <title>
          {TOKEN_NAME
            ? `${TOKEN_NAME} - Bridging AI with Decentralization`
            : "LINKTUM - Bridging AI with Decentralization"}
        </title>
        <link rel="icon" href="/logo.png" />
      </Head>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main>
        <HeroSection isDarkMode={isDarkMode} />
      </main>
    </div>
  );
};

export default Home;
