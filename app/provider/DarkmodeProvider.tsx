'use client';

import { createContext, useContext, useEffect, useState } from "react";

type DarkmodeContextType = {
    darkMode: Boolean;
    toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkmodeContextType | undefined>(undefined);

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

    //Checamos el estado inicial de acuerdo al dispositivo
    useEffect(() => {
        //Checamos LocalStorage para buscar la preferencia del sistema
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        //Validamos sea el caso de preferencia modo oscuro
        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)){
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
        setMounted(true); //Indicamos que montamos ya el estado
    }, []); //Hacemos que se active cada que se inicie la página

    const toggleDarkMode = () => {
        //Básicamente simplemente cambiamos el estado actual de darkmode en el sistema
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);

        //Y luego validamos y dependiendo de ese booleano aplicamos cambios visuales
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    //Para prevenir problemas de flashlight
    if (!mounted){
        return null;
    }

    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}
