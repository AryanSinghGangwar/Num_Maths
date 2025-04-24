import { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  notifications: boolean;
  setNotifications: (value: boolean) => void;
  precision: number;
  setPrecision: (value: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [precision, setPrecision] = useState(4);

  return (
    <SettingsContext.Provider
      value={{
        darkMode,
        setDarkMode,
        notifications,
        setNotifications,
        precision,
        setPrecision,
      }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}