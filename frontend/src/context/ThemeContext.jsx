import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('fieldops_theme') === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('fieldops_theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const value = useMemo(() => ({ darkMode, toggleTheme: () => setDarkMode((prev) => !prev) }), [darkMode])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
