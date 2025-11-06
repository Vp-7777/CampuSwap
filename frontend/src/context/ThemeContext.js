import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

const getSystemPrefersDark = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem('theme') || 'system');
  const isDark = useMemo(() => {
    if (mode === 'dark') return true;
    if (mode === 'light') return false;
    return getSystemPrefersDark();
  }, [mode]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add('dark'); else root.classList.remove('dark');
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  const cycle = () => setMode((m) => (m === 'system' ? 'light' : m === 'light' ? 'dark' : 'system'));

  return (
    <ThemeContext.Provider value={{ mode, setMode, isDark, cycle }}>
      {children}
    </ThemeContext.Provider>
  );
};
