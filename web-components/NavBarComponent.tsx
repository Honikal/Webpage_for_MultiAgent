'use client';

import { Cog8ToothIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useDarkMode } from '@/app/provider/DarkmodeProvider';

export const NavBar = () => {
    const {darkMode, toggleDarkMode} = useDarkMode();

    return (
        <nav className='sticky top-0 z-50 bg-background border-b border-gray-200 dark:border-gray-800 shadow-sm'>
            <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
                <div>
                    <h1 className='text-xl font-bold duration-200'>AI-MA homeworks</h1>
                </div>

                <div className='flex items-center gap-4'>
                    <button
                        onClick={toggleDarkMode}
                        className='cursor-pointer'
                        aria-label="Toggle dark mode"    
                    >
                        {darkMode ? (
                            <MoonIcon className='size-12 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors'/>
                        ) : (
                            <SunIcon className='size-12 text-yellow-500 hover:text-yellow-600 transition-colors'/>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    )
}